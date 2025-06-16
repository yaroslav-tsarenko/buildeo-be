const express = require("express");
const multer = require("multer");
const { createProperty, getAllProperties, getProperty, leaveComment } = require("../controllers/property.controller");

const router = express.Router();
const upload = multer();

router.post("/create", upload.array("photos"), createProperty);
router.get("/get-all", getAllProperties);
router.get("/get-property", getProperty);
router.post('/leave-comment', leaveComment);

module.exports = router;