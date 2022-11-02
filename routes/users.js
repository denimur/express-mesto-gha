const router = require('express').Router();
const {
  getUsers,
  updateUser,
  updateAvatar,
  getUser,
  getCurrentUser,
} = require('../controllers/users');
const { celebrateUserParams, celebrateUpdateUser, celebrateUpdateAvatar } = require('../utils/validation');

router.get('/me', getCurrentUser);
router.get('/', getUsers);
router.get('/:userId', celebrateUserParams(), getUser);
router.patch('/me', celebrateUpdateUser(), updateUser);
router.patch('/me/avatar', celebrateUpdateAvatar(), updateAvatar);

module.exports = router;
