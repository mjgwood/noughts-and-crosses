$(document).ready(function() {
  var $square = $(".square");
  var turn = "X";
  var id, row, col;
  var squares = [$("#s1"), $("#s2"), $("#s3"), $("#s4"), $("#s5"), $("#s6"), $("#s7"), $("#s8"), $("#s9")];
  var gameState = [[0, 0, 0],[0, 0, 0],[0, 0, 0]];
  var allowDraw = false;
  var singlePlayer = false;
  var twoInRow = [false, 0, 0, 0];
  
  nextTurn();
  
  //Carry out next player turn
  function nextTurn() {
    $square.on("click", function() {
      if (allowDraw === true && $(".mark", this).text() === "") {
        $(".mark", this).html(turn);
        //id = $(".mark", this).attr("id");
        row = $(".mark", this).attr("class").slice(8, 9);
        col = $(".mark", this).attr("class").slice(13);
        updateState(row, col);
        checkWin();
        changeTurn();
        if(singlePlayer === true) {
          compTurn();
        }
      }
    })
  }
  
  function compTurn() {
    allowDraw = false;
    var compMove;
    checkPotentialWin();
    if(twoInRow[0] === true && squares[twoInRow[3]].text() === "") {
      compMove = twoInRow[3];
    } else {
      compMove = Math.floor(Math.random() * 9);
    }
    
    if(squares[compMove].text() === "") {
      setTimeout(function() {
        squares[compMove].html(turn);
        row = squares[compMove].attr("class").slice(8, 9);
        col = squares[compMove].attr("class").slice(13);
        updateState(row, col);
        checkWin();
        changeTurn();
        twoInRow = [false, 0, 0, 0];
        allowDraw = true;
        nextTurn();
      }, 1000);
    } else {
      compMove = Math.floor(Math.random() * 9);
      compTurn();
    }

  }
  
  //Update the gameState array
  function updateState(r, c) {
    if(turn === "X") {
      gameState[r-1][c-1] = 1;
    } else {
      gameState[r-1][c-1] = 2;
    }
  }
  
  //Switch between X and O
  function changeTurn() {
    if(turn === "X") {
      turn = "O";
    } else {
      turn = "X";
    }
  }
  
  //Check for 3 in a row
  function checkWin() {
    var win = false;
    var fullBoard = true;
    var one, two, three;
    var winner;
    
    for(var i = 0; i < 3; i++) {
      //Check for row of 3
      one = gameState[i][0];
      two = gameState[i][1];
      three = gameState[i][2];
      
      if(one === two && one === three && one !== 0) {
        win = true;
        break;
      }
      
      //Check for col of 3
      one = gameState[0][i];
      two = gameState[1][i];
      three = gameState[2][i];
      
      if(one === two && one === three && one !== 0) {
        win = true;
        break;
      }
      
      for(var j = 0; j < 3; j++) {
        if(gameState[i][j] === 0) {
          fullBoard = false;
        }
      }
    }
    
    //Check for 3 diagonally
    if(gameState[0][0] === gameState[1][1] && gameState[0][0] === gameState[2][2]) {
      if(gameState[0][0] !== 0) {
        win = true;
        one = gameState[0][0];
      }
    } else if(gameState[2][0] === gameState[1][1] && gameState[2][0] === gameState[0][2]) {
       if(gameState[2][0] !== 0) {
        win = true;
        one = gameState[2][0];
      }
    }
    
    if(win === true && one !== 0) {
      if(one === 1) {
          winner = "X";
        } else if(one === 2) {
          winner = "O";
        }
      allowDraw = false;
      $(".header").text(winner + " wins!");
      setTimeout(function() {
        reset();
        $(".header").text("Noughts & Crosses");
      }, 1000);
    } else if(fullBoard === true && win === false) {
      allowDraw = false;
      $(".header").text("Draw!");
      setTimeout(function() {
        reset();
        $(".header").text("Noughts & Crosses");
      }, 1000);
    }
  }
  
  //Check for 2 in a row and decide where to play, prioritising a win over a block
  function checkPotentialWin() {
    var potentialWin = false;
    var one, two, three;
    
    for(var i = 0; i < 3; i++) {
      //Check for row of 2
      one = gameState[i][0];
      two = gameState[i][1];
      three = gameState[i][2];
      
      if(one === two && two !== 0 && three === 0) {
        potentialWin = true;
        twoInRow[0] = potentialWin;
        twoInRow[1] = i;
        twoInRow[2] = 2;
        break;
      } else if(two === three && two !== 0 && one === 0) {
        potentialWin = true;
        twoInRow[0] = potentialWin;
        twoInRow[1] = i;
        twoInRow[2] = 0;
        break;
      } else if(one === three && one !== 0 && two === 0) {
        potentialWin = true;
        twoInRow[0] = potentialWin;
        twoInRow[1] = i;
        twoInRow[2] = 1;
        break;
      }
      
      //Check for col of 2
      one = gameState[0][i];
      two = gameState[1][i];
      three = gameState[2][i];
      
      if(one === two && two !== 0 && three === 0) {
        potentialWin = true;
        twoInRow[0] = potentialWin;
        twoInRow[1] = 2;
        twoInRow[2] = i;
        break;
      } else if(two === three && two !== 0 && one === 0) {
        potentialWin = true;
        twoInRow[0] = potentialWin;
        twoInRow[1] = 0;
        twoInRow[2] = i;
        break;
      } else if(one === three && one !== 0 && two === 0) {
        potentialWin = true;
        twoInRow[0] = potentialWin;
        twoInRow[1] = 1;
        twoInRow[2] = i;
        break;
      }
    }
    
    //Check for 2 diagonally
    if(gameState[0][0] === gameState[1][1] && gameState[0][0] !== 0 && gameState[2][2] === 0) {
      potentialWin = true;
      twoInRow[0] = potentialWin;
      twoInRow[1] = 2;
      twoInRow[2] = 2;
    } else if(gameState[1][1] === gameState[2][2] && gameState[1][1] !== 0 && gameState[0][0] === 0) {
      potentialWin = true;
      twoInRow[0] = potentialWin;
      twoInRow[1] = 0;
      twoInRow[2] = 0;
    } else if(gameState[0][0] === gameState[2][2] && gameState[0][0] !== 0 && gameState[1][1] === 0) {
      potentialWin = true;
      twoInRow[0] = potentialWin;
      twoInRow[1] = 1;
      twoInRow[2] = 1;
    }
    
    if(gameState[2][0] === gameState[1][1] && gameState[2][0] !== 0 && gameState[0][2] === 0) {
      potentialWin = true;
      twoInRow[0] = potentialWin;
      twoInRow[1] = 0;
      twoInRow[2] = 2;
    } else if(gameState[1][1] === gameState[0][2] && gameState[1][1] !== 0 && gameState[2][0] === 0) {
      potentialWin = true;
      twoInRow[0] = potentialWin;
      twoInRow[1] = 2;
      twoInRow[2] = 0;
    } else if(gameState[0][2] === gameState[2][0] && gameState[0][2] !== 0 && gameState[1][1] === 0) {
      potentialWin = true;
      twoInRow[0] = potentialWin;
      twoInRow[1] = 1;
      twoInRow[2] = 1;
    }
    
    if(potentialWin === true) {
      for(var i = 0; i < squares.length; i++) {
          if(squares[i].attr("class").slice(8,9) == twoInRow[1] + 1 && squares[i].attr("class").slice(13) == twoInRow[2] + 1) {
            twoInRow[3] = i;
          }
        }
    }
  }
  
  //Reset the board and game state
  function reset() {
    $(".mark").html("");
    gameState = [[0, 0, 0],[0, 0, 0],[0, 0, 0]];
    if($("#one_player").hasClass("btn_active") || $("#two_player").hasClass("btn_active")) {
      allowDraw = true;
    }
  }
  
  //Enable single player and reset
  $("#one_player").click(function() {
    $(this).addClass("btn_active");
    $("#two_player").removeClass("btn_active");
    reset();
    singlePlayer = true;
  })
  
  //Enable two player and reset
  $("#two_player").click(function() {
    $(this).addClass("btn_active");
    $("#one_player").removeClass("btn_active");
    reset();
    singlePlayer = false;
  })
  
  //Call reset on reset click
  $("#reset").click(function() {
    reset();
  });
  
  //Highlight tile on hover
  $square.hover(function() {
    if(allowDraw === true && $(".mark", this).text() === "") {
      $(this).css({boxShadow: "0 0 5px, inset 0 0 15px"});
    }
  },
    function() {
      $(this).css({boxShadow: "0 0 0, inset 1px 1px 5px"});
    })
})