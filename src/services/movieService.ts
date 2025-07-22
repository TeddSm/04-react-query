import axios from "axios";
import type { Movie } from "../types/movie";

const API_URL = "https://api.themoviedb.org/3/search/movie";
const API_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

interface MovieSearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export async function fetchMovies(
  query: string,
  page: number = 1
): Promise<MovieSearchResponse> {
  if (!query.trim()) {
    return {
      page: 0,
      results: [],
      total_pages: 0,
      total_results: 0,
    };
  }

  const options = {
    method: "GET",
    url: API_URL,
    params: {
      query,
      include_adult: false,
      language: "en-US",
      page,
    },
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + API_TOKEN,
    },
  };

  const response = await axios.request<MovieSearchResponse>(options);

  return response.data;
}
