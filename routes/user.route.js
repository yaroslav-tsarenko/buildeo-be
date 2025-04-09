const express = require('express');
const router = express.Router();
const { getUser, uploadAvatar} = require('../controllers/user.controller');
const multer = require('multer');
const basicAuth = require("../middlewares/basicAuth.mjddleware");
const upload = multer({ storage: multer.memoryStorage() });

router.get('/get-user', basicAuth, getUser);
router.post('/upload-avatar', upload.single('file'), uploadAvatar);

module.exports = router;