// routes/authRoutes.js
const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const auth = require('../middleware/authMiddleware');
const { register, login, updateProfile } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/update', auth, upload.single('profilePicture'), updateProfile);

module.exports = router;
