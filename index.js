const request = require('request')

const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const cors = require('cors')
app.use(cors())

app.use(function (req, res, next) {
  console.log('Time:', Date.now())
  console.log('Request URL:', req.originalUrl)
  console.log('Request Type:', req.method) 
  console.log('----')
  next()
})

app.get('/v1/spotify', async function (req, res) { 
  const token = process.env.SPOTIFY_ACCESS_TOKEN
  const url = 'https://api.spotify.com/v1/me/player'
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }

  request(url, headers, function (error, response, body) {
    res.send(body)
  });
})

app.listen(port, () => console.log(`🛰️  Listening on port ${port}`))
