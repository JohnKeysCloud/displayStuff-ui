# displayStuff.js
  - Creates a controller object for managing a modal element, providing methods to open and close the dialog.
  -  function initializes the dialog as a modal, sets up necessary accessibility attributes,
 * and ensures that the dialog can be properly managed through its lifecycle.
 *
 * Its intended use is to provide a simple way to manage the visibility of a dialog element.
 * It abstracts out the pesky animating in-and-out conundrum of modal elements with a CSS property, display of none (to block/flex/grid/etc.).

## Installation

Install with npm:

	$ npm install display-stuff-ui

## Usage and Examples

1. Import 'dsCreateDialogController' into your project: 
```javascript
import * as displayStuff from './displayStuff.js';
// OR
import {dsCreateDialogController, dsCreateLightboxController } from './displayStuff.js';
```

2. Create your modal element (HTML dialog or other). Ensure it has a close button with a class of 'ds-close-button' nested within. All modals should have a close button, hence this requirement.
```html 
<dialog>
  <button class="ds-close-button">✕</button>
</dialog>
```    

3. Ensure the minimal styles are applied via CSS or your pre-processor of choice.:
```scss
@keyframes animate-dialog-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes animate-dialog-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

dialog {
  &[open] {
    animation: animate-dialog-in 0.666s ease-in-out;
    display: block; // or flex/grid/block/etc. (anything but 'none')
  }

  &.closing {
    animation: animate-dialog-out 0.666s ease-in-out;
  }
}

.myLightbox {
  display: none;

  &.open {
    animation: animate-dialog-in 0.666s ease-in-out;
    display: block; // or flex/grid/block/etc. (anything but 'none')
  }

  &.closing {
    animation: animate-dialog-out 0.666s ease-in-out;
  }
}
```

3. Pass your modal element into the appropriate imported function (If your modal is an HTML dialog element, pass it into 'dsCreateDialogController', else 'dsCreateLightboxController'):
```javascript   
// Access the functions via the namespace
const dialogElement = document.querySelector('dialog');
const lightboxElement = document.querySelector('.lightbox');

const dialogController = displayStuff.dsCreateDialogController(dialogElement);
const lightboxController = displayStuff.dsCreateLightboxController(lightboxElement);
// OR
const dialogController = dsCreateDialogController(dialogElement);
const lightboxController = dsCreateLightboxController(lightboxElement);
```

5. Set up methods for opening/closing your modal (ex: a button with an event listener attached):
```html
<button class="open-modal-button" >Open Modal</button>

<dialog>
  <button class="ds-close-button">✕</button>
</dialog>
```
```javascript
const openModalButton = document.querySelector('.open-modal-button');

openModalButton.addEventListener('click', () => {
  dialogController.openDialog();
});

```

NOTE: When the modal is opened, the 'close' button nested within it is initialized to close the modal on click! The same method is applied when the 'escape' key is pressed.

## License

ISC
