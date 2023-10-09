const app = {
    header: document.querySelector('.header-wrapper'),
    sideBar: document.querySelector('.sidebar'),
    mainContent: document.querySelector('.main'),
    footer: document.querySelector('.footer'),

    dragAndDrop: function(obj){
        obj.xOld = 0;
        obj.yOld = 0;
        obj.isDown = false;

        obj.onmousedown = function(e){
            this.isDown = true;
            this.xOld = e.clientX;
            this.yOld = e.clientY;
            if (isNaN(parseInt(this.style.left))){
                this.style.left = this.offsetLeft + 'px';
                this.style.top = this.offsetTop + 'px';
            }
        };

        obj.onmouseup = function(e){
            this.isDown =false;
        }

        obj.onmousemove = function(e){
            if (this.isDown){
                let xCur = e.clientX;
                let yCur = e.clientY;
                let dx = xCur - this.xOld;
                let dy = yCur - this.yOld;
                this.xOld = xCur;
                this.yOld = yCur;
                this.style.left = (parseInt(this.style.left) + dx) + 'px';
                this.style.top = (parseInt(this.style.top) + dy) + 'px';
            }
        }
    },

    isNameAndAddressValid: function(name){
        const words = name.split(' ');
        let count = 0;
        for (const word of words) {
            if (word !== ''){
                count += 1;
            }
        }
        if (count >= 2){
            return true;
        }
        return false;
    },

    isPhoneNumberValid: function(phone){
        const regexPhoneNumber = /^0\d{9}$/;
        return phone.match(regexPhoneNumber) ? true : false;
    },

    isShippingDateValid: function(dateStr){
        const today = new Date();
        const shipDate = new Date(dateStr);
        if (shipDate < today){
            return false;
        }
        return true;
    },

    isEmailValid: function(emailStr){
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailRegex.test(emailStr);
    },

    handleProducts: function(){
        // Get references to the item lists in both the product list and result box
        const productList = document.querySelector(".select-box .item-list");
        const resultList = document.querySelector(".result-box .item-list");
      
        // Get references to the control buttons
        const selectButton = document.querySelector(".select-btn");
        const selectAllButton = document.querySelector(".selectAll-btn");
        const unselectButton = document.querySelector(".unselect-btn");
        const unselectAllButton = document.querySelector(".unselectAll-btn");
      
        // Store arrays for selected and unselected items in both lists
        const productItems = Array.from(productList.querySelectorAll(".item"));
        const selectedProductItems = [];
        const unselectedProductItems = [...productItems]; // Copy all items initially
            
        // Event listener to toggle item selection in product list
        productList.querySelectorAll('.item').forEach((selectedItem)=>{
            selectedItem.addEventListener("click", ()=> {
                if (!selectedItem.classList.contains("selected")) {
                  selectedItem.classList.toggle("active"); // Mark the item as active
                }
            });
        })

        // Function to update the result box based on the selected items
        function updateresultList() {
            // Clear both result boxes
            resultList.innerHTML = "";
        
            // Add selected items to the result box
            selectedProductItems.forEach(item => {
                const clonedItem = item.cloneNode(true);
                clonedItem.classList.remove("active");
                clonedItem.classList.remove("selected");
                resultList.appendChild(clonedItem);
            });

            // Event listener to toggle item selection in result list
            console.log(resultList);
            resultList.querySelectorAll('.item').forEach((selectedItem)=>{
                selectedItem.addEventListener("click", ()=> {
                    if (!selectedItem.classList.contains("selected")) {
                    selectedItem.classList.toggle("active"); // Mark the item as active
                    }
                });
            })
        }

        function updateProductList(){
            const products = productList.querySelectorAll('.item');
            //Remove current active product
            products.forEach((product)=>{
                product.classList.remove("active");
            })

            //Add selected class to selected products
            for (const selectedItem of selectedProductItems) {
                products.forEach((product)=>{
                    if (product.dataset.index === selectedItem.dataset.index){
                        product.classList.add('selected');
                    }
                })
            }

            //Remove selected class from unselected products
            for (const unselectedItem of unselectedProductItems) {
                products.forEach((product)=>{
                    if (product.dataset.index === unselectedItem.dataset.index){
                        product.classList.remove('selected');
                    }
                })
            }
        }

        function removeItemByDataIndex(dataIndex, arrayList) {
            const indexToRemove = arrayList.findIndex(item => item.dataset.index === dataIndex);
            if (indexToRemove !== -1) {
              arrayList.splice(indexToRemove, 1); // Remove the item from the array
            }
        }
      
        // Event listeners for the select button
        selectButton.addEventListener("click", function () {
            //Add active items to the selected list
            const activeItems = productList.querySelectorAll('.item.active');
            activeItems.forEach(function (item) {
                selectedProductItems.push(item);
                // Remove active item from unselected product list
                removeItemByDataIndex(item.dataset.index, unselectedProductItems);
            })
            
            updateresultList();
            updateProductList();
        });
      
        // Event listeners for the select all button
        selectAllButton.addEventListener("click", function () {
            selectedProductItems.push(...unselectedProductItems);
            unselectedProductItems.length = 0; // Clear the unselected list
        
            updateresultList();
            updateProductList();
        });
      
        // Event listeners for the unselect button
        unselectButton.addEventListener("click", function () {
            //Find active items in result box
            const activeItems = resultList.querySelectorAll('.item.active');
            activeItems.forEach(function (item) {
                //Remove items from selected list  
                removeItemByDataIndex(item.dataset.index, selectedProductItems);
                //Add item in unselected list
                unselectedProductItems.push(item)
            })
            updateProductList();
            updateresultList();
        });
      
        // Event listeners for the unselect all button
        unselectAllButton.addEventListener("click", function () {
            unselectedProductItems.push(...selectedProductItems);
            selectedProductItems.length = 0; // Clear the selected list
        
            updateresultList();
            updateProductList();
        });

        // Function to handle dragging and dropping of products
        function handleProductDragAndDrop() {
            const resultBox = document.querySelector('.result-box');
            let draggedItem = null;
            // Event listener for dragging items from the Product list to the Result box
            const productsToSelect = productList.querySelectorAll('.item');
            productsToSelect.forEach((productToSelect)=>{
                productToSelect.addEventListener('dragstart', (e)=>{
                    const selectedItem = e.target.closest(".item");
                    if (selectedItem && !selectedItem.classList.contains("selected")) {
                        e.dataTransfer.setData("text/plain", selectedItem.dataset.index);
                        draggedItem = selectedItem;
                    }
                })
            })

            // Event listener for dropping items from the Product list to the Result box
            resultBox.addEventListener("dragover", (e) => {
                e.preventDefault();
            });

            resultBox.addEventListener("drop", (e) => {
                e.preventDefault();
                const dataIndex = e.dataTransfer.getData("text/plain");
                const productItem = productList.querySelector(`.item[data-index="${dataIndex}"]`);
                if (productItem) {
                    // Clone the product item and add it to the Result box
                    const clonedItem = productItem.cloneNode(true);
                    resultList.appendChild(clonedItem);

                    // Add the selected class to the cloned item
                    clonedItem.classList.add("selected");

                    // Remove the selected item from the Product list
                    productItem.classList.add("selected");

                    // Update the arrays of selected and unselected items
                    selectedProductItems.push(clonedItem);
                    removeItemByDataIndex(dataIndex, unselectedProductItems);

                    // Update the display of the Product list and Result box
                    updateProductList();
                    updateresultList();
                }
            });

            // Event listener for dragging items from the Result box to the Product list
            resultList.addEventListener("dragstart", (e) => {
                const selectedItem = e.target.closest(".item");
                if (selectedItem) {
                    e.dataTransfer.setData("text/plain", selectedItem.dataset.index);
                }
            });

            // Event listener for dropping items from the Result box to the Product list
            productList.addEventListener("dragover", (e) => {
                e.preventDefault();
            });

            productList.addEventListener("drop", (e) => {
                e.preventDefault();
                const dataIndex = e.dataTransfer.getData("text/plain");
                const selectedProductItem = resultList.querySelector(`.item[data-index="${dataIndex}"]`);
                if (selectedProductItem) {
                    //Remove item from selected product list
                    removeItemByDataIndex(dataIndex, selectedProductItems);
                    //Add item to unselected product list
                    unselectedProductItems.push(selectedProductItem);
                    // Update the display of the Product list and Result box
                    updateProductList();
                    updateresultList();
                }
            });
        }

        // Call the function to handle product drag-and-drop
        handleProductDragAndDrop();
            
    },

    handleNewsDragAndDrop: function(){
        const newsList = document.querySelector(".news-container");
        let draggedItem = null;

        newsList.addEventListener("dragstart", (e) => {
            draggedItem = e.target.closest(".news");
            if (draggedItem) {
                draggedItem.classList.add("dragging");
                e.dataTransfer.effectAllowed = 'move';
            }
        });

        newsList.addEventListener("dragend", () => {
            if (draggedItem) {
                draggedItem.classList.remove("dragging");
                draggedItem = null;
            }
        });

        newsList.addEventListener("dragover", (e) => {
            e.preventDefault();
            const afterElement = getDragAfterElement(newsList, e.clientY);
            const newsItem = e.target.closest(".news");
            if (!afterElement) {
                newsList.appendChild(draggedItem);
            } else {
                newsList.insertBefore(draggedItem, afterElement);
            }
        });

        function getDragAfterElement(container, y) {
            const draggableElements = [...container.querySelectorAll(".news:not(.dragging)")];

            return draggableElements.reduce((closest, child) => {
                    const box = child.getBoundingClientRect();
                    const offset = y - box.top - box.height / 2;
                    if (offset < 0 && offset > closest.offset) {
                        return { offset, element: child };
                    } else {
                        return closest;
                    }
                },
                { offset: Number.NEGATIVE_INFINITY }
            ).element;
        }
    },

    handleRegistration: function(){
        const registBtn = this.mainContent.querySelector('.register-btn');
        const registTable = this.mainContent.querySelector('.registration-table-info');
        registBtn.addEventListener('click', (e) => {
            const nameValue = nameInputBox.value;
            const addressValue = addressInputBox.value;
            const dateValue = dateInputBox.value;
            const selectedRadioInput = this.mainContent.querySelector('input[name="gender"]:checked'); 
            const genderValue = selectedRadioInput.value;
            const selectedProductNames = this.mainContent.querySelectorAll('.result-box .item-name');
            
            // Create an array to store the item names
            const itemNames = [];

            // Iterate through each item and extract its name
            selectedProductNames.forEach((itemElement) => {
                const itemName = itemElement.textContent.trim(); // Remove extra spaces
                itemNames.push(itemName);
            });

            // Join the item names into a single string separated by semicolons
            const productList = itemNames.join("; ");

            if (nameValue && addressValue && dateValue && genderValue && productList){
                // Create a new table row element
                const newRow = document.createElement("tr");
                newRow.classList.add("registration-table-info__row");

                // Create table data (td) elements for each column
                const td1 = document.createElement("td");
                td1.textContent = `${nameValue}`;

                const td2 = document.createElement("td");
                td2.textContent = `${genderValue}`;

                const td3 = document.createElement("td");
                td3.textContent = `${addressValue}`;

                const td4 = document.createElement("td");
                td4.textContent = `${dateValue}`;

                const td5 = document.createElement("td");
                td5.textContent = `${productList}`;

                // Append the table data elements to the table row
                newRow.appendChild(td1);
                newRow.appendChild(td2);
                newRow.appendChild(td3);
                newRow.appendChild(td4);
                newRow.appendChild(td5);

                // Append the new row to the table
                registTable.appendChild(newRow);
            }
        })

        const deleteBtn = this.mainContent.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () =>{
            registTable.innerHTML = '';
        })
    },

    handleEvents: function(){
        //Side bar collapse and extend effect:
        const news = this.sideBar.querySelectorAll('.news'); //Select list of news

        news.forEach((newItem)=>{
            //Get toogle btn of each news
            const toggleBtn = newItem.querySelector('.news__toggle-btn');
            //Add click event listener to toggle button
            toggleBtn.addEventListener('click', (e) => {
                newItem.classList.toggle('inactive');
                if (!newItem.classList.contains('inactive')){
                    e.target.textContent = '↓';
                }
                else{
                    e.target.textContent = '▶';
                }
            })

            //Drag and drop news
            this.dragAndDrop(newItem)
        })

        //Handle register information
        const nameInputBox = this.mainContent.querySelector('#name');
        const errorLogName = this.mainContent.querySelector('.error-mess.name');
        nameInputBox.addEventListener('input', (e)=>{
            let inputName = e.target.value;
            if (!this.isNameAndAddressValid(inputName)){
                errorLogName.textContent = '*Họ và tên không hợp lệ';
                nameInputBox.classList.add('error-log');
                errorLogName.classList.add('active');
            }
            else{
                errorLogName.textContent = '';
                nameInputBox.classList.remove('error-log');
                errorLogName.classList.remove('active');
            }
        })

        const addressInputBox = this.mainContent.querySelector('#address');
        const errorLogAdd = this.mainContent.querySelector('.error-mess.address');
        addressInputBox.addEventListener('input', (e)=>{
            let inputAdd = e.target.value;
            if (!this.isNameAndAddressValid(inputAdd)){
                errorLogAdd.textContent = '*Địa chỉ không hợp lệ';
                addressInputBox.classList.add('error-log');
                errorLogAdd.classList.add('active');
            }
            else{
                errorLogAdd.textContent = '';
                addressInputBox.classList.remove('error-log');
                errorLogAdd.classList.remove('active');
            }
        })

        const phoneInputBox = this.mainContent.querySelector('#phone');
        const errorLogPhone = this.mainContent.querySelector('.error-mess.phone');
        phoneInputBox.addEventListener('input', (e)=>{
            let inputPhone = e.target.value;
            if (!this.isPhoneNumberValid(inputPhone)){
                errorLogPhone.textContent = '*Số điện thoại không hợp lệ';
                phoneInputBox.classList.add('error-log');
                errorLogPhone.classList.add('active');
            }
            else{
                errorLogPhone.textContent = '';
                phoneInputBox.classList.remove('error-log');
                errorLogPhone.classList.remove('active');
            }
        })

        const dateInputBox = this.mainContent.querySelector('#ship-date');
        const errorLogDate = this.mainContent.querySelector('.error-mess.date');
        dateInputBox.addEventListener('click', (e)=>{
            let inputDate = e.target.value;
            if (!this.isShippingDateValid(inputDate)){
                errorLogDate.textContent = '*Ngày giao hàng không hợp lệ';
                dateInputBox.classList.add('error-log');
                errorLogDate.classList.add('active');
            }
            else{
                errorLogDate.textContent = '';
                dateInputBox.classList.remove('error-log');
                errorLogDate.classList.remove('active');
            }
        })
        dateInputBox.addEventListener('input', (e)=>{
            let inputDate = e.target.value;
            if (!this.isShippingDateValid(inputDate)){
                errorLogDate.textContent = '*Ngày giao hàng không hợp lệ';
                dateInputBox.classList.add('error-log');
                errorLogDate.classList.add('active');
            }
            else{
                errorLogDate.textContent = '';
                dateInputBox.classList.remove('error-log');
                errorLogDate.classList.remove('active');
            }
        })

        const emailInputBox = this.mainContent.querySelector('#email');
        const errorLogEmail = this.mainContent.querySelector('.error-mess.email');
        emailInputBox.addEventListener('input', (e)=>{
            let inputEmail = e.target.value;
            if (!this.isEmailValid(inputEmail)){
                errorLogEmail.textContent = '*Email không hợp lệ';
                emailInputBox.classList.add('error-log');
                errorLogEmail.classList.add('active');
            }
            else{
                errorLogEmail.textContent = '';
                emailInputBox.classList.remove('error-log');
                errorLogEmail.classList.remove('active');
            }
        })

        this.handleProducts();
          
        //Handle registration
        this.handleRegistration();

        this.handleNewsDragAndDrop();

        //Highlight Menu1 on click
        const menu1NavBar = this.header.querySelector('.navbar__item:first-child');
        menu1NavBar.addEventListener('click', () =>{
            menu1NavBar.classList.toggle('active');
        })

        const menu1Footer = this.footer.querySelector('.footer-item-link:nth-child(2)');
        menu1Footer.addEventListener('click', () =>{
            menu1Footer.classList.toggle('active');
        })

        
    },
    start: function(){
        this.handleEvents();
    }
}

app.start();