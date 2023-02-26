import React from "react";
import "./MovieItem.css";
import { format } from "date-fns";
import truncate from "../../utils/truncate";
import { Consumer } from "../../context/genreContext";
import { Progress, Rate } from "antd";
import changeColor from "../../utils/changeColor";
import movieService from "../../services/services";

function MovieItem({ img, title, overview, date, genreId, vote, idForRate }) {
  const Images = "https://image.tmdb.org/t/p/original";
  const NoImg = "/images/no4.svg";
  return (
    <Consumer>
      {(genres) => (
        <li className="wrapper">
          <section className="visual">
            <img className="visual__image" src={img ? `${Images}${img}` : `${NoImg}`} alt="img" />
          </section>
          <section className="content">
            <Progress
              type="circle"
              percent={vote * 10}
              format={(percent) => (percent / 10).toFixed(1)}
              strokeColor={changeColor(vote)}
              className="movie-info__rate"
            />
            <div className="box">
              <h1 className="box__title">{title}</h1>
              <p className="box__date">
                {date ? format(new Date(date), "MMM dd, yyyy") : "No data"}
              </p>
              {genres.map((el) => {
                if (genreId.includes(el.id)) {
                  return (
                    <p className="box__genre" key={el.id}>
                      {el.name}
                    </p>
                  );
                }
                return null;
              })}
              <p className="box__text">{truncate(overview)}</p>
              <div className="box__star">
                <Rate
                  allowHalf
                  count="10"
                  onChange={(star) => {
                    movieService.postMovieRating(idForRate, star);
                  }}
                />
              </div>
            </div>
          </section>
        </li>
      )}
    </Consumer>
  );
}

export default MovieItem;
