// 💭 Both Stuff
// 💭 --------------------------------------------------------------

function dsGetSelector(element) {
	return element.id ? `#${element.id}` : element.className ? `.${element.className.split(' ').join('.')}` : 'specified element';
}

// 💭 closeButtonStuff
// 💭 --------------------------------------------------------------

function initializeCloseButton(closeButton) {
	closeButton.setAttribute('aria-label', 'Close Dialog');
}

function examineCloseButton(closeButton, selector) {
	if (!closeButton) throw new Error(`Close button not found for the modal element: ${selector}… Double check to ensure it has a class of '.ds-close-button'.`);
	if (closeButton.tagName !== 'BUTTON') throw new Error(`The close button for the modal element: ${selector} is not a button element.`);
}

// 💭 modalStuff
// 💭 --------------------------------------------------------------

function toggleModalState(modalState) {
	if (!modalState) throw new Error(`Invalid modal state object passed to toggleModalState function.`);
	if (!modalState.closeButtonState) throw new Error(`Invalid close button state object passed to toggleModalState function.`);

	modalState.listenerAttached = !modalState.listenerAttached;
	modalState.closeButtonState.listenerAttached = !modalState.closeButtonState.listenerAttached;
}

function toggleModalAttributes(modalElement) {
	const modalOpen = modalElement.getAttribute('aria-hidden') === 'true';

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

export function dsCreateDialogController(dialogElement) {

	function examineArgumentOnCall(dialogElement) {
		if (!dialogElement) throw new Error(`Invalid argument passed to dsCreateDialogController function.`);
		if (!(dialogElement instanceof HTMLElement)) throw new Error(`The provided argument is not a valid HTML element.`);
		if (dialogElement.tagName !== 'DIALOG') throw new Error(`The element you passed in is not a dialog element.`);
	}

	// 🔴 checkPoint
	examineArgumentOnCall(dialogElement); 
	// 🟢 clearedSuccessfully !

	initializeAsModal(dialogElement); 

	const dialogSelector = dsGetSelector(dialogElement);
	const closeButton = dialogElement.querySelector('.ds-close-button');

	examineCloseButton(closeButton, dialogSelector);
	initializeCloseButton(closeButton);

	let dialogState = {
		listenerAttached: false,
		closeButtonState: {
			listenerAttached: false,
		}
	};

	const sanitizeDialog = () => {
		dialogElement.classList.remove('closing');
		dialogElement.close();

		toggleModalAttributes(dialogElement);

		closeButton.removeEventListener('click', closeDialog);
		dialogElement.removeEventListener('animationend', sanitizeDialog);

		toggleModalState(dialogState);
	}

	const closeDialog = () => {
		dialogElement.classList.add('closing');
		dialogElement.addEventListener('animationend', sanitizeDialog);
	}

	const inspectDialog = () => {
		if (dialogElement.open) throw new Error(`The following dialog is already open: ${dialogSelector}.`);
		if (dialogState.listenerAttached) throw new Error(`A listener is already attached to this dialog element: ${dialogSelector}.`);
		if (dialogState.closeButtonState.listenerAttached) throw new Error(`A listener is already attached to the close button of the dialog element: ${dialogSelector}.`);
	}

	const openDialog = () => {
		// 🔴 checkPoint
		inspectDialog(); 
		// 🟢 clearedSuccessfully !

		dialogElement.showModal();
	
		toggleModalAttributes(dialogElement);
		closeButton.addEventListener('click', closeDialog);

		toggleModalState(dialogState);
	}

	return {
		openDialog,
		closeDialog
	}
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

export function dsCreateLightboxController(lightboxElement) {

	function examineArgumentOnCall() {
		if (!lightboxElement) throw new Error(`Invalid argument passed to dsCreateDialogController function.`);
		if (!(lightboxElement instanceof HTMLElement)) throw new Error(`The provided argument is not a valid HTML element.`);
	}

	// 🔴 checkPoint
	examineArgumentOnCall(); // ! checkPoint
	// 🟢 clearedSuccessfully !

	initializeAsModal(lightboxElement);

	const lightBoxSelector = dsGetSelector(lightboxElement);
	const closeButton = lightboxElement.querySelector('.ds-close-button');

	examineCloseButton(closeButton, lightBoxSelector);
	initializeCloseButton(closeButton);

	let lightboxState = {
		listenerAttached: false,
		closeButtonState: {
			listenerAttached: false,
		}
	};

	const cleanLightBox = () => {
		lightboxElement.classList.remove('closing');
		lightboxElement.classList.remove('visible');

		toggleModalAttributes(lightboxElement);
		
		closeButton.removeEventListener('click', closeLightbox);
		lightboxElement.removeEventListener('animationend', cleanLightBox);

		toggleModalState(lightboxState);
	}

	const closeLightbox = () => {
		lightboxElement.classList.add('closing');
		lightboxElement.addEventListener('animationend', cleanLightBox);
	}

	const inspectLightbox = () => {
		if (lightboxElement.classList.contains('visible')) throw new Error(`The following lightbox is already visible: ${lightBoxSelector}.`);
		if (lightboxState.listenerAttached) throw new Error(`A listener is already attached to the lightbox element: ${lightBoxSelector}.`);
		if (lightboxState.closeButtonState.listenerAttached) throw new Error(`A listener is already attached to the close button of the lightbox: ${lightBoxSelector}.`);
	}

	const openLightbox = () => {
		// 🔴 checkPoint
		inspectLightbox();
		// 🟢 clearedSuccessfully !
		
		lightboxElement.classList.add('visible');

		toggleModalAttributes(lightboxElement);
		closeButton.addEventListener('click', closeLightbox);

		toggleModalState(lightboxState);
	}

	return {
		openLightbox,
		closeLightbox
	}
}

// 💭 --------------------------------------------------------------

// ? Fun fact: 
// ? Lightboxes are named after the lightbox that photographers use to view slides.
// ? They are also a fancier way to say 'modal' in this realm.
