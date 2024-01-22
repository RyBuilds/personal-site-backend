import { Axios } from 'axios';
import StravaConfig from './model/StravaConfig';
import LatestActivity from './model/LatestActivity';
import { getAccessToken } from './token';

export const fetchLatestActivity = async (
  http: Axios,
  config: StravaConfig
): Promise<LatestActivity | undefined> => {
  const accessToken = await getAccessToken(http, config);
  const url = 'https://www.strava.com/api/v3/athlete/activities';
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  }
  
  const response = await http.get(url, { headers });

  if (!response.data || response.status !== 200) {
    throw new Error('Non 200 status received when fetching latest activity.');
  }

  const activity = response.data[0];
  return {
    name: activity.name,
    distance: activity.distance,
  }
}
