'use strict';

import * as utils from './utils.js'
import words from './words.js';

// Variables and Constants
const displayedWord = utils.getElement('word-display');
const scoreOutput = utils.getElement('score-output');
const input = utils.getElement('user-input');
const startButton = utils.getElement('start-button');
const stopButton = utils.getElement('stop-button');
const scoreButton = utils.getElement('leader-board');
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
let playerHits = 0;
let playerPercentage = 0;

// Define the Score class
class Score {
  constructor(hits, percentage) {
    this.hits = hits;
    this.percentage = percentage;
  }

  getHits() {
    return `${this.hits}`;
  }

  getPercentage() {
    return `${this.percentage}`;
  }
}

// Retrieve scores from local storage
let scoresArray = JSON.parse(localStorage.getItem('scores')) || [];

// Function to create ul and li elements from scores
function createScoreList(scores) {
  const ul = document.createElement('ul');
  scores.forEach((score, index) => {
    const li = document.createElement('li');
    li.classList.add('flex');
    li.innerHTML = `
      <p>${index + 1}</p>
      <p>${score.hits}</p>
      <p>${score.percentage}</p>
    `;
    ul.appendChild(li);
  });

  return ul.outerHTML; // Return the outerHTML of the ul
}

// Initialize scores
const scores = scoresArray.map(score => new Score(score.hits, score.percentage));

// Create HTML elements and set innerHTML of scoreOutput
const scoresListHTML = createScoreList(scores);
scoreOutput.innerHTML = scoresListHTML;
scoreOutput.classList.add('scores-list');


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
  //resetGame();
  gameEnded();
  stopTimer();
  createScoreList(scoresArray);
  //startbackgroundAudio();
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
  if (gotAMatch) {
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
  } else {
    gameEnded();
    displayedWord.textContent = 'You\'ve beat the game!';
  }
}

function updateScore() {
  currentScore.textContent++;
}

function updateHitsAndPercentage() {
  playerHits++;
  playerPercentage = ((playerHits / currentScore.textContent) * 100).toFixed(2);
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
  playerHits = 0; // Reset player hits
  playerPercentage = 0; // Reset player percentage
}

// Update scores array
function updateScores() {
  playerHits = playerHits;
  const scoreObj = { hits: playerHits, percentage: playerPercentage };
  scoresArray.push(scoreObj);
  scoresArray.sort((a, b) => b.hits - a.hits); // Sort scores by hits
  if (scoresArray.length > 9) {
    scoresArray.splice(9); // Keep only top 9 scores
  }
  localStorage.setItem('scores', JSON.stringify(scoresArray)); // Store scores in localStorage
}

// End Game

function gameEnded() {
  removeInputArea();
  if (sound) {
    sound.pause(); // Pause the sound if it's playing
    sound.currentTime = 0; // Reset playback to the beginning
    console.log(scoresArray);
  }
  updateScores(); // Call the function to update scores array and store in local storage
}

