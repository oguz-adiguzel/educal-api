const express = require("express");
const mainController = require("../controllers/mainController");

const router = express.Router();

router.route("/big").post(mainController.createBigImage);
router.route("/").get(mainController.getImage);
router.route("/small").post(mainController.createSmallImage);

module.exports = router;
