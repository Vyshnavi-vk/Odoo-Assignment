const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const database = mongoose.connection.useDb('test')
const collection = database.collection('Session')


const protected = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) return res.sendStatus(403);

    try {
        const session = await collection.findOne({ token });

        if (!session) return res.sendStatus(403);

        req.token = session;
        next();
    } catch (err) {
        res.sendStatus(403);
    }
};

module.exports = protected