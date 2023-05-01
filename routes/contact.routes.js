const express = require("express");

const kiemTra = require("../utils/config");
const { addContactValidation, addContactController, getContactList, getContactDetail } = require("../controllers/contact.controller");

const contactRouter = express.Router();

// Gửi liên hệ vào firestore
contactRouter.post(
  "/addContact",
  kiemTra,
  addContactValidation,
  addContactController
);
// lấy danh sách liên hệ từ firestore
contactRouter.get("/getContactList", kiemTra, getContactList);
// Lấy thông tin liên hệ
contactRouter.get("/getContactInfor", kiemTra, getContactDetail);

module.exports = contactRouter;
