function Game(playerOne, playerTwo){
  var board = document.getElementsByClassName('grid');
  var finished = false;
  var win = [
    [0,1,2],[3,4,5],[6,7,8], //horizontals
    [0,3,6],[1,4,7],[2,5,8], //verticals
    [0,4,8],[2,4,6] //diagonals
  ];

  if(playerTwo == undefined){
    playerTwo = this;
  }

  function assign(){
    board[Math.floor(Math.random() * board.length)].innerHTML = playerTwo.sign;
  }

  function init(){
    if(!finished){

      $('.grid').click(function(){
        if(playerOne.turn && !finished){
          $(this).text(playerOne.sign);
          playerOne.turn = false;
          playerTwo.turn = true;
          checkBoard(playerOne);
          setTimeout(init, 1000);
        }
      });

      if(playerTwo.turn){
        assign();
        playerTwo.turn = false;
        playerOne.turn = true;
        checkBoard(playerTwo);
        setTimeout(init, 1000);
      }

    }
  }

  function checkBoard(player){
    for(var i = 0; i < win.length; i++){
      var a = $(board[win[i][0]]).text();
      var b = $(board[win[i][1]]).text();
      var c = $(board[win[i][2]]).text();

      console.log(a,b,c);
      if(a == player.sign && b == player.sign && c == player.sign){
        finished = true;
        player.score++;
        break;
      }

    }
  }

  this.turn = false;

  this.sign = (function(sign){
    return sign == 'X'?'O':'X';
  })(playerOne.sign);

  this.start = function(){
    init();
  }

}

function Player(sign){
  this.sign = sign;
  this.turn = true;
  this.score = 0;
}

$('button').click(function(){
  var playerOne = new Player($(this).text());
  var playerTwo;
  var game = new Game(playerOne, playerTwo);
  game.start();
});
