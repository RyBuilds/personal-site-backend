import axios, { Axios } from "axios";
import { fetchLatestActivity as fla } from "./fetch-latest-activity";
import { refreshAccessToken } from "./token";
import StravaConfig from "./model/StravaConfig";

export default class Strava {
  private http: Axios;
  private config: StravaConfig;

  constructor(config: StravaConfig) {
    this.http = axios.create();
    this.config = config;

    this.http.interceptors.response.use(undefined, async (error) => {
      const response = error.response;

      if (
        response?.status === 401 &&
        error.config && 
        !error.config.__isRetryRequest
      ) {
        try {
          console.log("this line works");
          const accessToken = await refreshAccessToken(this.http, this.config);
          console.log("this doesn't line works");
          console.log(`access token: ${accessToken}`);
          error.config.__isRetryRequest = true;
          error.config.headers = {
            ...error.config.headers,
            Authorization: `Bearer ${accessToken}`,
          };
          return this.http.request(error.config);
        } catch (authError) {
          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    });
  }

  fetchLatestActivity() {
    return fla(this.http, this.config);
  }
}