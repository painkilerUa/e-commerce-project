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
