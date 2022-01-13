import { Axios } from "axios";
import RecentlyPlayed from "./model/RecentlyPlayed";
import SpotifyConfig from "./model/SpotifyConfig";
import { getAccessToken } from "./token";

export const fetchRecentlyPlayed = async (
  http: Axios,
  config: SpotifyConfig
): Promise<RecentlyPlayed | undefined> => {
  const accessToken = await getAccessToken(http, config);
  const url = "https://api.spotify.com/v1/me/player/recently-played";
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  const response = await http.get(url, { headers });

  if (!response.data || response.status !== 200) {
    throw new Error("Non 200 status received when fetching recently played.");
  }

  const track = response.data.items[0].track;
  return {
    name: track.name,
    url: track.external_urls.spotify,
    imageUrl: track.album.images[0].url,
    previewUrl: track.preview_url,
    artistName: track.album.artists[0].name,
  };
};
