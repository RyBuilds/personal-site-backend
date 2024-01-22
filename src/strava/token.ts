import { Axios } from 'axios';
import StravaConfig from './model/StravaConfig';

let stravaAccessToken: string | undefined;

export const refreshAccessToken = async (
  http: Axios,
  config: StravaConfig
) => {
  console.log('Refreshing access token');
  console.log('----');

  const url = 'https://www.strava.com/api/v3/oauth/token';
  const auth = {
    client_id: config.clientId,
    client_secret: config.secret,
    grant_type: 'refresh_token',
    refresh_token: config.refreshToken, 
  }

  try {
    console.log("1");
    const r = await http.post(url, auth);
    console.log("2");
    if (!r.data || r.status != 200) {
      console.log(r)
      console.log(`Failed to refresh token - ${r.data}`);
      return;
    }
    stravaAccessToken = r.data.access_token;
    return stravaAccessToken;
  } catch (e) {
    console.log(e)
  }
}

export const getAccessToken = async (http: Axios, config: StravaConfig) => {
  return stravaAccessToken
    ? stravaAccessToken
    : await refreshAccessToken(http, config);
}
