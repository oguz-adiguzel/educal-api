const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: true,
  },
  photoUrl: {
    type: String,
    required: true,
  },
});

const Blog = mongoose.model("Blog", BlogSchema);
module.exports = Blog;
