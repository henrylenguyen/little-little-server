const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
dotenv.config();
const app = express();
const port = process.env.PORT;
const bodyParser = require("body-parser");
const swaggerSetup = require("./swagger/swagger.js")
const router = require("./routes/token.routes.js");
const eventRouter = require("./routes/event.routes.js");
const contactRouter = require("./routes/contact.routes.js");
const ticketRouter = require("./routes/ticket.routes.js");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use((req, res, next) => {
  res.header(`Access-Control-Allow-Origin`, `*`);
  res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
  res.header(
    `Access-Control-Allow-Headers`,
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

async function startServer() {
  app.use(morgan("dev"));

  app.use("/api", router);
  app.use("/api/event", eventRouter);
  app.use("/api/contact", contactRouter);
  app.use("/api/ticket", ticketRouter);
  // Set up Swagger middleware
  swaggerSetup(app);
  app.listen(port, () => {
    console.log(
      `Server đang chạy ở cổng http://localhost:${port}, click vào để xem`
    );
  });
}

startServer();
