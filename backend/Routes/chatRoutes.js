const express = require("express");
const isAuth = require("../Middleware/auth");
const { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup } = require("../Controllers/chatController");
const router = express.Router();

router.post("/",isAuth, accessChat);
router.get("/",isAuth, fetchChats);
router.post("/group",isAuth, createGroupChat);
router.put("/rename",isAuth, renameGroup);
router.put("/groupadd",isAuth, addToGroup);
router.put("/groupremove",isAuth, removeFromGroup);


module.exports = router;