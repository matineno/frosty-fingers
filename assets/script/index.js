'use strict';

import * as utils from './utils.js'
import words from './words.js';

// Variables and Constants
const displayedWord = utils.getElement('word-display');
const scoreOutput = utils.getElement('score-output');
const input = utils.getElement('user-input');
const startButton = utils.getElement('start-button');
const stopButton = utils.getElement('stop-button');
const leaderBoard = utils.getElement('leader-board');
const leaderBoardButton = utils.getElement('leader-board-button');
const playArea = utils.getElement('play-area');
const timerDuration = 60;
let timeRemaining = timerDuration;
let timerInterval;
const timerElement = utils.getElement('timer');
const timeRemainingSpan = utils.getElement('time-remaining');
let currentScore = utils.getElement('current-score');
let startingScore = 0;
let shuffledArray = randomizeWords();
let inputIsVisible = false;
let gameRunning = false;
let sound;
let backgroundSound;
let playerHits = 0;
let playerPercentage = 0;
let scoresArray = [];

class CustomDate {
  constructor() {
    this.currentDate = new Date();
  }

  getCurrentDate() {
    const day = this.currentDate.getDate();
    const month = this.currentDate.getMonth() + 1;
    return `${day}/${month}`;
  }
}

let thisDay = new CustomDate();

// Define the Score class
class Score {
  constructor(hits, playerPercentage, thisDay) {
    this.hits = hits;
    this.percentage = playerPercentage;
    this.thisDay = thisDay;

  }

  getHits() {
    return `${this.hits}`;
  }

  getPercentage() {
    return `${this.percentage}`;
  }

  getThisDay() {
    return `${this.thisDay}`;
  }
}

// Function to create ul and li elements from scores
function createScoreList(scores) {
  const ul = document.createElement('ul');
  scores.forEach((score, index) => {
    const li = document.createElement('li');
    li.classList.add('flex');
    li.innerHTML = `
      <div><p class="bold">${index + 1}.</p></div>
      <div><p>${score.thisDay}</p></div>
      <div><p class="bold">${score.hits}</p></div>
      <div><p>${score.percentage}%</p></div>
    `;
    ul.appendChild(li);
  });

  return ul.outerHTML; // Return the outerHTML of the ul
}

// Initialize scores
let scores = scoresArray.map(score => new Score(score.hits, score.percentage, score.thisDay));

// Create HTML elements and set innerHTML of scoreOutput
const scoresListHTML = createScoreList(scores);
scoreOutput.innerHTML = scoresListHTML;
scoreOutput.classList.add('scores-list');

// Sound on page load
utils.listen('DOMContentLoaded', document, () => {
  startbackgroundAudio();
  // Retrieve scores from local storage
  scoresArray = JSON.parse(localStorage.getItem('scores')) || [];
});

// Start game
utils.listen('click', startButton, () => {
  if(!leaderboardIsVisible){
    resetGame();
    toogleStopButton();
    toggleInputArea();
    gameStarted();
  }
});

// End game
utils.listen('click', stopButton, () => {
  gameEnded();
  displayResult();
  displayLeaderBoard();
});

utils.listen('click', leaderBoardButton, () => {
  if(!gameRunning){
    tooglePlayArea();
    toogleLeaderBoard()
  }
});

utils.listen('input', input, () => {
  checkInput();
});

function randomizeWords() {
  return words.sort(() => Math.random() - 0.5);
}

function startGame() {
  inputIsVisible = true;
  input.focus();
  timeRemaining = timerDuration; // Reset time remaining
  timeRemainingSpan.textContent = timeRemaining;
  timerInterval = setInterval(() => {
    timeRemaining--;
    timeRemainingSpan.textContent = timeRemaining;
    if (playerPercentage >= 100) {
      gameEnded();
      displayedWord.textContent = 'You Win!';
      setTimeout(resetGame, 3000);
      displayLeaderBoard();
    }
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      gameEnded();
      displayResult();
      displayLeaderBoard()
    }
  }, 1000);
}

function gameStarted () {
    startGame();
    startSound();
    startbackgroundAudio();
    displayWord();
}

function gameEnded() {
  toggleInputArea();
  endGame();
  stopTimer();
  createScoreList(scoresArray);
  toogleStartButton();
}

function stopTimer() {
  clearInterval(timerInterval);
  timeRemaining = timeRemaining;
  timeRemainingSpan.textContent = timeRemaining;
}

function startSound() {
  if (sound) { // Check if sound is already playing
    sound.pause(); // Pause the sound if it's playing
    sound.currentTime = 0; // Reset playback to the beginning
  }
  sound = new Audio('./assets/media/alarm.mp3');
  sound.loop = true;
  sound.play();
}

function startbackgroundAudio() {
  backgroundSound = new Audio('./assets/media/background-music.mp3');
  backgroundSound.loop = true;
  backgroundSound.play();
}

function displayResult() {
  let greeting = "";
  if (playerPercentage < 10) {
      greeting = "Ouch";
  } else if (playerPercentage >= 10 && playerPercentage < 35) {
      greeting = "Almost there";
  } else if (playerPercentage >= 35 && playerPercentage < 70) {
      greeting = "Impressive";
  } else if (playerPercentage >= 70 && playerPercentage <= 100) {
      greeting = "Bravo";
  }
  displayedWord.textContent = greeting;
}


function displayWord() {
  displayedWord.textContent = shuffledArray[0];
}

function toggleInputArea() {
  if (inputIsVisible) {
    input.classList.toggle('visible');
    inputIsVisible = false;
  } else {
    input.classList.toggle('visible');
    inputIsVisible = true;
  }
}

function checkInput() {
  let inputText = input.value.trim();
  let displayedText = displayedWord.textContent.trim();

  for (let i = 0; i < inputText.length && i < displayedText.length; i++) {
    if (inputText[i] !== displayedText[i]) {
      input.disabled = true;
      displayedWord.textContent = 'Oops';
      clearInput();

      setTimeout(() => {
        input.disabled = false;
        input.focus();
        updateWord();
      }, 1000);
      return;
    }
  }

  if (inputText === displayedText) {
    updateWord();
    updateScore();
    clearInput();
    updateHitsAndPercentage();
  }
}



function updateWord() {
  if (shuffledArray.length >= 1) {
    shuffledArray.shift();
    displayedWord.textContent = shuffledArray[0];
  }
}

function updateScore() {
  currentScore.textContent++;
}

function calculatePercentage (playerHits, words) {
  let percent = ((playerHits / words.length) * 100).toFixed(0);
  return percent;
};

function updateHitsAndPercentage() {
  playerHits++;
  playerPercentage = calculatePercentage(playerHits, words);
}

function clearInput() {
  input.value = '';
}

// Reset game, timer, and sound
function resetGame() {
  clearInterval(timerInterval);
  timeRemainingSpan.textContent = 0;
  if (sound) {
    sound.pause(); // Pause the sound if it's playing
    sound.currentTime = 0; // Reset playback to the beginning
  }
  displayedWord.textContent = 'Press the play button';
  currentScore.textContent = 0;
  shuffledArray = randomizeWords();
  playerHits = 0; // Reset player hits
  playerPercentage = 0; // Reset player percentage
  toogleStartButton()
  if (inputIsVisible) {
    input.classList.toggle('visible');
    inputIsVisible = false;
}
}

function displayLeaderBoard() {
  setTimeout(() => {
    displayedWord.textContent = "";
    tooglePlayArea();
    toogleLeaderBoard();
    setTimeout(() => {
      displayedWord.textContent = "";
      clearInput();
      resetGame();
    }, 3000);
  }, 3000);
  setTimeout(() => {
    toogleLeaderBoard();
    tooglePlayArea();
  }, 6000);
}

// Update scores array
function updateScores() {
  playerHits = playerHits;
  const currentDate = thisDay.getCurrentDate(); // Get the current date
  const scoreObj = { hits: playerHits, percentage: playerPercentage, thisDay: currentDate }; // Include the current date in the score object
  scoresArray.push(scoreObj);
  scoresArray.sort((a, b) => b.hits - a.hits); // Sort scores by hits
  if (scoresArray.length > 10) {
    scoresArray.splice(10); // Keep only top 9 scores
  }
  localStorage.setItem('scores', JSON.stringify(scoresArray)); // Store scores in localStorage
}

// End Game
function endGame() {
  inputIsVisible = false;
  if (sound) {
    sound.pause(); // Pause the sound if it's playing
    sound.currentTime = 0; // Reset playback to the beginning
  }
  updateScores(); // Call the function to update scores array and store in local storage
}

let leaderboardIsVisible = false;
function toogleLeaderBoard() {
  if (!leaderboardIsVisible){
    leaderBoard.classList.add('isvisible');
    leaderboardIsVisible = true;
  } else {
    leaderBoard.classList.remove('isvisible');
    leaderboardIsVisible = false;
  }
}

let playAreaisVisible = true; //play area visible at default
function tooglePlayArea() {
  if (!playAreaisVisible) {
    playArea.classList.add('isvisible');
    playAreaisVisible = true;
  }else {
    playArea.classList.remove('isvisible');
    playAreaisVisible = false;
  }
}

function toogleStopButton() {
  startButton.classList.remove('isvisible');
  stopButton.classList.add('isvisible');
  gameRunning = true;
}

function toogleStartButton() {
  stopButton.classList.remove('isvisible');
  startButton.classList.add('isvisible');
  gameRunning = false;
}

