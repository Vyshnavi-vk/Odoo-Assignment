const generateToken = require("../utils/generateToken")
const cookie = require('cookie-parser')
const mongoose = require('mongoose')
const { ObjectId } = require('mongodb')


const database = mongoose.connection.useDb('test')
const collection = database.collection('RoomBooking')

const addTokenToDB = async (req, res) => {
    try {
        const token = generateToken(new Date())
        const addToken = { token }
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV = 'development'
        })

        res.status(200).send(token)
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}


const getAvailableRooms = async (req, res) => {
    try {
        const { start, end } = req.body
        const rooms = await collection.find({}).toArray()
        const availableRooms = rooms.filter((room) => start === room.start && end === room.end && room.isAvailable === 'true')
        res.status(200).json(availableRooms)
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}


const bookRoom = async (req, res) => {
    const { id } = req.params;
    const { on, time } = req.body;
    const [start, end] = time.split('-');

    try {
        const client = await mongoose.connect(process.env.MONGO_URI);
        const database = mongoose.connection.useDb('test')
        const roomsCollection = database.collection('RoomBooking');
        const room = await roomsCollection.findOneAndUpdate(
            { _id: new ObjectId(id), on, start, end },
            { $set: { isAvailable: "false" } },
            { returnOriginal: 'after' }
        );

        res.status(200).json({ msg: "Record updated", room });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



const filledTimings = async (req, res) => {
    try {
        const { on, start, end } = req.body
        const rooms = await collection.find({}).toArray()
        const filledTimes = rooms.filter((room) => room.on === on && room.isAvailable === 'false')
        let output
        filledTimes.map((time) => {
            output = time.start + '-' + time.end
        })
        res.status(200).json(output)
    } catch (error) {
        res.status(500).send(error)
    }
}


const getUserBookings = async (req, res) => {
    const token = req.token.token

    try {
        const bookings = await collection.find({ token, isAvailable: "false" }).toArray();

        if (bookings.length === 0) {
            return res.status(404).json({ error: 'No bookings found for this user' });
        }

        res.status(200).json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports = { addTokenToDB, getAvailableRooms, bookRoom, filledTimings, getUserBookings }