const Blog = require("../models/Blog");

exports.createBlog = async (req, res) => {
  res.status(200).json({ message: "Çalıştı" });
};

exports.getAllBlog = async (req, res) => {
  res.status(200).json({ message: "Çalıştı" });
};
