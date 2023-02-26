// код который работает с сетью лучше изолировать в отдельный класс-сервис
// компоненты не должны знать откуда берутся данные
// такой подход упростит тестирование и поддержку кода, который работает с Апи

class MovieDB {
  constructor() {
    this.apiBase = "https://api.themoviedb.org/3";
    this.apiKey = "c1a22ba4a7ffc5556360b6a8ecf7d62d";
  }
  // можно вне конструктора
  // apiBase = "https://api.themoviedb.org/3/search/movie";

  async getResource(url) {
    const result = await fetch(`${this.apiBase}${url}`);
    if (!result.ok) {
      throw new Error(`Could not fetch ${url}, recieved ${result.status}`);
    }
    const body = await result.json();
    return body;
  }

  async getMovies(querY, currentPagE) {
    return this.getResource(
      `/search/movie?api_key=${this.apiKey}&language=en-US&query=${querY}&page=${currentPagE}`
    );
  }

  async getGenres() {
    return this.getResource(`/genre/movie/list?api_key=${this.apiKey}&language=en-US`);
  }

  async getQuestSession() {
    const data = await fetch(
      "https://api.themoviedb.org/3/authentication/guest_session/new?api_key=c1a22ba4a7ffc5556360b6a8ecf7d62d"
    );
    const result = await data.json();
    localStorage.setItem("token", result.guest_session_id);
    // потом исправить, работает но выглядит дерьмово
  }

  async postMovieRating(movieId, rating) {
    const token = localStorage.getItem("token");
    const data = await fetch(
      `${this.apiBase}/movie/${movieId}/rating?api_key=${this.apiKey}&guest_session_id=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          value: rating,
        }),
      }
    );
    const res = await data.json();
    console.log(res);
    console.log(movieId, rating);
  }

  async getMovieRating() {
    const token = localStorage.getItem("token");
    const data = await fetch(
      `https://api.themoviedb.org/3/guest_session/${token}/rated/movies?api_key=c1a22ba4a7ffc5556360b6a8ecf7d62d&language=en-US&sort_by=created_at.asc`
    );
    const result = await data.json();
    // setEnd(result.results);
    console.log(result);
  }
}

const movieService = new MovieDB();

export default movieService;
