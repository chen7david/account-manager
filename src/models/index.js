const routes = {}

require('fs').readdirSync(__dirname)
    .filter(o => o.includes('.js') && !o.includes('index'))
    .map(o => routes[o.replace('.js', '')] = require('./' + o))

module.exports = routes