import axios, { Axios } from "axios";
import { fetchRecentlyPlayed as frp } from "./fetch-recently-played";
import { refreshAccessToken } from "./token";
import SpotifyConfig from "./model/SpotifyConfig";

export default class Spotify {
  private http: Axios;
  private config: SpotifyConfig;

  constructor(confg: SpotifyConfig) {
    this.http = axios.create();
    this.config = confg;

    this.http.interceptors.response.use(undefined, async (error) => {
      const response = error.response;

      if (
        response?.status === 401 &&
        error.config &&
        !error.config.__isRetryRequest
      ) {
        try {
          const accessToken = await refreshAccessToken(this.http, this.config);
          error.config.__isRetryRequest = true;
          error.config.headers = {
            ...error.config.headers,
            Authorization: `Bearer ${accessToken}`,
          };
          return this.http.request(error.config);
        } catch (authError) {
          // refreshing has failed, but report the original error, i.e. 401
          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    });
  }

  fetchRecentlyPlayed() {
    return frp(this.http, this.config);
  }
}
