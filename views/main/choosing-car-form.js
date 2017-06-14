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