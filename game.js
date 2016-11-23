var finished = false;

var win = [
  [0,1,2],[3,4,5],[6,7,8], //horizontals
  [0,3,6],[1,4,7],[2,5,8], //verticals
  [0,4,8],[2,4,6] //diagonals
];


function Game(playerOne, playerTwo){
  var board = new Board('grid');

  if(playerTwo == undefined){
    playerTwo = this;
  }

  function assign(){
    for(var index = 0; index < win.length; index++){
      var a = $(board.grids[win[index][0]]), b = $(board.grids[win[index][1]]), c = $(board.grids[win[index][2]]);

      if(!c.text() && a.text() == playerOne.sign && b.text() == playerOne.sign || a.text() == playerTwo.sign && b.text() == playerTwo.sign){
        c.text(playerTwo.sign);
        break;
      }
      else if(!a.text() && b.text() == playerOne.sign && c.text() == playerOne.sign || b.text() == playerTwo.sign && c.text() == playerTwo.sign){
        a.text(playerTwo.sign);
        break;
      }
      else if(!b.text() && a.text() == playerOne.sign && c.text() == playerOne.sign || a.text() == playerTwo.sign && c.text() == playerTwo.sign){
        b.text(playerTwo.sign);
        break;
      }

    }

  }

  function init(){
    if(!finished){

      $('.grid').click(function(){
        if(playerOne.turn && !finished && !$(this).text()){
          $(this).text(playerOne.sign);
          playerOne.turn = false;
          playerTwo.turn = true;
          board.checkWinner(playerOne);
          setTimeout(init, 1000);
        }
      });

      if(playerTwo.turn){
        assign();
        playerTwo.turn = false;
        playerOne.turn = true;
        board.checkWinner(playerTwo);
        setTimeout(init, 1000);
      }

    }
  }

  this.turn = true;

  this.sign = (function(sign){
    return sign == 'X'?'O':'X';
  })(playerOne.sign);

  this.start = function(){
    init();
  }

}

function Board(grid){
  this.grids = document.getElementsByClassName(grid);

  this.clear = function(){
    for(var i = 0; i < this.grids.length; i++){
      var grid = this.grids[i];
      $(grid).text('');
    }
  }

  this.checkWinner = function(player){
    for(var i = 0; i < win.length; i++){
      var a = $(this.grids[win[i][0]]).text();
      var b = $(this.grids[win[i][1]]).text();
      var c = $(this.grids[win[i][2]]).text();

      if(a == player.sign && b == player.sign && c == player.sign){
        finished = true;
        break;
      }
    }
  }
}

function Player(sign){
  this.sign = sign;
  this.turn = false;
  this.score = 0;
}

$('button').click(function(){
  var playerOne = new Player($(this).text());
  var playerTwo;
  var game = new Game(playerOne, playerTwo);
  game.start();
});
