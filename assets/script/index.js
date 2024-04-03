'use strict';

import * as utils from './utils.js'
import words from './words.js';

// Variables and Constants
const displayedWord = utils.getElement('word-display');
const input = utils.getElement('user-input');
const startButton = utils.getElement('start-button');
const stopButton = utils.getElement('stop-button');
const timerDuration = 99;
let timeRemaining = timerDuration;
let timerInterval;
const timerElement = utils.getElement('timer');
const timeRemainingSpan = utils.getElement('time-remaining');
let currentScore = utils.getElement('current-score');
let startingScore = 0;
let shuffledArray = randomizeWords();
let inputIsVisible = false;
let sound; // declare sound variable globally
let backgroundSound;

// Sound on page load
utils.listen('DOMContentLoaded', document, () => {
  startbackgroundAudio();
});

// Start game
utils.listen('click', startButton, () => {
  resetGame(); // Reset game, timer, and sound
  startTimer();
  startSound();
  startbackgroundAudio();
  displayWord();
  if (!inputIsVisible) {
  displayInputArea();
  }
});

// End game
utils.listen('click', stopButton, () => {
  resetGame();
  gameEnded();
  startbackgroundAudio();
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
      startbackgroundAudio()
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

function startbackgroundAudio() {
  backgroundSound = new Audio('./assets/media/background-music.mp3');
  backgroundSound.loop = true;
  backgroundSound.play();
}

function displayWord() {
  displayedWord.textContent = shuffledArray[0];
}

function displayInputArea() {
  input.classList.toggle('visible');
  inputIsVisible = true;
}

function removeInputArea() {
  input.classList.remove('visible');
  inputIsVisible = false;
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
  timerElement.textContent = '';
  if (sound) {
    sound.pause(); // Pause the sound if it's playing
    sound.currentTime = 0; // Reset playback to the beginning
  }
  currentScore.textContent = startingScore;
  shuffledArray = randomizeWords();
}

// End Game
function gameEnded() {
  removeInputArea();
  if (sound) {
    sound.pause(); // Pause the sound if it's playing
    sound.currentTime = 0; // Reset playback to the beginning
  }
}