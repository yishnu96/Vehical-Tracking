
const router = require("express").Router();
const mongodb = require('mongoose').Types;
const helper = require('../utils/helper');
const isEmpty = require('../utils/is-empty');
const Vehicle = require("../models/vehicle.model");
const VehicleController = require('../controllers/vehicle.controller')

//GET all vehicle
router.get('/', async (req, res) => {
  Vehicle.find()
    .populate('driver fuelType vehicleType')
    .exec()
    .then(allVehicles => {
      return res.json({ status: 200, message: "All vehicle", errors: false, data: allVehicles });
    }).
    catch((err) => {
      console.log(err);
      return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while fetching vehicle" });
    });
})

// ADD NEW Vehicle
router.post("/", async (req, res) => {
  let result = VehicleController.verifyCreate(req.body)
  if (isEmpty(result.errors)) {
    const newVehicle = new Vehicle(result.data);
    newVehicle
      .save()
      .then(data => {
        return res.status(200).json({ status: 200, errors: false, data, message: "Vehicle Added successfully" });
      }).catch(err => {
        console.log(err);
        return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while adding new vehicle" });
      })
  }
  else {
    return res.json({ status: 500, errors: result.errors, data: null, message: "Fields required" });
  }
})


// DELETE a Vehicle
router.delete('/:id', (req, res) => {
  if (mongodb.ObjectId.isValid(req.params.id)) {
    Vehicle.deleteOne({ _id: req.params.id }, (err, vehicle) => {
      if (err) throw err;
      return res.send({ status: 200, errors: false, message: "Vehicle deleted successfully", data: vehicle })
    }).catch(err => {
      console.log(err);
      return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while deleting the vehicle" });
    });
  } else {
    // console.log("ID not Found")
    return res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid vehicle id" });
  }
});

// UPDATE A Vehicle
router.put('/:id', async (req, res) => {
  if (mongodb.ObjectId.isValid(req.params.id)) {
    const result = VehicleController.verifyupdate(req.body);
    if (!isEmpty(result.errors)) {
      return res.json(res.status(400).json({ status: 400, errors: result.errors, data: null, message: "Fields Required" }))
    }
    if (req.file) {
      result.data.logo = await S3Upload(IMG_DIR_CONSTS.BRANDS, req.file);
    }
    Vehicle.findByIdAndUpdate(req.params.id, result.data, { new: true }, (err, doc) => {
      if (err) {
        return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while updating vehicle data" });
      }
      if (!doc)
        return res.status(200).json({ status: 200, errors: true, data: doc, message: "No Vehicle Found" });
      else {
        return res.status(200).json({ status: 200, errors: false, data: doc, message: "Updated Vehicle" });
      }
    })
  } else {
    return res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid Vehicle Id" });
  }
})


module.exports = router;