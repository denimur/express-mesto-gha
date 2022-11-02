const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const { notFoundController } = require('../controllers/notFoundController');
const { celebrateCreateUser, celebrateLogin } = require('../utils/validation');
const auth = require('../middlewares/auth');

const userRouter = require('./users');
const cardRouter = require('./cards');

router.post('/signup', celebrateCreateUser(), createUser);
router.post('/signin', celebrateLogin(), login);

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use(notFoundController);

module.exports = router;
