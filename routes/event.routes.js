const express = require("express");
const { getEventList, getEventInforByID } = require("../controllers/event.controller");
const kiemTra = require("../utils/config");

const eventRouter = express.Router();

// Lấy dữ liệu từ db
eventRouter.get("/getEventList", kiemTra, getEventList);
eventRouter.get("/getEventInforByID", kiemTra, getEventInforByID);

module.exports = eventRouter;
