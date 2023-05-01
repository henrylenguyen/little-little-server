const Joi = require("joi");
const { addContact, getContact } = require("../models/contact.model");
const moment = require("moment");
const db = require("../models/root.model");

const addContactValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    message: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(422).json({ error: error.details[0].message });
  }
  next();
};

const addContactController = async (req, res) => {
  try {
    const contact = req.body;
    await addContact(contact);
    return res.status(200).json({
      message: "Gửi liên hệ thành công",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Có lỗi xảy ra",
    });
  }
};
const getContactList = async (req, res) => {
  try {
      const snapshot = await db.collection("contact").get();
    const docs = snapshot.docs.map((doc) => ({
      ...doc.data(),
    }));

    res.json({
      message: "Lấy dữ liệu thành công",
      content: docs,
      currentDate: moment().format("DD/MM/YYYY"),
    });
  } catch (error) {
    console.log("Lỗi khi lấy dữ liệu:", error);
    res.status(500).json({
      message: "Lấy dữ liệu thất bại",
      currentDate: moment().format("DD/MM/YYYY"),
    });
  }
};
const getContactDetail = async (req, res) => {
  try {
      const snapshot = await db.collection("contactDetail").get();
      console.log("file: contact.controller.js:57 ~ snapshot:", snapshot)
    const docs = snapshot.docs.map((doc) => ({
      ...doc.data(),
    }));

    res.json({
      message: "Lấy dữ liệu thành công",
      content: docs[0],
      currentDate: moment().format("DD/MM/YYYY"),
    });
  } catch (error) {
    console.log("Lỗi khi lấy dữ liệu:", error);
    res.status(500).json({
      message: "Lấy dữ liệu thất bại",
      currentDate: moment().format("DD/MM/YYYY"),
    });
  }
};
module.exports = {
  addContactValidation,
  addContactController,
  getContactList,
  getContactDetail,
};
