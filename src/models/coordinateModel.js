const mongoose = require('mongoose')

const coordinateSchema = new mongoose.Schema({
    pincode: {
        type: String,
        required: true
    },
    latitude: {
        type: String,
        // required: true,
        unique: true
    },
    longitude: {
        type: String,
        required: true,
        // unique: true
    }
})

module.exports = mongoose.model('Coordinate', coordinateSchema)