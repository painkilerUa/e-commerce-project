module.exports = function(app){
    app.post('/api/login', (req, res, next) => {
        console.log(req.body)
    })
}