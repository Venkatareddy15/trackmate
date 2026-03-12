const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const axios = require('axios');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role, phone, upiId } = req.body;

        if (role === 'ADMIN') {
            return res.status(401).json({ message: 'Unauthorized: Admin accounts cannot be created publicly.' });
        }

        let user = await User.findOne({ email });

        if (user) {
            if (user.role.includes(role)) {
                return res.status(400).json({ message: 'Account already active with this role. Please login.' });
            }
            user.role.push(role);
            if (phone) user.phone = phone;
            if (upiId) user.upiId = upiId;
            await user.save();
        } else {
            user = await User.create({
                name,
                email,
                password,
                role: [role || 'PASSENGER'],
                phone,
                upiId
            });
        }

        if (user) {
            setImmediate(() => {
                try {
                    const { sendWelcomeEmail } = require('../utils/emailService');
                    sendWelcomeEmail(email, name).catch(() => {});
                } catch (err) {}
            });

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone || '',
                upiId: user.upiId || '',
                role: role,
                roles: user.role,
                token: generateToken(user._id)
            });
        }
    } catch (error) {
        console.error('[REGISTER] Error:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// Google Auth - FIXED
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google', async (req, res) => {
    try {
        const { token, role, isAccessToken } = req.body;
        
        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }

        let name, email, picture, googleId;

        try {
            if (isAccessToken) {
                const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { 'Authorization': `Bearer ${token}` },
                    timeout: 8000
                });
                
                name = response.data.name || 'User';
                email = response.data.email;
                picture = response.data.picture || '';
                googleId = response.data.sub;
            } else {
                const ticket = await googleClient.verifyIdToken({
                    idToken: token,
                    audience: process.env.GOOGLE_CLIENT_ID,
                });
                const payload = ticket.getPayload();
                
                name = payload.name || 'User';
                email = payload.email;
                picture = payload.picture || '';
                googleId = payload.sub;
            }
        } catch (verifyError) {
            console.error('[GOOGLE] Token verification failed:', verifyError.message);
            return res.status(401).json({
                message: 'Invalid Google token',
                error: verifyError.message
            });
        }

        if (!email) {
            return res.status(400).json({ message: 'Google account must have an email' });
        }

        const AUTHORIZED_ADMIN = process.env.ADMIN_EMAIL;
        if (role === 'ADMIN' && (!AUTHORIZED_ADMIN || email.toLowerCase() !== AUTHORIZED_ADMIN.toLowerCase())) {
            return res.status(401).json({ message: 'Unauthorized: Admin accounts cannot be created publicly' });
        }

        let user = await User.findOne({ email });
        let isNewUser = false;
        let activeRole = role || 'PASSENGER';

        if (!user) {
            user = await User.create({
                name,
                email,
                password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8),
                role: [activeRole],
                profileImage: picture,
                googleId,
                isVerified: true,
                phone: '',
                upiId: '',
                trustScore: 100,
                ratingAvg: 5.0,
                carbonSaved: 0,
                rideCredits: 0,
                loyaltyPoints: 0,
                level: 'Green Newbie'
            });
            
            isNewUser = true;

            setImmediate(() => {
                try {
                    const { sendWelcomeEmail } = require('../utils/emailService');
                    sendWelcomeEmail(email, name).catch(() => {});
                } catch (err) {}
            });
        } else {
            let needsUpdate = false;
            let updateData = {};
            
            if (!user.googleId) {
                updateData.googleId = googleId;
                needsUpdate = true;
            }

            if (picture && picture !== user.profileImage) {
                updateData.profileImage = picture;
                needsUpdate = true;
            }

            if (role && !user.role.includes(role)) {
                updateData.role = [...user.role, role];
                needsUpdate = true;
            }

            if (needsUpdate) {
                await User.updateOne({ _id: user._id }, updateData);
            }

            if (role && user.role.includes(role)) {
                activeRole = role;
            } else if (role && updateData.role) {
                activeRole = role;
            } else {
                activeRole = user.role[0];
            }
        }

        if (AUTHORIZED_ADMIN && email.toLowerCase() === AUTHORIZED_ADMIN.toLowerCase()) {
            if (!user.role.includes('ADMIN')) {
                await User.updateOne({ _id: user._id }, { $push: { role: 'ADMIN' } });
            }
            activeRole = 'ADMIN';
        }

        const responseData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            upiId: user.upiId || '',
            role: activeRole,
            roles: user.role,
            profileImage: user.profileImage || '',
            verified: user.isVerified || false,
            trustScore: user.trustScore || 100,
            ratingAvg: user.ratingAvg || 5.0,
            carbonSaved: user.carbonSaved || 0,
            rideCredits: user.rideCredits || 0,
            loyaltyPoints: user.loyaltyPoints || 0,
            level: user.level || 'Green Newbie',
            createdAt: user.createdAt,
            isNewUser,
            token: generateToken(user._id)
        };

        res.json(responseData);
    } catch (error) {
        console.error('[GOOGLE_AUTH] Unexpected error:', error);
        res.status(500).json({
            message: 'Google authentication failed',
            error: error.message
        });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        let user = await User.findOne({ email });

        const AUTHORIZED_ADMIN = process.env.ADMIN_EMAIL;
        const IS_AUTHORIZED_EMAIL = AUTHORIZED_ADMIN && email.toLowerCase() === AUTHORIZED_ADMIN.toLowerCase();

        if (role === 'ADMIN') {
            if (!IS_AUTHORIZED_EMAIL) {
                return res.status(401).json({ message: 'Unauthorized: Access Denied.' });
            }
            if (password !== process.env.ADMIN_PASSWORD) {
                return res.status(401).json({ message: 'Invalid Admin Credentials.' });
            }

            if (!user) {
                user = await User.create({
                    name: 'TrackMate Admin',
                    email: email.toLowerCase(),
                    password: password,
                    role: ['ADMIN'],
                    isVerified: true,
                    trustScore: 100
                });
            } else if (!user.role.includes('ADMIN')) {
                user.role.push('ADMIN');
                await user.save();
            }

            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: 'ADMIN',
                roles: user.role,
                profileImage: user.profileImage,
                verified: user.isVerified,
                trustScore: user.trustScore,
                ratingAvg: user.ratingAvg,
                createdAt: user.createdAt,
                token: generateToken(user._id)
            });
        }

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials. Please try again.' });
        }

        const isPasswordCorrect = await user.matchPassword(password);

        if (isPasswordCorrect) {
            if (IS_AUTHORIZED_EMAIL && !user.role.includes('ADMIN')) {
                user.role.push('ADMIN');
                await user.save();
            }

            if (role && !user.role.includes(role)) {
                return res.status(401).json({ message: `Account not authorized for ${role} role.` });
            }

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: role || user.role[0],
                roles: user.role,
                profileImage: user.profileImage,
                verified: user.isVerified,
                trustScore: user.trustScore,
                ratingAvg: user.ratingAvg,
                createdAt: user.createdAt,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials. Please try again.' });
        }
    } catch (error) {
        console.error('[LOGIN] Error:', error.message);
        res.status(500).json({ message: error.message });
    }
});

const { protect } = require('../middleware/auth');

// Get Profile
router.get('/profile', protect, async (req, res) => {
    res.json(req.user);
});

// Update Profile
router.put('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone || user.phone;
            user.upiId = req.body.upiId || user.upiId;
            if (req.body.profileImage) user.profileImage = req.body.profileImage;

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                upiId: updatedUser.upiId,
                role: updatedUser.role,
                profileImage: updatedUser.profileImage,
                verified: updatedUser.isVerified,
                trustScore: updatedUser.trustScore,
                ratingAvg: updatedUser.ratingAvg,
                createdAt: updatedUser.createdAt,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('[UPDATE_PROFILE] Error:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// Verify Vehicle (For Travellers)
router.post('/verify-vehicle', protect, async (req, res) => {
    try {
        const { licenseNumber, vehiclePlate, vehicleModel, documentUrl } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) return res.status(404).json({ message: 'User not found' });
        if (!user.role.includes('TRAVELLER')) return res.status(403).json({ message: 'Only Travellers need vehicle verification' });

        user.verificationStatus = 'PENDING';
        user.verificationDetails = {
            licenseNumber,
            vehiclePlate,
            vehicleModel,
            documentUrl
        };

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        console.error('[VERIFY_VEHICLE] Error:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// Admin: Get all users
router.get('/admin/users', protect, async (req, res) => {
    try {
        if (!req.user.role.includes('ADMIN')) {
            return res.status(403).json({ message: 'Access denied: Admin only.' });
        }
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error('[ADMIN_USERS] Error:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// Admin: Delete user
router.delete('/admin/users/:id', protect, async (req, res) => {
    try {
        if (!req.user.role.includes('ADMIN')) {
            return res.status(403).json({ message: 'Access denied: Admin only.' });
        }
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('[DELETE_USER] Error:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// Admin Simulation: Verify User
router.patch('/admin/approve-verification/:id', protect, async (req, res) => {
    try {
        if (!req.user.role.includes('ADMIN')) {
            return res.status(403).json({ message: 'Access denied: Admin only.' });
        }
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.verificationStatus = 'VERIFIED';
        user.isVerified = true;
        user.trustScore = Math.min(100, user.trustScore + 20);

        await user.save();
        res.json({ message: 'User verified successfully', user });
    } catch (error) {
        console.error('[APPROVE_VERIFICATION] Error:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// Change Password
router.put('/password', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user && (await user.matchPassword(req.body.currentPassword))) {
            user.password = req.body.newPassword;
            await user.save();
            res.json({ message: 'Password updated successfully' });
        } else {
            res.status(401).json({ message: 'Invalid current password' });
        }
    } catch (error) {
        console.error('[CHANGE_PASSWORD] Error:', error.message);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
