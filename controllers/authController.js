const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { validationResult } = require("express-validator");
const User = require("../models/User");
const Category = require("../models/Category");
const Course = require("../models/Course");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

exports.createUser = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "smartEdu",
    }
  );

  try {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      photoUrl: result.secure_url,
    });

    res.status(201).json({
      message: "Kullanıcı oluşturuldu",
    });
  } catch (error) {
    const errors = validationResult(req);
    console.log("error", error);
    res.status(400).json({
      status: "fail",
      message: errors.array()[0].msg,
    });
    // }
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.id });
    user.name = req.body.name;
    user.age = req.body.age;
    user.location = req.body.location;
    user.save();
    res.status(200).json({ message: "Kullanıcı güncellendi" });
  } catch (error) {
    console.log('error', error);
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ message: "Kullanıcı adı veya şifre yanlış", status: 401 });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1w",
    });

    res.status(200).json({
      token: token,
      message: "Girşi yapıldı",
      role: user.role,
      user: user,
    });
  } catch (error) {
    console.log("Login Error:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndRemove(req.params.id);
    await Course.deleteMany({ user: req.params.id });
    res.status(200).json({
      message: "Kullanıcı silindi",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const courses = await Course.find({ user: user._id });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Kullanıcı bulunamadı", status: 404 });
    }

    res.json({ user, courses });
  } catch (error) {
    console.error("Profil hatası:", error);
    res.status(500).json({ message: "Sunucu hatası", status: 500 });
  }
};

exports.getTeacherCourses = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }
    res.status(200).json({ courses: user.courses });
  } catch (error) {
    console.log("error", error);
  }
};

exports.getStudentCourses = async (req, res) => {
  try {
    const course = await Course.findById(req.body.id);
    res.status(200).json({
      course: course,
    });
  } catch (error) {
    console.log("error", error);
  }
};

exports.getTeacherList = async (req, res) => {
  try {
    const teacher = await User.find({ role: "teacher" });
    res.status(200).json({
      message: "Öğretmenler getirildi",
      teacher: teacher,
    });
  } catch (error) {
    console.log("error", error);
  }
};

exports.getTeacherCount = async (req, res) => {
  try {
    const users = await User.find();
    const teacher = users.filter((item)=> item.role === 'teacher')
    const count = teacher.length;
    res
      .status(200)
      .json({ message: "Öğretmen sayısı getirildi", teacherCount: count });
  } catch (error) {
    console.log('error', error);
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.getStudentCount = async (req, res) => {
  try {
    const users = await User.find();
    const students = users.filter((item)=> item.role === 'student')
    const count = students.length;
    res
      .status(200)
      .json({ message: "Öğrenci sayısı getirildi", studentCount: count });
  } catch (error) {
    console.log('error', error);
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ message:'Kullanıcılar getirildi', users:users });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", status: 500 });
  }
};