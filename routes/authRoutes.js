const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const {registerSchema} = require('../validator/authValidator');
// const {register} = require('../controllers/authController');
const { register, verifyEmail } = require("../controllers/authController");

router.post("/register",validate(registerSchema),register);
router.get("/verify/:token", verifyEmail);
router.post(
    "/login",
    validate(loginSchema),
    login
);
module.exports = router;