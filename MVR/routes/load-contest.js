var express = require('express')
var router = express.Router()
var fs = require('fs')
var querystring = require("querystring")

// Load Contest
router.get('/', function (req, res) {
    var message = req.query.message
    res.render('load-contest', {
        message: message
    })
})

// Preview Contest
router.post('/preview', function (req, res) {
    var formidable = require('formidable')
    var form = new formidable.IncomingForm()
    form.encoding = 'utf-8';
    form.uploadDir = "./data/uploads/raw";
    form.parse(req, function (err, fields, files) {
        console.log('form fields', fields)
        console.log('files', files)

        var error_message = ''
        var contestants_upload = files.contestants_upload
        console.log('contestants_upload:',contestants_upload)
        if (contestants_upload.type !== 'application/json') {
            error_message += ' Please upload contestants in a JSON file (.json).'
        }

        var ballots_upload = files.ballots_upload
        console.log('ballots_upload:',ballots_upload)

        if (!((ballots_upload.type === 'text/csv') || (ballots_upload.type === 'application/vnd.ms-excel'))) {
            error_message += ' Please upload ballot in a CSV file (.csv).'
        }

        // If error message then return to form.
        //console.log('error_message:',error_message)
        if (!error_message == ''){
            var message = error_message
            res.render('load-contest', {
                message: message
            })
        } else {
            // Validate the uploaded contestants JSON file
            var json
            error_message = ''
            var upload_json_name = contestants_upload.name
            var old_path = contestants_upload.path
            var new_path = './data/uploads/' + upload_json_name
            //console.log('new_path:', new_path)
            fs.copyFile(old_path, new_path, function (err) {
                if (err) throw err
                var response = validate_upload_json(new_path)
                var status = response.status
                var message = response.message
                json = response.json
                if (status === false) {
                    error_message += message
                }

                // Convert the CSV file to JSON
                error_message = ''
                var upload_csv_name = ballots_upload.name
                var upload_csv_path = ballots_upload.path
                const csvtojson=require('csvtojson')
                csvtojson()
                .fromFile(upload_csv_path)
                .then((csv2jsonObj)=>{
                    //console.log('csv2jsonObj:',csv2jsonObj)
                    var response = validate_upload_csv2jsonObj(csv2jsonObj)
                    var status = response.status
                    var message = response.message
                    var ballots_json = response.ballots_json
                    if (status === false) {
                        error_message += message
                    }
                    if (!error_message == ''){
                        var message = error_message
                        res.render('load-contest', {
                            message: message
                        })
                    } else {
                        res.render('preview-contest', {
                            upload_json_name: upload_json_name,
                            upload_json: json,
                            upload_csv_name: upload_csv_name,
                            upload_csv: csv2jsonObj,
                            ballots_json:ballots_json
                        })    
                    }
                })
            })
        }
    })
})
// Contest Confirmed
router.post('/confirmed', function (req, res) {
    var upload_json_name = req.body.upload_json_name
    var ballots_json = req.body.ballots_json
    //console.log('ballots_json:',ballots_json)
    var ballots_array = ballots_json.split(',');
    //console.log('ballots_array:',ballots_array)
    var upload_file = './data/uploads/' + upload_json_name
    var response = validate_upload_json(upload_file)
    var status = response.status
    var message = response.message
    var json = response.json
    if (status === false) {
        res.render('load-contest', {
            message: message
        })
    } else {
        jsonContests = json.contests
        jsonCandidates = JSON.stringify(json.candidates)//convert the Candidates array to a JSON object
        //console.log('json',json)
        //console.log('jsonContests',jsonContests)
        //console.log('jsonCandidates',jsonCandidates)
        jsonContest = jsonContests[0]
        //console.log('jsonContest',jsonContest)
        jsonBallots = JSON.stringify(ballots_array)

        // Remove ballots
        var folderpath = './data/ballots/'
        clear_folder(folderpath)
        // Remove contest
        var folderpath = './data/contest/'
        // Don't clear the contest folder (unless you wrap in callback). Files in this will will automatically be overwritten
        // Write JSON to contest files
        write_json_file(JSON.stringify(jsonContest), 'contests.json')
        write_json_file(jsonCandidates, 'candidates.json')
        write_json_file(jsonBallots, 'ballots.json')
        write_json_file(JSON.stringify([]), 'ballots_marked.json')
        // Proceed to final 'success' page
        res.render('contest-confirmed', {
            upload_json_name: upload_json_name,
            jsonCandidateList:jsonCandidates,
            jsonContest:jsonContest,
            jsonBallots:jsonBallots
        })
    }
})
module.exports = router

function write_json_file(filedata, filename) {
    fs.writeFile ("data/contest/"+filename, filedata, function(err) {
        if (err) throw err
        // Create duplicate in data/contest_history/timestamp/
        var rawdate = getRawDate();
        var datedir = "data/contest_history/"+rawdate
        if (!fs.existsSync(datedir)){
            fs.mkdirSync(datedir);
        }
        fs.writeFile (datedir+ "/"+filename, filedata, function(err) {
            if (err) throw err
        })
    })
}

function clear_folder(folderpath) {
    fs.readdir(folderpath, (err, files) => {
        //console.log('files', files)
        files.forEach(file => {
            var ext = file.substr(file.lastIndexOf('.') + 1)
            if (ext === 'json') {
                fs.unlinkSync(folderpath+file);
            }
        })
    })
}

function validate_upload_json(filepath) {
    var contents = fs.readFileSync(filepath, 'utf8');
    //console.log('contents', contents)
    var json = JSON.parse(contents);
    //console.log('json', json)

    var response = {}
    response.status = true
    response.message = ''
    response.json = json

    // Check for 'Contest' object
    if(!json.hasOwnProperty('contests')){
        response.message += ' The selected file is missing the object "Contest". '
        response.status = false
    } else {
        jsonContests = json.contests
        if (!Array.isArray(jsonContests)) {
            response.message += ' The "contests" object in the selected file is not an array. '
            response.status = false
        } else {
            jsonContest = jsonContests[0] // For the pilot select the one and only contest
            if(!jsonContest.hasOwnProperty('description')){
                response.message += ' The selected file is missing the object "contest.description". '
                response.status = false
            } 
            if(!jsonContest.hasOwnProperty('id')){
                response.message += ' The selected file is missing the object "contest.id". '
                response.status = false
            } 
        }
    }

        // Check for 'Candidates' object
    if(!json.hasOwnProperty('candidates')){
        response.message += ' The selected file is missing the object "candidates". '
        response.status = false
    }
    // Check contents of 'Candidates' object
    else {
        jsonCandidates = json.candidates
        if (!Array.isArray(jsonCandidates)) {
            response.message += ' The "candidates" object in the selected file is not an array. '
            response.status = false
        } else {
            for(let jsonCandidate of jsonCandidates) {
                if(!jsonCandidate.hasOwnProperty('description')){
                    response.message += ' At lease one of the objects in the "candidates" array of the selected file is missing the object "description". '
                    response.status = false
                } 
                if(!jsonCandidate.hasOwnProperty('id')){
                    response.message += ' At lease one of the objects in the "candidates" array of the selected file is missing the object "id". '
                    response.status = false
                } 
                if(!jsonCandidate.hasOwnProperty('type')){
                    response.message += ' At lease one of the objects in the "candidates" array of the selected file is missing the object "type". '
                    response.status = false
                } 
            }
        }

    }
    return response
}

function validate_upload_csv2jsonObj(csv2jsonObj) {
    //console.log('validate_upload_csv2jsonObj.csv2jsonObj:', csv2jsonObj)
    var status = true
    var ballots_json = []
    var response = {}
    if (!Array.isArray(csv2jsonObj)) {
        response.message += ' The "csv2jsonObj" object in the converted ballots file is not an array. '
        response.status = false
    } else {
        for(let ballot_obj of csv2jsonObj) {
            //{"cart":"3","tray":"1","tabulator":"99808","batch":"81","ballot in batch":"1","imprint":"99808-81-1","absolute ballot index":"1"}
            if(!ballot_obj.hasOwnProperty('imprint')){
                response.message += ' The selected ballot file is missing the object "imprint". '
                status = false
            } else {
                let b = ballot_obj.imprint
                ballots_json.push(b)
            }
        }
    }
    var response = {}
    response.status = status
    response.message = ''
    response.csv = csv2jsonObj
    response.ballots_json = ballots_json

    return response
}

function getRawDate() {
    var date = new Date()
    var moment = require('moment')
    var dt = moment.tz(date, 'America/Los_Angeles')
    dt = dt.format('YYYYMMDDHHmmss')
    return dt
}
