
class Socket {
    constructor(socket, details = {}){
        this.id = socket.id
        this.useragent = socket.request.headers['user-agent']
        this.userId = null
        this.deviceId = null
        this.update(details)
    }
    
    isMatch(id, param = null){
        return this[param ? param : 'id'] == id
    }

    isOnline(){
        return this.deviceId != null
    }

    update(details = {}){
        Object.assign(this, details)
    }
}

class Connect {

    constructor(){
        this.instance = null
        this.connections = []
    }

    get(id){
        return this.connections.find(o => o.isMatch(id))
    }

    getOnline(){
        return this.connections.filter(o => o.isOnline())
    }

    getOffline(){
        return this.connections.filter(o => !o.isOnline())
    }

    add(socket, details = {}){
        const connection = new Socket(socket, details)
        if(this.get(connection.id)) this.remove(connection.id)
        this.connections.push(connection)
        return this
    }

    remove(id){
        this.connections = this.connections.filter(o => o.id!= id)
        return this
    }
}

module.exports = () => new Connect

