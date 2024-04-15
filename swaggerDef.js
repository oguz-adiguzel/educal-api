const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Smart Edu",
      vercion: "1.0.0",
      description: "SmartEdu api",
    },
    servers: [
      {
        url: "http:localhost:3001",
      },
    ],
  },
  apis: ["./routes/userRoute.js"],
};

const swaggerDocs = swaggerJsDoc(options)
module.exports ={
    swaggerDocs : swaggerDocs
}