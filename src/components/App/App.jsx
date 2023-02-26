import React, { useState, useEffect } from "react";
import "./App.css";
import MovieList from "../MovieList/MovieList";
import movieService from "../../services/services";
import { Input, Spin, Alert, Pagination, Tabs } from "antd";
import ErrorIndicator from "../Error/Error";
import { Provider } from "../../context/genreContext";
import useDebouncedEffect from "../../customHooks/useDebounce";
// import { Offline, Online } from "react-detect-offline";

function App() {
  const [moviesData, setMoviesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("Return");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageQty, setCurrentPageQty] = useState(0);
  const [genres, setGenres] = useState([]);
  const [rate, setRate] = useState([]);

  const getDataMovies = async () => {
    if (query.trim().length === 0) {
      return;
    }
    try {
      setLoading(true);
      setError(null);
      if (query.length === 0) {
        setLoading(false);
      }
      const data = await movieService.getMovies(query, currentPage);
      setCurrentPageQty(data.total_pages);
      setMoviesData(data.results);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const onPaginationChange = (pg) => {
    setCurrentPage(pg);
  };

  const onSearchChange = (e) => {
    // условие, так как может быть 2 слова в поиске

    setQuery(e.target.value);
  };

  useEffect(() => {
    const load = async () => {
      if (!movieService.getLocalGuestSessionToken()) {
        const session = await movieService.getQuestSession();
        movieService.setLocalGuestSessionToken(session.guest_session_id);
      }

      const dataGenre = await movieService.getGenres();
      const ratedMovies = await movieService.getRatedMovies();
      setRate(ratedMovies.results);
      setGenres(dataGenre.genres);
    };

    load();
  }, []);

  // ее в мувиайтем
  const onRate = async (id, value) => {
    await movieService.postMovieRating(id, value);
    movieService.setLocalRating(id, value);

    const ratedMovies = await movieService.getRatedMovies();
    setRate(ratedMovies.results);
  };

  // console.log(rate);
  //  пользовательский хук useDebouncedEffect, который будет ждать выполнения useEffect до тех пор, пока состояние не обновится на время задержки
  useDebouncedEffect(() => getDataMovies(), [query, currentPage], 600);

  const spinner = loading ? <Spin /> : null;
  const content = !loading ? <MovieList moviesData={moviesData} onRate={onRate} /> : null;
  const errorIndicator = error ? <ErrorIndicator /> : null;
  const paginationPanel =
    !loading && !error && query ? (
      <Pagination
        defaultCurrent={currentPage}
        total={currentPageQty}
        onChange={onPaginationChange}
      />
    ) : null;

  if (moviesData.length === 0 && query.length !== 0 && !loading && !error) {
    return (
      <>
        <Input placeholder="Search films" onChange={onSearchChange} value={query} autoFocus />
        <Alert message="Поиск не дал результатов" type="error" showIcon />
      </>
    );
  }

  const items = [
    {
      key: "1",
      label: `Search`,
      children: (
        <>
          <Input placeholder="Search films" onChange={onSearchChange} value={query} />
          {spinner}
          {content}
          {errorIndicator}
          {paginationPanel}
        </>
      ),
    },
    {
      key: "2",
      label: `Rated`,
      children: <MovieList moviesData={rate} />,
    },
  ];

  return (
    <div>
      <Provider value={genres}>
        {/* <Online> */}
        <Tabs defaultActiveKey="1" items={items} /* onChange={onTabsChange} */ />
        {/* </Online>
        <Offline>
          <Alert message="Нет сети, проверьте подключение" type="error" showIcon />
        </Offline> */}
      </Provider>
    </div>
  );
}

export default App;
