const db = require("../models/root.model");
const moment = require("moment");

const getEventList = async (req, res) => {
  try {
    const snapshot = await db.collection("event").get();
    const docs = snapshot.docs.map((doc) => ({
      ...doc.data(),
      dateStart: moment(doc.data().dateStart.toDate()).format("DD/MM/YYYY"),
      dateEnd: moment(doc.data().dateEnd.toDate()).format("DD/MM/YYYY"),
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
const getEventInforByID = async (req, res) => {
  try {
    const query = parseInt(req.query.eventID);
    const snapshot = await db
      .collection("event")
      .where("eventID", "==", query)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({
        message: "Không tìm thấy sự kiện với ID này",
        currentDate: moment().format("DD/MM/YYYY"),
      });
    }

    const data = {
      ...snapshot.docs[0].data(),
      dateStart: moment(snapshot.docs[0].data().dateStart.toDate()).format(
        "DD/MM/YYYY"
      ),
      dateEnd: moment(snapshot.docs[0].data().dateEnd.toDate()).format(
        "DD/MM/YYYY"
      ),
    };

    res.json({
      message: "Lấy dữ liệu thành công",
      content: data,
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

module.exports = { getEventList, getEventInforByID };
