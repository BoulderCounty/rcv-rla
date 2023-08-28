// See also https://expressjs.com/en/guide/routing.html
var express = require('express')
var router = express.Router()
var fs = require('fs')

var querystring = require('querystring')

router.post('/submit-ballot/', function (req, res) {
    //console.log("submit-ballot req.body", req.body)

    // Write ballot to JSON
    var ballot_string_calc = req.body.ballot_string_calc

    // Write ballot and history to JSON
    var filepath='data/ballots/'
    var historypath='data/ballots_history/'
    var filedata = ballot_string_calc
    var ballot_id = req.body.imprinted_id
    var filenameprefix=getRawDate() + '_' + ballot_id
    var filename = filenameprefix + '.json'
    write_data_to_disk(filepath, historypath, filename, filedata)

    // Append ballot id to list of marked ballots
    var ballots_marked = fs.readFileSync('data/contest/ballots_marked.json', 'utf8')
    var ballots_marked_json = JSON.parse(ballots_marked)
    var ballots_marked_array = []
    for(let ballot_json of ballots_marked_json) {
        ballots_marked_array.push(ballot_json)
    }
    ballots_marked_array.push(ballot_id)
    var ballots_back_to_json = JSON.stringify(ballots_marked_array)

    fs.writeFile ("data/contest/ballots_marked.json", ballots_back_to_json, function(err) {
        if (err) throw err
    })

    res.redirect(307, '/ballots/ballot-success/') // 307 Temporary Redirect preserves form data
})
router.post('/ballot-success/', function (req, res) {
    var ballot_id = req.body.imprinted_id
    var ballot_string = req.body.ballot_string
    var ballot_string_calc = req.body.ballot_string_calc
    //console.log("ballot-success req.body", req.body)

    // Read candidates from JSON.
    var filepath = './data/contest/candidates.json'
    var candidates = fs.readFileSync(filepath, 'utf8')
    // TODO catch/report file read errors
    res.render('ballot-success', {
        ballot_id: ballot_id,
        ballot_string: ballot_string,
        ballot_string_calc: ballot_string_calc,
        candidates: candidates
    })
})
router.post('/discard-all-ballots/', function (req, res) {
    //console.log('discard-all-ballots')
    var fs = require('fs')
    fs.readdir('./data/ballots/', (err, files) => {
        //console.log('files', files)
        files.forEach(file => {
            //console.log(file)
            var ext = file.substr(file.lastIndexOf('.') + 1)
            if (ext === 'json') {
                //console.log(file)
                fs.unlinkSync('./data/ballots/'+file);
            }
        })
        // Clear the list of ballots entered.
        fs.writeFileSync ("data/contest/ballots_marked.json", JSON.stringify([]))
        var message = querystring.escape('Success discarding all ballots.')
        //console.log('message:', message)
        res.redirect(303, '/settings/?message=' + message)
    })
})

module.exports = router

function write_data_to_disk(filepath, historypath, filename, filedata) {
    fs.writeFile (filepath+filename, filedata, function(err) {
        if (err) throw err
        // Write backup file to logs
        fs.writeFile (historypath+filename, filedata, function(err) {
            if (err) throw err
        })
    })
}
function getRawDate() {
    var date = new Date()
    var moment = require('moment')
    var dt = moment.tz(date, 'America/Los_Angeles')
    dt = dt.format('YYYYMMDDHHmmssSSS')
    return dt
}
