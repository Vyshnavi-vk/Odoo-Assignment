const express = require('express')
const generateToken = require('../utils/generateToken')
const router = express.Router()
const { addTokenToDB, getAvailableRooms, bookRoom, filledTimings, getUserBookings } = require('../controllers/roomController')
const protected = require('../middleware/authMiddleware')

router.get('/token', addTokenToDB)
router.post('/', getAvailableRooms)
router.post('/times', filledTimings)
router.put('/:id', bookRoom)
router.get('/user-bookings', protected, getUserBookings)

module.exports = router