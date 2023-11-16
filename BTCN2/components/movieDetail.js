import DBProvider from "../db/dbutil.js";
export default{
    props: {
        movie: Object
    },
    data(){
        return {
            fullMovieObject: {},
            reviews: []
        }
    },
    methods: {
        async getFullMovieObject(){
            const movieId = this.movie.id;
            const response = await DBProvider.fetch('get/movie/?per_page=9999&page=1');
            const movies = response.items;
            const fullMovie = movies.find(m => m.id === movieId)
            if (fullMovie){
                this.fullMovieObject = fullMovie
            }
            else{
                this.fullMovieObject = this.movie
            }
        },
        getMovieReviews: async function(){
            if (this.fullMovieObject){
              const reviews = await DBProvider.fetch(`detail/review/${this.fullMovieObject.id}`);
              this.reviews = reviews.items;
            }  
        },
        showActorDetail(actor){
          this.$emit('show-actor-detail', actor)
        }
    },
    computed: {
        formattedGenres() {
          const genreList = this.fullMovieObject.genreList || [];
          return genreList.map((genre) => genre.value).join(', ');
        },
        formattedDirectors() {
          const directorList = this.fullMovieObject.directorList || [];
          return directorList.map((director) => director.name).join(', ');
        },
        sanitizedMovieSummary() {
          // Use a DOMParser to create a temporary element and then extract the text content
          const parser = new DOMParser();
          const doc = parser.parseFromString(this.fullMovieObject.plotFull, 'text/html');
          return doc.body.textContent;
        },
    },
    async mounted() {
      await this.getFullMovieObject(); // Fetch full movie object before reviews
      this.getMovieReviews();
    },
    template:
    `
    <div class="movie-detail">
    <div class="movie-info border border-2 p-2 rounded d-flex">
      <div class="movie-img">
        <img :src="movie.image" alt="" style="max-height: 700px; width: auto">
      </div>
      <div class="movie-info ps-3">
        <h2 class="movie-title">{{ fullMovieObject.title }}</h2>
        <p class="movie-fulltitle">{{ fullMovieObject.fullTitle }}</p>
        <p class="movie-year"><span class="fw-bold">Năm:</span> {{ fullMovieObject.year }}</p>
        <p class="movie-length"><span class="fw-bold">Thời lượng:</span> {{ fullMovieObject.runtimeStr }}</p>
        <p class="movie-genre"><span class="fw-bold">Thể loại:</span> {{ formattedGenres }}</p>
        <p class="movie-directors"><span class="fw-bold">Đạo diễn:</span> {{ formattedDirectors }}</p>
        <p class="movie-actors">
          <span class="fw-bold">Diễn viên: </span>
          <a v-for="(actor, index) in fullMovieObject.actorList" :key="index" class="actor-link" @click="showActorDetail(actor)">
            {{ actor.name }}
            <span v-if="index < fullMovieObject.actorList.length - 1">, </span>
          </a>
        </p>
        <p class="movie-summary">
          <span class="fw-bold">Tóm tắt:</span> {{ sanitizedMovieSummary }}
        </p>
        <p class="movie-rating">
          <span class="fw-bold">Đánh giá:</span>
          {{ fullMovieObject.ratings && fullMovieObject.ratings.imDb ? fullMovieObject.ratings.imDb : 'N/A' }}
        </p>
      </div>
    </div>

    <div class="review-notice mt-5 fw-bolder fs-5">REVIEWS</div>
        <div class="movie-review border border-2 rounded">
        <div class="reviews">
            <div v-for="(review, index) in reviews" :key="index" class="card review border border-black p-4 mb-2">
                <p class="review-name fw-bold fs-4">{{ review.username }}</p>
                <p class="review-date"><span class="fw-bold">Ngày:</span> {{ review.date }}</p>
                <p class="review-rating"><span class="fw-bold">Điểm:</span> {{ review.rate }}</p>
                <p class="review-comment">
                    <span class="fw-bold">Bình luận:</span> {{ review.content }}
                </p>
            </div>
        </div>
        </div>
    </div>
    `
}