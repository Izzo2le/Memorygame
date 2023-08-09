const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("results");
const controls = document.querySelector(".controls-container");

const gameArea = document.getElementById("playGame");
const leaderboard = document.getElementById("leaderboard");
const menu = document.getElementById("menu");

const movesDisplay = document.getElementById("moves-count");
const timeDisplay = document.getElementById("time");
const leaderboardContainer = document.querySelector(".leaderboard-container");
const backButton = document.getElementById("back");
const submitButton = document.getElementById("submit");
const restartButton = document.getElementById("restart");
const nameInput = document.getElementById("name");
const leaderboardButton = document.getElementById("leaderboard-btn");

const instructions = document.getElementById("instructions");
const instructionsButton = document.getElementById("instructions-btn");
const backButton2 = document.getElementById("back2");

let gameState = {
  cards: null,
  interval: null,
  firstCard: null,
  secondCard: null,
  items: [
    { name: "effy", image: "assets/images/effy.png" },
    { name: "khashoggi", image: "assets/images/khashoggi.png" },
    { name: "emma2", image: "assets/images/emma2.png" },
    { name: "rebecca", image: "assets/images/rebecca.png" },
    { name: "bianca", image: "assets/images/bianca.png" },
    { name: "kofi", image: "assets/images/kofi.png" },
    { name: "lab", image: "assets/images/lab.png" },
    { name: "bertie", image: "assets/images/bertie.png" },
  ],
  seconds: 0,
  minutes: 0,
  movesCount: 0,
  winCount: 0,
  canPlay: true,
  leaderboard: JSON.parse(localStorage.getItem("leaderboard") || "[]"),
};

function showElement(elementId) {
  document.getElementById(elementId).classList.remove("hide");
}

function hideElement(elementId) {
  document.getElementById(elementId).classList.add("hide");
}

function updateLeaderboard() {
  leaderboardContainer.innerHTML = "";
  gameState.leaderboard.sort((a, b) => b.score - a.score);
  gameState.leaderboard.forEach((player) => {
    const playerElement = document.createElement("div");
    playerElement.textContent = `${player.name}: ${player.score}`;
    leaderboardContainer.appendChild(playerElement);
  });
  localStorage.setItem("leaderboard", JSON.stringify(gameState.leaderboard));
}

function resetGame() {
  gameState.firstCard = null;
  gameState.secondCard = null;
  gameState.seconds = 0;
  gameState.minutes = 0;
  gameState.movesCount = 0;
  gameState.winCount = 0;
}

startButton.addEventListener("click", function () {
  hideElement("menu");
  showElement("playGame");
  resetGame();
});

leaderboardButton.addEventListener("click", function () {
  hideElement("menu");
  showElement("leaderboard");
  updateLeaderboard();
});

instructionsButton.addEventListener("click", function () {
  hideElement("menu");
  showElement("instructions");
});

stopButton.addEventListener("click", function () {
  hideElement("playGame");
  showElement("endGame");
  clearInterval(gameState.interval);
});

submitButton.addEventListener("click", function (event) {
  event.preventDefault();
  gameState.leaderboard.push({
    name: nameInput.value,
    score: gameState.movesCount,
  });
  updateLeaderboard();
  hideElement("endGame");
  showElement("leaderboard");
});

restartButton.addEventListener("click", function () {
  hideElement("endGame");
  showElement("menu");
  resetGame();
});

backButton.addEventListener("click", function () {
  hideElement("leaderboard");
  hideElement("instructions");
  showElement("menu");
});

backButton2.addEventListener("click", function () {
  hideElement("instructions");
  showElement("menu");
});

const timeGenerator = () => {
  gameState.seconds += 1;

  if (gameState.seconds >= 60) {
    gameState.minutes += 1;
    gameState.seconds = 0;
  }

  let secondsValue =
    gameState.seconds < 10 ? `0${gameState.seconds}` : gameState.seconds;
  let minutesValue =
    gameState.minutes < 10 ? `0${gameState.minutes}` : gameState.minutes;
  timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};

const movesCounter = () => {
  gameState.movesCount += 1;
  moves.innerHTML = `<span>Moves:</span>${gameState.movesCount}`;
};

const generateRandom = (size = 4) => {
  let items = gameState.items;
  let tempArray = [...items];
  let cardValues = [];
  size = (size * size) / 2;

  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  cardValues.sort(() => Math.random() - 0.5);
  for (let i = 0; i < size * size; i++) {
    gameContainer.innerHTML += `
      <div class="card-container" data-card-value="${cardValues[i].name}">
          <div class="card-before">?</div>
          <div class="card-after">
          <img src="${cardValues[i].image}" class="image"/></div>
      </div>
      `;
  }

  gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      if (!card.classList.contains("matched") && gameState.canPlay) {
        card.classList.add("flipped");
        if (!gameState.firstCard) {
          gameState.firstCard = card;

          firstCardValue = card.getAttribute("data-card-value");
        } else {
          movesCounter();

          gameState.secondCard = card;
          gameState.canPlay = false;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {
            gameState.firstCard.classList.add("matched");
            gameState.secondCard.classList.add("matched");
            gameState.firstCard = false;
            gameState.winCount += 1;
            gameState.canPlay = true;
            if (gameState.winCount == Math.floor(cardValues.length / 2)) {
              showEndGame();
            }
          } else {
            let [tempFirst, tempSecond] = [
              gameState.firstCard,
              gameState.secondCard,
            ];
            gameState.firstCard = false;
            gameState.secondCard = false;
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
              gameState.canPlay = true;
            }, 900);
          }
        }
      }
    });
  });
};

function showEndGame() {
  hideElement("playGame");
  showElement("endGame");
  clearInterval(gameState.interval);
  result.innerHTML = `<h2>You Won</h2>
    <h4>Moves: ${gameState.movesCount}</h4>`;
}

//Start game
startButton.addEventListener("click", () => {
  gameState.movesCount = 0;
  gameState.seconds = 0;
  gameState.minutes = 0;
  stopButton.classList.remove("hide");
  gameState.interval = setInterval(timeGenerator, 1000);
  moves.innerHTML = `<span>Moves:</span> ${gameState.movesCount}`;
  initializer();
});
//Stop game
stopButton.addEventListener(
  "click",
  (stopGame = () => {
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(gameState.interval);
  })
);
//Initialize values and func calls
const initializer = () => {
  result.innerText = "";
  gameState.winCount = 0;
  let cardValues = generateRandom();
  matrixGenerator(cardValues);
};
