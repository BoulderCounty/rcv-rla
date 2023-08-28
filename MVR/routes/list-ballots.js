var express = require('express')
var router = express.Router()
var fs = require('fs')

// List Ballots
router.get('/', function (req, res) {
    var message = req.query.message

    var file_path = './data/contest/ballots.json'
    var ballots_entered_list = fs.readFileSync(file_path, 'utf8')
    var ballots_entered_json = JSON.parse(ballots_entered_list)
    var ballots_entered = ballots_entered_json.length

    var file_path = './data/contest/ballots_marked.json'
    var ballots_reviewed_list = fs.readFileSync(file_path, 'utf8')
    var ballots_reviewed_json = JSON.parse(ballots_reviewed_list)
    var ballots_reviewed = ballots_reviewed_json.length

    // Init remaining to the list of ballots submitted.
    //var ballots_remaining_array = ballots_entered_list.split(',')
    var ballots_remaining_array = []
    var ballots_remaining_json = {}
    for(let ballot_id of ballots_entered_json) {
        ballots_remaining_array.push(ballot_id)
    }
    //console.log("ballots_remaining_array:",ballots_remaining_array)
    // Remove from list any that have been seen
    for (let i in ballots_reviewed_json) {
        var ballot_reviewed = ballots_reviewed_json[i]
        //console.log('ballot_reviewed:', ballot_reviewed)
        let index = ballots_remaining_array.indexOf(ballot_reviewed);
        if (index !== -1) {
            //console.log('removing:', ballot_reviewed)
            ballots_remaining_array.splice(index, 1)
        }
    }
    console.log("ballots_remaining_array:",ballots_remaining_array)

    var ballots_remaining_json = {}
    var c = 0
    for(let ballot_id of ballots_remaining_array) {
        ballots_remaining_json[c] = ballot_id
        c++
    }

    console.log("ballots_remaining_json:",ballots_remaining_json)
    
    //var ballots_remaining_json = JSON.parse(ballots_remaining_array)
    //console.log("ballots_remaining_json:",ballots_remaining_json)
    // for(let ballot_id of ballots_entered_json) {
    //     ballots_remaining_json.push(ballot_id)
    // }
    var ballots_remaining = ballots_remaining_array.length
    res.render('list-ballots', {
        message: message,
        ballots_entered: ballots_entered,
        ballots_entered_json: ballots_entered_json,
        ballots_reviewed: ballots_reviewed,
        ballots_reviewed_json: ballots_reviewed_json,
        ballots_remaining: ballots_remaining,
        ballots_remaining_json: ballots_remaining_json
    })


    // var data = {}
    // data.ballot_files = []
    // var fs = require('fs')
    // fs.readdir('./data', (err, files) => {
    //     //console.log('files', files)
    //     files.forEach(file => {
    //         //console.log(file)
    //         var ext = file.substr(file.lastIndexOf('.') + 1)
    //         if (ext === 'json') {
    //             //console.log(file)
    //             var file_obj = fs.readFileSync('./data/'+file, 'utf8')
    //             //var file_obj = JSON.parse(fs.readFileSync('./data/'+file, 'utf8'))
    //             //console.log(file_obj)
    //             var obj = {
    //                 ballot_filename: file,
    //                 contents: file_obj
    //             }
    //             data.ballot_files.push(obj)
    //         }
    //     })
    // })
})

module.exports = router
