import { cardsArray } from "./data.js";

let repeat = 2;

function main() {
  const moves = document.querySelector("#moves");
  const score = document.querySelector("#score");

  let canClick = true;
  let numberOfMatch = 0;
  let numberOfMove = 0;
  let cardMatch = [];
  let imageUrl = "https://taniarascia.github.io/memory/";
  let bgImage = "img/question.gif";

  const game = document.querySelector("#game-container");
  const grid = document.createElement("div");
  grid.className =
    "grid grid-cols-4 gap-y-10 place-items-center  bg-blue-50 py-5";
  game.appendChild(grid);

  function updateData(element, data) {
    let content = element.textContent.split(":");
    content[1] = data;
    element.textContent = content.join(": ");
  }

  function createCard(data) {
    const card = document.createElement("div");
    card.className = `w-[10rem] h-[10rem] bg-[url('${
      imageUrl + bgImage
    }')] bg-contain bg-no-repeat bg-center`;
    card.setAttribute("data-name", data.name);
    card.setAttribute("data-image", data.img);
    return card;
  }

  function createGridUi(data, root) {
    data.forEach((element, index) => {
      const card = createCard(element);
      card.setAttribute("data-id", index);
      root.appendChild(card);
    });
  }

  function handleClick(event) {
    let target = event.target;
    if (!target.dataset.name || !canClick) {
      return;
    }

    const image = target.dataset.image;
    target.classList.remove(`bg-[url('${imageUrl + bgImage}')]`);
    target.classList.add(`bg-[url('${imageUrl + image}')]`);
    target.classList.add("pointer-events-none");
    cardMatch.push(target);

    if (cardMatch.length === repeat) {
      canClick = false;
      setTimeout(() => {
        const matches = cardMatch.every((card) => {
          return card.dataset.name === target.dataset.name;
        });
        if (matches) {
          numberOfMatch += 1;
          updateData(score, numberOfMatch);
        } else {
          cardMatch.forEach((card) => {
            const image = card.dataset.image;
            card.classList.remove(`bg-[url('${imageUrl + image}')]`);
            card.classList.add(`bg-[url('${imageUrl + bgImage}')]`);
            card.classList.remove("pointer-events-none");
          });
        }
        numberOfMove += 1;
        updateData(moves, numberOfMove);
        cardMatch = [];
        canClick = true;
      }, 1000);
    }
  }

  function shuffleArray(data) {
    for (let index = data.length - 1; index > 0; index--) {
      const shuffleIndex = Math.floor(Math.random() * (index + 1));
      [data[index], data[shuffleIndex]] = [data[shuffleIndex], data[index]];
    }
    return data;
  }

  grid.addEventListener("click", handleClick);

  function initializeGame(repeat) {
    let newData = [];
    for (let count = 0; count < repeat; count++) {
      newData = [...newData, ...shuffleArray(cardsArray)];
    }
    newData = shuffleArray(newData);

    updateData(moves, numberOfMove);
    updateData(score, numberOfMatch);
    createGridUi(newData, grid);
  }

  initializeGame(repeat);
}

document.addEventListener("DOMContentLoaded", main);
