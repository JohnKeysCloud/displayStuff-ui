/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/displayStuff.js":
/*!*****************************!*\
  !*** ./src/displayStuff.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   dsCreateDialogController: () => (/* binding */ dsCreateDialogController),
/* harmony export */   dsCreateLightboxController: () => (/* binding */ dsCreateLightboxController)
/* harmony export */ });
// 💭 Both Stuff
// 💭 --------------------------------------------------------------

function dsGetSelector(element) {
  return element.id ? "#".concat(element.id) : element.className ? ".".concat(element.className.split(' ').join('.')) : 'specified element';
}

// 💭 closeButtonStuff
// 💭 --------------------------------------------------------------

function initializeCloseButton(closeButton) {
  closeButton.setAttribute('aria-label', 'Close Dialog');
}
function examineCloseButton(closeButton, selector) {
  if (!closeButton) throw new Error("Close button not found for the modal element: ".concat(selector, "\u2026 Double check to ensure it has a class of '.ds-close-button'."));
  if (closeButton.tagName !== 'BUTTON') throw new Error("The close button for the modal element: ".concat(selector, " is not a button element."));
}

// 💭 modalStuff
// 💭 --------------------------------------------------------------

function toggleModalState(modalState) {
  if (!modalState) throw new Error("Invalid modal state object passed to toggleModalState function.");
  if (!modalState.closeButtonState) throw new Error("Invalid close button state object passed to toggleModalState function.");
  modalState.listenerAttached = !modalState.listenerAttached;
  modalState.closeButtonState.listenerAttached = !modalState.closeButtonState.listenerAttached;
}
function toggleModalAttributes(modalElement) {
  var modalOpen = modalElement.getAttribute('aria-hidden') === 'true';
  if (modalOpen) {
    modalElement.setAttribute('aria-hidden', 'false');
    modalElement.setAttribute('aria-modal', 'true');
  } else {
    modalElement.setAttribute('aria-hidden', 'true');
    modalElement.setAttribute('aria-modal', 'false');
  }
}
function initializeAsModal(modalElement) {
  modalElement.setAttribute('aria-modal', 'false');
  modalElement.setAttribute('aria-hidden', 'true');
}

// >>> exports
// > --------------------------------------------------------------

// 💭 dsCreateDialogController
// 💭 --------------------------------------------------------------

/**
 * Creates a controller object for managing a dialog element, providing methods to open and close the dialog.
 * This function initializes the dialog as a modal, sets up necessary accessibility attributes,
 * and ensures that the dialog can be properly managed through its lifecycle.
 *
 * Its intended use is to provide a simple way to manage the visibility of a dialog element.
 * It abstracts out the pesky animating in-and-out conundrum of modal elements with a CSS property, display of none (to block/flex/grid/etc.).
 * See readme for more information.
 * 
 * @param {HTMLElement} dialogElement - The HTML dialog element to initialize as a modal.
 * @returns {Object} An object containing methods to manage the dialog's visibility and state.
 * 
 * @throws {Error} If the provided argument is invalid.
 * @throws {Error} If the provided argument is not a valid HTML element.
 * @throws {Error} If the provided argument is not a valid HTML <dialog> element.
 * @throws {Error} If the dialog is already visible.
 * @throws {Error} If a listener is already attached to dialog.
 * @throws {Error} If a listener is already attached to dialog's close button.
 * 
 * @example
 * ? Assume 'myDialog' is a DOM element representing the dialog.
 * const dialogController = dsCreateDialogController(myDialog);
 * 
 * ? To open the dialog
 * dialogController.openDialog();
 * 
 * ? To close the dialog
 * dialogController.closeDialog();
 */

function dsCreateDialogController(dialogElement) {
  function examineArgumentOnCall(dialogElement) {
    if (!dialogElement) throw new Error("Invalid argument passed to dsCreateDialogController function.");
    if (!(dialogElement instanceof HTMLElement)) throw new Error("The provided argument is not a valid HTML element.");
    if (dialogElement.tagName !== 'DIALOG') throw new Error("The element you passed in is not a dialog element.");
  }

  // 🔴 checkPoint
  examineArgumentOnCall(dialogElement);
  // 🟢 clearedSuccessfully !

  initializeAsModal(dialogElement);
  var dialogSelector = dsGetSelector(dialogElement);
  var closeButton = dialogElement.querySelector('.ds-close-button');
  examineCloseButton(closeButton, dialogSelector);
  initializeCloseButton(closeButton);
  var dialogState = {
    listenerAttached: false,
    closeButtonState: {
      listenerAttached: false
    }
  };
  var sanitizeDialog = function sanitizeDialog() {
    dialogElement.classList.remove('closing');
    dialogElement.close();
    toggleModalAttributes(dialogElement);
    closeButton.removeEventListener('click', closeDialog);
    dialogElement.removeEventListener('animationend', sanitizeDialog);
    toggleModalState(dialogState);
  };
  var closeDialog = function closeDialog() {
    dialogElement.classList.add('closing');
    dialogElement.addEventListener('animationend', sanitizeDialog);
  };
  var inspectDialog = function inspectDialog() {
    if (dialogElement.open) throw new Error("The following dialog is already open: ".concat(dialogSelector, "."));
    if (dialogState.listenerAttached) throw new Error("A listener is already attached to this dialog element: ".concat(dialogSelector, "."));
    if (dialogState.closeButtonState.listenerAttached) throw new Error("A listener is already attached to the close button of the dialog element: ".concat(dialogSelector, "."));
  };
  var openDialog = function openDialog() {
    // 🔴 checkPoint
    inspectDialog();
    // 🟢 clearedSuccessfully !

    dialogElement.showModal();
    toggleModalAttributes(dialogElement);
    closeButton.addEventListener('click', closeDialog);
    toggleModalState(dialogState);
  };
  return {
    openDialog: openDialog,
    closeDialog: closeDialog
  };
}

// 💭 dsCreateLightboxController
// 💭 --------------------------------------------------------------

/**
 * Creates a controller object for managing any element with modal-like functionality, providing methods to 'open' and 'close' the lightbox.
 * This function initializes the lightbox as a modal, sets up necessary accessibility attributes,
 * and ensures that the lightbox can be properly managed through its lifecycle.
 * 
 * Its intended use is to provide a simple way to manage the visibility of a lightbox element.
 * It abstracts out the pesky animating in-and-out conundrum of modal-like elements with a CSS property, display of none (to block/flex/grid/etc.).
 * See readme for more information.
 *
 * @param {HTMLElement} lightboxElement - Any HTML container element (ie., <div>) to initialize as a modal.
 * @returns {Object} An object containing methods to manage the lightboxes's visibility and state.
 * 
 * @throws {Error} If the provided argument is invalid.
 * @throws {Error} If the provided argument is not a valid HTML element.
 * @throws {Error} If the lightbox is already visible.
 * @throws {Error} If a listener is already attached to lightbox.
 * @throws {Error} If a listener is already attached to lightbox's close button.
 * 
 * @example
 * ? Assume 'myLightbox' is a DOM element representing the dialog.
 * const lightBoxController = dsCreateLightboxController(myLightbox);
 * 
 * ? To open the lightbox
 * lightBoxController.openLightbox();
 * 
 * ? To close the lightbox
 * lightBoxController.closeLightbox();
 * 
 */

function dsCreateLightboxController(lightboxElement) {
  function examineArgumentOnCall() {
    if (!lightboxElement) throw new Error("Invalid argument passed to dsCreateDialogController function.");
    if (!(lightboxElement instanceof HTMLElement)) throw new Error("The provided argument is not a valid HTML element.");
  }

  // 🔴 checkPoint
  examineArgumentOnCall(); // ! checkPoint
  // 🟢 clearedSuccessfully !

  initializeAsModal(lightboxElement);
  var lightBoxSelector = dsGetSelector(lightboxElement);
  var closeButton = lightboxElement.querySelector('.ds-close-button');
  examineCloseButton(closeButton, lightBoxSelector);
  initializeCloseButton(closeButton);
  var lightboxState = {
    listenerAttached: false,
    closeButtonState: {
      listenerAttached: false
    }
  };
  var cleanLightBox = function cleanLightBox() {
    lightboxElement.classList.remove('closing');
    lightboxElement.classList.remove('visible');
    toggleModalAttributes(lightboxElement);
    closeButton.removeEventListener('click', closeLightbox);
    lightboxElement.removeEventListener('animationend', cleanLightBox);
    toggleModalState(lightboxState);
  };
  var closeLightbox = function closeLightbox() {
    lightboxElement.classList.add('closing');
    lightboxElement.addEventListener('animationend', cleanLightBox);
  };
  var inspectLightbox = function inspectLightbox() {
    if (lightboxElement.classList.contains('visible')) throw new Error("The following lightbox is already visible: ".concat(lightBoxSelector, "."));
    if (lightboxState.listenerAttached) throw new Error("A listener is already attached to the lightbox element: ".concat(lightBoxSelector, "."));
    if (lightboxState.closeButtonState.listenerAttached) throw new Error("A listener is already attached to the close button of the lightbox: ".concat(lightBoxSelector, "."));
  };
  var openLightbox = function openLightbox() {
    // 🔴 checkPoint
    inspectLightbox();
    // 🟢 clearedSuccessfully !

    lightboxElement.classList.add('visible');
    toggleModalAttributes(lightboxElement);
    closeButton.addEventListener('click', closeLightbox);
    toggleModalState(lightboxState);
  };
  return {
    openLightbox: openLightbox,
    closeLightbox: closeLightbox
  };
}

// 💭 --------------------------------------------------------------

// ? Fun fact: 
// ? Lightboxes are named after the lightbox that photographers use to view slides.
// ? They are also a fancier way to say 'modal' in this realm.

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _displayStuff__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./displayStuff */ "./src/displayStuff.js");

var content = document.getElementById('content');
content.appendChild(document.createTextNode('Hello, World!'));
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7O0FDTnNGO0FBRXRGLElBQU1JLE9BQU8sR0FBR0MsUUFBUSxDQUFDQyxjQUFjLENBQUMsU0FBUyxDQUFDO0FBRWxERixPQUFPLENBQUNHLFdBQVcsQ0FBQ0YsUUFBUSxDQUFDRyxjQUFjLENBQUMsZUFBZSxDQUFDLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL2Rpc3BsYXktc3R1ZmYtdWkvLi9zcmMvZGlzcGxheVN0dWZmLmpzIiwid2VicGFjazovL2Rpc3BsYXktc3R1ZmYtdWkvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZGlzcGxheS1zdHVmZi11aS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZGlzcGxheS1zdHVmZi11aS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2Rpc3BsYXktc3R1ZmYtdWkvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9kaXNwbGF5LXN0dWZmLXVpLy4vc3JjL2FwcC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyDwn5KtIEJvdGggU3R1ZmZcbi8vIPCfkq0gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gZHNHZXRTZWxlY3RvcihlbGVtZW50KSB7XG5cdHJldHVybiBlbGVtZW50LmlkID8gYCMke2VsZW1lbnQuaWR9YCA6IGVsZW1lbnQuY2xhc3NOYW1lID8gYC4ke2VsZW1lbnQuY2xhc3NOYW1lLnNwbGl0KCcgJykuam9pbignLicpfWAgOiAnc3BlY2lmaWVkIGVsZW1lbnQnO1xufVxuXG4vLyDwn5KtIGNsb3NlQnV0dG9uU3R1ZmZcbi8vIPCfkq0gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZUNsb3NlQnV0dG9uKGNsb3NlQnV0dG9uKSB7XG5cdGNsb3NlQnV0dG9uLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdDbG9zZSBEaWFsb2cnKTtcbn1cblxuZnVuY3Rpb24gZXhhbWluZUNsb3NlQnV0dG9uKGNsb3NlQnV0dG9uLCBzZWxlY3Rvcikge1xuXHRpZiAoIWNsb3NlQnV0dG9uKSB0aHJvdyBuZXcgRXJyb3IoYENsb3NlIGJ1dHRvbiBub3QgZm91bmQgZm9yIHRoZSBtb2RhbCBlbGVtZW50OiAke3NlbGVjdG9yfeKApiBEb3VibGUgY2hlY2sgdG8gZW5zdXJlIGl0IGhhcyBhIGNsYXNzIG9mICcuZHMtY2xvc2UtYnV0dG9uJy5gKTtcblx0aWYgKGNsb3NlQnV0dG9uLnRhZ05hbWUgIT09ICdCVVRUT04nKSB0aHJvdyBuZXcgRXJyb3IoYFRoZSBjbG9zZSBidXR0b24gZm9yIHRoZSBtb2RhbCBlbGVtZW50OiAke3NlbGVjdG9yfSBpcyBub3QgYSBidXR0b24gZWxlbWVudC5gKTtcbn1cblxuLy8g8J+SrSBtb2RhbFN0dWZmXG4vLyDwn5KtIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIHRvZ2dsZU1vZGFsU3RhdGUobW9kYWxTdGF0ZSkge1xuXHRpZiAoIW1vZGFsU3RhdGUpIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBtb2RhbCBzdGF0ZSBvYmplY3QgcGFzc2VkIHRvIHRvZ2dsZU1vZGFsU3RhdGUgZnVuY3Rpb24uYCk7XG5cdGlmICghbW9kYWxTdGF0ZS5jbG9zZUJ1dHRvblN0YXRlKSB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgY2xvc2UgYnV0dG9uIHN0YXRlIG9iamVjdCBwYXNzZWQgdG8gdG9nZ2xlTW9kYWxTdGF0ZSBmdW5jdGlvbi5gKTtcblxuXHRtb2RhbFN0YXRlLmxpc3RlbmVyQXR0YWNoZWQgPSAhbW9kYWxTdGF0ZS5saXN0ZW5lckF0dGFjaGVkO1xuXHRtb2RhbFN0YXRlLmNsb3NlQnV0dG9uU3RhdGUubGlzdGVuZXJBdHRhY2hlZCA9ICFtb2RhbFN0YXRlLmNsb3NlQnV0dG9uU3RhdGUubGlzdGVuZXJBdHRhY2hlZDtcbn1cblxuZnVuY3Rpb24gdG9nZ2xlTW9kYWxBdHRyaWJ1dGVzKG1vZGFsRWxlbWVudCkge1xuXHRjb25zdCBtb2RhbE9wZW4gPSBtb2RhbEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicpID09PSAndHJ1ZSc7XG5cblx0aWYgKG1vZGFsT3Blbikge1xuXHRcdG1vZGFsRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XG5cdFx0bW9kYWxFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1tb2RhbCcsICd0cnVlJyk7XG5cdH0gZWxzZSB7XG5cdFx0bW9kYWxFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuXHRcdG1vZGFsRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbW9kYWwnLCAnZmFsc2UnKTtcblx0fVxufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplQXNNb2RhbChtb2RhbEVsZW1lbnQpIHtcblx0bW9kYWxFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1tb2RhbCcsICdmYWxzZScpO1xuXHRtb2RhbEVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG59XG5cbi8vID4+PiBleHBvcnRzXG4vLyA+IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblxuLy8g8J+SrSBkc0NyZWF0ZURpYWxvZ0NvbnRyb2xsZXJcbi8vIPCfkq0gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBDcmVhdGVzIGEgY29udHJvbGxlciBvYmplY3QgZm9yIG1hbmFnaW5nIGEgZGlhbG9nIGVsZW1lbnQsIHByb3ZpZGluZyBtZXRob2RzIHRvIG9wZW4gYW5kIGNsb3NlIHRoZSBkaWFsb2cuXG4gKiBUaGlzIGZ1bmN0aW9uIGluaXRpYWxpemVzIHRoZSBkaWFsb2cgYXMgYSBtb2RhbCwgc2V0cyB1cCBuZWNlc3NhcnkgYWNjZXNzaWJpbGl0eSBhdHRyaWJ1dGVzLFxuICogYW5kIGVuc3VyZXMgdGhhdCB0aGUgZGlhbG9nIGNhbiBiZSBwcm9wZXJseSBtYW5hZ2VkIHRocm91Z2ggaXRzIGxpZmVjeWNsZS5cbiAqXG4gKiBJdHMgaW50ZW5kZWQgdXNlIGlzIHRvIHByb3ZpZGUgYSBzaW1wbGUgd2F5IHRvIG1hbmFnZSB0aGUgdmlzaWJpbGl0eSBvZiBhIGRpYWxvZyBlbGVtZW50LlxuICogSXQgYWJzdHJhY3RzIG91dCB0aGUgcGVza3kgYW5pbWF0aW5nIGluLWFuZC1vdXQgY29udW5kcnVtIG9mIG1vZGFsIGVsZW1lbnRzIHdpdGggYSBDU1MgcHJvcGVydHksIGRpc3BsYXkgb2Ygbm9uZSAodG8gYmxvY2svZmxleC9ncmlkL2V0Yy4pLlxuICogU2VlIHJlYWRtZSBmb3IgbW9yZSBpbmZvcm1hdGlvbi5cbiAqIFxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZGlhbG9nRWxlbWVudCAtIFRoZSBIVE1MIGRpYWxvZyBlbGVtZW50IHRvIGluaXRpYWxpemUgYXMgYSBtb2RhbC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IEFuIG9iamVjdCBjb250YWluaW5nIG1ldGhvZHMgdG8gbWFuYWdlIHRoZSBkaWFsb2cncyB2aXNpYmlsaXR5IGFuZCBzdGF0ZS5cbiAqIFxuICogQHRocm93cyB7RXJyb3J9IElmIHRoZSBwcm92aWRlZCBhcmd1bWVudCBpcyBpbnZhbGlkLlxuICogQHRocm93cyB7RXJyb3J9IElmIHRoZSBwcm92aWRlZCBhcmd1bWVudCBpcyBub3QgYSB2YWxpZCBIVE1MIGVsZW1lbnQuXG4gKiBAdGhyb3dzIHtFcnJvcn0gSWYgdGhlIHByb3ZpZGVkIGFyZ3VtZW50IGlzIG5vdCBhIHZhbGlkIEhUTUwgPGRpYWxvZz4gZWxlbWVudC5cbiAqIEB0aHJvd3Mge0Vycm9yfSBJZiB0aGUgZGlhbG9nIGlzIGFscmVhZHkgdmlzaWJsZS5cbiAqIEB0aHJvd3Mge0Vycm9yfSBJZiBhIGxpc3RlbmVyIGlzIGFscmVhZHkgYXR0YWNoZWQgdG8gZGlhbG9nLlxuICogQHRocm93cyB7RXJyb3J9IElmIGEgbGlzdGVuZXIgaXMgYWxyZWFkeSBhdHRhY2hlZCB0byBkaWFsb2cncyBjbG9zZSBidXR0b24uXG4gKiBcbiAqIEBleGFtcGxlXG4gKiA/IEFzc3VtZSAnbXlEaWFsb2cnIGlzIGEgRE9NIGVsZW1lbnQgcmVwcmVzZW50aW5nIHRoZSBkaWFsb2cuXG4gKiBjb25zdCBkaWFsb2dDb250cm9sbGVyID0gZHNDcmVhdGVEaWFsb2dDb250cm9sbGVyKG15RGlhbG9nKTtcbiAqIFxuICogPyBUbyBvcGVuIHRoZSBkaWFsb2dcbiAqIGRpYWxvZ0NvbnRyb2xsZXIub3BlbkRpYWxvZygpO1xuICogXG4gKiA/IFRvIGNsb3NlIHRoZSBkaWFsb2dcbiAqIGRpYWxvZ0NvbnRyb2xsZXIuY2xvc2VEaWFsb2coKTtcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gZHNDcmVhdGVEaWFsb2dDb250cm9sbGVyKGRpYWxvZ0VsZW1lbnQpIHtcblxuXHRmdW5jdGlvbiBleGFtaW5lQXJndW1lbnRPbkNhbGwoZGlhbG9nRWxlbWVudCkge1xuXHRcdGlmICghZGlhbG9nRWxlbWVudCkgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGFyZ3VtZW50IHBhc3NlZCB0byBkc0NyZWF0ZURpYWxvZ0NvbnRyb2xsZXIgZnVuY3Rpb24uYCk7XG5cdFx0aWYgKCEoZGlhbG9nRWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSkgdGhyb3cgbmV3IEVycm9yKGBUaGUgcHJvdmlkZWQgYXJndW1lbnQgaXMgbm90IGEgdmFsaWQgSFRNTCBlbGVtZW50LmApO1xuXHRcdGlmIChkaWFsb2dFbGVtZW50LnRhZ05hbWUgIT09ICdESUFMT0cnKSB0aHJvdyBuZXcgRXJyb3IoYFRoZSBlbGVtZW50IHlvdSBwYXNzZWQgaW4gaXMgbm90IGEgZGlhbG9nIGVsZW1lbnQuYCk7XG5cdH1cblxuXHQvLyDwn5S0IGNoZWNrUG9pbnRcblx0ZXhhbWluZUFyZ3VtZW50T25DYWxsKGRpYWxvZ0VsZW1lbnQpOyBcblx0Ly8g8J+foiBjbGVhcmVkU3VjY2Vzc2Z1bGx5ICFcblxuXHRpbml0aWFsaXplQXNNb2RhbChkaWFsb2dFbGVtZW50KTsgXG5cblx0Y29uc3QgZGlhbG9nU2VsZWN0b3IgPSBkc0dldFNlbGVjdG9yKGRpYWxvZ0VsZW1lbnQpO1xuXHRjb25zdCBjbG9zZUJ1dHRvbiA9IGRpYWxvZ0VsZW1lbnQucXVlcnlTZWxlY3RvcignLmRzLWNsb3NlLWJ1dHRvbicpO1xuXG5cdGV4YW1pbmVDbG9zZUJ1dHRvbihjbG9zZUJ1dHRvbiwgZGlhbG9nU2VsZWN0b3IpO1xuXHRpbml0aWFsaXplQ2xvc2VCdXR0b24oY2xvc2VCdXR0b24pO1xuXG5cdGxldCBkaWFsb2dTdGF0ZSA9IHtcblx0XHRsaXN0ZW5lckF0dGFjaGVkOiBmYWxzZSxcblx0XHRjbG9zZUJ1dHRvblN0YXRlOiB7XG5cdFx0XHRsaXN0ZW5lckF0dGFjaGVkOiBmYWxzZSxcblx0XHR9XG5cdH07XG5cblx0Y29uc3Qgc2FuaXRpemVEaWFsb2cgPSAoKSA9PiB7XG5cdFx0ZGlhbG9nRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdjbG9zaW5nJyk7XG5cdFx0ZGlhbG9nRWxlbWVudC5jbG9zZSgpO1xuXG5cdFx0dG9nZ2xlTW9kYWxBdHRyaWJ1dGVzKGRpYWxvZ0VsZW1lbnQpO1xuXG5cdFx0Y2xvc2VCdXR0b24ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZURpYWxvZyk7XG5cdFx0ZGlhbG9nRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdhbmltYXRpb25lbmQnLCBzYW5pdGl6ZURpYWxvZyk7XG5cblx0XHR0b2dnbGVNb2RhbFN0YXRlKGRpYWxvZ1N0YXRlKTtcblx0fVxuXG5cdGNvbnN0IGNsb3NlRGlhbG9nID0gKCkgPT4ge1xuXHRcdGRpYWxvZ0VsZW1lbnQuY2xhc3NMaXN0LmFkZCgnY2xvc2luZycpO1xuXHRcdGRpYWxvZ0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYW5pbWF0aW9uZW5kJywgc2FuaXRpemVEaWFsb2cpO1xuXHR9XG5cblx0Y29uc3QgaW5zcGVjdERpYWxvZyA9ICgpID0+IHtcblx0XHRpZiAoZGlhbG9nRWxlbWVudC5vcGVuKSB0aHJvdyBuZXcgRXJyb3IoYFRoZSBmb2xsb3dpbmcgZGlhbG9nIGlzIGFscmVhZHkgb3BlbjogJHtkaWFsb2dTZWxlY3Rvcn0uYCk7XG5cdFx0aWYgKGRpYWxvZ1N0YXRlLmxpc3RlbmVyQXR0YWNoZWQpIHRocm93IG5ldyBFcnJvcihgQSBsaXN0ZW5lciBpcyBhbHJlYWR5IGF0dGFjaGVkIHRvIHRoaXMgZGlhbG9nIGVsZW1lbnQ6ICR7ZGlhbG9nU2VsZWN0b3J9LmApO1xuXHRcdGlmIChkaWFsb2dTdGF0ZS5jbG9zZUJ1dHRvblN0YXRlLmxpc3RlbmVyQXR0YWNoZWQpIHRocm93IG5ldyBFcnJvcihgQSBsaXN0ZW5lciBpcyBhbHJlYWR5IGF0dGFjaGVkIHRvIHRoZSBjbG9zZSBidXR0b24gb2YgdGhlIGRpYWxvZyBlbGVtZW50OiAke2RpYWxvZ1NlbGVjdG9yfS5gKTtcblx0fVxuXG5cdGNvbnN0IG9wZW5EaWFsb2cgPSAoKSA9PiB7XG5cdFx0Ly8g8J+UtCBjaGVja1BvaW50XG5cdFx0aW5zcGVjdERpYWxvZygpOyBcblx0XHQvLyDwn5+iIGNsZWFyZWRTdWNjZXNzZnVsbHkgIVxuXG5cdFx0ZGlhbG9nRWxlbWVudC5zaG93TW9kYWwoKTtcblx0XG5cdFx0dG9nZ2xlTW9kYWxBdHRyaWJ1dGVzKGRpYWxvZ0VsZW1lbnQpO1xuXHRcdGNsb3NlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VEaWFsb2cpO1xuXG5cdFx0dG9nZ2xlTW9kYWxTdGF0ZShkaWFsb2dTdGF0ZSk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdG9wZW5EaWFsb2csXG5cdFx0Y2xvc2VEaWFsb2dcblx0fVxufVxuXG4vLyDwn5KtIGRzQ3JlYXRlTGlnaHRib3hDb250cm9sbGVyXG4vLyDwn5KtIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogQ3JlYXRlcyBhIGNvbnRyb2xsZXIgb2JqZWN0IGZvciBtYW5hZ2luZyBhbnkgZWxlbWVudCB3aXRoIG1vZGFsLWxpa2UgZnVuY3Rpb25hbGl0eSwgcHJvdmlkaW5nIG1ldGhvZHMgdG8gJ29wZW4nIGFuZCAnY2xvc2UnIHRoZSBsaWdodGJveC5cbiAqIFRoaXMgZnVuY3Rpb24gaW5pdGlhbGl6ZXMgdGhlIGxpZ2h0Ym94IGFzIGEgbW9kYWwsIHNldHMgdXAgbmVjZXNzYXJ5IGFjY2Vzc2liaWxpdHkgYXR0cmlidXRlcyxcbiAqIGFuZCBlbnN1cmVzIHRoYXQgdGhlIGxpZ2h0Ym94IGNhbiBiZSBwcm9wZXJseSBtYW5hZ2VkIHRocm91Z2ggaXRzIGxpZmVjeWNsZS5cbiAqIFxuICogSXRzIGludGVuZGVkIHVzZSBpcyB0byBwcm92aWRlIGEgc2ltcGxlIHdheSB0byBtYW5hZ2UgdGhlIHZpc2liaWxpdHkgb2YgYSBsaWdodGJveCBlbGVtZW50LlxuICogSXQgYWJzdHJhY3RzIG91dCB0aGUgcGVza3kgYW5pbWF0aW5nIGluLWFuZC1vdXQgY29udW5kcnVtIG9mIG1vZGFsLWxpa2UgZWxlbWVudHMgd2l0aCBhIENTUyBwcm9wZXJ0eSwgZGlzcGxheSBvZiBub25lICh0byBibG9jay9mbGV4L2dyaWQvZXRjLikuXG4gKiBTZWUgcmVhZG1lIGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGxpZ2h0Ym94RWxlbWVudCAtIEFueSBIVE1MIGNvbnRhaW5lciBlbGVtZW50IChpZS4sIDxkaXY+KSB0byBpbml0aWFsaXplIGFzIGEgbW9kYWwuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBBbiBvYmplY3QgY29udGFpbmluZyBtZXRob2RzIHRvIG1hbmFnZSB0aGUgbGlnaHRib3hlcydzIHZpc2liaWxpdHkgYW5kIHN0YXRlLlxuICogXG4gKiBAdGhyb3dzIHtFcnJvcn0gSWYgdGhlIHByb3ZpZGVkIGFyZ3VtZW50IGlzIGludmFsaWQuXG4gKiBAdGhyb3dzIHtFcnJvcn0gSWYgdGhlIHByb3ZpZGVkIGFyZ3VtZW50IGlzIG5vdCBhIHZhbGlkIEhUTUwgZWxlbWVudC5cbiAqIEB0aHJvd3Mge0Vycm9yfSBJZiB0aGUgbGlnaHRib3ggaXMgYWxyZWFkeSB2aXNpYmxlLlxuICogQHRocm93cyB7RXJyb3J9IElmIGEgbGlzdGVuZXIgaXMgYWxyZWFkeSBhdHRhY2hlZCB0byBsaWdodGJveC5cbiAqIEB0aHJvd3Mge0Vycm9yfSBJZiBhIGxpc3RlbmVyIGlzIGFscmVhZHkgYXR0YWNoZWQgdG8gbGlnaHRib3gncyBjbG9zZSBidXR0b24uXG4gKiBcbiAqIEBleGFtcGxlXG4gKiA/IEFzc3VtZSAnbXlMaWdodGJveCcgaXMgYSBET00gZWxlbWVudCByZXByZXNlbnRpbmcgdGhlIGRpYWxvZy5cbiAqIGNvbnN0IGxpZ2h0Qm94Q29udHJvbGxlciA9IGRzQ3JlYXRlTGlnaHRib3hDb250cm9sbGVyKG15TGlnaHRib3gpO1xuICogXG4gKiA/IFRvIG9wZW4gdGhlIGxpZ2h0Ym94XG4gKiBsaWdodEJveENvbnRyb2xsZXIub3BlbkxpZ2h0Ym94KCk7XG4gKiBcbiAqID8gVG8gY2xvc2UgdGhlIGxpZ2h0Ym94XG4gKiBsaWdodEJveENvbnRyb2xsZXIuY2xvc2VMaWdodGJveCgpO1xuICogXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGRzQ3JlYXRlTGlnaHRib3hDb250cm9sbGVyKGxpZ2h0Ym94RWxlbWVudCkge1xuXG5cdGZ1bmN0aW9uIGV4YW1pbmVBcmd1bWVudE9uQ2FsbCgpIHtcblx0XHRpZiAoIWxpZ2h0Ym94RWxlbWVudCkgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGFyZ3VtZW50IHBhc3NlZCB0byBkc0NyZWF0ZURpYWxvZ0NvbnRyb2xsZXIgZnVuY3Rpb24uYCk7XG5cdFx0aWYgKCEobGlnaHRib3hFbGVtZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpKSB0aHJvdyBuZXcgRXJyb3IoYFRoZSBwcm92aWRlZCBhcmd1bWVudCBpcyBub3QgYSB2YWxpZCBIVE1MIGVsZW1lbnQuYCk7XG5cdH1cblxuXHQvLyDwn5S0IGNoZWNrUG9pbnRcblx0ZXhhbWluZUFyZ3VtZW50T25DYWxsKCk7IC8vICEgY2hlY2tQb2ludFxuXHQvLyDwn5+iIGNsZWFyZWRTdWNjZXNzZnVsbHkgIVxuXG5cdGluaXRpYWxpemVBc01vZGFsKGxpZ2h0Ym94RWxlbWVudCk7XG5cblx0Y29uc3QgbGlnaHRCb3hTZWxlY3RvciA9IGRzR2V0U2VsZWN0b3IobGlnaHRib3hFbGVtZW50KTtcblx0Y29uc3QgY2xvc2VCdXR0b24gPSBsaWdodGJveEVsZW1lbnQucXVlcnlTZWxlY3RvcignLmRzLWNsb3NlLWJ1dHRvbicpO1xuXG5cdGV4YW1pbmVDbG9zZUJ1dHRvbihjbG9zZUJ1dHRvbiwgbGlnaHRCb3hTZWxlY3Rvcik7XG5cdGluaXRpYWxpemVDbG9zZUJ1dHRvbihjbG9zZUJ1dHRvbik7XG5cblx0bGV0IGxpZ2h0Ym94U3RhdGUgPSB7XG5cdFx0bGlzdGVuZXJBdHRhY2hlZDogZmFsc2UsXG5cdFx0Y2xvc2VCdXR0b25TdGF0ZToge1xuXHRcdFx0bGlzdGVuZXJBdHRhY2hlZDogZmFsc2UsXG5cdFx0fVxuXHR9O1xuXG5cdGNvbnN0IGNsZWFuTGlnaHRCb3ggPSAoKSA9PiB7XG5cdFx0bGlnaHRib3hFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2Nsb3NpbmcnKTtcblx0XHRsaWdodGJveEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZScpO1xuXG5cdFx0dG9nZ2xlTW9kYWxBdHRyaWJ1dGVzKGxpZ2h0Ym94RWxlbWVudCk7XG5cdFx0XG5cdFx0Y2xvc2VCdXR0b24ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZUxpZ2h0Ym94KTtcblx0XHRsaWdodGJveEVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignYW5pbWF0aW9uZW5kJywgY2xlYW5MaWdodEJveCk7XG5cblx0XHR0b2dnbGVNb2RhbFN0YXRlKGxpZ2h0Ym94U3RhdGUpO1xuXHR9XG5cblx0Y29uc3QgY2xvc2VMaWdodGJveCA9ICgpID0+IHtcblx0XHRsaWdodGJveEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnY2xvc2luZycpO1xuXHRcdGxpZ2h0Ym94RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdhbmltYXRpb25lbmQnLCBjbGVhbkxpZ2h0Qm94KTtcblx0fVxuXG5cdGNvbnN0IGluc3BlY3RMaWdodGJveCA9ICgpID0+IHtcblx0XHRpZiAobGlnaHRib3hFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygndmlzaWJsZScpKSB0aHJvdyBuZXcgRXJyb3IoYFRoZSBmb2xsb3dpbmcgbGlnaHRib3ggaXMgYWxyZWFkeSB2aXNpYmxlOiAke2xpZ2h0Qm94U2VsZWN0b3J9LmApO1xuXHRcdGlmIChsaWdodGJveFN0YXRlLmxpc3RlbmVyQXR0YWNoZWQpIHRocm93IG5ldyBFcnJvcihgQSBsaXN0ZW5lciBpcyBhbHJlYWR5IGF0dGFjaGVkIHRvIHRoZSBsaWdodGJveCBlbGVtZW50OiAke2xpZ2h0Qm94U2VsZWN0b3J9LmApO1xuXHRcdGlmIChsaWdodGJveFN0YXRlLmNsb3NlQnV0dG9uU3RhdGUubGlzdGVuZXJBdHRhY2hlZCkgdGhyb3cgbmV3IEVycm9yKGBBIGxpc3RlbmVyIGlzIGFscmVhZHkgYXR0YWNoZWQgdG8gdGhlIGNsb3NlIGJ1dHRvbiBvZiB0aGUgbGlnaHRib3g6ICR7bGlnaHRCb3hTZWxlY3Rvcn0uYCk7XG5cdH1cblxuXHRjb25zdCBvcGVuTGlnaHRib3ggPSAoKSA9PiB7XG5cdFx0Ly8g8J+UtCBjaGVja1BvaW50XG5cdFx0aW5zcGVjdExpZ2h0Ym94KCk7XG5cdFx0Ly8g8J+foiBjbGVhcmVkU3VjY2Vzc2Z1bGx5ICFcblx0XHRcblx0XHRsaWdodGJveEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpO1xuXG5cdFx0dG9nZ2xlTW9kYWxBdHRyaWJ1dGVzKGxpZ2h0Ym94RWxlbWVudCk7XG5cdFx0Y2xvc2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZUxpZ2h0Ym94KTtcblxuXHRcdHRvZ2dsZU1vZGFsU3RhdGUobGlnaHRib3hTdGF0ZSk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdG9wZW5MaWdodGJveCxcblx0XHRjbG9zZUxpZ2h0Ym94XG5cdH1cbn1cblxuLy8g8J+SrSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyA/IEZ1biBmYWN0OiBcbi8vID8gTGlnaHRib3hlcyBhcmUgbmFtZWQgYWZ0ZXIgdGhlIGxpZ2h0Ym94IHRoYXQgcGhvdG9ncmFwaGVycyB1c2UgdG8gdmlldyBzbGlkZXMuXG4vLyA/IFRoZXkgYXJlIGFsc28gYSBmYW5jaWVyIHdheSB0byBzYXkgJ21vZGFsJyBpbiB0aGlzIHJlYWxtLlxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBkc0NyZWF0ZURpYWxvZ0NvbnRyb2xsZXIsIGRzQ3JlYXRlTGlnaHRib3hDb250cm9sbGVyIH0gZnJvbSBcIi4vZGlzcGxheVN0dWZmXCI7XG5cbmNvbnN0IGNvbnRlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudCcpO1xuXG5jb250ZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdIZWxsbywgV29ybGQhJykpOyJdLCJuYW1lcyI6WyJkc0dldFNlbGVjdG9yIiwiZWxlbWVudCIsImlkIiwiY29uY2F0IiwiY2xhc3NOYW1lIiwic3BsaXQiLCJqb2luIiwiaW5pdGlhbGl6ZUNsb3NlQnV0dG9uIiwiY2xvc2VCdXR0b24iLCJzZXRBdHRyaWJ1dGUiLCJleGFtaW5lQ2xvc2VCdXR0b24iLCJzZWxlY3RvciIsIkVycm9yIiwidGFnTmFtZSIsInRvZ2dsZU1vZGFsU3RhdGUiLCJtb2RhbFN0YXRlIiwiY2xvc2VCdXR0b25TdGF0ZSIsImxpc3RlbmVyQXR0YWNoZWQiLCJ0b2dnbGVNb2RhbEF0dHJpYnV0ZXMiLCJtb2RhbEVsZW1lbnQiLCJtb2RhbE9wZW4iLCJnZXRBdHRyaWJ1dGUiLCJpbml0aWFsaXplQXNNb2RhbCIsImRzQ3JlYXRlRGlhbG9nQ29udHJvbGxlciIsImRpYWxvZ0VsZW1lbnQiLCJleGFtaW5lQXJndW1lbnRPbkNhbGwiLCJIVE1MRWxlbWVudCIsImRpYWxvZ1NlbGVjdG9yIiwicXVlcnlTZWxlY3RvciIsImRpYWxvZ1N0YXRlIiwic2FuaXRpemVEaWFsb2ciLCJjbGFzc0xpc3QiLCJyZW1vdmUiLCJjbG9zZSIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJjbG9zZURpYWxvZyIsImFkZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJpbnNwZWN0RGlhbG9nIiwib3BlbiIsIm9wZW5EaWFsb2ciLCJzaG93TW9kYWwiLCJkc0NyZWF0ZUxpZ2h0Ym94Q29udHJvbGxlciIsImxpZ2h0Ym94RWxlbWVudCIsImxpZ2h0Qm94U2VsZWN0b3IiLCJsaWdodGJveFN0YXRlIiwiY2xlYW5MaWdodEJveCIsImNsb3NlTGlnaHRib3giLCJpbnNwZWN0TGlnaHRib3giLCJjb250YWlucyIsIm9wZW5MaWdodGJveCIsImNvbnRlbnQiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiYXBwZW5kQ2hpbGQiLCJjcmVhdGVUZXh0Tm9kZSJdLCJzb3VyY2VSb290IjoiIn0=