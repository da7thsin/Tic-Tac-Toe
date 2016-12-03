var board = new Board('box');
var finished = false;
var win = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

var game, P1, P2;



//GAME CONSTRUCTOR
function Game(P1, P2, time_cycle){
  var self = this;

  this.start = function(){
    clearTimeout(self.timeoutID);
    $('.back').removeClass('inactive');
    $('.board').toggleClass('active');

    self.intervalID = setInterval(function(){
      self.update(P1, P2);
    }, time_cycle);
  };

  this.stop = function(){
    clearInterval(self.intervalID);
    clearInterval(self.timeoutID);
    board.clear();

    $('.board').removeClass('active');
    $('.box').removeClass('invert-color');
    $('.container').removeClass('move-active');
    $('.back').addClass('inactive');

    this.timeoutID = setTimeout(function(){
      $('.menu').toggleClass('inactive');
    }, 1000);

    P1.sign = '';
    P1.turn = false;

    P2.sign = '';
    P2.turn = false;
  }
}

Game.prototype = {
  intervalID: 0,
  timeoutID: 0,

  update: function(P1, P2){
    if(!finished){
      this.swapTurn(P1,P2);
    }
    else{
      this.restart(P1, P2);
    }
  },

  swapTurn: function(P1, P2){
    if(P1.turn){
      P1.assign(P2);
    } else if(P2.turn){
      P2.assign(P1);
    }
  },

  restart: function(P1, P2){
    var self = this;

    if(P1.firstMove){
      P1.firstMove = false;
    }else if(P2.firstMove){
      P2.firstMove = false;
    }

    clearInterval(this.intervalID);
    $('.board').toggleClass('active');

    this.timeoutID = setTimeout(function(){
      board.clear();
      $('.box').removeClass('invert-color');
      helper.setRandomTurn(P1, P2);
      self.start();
    }, 1200);
  }
}




//BOARD CONSTRUCTOR
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

  this.checkBoard = function(player){
    var boardIsFull = !this.getEmptyTileLocations().length;

    if(!boardIsFull){
      for(var i = 0; i < win.length; i++){
        var a = $(this.boxes[win[i][0]]);
        var b = $(this.boxes[win[i][1]]);
        var c = $(this.boxes[win[i][2]]);

        if((a.text() == player.sign && b.text() == player.sign && c.text() == player.sign)){
          a.addClass('invert-color');
          b.addClass('invert-color');
          c.addClass('invert-color');
          return true;
        }
      }
    }
    else{
      $('.box').addClass('invert-color');
      return true;
    }

    return false;
  };

  this.clear = function(){
    for(var i = 0; i < this.boxes.length; i++){
      $(this.boxes[i]).text('');
    }

    this.moves.X = [];
    this.moves.O = [];
    finished = false;
  };

}




//PLAYER CONSTRUCTOR
function Player(sign){
  this.sign = sign;
  this.turn = false;

  this.assign = function(P2){
    var self = this;
    $('.box').click(function(){
      if(!$(this).text() && self.turn){
        $(this).text(self.sign);
        finished = board.checkBoard(self);

        if(!finished){
          self.turn = false;
          P2.turn = true;
        }

      }
    });

    return;
  }
}




//ROBOT CONSTRUCTOR
function Robot(sign){
  this.sign = sign == 'X' ? 'O' : 'X';
  this.turn = false;

  this.assign = function(P2){
    var boardIsEmpty = board.getEmptyTileLocations().length === board.boxes.length;

    if(boardIsEmpty){
      this.firstMoveSetup(P2);
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

    if(this.turn && !finished){
      if(this.firstMove){
        this.winAndBlock(myMoves, enemyMoves, P2);
      }
      else{
        this.blockAndWin(myMoves, enemyMoves, P2);
      }
    }

  },

  winAndBlock: function(myMoves, enemyMoves, P2){
    var random = Math.round(Math.random());

    var downOrRight = random ? 3 : 1;
    var downOrLeft = random ? 3 : -1;

    var upOrRight = random ? -3 : 1;
    var upOrLeft = random ? -3 : -1;

    var emptyTiles = board.getEmptyTileLocations();

    var enemyLastMove = enemyMoves[enemyMoves.length - 1];
    var enemyFirstMove = enemyMoves[0];

    var myLastMove = myMoves[myMoves.length -1];
    var myFirstMove = myMoves[0];

    var odds = [0,2,6,8];
    var evens = [1,3,5,7];
    var center = 4;

    if(myFirstMove == center){

      if(evens.indexOf(enemyFirstMove) != -1){
        if(enemyLastMove == 1 || enemyLastMove == 7){
          this.markTile(enemyLastMove + helper.plusOrMinus(1), P2);
        }
        else if(enemyLastMove == 3 || enemyLastMove == 5){
          this.markTile(enemyLastMove + helper.plusOrMinus(3), P2);
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
        else if(emptyTiles.length == 1){
          this.markTile(emptyTiles[0], P2);
        }
      }

    }
    else if(odds.indexOf(myFirstMove) != -1){

      if(evens.indexOf(enemyFirstMove) != -1){
        if(enemyFirstMove == 1 && (enemyLastMove == 6 || enemyLastMove == 8)){
          this.markTile(myFirstMove + 3, P2);
        }
        else if(enemyFirstMove == 7 && (enemyLastMove == 0 || enemyLastMove == 2)){
          this.markTile(myFirstMove - 3, P2);
        }
        else if(enemyFirstMove == 3 && (enemyLastMove == 2 || enemyLastMove == 8)){
          this.markTile(myFirstMove + 1, P2);
        }
        else if(enemyFirstMove == 5 && (enemyLastMove == 0 || enemyLastMove == 6)){
          this.markTile(myFirstMove - 1, P2);
        }
        else{
          this.markTile(center, P2);
        }
      }
      else if(odds.indexOf(enemyFirstMove) != -1){
        if(emptyTiles.length < 7){
          this.markTile(helper.randomArrVal(emptyTiles), P2);
        }
        else{
          this.markTile(center, P2);
        }
      }
      else if(enemyFirstMove == center){
        if(myLastMove == 0){
          this.markTile(myLastMove + downOrRight, P2);
        }
          else if(myLastMove == 2){
          this.markTile(myLastMove + downOrLeft,P2);
        }
          else if(myLastMove == 6){
          this.markTile(myLastMove + upOrRight, P2);
        }
          else if(myLastMove == 8){
          this.markTile(myLastMove + upOrLeft, P2);
        }
        else{
          this.markTile(emptyTiles[0], P2);
        }
      }

    }

  },

  blockAndWin: function(myMoves, enemyMoves, P2){
    var random = Math.round(Math.random());

    var emptyTiles = board.getEmptyTileLocations();

    var enemyLastMove = enemyMoves[enemyMoves.length - 1];
    var enemyFirstMove = enemyMoves[0];

    var myLastMove = myMoves[myMoves.length -1];
    var myFirstMove = myMoves[0];

    var odds = [0,2,6,8];
    var evens = [1,3,5,7];
    var center = 4;

    if(enemyFirstMove == center){
      if(emptyTiles.length > 4){
        this.markTile(helper.randomArrVal(odds), P2);
      }
      else{
        this.markTile(helper.randomArrVal(emptyTiles), P2);
      }
    }
    else{
      if(myFirstMove == undefined){
        this.markTile(center, P2);
      }
      else if(emptyTiles.length > 4){

        if(evens.indexOf(enemyFirstMove) > -1 && evens.indexOf(enemyLastMove) > -1){
          if(enemyLastMove == 1 || enemyLastMove == 7){
            this.markTile(enemyLastMove + helper.plusOrMinus(1), P2);
          }
          else{
            this.markTile(enemyLastMove + helper.plusOrMinus(3), P2);
          }
        }
        else if(enemyLastMove == 1 || enemyLastMove == 7){
          this.markTile(myFirstMove + helper.plusOrMinus(1), P2);
        }
        else if(enemyLastMove == 3 || enemyLastMove == 5 || odds.indexOf(enemyLastMove) > -1){
          this.markTile(myFirstMove + helper.plusOrMinus(3), P2);
        }

      }
      else{
        this.markTile(helper.randomArrVal(emptyTiles), P2);
      }
    }

  },

  markTile: function(index, P2){
    var tile = $(board.boxes[index]);

    if(!tile.text()){
      tile.text(this.sign);
      finished = board.checkBoard(this);

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



var helper = {
  plusOrMinus: function(n){
    var random = Math.round(Math.random());
    return random ? n : -n;
  },

  randomArrVal: function(arr){
    var randomIndex =  Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  },

  randomTile: function(){
    var random = Math.round(Math.random());

    return random ? ['X','O'] : ['O','X'];
  },

  setRandomTurn: function(P1, P2){
    var random = Math.round(Math.random());

    if(random){
      P2.turn = false;
      P1.turn = true;
    }
    else{
      P2.turn = true;
      P1.turn = false;
    }
  }
}




//PLAYER VS COMPUTER BUTTON LOGIC
$('.pvc').click(function(){
  $('.container').addClass('move-active');
});

$('.btn').click(function(){
  $('.menu').toggleClass('inactive');
  P1 = new Player($(this).text());
  P2 = new Robot(P1.sign);
  helper.setRandomTurn(P1, P2);

  console.log(P1, P2);
  game = new Game(P1, P2, 500);
  game.start();
});


//PLAYER VS PLAYER BUTTON LOGIC
$('.pvp').click(function(){
  $('.menu').toggleClass('inactive');
  var tile = helper.randomTile();

  P1 = new Player(tile[0]);
  P2 = new Player(tile[1]);
  helper.setRandomTurn(P1, P2);
  game = new Game(P1, P2, 300);

  game.start();
});


//COMPUTER VS COMPUTER BUTTON LOGIC
$('.cvc').click(function(){
  $('.menu').toggleClass('inactive');
  var tile = helper.randomTile();

  P1 = new Robot(tile[0]);
  P2 = new Robot(P1.sign);
  helper.setRandomTurn(P1, P2);
  game = new Game(P1, P2, 700);

  game.start();
});

$('.back').click(function(){
  game.stop();
});
