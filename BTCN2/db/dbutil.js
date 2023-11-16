import data from './data.js'

function calculateProfit(movie) {
    let openingWeekend = 0;
    let grossUSA = 0;
    let cumulativeWorldwideGross = 0;

    if (movie.boxOffice.openingWeekendUSA) {
        openingWeekend = parseFloat(movie.boxOffice.openingWeekendUSA.replace(/[^0-9.]/g, '') || 0);
    }

    if (movie.boxOffice.grossUSA) {
        grossUSA = parseFloat(movie.boxOffice.grossUSA.replace(/[^0-9.]/g, '') || 0);
    }

    if (movie.boxOffice.cumulativeWorldwideGross) {
        cumulativeWorldwideGross = parseFloat(movie.boxOffice.cumulativeWorldwideGross.replace(/[^0-9.]/g, '') || 0);
    }

    // Calculate profit by summing the values
    return openingWeekend + grossUSA + cumulativeWorldwideGross;
}

const DBProvider = {
    fetch(query) {
        const [type, className, PatternAndParams] = query.split('/');
        let params = {};
        let pattern = '';
    
        if (PatternAndParams) {
            const patternParamsSplit = PatternAndParams.split('?');
            if (patternParamsSplit.length === 0){
                params = { per_page: 10, page: 1 };
            }
            if (patternParamsSplit.length === 1) {
                // If there's no '?', PatternAndParams is the pattern
                pattern = patternParamsSplit[0];
                params = { per_page: 10, page: 1 };
            } else {
                // '?' is present, so split into pattern and parameters
                pattern = patternParamsSplit[0];
                const queryString = patternParamsSplit[1];
                
                queryString.split('&').forEach(param => {
                    const [key, value] = param.split('=');
                    params[key] = value;
                });
            }
        }
    
        console.log(type, className, pattern, params);
    
        switch (type) {
            case 'search':
                return this.search(className, pattern, params);
            case 'detail':
                return this.detail(className, pattern, params);
            case 'get':
                return this.get(className, params);
            default:
                return Promise.reject('Invalid request type');
        }
    },
    
    search(className, pattern, params) {
        let itemsByTitle = [];
        let itemsByActor = [];
        let items = [];

        if (className === 'movie') {
            //Get movie by title
            itemsByTitle = data.Movies.filter(movie => movie.title.toLowerCase().includes(pattern.toLowerCase()));
            // Get movies by actor name and filter out duplicates
            itemsByActor = data.Movies.filter(movie => {
                return movie.actorList.some(actor => actor.name.toLowerCase().includes(pattern.toLowerCase()));
            });

            // Merge the two lists and remove duplicates by ID
            items = [...new Set([...itemsByTitle, ...itemsByActor])];
        } 
    
        const perPage = params.per_page ? parseInt(params.per_page) : 10;
        const page = params.page ? parseInt(params.page) : 1;
        const total = items.length;
        const totalPage = Math.ceil(total / perPage);
        const result = items.slice((page - 1) * perPage, page * perPage);

        return Promise.resolve({
            search: pattern,
            page: page,
            per_page: perPage,
            total_page: totalPage,
            total: total,
            items: result,
        });
    },

    detail(className, pattern, params) {
        if (className === 'movie') {
            const movie = data.Movies.find(movie => movie.id === pattern);
            return Promise.resolve(movie);
        } 
        else if (className === 'name'){
            const actor = data.Names.find(actor => actor.id === pattern);
            return Promise.resolve(actor);
        }
        else if (className === 'review'){
            const reviews = data.Reviews.find(review => review.movieId === pattern);
            return Promise.resolve(reviews);
        }
        return Promise.reject('Invalid class for detail');
    },

    get(className, params) {
        if (className === 'top50') {
            const perPage = params.per_page ? parseInt(params.per_page) : 10;
            const page = params.page ? parseInt(params.page) : 1;
            const items = data.Top50Movies;
            const total = items.length;
            const totalPage = Math.ceil(total / perPage);
            const result = items.slice((page - 1) * perPage, page * perPage);

            return Promise.resolve({
                page: page,
                per_page: perPage,
                total_page: totalPage,
                total: total,
                items: result,
            });
        } 
        else if (className === 'mostpopular'){
            const perPage = params.per_page ? parseInt(params.per_page) : 10;
            const page = params.page ? parseInt(params.page) : 1;
            const items = data.MostPopularMovies;
            const total = items.length;
            const totalPage = Math.ceil(total / perPage);
            const result = items.slice((page - 1) * perPage, page * perPage);

            return Promise.resolve({
                page: page,
                per_page: perPage,
                total_page: totalPage,
                total: total,
                items: result,
            });
        }
        //Get top 5 profit
        else if (className === 'topboxoffice'){
            const perPage = params.per_page ? parseInt(params.per_page) : 10;
            const page = params.page ? parseInt(params.page) : 1;
            const items = data.Movies.sort((a, b) => calculateProfit(b) - calculateProfit(a)).slice(0, 5);
            const total = items.length;
            const totalPage = Math.ceil(total / perPage);
            const result = items.slice((page - 1) * perPage, page * perPage);

            return Promise.resolve({
                page: page,
                per_page: perPage,
                total_page: totalPage,
                total: total,
                items: result,
            });
        }
        //Get movies
        else if (className === 'movie'){
            const perPage = params.per_page ? parseInt(params.per_page) : 10;
            const page = params.page ? parseInt(params.page) : 1;
            const items = data.Movies;
            const total = items.length;
            const totalPage = Math.ceil(total / perPage);
            const result = items.slice((page - 1) * perPage, page * perPage);

            return Promise.resolve({
                page: page,
                per_page: perPage,
                total_page: totalPage,
                total: total,
                items: result,
            });
        }
        else if (className === 'name'){
            const perPage = params.per_page ? parseInt(params.per_page) : 10;
            const page = params.page ? parseInt(params.page) : 1;
            const items = data.Names;
            const total = items.length;
            const totalPage = Math.ceil(total / perPage);
            const result = items.slice((page - 1) * perPage, page * perPage);

            return Promise.resolve({
                page: page,
                per_page: perPage,
                total_page: totalPage,
                total: total,
                items: result,
            });
        }
        return Promise.reject('Invalid class for get');
    },
};

export default DBProvider;
