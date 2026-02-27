const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const { protect } = require('../middleware/auth');

// Get payment history
router.get('/history', protect, async (req, res) => {
    try {
        const Trip = require('../models/Trip');
        const driverTrips = await Trip.find({ driverId: req.user._id });
        const driverTripIds = driverTrips.map(t => t._id);

        const bookings = await Booking.find({
            $or: [
                { passengerId: req.user._id },
                { tripId: { $in: driverTripIds } }
            ],
            paymentStatus: { $ne: 'PENDING' }
        })
            .populate('tripId', 'startPoint endPoint departureTime driverId')
            .populate('passengerId', 'name profileImage')
            .sort({ updatedAt: -1 });

        const transactions = bookings.map(b => {
            const isDriver = b.tripId.driverId.toString() === req.user._id.toString();
            return {
                _id: b._id,
                amount: b.fare,
                direction: isDriver ? 'IN' : 'OUT',
                status: b.paymentStatus,
                method: b.paymentMethod,
                date: b.updatedAt,
                trip: b.tripId,
                peer: isDriver ? b.passengerId : null // If passenger, peer is driver (handled in populate if needed)
            };
        });

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
