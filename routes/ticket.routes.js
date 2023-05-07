const express = require("express");

const kiemTra = require("../utils/config");
const {
  getTicketInfor,
  addTicketInforValidation,
  addTicketInforController,
  getTicketList,
  getTicketByPhone,
  renderTicket,
} = require("../controllers/ticket.controller");

const ticketRouter = express.Router();

// Lấy dữ liệu từ db
ticketRouter.get("/getTicketInfor", kiemTra, getTicketInfor);
ticketRouter.post(
  "/addTicketInfor",
  kiemTra,
  addTicketInforValidation,
  renderTicket
);
ticketRouter.get("/getTicketList", kiemTra, getTicketList);
ticketRouter.get("/getTicketByPhone", kiemTra, getTicketByPhone);

module.exports = ticketRouter;
