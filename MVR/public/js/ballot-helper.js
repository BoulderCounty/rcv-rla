var num_candidates
// ===========================================================
// Page setup functions
// ===========================================================
function populate_ballot_checkboxes(candidates) {
    //console.log('candidates', candidates)
    num_candidates = candidates.length
    add_header_to_ballot(num_candidates)
    var candidate_num = 0
    var candidate_nam = ""
    var candidate_id = 0
    for(let candidate of candidates) {
        //console.log(candidate)
        candidate_num++
        var candidate_nam = candidate.description
        var candidate_id = candidate.id
        if (candidate.image)
            var candidate_img = '/img/candidates/' + candidate.image
        else
            var candidate_img = '/img/candidates/generic.png'
        add_candidate_to_ballot(num_candidates, candidate_num, candidate_nam, candidate_id, candidate_img)
    }
    
    // var candidate_num = 3
    // var candidate_nam = "Write-in"
    // var candidate_id = 45
    // var candidate_img = "/img/candidates/generic.png"
    // add_candidate_to_ballot(num_candidates, candidate_num, candidate_nam, candidate_id, candidate_img)

}
function add_header_to_ballot(number_of_candidates) {

    let ballot_row = document.createElement('div')
    $(ballot_row).addClass('row')
        .appendTo($("#ballot-container"))
    let spacer = document.createElement('div')
    $(spacer).addClass('col-xs-2')
        .html("&nbsp;")
        .appendTo(ballot_row)
    for (var i = 1; i <= number_of_candidates; i++) {
        let ballot_header = document.createElement('div')
        let ordinal = get_ordinal_suffix_of_integer(i)
        $(ballot_header).addClass('col-xs-1').addClass('text-bold')
            .html(ordinal + " Choice")
            .appendTo(ballot_row)
    }
}
function add_candidate_to_ballot(number_of_candidates, candidate_number, candidate_name, candidate_identifier, candidate_image) {

    let d = document.createElement('div')
    $(d).addClass('row')
        .appendTo($("#ballot-container"))

    let candidate = document.createElement('div')
    $(candidate).addClass('col-xs-2')
        .html("<div class='xsmall_image_container' style='margin-bottom:10px'><span class=' xsmall_image_border'><img class='img-circle' src='"+candidate_image+"' width='40'></span><span class='text-bold'>"+candidate_name+"</span></div>")
        .appendTo(d)
    // $(candidate).addClass('col-xs-2')
    //     .html("<div class='xsmall_image_container'><span class=' xsmall_image_border'><img class='img-circle' src='"+candidate_image+"' width='40'></span><span class='text-bold'>"+candidate_name+"</span>&nbsp;(id:<span class='text-bold'>"+candidate_identifier+"</span>)</div>")
    //     .appendTo(d)
    for (var i = 1; i <= number_of_candidates; i++) {
        let ballot_checkbox = document.createElement('div')
        let ballot_id = "rank"+i+"_can" + candidate_number
        $(ballot_checkbox).addClass('col-xs-1')
            .html("<div class='checkbox-oval'><input type='checkbox' id='"+ballot_id+"' data-can_id='"+candidate_identifier+"' /><label for='"+ballot_id+"'>&nbsp;</label></div>")
            .appendTo(d)
        // $(ballot_checkbox).addClass('col-xs-1')
        //     .html("<div class='checkbox-oval'><input type='checkbox' id='"+ballot_id+"' data-can_id='"+candidate_identifier+"' /><label for='"+ballot_id+"'>&nbsp;</label></div>")
        //     .appendTo(d)
    }
}
function populate_ballot_dropdown(ballot_id_list) {
    //console.log('ballot_id_list', ballot_id_list)
    let dropdown = $('#imprinted_id_dropdown')
    dropdown.empty()
    dropdown.append('<option selected="true" disabled>Choose Imprinted ID</option>')
    dropdown.prop('selectedIndex', 0)

    for(let ballot_id of ballot_id_list) {
        dropdown.append($('<option></option>').attr('value', ballot_id).text(ballot_id))
    }
}
function layout_ballot() {
    $("#reviewer-2").addClass("hidden")
    $("#verified-button").addClass("hidden")
    $("#edit-button").addClass("hidden")
    $("#no-consensus-button").addClass("hidden")
    $("#ballot-container").addClass("hidden")
    $("#ballot-button-container").addClass("hidden")
}
// ===========================================================
// UI/UX Workflow Functions
// ===========================================================
function submit_for_verification() {
    // Make sure ballot id is within the set
    var selected_value = $('#imprinted_id').val()
    //console.log('selected_value', selected_value)
    let is_ballot_id_valid = validate_imprinted_id(selected_value)
    //console.log('is_ballot_id_valid', is_ballot_id_valid)

    if (is_ballot_id_valid) {
        prepare_ballot_for_review()
    } else {
        $('#invalidBallotModal').modal('show')
    }
}
function submit_for_verification_with_confirmation() {
    // Make sure ballot id is within the set
    var selected_value = $('#imprinted_id').val()
    //console.log('selected_value', selected_value)
    let is_ballot_id_valid = validate_imprinted_id(selected_value)
    //console.log('is_ballot_id_valid', is_ballot_id_valid)

    if (is_ballot_id_valid) {
        let message_body = document.createElement('div')
        $(message_body).addClass('alert alert-warning')
        let message_details = document.createElement('div')
        let message_h1 = $('<h1>').text('Reviewer #1 - Confirm Submission').appendTo(message_details)
        var message_div = $('<div>')
            .append('TODO SHOW RANKING RESULTS')
            .appendTo(message_details)
        $(message_details).appendTo(message_body)
        bootbox.confirm({
            size: 'large',
            message: message_body,
            buttons: {
                confirm: {
                    label: 'Confirmed. Submit ballot for verification.',
                    className: 'btn-warning'
                },
                cancel: {
                    label: 'Cancel. Go back to ballot.'
                }
            },
            callback: function (result) {
                //console.log('This was logged in the callback: ' + result)
                if (result) {
                    prepare_ballot_for_review()

                    let message_body = document.createElement('div')
                    $(message_body).addClass('alert alert-info')
                    let message_h1 = $('<h1>').text('Reviewer #2').appendTo(message_body)
                    let message_h2 = $('<h2>').text('The ballot is now read-only. Click "Edit Ballot" to make changes.').appendTo(message_body)
                    bootbox.alert({
                        size: 'large',
                        message: message_body
                    })
                } else {
                    //alert('go back')
                }
            }
        })
    } else {
        $('#invalidBallotModal').modal('show')
    }
}
function prepare_ballot_for_review() {
    //$("#reviewer_heading").removeClass("alert-warning")
    //$("#reviewer_heading").addClass("alert-info")

    // Change panel color from warning to info
    $("#ballot-panel").removeClass("panel-warning")
    $("#ballot-panel").addClass("panel-info")

    // Change dropdown color from warning to gray
    $("#ballot-id-container").removeClass("alert-success")
    $("#ballot-id-container").removeClass("alert-danger")
    $("#ballot-id-container").removeClass("alert-warning")
    $("#ballot-id-container").addClass("alert-default")

    // Hide ballot id dropdown
    $("#dropdown-container").removeClass("show")
    $("#dropdown-container").addClass("hidden")

    $("#ballot-container").removeClass("alert-warning")
    $("#ballot-container").addClass("alert-info")

    // Swap visibility of review names
    $("#reviewer-1").addClass("hidden")
    $("#reviewer-2").removeClass("hidden")
    $("#reviewer-2").addClass("show")

    // Swap submit buttons
    $("#submit-button").addClass("hidden")
    $("#verified-button").removeClass("hidden")
    $("#verified-button").addClass("show")

    // Show/hide 'Edit', 'Clear', 'No Consensus', 'Contest Not on Ballot' buttons
    $("#reset-button").addClass("hidden")
    $("#edit-button").removeClass("hidden")
    $("#edit-button").addClass("show")
    $("#no-consensus-button").removeClass("hidden")
    $("#no-consensus-button").addClass("show")

    $("#not-on-ballot-button").removeClass("show")
    $("#not-on-ballot-button").addClass("hidden")

    // Make ballot read-only
    disable_ballot()
}
function reset_ballot() {
    //console.log('reset_ballot')
    $('input[type=checkbox]').prop('checked',false)
    $('#ballot-form input[type=checkbox]').attr('checked',false)
    update_json_preview()
}
function edit_ballot() {
    enable_ballot()
    // show reset
    $("#reset-button").removeClass("hidden")
    $("#reset-button").addClass("show")
    // hide self
    $("#edit-button").addClass("hidden")
}
function disable_ballot() {
    $("input:checkbox").attr('disabled', 'disabled')
    $("#imprinted_id").attr('disabled', 'disabled')
    $("#ballot-panel").removeClass("panel-success")
    $("#ballot-panel").removeClass("panel-danger")
    $("#ballot-panel").addClass("panel-default")
    // TODO Disable ballot id dropdown
}
function enable_ballot() {
    // Change ballot colors from info to success
    $("#ballot-panel").removeClass("panel-info")
    $("#ballot-panel").addClass("panel-success")
    $("#ballot-id-container").removeClass("alert-info")
    $("#ballot-id-container").addClass("alert-success")
    $("#ballot-container").removeClass("alert-info")
    $("#ballot-container").addClass("alert-success")

    // Update instructions to end user
    $("#reviewer-2").html("<h1>Reviewer #2 - Revise and verify</h1>")
    
    // Enable ballot-id dropdown and ballot checkboxes
    $("#dropdown-container").removeClass("hidden")
    $("#dropdown-container").addClass("show")
    $("input:checkbox").removeAttr('disabled')

    // Confirmation popup
    //let message_body = document.createElement('div')
    //$(message_body).addClass('alert alert-success')
    //let message_h1 = $('<h1>').text('Reviewer #2').appendTo(message_body)
    //let message_h2 = $('<h2>').text('The ballot is now editable.').appendTo(message_body)
    //bootbox.alert({
    //    size: 'large',
    //    message: message_body
    //})
}
function contest_not_on_ballot() {
    let message_body = document.createElement('div')
    $(message_body).addClass('alert alert-info')
    let message_details = document.createElement('div')
    $('<h2>').text('Reviewer #2, please confirm that the contest is not on the ballot.').appendTo(message_details)
    $('<div>')
        .appendTo(message_details)
    $(message_details).appendTo(message_body)
    bootbox.confirm({
        size: 'large',
        message: message_body,
        buttons: {
            confirm: {
                label: 'Confirmed. The contest is not on this ballot.',
                className: 'btn-success'
            },
            cancel: {
                label: 'Cancel. Go back to ballot.'
            }
        },
        callback: function (result) {
            if (result) {
                reset_ballot()
                let counted_json = count_as_not_on_ballot()
                $('#ballot_string_calc').text(counted_json)
                submit_ballot()
            } else {
                //alert('go back')
            }
        }
    })
}
function no_consensus() {
    let message_body = document.createElement('div')
    $(message_body).addClass('alert alert-info')
    let message_details = document.createElement('div')
    $('<h2>').text('Reviewer #2, please confirm that there is no consensus with Reviewer #1. The selections will be cleared and a blank ballot will be submitted.').appendTo(message_details)
    $('<div>')
        .appendTo(message_details)
    $(message_details).appendTo(message_body)
    bootbox.confirm({
        size: 'large',
        message: message_body,
        buttons: {
            confirm: {
                label: 'Confirmed. No Consensus. Submit blank ballot.',
                className: 'btn-success'
            },
            cancel: {
                label: 'Cancel. Go back to ballot.'
            }
        },
        callback: function (result) {
            if (result) {
                reset_ballot()
                submit_ballot()
            } else {
                //alert('go back')
            }
        }
    })    
}
function submit_ballot() {
    // Make sure ballot id is within the set
    $("#imprinted_id").removeAttr('disabled')
    var selected_value = $('#imprinted_id').val()
    //console.log('selected_value', selected_value)
    let is_ballot_id_valid = validate_imprinted_id(selected_value)
    //console.log('is_ballot_id_valid', is_ballot_id_valid)
    if (is_ballot_id_valid) {
        $("#ballot-form").submit()
    } else {
        $('#invalidBallotModal').modal('show')
    }
}
function submit_ballot_with_confirmation() {
    // Make sure ballot id is within the set
    $("#imprinted_id").removeAttr('disabled')
    var selected_value = $('#imprinted_id').val()
    //console.log('selected_value', selected_value)
    let is_ballot_id_valid = validate_imprinted_id(selected_value)
    //console.log('is_ballot_id_valid', is_ballot_id_valid)
    if (is_ballot_id_valid) {
        let mcvr_json = read_ballot_form()
        $('#ballot_string').val(mcvr_json)
        let counted_json = count_ballot_form()
        $('#ballot_string_calc').text(counted_json)

        let message_body = document.createElement('div')

        var h = $('<h3>').appendTo(message_body)
        $(h).text('Ballot Details')

        $(message_body).addClass('row')
        let d1 = document.createElement('div')
        $(d1).addClass('col-xs-6').appendTo(message_body)
        $(d1).addClass('alert alert-warning')
        var div1 = $('<div>').appendTo(d1)
        var message_h1 = $('<h1>').text('Literal Ballot').appendTo(div1)
        var ul = $('<ul>').appendTo(div1)
        // loop mcvr_json
        var obj = $.parseJSON(mcvr_json)
        var ballot_selections = obj.ballot_selections
        //console.log("obj",obj)
        //console.log("ballot_selections",ballot_selections)
        ballot_selections.forEach(function(entry) {
            //console.log(entry);
            //console.log("object.keys", Object.keys(entry));
            for ( var candidate in entry ) {
                //console.log("candidate", candidate );
                let rank_choice = entry[candidate]
                rank_choice = get_ordinal_suffix_of_integer(rank_choice)
                //console.log("rank_choice", rank_choice );
                li = $('<li>').appendTo(ul)
                span1 = $('<span>').appendTo(li)
                span1.text(rank_choice + ' - ' + candidate )
                var img = $('<img />').attr({
                            'src': '/img/candidates/'+candidate+'.png',
                            'width': 40,
                            'class': 'img-circle'
                        }).appendTo(li)
            }
        });
        let d2 = document.createElement('div')
        $(d2).addClass('col-xs-6').appendTo(message_body)
        $(d2).addClass('alert alert-success')
        var div1 = $('<div>').appendTo(d2)
        var message_h1 = $('<h1>').text('Counted Ballot').appendTo(div1)
        var ul = $('<ul>').appendTo(div1)
        // loop counted_json
        var obj = $.parseJSON(counted_json)
        var ballot_selections = obj.ballot_selections
        //console.log("obj",obj)
        //console.log("ballot_selections",ballot_selections)
        ballot_selections.forEach(function(entry) {
            //console.log(entry);
            //console.log("object.keys", Object.keys(entry));
            for ( var candidate in entry ) {
                //console.log("candidate", candidate );
                let rank_choice = entry[candidate]
                rank_choice = get_ordinal_suffix_of_integer(rank_choice)
                //console.log("rank_choice", rank_choice );
                li = $('<li>').appendTo(ul)
                span1 = $('<span>').appendTo(li)
                span1.text(rank_choice + ' - ' + candidate )
                var img = $('<img />').attr({
                            'src': '/img/candidates/'+candidate+'.png',
                            'width': 40,
                            'class': 'img-circle'
                        }).appendTo(li)
            }
        })
        bootbox.alert({
            size: 'large',
            message: message_body,
            callback: function (result) {
                $("#ballot-form").submit()
            }
        })
    } else {
        $('#invalidBallotModal').modal('show')
    }
}
function display_selection1(candidates, ballot_json) {
    let message_body = document.createElement('div')
    let d1 = document.createElement('div')
    $(d1).appendTo(message_body)
    var ul = $('<ul>').appendTo(d1)
    //console.log('ballot_json', ballot_json)
    var obj = $.parseJSON(ballot_json)
    //console.log('obj', obj)
    var ballot_selections = obj.ballot_selections
    //console.log('ballot_selections', ballot_selections)
    ballot_selections.forEach(function(entry) {
        //console.log("entry",entry);
        //console.log("object.keys", Object.keys(entry));
        for ( var selected_candidate in entry ) {
            //console.log("selected_candidate", selected_candidate )
            //console.log("candidates", candidates )
            // Lookup selected_candidate name from the id.
            var selected_name = ''
            var selected_image = 'generic.png'
            for(let can of candidates) {
                //console.log('can',can)
                if (can.id.toString() === selected_candidate.toString()){
                    selected_name = can.description
                    if (can.image) {
                        selected_image = can.image
                    }
                }
            }
            let rank_choice = entry[selected_candidate]
            rank_choice = get_ordinal_suffix_of_integer(rank_choice)
            //console.log("rank_choice", rank_choice );
            li = $('<li>').appendTo(ul)
            span1 = $('<span>').appendTo(li)
            span1.text(rank_choice + ' - ' + selected_name )
                $('<img />').attr({
                       'src': '/img/candidates/'+selected_image,
                       'width': 40,
                       'class': 'img-circle'
                }).appendTo(li)
        }
    });
    return message_body
}
function display_selection2(candidates, ballot_json) {
    //console.log('ballot_json', ballot_json)
    let message_body = document.createElement('div')
    let d1 = document.createElement('div')
    $(d1).appendTo(message_body)
    var ul = $('<ul>').appendTo(d1)
    var obj = $.parseJSON(ballot_json)
    //console.log('obj', obj)
    var votes = obj.votes
    //console.log('votes', votes)
    //console.log("Object.keys(votes)", Object.keys(votes))
    //console.log("Object.values(votes)", Object.values(votes))
    var ballot_selections = Object.values(votes)
    //console.log('ballot_selections', ballot_selections)
    var marks_obj = ballot_selections[0]
    //console.log("marks_obj:", marks_obj)
    var sorted_marks = sort_marks(marks_obj)
    var sorted_marks_string = JSON.stringify(sorted_marks)
    var x = sorted_marks_string.replace(/\\"/g, '')
    //console.log("sorted_marks:", sorted_marks)
    //console.log("sorted_marks_string:", sorted_marks_string)
    //console.log("x:", x)

    ballot_selections = [sorted_marks]

    ballot_selections.forEach(function(entry) {
        //console.log("entry",entry)
        contest_votes_keys = Object.keys(entry)
        //console.log('contest_votes_keys:', contest_votes_keys)
        //var contest_votes_keys_array = contest_votes_keys.split(",")
        var contest_votes_keys_array = contest_votes_keys
        //console.log('contest_votes_keys_array:', contest_votes_keys_array)

        // TODO Sort by rank - See also https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
        for (i = 0; i < contest_votes_keys_array.length; i++) {
            var selected_candidate_id = contest_votes_keys_array[i]
            //console.log("**************************")
            //console.log('selected_candidate_id:', selected_candidate_id)
            var selected_rank = entry[selected_candidate_id]
            //console.log('selected_rank:', selected_rank)

            //var selected_candidate_id_x = selected_candidate_id.replace(/\\"/g, '')
            //var selected_candidate_id_x = selected_candidate_id.replace(/\\\"/g, '')
            //console.log('selected_candidate_id_x:', selected_candidate_id_x)

            //console.log("candidates", candidates )
            // Lookup selected_candidate name from the id.
            var selected_name = ''
            var selected_image = 'generic.png'
            for(let can of candidates) {
                //console.log('-------------')
                //console.log('can',can)
                //console.log('can.id.toString()',can.id.toString())
                let yyy = '\"' + can.id + '\"'
                //console.log('yyy',yyy)
                //console.log('selected_candidate_id:', selected_candidate_id)
                if (yyy === selected_candidate_id){
                //if (can.id.toString() === selected_candidate_id.toString()){
                    selected_name = can.description
                    if (can.image) {
                        selected_image = can.image
                    }
                }
            }
            //let rank_choice = entry[selected_candidate]
            rank_choice = get_ordinal_suffix_of_integer(selected_rank)
            //console.log("rank_choice", rank_choice );
            li = $('<li>').appendTo(ul)
            span1 = $('<span>').appendTo(li)
            span1.text(rank_choice + ' - ' + selected_name )
                $('<img />').attr({
                       'src': '/img/candidates/'+selected_image,
                       'width': 40,
                       'class': 'img-circle'
                }).appendTo(li)
        }
    });
    return message_body
}
function sort_marks(marks_obj) {
    //console.log("sort_marks(marks_obj):", marks_obj)
    var rank_sorted = [null,null,null,null,null]
    let counter = 0
    for (let mark_key in marks_obj) {
        //console.log("mark_key:", mark_key)
        let mark_value = marks_obj[mark_key]
        //console.log("mark_value:", mark_value)
        //rank_sorted.splice(mark_value, 0, mark_key)
        let rank_index = mark_value-1
        rank_sorted[rank_index] = mark_key;
        counter++
    }
    //console.log("counter:", counter)
    var num_marks = counter + 1
    //console.log("num_marks:", num_marks)
    //console.log("rank_sorted:", rank_sorted)

    // Create object, loop rank sorted.
    var obj = {}
    for (rank_index = 0; rank_index < counter; rank_index++) {
        //console.log("rank_index:", rank_index)
        let rank_order = rank_index + 1
        //console.log("rank_order:", rank_order)
        var candidate_id = rank_sorted[rank_index]
        //console.log("candidate_id:", candidate_id)
        obj['"'+candidate_id+'"'] = rank_order
    }
    //console.log("obj:", obj)
    return (obj)
}
// ===========================================================
// Read and process ballot form
// ===========================================================
function update_json_preview() {
    let mcvr_json = read_ballot_form()
    $('#ballot_string').val(mcvr_json)
    let counted_json = count_ballot_form()
    $('#ballot_string_calc').text(counted_json)
}
function read_ballot_form() {
    var manual_cvr = {}
    var ballot_id_json = {}
    var ballot_key = "ballot_id"
    var ballot_value = $("#imprinted_id").val()
    ballot_id_json[ ballot_key ] = ballot_value
    var ballot_selections = []
    let n = num_candidates
    for(var i = 1; i <= n; i++) {
        for(var j = 1; j <= n; j++) {
            let varname = "rank" + i + "_can" + j
            //console.log("varname",varname)
            is_checked = $("#"+varname).is(':checked')
            //console.log(varname + "  is checked:",is_checked)
            if (is_checked){
                var bx = {}
                let candidate_id = $('#'+varname).attr('id')
                //console.log('candidate_id',candidate_id)
                let candidate_data = $('#'+candidate_id).attr('data-can_id')
                //console.log('candidate_data',candidate_data)
                bx[candidate_data] = i
                ballot_selections.push(bx)
            }
        }
    }
    manual_cvr = Object.assign({"ballot_selections": ballot_selections}, manual_cvr)
    manual_cvr = Object.assign({"ballot_id": ballot_value}, manual_cvr)
    let mcvr_json = JSON.stringify(manual_cvr)
    return mcvr_json
}
function count_ballot_form() {
    //console.log("count_ballot_form")
    var manual_cvr = {}
    var ballot_id_json = {}
    var ballot_key = "ballot_id"
    var ballot_value = $("#imprinted_id").val()
    ballot_id_json[ ballot_key ] = ballot_value
    var b1 = {}
    var ballot_selections = []
    var ballot_selections2 = {}
    var candidates_with_vote = []
    let n = num_candidates
    var flag_have_first_choice = false
    var flag_found_overvote = false
    var flag_ballot_invalid = false
    var rank_counter = 1;
    for(var rank = 1; rank <= n; rank++) {
        var flag_have_nth_choice = false
        var flag_okay_write_nth = false
        for(var candidate = 1; candidate <= n; candidate++) {
            let varname = "rank" + rank + "_can" + candidate
            //console.log("varname",varname)
            is_checked = $("#"+varname).is(':checked')
            //console.log(varname + "  is checked:",is_checked)
            if (is_checked){
                // See if have nth choice yet. If not then there is an overvote
                if (flag_have_nth_choice) {
                    flag_found_overvote = true
                    flag_okay_write_nth = false
                    // If there is an overvote before we have first choice then
                    // the ballot is invalid
                    if (!flag_have_first_choice) {
                        //console.log('First choice overvote. Ballot invalid')
                        flag_ballot_invalid = true
                    }
                } else {
                    let candidate_id = $('#'+varname).attr('id')
                    //console.log('candidate_id:', candidate_id)
                    if (candidate_id != 45) {// Ignore write-in candidates
                        var candidate_data = $('#'+candidate_id).attr('data-can_id')
                        //console.log('candidate_id',candidate_id)
                        //console.log('candidate_data',candidate_data)
                        // Only include if the candidate has not already been selected.
                        var index = candidates_with_vote.indexOf(candidate_data);
                        //console.log('index', index)
                        if (index == -1) {
                            //Toggle flag to say we have nth choice
                            flag_have_nth_choice = true
                            flag_okay_write_nth = true
                            //var bx = {}
                            //bx[candidate_data] = rank
                            candidates_with_vote.push(candidate_data)
                        }
                    }
                }
            }
        }
        // Only push if we have valid nth choice and no overvote
        if (flag_okay_write_nth && !flag_found_overvote) {
            // Ignore write-in id "45" for the pilot.
            //console.log('candidate_data', candidate_data)
            if (candidate_data !== "45") {
                var vote = {}
                vote[candidate_data] = rank_counter
                //console.log('vote:', vote)
                rank_counter++
                ballot_selections2 = Object.assign(vote, ballot_selections2)
              
                // If not yet first then toggle first
                if (!flag_have_first_choice) flag_have_first_choice = true
            }
        }
    }
    // If ballot is invalid send blank
    if (flag_ballot_invalid) {
        ballot_selections2 = {}
    }
    var votes = {}
    var contest_id = $('input[name="contest_id"]').val()
    votes[contest_id] = ballot_selections2
    manual_cvr = Object.assign({"votes": votes}, manual_cvr)
    manual_cvr = Object.assign({"id": ballot_value}, manual_cvr)
    let mcvr_json = JSON.stringify(manual_cvr)
    return mcvr_json
}
function count_as_not_on_ballot() {
    var manual_cvr = {}
    var ballot_id_json = {}
    var ballot_key = "ballot_id"
    var ballot_value = $("#imprinted_id").val()
    ballot_id_json[ ballot_key ] = ballot_value
    var votes = {}
    manual_cvr = Object.assign({"votes": votes}, manual_cvr)
    manual_cvr = Object.assign({"id": ballot_value}, manual_cvr)
    let mcvr_json = JSON.stringify(manual_cvr)
    return mcvr_json
}
function validate_imprinted_id(imprinted_id) {
    var found_ballot_id = false
    let imprinted_id_no_dashes = imprinted_id.replace(/-/g, "") // ignore dashes
    // Loop ballots in dropdown
    $("#imprinted_id_dropdown option").each(function(key, value){
        //console.log("key:", key)
        //console.log("value:", value)
        //console.log("$(this).attr('value') ", $(this).attr('value') )
        // See if the input field matches a dropdown value (ignore dashes)
        let dropdown_value = $(this).attr('value')
        if (dropdown_value) {// Value might be undefined so test for it.
            let dropdown_value_no_dashes = dropdown_value.replace(/-/g, "")
            if (imprinted_id_no_dashes === dropdown_value_no_dashes) {
                found_ballot_id = true
            }
        }
    })
    $("#ballot-id-container").removeClass("alert-success")
    $("#ballot-id-container").removeClass("alert-danger")
    $("#ballot-id-container").removeClass("alert-warning")
    if (found_ballot_id) {
        $("#ballot-id-container").addClass("alert-success")
        $("#ballot-container").removeClass("hidden")
        $("#ballot-container").addClass("show")
        $("#ballot-button-container").removeClass("hidden")
        $("#ballot-button-container").addClass("show")
    }else {
        $("#ballot-id-container").addClass("alert-danger")
        $("#ballot-container").removeClass("show")
        $("#ballot-container").addClass("hidden")
        $("#ballot-button-container").removeClass("show")
        $("#ballot-button-container").addClass("hidden")

    }
    return found_ballot_id
}
// ===========================================================
// Functions tied to listeners
// ===========================================================
function on_change_ballot_dropdown(selected_value) {
    $("#imprinted_id").val(selected_value)
    update_json_preview()
}
function reverseObject(object) {
    var newObject = {};
    var keys = [];
    for (var key in object) {
        //console.log('key:', key)
        keys.push(key);
    }
    //for (var i = 0; i < keys.length; i++) {
    for (var i = keys.length - 1; i >= 0; i--) {
        //console.log("i:", i)
        //console.log("keys[i]:", keys[i])
        var value = object[keys[i]]
        //console.log('value:', value)
        //console.log('newObject BEFORE:', newObject)
        newObject[keys[i]]= value
        //console.log('newObject AFTER:', newObject)
    }
    return newObject;
}