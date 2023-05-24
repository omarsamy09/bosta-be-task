const express = require("express");
const { signUp, logIn, verify } = require("../services/user");

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", logIn);
router.get("/verify/:token", verify);
module.exports = router;
