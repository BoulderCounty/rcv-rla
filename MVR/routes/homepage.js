var express = require('express')
var router = express.Router()

// Homepage
router.get('/', function(req, res){
    res.render('home', {
        currentFirstName: req.session.currentFirstName,
        currentLastName: req.session.currentLastName,
        currentUserName: req.session.currentUserName,
        app_count: 11,
        user_count: 22,
        dept_count: 33,
        agency_count: 44
    });
});
module.exports = router
