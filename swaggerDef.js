const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Educal Api",
      vercion: "1.0.0",
      description: "Educal Api Docs",
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