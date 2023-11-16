import vheader from './header.js';
import vnav from './nav.js';
import vcarousel from './carousel.js'
import vfooter from './footer.js';
import vmulticarousel1 from './popularMovieCarousel.js'
import vmulticarousel2 from './topRatingMovieCarousel.js'
import vsearchresult from './searchResult.js'
import vmoviedetail from './movieDetail.js'
import vactordetail from './actorDetail.js'

export default {
    data(){
        return {
            darkMode: false,
            searchQuery: '',
            searchSubmitted: false, 
            showHomePage: true,
            selectedMovie: {},
            selectedActor: {},
            showMovieDetails: false,
            showActorDetails: false,
            showSpinner: false
        }
    },
    components: {
        vheader, vnav, vfooter, vcarousel, vmulticarousel1, vmulticarousel2, vsearchresult, vmoviedetail, vactordetail
    },
    methods: {
        handleDarkModeChange(newMode) {
            const theme = newMode ? 'dark' : 'light';
      
            const carousels = document.querySelectorAll('.carousel.slide');
      
            if (carousels){
                carousels.forEach((carousel) => {
                    const carouselTheme = theme === 'dark' ? 'light' : 'dark';
                    carousel.setAttribute('data-bs-theme', carouselTheme);
                });
            }   
            
            if (theme === 'dark') {
              $('body').addClass('dark-theme');
            } else {
              $('body').removeClass('dark-theme');
            }
      
            this.darkMode = newMode;
        },
        updateSearchQuery(query) {
            this.searchQuery = query;
            this.searchSubmitted = true;
            this.showHomePage = false;
            this.showMovieDetails = false;
            this.showActorDetails = false;
        },
        goToHome() {
            this.showSpinner = true; 
            // Use a timeout to simulate a delay
            setTimeout(() => {
              this.showHomePage = true;
              this.searchSubmitted = false;
              this.showMovieDetails = false;
              this.showActorDetails = false;
              this.showSpinner = false; 
            }, 3000); 
          },
        showMovieDetail(movie) {
            this.showMovieDetails = true;
            this.selectedMovie = movie; // Set the selected movie
            this.showHomePage = false; // Switch to the movie detail page
            this.searchSubmitted = false;
            this.showActorDetails = false;
        },
        showActorDetail(actor){
            this.selectedActor = actor,
            this.showMovieDetails = false;
            this.showActorDetails = true;
            this.showHomePage = false; 
            this.searchSubmitted = false;
        }
    },
    template: 
    `
    <div class="container">
    <vheader :darkMode="darkMode" @dark-mode-changed="handleDarkModeChange" />
    <vnav @search="updateSearchQuery" @goToHome="goToHome" />
    <main class="bg-light p-2 m-1">
      <!-- Show the spinner while transitioning to the home page -->
      <div v-if="showSpinner" class="d-flex justify-content-center align-items-center spinner-container">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <!-- Show regular content when not transitioning to the home page -->
      <div v-else>
        <vcarousel v-if="showHomePage && !searchSubmitted" @show-movie-detail="showMovieDetail" />

        <vmulticarousel1 v-if="showHomePage && !searchSubmitted" @show-movie-detail="showMovieDetail" />

        <vmulticarousel2 v-if="showHomePage && !searchSubmitted" @show-movie-detail="showMovieDetail" />

        <vsearchresult v-if="searchSubmitted && !showHomePage" :searchQuery="searchQuery" @show-movie-detail="showMovieDetail" />

        <vmoviedetail v-if="showMovieDetails" :movie="selectedMovie" @show-actor-detail="showActorDetail" />

        <vactordetail v-if="showActorDetails" :actor="selectedActor" @show-movie-detail="showMovieDetail" />
      </div>
    </main>
    <vfooter />
  </div>
    `
}