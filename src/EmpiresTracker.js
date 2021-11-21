class EmpiresTracker {
  constructor(parent) {
    this.parent = parent;
    this.sockets = this.parent.room.sockets;

    // A map for each socket to the socket's id that is their emperor
    // All default to null as everyone is their own emperor
    this.emperor_map = new WeakMap();
  }

  /**
   * Builds an object with all the information of the current empires
   * It includes a list of empires with both the emperor's socket id and a list of subjects
   * The subjects array includes socket ids and their characters
   * All players can view the characters since these are the players who have been guessed
   */
   get_empires_state() {
    const empires = [];
    for (const s of this.sockets) {

      const emperor = this.emperor_map.get(s);
      if (emperor) {

        let empire = empires.find(e => e.emperor === emperor);
        if (!empire) {
          empire = { emperor, subjects: [] };
          empires.push(empire);
        }
        empire.subjects.push({ id: s.id, character: this.parent.characters.get(s) });

      } else {

        const empire_made = -1 != empires.findIndex(e => e.emperor === s.id);
        if (!empire_made) {
          const empire = { emperor: s.id, subjects: [] };
          empires.push(empire);
        }

      }

    }
    return empires;
  }

  /**
   * Checks if the game has finished and if so returns the id of the winner
   * otherwise returns `false`
   */
  get_winner() {
    const supposed_winner = this.emperor_map.get(this.sockets[0]) || this.sockets[0].id;

    for (let i = 1, s = this.sockets[1]; i < this.sockets.length; s = this.sockets[++i]) {
      const emperor = this.emperor_map.get(s) || s.id;
      if (supposed_winner !== emperor) return false;
    }

    return supposed_winner;
  }

  /**
   * Handles whenever a turn ends with a correct guess
   * It includes one player joining the empire of another along with their entire previous empire.
   * @param guesser The id of the player who correctly determined the character
   * @param guessed the id of the player who will now join the other's empire
   */
  perform_takeover(guesser, guessed) {
    for (const s of this.sockets) {
      if (s.id === guessed || this.emperor_map.get(s) === guessed) {
        this.emperor_map.set(s, guesser);
      }
    }
  }
}

module.exports = EmpiresTracker;
