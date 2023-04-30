const express = require("express");
const { getToken, getTokenRemainingTime } = require("../utils/token.js");

const router = express.Router();

router.get("/get-token", (req, res) => {
  const token = getToken(req, res);
  const remainingTime = getTokenRemainingTime();
  res.json({ token, thoiGianHetHan: remainingTime });
});

module.exports = router;
