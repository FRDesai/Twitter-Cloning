const { signinUser, currentUser, forgotPassword, resetPassword, getUsers } = require("../controllers/controllers");
const express = require('express');
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();

router.post("/signin", signinUser);
router.get("/current", validateToken, currentUser);
router.post("/forgotPassword", forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;