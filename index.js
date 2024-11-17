import { cardsArray } from "./data.js";

const repeat = 2;

function main() {
  const movesElement = document.querySelector("#moves");
  const scoreElement = document.querySelector("#score");
  const gameContainer = document.querySelector("#game-container");

  let isInteractionEnabled = true;
  let matchedPairsCount = 0;
  let moveCount = 0;
  let flippedCards = [];
  const imageUrl = "https://taniarascia.github.io/memory/";
  const hiddenCardImage = "img/question.gif";

  function updateStats(element, label, value) {
    element.textContent = `${label}: ${value}`;
  }

  function generateCardElement(cardData) {
    const cardElement = document.createElement("div");
    cardElement.className = `w-[10rem] h-[10rem] bg-[url('${
      imageUrl + hiddenCardImage
    }')] bg-contain bg-no-repeat bg-center cursor-pointer`;
    cardElement.dataset.name = cardData.name;
    cardElement.dataset.image = cardData.img;
    return cardElement;
  }

  function createGameGrid(cards, container) {
    const gridContainer = document.createElement("div");
    gridContainer.className =
      "grid grid-cols-4 gap-y-10 place-items-center bg-blue-50 py-5";
    container.appendChild(gridContainer);

    cards.forEach((cardData, index) => {
      const cardElement = generateCardElement(cardData);
      cardElement.dataset.id = index;
      gridContainer.appendChild(cardElement);
    });

    gridContainer.addEventListener("click", handleCardFlip);
    return gridContainer;
  }

  function showCard(cardElement) {
    const cardImage = cardElement.dataset.image;
    cardElement.classList.remove(`bg-[url('${imageUrl + hiddenCardImage}')]`);
    cardElement.classList.add(`bg-[url('${imageUrl + cardImage}')]`);
    cardElement.classList.add("pointer-events-none");
  }

  function concealCard(cardElement) {
    const cardImage = cardElement.dataset.image;
    cardElement.classList.remove(`bg-[url('${imageUrl + cardImage}')]`);
    cardElement.classList.add(`bg-[url('${imageUrl + hiddenCardImage}')]`);
    cardElement.classList.remove("pointer-events-none");
  }

  function handleCardFlip(event) {
    const cardElement = event.target;
    if (!cardElement.dataset.name || !isInteractionEnabled) return;

    showCard(cardElement);
    flippedCards.push(cardElement);

    if (flippedCards.length === repeat) {
      isInteractionEnabled = false;
      setTimeout(evaluateFlippedCards, 1000);
    }
  }

  function evaluateFlippedCards() {
    const isMatch = flippedCards.every(
      (card) => card.dataset.name === flippedCards[0].dataset.name
    );

    if (isMatch) {
      matchedPairsCount++;
      updateStats(scoreElement, "Score", matchedPairsCount);
    } else {
      flippedCards.forEach(concealCard);
    }

    moveCount++;
    updateStats(movesElement, "Moves", moveCount);
    flippedCards = [];
    isInteractionEnabled = true;
  }

  function randomizeArray(array) {
    return array
      .map((item) => ({ ...item, randomKey: Math.random() }))
      .sort((a, b) => a.randomKey - b.randomKey)
      .map(({ randomKey, ...item }) => item);
  }

  function duplicateCards(array, times) {
    const duplicated = [];
    for (let i = 0; i < times; i++) {
      array.forEach((item) => duplicated.push(item));
    }
    return duplicated;
  }

  function initializeGame() {
    const duplicatedCards = duplicateCards(cardsArray, repeat);
    const shuffledCards = randomizeArray(duplicatedCards);

    updateStats(movesElement, "Moves", moveCount);
    updateStats(scoreElement, "Score", matchedPairsCount);

    createGameGrid(shuffledCards, gameContainer);
  }

  initializeGame();
}

document.addEventListener("DOMContentLoaded", main);
