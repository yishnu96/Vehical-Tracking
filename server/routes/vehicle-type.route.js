
const router = require("express").Router();
const mongodb = require('mongoose').Types;
const helper = require('../utils/helper');
const isEmpty = require('../utils/is-empty');
const VehicleType = require("../models/vehicle-type.model");
const VehicleTypeController = require('../controllers/vehicle-type.controller')

//GET all vehicleType
router.get('/', async (req, res) => {
  VehicleType.find()
    .then(allVehicleTypes => {
      return res.json({ status: 200, message: "All vehicleType", errors: false, data: allVehicleTypes });
    }).
    catch((err) => {
      return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while fetching vehicleType" });
    });
})

// ADD NEW VehicleType
router.post("/", async (req, res) => {
  console.log(req.body)
  let result = VehicleTypeController.verifyCreate(req.body)
  if (isEmpty(result.errors)) {
    const newVehicleType = new VehicleType(result.data);
    newVehicleType
      .save()
      .then(data => {
        return res.status(200).json({ status: 200, errors: false, data, message: "VehicleType Added successfully" });
      }).catch(err => {
        console.log(err);
        return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while adding new vehicleType" });
      })
  }
  else {
    return res.json({ status: 500, errors: result.errors, data: null, message: "Fields required" });
  }
})


// DELETE a VehicleType
router.delete('/:id', (req, res) => {
  if (mongodb.ObjectId.isValid(req.params.id)) {
    VehicleType.deleteOne({ _id: req.params.id }, (err, vehicleType) => {
      if (err) throw err;
      return res.send({ status: 200, errors: false, message: "VehicleType deleted successfully", data: vehicleType })
    }).catch(err => {
      console.log(err);
      return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while deleting the vehicleType" });
    });
  } else {
    // console.log("ID not Found")
    return res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid vehicleType id" });
  }
});

// UPDATE A VehicleType
router.put('/:id', async (req, res) => {
  if (mongodb.ObjectId.isValid(req.params.id)) {
    const result = VehicleTypeController.verifyupdate(req.body);
    if (!isEmpty(result.errors)) {
      return res.json(res.status(400).json({ status: 400, errors: result.errors, data: null, message: "Fields Required" }))
    }
    if (req.file) {
      result.data.logo = await S3Upload(IMG_DIR_CONSTS.BRANDS, req.file);
    }
    VehicleType.findByIdAndUpdate(req.params.id, result.data, { new: true }, (err, doc) => {
      if (err) {
        return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while updating vehicleType data" });
      }
      if (!doc)
        return res.status(200).json({ status: 200, errors: true, data: doc, message: "No VehicleType Found" });
      else {
        return res.status(200).json({ status: 200, errors: false, data: doc, message: "Updated VehicleType" });
      }
    })
  } else {
    return res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid VehicleType Id" });
  }
})


module.exports = router;