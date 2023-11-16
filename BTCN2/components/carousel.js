import DBProvider from "../db/dbutil.js";
export default{
    data() {
        return {
          top5BoxOffice: [],
        };
      },
      methods: {
        async getMovies() {
            try {
                const response = await DBProvider.fetch('get/topboxoffice');
                this.top5BoxOffice = response.items;
            } catch (error) {
                console.error("Error fetching movies:", error);
            }
        },
        showMovieDetail(movie){
          this.$emit('show-movie-detail', movie)
        }
      },
      created() {
        this.getMovies();
      },
    template: 
    `
    <div id="newest-film-carousel" class="carousel slide" data-bs-theme="dark">
      <div class="carousel-indicators">
        <button
          v-for="(movie, index) in this.top5BoxOffice"
          :key="index"
          :data-bs-target="'#newest-film-carousel'"
          :data-bs-slide-to="index"
          :class="index === 0 ? 'active' : ''"
          aria-current="true"
          aria-label="Slide {{ index + 1 }}"
          type="button"
        ></button>
      </div>
      <div class="carousel-inner">
        <div
          v-for="(movie, index) in top5BoxOffice"
          :key="index"
          :class="['carousel-item', index === 0 ? 'active' : '']"
          class="d-flex justify-content-center"
        >
          <img :src="movie.image" class="img-equal-height" alt="Movie Poster" @click="showMovieDetail(movie)">
          <div class="carousel-caption d-none d-md-block text-white">
            <h5>{{ movie.fullTitle }}</h5>
          </div>
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#newest-film-carousel" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#newest-film-carousel" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
    `
}