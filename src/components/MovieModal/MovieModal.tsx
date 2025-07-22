import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { Movie } from "../../types/movie";
import css from "./MovieModal.module.css";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div className={css.backdrop} onClick={handleBackdropClick}>
      <div className={css.modal}>
        <button className={css.closeButton} onClick={onClose}>
          ✖
        </button>
        <img
          className={css.image}
          src={
            movie.backdrop_path
              ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
              : "https://via.placeholder.com/500x750?text=No+Image"
          }
          alt={movie.title}
        />
        <div className={css.content}>
          <h2>{movie.title}</h2>
          <p>
            <strong>Release:</strong> {movie.release_date}
          </p>
          <p>
            <strong>Rating:</strong> {movie.vote_average}
          </p>
          <p>{movie.overview}</p>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
