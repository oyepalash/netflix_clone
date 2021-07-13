import "./Row.css";
import React, { useState, useEffect } from "react";
import axios from "./axios";
import Youtube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url = "http://image.tmdb.org/t/p/original";
function Row(props) {
  const [movies, setMovies] = useState([]);
  const [trailerURL, setTrailerURL] = useState("");
  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(props.fetchURL);
      setMovies(request.data.results);
    }
    fetchData();
  }, [props.fetchURL]);

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  function handleClick(movie) {
    if (trailerURL) {
      setTrailerURL("");
    } else
      setTrailerURL(
        movieTrailer(movie?.name || "")
          .then((url) => {
            const urlParams = new URLSearchParams(new URL(url).search);
            setTrailerURL(urlParams.get("v"));
          })
          .catch((error) => console.log(error))
      );
  }

  return (
    <div className="row">
      <h2>{props.title}</h2>
      <div className="row_posters">
        {movies.map((movie) => {
          return (
            <img
              key={movie.id}
              onClick={() => handleClick(movie)}
              className={`row_poster ${props.isLargeRow && "row_large"}`}
              src={`${base_url}${
                props.isLargeRow ? movie.poster_path : movie.backdrop_path
              }`}
              alt={movie.name}
            />
          );
        })}
      </div>
      {trailerURL && <Youtube videoId={trailerURL} opts={opts} />}
    </div>
  );
}

export default Row;