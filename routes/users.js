const router = require("express").Router();
const {
  getUsers,
  createUser,
  updateUser,
  updateAvatar,
  getUser,
} = require("../controllers/users");

router.get("/", getUsers);
router.get("/:userId", getUser);
router.post("/", createUser);
router.patch("/me", updateUser);
router.patch("/me/avatar", updateAvatar);

module.exports = router;
