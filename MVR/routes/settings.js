var express = require('express')
var router = express.Router()
var querystring = require("querystring")

// Settings
router.get('/', function (req, res) {
    var ballot_prefix = req.session.ballot_prefix
    var message = req.query.message
    res.render('settings', {
        ballot_prefix: ballot_prefix,
        message: message
    })
})

router.post('/ballot_prefix/', function (req, res) {
    var new_ballot_prefix = req.body.ballot_prefix
    req.session.ballot_prefix = new_ballot_prefix
    var message = 'Updated default ballot prefix to ' + new_ballot_prefix
    res.render('settings', {
        ballot_prefix: new_ballot_prefix,
        message: message
    })
})

// TODO: Implement or remove
router.post('/passphrase/', function (req, res) {
    var checkbox_require_passphrase = req.body.checkbox_require_passphrase
    var passphrase = req.body.passphrase
    
    var message = 'Updated checkbox_require_passphrase: ' + checkbox_require_passphrase + ' - passphrase: ' + passphrase
    var ballot_prefix = req.session.ballot_prefix

   // if (checkbox_require_passphrase)
    res.render('settings', {
        checkbox_require_passphrase: checkbox_require_passphrase,
        passphrase: passphrase,
        ballot_prefix: ballot_prefix,
        message: message
    })
})

router.post('/generate-random-ballots/', function (req, res) {
    var fs = require('fs')

    // Read contest details
    var filepath = './data/contest/contests.json'
    var contest = fs.readFileSync(filepath, 'utf8')
    var contest_json = JSON.parse(contest)
    var contest_desc = contest_json.description
    var contest_id = contest_json.id
    var contest_details = contest_desc + ' (id: ' + contest_id + ")"

    // Read candidate list
    var filepath = './data/contest/candidates.json'
    var candidate_list = fs.readFileSync(filepath, 'utf8')

    // Read ballots list
    var filepath = './data/contest/ballots.json'
    var ballot_ids_list_string = fs.readFileSync(filepath, 'utf8')
    console.log('ballot_ids_list_string:', ballot_ids_list_string)
    var ballot_ids_list = JSON.parse(ballot_ids_list_string)
    console.log('ballot_ids_list:', ballot_ids_list)


    var export_data = {}

    // Create 'contests' object and populate
    var contests = []
    var contest_obj = {}
    contest_obj.description = contest_json.description
    contest_obj.id = contest_json.id
    contests.push(contest_obj)
    export_data.contests = contests

    // Create 'candidates' object and populate
    var candidates = []
    var candidate_list_obj = JSON.parse(candidate_list)
    var num_candidates = candidate_list_obj.length
    num_candidates-- // exclude write-in
    console.log('num_candidates:', num_candidates)
    for (let candidate of candidate_list_obj) {
        var candidates_obj = {}
        candidates_obj.description = candidate.description
        candidates_obj.id = candidate.id
        candidates.push(candidates_obj)
    }
    export_data.candidates = candidates

    // Read and loop ballot list

    // Create 'ballots' object and populate
    var ballots = []

    for (let ballot_index in ballot_ids_list) {
        let ballot_id = ballot_ids_list[ballot_index]
        console.log('ballot_id:', ballot_id)

        // Get random candidate
        let random_index = Math.floor(Math.random() * num_candidates); 
        let random_candidate = candidate_list_obj[random_index]
        let random_candidate_id = random_candidate.id
        console.log('random_candidate_id:', random_candidate_id)

        //var marks = {"15":2,"16":3,"17":1}
        var can_quote = '"'+random_candidate_id+'"'
        var marks_string = '{"'+random_candidate_id+'": 1}'
        console.log('marks_string:', marks_string)
        var marks = JSON.parse(marks_string)
        console.log('marks:', marks)
        //var marks[can_quote] = 1
        //var marks[random_candidate_id] = 1

        var votes = {"339": marks}// replace hard-coded contest id
        var ballot_contents_json = {"id":ballot_id, "votes":votes}
        console.log('ballot_contents_json:', ballot_contents_json)
        ballots.push(ballot_contents_json)
    }
    export_data.ballots = ballots

    // Write results to disk.
    var export_filename = 'mvr_random.json'
    console.log("export_data",export_data)
    console.log("export_data_string",JSON.stringify(export_data))
    var export_data_string = JSON.stringify(export_data)
    fs.writeFile ("public/output/"+export_filename, export_data_string, function(err) {
        if (err) throw err
        // Create duplicate in data/contest_history/timestamp/
        var rawdate = getRawDate();
        var datedir = "data/contest_history/"+rawdate
        if (!fs.existsSync(datedir)){
            fs.mkdirSync(datedir);
        }
        fs.writeFile (datedir+ "/"+export_filename, export_data_string, function(err) {
            if (err) throw err
            // Show results and link to download
            var message = 'Success.'
            res.render('settings', {
                mvr_random: export_filename,
                message: message
            })
        })
    })
})
module.exports = router

function getRawDate() {
    var date = new Date()
    var moment = require('moment')
    var dt = moment.tz(date, 'America/Los_Angeles')
    dt = dt.format('YYYYMMDDHHmmss')
    return dt
}
