(function () {
    var curUrl = document.location.pathname;
    var filterLink = document.getElementsByClassName('link-avtomobilnye-masla');
    for(var i = 0; i < filterLink.length; i++){
        if('checked' in filterLink[i].dataset){
            var regExp = new RegExp(filterLink[i].dataset.href + '(-|$)');
            filterLink[i].href = curUrl.replace(regExp, '');
            filterLink[i].href.replace('--', '-');
            if(filterLink[i].href[filterLink[i].href.length -1] == '-'){
                filterLink[i].href = filterLink[i].href.slice(0, filterLink[i].href.length -1)
            }
        }else{
            if(curUrl[curUrl.length - 1] == "/"){
                filterLink[i].href = curUrl + filterLink[i].dataset.href
            }else{
                filterLink[i].href = curUrl + '-' + filterLink[i].dataset.href
            }
        }
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
                    img_url : currentProduct['img_url'],
                    product_url : currentProduct['product_url'],
                    ordered : 1
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
                    img_url : currentProduct['img_url'],
                    product_url : currentProduct['product_url'],
                    ordered : 1
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
