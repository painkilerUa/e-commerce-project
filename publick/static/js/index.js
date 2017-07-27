(function () {
    var linkMoreManufacturers = document.getElementById('link-more-manufacturers'),
        linkLessManufacturers = document.getElementById('link-less-manufacturers'),
        secondPartListManufacturers = document.getElementById('second-part-list-manufacturers'),
        buttMoreManufacturers = document.getElementById('butt-more-manufacturers'),
        buttLessManufacturers = document.getElementById('butt-less-manufacturers');

    linkMoreManufacturers.addEventListener('click', showSecondPart);
    linkLessManufacturers.addEventListener('click', hideSecondPart);


    function showSecondPart(e){
        e.preventDefault();
        secondPartListManufacturers.style.display = 'block';
        buttLessManufacturers.style.display = 'block';
        buttMoreManufacturers.style.display = 'none';
    }
    function hideSecondPart(e){
        e.preventDefault();
        buttLessManufacturers.style.display = 'none';
        secondPartListManufacturers.style.display = 'none';
        buttMoreManufacturers.style.display = 'block';
    }
// part for xmlrequest get models
    var linkManufacturers = document.getElementsByClassName('form-link-manufacturers');
    for(var i = 0; i < linkManufacturers.length; i++){
        linkManufacturers[i].addEventListener('click', XMLHttpRequestModels);
    }
    function XMLHttpRequestModels(e){
        e.preventDefault();
        var query = JSON.stringify({'mfa_id' : e.target.dataset.mfa_id});
        var xhr = new XMLHttpRequest();
        xhr.open('post', '/get-models', true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.send(query);
        xhr.onreadystatechange = function() {
            var innerHTML;
        if (xhr.status != 200) {
            innerHTML = 'Сбои в работе программы подбора автозапчатей, отбратитесь к специалистам для подбора автозапчастей :-(';
        } else {
            innerHTML = xhr.responseText;
        }
        document.getElementById('second-tab').innerHTML = innerHTML;
        document.getElementById('choosing-car-form-tab-1').classList.remove('current');
        document.getElementById('choosing-car-form-tab-2').classList.add('current');
        document.getElementById('first-tab').classList.remove('active-tab');
        document.getElementById('second-tab').classList.add('active-tab');
        addEventListenersOnModels();
        }
    } 
// part for xmlrequest get types
    function addEventListenersOnModels(){
        var linkModels = document.getElementsByClassName('form-link-model');
        for(var j = 0; j < linkModels.length; j++){
            linkModels[j].addEventListener('click', XMLHttpRequestTypes);
        }
    }
    
    function XMLHttpRequestTypes(e){
        e.preventDefault();
        var queryType = JSON.stringify({'mod_id' : e.target.dataset.mod_id});
        console.log(queryType);
        var xhrType = new XMLHttpRequest();
        xhrType.open('post', '/get-types', true);
        xhrType.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhrType.send(queryType);
        xhrType.onreadystatechange = function() {
        if (xhrType.status != 200) {
            innerHTML = 'Сбои в работе программы подбора автозапчатей, отбратитесь к специалистам для подбора автозапчастей :-(';
        } else {
            innerHTML = xhrType.responseText;
        } 
        document.getElementById('third-tab').innerHTML = innerHTML;
        document.getElementById('choosing-car-form-tab-2').classList.remove('current');
        document.getElementById('choosing-car-form-tab-3').classList.add('current');
        document.getElementById('second-tab').classList.remove('active-tab');
        document.getElementById('third-tab').classList.add('active-tab');
        addEventListenersOnTypes()
        }
    }
// Add car to localStorage
    function addEventListenersOnTypes(){
        var linkTypes = document.getElementsByClassName('form-link-type');
        for(var k = 0; k < linkTypes.length; k++){
            linkTypes[k].addEventListener('click', addCarToLocalStorage);
        }
    }

    function addCarToLocalStorage(e){
//        e.preventDefault();
        var typ_id = e.target.dataset.typ_id;
        var curCar = [{'typ_id' : typ_id}];
        if('carsArray' in localStorage){
            var repeated = false;
            var existedCars = JSON.parse(localStorage.carsArray);
            for(var i = 0; i < existedCars.length; i++){
                if(existedCars[i]['typ_id'] == typ_id){
                    repeated = true;
                    break;
                }
            }
            if(!repeated) 
            localStorage.carsArray = JSON.stringify(JSON.parse(localStorage.carsArray).concat(curCar));
        }
        else{
            localStorage.carsArray = JSON.stringify(curCar);
        }
    }
}());
(function () { 
    changeCartCount();
    var addToCartButtons = document.getElementsByClassName('button-add-to-cart');
    for(var i = 0; i < addToCartButtons.length; i++){
        addToCartButtons[i].addEventListener('click', addToCart)
    }
    function addToCart(e){
        var currentProduct = JSON.parse(e.target.getAttribute("data-product-id"));
        
        if(localStorage.products == undefined || localStorage.products == ''){
            localStorage.products = JSON.stringify(
                [{
                    id : currentProduct['id'],
                    name : currentProduct['name'],
                    price : currentProduct['price'],
                    purchase_price : currentProduct['purchase_price'],
                    img_url : currentProduct['img_url'],
                    product_url : currentProduct['product_url'],
                    ordered : 1,
                    provider_num : currentProduct['provider_num']
                }]
            );
        }else{
            var products = JSON.parse(localStorage.products);
            var idArr = [];
            for(var i = 0; i < products.length; i++){
                idArr.push(products[i]['id']);
            }
            if(idArr.indexOf(currentProduct['id']) == -1){
                products.push({
                    id : currentProduct['id'],
                    name : currentProduct['name'],
                    price : currentProduct['price'],
                    purchase_price : currentProduct['purchase_price'],
                    img_url : currentProduct['img_url'],
                    product_url : currentProduct['product_url'],
                    ordered : 1,
                    provider_num : currentProduct['provider_num']
                });
            }else{
                products[idArr.indexOf(currentProduct['id'])].ordered++;
            }
            localStorage.products = JSON.stringify(products);
        }
        changeCartCount();
        showPopupCart();
    }
    function changeCartCount(){
        if(localStorage.products){
            var products = JSON.parse(localStorage.products);
            var count = 0;
            for(var i = 0; i < products.length; i++){
                count += +products[i]['ordered']
            }
        }else{
            count = 0;
        }
        var cartCount = document.getElementById('cart-count');
        if(count){
            cartCount.innerHTML = count;
        }else{
            cartCount.innerHTML = '';
        }
    }
    // popup part
    var popupCart = document.getElementById('popup-cart');
    var wrapPopupCart = document.getElementById('wrap-popup-cart');
    var popupCartProducts = document.getElementById('popup-cart-products');
    var buttonClosePopupCart = document.getElementsByClassName('button-close-popup-cart');
    for(var i = 0; i < buttonClosePopupCart.length; i++){
        buttonClosePopupCart[i].addEventListener('click', closePopupCart);
    }
    var buttonClosePopupCartTop = document.getElementById('button-close-popup-cart-top');
    buttonClosePopupCartTop.addEventListener('click', closePopupCart);
    function showPopupCart(){
        var products = JSON.parse(localStorage.products);
        var innerHTML = "";
        for(var i = 0; i < products.length; i++){
            innerHTML += row(products[i]);
        }
        function row(product){
            return "<li class='row-in-popup-cart' id='row-in-cart-" + product.id + "'><div class='wrap-img-cart'><img src='" + product.img_url + "' alt='img'></div><div class='wrap-name-product-cart'><a href='/products/" + product.product_url + "'>" + product.name + "</a></div><div class='wrap-price-cart'>" + product.price + " грн." + "</div><div class='wrap-quantity-cart'><div class='button-increase-cart' data-product-id='" + product.id + "'></div><input disabled type='text' name='quantity' value='" + product.ordered + "' id='input-ordered-cart-form-" + product.id + "'><div class='button-decrease-cart' data-product-id='" + product.id + "'></div></div><div class='wrap-icon-remove-product-from-cart'><div class='icon-remove-from-product-cart' data-product-id='" + product.id + "'></div></div></li>";
        }
        popupCartProducts.innerHTML = innerHTML;
        popupCart.classList.add('active-popup-cart');
        wrapPopupCart.style.height = document.body.scrollHeight + 'px';
        document.getElementById('popup-cart').style.top = window.pageYOffset + 50 + 'px';
        var buttonsIncrease = document.getElementsByClassName('button-increase-cart');
        var buttonsDecrease = document.getElementsByClassName('button-decrease-cart');
        var buttonsDeleteProduct = document.getElementsByClassName('icon-remove-from-product-cart');

        for(var i = 0; i < buttonsIncrease.length; i++){
            buttonsIncrease[i].addEventListener('click', increaseNumProduc);
        }

        for(var i = 0; i < buttonsDecrease.length; i++){
            buttonsDecrease[i].addEventListener('click', decreaseNumProduc);
        }
        for(var i = 0; i < buttonsDeleteProduct.length; i++){
            buttonsDeleteProduct[i].addEventListener('click', deleteProdFromCart);
        }

        setFullCostCart();
    }
    function closePopupCart(e){
        e.preventDefault();
        popupCart.classList.remove('active-popup-cart');
        wrapPopupCart.style.height = 0;
    }

    function increaseNumProduc(e){
        var products = JSON.parse(localStorage.products);
        var productId = e.target.getAttribute('data-product-id');
        var ordered;
        for(var i = 0; i < products.length; i++ ){
            if(products[i]['id'] == productId){
                products[i]['ordered']++;
                ordered = products[i]['ordered'];
                break;
            }
        }
        localStorage.products = JSON.stringify(products);
        changeInputValue('input-ordered-cart-form-' + productId, ordered);
        setFullCostCart();
        changeCartCount();
    }
    function decreaseNumProduc(e){
        var products = JSON.parse(localStorage.products);
        var productId = e.target.getAttribute("data-product-id");
        var ordered;
        for(var i = 0; i < products.length; i++ ){
            if(products[i]['id'] == productId){
                if(products[i]['ordered'] > 1){
                    products[i]['ordered']--;
                }
                ordered = products[i]['ordered'];
                break;
            }
        }
        localStorage.products = JSON.stringify(products);
        changeInputValue('input-ordered-cart-form-' + productId, ordered);
        setFullCostCart();
        changeCartCount();
    }
    function changeInputValue(id, value){
        document.getElementById(id).setAttribute('value', value);
    }
    function deleteProdFromCart(e){
        var products = JSON.parse(localStorage.products);
        var productId = e.target.getAttribute('data-product-id');
        var index;
        for(var i = 0; i < products.length; i++ ){
            if(products[i]['id'] == productId){
                index = i;
                break;
            }
        }
        products.splice(index, 1);
        localStorage.products = JSON.stringify(products);
        deleteProductFromCartList('row-in-cart-' + productId);
        setFullCostCart();
        changeCartCount();
    }
    function deleteProductFromCartList(id){
        document.getElementById(id).parentNode.removeChild(document.getElementById(id));
    }
    function setFullCostCart(){
        var products = JSON.parse(localStorage.products);
        var fullCost = 0;
        for(var i = 0; i < products.length; i++){
            fullCost += +products[i].price * (+products[i].ordered);
        }
        document.getElementById('full-cost-popup-cart').innerHTML = 'Итого: ' + fullCost + ' грн.'
    }
}());

(function () {
        if(document.location.pathname == '/'){
        }else{
            document.getElementById('button-main-menu').addEventListener('click', showMenu);
            var isShowed = false;
            function showMenu(e){
                e.preventDefault();
                var menu = document.getElementById('popup-main-menu');
                if(!isShowed){
                    menu.classList.remove('popup-hide-main-menu');
                    menu.classList.add('popup-show-main-menu');
                    isShowed = true;
                }else{
                    menu.classList.remove('popup-show-main-menu');
                    menu.classList.add('popup-hide-main-menu');
                    isShowed = false;
                }
            }
        }
}());
