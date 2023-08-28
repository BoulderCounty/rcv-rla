var express = require('express')
var router = express.Router()
var fs = require('fs')

// Mark Ballot
router.get('/', function (req, res) {
    var message = req.query.message
    // Read candidates from JSON.
    var filepath = './data/contest/contests.json'
    var contest = fs.readFileSync(filepath, 'utf8')
    var contest_json = JSON.parse(contest)
    var contest_id = contest_json.id
    var contest_name = contest_json.description
    // Read candidates from JSON.
    var filepath = './data/contest/candidates.json'
    var candidates = fs.readFileSync(filepath, 'utf8')
    // Read ballots from JSON
    var filepath = './data/contest/ballots.json'
    var ballots = fs.readFileSync(filepath, 'utf8')
    var ballots_json = JSON.parse(ballots)
    var ballots_array = []
    for(let ballot_json of ballots_json) {
        ballots_array.push(ballot_json)
    }
    // Read ballots marked from JSON
    var filepath = './data/contest/ballots_marked.json'
    var ballots_marked = fs.readFileSync(filepath, 'utf8')
    ballots_marked_json = JSON.parse(ballots_marked)
    // Remove marked ballots from list of available ballots
    for(let ballot_marked of ballots_marked_json) {
        let index = ballots_array.indexOf(ballot_marked);
        if (index !== -1) {
            ballots_array.splice(index, 1)
        }
    }
    var ballots_remaining = ballots_array.length
    // If all ballots marked (ie. none left for the dropdown) then go to different page
    if (!ballots_array.length) {
        res.render('all-ballots-marked')
    } else {
        var ballot_prefix = req.session.ballot_prefix
        res.render('mark-ballot', {
            ballot_prefix: ballot_prefix,
            message: message,
            contest_id: contest_id,
            contest_name: contest_name,
            candidates: candidates,
            ballots: JSON.stringify(ballots_array),
            ballots_remaining: ballots_remaining
        })
    }
})

module.exports = router
