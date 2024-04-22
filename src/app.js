import { dsCreateDialogController } from "./displayStuff";

import { initializeModalContent, addModalListeners } from './fluff'; 
import './sass/main.scss';

function initApp() {
  initializeModalContent();
  window.addEventListener('load', addModalListeners);
};

initApp();

// 💭 --------------------------------------------------------------
// 💭 --------------------------------------------------------------
// 💭 --------------------------------------------------------------

// ? displayStuff.js
// ? <dialog> demo:

const dialog = document.querySelector('dialog');
const dialogController = dsCreateDialogController(dialog);

const openModalButton = document.querySelector('#open-modal-button');

openModalButton.addEventListener('click', () => {
  dialogController.openDialog();
});