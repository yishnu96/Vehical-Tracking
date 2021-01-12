const express = require('express');
const userRoutes = require('./user.route');
const fuelRoutes = require('./fuel.route');
const vehicleRoutes = require('./vehicle.route');
const vehicletypeRoutes = require('./vehicle-type.route');
const locationRoutes = require('./location.route');
const roleRoutes = require('./role.route');
const authRoutes = require('./auth.route');

const authMiddleware = require('../middleware/authMiddleware')();

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

router.use('/auth', authRoutes);
router.use('/user', authMiddleware, userRoutes);
router.use('/fuel', authMiddleware, fuelRoutes);
router.use('/vehicle', authMiddleware, vehicleRoutes);
router.use('/vehicletype', authMiddleware, vehicletypeRoutes);
router.use('/location', authMiddleware, locationRoutes);

module.exports = router;
