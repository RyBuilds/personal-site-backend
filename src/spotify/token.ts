import axios from 'axios';
import FormData from 'form-data';
import qs from 'qs';

const spotifySecret = process.env.SPOTIFY_SECRET;
const spotifyClientId = process.env.SPOTIFY_CLIENT_ID;
const spotifyRefreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
let spotifyAccessToken: string | undefined;

export const refreshAccessToken = async () => {
  console.log('Refreshing access token')
  console.log('----')

  const url = 'https://accounts.spotify.com/api/token'
  const auth = Buffer.from(`${spotifyClientId}:${spotifySecret}`, 'binary').toString('base64');
  const form = {grant_type:'refresh_token', refresh_token: spotifyRefreshToken}
  const headers = {
    'content-type': 'application/x-www-form-urlencoded', 
    Authorization: `Basic ${auth}`
  }

  const r = await axios.post(url, qs.stringify(form), { headers });
  if (!r.data || r.status != 200) {
    console.log(`Failed to refresh token - ${r.data}`);
    return;
  }
  spotifyAccessToken = r.data.access_token;
  return spotifyAccessToken;
}

export const getAccessToken = async () => {
  return spotifyAccessToken ? spotifyAccessToken : await refreshAccessToken()
}
