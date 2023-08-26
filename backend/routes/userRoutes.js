const express = require(`express`);
const { registerUser, authUser, searchUsers } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.route(`/`).post(registerUser);
router.route("/searchUsers").get(protect,searchUsers)
router.route(`/login`).post(authUser);

module.exports = router;