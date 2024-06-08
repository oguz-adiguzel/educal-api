const mongoose = require("mongoose");
const slugify = require("slugify");
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  slug: {
    type: String,
    unique: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId, // burası Category ile bağlantılı olacak
    ref: "Category", // hangi model ile bağlantılı olacak
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  photoUrl: {
    type: String,
    required: true,
  },
  videoID: {
    type: String,
    required: true,
  },
  confirmCourse: {
    type: Boolean,
    default: false,
  },
  comments: [],
});

CourseSchema.pre("validate", function (next) {
  this.slug = slugify(this.name, {
    lower: true,
    strict: true,
  });
  next();
});

const Course = mongoose.model("Course", CourseSchema);
module.exports = Course;
