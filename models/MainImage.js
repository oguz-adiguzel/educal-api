const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MainSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  photoUrl: {
    type: String,
    required: true,
  },
  image_id: {
    type: String,
  },
});

const Main = mongoose.model("Main", MainSchema);
module.exports = Main;
