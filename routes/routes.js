const express = require("express");
const router = express.Router();
const userController = require("../controllers/controller");
const tokenVerification = require("../middlewares/tokenVerification");

router.post("/createaccount", userController.createUser);
router.post("/login", userController.loginUser);
router.post("/createTask", [tokenVerification], userController.createTask);
router.get("/getTasks", [tokenVerification], userController.getTasks);
router.post("/createSubtask", [tokenVerification], userController.createSubtask);
router.post("/toggleSubtask", [tokenVerification], userController.toggleSubtask);

module.exports = router;
