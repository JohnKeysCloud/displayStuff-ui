export function createSplitTextFragment(element, id) {
  const getNonWhitespaceCharacters = (element) => {

    
  };

  const splitTextFragment = document.createDocumentFragment();
  const text = element.textContent;

  text.split('').forEach((character, index) => {
    const characterSpan = document.createElement('span');
    characterSpan.setAttribute('id', `${id}-${index + 1}`);
    characterSpan.classList.add('character');

    // Use a non-breaking space for spaces to ensure they are preserved
    characterSpan.textContent = character === ' ' ? '\u00A0' : character;

    splitTextFragment.appendChild(characterSpan);
  });

  return splitTextFragment;
}