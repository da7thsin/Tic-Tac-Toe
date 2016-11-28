var board = new Board('box');
var finished = false;
var win = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function Game(P1, P2){
  var self = this;

  function run(){
    self.update(P1, P2);
  }

  setInterval(run, 300);
}

Game.prototype = {
  update: function(P1, P2){
    if(!finished){
      this.swapTurn(P1,P2);
    }
    else{
      this.restart();
    }
  },

  swapTurn: function(P1, P2){
    if(P1.turn){
      P1.assign(P2);
    } else if(P2.turn){
      P2.assign(P1);
    }
  },

  restart: function(){
    board.clear();
    finished = false;
  }
}

function Board(el){
  this.boxes = document.getElementsByClassName(el);

  this.moves = {
    X: [],
    O: []
  };

  this.playerTileMoves = function(symbol){
    for(var i = 0; i < this.boxes.length; i++){
      var boxVal = $(this.boxes[i]).text();

      if(boxVal == symbol && this.moves[symbol].indexOf(i) == -1){
        this.moves[symbol].push(i);
      }

    }

    return this.moves[symbol];
  };

  this.getEmptyTileLocations = function(){
    var empty_tiles = [];

    for(var i = 0; i < this.boxes.length; i++){
      var box = $(this.boxes[i]);

      if(!box.text()){
        empty_tiles.push(i);
      }

    }

    return empty_tiles;
  };

  this.checkWinner = function(player){
    var full = !this.getEmptyTileLocations().length;

    for(var i = 0; i < win.length; i++){
      var a = $(this.boxes[win[i][0]]).text();
      var b = $(this.boxes[win[i][1]]).text();
      var c = $(this.boxes[win[i][2]]).text();

      if(full || (a == player.sign && b == player.sign && c == player.sign)){
        return true;
      }
    }

    return false;
  };

  this.clear = function(){
    for(var i = 0; i < this.boxes.length; i++){
      $(this.boxes[i]).text('');
    }

    this.moves.X = [];
    this.moves.O = [];
  };

  this.isEmpty =  function(){
      var tiles = [];

      for(var i = 0; i < board.boxes.length; i++){
        var box = $(board.boxes[i]).text();

        if(box == ''){
          tiles.push(i);
        }
      }

      return tiles.length === board.boxes.length ? true : false;
  };

}

function Player(sign){
  this.sign = sign;
  this.turn = false;
  this.score = 0;

  this.assign = function(P2){
    var self = this;

    $('.box').click(function(){

      if(!$(this).text() && self.turn){
        $(this).text(self.sign);
        finished = board.checkWinner(self);

        if(!finished){
          self.turn = false;
          P2.turn = true;
        }

      }
    });

    return;
  }
}

function Robot(sign){
  this.sign = sign == 'X' ? 'O' : 'X';
  this.turn = true;
  this.score = 0;

  this.assign = function(P2){

    if(board.isEmpty()){
      this.firstMove = true;
      this.markTile(4, P2);
      //this.firstMoveSetup(P2);
    }
    else{
      this.calculateMove(P2);
    }

  }

}

Robot.prototype = {
  firstMove: false,

  calculateMove: function(P2){

    var enemyMoves = board.playerTileMoves(P2.sign);
    var myMoves = board.playerTileMoves(this.sign);
    var tileMoves = [myMoves, enemyMoves];

    this.checkWinningTile(tileMoves, P2);

    if(this.firstMove){
      this.winAndBlock(myMoves, enemyMoves, P2);
    }
    else{
      this.blockAndWin(myMoves, enemyMoves, P2);
    }

  },

  winAndBlock: function(myMoves, enemyMoves, P2){
    var random = Math.round(Math.random());

    var three = random ? 3 : -3;
    var one = random ? 1 : -1;

    var lastTile = board.getEmptyTileLocations();

    var enemyLastMove = enemyMoves[enemyMoves.length - 1];
    var enemyFirstMove = enemyMoves[0];

    var myLastMove = myMoves[myMoves.length -1];
    var myFirstMove = myMoves[0];

    var odds = [0,2,6,8];
    var evens = [1,3,5,7];
    var center = 4;

    if(myFirstMove == center && !finished){

      if(evens.indexOf(enemyFirstMove) != -1){

        if(enemyLastMove == 1 || enemyLastMove == 7){
          this.markTile(enemyLastMove + one, P2);
        }
        else if(enemyLastMove == 3 || enemyLastMove == 5){
          this.markTile(enemyLastMove + three, P2);
        }
        else if(enemyFirstMove == 1 && (enemyLastMove == 6 || enemyLastMove == 8)){
          this.markTile(myLastMove + 3, P2);
        }
        else if(enemyFirstMove == 7 && (enemyLastMove == 0 || enemyLastMove == 2)){
          this.markTile(myLastMove - 3, P2);
        }
        else if(enemyFirstMove == 3 && (enemyLastMove == 2 || enemyLastMove == 8)){
          this.markTile(myLastMove + 1, P2);
        }
        else if(enemyFirstMove == 5 && (enemyLastMove == 0 || enemyLastMove == 6)){
          this.markTile(myLastMove - 1, P2);
        }

      }
      else if(odds.indexOf(enemyFirstMove) != -1){

        if(enemyLastMove == 0 || enemyLastMove == 6){
          this.markTile(myLastMove + 1, P2);
        }
        else if(enemyLastMove == 2 || enemyLastMove == 8){
          this.markTile(myLastMove - 1, P2);
        }
        else if(lastTile.length == 1){
          this.markTile(lastTile[0], P2);
        }

      }

    }
    else if(odds.indexOf(myFirstMove) != -1 && !finished){

    }

  },

  blockAndWin: function(myMoves, enemyMoves, P2){

  },

  markTile: function(index, P2){
    var tile = $(board.boxes[index]);

    if(!tile.text()){
      tile.text(this.sign);
      finished = board.checkWinner(this);

      if(!finished){
        this.turn = false;
        P2.turn = true;
        return;
      }
    }
  },

  firstMoveSetup: function(P2){
    var choices = [0,4,8,2,4,6];
    var index = choices[Math.floor(Math.random() * choices.length)];
    this.firstMove = true;
    this.markTile(index, P2);
  },

  checkWinningTile: function(tileMoves, P2){
    for(var i = 0; i < tileMoves.length; i++){
      var won = this.putThirdTile(tileMoves[i], P2);
      if(won){ break; }
    };
  },

  putThirdTile: function(tiles, P2){
    for(var i = 0; i < win.length; i++){
      var box = board.boxes;

      var a = tiles.indexOf(win[i][0]);
      var b = tiles.indexOf(win[i][1]);
      var c = tiles.indexOf(win[i][2]);

      var boxValA = $(box[win[i][0]]).text();
      var boxValB = $(box[win[i][1]]).text();
      var boxValC = $(box[win[i][2]]).text();

      if(a != -1 && b != -1 && !boxValC){
        this.markTile(win[i][2], P2);
        return true;
      }else if(!boxValA && b != -1 && c != -1){
        this.markTile(win[i][0], P2);
        return true;
      }else if(a != -1 && !boxValB && c != -1){
        this.markTile(win[i][1], P2);
        return true;
      }

    }

    return false;
  }
}


function set(P1, P2){
  if(Math.random() < 0.5){
    P2.turn = false;
    P1.turn = true;
  }
  else{
    P2.turn = true;
    P1.turn = false;
  }
}

$('button').click(function(){
  $('.menu').toggleClass('active');
  $('.board').toggleClass('active');
  var P1 = new Player($(this).text());
  var P2 = new Robot(P1.sign);
  //set(P1, P2);
  new Game(P1, P2);
});
