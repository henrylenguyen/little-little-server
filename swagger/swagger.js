const { serve, setup } = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const options = {
  customSiteTitle: "API LITTLE & LITTLE",
  customCss: ".topbar-wrapper img",
  // Add securityDefinitions for JWT authentication
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "Authorization",
      scheme: "bearer",
      in: "header",
    },
  },
  // Add security for all paths by default
  security: [
    {
      bearerAuth: [],
    },
  ],
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:1812",
        description: "Local server",
      },
      {
        url: "https://little-little.herokuapp.com",
        description: "Server heroku",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

module.exports = function (app) {
  // Set up Swagger middleware
  app.use("/", serve, setup(swaggerDocument, options));
};
