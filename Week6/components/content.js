export default {
    inject: ['persons', 'pages'],
    data() {
        return {
        }
    },
    emits: ["changePage", "itemClick"],
    template: `
        <div class="card-header">
            Main
        </div>
        <div class="card-body">
            <div class="container">
                <div class="row">
                    <table class="table col-md-12 my-2">
                        <thead class="table-dark">
                            <tr>
                                <th>id</th>
                                <th>Full name</th>
                                <th>Email</th>
                                <th>Avatar</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="p in persons" @click="$emit('itemClick', p)">
                                <td>{{p.id}}</td>
                                <td>{{p.first_name}} {{p.last_name}}</td>
                                <td>{{p.email}}</td>
                                <td><img :src="p.avatar" :alt="p.id"></td>
                            </tr>
                        </tbody>
                    </table>
                    <nav aria-label="Page navigation example">
                        <ul class="pagination">
                            <li class="page-item" @click="pages.page > 1 && $emit('changePage', pages.page - 1)">
                                <a class="page-link" href="#" aria-label="Previous">
                                    <span aria-hidden="true">&laquo;</span>
                                </a>
                            </li>
                            <template v-for="n in pages.total_pages">
                                <li @click="$emit('changePage', n)" :class="{active: n===pages.page}" class="page-item">
                                    <a v-if="n!==pages.page" class="page-link" href="#">{{n}}</a>
                                    <span v-if="n===pages.page" class="page-link">{{n}}</span>
                                </li>
                            </template>
                            <li class="page-item" @click="pages.page < pages.total_pages && $emit('changePage', pages.page + 1)">
                                <a class="page-link" href="#" aria-label="Next">
                                    <span aria-hidden="true">&raquo;</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    `
}