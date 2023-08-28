var express = require('express')
var router = express.Router()

//
// Login Form
//
router.get('/', function (req, res) {
    var message = req.query.login_message
    res.render('login-form', {
        layout: 'login-layout',
        login_message: message
    })
})


//
// Login Process
//
router.post('/', function (req, res) {
    var passphrase_entered = req.body.passphrase
    req.session.is_logged_in = 0

    const fs = require('fs')
    const path = './passphrase.json'
    var correct_passphrase = fs.readFileSync(path, 'utf8')
    console.log('passphrase_entered:', passphrase_entered)
    console.log('correct_passphrase:', correct_passphrase)
    var passphrase_json = JSON.parse(correct_passphrase)
    console.log('passphrase_json:', passphrase_json)
    if (passphrase_entered === passphrase_json) {
        console.log("passphrase success")
        req.session.is_logged_in = 1
        // Go to homepage
        res.redirect(303, '/home')
    } else {
        console.log("passphrase failure:", passphrase_entered)
        req.session.is_logged_in = 0

        // Redirect back to login page with error message
        var message = encodeURIComponent('Incorrect passphrase. Please try again.')
        res.redirect(303, '/login/?login_message=' + message)
    }
})

module.exports = router

function getRawDate() {
    var date = new Date()
    var moment = require('moment')
    var dt = moment.tz(date, 'America/Los_Angeles')
    dt = dt.format('YYYY-MM-DD HH:mm:ss')
    return dt
}
