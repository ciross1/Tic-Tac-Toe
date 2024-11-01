const squares = document.querySelectorAll(".square");
const turnText = document.querySelector(".turnText");
const btnBot = document.querySelector(".button-play-against-bot");

class Players {
  constructor(player1, player2, bot) {
    this.player1 = player1;
    this.player2 = player2;
    this.bot = null; //el bot no esta activo por defecto
    this.currentPlayer = player1;
  }

  switchPlayer() {
    if (this.currentPlayer === this.player1) {
      if (this.player2) {
        this.currentPlayer = this.player2;
        turnText.innerHTML = "It's your turn, player 2";
      } else {
        this.currentPlayer = this.bot;
        turnText.innerHTML = "Bot's turn";
      }
    } else {
      this.currentPlayer = this.player1;
      turnText.innerHTML = "It's your turn, player 1";
    }
  }

  getCurrentPlayer() {
    return this.currentPlayer;
  }
}

const GameFunction = () => {
  let gameBoard = Array(9).fill(null);

  /*tablero vacio. es lo mismo que let gameBoard = [null, null, null, null, null, null, null, null, null]; */

  const players = new Players("X", "O", null); //el bot y player 2 es "O"
  let gameActive = true;

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const handleClick = (e) => {
    const index = e.target.dataset.index;
    /*e.target es el elemento en el que ocurrió el clic.
dataset.index accede al valor del atributo data-index de ese elemento. */

    // Si el juego está inactivo o la casilla ya está ocupada, no hacer nada
    if (!gameActive || gameBoard[index]) return;

    gameBoard[index] = players.getCurrentPlayer();

    //Actualizar el tablero y la interfaz con el jugador actual

    /*index es la posición del tablero (de 0 a 8) que ha sido clickeada, y estamos actualizando esa posición en el array para reflejar que un jugador ha hecho su jugada en esa casilla. */

    /*players.getCurrentPlayer() obtiene el jugador actual, ya sea "X" o "O", dependiendo de quién está jugando en ese momento. */

    /*Por ejemplo, si el jugador actual es "X" y ha clickeado en la casilla con índice 3, entonces gameBoard[3] = "X" actualiza el tablero en la posición 3 con el valor "X". */

    /*Supongamos que el jugador "X" hace clic en la casilla con índice 4 = [null, null, null, null, "X", null, null, null, null]*/

    e.target.textContent = players.getCurrentPlayer();

    /*Esta línea actualiza la interfaz gráfica (lo que el jugador ve) para mostrar quién ha hecho la jugada en la casilla seleccionada. */

    /*e.target es el elemento HTML en el que se ha hecho clic (en este caso, una de las casillas del tablero).
.textContent:
textContent es una propiedad de los elementos HTML que se utiliza para definir o actualizar el texto que se muestra dentro de un elemento. 

Luego, la casilla en la que se hizo clic (la que tiene data-index="4") se actualiza visualmente para mostrar "X"*/

    if (checkWinner(players.getCurrentPlayer())) {
      alert(`${players.getCurrentPlayer()} has won!"`);
      gameActive = false;
      return;
    }

    //  // Cambiar de jugador
    players.switchPlayer();

    if (players.getCurrentPlayer() === players.bot && gameActive) {
      setTimeout(botMove, 500); //// Un pequeño retraso para simular el "pensamiento" del bot
    }
  };

  const botMove = () => {
    const botSymbol = players.bot;
    const playerSymbol = players.player1;

    const makeMove = (index) => {
      gameBoard[index] = botSymbol;
      squares[index].textContent = botSymbol;
      players.switchPlayer(); // Cambiar turno después de que el bot juega
    };

    // Verificar si el bot puede ganar en esta jugada
    /*Antes de que el bot haga una jugada, queremos verificar si hacer esa jugada le permitiría ganar o bloquear al jugador. */
    for (let i = 0; i < gameBoard.length; i++) {
      if (gameBoard[i] === null) {
        gameBoard[i] = botSymbol;
        /*Después de simular el movimiento en la casilla i, el bot llama a la función checkWinner(botSymbol) para verificar si esta jugada hace que el bot gane. Si la función devuelve true, el bot ha encontrado una jugada ganadora en la posición i*/
        if (checkWinner(botSymbol)) {
          makeMove(i);
          return;
        }

        /*Si el movimiento en la casilla i no lleva al bot a ganar, el bot “deshace” la jugada poniendo null nuevamente en gameBoard[i]. Esto permite probar otras posiciones sin alterar el tablero permanentemente.*/
        gameBoard[i] = null; // Revertir el movimiento
      }
    }

    // Verificar si el bot necesita bloquear al jugador a ganar la partida

    for (let i = 0; i < gameBoard.length; i++) {
      if (gameBoard[i] === null) {
        gameBoard[i] = playerSymbol;

        if (checkWinner(playerSymbol)) {
          makeMove(i)
          return;
        }
        gameBoard[i] = null; // Revertir el movimiento
      }
    }

    //// Tomar el centro si está disponible

    if (gameBoard[4] === null) {
     makeMove(4)
      return;
    }

    // Tomar una esquina si está disponible

    const corners = [0, 2, 6, 8];

    for (const corner of corners) {
      if (gameBoard[corner] === null) {
        makeMove(corner)
        return;
      }
    }

    //tomar un lado si esta disponible

    const sides = [1, 3, 5, 7];
    for (const side of sides) {
      if (gameBoard[side] === null) {
        makeMove(side)
        return;
      }
    }
  };

  // Función para verificar si el jugador actual ha ganado
  const checkWinner = (player) => {
    return winningCombinations.some((combination) => {
      return combination.every((index) => gameBoard[index] === player);

      /*Recorre todas las combinaciones ganadoras con .some().
  Para cada combinación, verifica si todas las posiciones de esa combinación en el tablero están ocupadas por el jugador actual utilizando .every().
  Si alguna combinación cumple la condición (es decir, todas las posiciones de esa combinación son del jugador), el código devuelve true (lo que indica que el jugador ha ganado); */
    });
  };

  const resetGame = () => {
    gameBoard.fill(null); //limpiar el tablero
    squares.forEach((square) => (square.textContent = ""));
    gameActive = true; // reactiva el jugador
    players.currentPlayer = players.player1; //Vuelve a empezar el primer jugador
    players.player2 = "O";
    players.bot = null;
    turnText.innerHTML = "Restart? let's start with player 1 (x)!";
  };

  squares.forEach((square) => {
    square.addEventListener("click", handleClick);
  });

  const resetButton = document.createElement("button");
  resetButton.textContent = "Play and restart";
  document.body.appendChild(resetButton);
  /*El método .appendChild() es una forma de agregar un nuevo elemento HTML dentro de otro elemento HTML.
En este caso, appendChild(resetButton) está agregando el elemento resetButton (un botón de reinicio, por ejemplo) al final del contenido dentro de <body>. */
  resetButton.addEventListener("click", resetGame); // creamos la funcion de cliock del boton

  btnBot.addEventListener("click", () => {
    gameBoard.fill(null);
    squares.forEach((square) => (square.textContent = ""));
    gameActive = true;
    players.player2 = null; // Eliminar al segundo jugador humano y jugar contra el bot
    players.bot = "O";
    /*Se activa el bot al hacer clic en el botón: Al presionar el botón para jugar contra el bot, el jugador 2 (humano) es desactivado, y el bot toma su lugar como "O". */
    players.currentPlayer = players.player1;
    turnText.innerHTML = "You're playing against the Bot!";
  });
};

GameFunction(); //para iniciar el juego
