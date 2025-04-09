const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createService, getAllServices, getServiceById, leaveComment } = require('../controllers/service.controller');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/create', upload.single('file'), createService);
router.get('/get-all', getAllServices);
router.get('/get-service', getServiceById);
router.post('/leave-comment', leaveComment);

module.exports = router;