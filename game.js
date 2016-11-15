
function Game(player){
  var finished = false;
  var start = false;

  this.win_combo = [
    [0,1,2],[3,4,5],[6,7,8], //horizontals
    [0,3,6],[1,4,7],[2,5,8], //verticals
    [0,4,8],[3,4,6] //diagonals
  ];

  this.board = document.getElementsByClassName('grid');

  this.checkBoard = function(){

  }

  this.sign = (function(player){
    return player.sign == 'X'?'O':'X';
  })(player);

  this.turn = false;
}

function Player(sign){
  this.sign = sign;
  this.turn = false;
}

var player = new Player('X');
var game = new Game(player);

$('.grid').click(function(){
  console.log(game.board);
});
