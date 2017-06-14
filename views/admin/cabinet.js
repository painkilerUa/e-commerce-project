(function () {
    searchProductCabinet = document.getElementById('search-product-cabinet');
    inputNameCabinet = document.getElementById('input-name-cabinet');
    inputCendorCabinet = document.getElementById('input-vendor-cabinet');
    if(searchProductCabinet){
        loadAllProductsForLocalStorage();
    }
    if(inputNameCabinet){
        inputNameCabinet.addEventListener('input', insertData);
    }
    if(inputCendorCabinet){
        inputCendorCabinet.addEventListener('input', insertData);
    }
    function loadAllProductsForLocalStorage(){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', location.href + 'ajax/', true);
        xhr.send();
        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return;
                if (xhr.status != 200) {
                    searchProductCabinet.innerHTML = xhr.status + ': ' + xhr.statusText;
                } else{
                    localStorage.productsForAdmin = xhr.responseText;
                }
            
        }
    }
    function insertData(e){
        if(e.target.getAttribute("id") == 'input-name-cabinet'){
            var nameSearchField = 'name';
        }else{
            var nameSearchField = 'vendor';
        }
        var searchQuery = e.target.value.toLowerCase();
        var products = JSON.parse(localStorage.productsForAdmin);
        var filtredProducts = products.filter(function(el){
            var searchValue = el[nameSearchField].toLowerCase();
            return searchValue.indexOf(searchQuery) !== -1;
        });
        var innerHTML = '<table><tbody><tr><td>Наименование</td><td>Артикул</td><td>Цена, грн</td><td>Кол-во</td><td>Поставщик</td></tr>'
        for(var i = 0; i < filtredProducts.length; i++){
            innerHTML += '<tr><td>' + filtredProducts[i].name + '</td><td>' + filtredProducts[i].vendor + '</td><td>' + filtredProducts[i].price + '</td><td>' + filtredProducts[i].quantity + '</td><td>' + filtredProducts[i].provider_num + '</td></tr>';
        }
        innerHTML += '</tbody></table>';
        document.getElementById('search-product-cabinet').innerHTML = innerHTML;

    }
}());
