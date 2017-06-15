






module.exports = function(req, res, next){
    if(req.user.scope){
        res.send('COOL')
    }
}



//app.use(jwtCheck.unless({path: ['/api/login', '/slavery']}), (err, req, res, next) => {
//     if (err.name === 'UnauthorizedError') {
//     res.status(301).send('Unauthorized');
// }
//     next()
// })