export default {
    data() {
        return {
            searchQuery: ''
        }
    },
    methods: {
        searchMovies: function(){
            this.$emit('search', this.searchQuery);
        },
        goToHome: function(){
            this.$emit('goToHome');
        }
    },
    template:`
    <nav class="row navbar bg-light p-2 m-1 border rounded">
        <div class="col-12 d-flex justify-content-between">
            <div class="home-link d-flex align-items-center">
                <a class="nav-link active" href="#" @click="goToHome">Home</a>
            </div>
            <form class="d-flex" @submit.prevent="searchMovies" role="search">
                <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" v-model="searchQuery">
                <button class="btn btn-outline-success" type="submit">Search</button>
            </form>
        </div>
    </nav>
    `
}