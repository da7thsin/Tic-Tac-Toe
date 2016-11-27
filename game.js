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

  this.checkWinner = function(player){
    for(var i = 0; i < win.length; i++){
      var a = $(this.boxes[win[i][0]]).text();
      var b = $(this.boxes[win[i][1]]).text();
      var c = $(this.boxes[win[i][2]]).text();

      if(a == player.sign && b == player.sign && c == player.sign){
        return true;
      }
    }

    return false;
  };

  this.clear = function(){
    for(var i = 0; i < this.boxes.length; i++){
      $(this.boxes[i]).text('');
    }
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
  }
}

function Robot(sign){
  this.sign = sign == 'X' ? 'O' : 'X';
  this.turn = false;
  this.score = 0;

  this.assign = function(P2){
    var tile = $(board.boxes[Math.floor(Math.random() * board.boxes.length)]);

    if(!tile.text()){
      tile.text(this.sign);
      finished = board.checkWinner(this);

      if(!finished){
        this.turn = false;
        P2.turn = true;
      }
    }
    else{
      for(var i = 0; i < board.length; i++){
        if(!$(board[i]).text()){
          $(board[i]).text(this.sign);
          finished = board.checkWinner(this);

          if(!finished){
            this.turn = false;
            P2.turn = true;
            break;
          }

        }
      }
    }

  }

}

function set(P1, P2){
  if(Math.random() > 0.87){
    P1.turn = false;
    P2.turn = true;
  }
  else{
    P1.turn = true;
    P2.turn = false;
  }
}

$('button').click(function(){
  $('.menu').toggleClass('active');
  $('.board').toggleClass('active');
  var P1 = new Player($(this).text());
  var P2 = new Robot(P1.sign);
  set(P1, P2);
  new Game(P1, P2);
});
