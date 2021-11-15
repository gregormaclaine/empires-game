class ListenerCollection {
  constructor() {
    this.closers = new WeakMap();
  }

  apply(socket, event, listener) {
    socket.on(event, listener);
    const closer = () => socket.off(event, listener);

    if (this.closers.has(socket)) {
      const closers = [...this.closers.get(socket), closer]
      this.closers.set(socket, closers);
    } else {
      this.closers.set(socket, [closer]);
    }
  }
  
  remove_socket({ socket }) {
    if (!this.closers.has(socket)) return;
    const socket_closers = this.closers.get(socket);
    socket_closers.forEach(c => c());
    this.closers.delete(socket);
  }
}

module.exports = ListenerCollection;
