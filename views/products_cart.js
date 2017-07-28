(function () {
    if(localStorage.products == undefined || JSON.parse(localStorage.products).length == 0){
        document.getElementById('main-wrap-cart').innerHTML = '<span>Ваша корзина покупок пуста :-(</span>'
    }else{
        var products = JSON.parse(localStorage.products);
        var innerHTML = '';
        for(var i = 0; i < products.length; i++){
            innerHTML += row(products[i]);
        }
        function row(product){
            return "<li id='row-in-cart-" + product.id + "'><div class='wrap-img-cart'><img src='" + product.img_url + "' alt='img'></div><div class='wrap-name-product-cart'><a href='/products/" + product.product_url + "'>" + product.name + "</a></div><div class='wrap-price-cart'>" + product.price + " грн." + "</div><div class='wrap-quantity-cart'><div class='button-increase-cart' data-product-id='" + product.id + "'></div><input disabled type='text' name='quantity' value='" + product.ordered + "' id='input-ordered-cart-form-" + product.id + "'><div class='button-decrease-cart' data-product-id='" + product.id + "'></div></div><div class='wrap-icon-remove-product-from-cart'><div class='icon-remove-from-product-cart' data-product-id='" + product.id + "'></div></div></li>";
        }
        document.getElementById('goods-list').innerHTML = innerHTML;
    }
    var buttonsIncrease = document.getElementsByClassName('button-increase-cart');
    var buttonsDecrease = document.getElementsByClassName('button-decrease-cart');
    var buttonsDeleteProduct = document.getElementsByClassName('icon-remove-from-product-cart');
    if(buttonsIncrease){
        for(var i = 0; i < buttonsIncrease.length; i++){
            buttonsIncrease[i].addEventListener('click', increaseNumProduc);
        }
    }
    if(buttonsDecrease){
        for(var i = 0; i < buttonsDecrease.length; i++){
            buttonsDecrease[i].addEventListener('click', decreaseNumProduc);
        }
    }
    if(buttonsDeleteProduct){
        for(var i = 0; i < buttonsDeleteProduct.length; i++){
            buttonsDeleteProduct[i].addEventListener('click', deleteProdFromCart);
        }
    }
    if(localStorage.products != undefined && JSON.parse(localStorage.products).length != 0){
        setFullCostCart();
    }
    if(document.getElementById('ordered-products')){
        fillHiddedInput();
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
        fillHiddedInput();
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
        fillHiddedInput();
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
        fillHiddedInput();
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
        document.getElementById('full-cost-cart').innerHTML = 'Итого: ' + fullCost + ' грн.'
    }
    function fillHiddedInput(){
        var products = JSON.parse(localStorage.products);
        var returnedProd = [];
        for(var i = 0; i < products.length; i++){
            returnedProd.push(
                {
                    id : products[i]['id'],
                    name : products[i]['name'],
                    price : products[i]['price'],
                    purchase_price: products[i]['purchase_price'],
                    ordered : products[i]['ordered'],
                    provider_num : products[i]['provider_num']
                }
            )
        }
        document.getElementById('ordered-products').setAttribute('value', JSON.stringify(returnedProd));
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
}());

// var showInputLocalDel = document.getElementById('');
// showInputLocalDel.isShown = false;
//
// showInputLocalDel.addEventListener('change', function(){
//     document.getElementById('').style.display = showInputLocalDel.isShown ? '' : "block";
//     showInputLocalDel.isShown = !showInputLocalDel.isShown;
// })