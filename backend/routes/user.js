const express = require("express");
const router = express.Router();
const logout = require("../controllers/user");
const login = require("../controllers/user");
const upload = require("../controllers/user");
const referral = require("../controllers/user");
const commission = require("../controllers/user");
const notify = require("../controllers/user");
const user = require("../controllers/user");
const course = require("../controllers/user")
const courses = require("../controllers/user");
const coursedetails = require("../controllers/user");
const dcourse = require("../controllers/user");
const coursename = require("../controllers/user");
const maintenance = require("../controllers/user");
const changeuserpassword = require("../controllers/user");
const payout = require("../controllers/user");
const icon = require("../controllers/user");
const register = require("../controllers/user");
const mail = require("../controllers/user");
const editUser = require("../controllers/user");
const summarize = require("../controllers/user");
// payment options controllers
const createPaypalOrder = require("../controllers/user")
const confirmPaypalOrder = require("../controllers/user")
const payWithStripe = require("../controllers/user")
const sessionMiddleware = require("../middleware/session");

router.post("/register", sessionMiddleware, register);
router.post("/login", sessionMiddleware, login);
router.get("/logout", sessionMiddleware, logout);
router.post("/upload", sessionMiddleware, upload);
router.post("/referral", sessionMiddleware, referral);
router.post("/commission", sessionMiddleware, commission);
router.get("/notify", sessionMiddleware, notify);
router.post("/icon", sessionMiddleware, icon);
router.post("/payout", sessionMiddleware, payout);
router.post("/user", sessionMiddleware, user);
router.patch("/changeuserpassword", sessionMiddleware, changeuserpassword)
router.patch("/user", sessionMiddleware, user);
router.post("/mail", sessionMiddleware, mail);
router.post("/maintenance", sessionMiddleware, maintenance)
router.patch("/editUser", sessionMiddleware, editUser);
router.post("/createPaypalOrder", sessionMiddleware, createPaypalOrder);
router.post("/confirmPaypalOrder", sessionMiddleware, confirmPaypalOrder)
router.post("/payment-stripe", sessionMiddleware, payWithStripe);
router.post("/course", sessionMiddleware, course);
router.post("/courses", sessionMiddleware, courses);
router.post("/dcourse", sessionMiddleware, dcourse);
router.post("/coursedetails", sessionMiddleware, coursedetails);
router.post("/summarize", summarize);
router.post("/coursename", sessionMiddleware, coursename);



module.exports = router;