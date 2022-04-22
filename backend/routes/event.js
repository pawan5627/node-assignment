const express = require('express');
const router = express.Router();

const { allEvents, addEvent } = require('../controllers/event')

const {verifyToken, authorizeRoles} = require("../middlewares/authentication");

router.post('/addevent', addEvent)

router.get('/allevents', allEvents)

module.exports = router;