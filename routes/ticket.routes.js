const express = require("express");

const kiemTra = require("../utils/config");
const { getTicketInfor } = require("../controllers/ticket.controller");

const ticketRouter = express.Router();

// Lấy dữ liệu từ db
ticketRouter.get("/getTicketInfor", kiemTra, getTicketInfor);

module.exports = ticketRouter;
