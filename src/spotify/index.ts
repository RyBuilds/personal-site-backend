import axios, { Axios } from 'axios'
import { fetchRecentlyPlayed as frp } from "./fetch-recently-played"
import { refreshAccessToken } from './token'
import SpotifyConfig from './model/SpotifyConfig'

export default class Spotify {
  private http: Axios
  private config: SpotifyConfig

  constructor(confg: SpotifyConfig) {
		this.http = axios.create()
    this.config = confg

    this.http.interceptors.response.use(undefined, async error => {
			const response = error.response

      if (response?.status === 401 && error.config && !error.config.__isRetryRequest) {
        try {
          await refreshAccessToken(this.http, this.config)
        } catch (authError) {
          // refreshing has failed, but report the original error, i.e. 401
          return Promise.reject(error)
        }
        
        // retry the original request
        error.config.__isRetryRequest = true
        return this.http.request(error.config)
      }
			
      return Promise.reject(error)
    })
  }

  fetchRecentlyPlayed() {
    return frp(this.http, this.config)
  }
}
