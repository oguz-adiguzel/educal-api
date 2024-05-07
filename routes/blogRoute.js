const express = require("express");
const blogController = require("../controllers/blogController");

const router = express.Router();

router.route("/").post(blogController.createBlog);
router.route('/').get(blogController.getAllBlog)


module.exports = router;
