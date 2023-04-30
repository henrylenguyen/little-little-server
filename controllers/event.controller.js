const db = require("../models/root.model");
const moment = require("moment");

const getEventList = async (req, res) => {
  try {
    const snapshot = await db.collection("event").get();
    const docs = snapshot.docs.map((doc) => ({
      // id: doc.id,
      ...doc.data(),
      dateStart: moment(doc.data().dateStart.toDate()).format("DD/MM/YYYY"),
      dateEnd: moment(doc.data().dateEnd.toDate()).format("DD/MM/YYYY"),
    }));

    res.json({
      message: "Lấy dữ liệu thành công",
      data: docs,
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
module.exports = { getEventList };
