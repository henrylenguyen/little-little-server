const db = require("../models/root.model");
const moment = require("moment");

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
module.exports = { getTicketInfor };
