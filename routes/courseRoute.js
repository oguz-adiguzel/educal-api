const express = require("express");
const courseController = require("../controllers/CourseController");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

router
  .route("/")
  .post( courseController.createCourse);
router.route("/").get(courseController.getAllCourses);
router.route("/comment").post(courseController.createComment);
router.route("/count").get(courseController.getCoursesCount);
router.route("/:slug").get(courseController.getCourse);
router.route("/enroll").post(courseController.enrollCourse);
router.route("/release").post(courseController.releaseCourse);
router.route("/:slug").delete(courseController.deleteCourse);
router.route("/:slug").put(courseController.updateCourse);

module.exports = router;
