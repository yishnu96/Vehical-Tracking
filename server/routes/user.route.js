
const router = require("express").Router();
const mongodb = require('mongoose').Types;
const helper = require('../utils/helper');
const isEmpty = require('../utils/is-empty');
const User = require("../models/user.model");
const UserController = require('../controllers/user.controller')

router.get("/", (req, res) => {
  User.find()
    .then(allUsers => {
      return res.json({ status: 200, message: "All Users", errors: false, data: allUsers });
    }).
    catch((err) => {
      return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while fetching Users" });
    });
})

router.get("/drivers", (req, res) => {
  // { _id: { $ne: req.user._id } }
  User.find()
    .then(allUsers => {
      return res.json({ status: 200, message: "All Drivers", errors: false, data: allUsers });
    }).
    catch((err) => {
      return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while fetching Users" });
    });
})


router.delete('/:id', (req, res) => {
  if (mongodb.ObjectId.isValid(req.params.id)) {
    User.deleteOne({ _id: req.params.id }, (err, user) => {
      if (err) throw err;
      res.send({ status: 200, errors: false, message: "User deleted successfully", data: user })
    }).catch(err => {
      console.log(err);
      res.status(500).json({ status: 500, errors: true, data: null, message: "Error while deleting the user" });
    });
  } else {
    console.log("ID not Found")
    res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid user id" });
  }
});

// Add User
router.post("/", async (req, res) => {
  try {
    let result = UserController.verifyCreate(req.body)
    console.log(result);
    if (!isEmpty(result.errors)) {
      return res.status(400).json({ status: 400, errors: result.errors, data: null, message: "Fields Required" });
    }
    let user = await (await User.findOne({ email: req.body.email }).lean());
    if (user) {
      return res.status(400).json({ status: 400, errors: true, data: null, message: `${req.body.email} already registered` });
    }
    let newuser = new User(result.data)
    newuser = await newuser.save();
    delete newuser.password;
    return res.status(200).json({ status: 200, errors: null, data: newuser, message: "User Added successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: 500, errors: err, data: null, message: "Something went wrong" });
  }
})

router.put("/id/:id", async (req, res) => {
  try {
    if (!mongodb.ObjectId.isValid(req.params.id)) {
      return response(res, 400, null, true, `Invalid user id`);
    }
    let result;
    result = UserController.verifyCustomerProfileWeb(req.body);
    if (!isEmpty(result.errors)) {
      return res.status(400).json({ status: 400, errors: result.errors, data: null, message: "Fields Required" });
    }
    let user = await User.findByIdAndUpdate(req.params.id, { $set: result.data }, { new: true, select: "-password" }).lean().populate("role", "name").exec();
    response(res, 200, user, false, "User Updated successfully");
  } catch (err) {
    console.log(err);
    return response(res, 500, null, true, "Something went wrong");
  }
})


module.exports = router;
