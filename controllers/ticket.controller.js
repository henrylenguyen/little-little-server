const moment = require("moment");
const Joi = require("joi");
const {
  addTicketInfor,
  createTicketPayment,
} = require("../models/ticket.model");
const { v4: uuidv4 } = require("uuid");
const db = require("../models/root.model");

const getTicketInfor = async (req, res) => {
  try {
    const snapshot = await db.collection("ticketInfor").get();
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

const addTicketInforValidation = (req, res, next) => {
  const schema = Joi.object({
    amount: Joi.number().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    expiry: Joi.string().required(),
    name: Joi.string().required(),
    paymentAmount: Joi.number().required(),
    ticketRef: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(422).json({ error: error.details[0].message });
  }
  next();
};
const renderTicket = async (req, res) => {
  try {
    const { amount, expiry, phone, ticketRef } = req.body;

    // Kiểm tra nếu `amount` không phải là một số
    if (typeof amount !== "number") {
      return res.status(400).json({
        message: "Số lượng vé phải là số",
      });
    }

    // Tạo số lượng vé tương ứng trong bảng ticketPayment
    const ticketPaymentRefs = [];
    const now = new Date();
    const currentDate = now.getDate();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    for (let i = 0; i < amount; i++) {
      const ticketID = `ALT${currentDate}${currentMonth}${currentYear}${uuidv4()}`;

      const ticketPayment = {
        ID: ticketID,
        expiry: expiry,
        phone: phone,
        ticketType: ticketRef,
      };

      const ticketPaymentRef = await createTicketPayment(ticketPayment);
      ticketPaymentRefs.push(db.doc(`/ticketPayment/${ticketPaymentRef}`));

      console.log(
        "file: ticket.controller.js:75 ~ ticketPaymentRef:",
        ticketPaymentRef
      );
    }

    // Gọi hàm addTicketInforController để tạo cột ticketPaymentRef
    req.body.ticketPaymentRef = ticketPaymentRefs;

    return addTicketInforController(req, res);
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      message: "Có lỗi xảy ra",
    });
  }
};

const addTicketInforController = async (req, res) => {
  try {
    const { ticketRef } = req.body;
    const now = new Date();
    const datePayment = now.toISOString();

    // Truy vấn dữ liệu từ Firestore với điều kiện `ticketID` bằng `ticketRef`
    const snapshot = await db
      .collection("ticketInfor")
      .where("ticketID", "==", ticketRef)
      .get();

    console.log("file: ticket.controller.js:54 ~ snapshot:", snapshot);

    // Kiểm tra nếu không tìm thấy dữ liệu
    if (snapshot.empty) {
      return res.status(404).json({
        message: "ticketRef không hợp lệ",
      });
    }

    const ticketInforRef = snapshot.docs[0].ref;

    const ticket = {
      ...req.body,
      ticketInfor: ticketInforRef,
      datePayment: datePayment,
    };

    const id = await addTicketInfor(ticket);
    console.log("file: ticket.controller.js:126 ~ id:", id);

    // --------------LẤY RA TOÀN BỘ CÁC VÉ ĐÃ ĐẶT----------------
    const ticketPaymentRefs = ticket.ticketPaymentRef;

    // Lặp qua để lấy value của bảng đó
    const ticketPaymentPromises = ticketPaymentRefs.map((ticketPaymentRef) => {
      return ticketPaymentRef.get();
    });

    const ticketPaymentDocs = await Promise.all(ticketPaymentPromises);

    const ticketPayments = ticketPaymentDocs.map((ticketPaymentDoc) => {
      return ticketPaymentDoc.data();
    });

    // --------------LẤY RA THÔNG TIN VÉ ĐẶT----------------
    const ticketInforDoc = await ticket.ticketInfor.get();
    const ticketInforData = ticketInforDoc.data();

    console.log("Dữ liệu ticketInfor:", ticketInforData);

    const { ticketPaymentRef,ticketRef:TicketRef,datePayment:DatePayment, ...rest } = ticket;
    return res.status(200).json({
      message: "Thanh toán thành công",
      datePayment: moment(datePayment).format("DD/MM/YYYY hh:mm:ss"),
      content: {
        id:id,
        ...rest,
        ticketInfor: ticketInforData,
        ticketPayment: ticketPayments,
      },
    });
  } catch (error) {
    console.log("file: ticket.controller.js:72 ~ error:", error);
    return res.status(500).json({
      message: "Có lỗi xảy ra",
    });
  }
};

const getTicketList = async (req, res) => {
  try {
    const snapshot = await db.collection("ticket").get();
    const docs = [];

    for (const doc of snapshot.docs) {
      const ticketInforRef = doc.data().ticketInfor;
      const ticketInforSnapshot = await ticketInforRef.get();

      const data = doc.data();
      data.ticketInfor = ticketInforSnapshot.data();
      data.expiry = moment(data.expiry).format("DD/MM/YYYY");
      data.datePayment = moment(data.datePayment).format("DD/MM/YYYY");

      docs.push(data);
    }

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

const getTicketByPhone = async (req, res) => {
  try {
    const phone = req.query?.phone;
    const currentDate = moment().format("YYYY-MM-DD");
    const snapshot = await db
      .collection("ticket")
      .where("phone", "==", phone)
      .where("datePayment", ">=", currentDate)
      .orderBy("datePayment", "desc")
      .limit(1)
      .get();
    const docs = [];

    for (const doc of snapshot.docs) {
      const ticketInforRef = doc.data().ticketInfor;
      const ticketInforSnapshot = await ticketInforRef.get();

      const data = doc.data();
      data.ticketInfor = ticketInforSnapshot.data();
      data.expiry = moment(data.expiry).format("DD/MM/YYYY");
      data.datePayment = moment(data.datePayment).format("DD/MM/YYYY");
      docs.push(data);
    }

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

module.exports = {
  getTicketInfor,
  addTicketInforValidation,
  addTicketInforController,
  getTicketList,
  getTicketByPhone,
  renderTicket,
};
