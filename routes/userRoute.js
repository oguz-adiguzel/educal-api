const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const { body } = require("express-validator");
const User = require("../models/User");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.route("/signup").post(
  [
    body("name").not().isEmpty().withMessage("Lütfen isminizi yazınız"),
    body("email")
      .isEmail()
      .withMessage("Please Ender Valid Email")
      .custom((userEmail) => {
        return User.findOne({ email: userEmail }).then((user) => {
          if (user) {
            return Promise.reject("Email kullanılıyor!");
          }
        });
      }),

    body("password").not().isEmpty().withMessage("Lütfen parola belirtiniz"),
  ],
  authController.createUser
); // http://localhost:3001/users/signup

/**
 * @swagger 
 * /login:
 *  post:
 *    description: Deneme
 *    responses:
 *     '201':
 *       description: Dene 
 */

router.route("/login").post(authController.loginUser);
// router.route("/logout").get(authController.logOutUser);
router.route("/update").put(authController.updateUser);
router.route("/:id").delete(authController.deleteUser);
router.route("/profile").get(verifyToken, authController.getUserInfo);
router.route("/teacherCount").get(authController.getTeacherCount);
router.route("/studentCount").get(authController.getStudentCount);
router.route("/getTeacherCourses").get(verifyToken, authController.getTeacherCourses);
router.route("/getStudentCourses").post(authController.getStudentCourses);
router.route("/getTeacherList").get(authController.getTeacherList);

module.exports = router;
