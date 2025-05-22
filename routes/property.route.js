const express = require("express");
const multer = require("multer");
const { createProperty, getAllProperties } = require("../controllers/property.controller");

const router = express.Router();
const upload = multer();

router.post("/create", upload.array("photos"), createProperty);
router.get("/get-all", getAllProperties);

module.exports = router;