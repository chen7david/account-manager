const connections = require('./connect')()

module.exports = (app, io) => {
    

    io.on('connect', (socket) => {

        connections.add(socket)

        socket.on('get:client:info', (socketId) => {
            const connection = connections.get(socketId)
            socket.emit('set:client:info', connection)
        })

        socket.on('came:online', ({userId, deviceId}) => {
            connections.update(socket.id, {userId, deviceId})
            io.emit('is:online', deviceId)
        })

        socket.on('went:offline', (deviceId) => {
            connections.update(socket.id, {userId: null, deviceId: null})
            io.emit('is:offline', deviceId)
        })

        socket.on('check:status', (deviceId) => {
            connections.isOnline(deviceId) ?
            io.emit('is:online', deviceId) :
            io.emit('is:offline', deviceId)
        })

        socket.on('disconnect', () => {
            if(connection.deviceId) 
                io.emit('is:offline', connection.deviceId)
            connections.remove(socket.id)
        })
    })


}