const socketService = {
    socket: null,
    callbacks: {},
  
    connect: function () {
      if (typeof window !== "undefined") {
        this.socket = io() // Assuming 'io' is globally available from socket.io cdn
        this.socket.on("connect", () => {
          if (this.callbacks["onConnect"]) {
            this.callbacks["onConnect"]()
          }
        })
  
        this.socket.on("disconnect", () => {
          if (this.callbacks["onDisconnect"]) {
            this.callbacks["onDisconnect"]()
          }
        })
      }
      return this.socket
    },
  
    disconnect: function () {
      if (this.socket) {
        this.socket.disconnect()
      }
    },
  
    emit: function (event, data) {
      if (this.socket) {
        this.socket.emit(event, data)
      }
    },
  
    on: function (event, callback) {
      if (this.socket) {
        this.socket.on(event, callback)
      }
    },
  
    off: function (event) {
      if (this.socket) {
        this.socket.off(event)
      }
    },
  
    setCallback: function (name, callback) {
      this.callbacks[name] = callback
      return this
    },
  }
  
  export default socketService
  