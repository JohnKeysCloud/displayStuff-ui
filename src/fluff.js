import { createSplitTextFragment } from "./split-text";

// 💭 --------------------------------------------------------------

function randomizeCharacterLocations(nonWhitespaceCharacters) {
  nonWhitespaceCharacters.forEach(character => {
    const randomNumber = Math.random();

    if (randomNumber >= 0 && randomNumber < 0.25) {
      character.style.transform = `translate(${Math.floor(Math.random() * 333)}px, ${Math.floor(Math.random() * 333)}px)`;
    } else if (randomNumber >= 0.25 && randomNumber < 0.5) {
      character.style.transform = `translate(${Math.floor(Math.random() * -333)}px, ${Math.floor(Math.random() * -333)}px)`;
    } else if (randomNumber >= 0.5 && randomNumber < 0.75) {
      character.style.transform = `translate(${Math.floor(Math.random() * 333)}px, ${Math.floor(Math.random() * -333)}px)`;
    } else { // ? randomNumber <= 0.25
      character.style.transform = `translate(${Math.floor(Math.random() * -333)}px, ${Math.floor(Math.random() * 333)}px)`;
    }
  });
}

export function addModalListeners() {
  const addListenerForModalOpen = (nonWhitespaceCharacters) => {
    const openModalButton = document.querySelector('#open-modal-button');

    openModalButton.addEventListener('click', () => {
      nonWhitespaceCharacters.forEach(nonWhitespaceCharacter => nonWhitespaceCharacter.style.transform = 'translate(0, 0)');
    });
  };

  const addListenerForModalClose = (nonWhitespaceCharacters) => {
    const closeModalButton = document.querySelector('.ds-close-button');

    closeModalButton.addEventListener('click', () => {
      randomizeCharacterLocations(nonWhitespaceCharacters);
    });
  }

  const nonWhitespaceCharacters = document.querySelectorAll('.character.non-whitespace');
  addListenerForModalOpen(nonWhitespaceCharacters);
  addListenerForModalClose(nonWhitespaceCharacters);
}

export function initializeModalContent() {
  const getSplitElementFragment = (elementToSplit, elementToAppendFragment, identifierForEachSplitElement) => {
    elementToAppendFragment.appendChild(createSplitTextFragment(elementToSplit, identifierForEachSplitElement));

    return elementToAppendFragment;
  };

  const identifyNonWhitespaceCharacters = (splitText) => {
    const nonWhitespaceCharacters = [];

    for (let i = 0; i < splitText.children.length; i++) {
      const child = splitText.children[i];
      if (child.textContent.trim() !== '') nonWhitespaceCharacters.push(child);
    }

    nonWhitespaceCharacters.forEach(character => character.classList.add('non-whitespace'));

    return nonWhitespaceCharacters;
  };

  const replaceElement = (container, newElement, oldElement) => {
    container.replaceChild(newElement, oldElement);
  }

  const preContainer = document.querySelector('#c-container');
  const pre = preContainer.querySelector('pre');

  const newPre = getSplitElementFragment(pre, document.createElement('pre'), 'character');
  replaceElement(preContainer, newPre, pre);

  randomizeCharacterLocations(identifyNonWhitespaceCharacters(newPre));
}