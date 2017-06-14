module.exports = function(req, res, next){
    res.status = 404;
    res.render('error404',{title:'Eror 404', message:'Page not found! eror 404'});
}
