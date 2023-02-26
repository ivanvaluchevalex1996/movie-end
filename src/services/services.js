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
    console.log(data);
    const res = await data.json();
    return res;
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
    return res;
  }

  async getRatedMovies() {
    const token = localStorage.getItem("token");
    const data = await fetch(
      `https://api.themoviedb.org/3/guest_session/${token}/rated/movies?api_key=c1a22ba4a7ffc5556360b6a8ecf7d62d&language=en-US`
    );
    console.log(data);
    const result = await data.json();
    console.log(result);
    return result;
  }

  getLocalGuestSessionToken() {
    return localStorage.getItem("token");
  }

  setLocalGuestSessionToken(token) {
    localStorage.setItem("token", token);
    // setter не надо return
  }

  setLocalRating(id, value) {
    localStorage.setItem(id, value);
  }

  getLocalRating(id) {
    return +localStorage.getItem(id);
  }
}

const movieService = new MovieDB();

export default movieService;
