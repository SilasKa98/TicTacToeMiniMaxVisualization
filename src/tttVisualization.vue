<template>
  <div style='width: 100%;'>
    <div class="heading">
      <h1>Tic-Tac-Toe - MiniMax visualization</h1>
    </div>
  <br><br><br>
  <div class="tttBoard">
    <div v-for="(n, a) in 3" :key="n.index">
      <div v-for="(n, b) in 3" :key="n.index">
        <play-cell @click="placeIntoCell(b, a),addToSumArray()"
              :value="board.cells[b][a]"
        />
      </div>
    </div>
    <div class="gameOverMessage" v-if="gameOver">
      {{ gameOverText }}
    </div>
  </div>
    <br><br><br><br><br>
  <div class='allWrapper' v-if=" !allMoves || allMoves.length <= 4 || board.checkPlayerWinningBoard('o')">
    <center v-if="board.checkAllMoves().length != 0">
      <div v-for="(arrays,index) in allArrays" :key="index.index" class="lineWrapper" >
        <span v-if="index %2 == 0" class="minOrMax">max<span class="noBorderGreen">(o)</span></span><span v-else class="minOrMax">min<span class="noBorderRed">(x)</span></span>
              <table v-for="(table,i) in arrays" :title="table" :id="index+'_'+i" :key="i.index" class="visualizeTable" :class="{ 'highlight' : table.toString() == board.cells.toString()}">
                <tr id='inheritBackground'><td class='noBorder'></td><td class='noBorder'></td><td :class = "(treeScores[index][i] > 10)?'noBorderGreen':'noBorderRed'">{{treeScores[index][i]}}</td></tr>
                <tr v-for="(row,j) in table" :key="j.index">
                      <td v-for="(cell,a) in row" :key="a.index">
                          <span v-if='cell == ""'></span>
                          <span v-else>
                          <span v-if='cell == "x"' class='redX'>{{cell}}</span>
                          <span v-else class="greenO">{{cell}}</span>
                          </span>
                      </td>
                  </tr>
              </table>
        
          </div> 
    </center>
  </div>
  <!-- drawing all possible moves of the current situation with its score >> see v-else -->
  <div id='firstRowMovesWrapper' v-else>
      <div v-for="(fItem,outerIndex) in sumClonedMoves" :key="outerIndex.index" class='allStepsWrapper'>
        <div v-for="(item,index) in fItem" :key="index.index" class='tableWrapper'>
          <span class="scoreDisp">Score: </span><span class="scoreDisp" :class = "(allScores[outerIndex][index] > 5)?'noBorderGreen':'noBorderRed'">{{allScores[outerIndex][index]}}</span><br>
          <table v-for="(arrayRow,i) in item" :key="i.index" class="visualizeTable" :class="{ 'highlight' : allScores[outerIndex][index] == currentScore && arrayRow[currentMove.x][currentMove.y] === 'o'}" >
            <tr v-for="(row,j) in arrayRow" :key="j.index">
              <td v-for="(specItem,a) in row" :key="a.index">
                <span v-if='specItem == ""'></span>
                <span v-else>
                  <span v-if='specItem == "x"' class='redX'>{{specItem}}</span>
                  <span v-else class="greenO">{{specItem}}</span>
                  </span>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Board from "./Board";
  import LeaderLine from 'leader-line-vue';
  export default {

    data() { return {
      gameOver: false,
      gameOverText: '',
      currentScore: undefined,
      currentMove: undefined,
      allMoves: undefined,
      clonedBoards: undefined,
      scoresFetcher: undefined,
      sumClonedMoves: [],
      treeScores: undefined,
      allLines: [],
      allScores: [],
      allArrays:[],
      emptyFour: [],
      emptyTree: [],
      emptyTwo: [],
      emptyOne: [],
      emptyZero: [],
      emptyTreeScore: [],
      emptyTwoScore: [],
      emptyOneScore:[],
      emptyZeroScore: [],
      board: new Board(),
    } },

    methods: {
      placeIntoCell(x, y) {
        if (this.gameOver) {
          return;
        }

        if (! this.board.execMove(x, y, 'x')) {
          //check if the move is Invalid.
          return;
        }

        this.$forceUpdate();

        if (this.board.checkGameOver()) {
          this.gameOver = true;
          this.gameOverText = this.board.checkPlayerWinningBoard('x') ? 'Well done you won the Game !' : 'Its a Draw';
          return;
        }

        let aiMove = this.minimaxAlgorithm(this.board.boardClone(), 'o');
        this.board.execMove(aiMove.move.x, aiMove.move.y, 'o');

        if (this.board.checkGameOver()) {
          this.gameOver = true;
          this.gameOverText = this.board.checkPlayerWinningBoard('o') ? 'Sorry you lost the Game!' : 'Its a Draw';
        }

        this.$forceUpdate();
      },

      minimaxAlgorithm(board, player, depth = 1) {

        // check if the board has 3 in a row , if so then return the score of the board.
        if (board.checkGameOver()) {
          return {
            score: board.checkScore() + depth,
            move: null
          }
        }

        // The 'o' (algorithm) is trying to maximize its score, the 'x' (human) player is trying to minimize its score.
        let bestScore = player === 'o' ? -10000 : 10000;
        let bestMove = null;

        let moves = board.checkAllMoves();
        let allClonedMoves = [];
        let allFieldScores = [];
        for (let i = 0; i < moves.length; i++) {
          let move = moves[i];
          let newBoard = board.boardClone();
          newBoard.execMove(move.x, move.y, player);
          allClonedMoves.push(newBoard);
          this.sortBoards(newBoard)
          // Recursively call the function "minimaxAlgorithm" for the new board to get new scores and the next board again.
          const score = this.minimaxAlgorithm(newBoard, player === 'x' ? 'o' : 'x', depth + 1).score;
          allFieldScores.push(score)
          // If the current score is better than the last best score, go update
          if ((player === 'o' && score > bestScore) || (player === 'x' && score < bestScore)) {
            bestScore = score;
            bestMove = move;
          }

          //here all scores for the Tree are safed to display it later
          this.$forceUpdate();
          if(this.emptyFour.length <= 0){
            let leerCounter = 0;
            for(let i=0; i<newBoard.cells.length;i++){
              for(let x=0; x<newBoard.cells[i].length;x++){
                if(newBoard.cells[i][x] == ""){
                  leerCounter++;
                }
              }
              if(i == newBoard.cells.length-1){
                if(leerCounter == 3){
                  this.emptyTreeScore.push(score);
                }
                else if(leerCounter == 2){
                  this.emptyTwoScore.push(score);
                }
                else if(leerCounter == 1){
                  this.emptyOneScore.push(score);
                }
                else{
                  this.emptyZeroScore.push(score);
                }
                leerCounter = 0;
              }
            }
          }
        }
        this.treeScores = [this.emptyTreeScore,this.emptyTwoScore,this.emptyOneScore,this.emptyZeroScore];
        this.treeScores = this.treeScores.filter(function(el){
          return el.length > 0;
        });
        this.clonedBoards = allClonedMoves;
        this.scoresFetcher = allFieldScores;
        this.currentScore = bestScore;
        this.currentMove = bestMove;
        this.allMoves = this.board.checkAllMoves();

        this.$forceUpdate();
        // at the end return the best score and the best move
        return {
          score: bestScore,
          move: bestMove
        }
      },

      addToSumArray(){
        //empty the arrays for the next step
        this.emptyFour= [];
        this.emptyTree= [];
        this.emptyTwo= [];
        this.emptyOne= [];
        this.emptyZero= [];
        this.sumClonedMoves.push(this.clonedBoards);
        this.allScores.push(this.scoresFetcher);     

        this.$nextTick(() => { 
          this.emptyScores();
          this.removeLines();
        })

        this.$nextTick(() => { 
          this.drawLines();
        })

      },
      removeLines(){
        //remove old tree Lines for next step

        for(let i=0;this.allLines.length;i++){
          if(this.allLines[i] != undefined){
            this.allLines[i].remove();
          }else{
            break;
          }
        }  
      },
      emptyScores(){
          this.treeScores = undefined;
          this.emptyTreeScore = [];
          this.emptyTwoScore = [];
          this.emptyOneScore = [];
          this.emptyZeroScore = [];
      },
      sortBoards(b){
        //in this function all boards get sorted by its empty fields to visualize them later way easier
        let leerCounter = 0;
        for(let i=0; i<b.cells.length;i++){
          for(let x=0; x<b.cells[i].length;x++){
            if(b.cells[i][x] == ""){
              leerCounter++;
            }
          }
          if(i == b.cells.length-1){
              if(leerCounter == 4){
                this.emptyFour.push(b.cells);
              }
              else if(leerCounter == 3){
                this.emptyTree.push(b.cells);
              }
              else if(leerCounter == 2){
                this.emptyTwo.push(b.cells);
              }
              else if(leerCounter == 1){
                this.emptyOne.push(b.cells);
              }
              else{
               this.emptyZero.push(b.cells);
              }
              leerCounter = 0;
          }
        }

            this.allArrays = []
            if(this.emptyFour.length > 0){
                this.allArrays.push(this.emptyFour);
            }
            if(this.emptyTree.length > 0){
                this.allArrays.push(this.emptyTree);
            }
            if(this.emptyTwo.length > 0){
                this.allArrays.push(this.emptyTwo);
            }
            if(this.emptyOne.length > 0){
                this.allArrays.push(this.emptyOne);
            }
            if(this.emptyZero.length > 0){
                this.allArrays.push(this.emptyZero);
            }
          
            this.$forceUpdate();
      },

      drawLines(){
        //this function draws the lines of the tree, its drawing is splitted in the four lines that can maximal happen in this version
        let allTables = document.querySelectorAll(".visualizeTable");
        let firstLevel = [];
        let secondLevel = [];
        let thirdLevel = [];
        let fourthLevel = [];
        let fifthLevel = [];
        this.allLines = [];

        for(let i=0;i<allTables.length;i++){
          let splittedId = allTables[i].id.split("_");
          if(splittedId[0] == "0"){
            firstLevel.push(allTables[i]);
          }else if(splittedId[0] == "1"){
            secondLevel.push(allTables[i]);
          }else if(splittedId[0] == "2"){
            thirdLevel.push(allTables[i]);
          }else if(splittedId[0] == "3"){
            fourthLevel.push(allTables[i]);
          }else{
            fifthLevel.push(allTables[i]);
          }
        }

        //first to second line
        for(let i=0;i<firstLevel.length;i++){
          let valF = firstLevel[i].title;
          for(let a=0;a<secondLevel.length;a++){
            let valS = secondLevel[a].title;
            let similarity = this.similar(valF,valS);
            if(similarity == 1){
             let line1 = LeaderLine.setLine(
                firstLevel[i],
                secondLevel[a],
                { path: 'fluid', color: 'white', size: 3, startSocket: 'bottom', endSocket: 'top', endPlugSize: 0.8, dropShadow: true }
              );
              this.allLines.push(line1);
            }
          }
        }

        //second to third line
        let counterSec = 0;
        let counterThird = 0;
        for(let i=0;i<thirdLevel.length;i++){
          let simTest = this.similar(secondLevel[counterSec].title, thirdLevel[counterThird].title);
          if(simTest != 1){
              counterSec++;
          }
          let line2 = LeaderLine.setLine(
            secondLevel[counterSec],
            thirdLevel[counterThird],
            { path: 'fluid', color: 'white', size: 3, startSocket: 'bottom', endSocket: 'top',  endPlugSize: 0.8, dropShadow: true }
          );
          this.allLines.push(line2);
          if(i % 2 != 0){
            counterSec += 1;
          }
          counterThird += 1;
        }

        //third to fourth
        let counterThird2 = 0;
        let counterFourth = 0;
        for(let i=0;i<thirdLevel.length;i++){
          let simTest2 = this.similar(thirdLevel[counterThird2].title, fourthLevel[counterFourth].title);
          if(simTest2 == 1){
            let line3 = LeaderLine.setLine(
              thirdLevel[counterThird2],
              fourthLevel[counterFourth],
              { path: 'fluid', color: 'white', size: 3, startSocket: 'bottom', endSocket: 'top',  endPlugSize: 0.8, dropShadow: true}
            );
            this.allLines.push(line3);
            counterThird2++;
            counterFourth++;
          }else{
            counterThird2++;
          }
        }     
      },
      similar(a,b) {
        //function is needed to compare two fields of their similarity to decide wether they get connected or not (differing in more then 1 field == skip)
        let diffCounter = 0;
        diffCounter =0;
        let first = a.split(",");
        let second = b.split(",");
        for(let i=0;i<first.length;i++){
          if(first[i] != second[i]){
            diffCounter++
          }
        }
        return diffCounter;
      }
    }
  }
</script>
<style>

  #inheritBackground{
    background-color: #6c6c6c;
  }

  .noBorder{
    border: none;
  }
  .noBorderGreen{
    border: none;
    color: rgb(27 255 0);
    text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
  }
  .noBorderRed{
    border: none;
    color: rgb(255 0 0);
    text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
  }
  .tttBoard {
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;

    width: 204px;
    height: 204px;
  }

  .tictactoeStepDisp{
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;

    width: 204px;
    height: 204px;
    position: absolute;
    top: 10px;
    right: 10px;
  }

  .minOrMax{
    float: left;
    margin-right: 43px;
    font-size: 14pt;
  }

  .visualizeTable{
    float:left;
    margin-right: 35px;
  }
  .highlight{
    background-color: green;
  }
  .gameOverMessage {
    font-weight: bold;
    color: black;
    width: 204px;
    font-size: 22px;
    text-align: center;
    padding-top: 12px;
  }

.lineWrapper{
    overflow: auto;
    margin-bottom: 150px;
    width: fit-content;
 }

  .heading {
    text-align: center;
    width: 100%;
    color: Black;
  }

  .allStepsWrapper{

    overflow: auto;
    margin: 20px auto;
    opacity: 1;
    animation-name: fadeInOpacity;
    animation-iteration-count: 1;
    animation-timing-function: ease-in;
    animation-duration: 1s;
  }

  .leader-line{
    opacity: 1;
    animation-name: fadeInOpacity;
    animation-iteration-count: 1;
    animation-timing-function: ease-in;
    animation-duration: 1s;
  }

  @keyframes fadeInOpacity {
	0% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}

  table td{
    width: 15px;
    height: 15px;
    border: 2px solid black;
    text-align: center;
    font-weight: bolder;
    font-size: 8pt;
  }

  .rightAlign{
    float:left;
  }

  #firstRowMovesWrapper{
    margin-left: 27%;
  }
  
  .allWrapper{
    opacity: 1;
    animation-name: fadeInOpacity;
    animation-iteration-count: 1;
    animation-timing-function: ease-in;
    animation-duration: 1s;
  }

  .tableWrapper{
    margin-right: 16px;
    float: left;
  }

  table {
    border-collapse: collapse;
  }
  .redX{
    color: rgb(255 0 0);
  }
  .greenO{
    color: rgb(27 255 0);
  }

  #allMovesWrapper{
    width: 1650px;
  }

  .scoreDisp{
    font-weight: bolder;
    font-size: 8pt;
  }

  #positivScore{
    color: #2f5e2f;
    font-size: 16pt;
  }

  #negativeScore{
    color: #a51a1a;
     font-size: 16pt;
  }
</style>
