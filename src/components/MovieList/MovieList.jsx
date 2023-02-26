import React from "react";
import MovieItem from "../MovieItem/MovieItem";
import "./MovieList.css";

function MovieList({ moviesData, onRate }) {
  const elem = moviesData.map((item) => (
    <MovieItem
      key={item.id}
      img={item.backdrop_path}
      title={item.title}
      overview={item.overview}
      date={item.release_date}
      genreId={item.genre_ids}
      vote={item.vote_average}
      idForRate={item.id}
      onRate={onRate}
      rateMovie={item}
    />
  ));
  return <ul className="all-content">{elem}</ul>;
}

export default MovieList;
