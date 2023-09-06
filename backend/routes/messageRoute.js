const express = require("express");
const { allMessages, sendMessage } = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/:chatId").get(protect,allMessages);
router.route("/new").post(protect,sendMessage);

module.exports = router;