# display-stuff-ui.js
display-stuff-ui.js is a simple controller for managing modal elements. It provides methods to open and close dialogs and lightboxes. The controller initializes modals with necessary accessibility attributes and handles animations for opening and closing.

## Installation

Install via npm:
```bash
npm install display-stuff-ui
```

## Usage

1. Import the controller: 
Import either 'dsCreateDialogController' or 'dsCreateLightboxController' into your project.
```javascript
import * as displayStuff from './display-stuff-ui';
// OR
import {dsCreateDialogController, dsCreateLightboxController } from './display-stuff-ui';
```

2. Prepare the Modal:
Create your modal element in HTML, ensuring it has a close button with a class of ds-close-button.
```html 
<dialog>
  <button class="ds-close-button">✕</button>
</dialog>
```    

3. Define Basic Styles:
Use CSS to add animations for opening and closing dialogs.
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

4. Initialize the Controller:
Pass your modal element into the appropriate function.
```javascript   
const dialogElement = document.querySelector('dialog');
const lightboxElement = document.querySelector('.myLightbox');

const dialogController = displayStuff.dsCreateDialogController(dialogElement);
const lightboxController = displayStuff.dsCreateLightboxController(lightboxElement);
```

5. Open/Close the Modal:
Set up event listeners to control the opening and closing of your modal.
```html
<button class="open-modal-button" >Open Modal</button>
```
```javascript
const openModalButton = document.querySelector('.open-modal-button');

openModalButton.addEventListener('click', () => {
  dialogController.openDialog();
});
```

### Additional Information
* When the modal is opened, the "close" button is set up to close it automatically via the controller's closeDialog() or closeLightbox() method. The same applies when the "escape" key is pressed.

* After attaching the controller, you can open or close the modal using openDialog() or closeDialog().

#### License
ISC

##### Author
display-stuff-ui was created by Cyclone Studios in New York City.

###### Contributors
* Cyclone Studios