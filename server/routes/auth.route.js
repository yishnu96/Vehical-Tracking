const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const authMiddleware = require('../middleware/authMiddleware');
const isEmpty = require('../utils/is-empty');
const User = require('../models/user.model');
const UserController = require('../controllers/user.controller');
const jwt = require("jsonwebtoken");
// router.post('/register', asyncHandler(register), login);
// router.post('/login', passport.authenticate('local', { session: false }), login);
// router.get('/me', passport.authenticate('jwt', { session: false }), login);



router.post('/login', authMiddleware(true), async (req, res) => {
  try {
    let result = UserController.verifyLogin(req.body);
    if (!isEmpty(result.errors)) {
      return res.status(400).json({ status: 400, errors: result.errors, data: null, message: "Fields Required" });
    }
    let user = await User.findOne({ email: result.data.email }).lean().exec();
    if (!user) {
      return res.status(401).json({ status: 401, errors: true, data: null, message: "Invalid credentials" });
    }
    let matched = bcrypt.compareSync(result.data.password, user.password);
    if (!matched)
      return res.status(401).json({ status: 401, errors: true, data: null, message: "Invalid credentials" });
    let token = jwt.sign({ user: user._id }, process.env.JWT_SECRET);
    delete user.password;
    return res.status(200).json({ status: 200, errors: false, data: { token, user }, message: "Login successful" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: 200, errors: false, data: null, message: "Something went wrong, Please check error logs" });
  }
});


router.post('/register', authMiddleware(true), async (req, res) => {
  try {
    let result = UserController.verifyRegister(req.body);
    if (!isEmpty(result.errors)) {
      return res.status(400).json({ status: 400, errors: result.errors, data: null, message: "Fields required" });
    }
    let user = await User.findOne({ email: result.data.email }).lean().exec();
    if (user) {
      return res.status(400).json({ status: 400, errors: true, data: null, message: "Email already registered" });
    }
    result.data.password = bcrypt.hashSync(result.data.password, bcrypt.genSaltSync(10));
    result.data.role = process.env.ADMIN_ROLE;
    result.data.active = false;
    user = new User(result.data);
    user = (await user.save()).toObject();
    delete user.password;
    let token = jwt.sign({ user: user._id }, process.env.JWT_SECRET);
    return res.status(200).json({ status: 200, errors: false, data: { token, user: user }, message: "User registered successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: 500, errors: err, data: null, message: "Something went wrong, Please check error logs" });
  }
});


module.exports = router;