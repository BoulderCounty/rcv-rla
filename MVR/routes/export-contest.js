var express = require('express')
var router = express.Router()
var fs = require('fs')

// Export Contest
router.get('/', function (req, res) {
    var message = req.query.message
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
    var ballot_ids_list = fs.readFileSync(filepath, 'utf8')

    var ballot_contents_list = ' TODO '
    //var candidates_json = JSON.parse(contest)

    var export_data = {}

    var export_filename_csv = 'mvr_ballots.csv'

    var export_data_string_csv = 'ballot_imprint_id,ballot_file,votes\r\n'
    fs.writeFileSync ("public/output/"+export_filename_csv, export_data_string_csv)

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
    for (let candidate of candidate_list_obj) {
        var candidates_obj = {}
        candidates_obj.description = candidate.description
        candidates_obj.id = candidate.id
        candidates.push(candidates_obj)
    }
    export_data.candidates = candidates

    // Create 'ballots' object and populate
    var ballots = []

    // Read folder
    fs.readdir('./data/ballots/', (err, files) => {
        //console.log('files', files)
        files.forEach(file => {
            //console.log(file)
            var ext = file.substr(file.lastIndexOf('.') + 1)
            if (ext === 'json') {
                var ballot = {}
                var ballot_contents = fs.readFileSync('./data/ballots/'+file, 'utf8')
                var ballot_contents_json = JSON.parse(ballot_contents)
                console.log('ballot_contents_json',ballot_contents_json)
                ballots.push(ballot_contents_json)
                var ballot_id = ballot_contents_json.id
                console.log('ballot_id',ballot_id)
                var ballot_votes = JSON.stringify(ballot_contents_json.votes)


                ballot_votes2 = ballot_votes.replace(/,/g, ' ') // TODO: instead of getting rid of commas wrap the string in single quotes
                console.log('ballot_votes2',ballot_votes2)

                var export_data_string_csv = ballot_id + ','+file + ',' + ballot_votes2 + '\r\n'
                fs.appendFileSync ("public/output/"+export_filename_csv, export_data_string_csv)
            }
        })
        export_data.ballots = ballots

        // Write results to disk.
        var export_filename_json = 'mvr_output.json'
        //console.log("export_data",export_data)
        //console.log("export_data_string",JSON.stringify(export_data))
        var export_data_string = JSON.stringify(export_data)



        fs.writeFile ("public/output/"+export_filename_json, export_data_string, function(err) {
            if (err) throw err
            // Create duplicate in data/contest_history/timestamp/
            var rawdate = getRawDate();
            var datedir = "data/contest_history/"+rawdate
            if (!fs.existsSync(datedir)){
                fs.mkdirSync(datedir);
            }
            fs.writeFile (datedir+ "/"+export_filename_json, export_data_string, function(err) {
                if (err) throw err
                // Show results and link to download
                res.render('export-contest', {
                    message: message,
                    contest_details: contest_details,
                    candidate_list: candidate_list,
                    ballot_ids_list: ballot_ids_list,
                    ballot_contents_list: ballots,
                    export_data: export_data,
                    export_filename_json: export_filename_json,
                    export_filename_csv: export_filename_csv
                })
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
