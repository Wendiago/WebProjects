import { computed } from 'vue';
import vheader from './header.js';
import vnav from './nav.js';
import vside from './side.js';
import vcontent from './content.js';
import vitem from './item.js';
import vfooter from './footer.js';

export default {
    props: ['searchInput'],
    data(){
        return {
            item: {},
            persons: [],
            pages: {},
            comName: 'vcontent'
        }
    },
    components: {
        vheader, vnav, vside, vcontent, vfooter, vitem
    },
    provide(){
        return{
            persons: computed(() => this.persons),
            pages: computed(() => this.pages),
            item: computed(() => this.item)
        }
    },
    methods: {
        async requestHandler() {
            this.comName = 'vcontent';
            this.changePage(1);
        },
        async changePage(n){
            this.comName = 'vcontent';
            try {
                const res = await fetch(`https://reqres.in/api/users?per_page=2&page=${n}`);
                const data = await res.json();
                this.persons = data.data;
                this.pages = {
                    page: data.page,
                    total_pages: data.total_pages
                };
            } catch (error) {
                console.log(error);
            }
        },
        async itemClick(p){
            this.item = p;
            this.comName = 'vitem';
        }
    },
    mounted: function(){
        this.changePage(1);
    },
    template: `
    <div class="container">
        <div class="row">
            <vheader/>
        </div>
        <div class="row">
            <vnav @request="requestHandler" @search="changePage"/>
        </div>
        <div class="row g-0 mt-3">
            <div class="card col-md-3">
                <vside/>
            </div>
            <div class="card col-md-9">
                <component :is="comName" @changePage="changePage" @itemClick="itemClick"/>
            </div>
        </div>
        <div class="row mt-3">
            <vfooter/>
        </div>
    </div> 
    `
}