export default class Board {
  constructor() {
    this.cells = [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ];
  }

  checkGameOver() {
    return this.checkAllMoves().length === 0 || this.checkPlayerWinningBoard('x') || this.checkPlayerWinningBoard('o');
  }

  boardClone() {
    let clone = new Board();

    for (let i=0; i<3; i++) {
      for (let j=0; j<3; j++) {
        clone.cells[i][j] = this.cells[i][j];
      }
    }

    return clone;
  }

  checkAllMoves() {
    let moves = [];
    for (let i=0; i<3; i++) {
      for (let j=0; j<3; j++) {
        if (this.cells[i][j] === '') {
          moves.push({x: i, y: j});
        }
      }
    }
    return moves;
  }

  execMove(x, y, player) {
    if (this.cells[x][y] !== '') {
      return false;
    }

    this.cells[x][y] = player;
    return true;
  }

  checkScore() {
    let score = 0;
    if (this.checkPlayerWinningBoard('x')) {
      score = score - 100;
    }
    if (this.checkPlayerWinningBoard('o')) {
      score = score + 100;
    }
    return score;
  }

  checkPlayerWinningBoard(player) {
    // check the horizontal rows
    for (let i=0; i<3; i++) {
      if (this.cells[0][i] === player && this.cells[1][i] === player && this.cells[2][i] === player) {
        return true;
      }
    }

    // check the vertical rows
    for (let i=0; i<3; i++) {
      if (this.cells[i][0] === player && this.cells[i][1] === player && this.cells[i][2] === player) {
        return true;
      }
    }

    // check the diagonals
    if (this.cells[0][0] === player && this.cells[1][1] === player && this.cells[2][2] === player) {
      return true;
    }
    if (this.cells[2][0] === player && this.cells[1][1] === player && this.cells[0][2] === player) {
      return true;
    }

    return false;
  }
}
