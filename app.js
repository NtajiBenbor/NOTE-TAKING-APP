/***** VARIABLES ******/
// GLOBAL variables
let editFlag = false;
let CoverImgFlag = false;
let coverImgObj;
let editID;
let edited;

/***** EVENT LISTENERS ******/
// This event listener waits for the document's readyState to become "complete",
// which indicates that the entire page (including resources like images and scripts)
// has finished loading. Once the state is "complete", it calls the initApp() function
// to initialize the application.
document.addEventListener("readystatechange", (event) => {
  if (event.target.readyState === "complete") {
    initApp();
  }
  // show loader
});

/***** FUNCTIONS ******/

// INITIALIZE APP FUNC
/**
 * The `initApp` function sets up event listeners for showing note inputs, creating a new note, adding
 * a cover image, and managing file input modal in a web application.
 */
function initApp() {
  const showInputsBtn = document.querySelector(".show-inputs-btn");
  const fileUploadModal = document.querySelector(".cover-img-modal");
  const noteDisplayModal = document.querySelector(".display-note-modal");
  const coverImageModal = document.querySelector(".modal-bg");
  const form = document.getElementById("form");

  /***** EVENT LISTENERS ******/
  // Displays/hide the Form inputs
  // dynamically updates the create note btn icon when the button is clicked
  showInputsBtn.addEventListener("click", showNoteInputsContainer);

  // Creates a note when the user submits the form.
  form.addEventListener("submit", createNewNote);

  //Pulls up the modal that allows the user add a cover image to their note
  form.addEventListener("click",(event)=>{
    showModals(event,coverImageModal,"add-cover-img-btn");
  });
  

  //change event fires the addCoverImage func(it displays a preview of the selected img)
  form.elements.cover_photo_input.addEventListener("change", addCoverImage);

  //Pulls up a modal that allows the user to upload and preview an optional cover image for their notes
  // user action on this modal also controls closing the modal,
  // if the "x"(close) button is click, the upload operation is cancelled.
  fileUploadModal.addEventListener("click", manageFileInputModal);
 
  // This handles user interaction on the modal that displays the notes such as; 
  //  closing the modal when the use clicks the back button.
  //  deleting or editing the note that is displayed when either button is clicked.
  noteDisplayModal.addEventListener("click", (event) => {
    manageNoteDisplayModal(event, noteDisplayModal);
  });

}



// ADD NEW NOTE FUNC
/**
 * This function creates a new note card with title, body, date, and time
 * information, and optionally an image, and appends it to the UI while handling 
 * alerts and local storage.
 */
function createNewNote(event) {
  event.preventDefault();

  const notesContainer = document.querySelector(".notes-container");
  const mainAlerts = document.querySelector(".main-alerts-display");
  const clearBtn = document.querySelector(".clear-btn");
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let noteTitle = form.elements.note_title.value.trim();
  let noteBody = form.elements.note.value.trim();
  let cardText;
  let noteImg;
  let date = new Date();
  const id = Math.random().toString(16).slice(2).toString();

  // convert time to 12 hrs formart
  function convertTime(dateVar) {
    return dateVar.getHours() % 12 || 12;
  }

  let day = weekDays[date.getDay()];
  let month = months[date.getMonth()];
  let date_ = date.getDate();
  let hrs = convertTime(date);
  let mins = date.getMinutes();
  let pm_am;
  // check wether time is Am or PM
  hrs < 12 ? (pm_am = "pm") : (pm_am = "am");
  mins < 10 ? mins = `0${mins}`: mins;

  if (noteTitle && noteBody) {
        // initializing a card container element and giving it a unique id
        const cardElement = document.createElement("div");
        cardElement.dataset.noteId = id;
        cardElement.classList.add("col");

        // reducing the length of the text for the note card elements
        noteBody.length > 145
          ? (cardText = `${noteBody.slice(0, 139)}. . .`)
          : (cardText = noteBody);

        // decide what kind of note card to create for UI based on the coverImage Flag.
        // if flag is set to false then create a card with only text.
        // if flag is true then create a card with both text and a cover image.
        if (!CoverImgFlag) {
            cardElement.innerHTML = `<div class="card notes-card bg-body-tertiary" style="max-width:540px;">
            <div class="row g-0">
                <!-- card body -->
                <div class="col-12">
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
                            Created on <span class="note-day">${day}</span>
                            <span class="note-date">${date_}</span>  
                            <span class="note-month">${month}</span> 
                            <span class="note-time">${hrs}:${mins}</span> 
                            <span class="note-time-suffix">${pm_am}.</span>
                        </h6>
                        <!-- card text -->
                        <p class="card-text dark-txt line-h card-txt-color">${cardText}</p>
                    </div>
                </div>
            </div>
            </div>`;
        } else {
          // Since file reading is a blocking operation, we need to ensure that the noteImg
          // variable has the correct value before updating the cardElement's innerHTML.
          // To achieve this, we use template literals to pass the note title, note body,
          // and cover image into a pre-structured and pre-styled HTML string.
          // This operation is handled asynchronously to ensure the file is fully read
          // before its value is used.
          const reader = new FileReader();
          reader.onload = (event) => {
            // noteImg is updated with the result of the file reading
            noteImg = event.target.result;

            //the card inner HTML structure is updated pre-styled & pre-structured HTML
            // values for note-title, note-body(trimed text string), date and note-img
            cardElement.innerHTML = `<div class="card notes-card bg-body-tertiary" style="max-width:540px;">
                    <div class="row g-0">
                        <!-- note card image -->
                        <div class="col-md-4 note-image-wrapper">
                        <img src= ${noteImg}  alt="note cover img">
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
                                    Created on <span class="note-day">${day}</span>
                                    <span class="note-date">${date_}</span>  
                                    <span class="note-month">${month}</span> 
                                    <span class="note-time">${hrs}:${mins}</span> 
                                    <span class="note-time-suffix">${pm_am}.</span>
                                </h6>
                                <!-- card text -->
                                <p class="card-text dark-txt line-h card-txt-color">${cardText}</p>
                            </div>
                        </div>
                    </div>
                </div>`;
          };
          reader.readAsDataURL(coverImgObj);
        }

        // append note card to UI
        notesContainer.append(cardElement);

        // select note card elements
        let noteCards = notesContainer.querySelectorAll(".col");
        // ADDS EVENT LISTENER TO each card that triggers the modal that displays the clicked note in full
        noteCards.forEach(note=>{
            note.addEventListener("click",(event)=>{
                showFullNote(note.dataset.noteId,event);
            })
        })

        // alert that note has been created
        let alertMessage =
          '<p>Note created  <span><i class="fa-solid fa-circle-check"></i></span></p>';
        displayAlert(
          mainAlerts,
          "green",
          "white",
          alertMessage,
          "show-main-alert",
          3000
        );

        // display clear Notes Button
        if (notesContainer.childElementCount > 0) {

                clearBtn.classList.add("show-clear-btn");
                // ADDS EVENT LISTENER to the button where if it is clicked,
                // hides the button,DELETES ALL NOTES FROM local storage,
                // removes cards form note UI
                clearBtn.addEventListener("click",function removeNotes() {
                    // delete all note entries from local storage 
                    localStorage.removeItem("noteEntries");
                    // remove the btn from the display
                    clearBtn.classList.remove("show-clear-btn");
                    // display an alert
                    alertMessage ='<p>Note list cleared <span><i class="fa-solid fa-circle-xmark"></i></span></p>';
                    displayAlert(mainAlerts,"red","white",alertMessage,"show-main-alert",4000);
                    //iterate and delete each card
                    noteCards.forEach(note => {
                        note.remove();
                });
                // remove the event listener on the btn
                clearBtn.removeEventListener("click",removeNotes);
              });
        }

        //save to locale storage  
        saveNoteDataToLocalStorage( id,noteTitle,noteBody,day,date_,
          hrs,mins,pm_am,CoverImgFlag,coverImgObj,month);

        // resets the program
        resetAll();
  } else if (noteTitle && noteBody && !editFlag) {
  } else {
        // display error alert
        let alertMessage = `<p>Error! you can not create a blank note.<span> <i class="fa-solid fa-circle-exclamation"></i></span></p>`;
        displayAlert( mainAlerts,"yellow","black",alertMessage,"show-main-alert",4000);
        // reset program
        resetAll();
      }
}

// SHOW INPUT CONTAINER FUNC
/**
 * The function `showNoteInputsContainer` toggles the visibility of a form and buttons
 * when triggered by a click event.*/
function showNoteInputsContainer(event) {
  const createNoteBtn = document.querySelector(".create-note-btn");
  // selects the add note btn via it's eventListener
  const addBtn = event.currentTarget;
  form.classList.toggle("show");
  addBtn.classList.toggle("show");

  setTimeout(() => {
    createNoteBtn.classList.toggle("show");
  }, 300);

  resetAll();
}

// SHOW MODALS FUNC
/*The function `showModals` selects the modal element that allows the user to
 add images to their notes. It displays the modal by adding a class to it.*/
function showModals(event,modalElement,clostestElmnt) {
  // modalElement
  if(event.target.closest(`.${clostestElmnt}`) ){
      // adds the class of to display the modal on the page
      modalElement.classList.add("show-modal", "slide-in-bck-center");

      setTimeout(() => {
        modalElement.classList.remove("slide-in-bck-center");
      }, 500);
  }

}

// HIDE MODAL FUNC
/* The function `hideModals` hides a modal with a cover image by adding 
and removing CSS classes for animation.*/
function hideModals(modalElement) {
  modalElement.classList.add("slide-out-bck-center");

  setTimeout(() => {
    modalElement.classList.remove("show-modal");
    modalElement.classList.remove("slide-out-bck-center");
  }, 500);
}

// ADD COVER IMG FUNC
/*  this function gets the image the user uploads as a cover img for their notes
    then use the displayCoverImgPreview function to display a preview of the cover image.*/
function addCoverImage() {
  const ImagePreviewContainer = document.querySelector(".cover-img-wrapper");
  const previewImgTitle = document.querySelector(".img-preview-caption");
  const alerts = document.querySelector(".alerts");
  const fileUploadInput = document.getElementById("cover-photo-input");
  let alertMessage = "<p>File is too large. Enter a file less than 500mb</p>";

  coverImgObj = fileUploadInput.files[0];
  // Checks if the size of the image is greater than 500kb
  if (coverImgObj.size > 524288) {
    // reset the cover uploaded file
    coverImgObj = "";
    //reset the value of the file input
    fileUploadInput.value = "";
    //  display an error message
    displayAlert( alerts,"transparent","red",alertMessage,"show-alert",5000);
  } else {
    // an image element is created. this element is used to handle the preview
    const previewImg = document.createElement("img");
    // CSS styling is add to the created element
    previewImg.classList.add("img-fluid", "cover-img");
    // this function reads the file in the cover img variable
    // then updates the src property of the img element that was created
    displayCoverImgPreview(coverImgObj,previewImg);
    // removes the default/placeholder img
    ImagePreviewContainer.children[0].remove();
    // displays the uploaded img as a preview
    ImagePreviewContainer.append(previewImg);
    // dispalys a shortened version of the file name on the modal
    trimFileName(previewImgTitle, coverImgObj);
  }
}

// SAVE COVER PHOTO IMG FUNC
/**
 * The function `saveImg` checks if an image object is provided, hides a modal and sets a flag.
 * @param imgObj - The `imgObj` parameter is an object that represents an image. It is used to
 * check if an image object is provided as input to the `saveImg` function.
 * @param alertElement - The `alertElement` parameter in the `saveImg` function is\
 *  a message that will be displayed to the user if the `imgObj` parameter is not
 * provided or is falsy.
 */
function saveImg(imgObj, alertElement) {
  const coverImageModal = document.querySelector(".modal-bg");

  if (imgObj) {
    hideModals(coverImageModal);
    CoverImgFlag = true;
  } else {
    let message = "<p>Please, pick an image or click cancel</p>";
    displayAlert(alertElement,"transparent","red", message,"show-alert",5000);
  }
}

// CANCEL COVER PHOTO ENTRY FUNC
/* The function `cancelCoverImgEntry` resets the cover image preview to a default 
placeholder, resets the file input element value, and then hides the modal.*/
function cancelCoverImgEntry() {
  const coverImageModal = document.querySelector(".modal-bg");
  // resets all  input element on this modal element
  restModalValues();
  // the modal is then hidden
  hideModals(coverImageModal);
}

// MANAGE FILE INPUT MODAL FUNC
/**
 * The function `manageFileInputModal` handles events related to a file input modal,
 * allowing users to select, save, or cancel cover images.
 * @param event - The `event` parameter in the `manageFileInputModal` function is an
 * object that represents the event that occurred, such as a click or change event.
 * It contains information about the event, including the target element that triggered
 *  the event. In this case, the function is using the `event.target
 */
function manageFileInputModal(event) {
  const alerts = document.querySelector(".alerts");
  if (event.target.closest(".close-modal-btn")) {
    // closes the cover image modal and cancels the user img inputs
    cancelCoverImgEntry();
  } else if (event.target.closest(".done-btn")) {
    // closes the cover image modal but saves the inputed image to a variable
    saveImg(coverImgObj, alerts);
  }
}

// MANAGE NOTE DISPLAY MODAL FUNC
/**
 * This function `manageNoteDisplayModal` handles actions such as closing the modal, editing a note, or
 * deleting a note based on user interactions.
 * @param modalElement - The `modalElement` parameter is a reference to the modal element that is being
 * managed for displaying notes.
 */
function manageNoteDisplayModal(event,modalElement){
  const noteImgSection = document.querySelector(".note-dp-img-container");

  if(event.target.closest(".back-btn")){
    // hides the modal 
    // resets image container element to default(empty).
    // remove the noteID attribute from the modal.
    hideModals(modalElement);
    noteImgSection.innerHTML = "";
    delete modalElement.dataset.noteId;
  }else if(event.target.closest(".edit-btn")){
     editNote();
  }else if(event.target.closest(".del-btn")){
     deleteNote();
  }
}

// DISPLAY NOTES FUNC
/**
 * The function `showFullNote` retrieves a specific note object from local storage based on its ID and
 * updates the UI to display the full details of that note, including title, date, time, body, and
 * optionally an image.
 * @param id - The `id` parameter in the `showFullNote` function is used to identify which note to
 * display in the modal. It is passed as an argument when calling the function and is used to filter
 * out the specific note object from the array of notes retrieved from local storage. This way, the
 * function
 */
function showFullNote(id,event){
  const noteDisplayModal = document.querySelector(".display-note-modal");
  const noteImgSection = document.querySelector(".note-dp-img-container");
  const noteBody = document.querySelector(".note-dp-txt");
  const noteDay = document.querySelector(".note-dp-day");
  const noteDate = document.querySelector(".note-dp-date");
  const noteMonth = document.querySelector(".note-dp-month");
  const noteTime = document.querySelector(".note-dp-time");
  const noteDpTitle = document.querySelector(".note-dp-title");
  const noteTimeSuffix = document.querySelector(".notedp-time-suffix");

  // retrives the notes array of objects from local storage 
  let noteElement = retriveFromLocalStorage();
  // filter out the note object whose id is a match to the id of the clicked card
  noteElement = noteElement.filter( note => {
      if(note.id == id){
          return note;
      }
  })
  // extract the returned note object from the array
  noteElement = noteElement.pop();
  // update the note display UI with data from the note object
  noteDpTitle.textContent = `${noteElement.title}`;
  noteDay.textContent =`${noteElement.day}`;
  noteDate.textContent =`${noteElement.date}`;
  noteMonth.textContent =`${noteElement.month}`;
  noteTime.textContent =`${noteElement.hrs}:${noteElement.mins}`;
  noteTimeSuffix.textContent =`${noteElement.am_pm}`;
  noteBody.textContent = `${noteElement.body}`;

  //create a noteId dataset attribute on the note that is being viewed using the noteOject's id
  noteDisplayModal.dataset.noteId = noteElement.id;

    // if the note object img property contains update the UI with image
  if(noteElement.flag === true){
  noteImgSection.innerHTML = ` <div class="col-12 note-dp-img-wrapper p-0">
      <img class="img-fluid h-100" src=${noteElement.image} alt="note display img">
  </div>`
  }
 
  // display the note that has been built
  showModals(event,noteDisplayModal,"col");

}

// READ FILES FUNC
/** 
The function `displayCoverImgPreview` reads a file using `FileReader` and sets the `src` attribute
 of an element to the result.
  * @param file - The `file` parameter is the file object that you want to read.
  * @param element - The `element` parameter in the `displayCoverImgPreview` function is typically
  *  a reference to an HTML element, such as an image element (`<img>`), where the
  *  content of the file being read will be displayed.*/
function displayCoverImgPreview(file,element) {

     // intantiates a new fileRead instance
     const reader = new FileReader();
     // asynchronously updates the element src with the result of the file reading
     reader.onload = (e) => {
         element.src = e.target.result;
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
function displayAlert(element, bgColor, color, text, d_class, duration) {
  element.style.color = `${color}`;
  element.style.backgroundColor = `${bgColor}`;
  element.innerHTML = `${text}`;

  element.classList.add(`${d_class}`);
  setTimeout(() => {
    element.classList.remove(`${d_class}`);    
  }, duration);
}

//RESET ALL FUNC
/**The function `resetAll` clears the values of input fields and resets a flag variable.
 essentially reseting the app to its default state */
function resetAll() {
  form.elements.note_title.value = "";
  form.elements.note.value = "";
  form.elements.cover_photo_input.value = "";
  CoverImgFlag = false;
  // resets the file input modal to its default state
  restModalValues();
}

// RESET COVER IMG MODAL FUNC
/*The function `restModalValues` resets the image preview, cover image object, image
 preview subtitle, file input, and selected image to their default values.*/
function restModalValues() {
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
    based on the length of the string. if the title string characters are greater than 20, the it shortens it but if it is less than 20, it displays it as is.*/
function trimFileName(textElement, image) {
  let imageTitle = image.name;

  if (imageTitle.length > 20) {
    let shortenedTitle = imageTitle.slice(0, 19);
    shortenedTitle += `...${imageTitle.slice(-4)}`;

    // updates the img caption with uploaded img name after shortening the string.
    textElement.textContent = `${shortenedTitle}`;
  } else {
    // updates the img caption with uploaded img name as is.
    textElement.textContent = image.name;
  }
}

// DELETE NOTE FUNC
/**
 * The `deleteNote` function deletes a note card from the UI, hides the note modal, and removes the
 * clear button if there are no more notes in the container, while also deleting the note from local
 * storage.
 */
function deleteNote(){
  const noteDisplayModal = document.querySelector(".display-note-modal");
  const noteCards = document.querySelectorAll(".col");
  const notesContainer = document.querySelector(".notes-container");
  const clearBtn = document.querySelector(".clear-btn");
  const mainAlerts = document.querySelector(".main-alerts-display");
  const noteImgSection = document.querySelector(".note-dp-img-container");
  let id = noteDisplayModal.dataset.noteId;

  //deletes card that matches the noteId from the UI. 
  noteCards.forEach(card =>{
    if(id === card.dataset.noteId){
       card.remove()
    }
  })
  // hides the note modal
  hideModals(noteDisplayModal);
  // remove the btn from the display 
  if (notesContainer.childElementCount === 0) {
    clearBtn.classList.remove("show-clear-btn");
  }

  noteImgSection.innerHTML = "";

  // display alert
  alertMessage ='<p>Note Deleted <span class="ml-1"><i class="fa-solid fa-circle-xmark"></i></span></p>';
  displayAlert(mainAlerts,"red","white",alertMessage,"show-main-alert",4000);

  // deletes note from local storage
  deleteNoteFromLocalStorage(id)

}


// EDIT NOTE FUNC
function editNote(){
  console.log("editing note");
}


/***** LOCAL STORAGE ******/
// SAVE NOTES TO LOCAL STORAGE FUNC
/**
 * The function `saveNoteDataToLocalStorage` saves note data to local storage, including an image if
 * specified, by converting it to a string using a FileReader.
 * @param noteId - The `noteId` parameter is the unique identifier for the note, used to distinguish one note from another.
 * @param nTitle - nTitle is the title of the note that will be saved to the local storage.
 * @param nBody - The `nBody` parameter in the `saveNoteDataToLocalStorage` function represents the
 *  content of the note that is being saved.
 * @param nDay - The `nDay` parameter in the `saveNoteDataToLocalStorage` function represents the day
 * of the week for the note.
 * @param nDate - The `nDate` parameter in the `saveNoteDataToLocalStorage` function represents the
 * date the note was created.
 * @param nHrs - The `nHrs` parameter in the `saveNoteDataToLocalStorage` function represents the hours
 * of the note entry.
 * @param nMins - The parameter `nMins` represents the minutes value of the time associated with the
 * note.
 * @param tSuffix - The `tSuffix` parameter in the `saveNoteDataToLocalStorage` function represents
 * whether the time is in AM or PM format.
 * @param noteFlag - The `noteFlag` parameter is a boolean flag that determines whether to convert an
 * image file to a string and store it in the `noteObj` object. If `noteFlag` is set to `true`, the
 * function will convert the image file to a string using a `FileReader`.
 * @param img_ - The `img_` parameter in the `saveNoteDataToLocalStorage` function represents an image
 * file that is being passed as input. This image file is used to set the `image` property of the
 * `noteObj` object that is being saved to the local storage.
 * @param nMonth - The `nMonth` parameter in the `saveNoteDataToLocalStorage` function represents the
 * month the note was created.
 */
function saveNoteDataToLocalStorage(noteId,nTitle,nBody,nDay,nDate,nHrs,nMins,
  tSuffix,noteFlag,img_,nMonth) {
  
  // will hold the result of the blob conversion
  let imageUrlData;
  // object created to hold note properties
  const noteObj = {
    id: noteId,
    title: nTitle,
    body: nBody,
    day: nDay,
    date: nDate,
    month:nMonth,
    hrs: nHrs,
    mins: nMins,
    am_pm: tSuffix,
    image: img_,
    flag: noteFlag
  };
  let notesArray;
  
  //if the flag is set to true, it coverts the coverImgObj(blob) to a string.
  //by performing a file reading operation. 
  // and then update the noteObj image property with the result of the operation.
  // if the flag is set to false it does not modify the noteObj's properties.
  if(noteFlag === true){

    let fileReading = new FileReader();
    fileReading.onload = (e)=>{
      imageUrlData = e.target.result;
      // updates the noteObj (object) image property the converted blob data
      noteObj.image = imageUrlData;

      notesArray = retriveFromLocalStorage();
      notesArray.push(noteObj);
      localStorage.setItem("noteEntries", JSON.stringify(notesArray));
    }
    fileReading.readAsDataURL(img_);

    
  }else{
    notesArray = retriveFromLocalStorage();
    notesArray.push(noteObj);
    localStorage.setItem("noteEntries", JSON.stringify(notesArray));

  }

}

// RETRIVE NOTE FORM LOCAL STORAGE FUNC
function retriveFromLocalStorage() {
  return JSON.parse(localStorage.getItem("noteEntries")) || [];
}

// DELETE NOTE FROM LOCAL STORAGE FUNC
/**
 * The function `deleteNoteFromLocalStorage` removes a specific note entry from local storage based on
 * its ID.
 * @param _id - The `_id` parameter in the `deleteNoteFromLocalStorage` function is the unique
 * identifier of the note that you want to delete from the local storage.
 */
function deleteNoteFromLocalStorage(_id){
  let notesArray = retriveFromLocalStorage()

  notesArray = notesArray.filter(noteObj=>{
    if(noteObj.id !== _id){
      return noteObj;
    }
  })

  localStorage.setItem("noteEntries", JSON.stringify(notesArray));

}


/***** FUNCTIONS ******/

/**** ANIMATIONS ******/
