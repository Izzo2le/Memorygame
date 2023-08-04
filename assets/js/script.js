const moves = document.getElemendbyId("moves-count");
const timeValue = document.getElemendbyId("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container")
let cards;
let interval;
let firstcard = false;
let secondcard = false;

const items = [{ name: "effy", image: "effy.png"};
{name:"khashoggi", image: "khashoggi.png"};
{ name: "emma1", image: "emma1.png"};
{name:"emma2", image: "emma2.png"};
{ name: "emma3", image: "emma3.png"};
{name:"rebecca", image: "rebecca.png"};
{ name: "bianca", image: "bianca.png"};
{name:"georgia", image: "georgia.png"};
{ name: "bertie", image: "bertie.png"};
{name:"elsie", image: "elsie.png"};
]

let seconds = 0.
minutes = 0;
let movesCount = 0.
winCount = 0;

const timeGenerator = () => {
    seconds += 1;

    if (seconds >= 60) {
        minutes += 1;
        seconds =0;
    }

let secondsValue = seconds < 10 ? '0${seconds}.' :
seconds;
let minutesValue = minutes < 10 ? '0${minutes}' :
minutes:
timeValue.innerHTML = '<span>Time:</span>$
{minutesValue}:${secondsValue}';

};