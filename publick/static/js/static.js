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
 