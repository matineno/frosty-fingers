"use strict";

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

//  Start game
utils.listen('click', startButton, () => {
  
  timerInterval = setInterval(startTimer, 1000);
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
  timeRemainingSpan.textContent = timeRemaining;
  timeRemaining--;
  if (timeRemaining < 0) {
    clearInterval(timerInterval);
    timerElement.textContent = 'Time\'s up!';
    gameEnded();
  }
}

function startSound() {
  const sound = new Audio('./assets/media/alarm.mp3');
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
}function updateWord() {
  if (shuffledArray.length >= 1) {
    shuffledArray.shift();
    displayedWord.textContent = shuffledArray[0];
  }
  else {
    gameEnded();
    displayedWord.textContent = 'You\'ve beat the game!';
  }
}

function updateScore(){
  currentScore.textContent++;
}

function clearInput(){
  input.value = '';
}

// End Game
function gameEnded() {
  input.disabled = true;
  sound.pause();
}

