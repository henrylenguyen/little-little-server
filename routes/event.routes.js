const express = require("express");
const { getEventList } = require("../controllers/event.controller");
const kiemTra = require("../utils/config");

const eventRouter = express.Router();

// Lấy dữ liệu từ db
eventRouter.get("/getEventList", kiemTra, getEventList);

module.exports = eventRouter;
