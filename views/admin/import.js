(function () {
    //************************************************************************************************
    // Part for import busmarket price
    var buttonLoadBusmarketPrice = document.getElementById('button-load-busmarket-price');
    var conteinerForInformation = document.getElementById('conteiner-for-information');
    var conteinerForInformationSecond = document.getElementById('conteiner-for-information-second');

    if(buttonLoadBusmarketPrice !== null){
        buttonLoadBusmarketPrice.addEventListener('click', loadBusmarketPrice);
    }
    
    
    function loadBusmarketPrice(){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', location.href + '1', true);
        xhr.send();
        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) {
                buttonLoadBusmarketPrice.innerHTML = 'Готово!';
                if (xhr.status != 200) {
                    console.log(xhr.status + ': ' + xhr.statusText);
                } else {
                    conteinerForInformation.innerHTML = xhr.responseText; 
                }
            }
        } 
        buttonLoadBusmarketPrice.innerHTML = 'Загружаю ...';
        buttonLoadBusmarketPrice.disabled = true;
    }
    window.addProductToCatalog = function addProductToCatalog(){
        this.innerHTML = 'Загружаю ...';
        this.disabled = true;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', location.href + '2', true);
        xhr.send();
        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) {
                this.innerHTML = 'Готово!';
                if (xhr.status != 200) {
                    console.log(xhr.status + ': ' + xhr.statusText);
                } else {
                    conteinerForInformationSecond.innerHTML = xhr.responseText; 
                }
            }
        }
        document.getElementById('add-products-to-catalog').innerHTML = 'Загружаю ...';
        document.getElementById('add-products-to-catalog').disabled = true;
    }
    //**************************************************************************************************
    //Part for import oil price
    var buttonLoadOilPrice = document.getElementById('button-load-import-oil');
    var conteinerForInfOilImp = document.getElementById('conteiner-for-inform-oil-import');
    if(buttonLoadOilPrice !== null){
        buttonLoadOilPrice.addEventListener('click', loadOilPrice);
    }
    function loadOilPrice(){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', location.href + '1', true);
        xhr.send();
        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) {
                buttonLoadOilPrice.innerHTML = 'Готово!';
                if (xhr.status != 200) {
                    console.log(xhr.status + ': ' + xhr.statusText);
                } else {
                    conteinerForInfOilImp.innerHTML = xhr.responseText; 
                }
            }
        }
        buttonLoadOilPrice.innerHTML = 'Импортирую ...';
        buttonLoadOilPrice.disabled = true;
    }
    //**************************************************************************************************
    //Part for import antifreeze price
    var buttonLoadAntefreezePrice = document.getElementById('button-load-import-atifreeze');
    var conteinerForInfAntefreezeImport = document.getElementById('conteiner-for-inform-atifreeze-import');
    if(buttonLoadAntefreezePrice){
        buttonLoadAntefreezePrice.addEventListener('click', loadAntifreezePrice);
    }
    function loadAntifreezePrice(){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', location.href + 'ajax/', true);
        xhr.send();
        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) {
                buttonLoadAntefreezePrice.innerHTML = 'Готово!';
                if (xhr.status != 200) {
                    console.log(xhr.status + ': ' + xhr.statusText);
                } else {
                    conteinerForInfAntefreezeImport.innerHTML = xhr.responseText; 
                }
            }
        }
        buttonLoadAntefreezePrice.innerHTML = 'Импортирую ...';
        buttonLoadAntefreezePrice.disabled = true;
    }
    //**************************************************************************************************
    //Part for import washerliquid price
    var buttonLoadWasherliquidPrice = document.getElementById('button-load-import-washerliquid');
    var conteinerForInfWasherliquidImport = document.getElementById('conteiner-for-inform-washerliquid-import');
    if(buttonLoadWasherliquidPrice){
        buttonLoadWasherliquidPrice.addEventListener('click', loadWasherliquidPrice);
    }
    function loadWasherliquidPrice(){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', location.href + 'ajax/', true);
        xhr.send();
        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) {
                buttonLoadWasherliquidPrice.innerHTML = 'Готово!';
                if (xhr.status != 200) {
                    console.log(xhr.status + ': ' + xhr.statusText);
                } else {
                    conteinerForInfWasherliquidImport.innerHTML = xhr.responseText; 
                }
            }
        }
        buttonLoadWasherliquidPrice.innerHTML = 'Импортирую ...';
        buttonLoadWasherliquidPrice.disabled = true;
    }
    //**************************************************************************************************
    //Part for import omegaautopostavka price
    var buttonLoadOmegaautopostavkaPrice = document.getElementById('button-load-import-omegaautopostavka');
    var conteinerForInfOmegaautopostavkaImport = document.getElementById('conteiner-for-inform-omegaautopostavka-import');
    if(buttonLoadOmegaautopostavkaPrice){
        buttonLoadOmegaautopostavkaPrice.addEventListener('click', loadOmegaautopostavkaPrice);
    }
    function loadOmegaautopostavkaPrice(){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', location.href + '1', true);
        xhr.send();
        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) {
                buttonLoadOmegaautopostavkaPrice.innerHTML = 'Готово!';
                if (xhr.status != 200) {
                    console.log(xhr.status + ': ' + xhr.statusText);
                } else {
                    conteinerForInfOmegaautopostavkaImport.innerHTML = xhr.responseText; 
                }
            }
        }
        buttonLoadOmegaautopostavkaPrice.innerHTML = 'Импортирую ...';
        buttonLoadOmegaautopostavkaPrice.disabled = true;
    }
}());

 