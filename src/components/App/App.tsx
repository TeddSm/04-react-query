import { useState } from "react";
import ReactPaginate from "react-paginate";
import toast, { Toaster } from "react-hot-toast";
import css from "./App.module.css";
import SearchBar from "../SearchBar/SearchBar";
import { fetchMovies } from "../../services/movieService";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import type { Movie } from "../../types/movie";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const loadMovies = async (searchQuery: string, pageNumber: number) => {
    if (!searchQuery.trim()) {
      setMovies([]);
      setTotalPages(0);
      return;
    }

    try {
      setIsLoading(true);
      setIsError(false);

      const data = await fetchMovies(searchQuery, pageNumber);

      if (data.results.length === 0) {
        toast.error("No movies found for your request.");
        setMovies([]);
        setTotalPages(0);
      } else {
        setMovies(data.results);
        setTotalPages(data.total_pages);
      }
    } catch (error) {
      console.error("Search error:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setPage(1);
    loadMovies(searchQuery, 1);
  };

  const handlePageClick = ({ selected }: { selected: number }) => {
    const newPage = selected + 1;
    setPage(newPage);
    loadMovies(query, newPage);
  };

  const handleCloseModal = () => setSelectedMovie(null);

  return (
    <div>
      <SearchBar onSubmit={handleSearch} />
      <Toaster />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={handlePageClick}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      <MovieGrid movies={movies} onSelect={setSelectedMovie} />
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}
