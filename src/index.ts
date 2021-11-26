import express from 'express'
import cors from 'cors'
import Spotify from './spotify'

const port = process.env.PORT || 3000
const app = express()
app.use(cors())

app.use(function (req, res, next) {
  console.log('Time:', Date.now())
  console.log('Request URL:', req.originalUrl)
  console.log('Request Type:', req.method) 
  console.log('----')
  next()
})

app.get('/v1/spotify', async function (req, res) { 
  return Spotify.fetchRecentlyPlayed()
    .then(played => res.send(played))
    .catch(error => {
      console.log(`Error: ${error}`)
      console.log('----')
      res.status(500).send({error: error.message})
    })
})

app.listen(port, () => console.log(`🛰️  Listening on port ${port}`))
