const app = new (require('koa'))
const router = require('./router')
const { http, ws } = require('config').server
const server = require('http').createServer(app.callback())
const io = require('socket.io')(server, {cors: ws.cors})
const bodyparser = require('koa-bodyparser')
const cors = require('kcors')
require('./middleware/sockets')(app, io)


/* MIDDLEWARE */
app.use(cors())
app.use(bodyparser())

/* ROUTER */
Object.keys(router)
    .map(key => app.use(router[key].routes()))

/* SERVER */
server.listen(process.env.port || http.port, () => {
    const url = require('url').format(http)
    console.log('server running at:', url)
})