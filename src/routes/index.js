const { readdirSync } = require('fs')
const routes = {}

readdirSync(__dirname)
    .filter(f => f.includes('.js') && !f.includes('index'))
    .map(f => routes[f.replace('.js', '')] = require('./' + f))

module.exports = routes