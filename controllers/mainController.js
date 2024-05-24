const Main = require("../models/MainImage");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

exports.createBigImage = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "smartEdu",
    }
  );

  console.log("result", result);

  try {
    const image = await Main.find({ name: "big" });
    await cloudinary.uploader.destroy(image[0].image_id);

    await Main.findOneAndDelete({ name: "big" });

    const mainImage = await Main.create({
      name: "big",
      photoUrl: result.secure_url,
      image_id: result.public_id,
    });

    fs.unlinkSync(req.files.image.tempFilePath);

    res.status(200).json({ message: "Fotoğraf eklendi" });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};


exports.createSmallImage = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "smartEdu",
    }
  );
  try {
    const image = await Main.find({ name: "small" });
    await cloudinary.uploader.destroy(image[0].image_id);

    await Main.findOneAndDelete({ name: "small" });

    const mainImage = await Main.create({
      name: "small",
      photoUrl: result.secure_url,
      image_id: result.public_id,
    });

    fs.unlinkSync(req.files.image.tempFilePath);

    res.status(200).json({ message: "Fotoğraf eklendi" });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.getImage = async (req, res) => {
  try {
    const photo = await Main.find();
    res.status(200).json({ photo: photo });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};