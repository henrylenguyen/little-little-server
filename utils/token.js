const jwt = require("jsonwebtoken");
const fs = require("fs");
const cookie = require("cookie");

const COOKIE_NAME = "my_app_token";

let token = null;
let tokenExpire = null;

function generateToken() {
const privateKey = fs.readFileSync("./config/private.pem");
token = jwt.sign({ name: "Lê Nguyễn Phương Thái" }, privateKey, {
algorithm: "RS256",
});
tokenExpire = new Date().getTime() + 6 * 30 * 24 * 60 * 60 * 1000; // hết hạn sau 6 tháng
}

function setTokenCookie(res) {
const cookieValue = cookie.serialize(COOKIE_NAME, token, {
httpOnly: true,
expires: new Date(tokenExpire),
});
res.setHeader("Set-Cookie", cookieValue);
}

function getToken(req, res) {
const cookies = cookie.parse(req.headers.cookie || "");
const savedToken = cookies[COOKIE_NAME];
if (savedToken && new Date().getTime() <= tokenExpire) {
token = savedToken;
return token;
} else {
generateToken();
setTokenCookie(res);
return token;
}
}

function getTokenRemainingTime() {
const currentTime = new Date().getTime();
const remainingTime = tokenExpire - currentTime;
const seconds = Math.floor(remainingTime / 1000);
const minutes = Math.floor(seconds / 60);
const hours = Math.floor(minutes / 60);

const remainingSeconds = seconds % 60;
const remainingMinutes = minutes % 60;

return `${hours} giờ ${remainingMinutes} phút ${remainingSeconds} giây`;
}

module.exports = { getToken, getTokenRemainingTime };