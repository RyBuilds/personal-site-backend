import express from "express";
import cors from "cors";
import Spotify from "./spotify";
import Strava from "./strava";

const port = process.env.PORT || 3000;
const app = express();
app.use(cors());

const spotify = new Spotify({
  secret: process.env.SPOTIFY_SECRET ?? "",
  clientId: process.env.SPOTIFY_CLIENT_ID ?? "",
  refreshToken: process.env.SPOTIFY_REFRESH_TOKEN ?? "",
});

const strava = new Strava({
  secret: process.env.STRAVA_SECRET ?? "",
  clientId: process.env.STRAVA_CLIENT_ID ?? "",
  refreshToken: process.env.STRAVA_REFRESH_TOKEN ?? "",
});

app.use(function (req, res, next) {
  console.log("Time:", Date.now());
  console.log("Request URL:", req.originalUrl);
  console.log("Request Type:", req.method);
  console.log("----");
  next();
});

app.get("/v1/spotify", async function (req, res) {
  return spotify
    .fetchRecentlyPlayed()
    .then((played) => res.send(played))
    .catch((error) => {
      console.log(`Error: ${error}`);
      console.log("----");
      res.status(500).send({ error: error.message });
    });
});

app.get("/v1/strava", async function (req, res) {
  return strava
    .fetchLatestActivity()
    .then((activity) => res.send(activity))
    .catch((error) => {
      console.log(`Error: ${error}`);
      console.log("----");
      res.status(500).send({ error: error.message });
    });
})

app.listen(port, () => console.log(`🛰️  Listening on port ${port}`));
