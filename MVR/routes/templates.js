// replace Template
// replace templates
// replace template
var express = require('express')
var router = express.Router()
var querystring = require("querystring")
var models = require('../models')

// List All
router.get('/', function (req, res) {

    var message = req.query.message
    models.Template.findAll({
        order: [
            ['TemplateName', 'ASC']
        ]
    }).then(templates => {
        console.log("templates.length:", templates.length)

        res.render('template-list', {
            message: message,
            templates: templates,
            template_count: templates.length
        })
    })
})

// Add Prompt
router.get('/add/', function (req, res) {
    res.render('template-add')
})

// Add Submit
router.post('/add/', function (req, res) {
    var template_name = req.body.template_name

    models.Template.create(
        {
            TemplateName: template_name
        }
    ).then(result => {
        console.log("record updated!!!")
        console.log("result:", result)

        var message = querystring.escape("Added template " + template_name)
        console.log("message:", message)
        // Redirect to list page
        res.redirect(303, '/templates/?message=' + message)

    }).catch(err => {
        console.log("error adding!!!")
        console.log("err:", err)

        // Redirect to error page
        res.redirect(303, '/error/?err=' + err)
    })
})

// Edit Prompt
router.get('/edit/:template_id', function (req, res) {
    var template_id = req.params.template_id
    models.Template.findAll({
        where: {
            TemplateID: template_id
        }
    }).then(templates => {
        template = templates[0]
        res.render('template-edit', {
            template: template,
            template_id: template_id
        })
    })
})

// Edit Submit
router.post('/edit/:template_id', function (req, res) {
    var template_id = req.params.template_id
    var template_name = req.body.template_name
    var orig_template_name = req.body.orig_template_name

    models.Template.update(
        {
            TemplateName: template_name
        },
        {
            where: { TemplateID: template_id }
        }
    ).then(result => {
        var message = querystring.escape("Updated template from '" + orig_template_name + "' to '" + template_name + "'")
        console.log("message:", message)

        // Redirect to list page
        res.redirect(303, '/templates/?message=' + message)

    }).catch(err => {
        console.log("error updating!!!")
        console.log("err:", err)

        // Redirect to error page
        res.redirect(303, '/error/?err=' + err)
    })
})

// Delete Prompt
router.get('/delete/:template_id', function (req, res) {
    var template_id = req.params.template_id
    models.Template.findAll({
        where: {
            TemplateID: template_id
        }
    }).then(templates => {
        template = templates[0]
        res.render('template-delete', {
            template: template,
            template_id: template_id
        })
    })
})

// Delete Submit
router.post('/delete/:template_id', function (req, res) {
    var template_id = req.params.template_id
    var template_name = req.body.template_name

    models.Template.destroy(
        {
            where: { TemplateID: template_id }
        }
    ).then(result => {
        var message = querystring.escape("Deleted template " + template_name)
        console.log("message:", message)

        // Redirect to list page
        res.redirect(303, '/templates/?message=' + message)

    }).catch(err => {
        console.log("error updating!!!")
        console.log("err:", err)

        // Redirect to error page
        res.redirect(303, '/error/?err=' + err)
    })
})

module.exports = router
