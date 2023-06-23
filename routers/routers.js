const { signinUser, currentUser } = require("../controllers/controllers");
const express = require('express');
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();

router.post("/signin", signinUser);
router.get("/current", validateToken, currentUser);

module.exports = router;