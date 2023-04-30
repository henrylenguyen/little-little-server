const fs = require("fs");
const jwt = require("jsonwebtoken");

const kiemTra = (req, res, next) => {
  console.log(req.headers);
  const authHeader = req.headers["authorization"];
  // bearer
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  try {
    var cert;
    try {
      cert = fs.readFileSync("./config/publickey.crt"); // get public key
    } catch (error) {
      throw new Error("Không đọc được key public");
    }
    try {
      jwt.verify(
        token,
        cert,
        { algorithms: ["RS256"] },
        function (err, payload) {
          if (err) {
            return res.status(403).json("Token không hợp lệ");
          }
          next();
        }
      );
    } catch (err) {
      console.error(err);
      return res.status(500).json("Lỗi xác thực token");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json("Lỗi server");
  }
};

module.exports = kiemTra ;
