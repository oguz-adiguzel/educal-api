const Blog = require("../models/Blog");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

exports.createBlog = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "smartEdu",
    }
  );

  try {
    const blog = await Blog.create({
      title: req.body.title,
      text: req.body.text,
      tag: req.body.tag,
      photoUrl: result.secure_url,
    });

    fs.unlinkSync(req.files.image.tempFilePath);

    res.status(201).json({ message: "Blog oluşturuldu" });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.getAllBlog = async (req, res) => {
    try{
        const blog = await Blog.find()
        res.status(200).json({message:'Bloglar getirildi' ,blogs: blog})
      }catch(error){
        console.log('error', error);
      }
};

exports.getBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    res.status(200).json({
      blog,
      message: "Blog getirildi",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
}