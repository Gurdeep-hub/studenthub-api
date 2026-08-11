const express = require("express");
const router = express.Router();

const validate = require("../middleware/validate");

const {
    registerSchema,
    loginSchema
} = require("../validator/authValidator");

const {
    register,
    verifyEmail,
    login,
    refresh,
    handleLogout
} = require("../controllers/authController");


router.post(
    "/register",
    validate(registerSchema),
    register
);

router.get(
    "/verify/:token",
    verifyEmail
);

router.post(
    "/login",
    validate(loginSchema),
    login
);

router.get(
    "/refresh",
    refresh
);

router.get(
    "/logout",
    handleLogout
);


module.exports = router;