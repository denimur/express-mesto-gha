const router = require('express').Router();
const {
  getUsers,
  updateUser,
  updateAvatar,
  getUser,
  getCurrentUser,
} = require('../controllers/users');

router.get('/me', getCurrentUser);
router.get('/', getUsers);
router.get('/:userId', getUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
