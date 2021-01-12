
const router = require("express").Router();
const mongodb = require('mongoose').Types;
const helper = require('../utils/helper');
const isEmpty = require('../utils/is-empty');

//GET all role
router.get('/', async (req, res) => {
  Role.find()
    .then(allRoles => {
      return res.json({ status: 200, message: "All role", errors: false, data: allRoles });
    }).
    catch((err) => {
      return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while fetching role" });
    });
})

// ADD NEW Role
router.post("/", async (req, res) => {
  console.log(req.body)
  let result = RoleController.verifyCreate(req.body)
  if (isEmpty(result.errors)) {
    const newRole = new Role(result.data);
    newRole
      .save()
      .then(data => {
        return res.status(200).json({ status: 200, errors: false, data, message: "Role Added successfully" });
      }).catch(err => {
        console.log(err);
        return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while adding new role" });
      })
  }
  else {
    return res.json({ status: 500, errors: result.errors, data: null, message: "Fields required" });
  }
})


// DELETE a Role
router.delete('/:id', (req, res) => {
  if (mongodb.ObjectId.isValid(req.params.id)) {
    Role.deleteOne({ _id: req.params.id }, (err, role) => {
      if (err) throw err;
      return res.send({ status: 200, errors: false, message: "Role deleted successfully", data: role })
    }).catch(err => {
      console.log(err);
      return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while deleting the role" });
    });
  } else {
    // console.log("ID not Found")
    return res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid role id" });
  }
});

// UPDATE A Role
router.put('/:id', async (req, res) => {
  if (mongodb.ObjectId.isValid(req.params.id)) {
    const result = RoleController.verifyupdate(req.body);
    if (!isEmpty(result.errors)) {
      return res.json(res.status(400).json({ status: 400, errors: result.errors, data: null, message: "Fields Required" }))
    }
    if (req.file) {
      result.data.logo = await S3Upload(IMG_DIR_CONSTS.BRANDS, req.file);
    }
    Role.findByIdAndUpdate(req.params.id, result.data, { new: true }, (err, doc) => {
      if (err) {
        return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while updating role data" });
      }
      if (!doc)
        return res.status(200).json({ status: 200, errors: true, data: doc, message: "No Role Found" });
      else {
        return res.status(200).json({ status: 200, errors: false, data: doc, message: "Updated Role" });
      }
    })
  } else {
    return res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid Role Id" });
  }
})


module.exports = router;
