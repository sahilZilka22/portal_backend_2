const express = require(`express`);
const { registerUser, authUser, searchUsers } = require("../controllers/userController.js");
const { protect } = require("../middleware/authMiddleware.js");
const router = express.Router();

router.route(`/`).post(registerUser);
router.route("/searchUsers").get(protect,searchUsers)
router.route(`/login`).post(authUser);

module.exports = router;