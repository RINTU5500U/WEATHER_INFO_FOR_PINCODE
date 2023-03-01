const express = require('express')
const router = express.Router()

const {getWeather} = require('../controllers/weatherController')

router.get('/getWeather', getWeather)
// router.all("/*", (req, res) => {
//     return res.status(400).send({ status: false, msg: "end point is not valid" });
// });

module.exports = router