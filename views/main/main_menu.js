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
