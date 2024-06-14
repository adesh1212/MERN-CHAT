const express = require("express");
const isAuth = require("../Middleware/auth");
const { sendMessage, allMessages } = require("../Controllers/messageController");
const router = express.Router();

router.post('/',isAuth,sendMessage)
router.get('/:chatId',isAuth,allMessages)

module.exports = router;