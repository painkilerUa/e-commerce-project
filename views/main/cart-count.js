(function () { 
    changeCartCount();
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
 