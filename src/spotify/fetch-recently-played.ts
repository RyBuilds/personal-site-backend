import axios from "axios";
import { RecentlyPlayed } from "./model/RecentlyPlayed"
import { getAccessToken, refreshAccessToken } from "./token"

let hasRefreshedToken = false
export const fetchRecentlyPlayed = async (): Promise<RecentlyPlayed | undefined> =>{
  const accessToken = await getAccessToken()
  const url = 'https://api.spotify.com/v1/me/player/recently-played'
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }

  const response = await axios.get(url, {headers})
  
  if (response.status === 401 && !hasRefreshedToken) {
    hasRefreshedToken = true
    await refreshAccessToken();
    return fetchRecentlyPlayed();
  }

  if (!response.data || response.status !== 200) {
    hasRefreshedToken = false
    throw new Error("Non 200 status received when fetching recently played.")
  }

  const track = response.data.items[0].track
  const recentlyPlayed = {
    name: track.name,
    url: track.external_urls.spotify,
    imageUrl: track.album.images[0].url,
    previewUrl: track.preview_url
  }

  hasRefreshedToken = false
  return recentlyPlayed;
}
