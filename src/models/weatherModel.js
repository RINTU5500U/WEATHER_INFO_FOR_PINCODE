const mongoose = require('mongoose')

const weatherSchema = new mongoose.Schema({
    coordinateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coordinate',
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    unixTime: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    country: {
        type: String,
        default: 'India'
    },
    pressure: {
        type: String,
        required: true
    },
    humidity: {
        type: String,
        required: true
    },
    temperature: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Weather', weatherSchema)