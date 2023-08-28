function discard_all_ballots() {
    let message_body = document.createElement('div')
    $(message_body).addClass('alert alert-danger')
    let message_details = document.createElement('div')
    $('<h2>').text('Are you sure you want to discard all ballots?').appendTo(message_details)
    $('<div>')
        .appendTo(message_details)
    $(message_details).appendTo(message_body)
    bootbox.confirm({
        size: 'large',
        message: message_body,
        buttons: {
            confirm: {
                label: ' Discard all ballots',
                className: 'btn btn-danger fa fa-trash'
            },
            cancel: {
                label: 'Cancel'
            }
        },
        callback: function (result) {
            if (result) {
                $("#discard-all-ballots").submit()
            } else {
                //alert('go back')
            }
        }
    })
}

function generate_random_ballots() {
    $("#generate-random-ballots").submit()
}

function rla_info() {
    let message_body = document.createElement('div')
    let d1 = document.createElement('div')
    $(d1).appendTo(message_body)
    $('<img />').attr({
        'src': '/img/Ballot_box_icon_color.png',
        'width': 200
    }).appendTo(d1)

    let d2 = document.createElement('h2')
    var link = $("<a>")
    link.attr("href", "https://en.wikipedia.org/wiki/Risk-limiting_audit")
    link.attr("title", "Wikipedia")
    link.text("Learn more about risk-limiting audits at Wikipedia.com")
    $(d2).html(link)
    $(d2).appendTo(message_body)

    bootbox.alert({
        size: 'large',
        message: message_body
    })
}
