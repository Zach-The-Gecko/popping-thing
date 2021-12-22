// Screens
const cheatingBotScreen = document.querySelector("#cheatingBotScreen");
const startingScreen = document.querySelector("#startingScreen");
const pvpScreen = document.querySelector("#pvpScreen");

// Overall Game Settings

const gameSettings = {
  whatTypeOfGame: "",
  highestNumber: 0,
  myTurn: false,
  onTrack: false,
  playerOnesTurn: true,
};

// Disappearing and Reappearing functions

const disappear = (elmt) => {
  elmt.style.position = "absolute";
  elmt.style.top = "-1000px";
};

const reappear = (elmt) => {
  elmt.style.position = "static";
};

// -------------------------- Starting Screen -------------------------- //

const whatSetting = document.querySelector("#whatSetting");

const cheatingBotOptions = document.querySelector("#cheatingBotOptions");
const pvpOptions = document.querySelector("#pvpOptions");

const cheatingBotTypeOfGame = document.querySelector("#cheatingBotTypeOfGame");
const pvpTypeOfGame = document.querySelector("#pvpTypeOfGame");

const amIGoingFirst = document.querySelector("#amIGoingFirst");

const submitStartingScreen = document.querySelector("#submitStartingScreen");

// Disappear everything not needed at the moment

disappear(cheatingBotScreen);
disappear(pvpScreen);
disappear(cheatingBotOptions);
disappear(pvpOptions);

const checkIfSubmittableAndSubmit = () => {
  if (gameSettings.whatTypeOfGame == "cheatingBot") {
    let enteredValue = Math.floor(cheatingBotTypeOfGame.value);
    if (enteredValue >= 2 && enteredValue <= 26 && enteredValue) {
      gameSettings.highestNumber = enteredValue;
      gameSettings.myTurn = amIGoingFirst.checked;
      initiateCheatingBotScreen();
    } else {
      alert("Please Enter A Number 2-26");
    }
  }
  if (gameSettings.whatTypeOfGame == "pvp") {
    let enteredValue = Math.floor(pvpTypeOfGame.value);
    if (enteredValue >= 2 && enteredValue <= 26 && enteredValue) {
      gameSettings.highestNumber = enteredValue;
      gameSettings.myTurn = false;
      initiatePVPScreen();
    } else {
      alert("Please Enter A Number 2-26");
    }
  }
};

// When the type of game changes, from the dropdown, show more options

const showMoreOptionsForSelectedGame = (e) => {
  if (e.target.value == "cheatingBot") {
    gameSettings.whatTypeOfGame = "cheatingBot";
    gameSettings.highestNumber = 0;
    gameSettings.myTurn = false;
    reappear(cheatingBotOptions);
    disappear(pvpOptions);
  }
  if (e.target.value == "pvp") {
    gameSettings.whatTypeOfGame = "pvp";
    gameSettings.highestNumber = 0;
    gameSettings.myTurn = false;
    reappear(pvpOptions);
    disappear(cheatingBotOptions);
  }
};

// Event Listeners

// Detects when to show more options
whatSetting.addEventListener("change", (e) => {
  showMoreOptionsForSelectedGame(e);
});

// Detects for submitting form listeners

cheatingBotTypeOfGame.addEventListener("keypress", (e) => {
  if (e.code == "Enter") {
    checkIfSubmittableAndSubmit();
  }
});

pvpTypeOfGame.addEventListener("keypress", (e) => {
  if (e.code == "Enter") {
    checkIfSubmittableAndSubmit();
  }
});

submitStartingScreen.addEventListener("click", checkIfSubmittableAndSubmit);

// -------------------------- Cheating Bot Screen -------------------------- //

const highestNumberCheatingBot = document.querySelector(
  "#highestNumberCheatingBot"
);
const whatToDoCheatingBot = document.querySelector("#whatToDoCheatingBot");

const gameBoardCheatingBot = document.querySelector("#gameBoardCheatingBot");
const arrOfGameItems = Array.from(document.querySelectorAll(".gameItem"));
const btnForTurnsCheatingBot = document.querySelector(
  "#btnForTurnsCheatingBot"
);

const onTrackDisplay = document.querySelector("#onTrackDisplay");

const returnIfGrandsonOf = (array, grandparent) => {
  return array.filter((gameItem) => {
    if (gameItem.parentElement.parentElement == grandparent) {
      return gameItem;
    }
  });
};

const arrOfGameItemsCheatingBot = returnIfGrandsonOf(
  arrOfGameItems,
  gameBoardCheatingBot
);

const assesBoardCheatingBot = () => {
  let numberChecked = 0;
  let gameBoard = [];
  for (let i = 0; i < arrOfGameItemsCheatingBot.length; i++) {
    gameBoard.push(arrOfGameItemsCheatingBot[i].checked);
    if (arrOfGameItemsCheatingBot[i].checked) {
      numberChecked++;
    }
  }
  return { numberChecked, gameBoard };
};

const disableCurrentlyCheckedCheatingBot = () => {
  let gameBoard = assesBoardCheatingBot().gameBoard;
  let numberChecked = 0;
  for (let i = 0; i < gameBoard.length; i++) {
    if (
      arrOfGameItemsCheatingBot[i].checked &&
      !arrOfGameItemsCheatingBot[i].disabled
    ) {
      numberChecked++;
    }
  }
  if (numberChecked <= gameSettings.highestNumber && numberChecked >= 1) {
    for (let i = 0; i < gameBoard.length; i++) {
      if (arrOfGameItemsCheatingBot[i].checked) {
        arrOfGameItemsCheatingBot[i].disabled = true;
        arrOfGameItemsCheatingBot[i].classList.add("highLightGreen");
      }
    }
    return numberChecked;
  } else {
    if (!gameSettings.myTurn) {
      alert(`Please Pick A Number Between 1 and ${gameSettings.highestNumber}`);
    }
    return false;
  }
};

const pushDown = (numberToPushDown) => {
  let uncheckedGameBoard = [];
  for (let i = 0; i < arrOfGameItemsCheatingBot.length; i++) {
    if (!arrOfGameItemsCheatingBot[i].checked) {
      uncheckedGameBoard.push(arrOfGameItemsCheatingBot[i]);
    }
  }
  for (let i = 0; i < numberToPushDown; i++) {
    uncheckedGameBoard[i].checked = true;
    uncheckedGameBoard[i].disabled = true;
    uncheckedGameBoard[i].classList.add("highLight");
  }
};

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max) + 1;
};

const myTurn = (numberChecked, firstTime) => {
  if (assesBoardCheatingBot().numberChecked == 27) {
    alert("DARNIT! WE TRIED OUR BEST!");
  }

  whatToDoCheatingBot.innerHTML = "";

  btnForTurnsCheatingBot.innerHTML = "Opponent's Turn";
  gameSettings.myTurn = true;

  for (let i = 0; i < arrOfGameItemsCheatingBot.length; i++) {
    if (!arrOfGameItemsCheatingBot[i].checked) {
      arrOfGameItemsCheatingBot[i].disabled = true;
    }
  }
  let numberToPushDown;
  if (firstTime) {
    numberToPushDown =
      27 -
      Math.floor(27 / (gameSettings.highestNumber + 1)) *
        (gameSettings.highestNumber + 1);
    if (numberToPushDown) {
      pushDown(numberToPushDown);
      gameSettings.onTrack = true;
    } else {
      numberToPushDown = getRandomInt(gameSettings.highestNumber);
      pushDown(numberToPushDown);
      gameSettings.onTrack = false;
    }
  } else {
    if (gameSettings.onTrack) {
      numberToPushDown = gameSettings.highestNumber + 1 - numberChecked;
      if (numberToPushDown) {
        pushDown(numberToPushDown);
      } else {
        numberToPushDown = getRandomInt(gameSettings.highestNumber);
        pushDown(numberToPushDown);
        gameSettings.onTrack = false;
      }
    } else {
      numberToPushDown =
        27 -
        assesBoardCheatingBot().numberChecked -
        Math.floor(
          (27 - assesBoardCheatingBot().numberChecked) /
            (gameSettings.highestNumber + 1)
        ) *
          (gameSettings.highestNumber + 1);
      if (numberToPushDown) {
        pushDown(numberToPushDown);
        gameSettings.onTrack = true;
      } else {
        numberToPushDown = getRandomInt(gameSettings.highestNumber);
        pushDown(numberToPushDown);
        gameSettings.onTrack = false;
      }
    }
  }
  whatToDoCheatingBot.innerHTML = `Push down ${numberToPushDown} so the board looks like shown, then once you are done, press opponent's turn`;
};
const opponentsTurn = () => {
  if (assesBoardCheatingBot().numberChecked == 27) {
    alert("YAAAAAAY YOU WON!!!");
  }
  btnForTurnsCheatingBot.innerHTML = "My Turn";
  whatToDoCheatingBot.innerHTML = `Check off the boxes that your opponent presses down`;
  gameSettings.myTurn = false;
  for (let i = 0; i < arrOfGameItemsCheatingBot.length; i++) {
    arrOfGameItemsCheatingBot[i].classList.remove("highLight");
    if (
      !arrOfGameItemsCheatingBot[i].checked &&
      arrOfGameItemsCheatingBot[i].disabled
    ) {
      arrOfGameItemsCheatingBot[i].disabled = false;
    } else if (
      arrOfGameItemsCheatingBot[i].checked &&
      arrOfGameItemsCheatingBot[i].disabled
    ) {
      arrOfGameItemsCheatingBot[i].classList.add("highLightGreen");
    }
  }
};

const initiateCheatingBotScreen = () => {
  // Change Screen
  disappear(startingScreen);
  reappear(cheatingBotScreen);

  // Set Game Title
  highestNumberCheatingBot.innerHTML = `The ${gameSettings.highestNumber}'s Game`;
  // Figure out who's turn it is
  if (gameSettings.myTurn) {
    myTurn(0, true);
  } else {
    opponentsTurn();
  }

  if (gameSettings.myTurn) {
    btnForTurnsCheatingBot.innerHTML = "Opponent's Turn";
  } else {
    btnForTurnsCheatingBot.innerHTML = "My Turn";
  }

  // Add event listener to detect when it's our turn vs. their turn

  btnForTurnsCheatingBot.addEventListener("click", () => {
    let numberChecked = disableCurrentlyCheckedCheatingBot();
    if (gameSettings.myTurn) {
      opponentsTurn();
    } else {
      if (numberChecked) {
        myTurn(numberChecked);
      }
    }
    if (gameSettings.onTrack) {
      onTrackDisplay.innerHTML = "You are on track to win!";
      onTrackDisplay.style.color = "#0c0";
    } else {
      onTrackDisplay.innerHTML = "You are not on track to win!";
      onTrackDisplay.style.color = "#c00";
    }
  });
};

// -------------------------- PVP Screen -------------------------- //

const highestNumberPVP = document.querySelector("#highestNumberPVP");
const whatToDoPVP = document.querySelector("#whatToDoPVP");

const gameBoardPVP = document.querySelector("#gameBoardPVP");
const arrOfGameItemsPVP = returnIfGrandsonOf(arrOfGameItems, gameBoardPVP);
const btnForTurnsPVP = document.querySelector("#btnForTurnsPVP");

const assesBoardPVP = () => {
  let numberChecked = 0;
  let gameBoard = [];
  for (let i = 0; i < arrOfGameItemsPVP.length; i++) {
    gameBoard.push(arrOfGameItemsPVP[i].checked);
    if (arrOfGameItemsPVP[i].checked) {
      numberChecked++;
    }
  }
  return { numberChecked, gameBoard };
};

const disableCurrentlyCheckedPVP = () => {
  let gameBoard = assesBoardPVP().gameBoard;
  let numberChecked = 0;
  for (let i = 0; i < gameBoard.length; i++) {
    if (arrOfGameItemsPVP[i].checked && !arrOfGameItemsPVP[i].disabled) {
      numberChecked++;
    }
  }
  if (numberChecked <= gameSettings.highestNumber && numberChecked >= 1) {
    for (let i = 0; i < gameBoard.length; i++) {
      if (arrOfGameItemsPVP[i].checked) {
        arrOfGameItemsPVP[i].disabled = true;
        arrOfGameItemsPVP[i].classList.add("highLightGreen");
      }
    }
    return numberChecked;
  } else {
    if (!gameSettings.myTurn) {
      alert(`Please Pick A Number Between 1 and ${gameSettings.highestNumber}`);
    }
    return false;
  }
};

const initiatePVPScreen = () => {
  disappear(startingScreen);
  reappear(pvpScreen);

  whatToDoPVP.innerHTML = `Press any number of checkmarks, 1-${gameSettings.highestNumber}, then click "Player 2's turn"`;
  btnForTurnsPVP.innerHTML = `Player 2's turn`;

  gameSettings.playerOnesTurn = true;
  highestNumberPVP.innerHTML = `The ${gameSettings.highestNumber}'s Game`;
  btnForTurnsPVP.addEventListener("click", () => {
    if (disableCurrentlyCheckedPVP()) {
      let oneOrTwo;
      if (gameSettings.playerOnesTurn) {
        oneOrTwo = 1;
      } else {
        oneOrTwo = 2;
      }
      if (assesBoardPVP().numberChecked == 27) {
        alert(`PLAYER ${oneOrTwo} WON!!!!!`);
      }
      whatToDoPVP.innerHTML = `Press any number of checkmarks, 1-${gameSettings.highestNumber}, then click "Player ${oneOrTwo}'s turn"`;
      btnForTurnsPVP.innerHTML = `Player ${oneOrTwo}'s turn`;
      gameSettings.playerOnesTurn = !gameSettings.playerOnesTurn;
    }
  });
};
