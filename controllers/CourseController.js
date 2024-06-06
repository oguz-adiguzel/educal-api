const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const { json } = require("express");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

exports.createCourse = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "smartEdu",
    }
  );

  try {
    const course = await Course.create({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      user: req.body.user,
      photoUrl: result.secure_url,
      videoID: req.body.videoID,
      confirm:false
    });
    const addedCourse = await Course.findOne({ photoUrl: result.secure_url });
    const user = await User.findById(req.body.user);
    await user.courses.push({ _id: addedCourse._id });
    await user.save();

    fs.unlinkSync(req.files.image.tempFilePath);

    res.status(201).json({ message: "Kurs oluşturuldu" });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.createComment = async (req, res) => {
  try {
    const course = await Course.findById(req.body.id);

    await course.comments.push({
      userName: req.body.userName,
      userPhoto: req.body.userPhoto,
      date: new Date(),
      title: req.body.title,
      raiting: req.body.raiting,
      comment: req.body.comment,
    });
    await course.save();
    res.status(200).json({ message: "Yorum Eklendi" });
  } catch (error) {
    console.log("error", error);
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const categorySlug = req.query.categories;
    const query = req.query.search;
    const category = await Category.findOne({ slug: categorySlug });
    let filter = {};

    if (categorySlug) {
      filter = { category: category._id };
    }

    if (query) {
      filter = { name: query };
    }

    if (!query && !categorySlug) {
      (filter.name = ""), (filter.category = null);
    }

    const courses = await Course.find({
      $or: [
        { name: { $regex: ".*" + filter.name + ".*", $options: "i" } },
        { category: filter.category },
      ],
    })
      .sort("-createdAt")
      .populate("user");

    const categories = await Category.find();

    res.status(200).json({
      courses: courses,
      categories: categories,
      page_name: "courses",
      message: "Kurslar Listelendi",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    const user = await User.findById(course.user);
    const categories = await Category.find();
    res.status(200).json({
      course,
      // page_name: "courses",
      user,
      categories,
      message: "Kurs getirildi",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.enrollCourse = async (req, res) => {
  try {
    const user = await User.findById(req.body.userID);
    await user.courses.push({ _id: req.body.courseID });
    await user.save();
    res.status(200).json({ message: "Kursa katılım sağlandı" });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.releaseCourse = async (req, res) => {
  try {
    const user = await User.findById(req.body.userID);
    await user.courses.pull({ _id: req.body.courseID });
    await user.save();
    res.status(200).json({ message: "Kurs çıkartıldı" });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const deletedCourse = await Course.findOneAndRemove({
      slug: req.params.slug,
    });
    const students = await User.find({
      role: "student",
      courses: deletedCourse._id,
    });

    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      const index = student.courses.indexOf(deletedCourse._id);
      if (index !== -1) {
        student.courses.splice(index, 1);
        await student.save();
      }
    }

    res.status(200).json({ message: "Kurs silindi" });
  } catch (error) {
    console.log("error", error);
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    course.name = req.body.name;
    course.description = req.body.description;
    course.category = req.body.category;
    course.save();
    res.status(200).json({ message: "Kurs güncellendi" });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.getCoursesCount = async (req, res) => {
  try {
    const courses = await Course.find();
    const count = courses.length;
    res
      .status(200)
      .json({ message: "Kurs sayısı getirildi", coursesCount: count });
  } catch (error) {
    console.log("error", error);
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.confirmCours = async (req, res) => {
  try {
    const course = await Course.findOne({id: req.params.id});
    console.log('course', course);
    course.confirm = true
    course.save();
    res.status(200).json({ message: "Kurs Onaylandı" });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};
