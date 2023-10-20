$(()=>{
    const ApiURL = "https://reqres.in/api/users";
    const perPage = 2;
    let currentPage = 1;
    let isPaginationRender = false;
    let totalPages;

    function fetchDataAndHandlePagination(apiUrl, pageNumber){
        //Handle pagination each time (except first render)
        if (isPaginationRender){
            handlePaginationState(pageNumber);
        }
        $.ajax({
            url: apiUrl + "?page=" + pageNumber + "&per_page=" + perPage,
            method: "GET",
            success: function(data){
                const users = data.data;
                const userContainer = $(".user-container");
                totalPages = data.total_pages;
                userContainer.empty();

                //Render pagination first time
                if(!isPaginationRender){
                    const previousBtn = `<li class="page-item">
                                            <a class="page-link" href="#" data-page="Previous" aria-label="Previous">
                                            <span aria-hidden="true">&laquo;</span>
                                            </a>
                                        </li>`;
                    const nextBtn = `<li class="page-item">
                                        <a class="page-link" href="#" data-page="Next" aria-label="Previous">
                                        <span aria-hidden="true">&raquo;</span>
                                        </a>
                                    </li>`;
                    $('ul.pagination').append(previousBtn);
                    for (let i = 1; i <= totalPages; i++){
                        const pageNumberBtn = `<li class="page-item"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
                        $('ul.pagination').append(pageNumberBtn);
                    }
                    $('ul.pagination').append(nextBtn);
                    isPaginationRender = true; 
                    handlePaginationState(currentPage);
                }

                for (const user of users) {
                    const row = `
                        <tr>
                            <th scope="row">${user.id}</th>
                            <td>${user.first_name}</td>
                            <td>${user.last_name}</td>
                            <td>${user.email}</td>
                            <td>
                                <div class="img-frame">
                                    <img src="${user.avatar}" alt="">
                                </div>
                            </td>
                        </tr>
                    `;
                    userContainer.append(row);
                }

                //update current page
                currentPage = pageNumber;
            },
            error: function(){
                throw new Error("Fetching data failed")
            }
        })
    }

    function handlePaginationState(pageNumber){
        //Remove active from other item and activate current item
        if (pageNumber == "1"){
            $('.page-item a[data-page="Previous"]').addClass("disabled");
        }
        else{
            $('.page-item a[data-page="Previous"]').removeClass("disabled");
        }

        if (pageNumber == totalPages.toString()){
            $('.page-item a[data-page="Next"]').addClass("disabled");
        }
        else{
            $('.page-item a[data-page="Next"]').removeClass("disabled");
        }

        console.log($("ul.pagination .page-item"))
        $("ul.pagination .page-item").removeClass("active");
        $(`.page-item a[data-page="${pageNumber}"]`).parent().addClass('active');
    }

    //Fetch first data
    fetchDataAndHandlePagination(ApiURL, currentPage);

    //Handle pagination navbar
    $('ul.pagination').on('click', 'a.page-link', function(e){
        e.preventDefault();
        //console.log(e.target)
        const pageLink = e.target.dataset.page;
        //console.log(pageLink);
        if (pageLink === "Previous" && currentPage > 1) {
            fetchDataAndHandlePagination(ApiURL, (parseInt(currentPage)-1).toString());
        } else if (pageLink === "Next" && currentPage < totalPages) {
            fetchDataAndHandlePagination(ApiURL, (parseInt(currentPage)+1).toString());
        } else {
            fetchDataAndHandlePagination(ApiURL, pageLink);
        }
    })
})