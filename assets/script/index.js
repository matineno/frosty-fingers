'use strict';

import * as utils from './utils.js'
import words from './words.js';

const displayedWord = utils.getElement('word-display');
const input = utils.getElement('user-input');
const startButton = utils.getElement('start-button');
const timerDuration = 99;
let timeRemaining = timerDuration;
let timerInterval;
const timerElement = utils.getElement('timer');
const timeRemainingSpan = utils.getElement('time-remaining');
const scoreElement = utils.getElement('score');
let currentScore = utils.getElement('current-score');
let startingScore = 0;
let shuffledArray = randomizeWords();
let isVisible = true;
let sound; // declare sound variable globally

// Start game
utils.listen('click', startButton, () => {
  resetGame(); // Reset game, timer, and sound
  startTimer();
  startSound();
  displayWord();
});

utils.listen('input', input, () => {
  checkInput();
});

function randomizeWords() {
  return words.sort(() => Math.random() - 0.5);
}

function startTimer() {
  timeRemaining = timerDuration; // Reset time remaining
  timeRemainingSpan.textContent = timeRemaining;
  timerInterval = setInterval(() => {
    timeRemaining--;
    timeRemainingSpan.textContent = timeRemaining;
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      timerElement.textContent = 'Time\'s up!';
      gameEnded();
    }
  }, 1000);
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

function displayWord() {
  displayedWord.textContent = shuffledArray[0];
}

function checkInput() {
  let gotAMatch = displayedWord.textContent === input.value;
  console.log(`array length: ${shuffledArray.length}`);
  if (gotAMatch) {
    updateWord();
    updateScore();
    clearInput();
  }
}

function updateWord() {
  if (shuffledArray.length >= 1) {
    shuffledArray.shift();
    displayedWord.textContent = shuffledArray[0];
  } else {
    gameEnded();
    displayedWord.textContent = 'You\'ve beat the game!';
  }
}

function updateScore() {
  currentScore.textContent++;
}

function clearInput() {
  input.value = '';
}

// Reset game, timer, and sound
function resetGame() {
  clearInterval(timerInterval);
  if (sound) {
    sound.pause(); // Pause the sound if it's playing
    sound.currentTime = 0; // Reset playback to the beginning
  }
  input.disabled = false;
  currentScore.textContent = startingScore;
  shuffledArray = randomizeWords();
}

// End Game
function gameEnded() {
  input.disabled = true;
  if (sound) {
    sound.pause(); // Pause the sound if it's playing
    sound.currentTime = 0; // Reset playback to the beginning
  }
}
