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
            .populate("driver", "-password")
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

// //Add new location own
// router.post('/:id', async (req, res) => {
//     vehicle = req.params.id;
//     let result = LocationController.verifyLocation(req.body);
//     if (!isEmpty(result.errors)) {
//         return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields Required" });
//     }
//     if (mongodb.ObjectId.isValid(req.params.id)) {
//         Location
//             .findOneAndUpdate(
//                 { vehicle: vehicle },
//                 { $push: { coordinates: result.data } },
//                 { upsert: true, setDefaultsOnInsert: true, new: true })
//             .exec()
//             .then(_location => {
//                 res.status(200).json({ status: 200, data: _location, errors: false, message: "Location added successfully" });
//             }).catch(e => {
//                 console.log(e);
//                 res.status(500).json({ status: 500, data: null, errors: true, message: "Error while adding location" })
//             });
//     } else {
//         return res.status(500).json({ status: 500, data: null, errors: true, message: "Invalid Vehicle Id" })

//     }
// });

//Add new location own
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

var locations = [{ latitude: 28.56939, longitude: 77.18949 },
{ latitude: 28.56221, longitude: 77.20734 },
{ latitude: 28.54985, longitude: 77.24030 },
{ latitude: 28.57994, longitude: 77.24185 },
{ latitude: 28.60466, longitude: 77.22897 },
{ latitude: 28.63224, longitude: 77.21060 },
{ latitude: 28.59633, longitude: 77.32457 },
{ latitude: 28.60206, longitude: 77.40539 },
{ latitude: 28.50271, longitude: 77.40036 },
{ latitude: 28.70376, longitude: 77.13849 },
{ latitude: 28.72371, longitude: 77.11407 },
{ latitude: 28.70913, longitude: 77.01912 },
{ latitude: 28.65685, longitude: 77.01553 },
{ latitude: 28.73397, longitude: 76.99434 },
{ latitude: 28.55775, longitude: 77.05641 },
{ latitude: 28.48449, longitude: 77.06881 },
{ latitude: 28.52410, longitude: 77.19159 },
{ latitude: 28.70897, longitude: 77.15275 },
{ latitude: 28.75145, longitude: 77.08408 },
{ latitude: 28.78722, longitude: 77.03779 },
{ latitude: 28.80858, longitude: 76.97036 }]

module.exports = router;