const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const pageRoute = require("./routes/pageRoute");
const courseRoute = require("./routes/courseRoute");
const categoryRoute = require("./routes/categoryRoute");
const userRoute = require("./routes/userRoute");
const blogRoute = require("./routes/blogRoute")
const swaggerConfig = require("./swaggerDef");
const fileUpload = require("express-fileupload");
// import { v2 as clouidanry } from "cloudinary";
const cloudinary = require("cloudinary").v2;
const app = express();

const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swaggerConfig');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

//Connect DB

mongoose
  .connect(`mongodb+srv://oguzadiguzel:${process.env.MONGO_DB_PASSWORD}@educal.tqhpwq9.mongodb.net/?retryWrites=true&w=majority&appName=educal`, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useFindAndModify: false,
    // useCreateIndex: true,
  })
  .then(() => {
    console.log("DB Connected Susccesfuly");
  });

// Template Engine
app.set("view engine", "ejs");

// Global Variable
global.userIN = null;

// Middlewares
// app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true }));
app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
);

// Routes
// app.use("*", (req, res, next) => {
//   userIN = req.session.userID;
//   next();
// });
app.use("/", pageRoute);
app.use("/courses", courseRoute);
app.use("/categories", categoryRoute);
app.use("/users", userRoute);
app.use('/blog', blogRoute)
// app.use(
//   "/api-docs",
//   swaggerUI.serve,
//   swaggerUI.setup(swaggerConfig.swaggerDocs)
// );


// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');
// const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig.swaggerDocs));

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(process.env.PORT, () => {
  console.log(`App started on port ${process.env.PORT}`);
});
