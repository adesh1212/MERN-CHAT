const express = require("express");
const {
  storeNotification,
  getNotifications,
  deleteNotification,
} = require("../Controllers/notificationController");
const isAuth = require("../Middleware/auth");
const router = express.Router();

router.post("/", isAuth, storeNotification);
router.get("/", isAuth, getNotifications);
router.delete("/:chat_id", isAuth, deleteNotification);

module.exports = router;
