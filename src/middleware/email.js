const _template = require('lodash.template')
const p = require('path')
const fs = require('fs')
const url = require('url')
const { routes, http } = require('config').client
const dirpath = p.resolve(__dirname, './../templates')
const nodemailer = require('nodemailer')

class Mailer {

    constructor(options = {}){
        this.transporter = nodemailer.createTransport(options)
    }

    from(email){
        this._from = email
        return this
    }

    to(email){
        this._to = email
        return this
    }

    toAll(emails = []){
        this._to = emails
        return this
    }

    subject(text){
        this._subject = text
        return this
    }

    body(html){
        this._body = html
        return this
    }

    async send(){
        await this.transporter.sendMail({
            from: this._from,
            to: this._to,
            subject: this._subject,
            html: this._body,
        })
    }
}


function template(name, data = {}){
    const defaults = Object.assign({
        host: url.format(http)
        // add more defaults here ...
    }, routes, data)
    const path = p.resolve(dirpath, name)
    const file = fs.readFileSync(path,'utf8')
    return _template(file)(defaults)
}

module.exports = {
    template, Mailer, mailer: new Mailer(require('config').email)
}