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

        // Block public ADMIN registration
        if (role === 'ADMIN') {
            return res.status(401).json({ message: 'Unauthorized: Admin accounts cannot be created publicly.' });
        }

        // Find existing user by email
        let user = await User.findOne({ email });

        if (user) {
            // If user exists, check if they already have this role
            if (user.role.includes(role)) {
                return res.status(400).json({ message: 'Account already active with this role. Please login.' });
            }
            // Add the new role to existing account
            user.role.push(role);
            if (phone) user.phone = phone;
            if (upiId) user.upiId = upiId;
            await user.save();
        } else {
            // Create new user
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
            // Send Welcome Email
            const { sendWelcomeEmail } = require('../utils/emailService');
            sendWelcomeEmail(email, name);

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                upiId: user.upiId,
                role: role, // Return the requested role as active
                roles: user.role, // Return all roles
                token: generateToken(user._id)
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Google Auth
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google', async (req, res) => {
    try {
        const { token, role, isAccessToken } = req.body;
        let name, email, picture, googleId;

        // Validate token
        if (!token) {
            console.error('[GOOGLE_AUTH] No token provided');
            return res.status(400).json({ message: 'Token is required' });
        }

        console.log('[GOOGLE_AUTH] Request received:', { 
            role, 
            isAccessToken, 
            tokenLength: token.length,
            tokenPrefix: token.substring(0, 20) + '...'
        });

        // Verify token based on type
        if (isAccessToken) {
            // Handle Access Token from useGoogleLogin hook
            console.log('[GOOGLE_AUTH] Verifying Access Token via Google userinfo API...');
            try {
                const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    timeout: 10000
                });
                
                name = response.data.name;
                email = response.data.email;
                picture = response.data.picture;
                googleId = response.data.sub;
                
                console.log('[GOOGLE_AUTH] Access Token verified successfully:', { email, name });
            } catch (googleError) {
                console.error('[GOOGLE_AUTH] Access Token verification failed:', {
                    status: googleError.response?.status,
                    statusText: googleError.response?.statusText,
                    data: googleError.response?.data,
                    message: googleError.message
                });
                return res.status(401).json({
                    message: 'Invalid Google Access Token',
                    error: googleError.response?.data?.error_description || googleError.message
                });
            }
        } else {
            // Handle ID Token from GoogleLogin component
            console.log('[GOOGLE_AUTH] Verifying ID Token via google-auth-library...');
            try {
                const ticket = await googleClient.verifyIdToken({
                    idToken: token,
                    audience: process.env.GOOGLE_CLIENT_ID,
                });
                const payload = ticket.getPayload();
                
                name = payload.name;
                email = payload.email;
                picture = payload.picture;
                googleId = payload.sub;
                
                console.log('[GOOGLE_AUTH] ID Token verified successfully:', { email, name });
            } catch (ticketError) {
                console.error('[GOOGLE_AUTH] ID Token verification failed:', ticketError.message);
                return res.status(401).json({
                    message: 'Invalid Google ID Token',
                    error: ticketError.message
                });
            }
        }

        // Validate email
        if (!email) {
            console.error('[GOOGLE_AUTH] Email missing from Google response');
            return res.status(400).json({ message: 'Google account must have an email' });
        }

        // Admin protection
        const AUTHORIZED_ADMIN = process.env.ADMIN_EMAIL;
        if (role === 'ADMIN' && (!AUTHORIZED_ADMIN || email.toLowerCase() !== AUTHORIZED_ADMIN.toLowerCase())) {
            console.log('[GOOGLE_AUTH] Unauthorized admin attempt:', email);
            return res.status(401).json({ message: 'Unauthorized: Admin accounts cannot be created publicly' });
        }

        // Find or create user
        let user = await User.findOne({ email });
        let isNewUser = false;
        let activeRole = role || 'PASSENGER';

        if (!user) {
            // New user registration
            console.log('[GOOGLE_AUTH] Creating new user:', { email, role: activeRole });
            
            user = await User.create({
                name,
                email,
                password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8),
                role: [activeRole],
                profileImage: picture,
                googleId,
                isVerified: true
            });
            
            isNewUser = true;
            console.log('[GOOGLE_AUTH] New user created successfully:', user._id);

            // Send welcome email
            try {
                const { sendWelcomeEmail } = require('../utils/emailService');
                await sendWelcomeEmail(email, name);
            } catch (emailError) {
                console.error('[GOOGLE_AUTH] Welcome email failed:', emailError.message);
                // Don't fail the registration if email fails
            }
        } else {
            // Existing user login
            console.log('[GOOGLE_AUTH] Existing user found:', { email, currentRoles: user.role });
            
            // Update googleId if missing
            if (!user.googleId) {
                user.googleId = googleId;
            }

            // Update profile image if changed
            if (picture && picture !== user.profileImage) {
                user.profileImage = picture;
            }

            // Handle role assignment
            if (role) {
                if (user.role.includes(role)) {
                    activeRole = role;
                    console.log('[GOOGLE_AUTH] User already has role:', role);
                } else {
                    user.role.push(role);
                    activeRole = role;
                    console.log('[GOOGLE_AUTH] Added new role to user:', role);
                }
            } else {
                activeRole = user.role[0];
                console.log('[GOOGLE_AUTH] Using default role:', activeRole);
            }
            
            await user.save();
        }

        // Admin auto-assignment
        if (AUTHORIZED_ADMIN && email.toLowerCase() === AUTHORIZED_ADMIN.toLowerCase()) {
            if (!user.role.includes('ADMIN')) {
                user.role.push('ADMIN');
                await user.save();
                console.log('[GOOGLE_AUTH] Admin role auto-assigned');
            }
            activeRole = 'ADMIN';
        }

        // Generate response
        const response = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            upiId: user.upiId,
            role: activeRole,
            roles: user.role,
            profileImage: user.profileImage,
            verified: user.isVerified,
            trustScore: user.trustScore,
            ratingAvg: user.ratingAvg,
            carbonSaved: user.carbonSaved,
            rideCredits: user.rideCredits,
            loyaltyPoints: user.loyaltyPoints,
            level: user.level,
            createdAt: user.createdAt,
            isNewUser,
            token: generateToken(user._id)
        };

        console.log('[GOOGLE_AUTH] Authentication successful:', { 
            userId: user._id, 
            email, 
            activeRole, 
            isNewUser 
        });

        res.json(response);
    } catch (error) {
        console.error('[GOOGLE_AUTH] Unexpected error:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
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

        // Find user by email
        let user = await User.findOne({ email });

        const AUTHORIZED_ADMIN = process.env.ADMIN_EMAIL;
        const IS_AUTHORIZED_EMAIL = AUTHORIZED_ADMIN && email.toLowerCase() === AUTHORIZED_ADMIN.toLowerCase();

        console.log(`Login attempt: ${email}, Role: ${role}, Authorized: ${IS_AUTHORIZED_EMAIL}`);

        // 🛡️ Extra Security for Admin Role
        if (role === 'ADMIN') {
            if (!IS_AUTHORIZED_EMAIL) {
                console.log('Admin login denied: Unauthorized email');
                return res.status(401).json({ message: 'Unauthorized: Access Denied.' });
            }
            if (password !== process.env.ADMIN_PASSWORD) {
                console.log('Admin login denied: Invalid password for authorized email');
                return res.status(401).json({ message: 'Invalid Admin Credentials.' });
            }

            // Create admin user on the fly if authenticated via .env but record missing in DB
            if (!user) {
                console.log('Creating new admin user record');
                user = await User.create({
                    name: 'TrackMate Admin',
                    email: email.toLowerCase(),
                    password: password, // Will be hashed by model
                    role: ['ADMIN'],
                    isVerified: true,
                    trustScore: 100
                });
            } else if (!user.role.includes('ADMIN')) {
                console.log('Upgrading existing user to admin');
                user.role.push('ADMIN');
                await user.save();
            }

            console.log('Admin authenticated successfully');
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

        // Standard Login Procedure for other roles
        if (!user) {
            console.log('Login denied: User not found in DB');
            return res.status(401).json({ message: 'Invalid credentials. Please try again.' });
        }

        const isPasswordCorrect = await user.matchPassword(password);
        console.log(`Password check: ${isPasswordCorrect}`);

        if (isPasswordCorrect) {
            // Auto-assign ADMIN role if it's the authorized email logging in via regular form
            if (IS_AUTHORIZED_EMAIL && !user.role.includes('ADMIN')) {
                user.role.push('ADMIN');
                await user.save();
            }

            // Verify if user has the requested role
            if (role && !user.role.includes(role)) {
                console.log(`Role mismatch: User roles ${user.role}, Requested ${role}`);
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
        res.status(500).json({ message: error.message });
    }
});

// Verify Vehicle (For Travellers)
router.post('/verify-vehicle', protect, async (req, res) => {
    try {
        const { licenseNumber, vehiclePlate, vehicleModel, documentUrl } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.role !== 'TRAVELLER') return res.status(403).json({ message: 'Only Travellers need vehicle verification' });

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
        user.trustScore = Math.min(100, user.trustScore + 20); // Trust boost

        await user.save();
        res.json({ message: 'User verified successfully', user });
    } catch (error) {
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
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
