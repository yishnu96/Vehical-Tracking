const Location = require("../models/location.model");
const User = require("../models/user.model");
const LocationController = require("../controllers/location.controller");
const router = require("express").Router();
const isEmpty = require('../utils/is-empty');
const mongodb = require('mongoose').Types;


router.get("/", (req, res) => {
    Location
        .find()
        .populate("user", "-password")
        .exec()
        .then(docs => {
            if (docs.length > 0)
                res.json({ status: 200, data: docs, errors: false, message: "All locations" });
            else
                res.json({ status: 200, data: docs, errors: true, message: "No loaction found" });
        }).catch(err => {
            console.log(err);
            res.status(500).json({ status: 500, data: null, errors: true, message: "Error while getting locations" })
        })
})

router.get("/vehicle/:id", (req, res) => {
    console.log(req.params.id)
    if (mongodb.ObjectId(req.params.id)) {
        Location
            .findOne({ vehicle: req.params.id })
            // .populate("driver", "-password")
            .exec()
            .then(docs => {
                res.json({ status: 200, data: docs, errors: false, message: "All Locations Users" });
            }).catch(err => {
                console.log(err);
                res.status(500).json({ status: 500, data: null, errors: true, message: "Error while getting location" })
            })
    } else {
        res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid user id" });
    }
})

// Add new location own
// router.post('/:id', async (req, res) => {
//     let vehicle = req.params.id;
//     let result = LocationController.verifyLocation(req.body);
//     console.log(result);
//     if (!isEmpty(result.errors)) {
//         return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields Required" });
//     }
//     let array = [];
//     array.push(result.data.coordinates);
//     if (mongodb.ObjectId.isValid(vehicle)) {
//         Location
//             .findOneAndUpdate(
//                 { vehicle:  vehicle },
//                 { $push: { coordinates: array } },
//                 { upsert: true, setDefaultsOnInsert: true, new: true })
//             .exec()
//             .then(_location => {
//                 res.status(200).json({ status: 200, data: _location, errors: false, message: "Location added successfully" });
//             }).catch(e => {
//                 console.log(e);
//                 res.status(500).json({ status: 500, data: e, errors: true, message: "Error while adding location" })
//             });
//     } else {
//         return res.status(500).json({ status: 500, data: null, errors: true, message: "Invalid Vehicle Id" })

//     }
// });

// Add new location own
router.post('/:id', async (req, res) => {

    let array = [];
    for (let index = 0; index < 5; index++) {
        let random = Math.floor(Math.random() * 5) + 1;
        array.push(locations[random]);
    }
    console.log(array)
    if (mongodb.ObjectId.isValid(req.params.id)) {
        Location
            .findOneAndUpdate(
                { vehicle: req.params.id },
                { $push: { coordinates: { $each: array } } },
                { upsert: true, setDefaultsOnInsert: true, new: true })
            .exec()
            .then(_location => {
                res.status(200).json({ status: 200, data: _location, errors: false, message: "Location added successfully" });
            }).catch(e => {
                console.log(e);
                res.status(500).json({ status: 500, data: null, errors: true, message: "Error while adding location" })
            });
    } else {
        return res.status(500).json({ status: 500, data: null, errors: true, message: "Invalid Vehicle Id" })

    }
});

var locations = [{ latitude: 23.5793824, longitude: 87.3065834 },
  { latitude: 23.572253, longitude: 87.288101 },
{ latitude: 23.562218, longitude: 87.273324 },
{ latitude: 23.612184, longitude: 87.238019 },
{ latitude: 23.638318, longitude: 87.134077 },
{ latitude: 23.440885, longitude: 87.466103 }
]

module.exports = router;
