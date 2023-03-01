const weatherModel = require('../models/weatherModel')
const coordinateModel = require('../models/coordinateModel')
const request = require('request');
const latLong = require('pincode-lat-long')
const moment = require('moment')
const API_KEY = `924c8b1fa29c60984fd73361626345e4`

module.exports = {
    getWeather : async (req, res) => {
        try {
            const {pincode, date} = req.query
            const lat = latLong.getlatlong(pincode).lat
            const lon = latLong.getlatlong(pincode).long
            const unixTime = moment(date).unix()
            const weatherData = await weatherModel.findOne({pincode: pincode, date: date, unixTime: unixTime})
            if (weatherData) {
                res.status(200).send({ status: true, msg: 'Data from DB', Weather: weatherData})
            } else {
                // let url = `http://api.openweathermap.org/data/2.5/weather?zip=${pincode},in&appid=${API_KEY}`  [for call by pincode only]
                let url = `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${unixTime}&appid=${API_KEY}` // [for one call 3.0]
                request(url, async (err, response, body) => {
                    if (err) {
                        res.send(err)
                    } else {
                        let weather = JSON.parse(body)  
                        if (weather.current == undefined) {
                            res.send('Failed to load details')
                        } else {
                            const findCoordinate = await coordinateModel.findOne({pincode})
                            if (findCoordinate) {
                                const data = {
                                    coordinateId: findCoordinate._id,
                                    pincode : pincode,
                                    date : date,
                                    unixTime : unixTime,
                                    description : weather.weather[0].description,
                                    // country : req.body.country
                                    pressure : weather.current.pressure,
                                    humidity : weather.current.humidity,
                                    temperature : weather.current.temp
                                }
                                const weatherData = await weatherModel.create(data)
                                res.status(201).send({ status: true, msg: 'Weather data created successfully', Data: weatherData})
                            } else {
                                const coordinateData = {
                                    pincode : pincode,
                                    latitude : lat,
                                    longitude : lon
                                }
                                const saveCoordinate = await coordinateModel.create(coordinateData)
                                const data = {
                                    coordinateId: saveCoordinate._id,
                                    pincode : pincode,
                                    date : date,
                                    unixTime : unixTime,
                                    description : weather.weather[0].description,
                                    // country : req.body.country
                                    pressure : weather.current.pressure,
                                    humidity : weather.current.humidity,
                                    temperature : weather.current.temp
                                }
                                const weatherData = await weatherModel.create(data)
                                res.status(201).send({ status: true, msg: 'Weather data created successfully', Data: weatherData})
                            }
                        }
                    }
                })
            }
        } catch (error) {
            res.status(500).send({status: false, error: error.message})
        }
    }
}
