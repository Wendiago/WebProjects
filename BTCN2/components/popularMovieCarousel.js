import DBProvider from '../db/dbutil.js'
export default {
  data: function () {
    return {
        mostPopularMovies: []
    };
  },
  methods: {
    async getMostPopularMovies() {
        try {
            const response = await DBProvider.fetch('get/mostpopular/?per_page=15&page=1');
            const mostPopularMovies = response.items;
            this.mostPopularMovies = mostPopularMovies
        } catch (error) {
            console.error("Error fetching movies:", error);
        }
    },
    showMovieDetail(movie){
      this.$emit('show-movie-detail', movie)
    }
  },
  mounted() {
    this.getMostPopularMovies();
  },
  computed: {
    mostPopularMoviesChunked() {
      const chunkSize = 3;
      const chunks = [];
  
      for (let i = 0; i < this.mostPopularMovies.length; i += chunkSize) {
        chunks.push(this.mostPopularMovies.slice(i, i + chunkSize));
      }
  
      return chunks;
    },
  },
  template:
   `
   <div class="most-popular-carousel">
    <div class="carousel-title ms-5 p-3 fw-bold">Most popular</div>
    <div id="most-popular-carousel" class="carousel slide" data-ride="carousel" data-bs-theme="dark">
      <div class="carousel-indicators">
        <button
          v-for="(chunk, index) in mostPopularMoviesChunked"
          :key="index"
          :data-bs-target="'#most-popular-carousel'"
          :data-bs-slide-to="index"
          :class="index === 0 ? 'active' : ''"
          aria-current="true"
          aria-label="Slide {{ index + 1 }}"
          type="button"
        ></button>
      </div>
      <div class="carousel-inner">
        <div
          v-for="(moviesInSlide, index) in mostPopularMoviesChunked"
          :key="index"
          :class="['carousel-item', index === 0 ? 'active' : '']"
          class="d-flex justify-content-center"
        >
          <div class="row" style="width: 90%">
            <div v-for="(movie, movieIndex) in moviesInSlide" :key="movieIndex" class="col-md-4">
              <div class="card" @click="showMovieDetail(movie)">
                <img :src="movie.image" class="card-img-top" alt="Movie Poster">
                <div class="card-body">
                  <h5 class="card-title">{{ movie.title }}</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#most-popular-carousel" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#most-popular-carousel" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  </div>
    `,
};