import DBProvider from "../db/dbutil.js";
export default{
    props: {
        actor: Object
    },
    data(){
        return {
            castMovies: [],
            fullActorObject: null
        }
    },
    methods: {
        async getFullActorObject(){
            const actorId = this.actor.id;
            const response = await DBProvider.fetch('get/name/?per_page=9999&page=1');
            const actors = response.items;
            const fullActor = actors.find(a => a.id === actorId)
            if (fullActor){
                this.fullActorObject = fullActor
            }
            else{
                this.fullActorObject = this.actor
            }
        },
        async getCastMovies() {
            const moviesResponse = await DBProvider.fetch('get/movie/?per_page=9999&page=1'); // Fetch all movies
            const movies = moviesResponse.items;
        
            // Filter movies where the actor's ID appears in the actorList
            this.castMovies = movies.filter(movie => {
                return movie.actorList.some(actor => actor.id === this.fullActorObject.id);
            });
        },
        showMovieDetail(movie) {
            this.$emit('show-movie-detail', movie);
        }
    },
    computed: {
        
    },
    async created(){
        await this.getFullActorObject();
        this.getCastMovies();
    },
    template:
    `
    <div class="actor-detail">
    <div class="border border-2 p-2 rounded d-flex">
      <div class="actor-img">
        <img :src="fullActorObject.image" alt="" style="max-height: 700px; width: auto">
      </div>
      <div class="actor-info ps-3">
        <h2 class="actor-name">{{ fullActorObject.name }}</h2>
        <p class="actor-role"><span class="fw-bold">Vai trò:</span> {{ fullActorObject.role }}</p>
        <p class="actor-bd"><span class="fw-bold">Ngày sinh:</span> {{ fullActorObject.birthDate }}</p>
        <p class="actor-dd"><span class="fw-bold">Ngày mất:</span> {{ fullActorObject.deathDate }}</p>
        <p class="actor-awards"><span class="fw-bold">Giải thưởng:</span> {{ fullActorObject.awards }}</p>
        <p class="actor-height"><span class="fw-bold">Chiều cao:</span> {{ fullActorObject.height }}</p>
        <p class="actor-summary">
          <span class="fw-bold">Tiểu sử:</span> {{ fullActorObject.summary }}
        </p>
      </div>
    </div>

    <div class="review-notice mt-5 fw-bolder fs-5">DANH SÁCH PHIM THAM GIA</div>
    <div class="movie-list row gy-4 mt-2">
      <div class="col-4" v-for="(movie, index) in castMovies" :key="index" @click="showMovieDetail(movie)">
        <div class="card">
          <img :src="movie.image" alt="">
          <div class="card-body text-center">
            <h5>{{ movie.fullTitle }}</h5>
          </div>
        </div>
      </div>
    </div>
    </div>
    `
}