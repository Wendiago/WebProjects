export default {
    inject: ['item'],
    data() {
        return {
        }
    },
    emits: ["changePage"],
    template: `
    <div class="card-header">
        Main
    </div>
        <div class="card-body">
            <div class="container">
                <div class="row justify-content-md-center">
                    <a>{{item.first_name}} {{item.last_name}}</a>
                </div>
                <div class="row justify-content-md-center">
                    <a><img :src="item.avatar" :alt="item.id"></a>
                </div>
                <div class="row justify-content-md-center">
                    <a>{{item.email}}</a>
                </div>
            </div>
        </div>
    `
}