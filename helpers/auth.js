module.exports.checkAuth = function(req, res, next) {
    const useId = req.session.userid;
    if(!useId) {
        res.redirect('/login');
    }
    next()
}