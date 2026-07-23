const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const UserFileController = require('../controllers/userFileController');

router.use(requireAuth);
router.get('/', UserFileController.list);
router.post('/', UserFileController.create);
router.put('/:id', UserFileController.update);
router.delete('/:id', UserFileController.remove);

module.exports = router;
