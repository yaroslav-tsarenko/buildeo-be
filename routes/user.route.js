const express = require('express');
const router = express.Router();
const { getUser, uploadAvatar, getAllUsers, updateUser, deleteUser} = require('../controllers/user.controller');
const multer = require('multer');
const basicAuth = require("../middlewares/basicAuth.mjddleware");
const upload = multer({ storage: multer.memoryStorage() });

router.get('/get-user', basicAuth, getUser);
router.post('/upload-avatar', upload.single('file'), uploadAvatar);
router.get("/get-all-users", getAllUsers);
router.put("/update-user/:id", updateUser);
router.delete("/delete-user/:id", deleteUser);
module.exports = router;