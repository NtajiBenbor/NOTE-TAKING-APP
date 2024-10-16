/***** VARIABLES ******/
// Global DOM variables
const showInputsBtn = document.querySelector(".show-inputs-btn");
const pickCoverImgBtn = document.querySelector(".add-cover-img-btn");
const fileUploadModal = document.querySelector(".cover-img-modal");
const fileUploadInput = document.getElementById("cover-photo-input");
const form = document.getElementById("form");

// GLOBAL variables
let editFlag = false;
let CoverImgFlag = false;
let coverImgObj;
let editID;
let edited;

/***** EVENT LISTENERS ******/
// displays/hide note inputs
// dynamically update the create note btn icon when create note btn clicked
showInputsBtn.addEventListener("click", showNoteInputsContainer);

// creates a note after the user clicks submits
form.addEventListener("submit", createNewNote);

//pulls a modal that allows the user add a cover image to their note
pickCoverImgBtn.addEventListener("click", showCoverPhotoModal);

//sets up the cover photo preview when the user uploads an image
fileUploadModal.addEventListener("click", manageFileInputModal);

//change event fires the addCoverImage func(it displays a preview of the selected img)
fileUploadInput.addEventListener("change", addCoverImage);

/***** FUNCTIONS ******/

// ADD NEW NOTE FUNC
function createNewNote(event) {
 
event.preventDefault();

  let noteTitle = form.elements.note_title.value;
  let noteBody = form.elements.note.value;
  
  
  const notesContainer = document.querySelector(".notes-container")
  let date = new Date();
  const id = Math.random().toString(16).slice(2);

  if(noteTitle && noteBody && CoverImgFlag){
    console.log("i have a cover image")
	const div = document.createElement('div');
	let noteImg= document.createElement("img");
	noteImg.classList.add("img-fluid");
	readFiles(coverImgObj,noteImg)
	div.dataset.noteId = id
	div.classList.add("col")

	let noteElement = ` <div class="card notes-card bg-body-tertiary" style="max-width: 540px;">
                        <div class="row g-0">
                            <!-- note card image -->
                            <div class="col-md-4 note-image-wrapper">
                                ${noteImg}
                            </div>
                            <!-- card body -->
                            <div class="col-md-8">
                                <div class="card-body">
                                    <div class="d-flex justify-content-between">
                                        <!-- card title -->
                                        <h5 class="card-title">${noteTitle}</h5>
                                        <!-- card btn -->
                                        <button type="button" class="btn my-0 py-0">
                                            <i class="fa-solid fa-arrow-right note-btn"></i>
                                        </button>
                                    </div>
                                    <!-- card subtitle -->
                                    <h6 class="card-subtitle mb-3 mt-1 text-body-secondary light-txt">
                                        Edited on <span class="note-date">Sat</span> <span
                                            class="note-time">12:05</span> <span class="note-time-suffix">am.</span>
                                    </h6>
                                    <!-- card text -->
                                    <p class="card-text dark-txt line-h card-txt-color">${noteBody}</p>
                                </div>
                            </div>
                        </div>
                    </div>`
			
	// let noteImg = noteElement.querySelector(".card-img")
	// readFiles(coverImgObj,noteImg)
	// console.log(noteImg)
	div.innerHTML = noteElement

	notesContainer.append(div)

	console.log(div)
    resetAll()
  }else if(noteTitle && noteBody && !CoverImgFlag){
    console.log("no cover img")
    resetAll()
  }else{
    alert("can not enter empty note")
    resetAll()
  }
}

// SHOW INPUT CONTAINER FUNC

/**
 * The function `showNoteInputsContainer` toggles the visibility of a form and buttons when triggered by a click event.*/
function showNoteInputsContainer(event) {
    
  const createNoteBtn = document.querySelector(".create-note-btn");
  // selects the add note btn via it's eventListener
  const addBtn = event.currentTarget;

  form.classList.toggle("show");

  addBtn.classList.toggle("show");

  setTimeout(() => {
    createNoteBtn.classList.toggle("show");
  }, 300);

  
}

// SHOWCOVER PHOTO MODAL FUNC
/*The function `showCoverPhotoModal` selects the modal element that allows the user to add
  images to their notes. It displays the modal by adding a class to it.*/
function showCoverPhotoModal() {
  // selects the cover modal element in the DOM
  const coverImageModal = document.querySelector(".modal-bg");
  // adds the class of to display the modal on the page
  coverImageModal.classList.add("show-modal", "slide-in-bck-center");

  setTimeout(() => {
    coverImageModal.classList.remove("slide-in-bck-center");
  }, 500);
  
}

// HIDE MODAL FUNC
/* The function `hideCoverImgModal` hides a modal with a cover image by adding and removing CSS classes for animation.
 */
function hideCoverImgModal() {
  const coverImageModal = document.querySelector(".modal-bg");
  coverImageModal.classList.add("slide-out-bck-center");

  setTimeout(() => {
    coverImageModal.classList.remove("show-modal");
    coverImageModal.classList.remove("slide-out-bck-center");
  }, 500);
}

// ADD COVER IMG FUNC
/*  this function gets the image the user uploads as a cover img for their notes
    then use the readFiles function to display a preview of the cover image.*/
function addCoverImage() {
  const ImagePreviewContainer = document.querySelector(".cover-img-wrapper");
  const previewImgTitle = document.querySelector(".img-preview-caption");
  const alerts = document.querySelector(".alerts");
  const fileUploadInput = document.getElementById("cover-photo-input");
  
  coverImgObj = fileUploadInput.files[0];
  // Checks if the size of the image is greater than 500kb
  if (coverImgObj.size > 524288) {
    // reset the cover uploaded file
    coverImgObj = "";
    //reset the value of the file input
    fileUploadInput.value = "";
    //  display an error message
    displayAlert(
      alerts,
      "red",
      "file is too large enter a file less than 500mb",
      "show-alert",
      5000
    );
  } else {
    // an image element is created. this element is used to handle the preview
    const previewImg = document.createElement("img");
    // CSS styling is add to the created element
    previewImg.classList.add("img-fluid", "cover-img");
    // this function reads the file in the cover img variable
    // then updates the src property of the img element that was created
       let img = readFiles(coverImgObj);
	   previewImg.setAttribute('src',`${img}`);
    // removes the default/placeholder img
    ImagePreviewContainer.children[0].remove();
    // displays the uploaded img as a preview
    ImagePreviewContainer.append(previewImg);
    // dispalys a shortened version of the file name on the modal   
    trimFileName(previewImgTitle,coverImgObj)
  }


}

// SAVE COVER PHOTO IMG FUNC
/**
 * The function `saveImg` checks if an image object is provided, hides a modal and sets a flag.
 * @param imgObj - The `imgObj` parameter is an object that represents an image. It is used to  check if an image object is provided as input to the `saveImg` function.
 * @param alertMsg - The `alertMsg` parameter in the `saveImg` function is a message that will be
 displayed to the user if the `imgObj` parameter is not provided or is falsy. 
 */
function saveImg(imgObj, alertMsg) {
  if (imgObj) {
    hideCoverImgModal();
    CoverImgFlag = true;
  } else {
    displayAlert(
      alertMsg,
      "red",
      "Please, pick an image or click cancel",
      "show-alert",
      5000
    );
  }
}

// CANCEL COVER PHOTO ENTRY FUNC
/* The function `cancelCoverImgEntry` resets the cover image preview to a default 
placeholder, resets the file input element value, and then hides the modal.*/
function cancelCoverImgEntry() {
	// resets all  input element on this modal element
	restModalValues()

  // the modal is then hidden
  hideCoverImgModal();
}

// MANAGE FILE INPUT MODAL FUNC
/**
 * The function `manageFileInputModal` handles events related to a file input modal, allowing users to select, save, or cancel cover images.
 * @param event - The `event` parameter in the `manageFileInputModal` function is an object that
 * represents the event that occurred, such as a click or change event. It contains information about
 * the event, including the target element that triggered the event. In this case, the function is
 * using the `event.target
 */
function manageFileInputModal(event) {
  let element = event.target;
  const closeModalBtn = document.querySelector(".close-modal-btn");
  const saveImgBtn = document.querySelector(".done-btn");
  const alerts = document.querySelector(".alerts");

  if (element.closest("button") === closeModalBtn) {
    // closes the cover image modal and cancels the user img inputs
    cancelCoverImgEntry();
  } else if (element.closest(".done-btn") === saveImgBtn) {
    // closes the cover image modal but saves the inputed image to a variable
    saveImg(coverImgObj, alerts);
  }

  /* this allows the defaualt behaviour of the file input to work even though 
    default behavior of the form is has been turned off in the createNewNote()
     function*/
//   event.stopPropagation();
}

// READ FILES FUNC
/** 
The function `readFiles` reads a file using `FileReader` and sets the `src` attribute
 of an element to the result.
  * @param file - The `file` parameter is the file object that you want to read.
  * @param element - The `element` parameter in the `readFiles` function is typically a reference to an HTML element, such as an image element (`<img>`), where the content of the file being read will be displayed.*/
function readFiles(file) {
  // intantiates a new fileRead instance
  const reader = new FileReader();
  // asynchronously updates the element src with the result of the file reading
  reader.onload = (e) => {
    return e.target.result;
  };
  // file is being read here
  reader.readAsDataURL(file);
}

//DISPLAY ALERT FUNC
// displays alerts(error,info, etc) msgs when called takes by adding a class and then removing them after a specified duration
/**
 * @param element - The `element` parameter is the HTML element that you want to display the alert message in.
 * @param color - The `color` parameter is the color in which the text will be displayed in the alert.It should be a valid CSS color value, such as "red", "#FF0000", "rgb(255, 0, 0)", etc.
 * @param text - The `text` parameter is the message or text that you want to display in the specified element.
 * @param d_class - The `d_class` parameter is a CSS class that will be added to the element for a certain duration to display a visual effect, such as a style change.
 * @param duration - The `duration` parameter specifies the time in milliseconds for which the `d_class` will be added to the element before it is removed using `setTimeout`.
 */
function displayAlert(element, color, text, d_class, duration) {
  element.style.color = `${color}`;
  element.textContent = `${text}`;

  element.classList.add(`${d_class}`);
  setTimeout(() => {
    element.classList.remove(`${d_class}`);
  }, duration);
}


//RESET ALL FUNC
function resetAll(){
    
    form.elements.note_title.value = "";
    form.elements.note.value = "";
    form.elements.cover_photo_input.value = "";
	CoverImgFlag = false
	restModalValues()
}

// RESET COVER IMG MODAL FUNC

function restModalValues(){
 const previewImgTitle = document.querySelector(".img-preview-caption");
 const ImagePreviewContainer = document.querySelector(".cover-img-wrapper");
  /*the default svg file is saved in a variable*/
  let previewImg = `<!-- place holder image for preview image -->
                   <i>
                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"
                           fill="currentColor" class="size-4">
                           <path fill-rule="evenodd"
                               d="M2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Zm10.5 5.707a.5.5 0 0 0-.146-.353l-1-1a.5.5 0 0 0-.708 0L9.354 9.646a.5.5 0 0 1-.708 0L6.354 7.354a.5.5 0 0 0-.708 0l-2 2a.5.5 0 0 0-.146.353V12a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5V9.707ZM12 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
                               clip-rule="evenodd" />
                       </svg>
                   </i>`;
  /*the cover image object is reset to default */
  coverImgObj = "";   
  /*image preview subtitle reset to default*/
  previewImgTitle.textContent = "image preview";
  /*the file input is also reset*/
  form.elements.cover_photo_input.value = "";
  /*the selected image is removed*/
  ImagePreviewContainer.children[0].remove();
  /*the default svg image is set as the preview*/
  ImagePreviewContainer.innerHTML = previewImg;
}

// TRIM FILE NAME FUNC
  /* updates the img caption with uploaded img name. it dynamically updates the image title
    based on the length of the string. if the title string characters are greater than 20,
    the it shortens it but if it is less than 20, it displays it as is.*/
function trimFileName(textElement,image){
  let imageTitle = image.name;

  imageTitle = imageTitle.split("");

  if (imageTitle.length > 20) {
    let imageTitlePrefix = imageTitle.slice(0, 19).join("");
    let imageTitleSuffix = imageTitle.slice(-4).join("");

    // updates the img caption with uploaded img name after shortening the string.
    textElement.textContent = `${imageTitlePrefix}...${imageTitleSuffix}`;
  } else {
    // updates the img caption with uploaded img name as is.
    previewImgTitle.textContent = photo.name;
  }
}

/***** LOCAL STORAGE ******/

/***** FUNCTIONS ******/

/**** ANIMATIONS ******/
