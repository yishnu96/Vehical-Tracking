
const router = require("express").Router();
const mongodb = require('mongoose').Types;
const helper = require('../utils/helper');
const isEmpty = require('../utils/is-empty');
const Fuel = require("../models/fuel-type.model");
const FuelController = require('../controllers/fuel-type.controller')

//GET all fuel
router.get('/', async (req, res) => {
  Fuel.find()
    .then(allFuels => {
      return res.json({ status: 200, message: "All fuel", errors: false, data: allFuels });
    }).
    catch((err) => {
      return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while fetching fuel" });
    });
})

// ADD NEW Fuel
router.post("/", async (req, res) => {
  let result = FuelController.verifyCreate(req.body)
  if (isEmpty(result.errors)) {
    const newFuel = new Fuel(result.data);
    newFuel
      .save()
      .then(data => {
        return res.status(200).json({ status: 200, errors: false, data, message: "Fuel Added successfully" });
      }).catch(err => {
        console.log(err);
        return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while adding new fuel" });
      })
  }
  else {
    return res.json({ status: 500, errors: result.errors, data: null, message: "Fields required" });
  }
})


// DELETE a Fuel
router.delete('/:id', (req, res) => {
  if (mongodb.ObjectId.isValid(req.params.id)) {
    Fuel.deleteOne({ _id: req.params.id }, (err, fuel) => {
      if (err) throw err;
      return res.send({ status: 200, errors: false, message: "Fuel deleted successfully", data: fuel })
    }).catch(err => {
      console.log(err);
      return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while deleting the fuel" });
    });
  } else {
    // console.log("ID not Found")
    return res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid fuel id" });
  }
});

// UPDATE A Fuel
router.put('/:id', async (req, res) => {
  if (mongodb.ObjectId.isValid(req.params.id)) {
    const result = FuelController.verifyupdate(req.body);
    if (!isEmpty(result.errors)) {
      return res.json(res.status(400).json({ status: 400, errors: result.errors, data: null, message: "Fields Required" }))
    }
    if (req.file) {
      result.data.logo = await S3Upload(IMG_DIR_CONSTS.BRANDS, req.file);
    }
    Fuel.findByIdAndUpdate(req.params.id, result.data, { new: true }, (err, doc) => {
      if (err) {
        return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while updating fuel data" });
      }
      if (!doc)
        return res.status(200).json({ status: 200, errors: true, data: doc, message: "No Fuel Found" });
      else {
        return res.status(200).json({ status: 200, errors: false, data: doc, message: "Updated Fuel" });
      }
    })
  } else {
    return res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid Fuel Id" });
  }
})


module.exports = router;