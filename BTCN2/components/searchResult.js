import DBProvider from "../db/dbutil.js";
export default{
    props: {
        searchQuery: String
    },
    data: function(){
        return {
            searchResult: []
        }
    },
    methods: {
        getSearchResult: async function(){
            const perPage = 6; // Items per page
            let page = 1; // Start with page 1
            const allData = [];

            while (true) {
                const response = await DBProvider.fetch(`search/movie/${this.searchQuery}?per_page=${perPage}&page=${page}`);
                if (!response.items.length) {
                // No more items, break the loop
                    break;
                }
                // Append the fetched items to the allData array
                allData.push(...response.items);

                // Move to the next page
                page++;
            }
            this.searchResult = allData;
        },
        showMovieDetail(movie){
            this.$emit('show-movie-detail', movie)
        }
    },
    watch: {
        // Watch for changes to the searchQuery prop
            searchQuery: function (newQuery) {
            // Fetch search results when searchQuery changes
            this.getSearchResult();
        }
    },
    mounted() {
        // Fetch search results when the component is mounted
        this.getSearchResult();
      },
    template: 
    `
    <div class="row gy-4 search-result">
        <div v-for="movie in searchResult" :key="movie.id" class="col-4">
            <div class="card" @click="showMovieDetail(movie)">
                <img :src="movie.image" class="" :alt="movie.title">
                <div class="card-body text-center">
                    <h5>{{ movie.title }}</h5>
                    <p>Rated: {{ movie.ratings.imDb }}</p>
                    <p>Length: {{ movie.runtimeStr }}</p>
                </div>
            </div>
        </div>
    </div>
    `
}