const express = require(`express`);
const { protect } = require("../middleware/authMiddleware.js");
const { checkandSubmitUser, authUserNew, searchUsers } = require("../controllers/newUserController.js");

const router = express.Router();

router.route(`/`).post(checkandSubmitUser);
router.route("/getuser").post(authUserNew);
router.route("/searchUsers").get(protect, searchUsers);


module.exports = router;
