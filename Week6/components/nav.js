export default {
    data() {
        return {
            searchInput: ''
        }
    },
    set(value) {
        emit('update:searchInput', value)
    },
    emits: ["request", "search"],
    template:`
        <nav class="navbar navbar-light bg-light justify-content-between col-md-12">
            <a class="navbar-brand ps-3" @click="$emit('request')" href="#">Home</a>
            <form class="form-inline d-flex me-3" id="form_header">
                <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" v-model="searchInput"/>
                <button class="btn btn-outline-success my-2 my-sm-0 ms-2" type="submit" @click="$emit('search', searchInput)">Search</button>
            </form>
        </nav>
    `
}