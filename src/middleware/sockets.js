const connections = require('./connect')()

module.exports = (app, io) => {
    const emit = {
        isOnline: (deviceId) => io.emit('is:online', deviceId),
        isOffline: (deviceId) => io.emit('is:offline', deviceId)
    }

    io.on('connect', (socket) => {

        connections.add(socket)

        socket.on('get:client:info', (socketId) => {
            const connection = connections.get(socketId)
            socket.emit('set:client:info', connection)
        })

        socket.on('came:online', ({userId, deviceId}) => {
            connections.update(socket.id, {userId, deviceId})
            emit.isOnline(deviceId)
        })

        socket.on('went:offline', (deviceId) => {
            connections.update(socket.id, {userId: null, deviceId: null})
            emit.isOffline(deviceId)
        })

        socket.on('check:status', (deviceId) => {
            connections.isOnline(deviceId) ? emit.isOnline(deviceId) : emit.isOffline(deviceId)
        })

        socket.on('disconnect', () => {
            if(connection.deviceId) 
                emit.isOffline(connection.deviceId)
            connections.remove(socket.id)
        })
    })


}