/***** VARIABLES ******/
// GLOBAL variables
let editFlag = false;
let coverImgFlag = false;
let coverImgObj;
let editedObj;

/***** EVENT LISTENERS ******/
// Waits for the document to fully load, 
// then initializes the application by calling initApp().
document.addEventListener("readystatechange", (event) => {
  if (event.target.readyState === "complete") {
		themeDetection();
    initApp();
    loadNoteDataOnPageLoad();
  }
  // show loader
});

/***** FUNCTIONS ******/

// INITIALIZE APP FUNC
// Initializes the application by setting up event listeners for displaying note inputs,
// creating new notes, adding cover images, and managing the file input modal.
function initApp() {
  const showInputsBtn = document.querySelector(".show-inputs-btn");
  const fileUploadModal = document.querySelector(".cover-img-modal");
  const noteDisplayModal = document.querySelector(".display-note-modal");
  const coverImageModal = document.querySelector(".modal-bg");
  const darkModeToggle = document.getElementById("switch");
  const navToggle = document.querySelector(".nav-toggle-btn");
  const offCanvas = document.querySelector(".nav-off-canvas");
  const form = document.getElementById("form");

  /***** EVENT LISTENERS ******/
  // Displays/hide the Form inputs
  // dynamically updates the create note btn icon when the button is clicked
  showInputsBtn.addEventListener("click", toggleInputsContainer);

  // Creates a note when the user submits the form.
  form.addEventListener("submit", createNewNote);

  // Opens the cover image modal when the "add-cover-img-btn" is clicked,
  //  allowing the user to add a cover image to their note.
  form.addEventListener("click",(event)=>{
    showModals(event,coverImageModal,"add-cover-img-btn");
  });
  
  // Triggers addCoverImage function on change event to display a preview of the selected image.
  form.elements.cover_photo_input.addEventListener("change", addCoverImage);

  // Opens a modal for uploading and previewing an optional cover image; 
  // handles closing the modal and canceling the upload if the close button is clicked.
  fileUploadModal.addEventListener("click", manageFileInputModal);
 
  // Manages user interactions on the note display modal, handling close, 
  // delete, and edit actions based on button clicks.
  noteDisplayModal.addEventListener("click", (event) => {
    manageNoteDisplayModal(event, noteDisplayModal);
  });

  // Manages the theme of the app based on the users previously selected theme
	darkModeToggle.addEventListener("change",()=>{
		localStorage.getItem("theme") === "light"? enableDarkMode() : disableDarkMode();
	})

  //Manages the actions of the Navbar Toggle Button
  navToggle.addEventListener("click",()=>{
    this.toggleBtnIcons(navToggle);
    offCanvas.classList.toggle("show-nav-off-canvas")
   
  })

  //Handles User actions on the Nav Off Canvas Element
  offCanvas.addEventListener("click",(event)=>{
    manageNavOffCanvas(event);
    console.log("firing")
  })

}


// ADD NEW NOTE FUNC
// Creates a new note card with title, body, date, and optional image, 
// appending it to the UI,
// saving note data to local storage, 
// and handling alerts for successful or unsuccessful creation.
function createNewNote(event) {
  event.preventDefault();

  const mainAlerts = document.querySelector(".main-alerts-display");
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
	let alertMessage;
  let title = form.elements.note_title.value.trim();
  let body = form.elements.note.value.trim();
  let dateObj = new Date();
	const id = Math.random().toString(16).slice(2).toString();


  // convert time to 12 hrs formart
  function convertTime(dateVar) {
    return dateVar.getHours() % 12 || 12;
  }

  let day = weekDays[dateObj.getDay()];
  let month = months[dateObj.getMonth()];
  let date = dateObj.getDate();
  let hrs = convertTime(dateObj);
  let mins = dateObj.getMinutes();
  let pm_am;

  // check wether time is Am or PM
  hrs < 12 ? pm_am = "pm" : pm_am = "am";
  mins < 10 ? mins = `0${mins}`: mins;

  if (title && body && !editFlag) {

  //data from user is used to create an object 
  const noteData = {
    id: id,
    title: title,
    body: body,
    day: day,
    date: date,
    month: month,
    hrs: hrs,
    mins: mins,
    pm_am: pm_am,
    image: coverImgObj,
    hasImage: coverImgFlag,
    isEdited:editFlag
  }

  buildImgNoteCardUI(noteData,saveNoteDataToLocalStorage,id)

    // alert that note has been created
    alertMessage ='<p>Note created  <span><i class="fa-solid fa-circle-check"></i></span></p>';
    displayAlert(
      mainAlerts,
      alertMessage,
      "show-main-alert",
      4000
    );

  }
	else if(title && body && editFlag){
    const editedCardElement = document.querySelector(".editable-card");
    let cardId = editedCardElement.dataset.noteId;
		// Update the UI to reflect changes made to the currently edited card
		UpdateEditedCards( 
			editedCardElement,noteBody,
      noteTitle,day,date,
      month,hrs,mins,pm_am,
      cardId,coverImgFlag);

     // apply this scroll effect only on mobile display
     if(matchMedia("(max-width: 767px)").matches){
       let position = editedCardElement.getBoundingClientRect().bottom
       window.scrollTo({
         top:position,
         left:0,
         behavior:"smooth"
       })
     }
		
		// display alert
		alertMessage ='<p>Note Updated  <span class="pl-1"><i class="fa-solid fa-circle-xmark"></i></span></p>';
		displayAlert(mainAlerts,alertMessage,"show-main-alert",4000);
  } 
	else {
    // display error alert
    let alertMessage = `<p>Error! you can not create a blank note. <span class="pl-1"> <i class="fa-solid fa-circle-exclamation"></i></span></p>`;
    
    displayAlert(
       mainAlerts,
       alertMessage,
      "show-main-alert",
      4000);

    // reset program
    resetAll();
  }
}

//LOAD NOTE DATA ON PAGE LOAD
function loadNoteDataOnPageLoad() {
  let notesArray = retriveFromLocalStorage();
  if (notesArray.length > 0) {
    buildImgNoteCardUI(note);
  }
}

// CLEAR ALL NOTES FUNC
// this function clears all notes from the UI, updates the display,and resets input states.
function manageClearAllNotes(){
	const mainAlerts = document.querySelector(".main-alerts-display");
	const clearBtn = document.querySelector(".clear-btn");
	let noteCards = document.querySelectorAll(".notes-card");
	alertMessage =
	'<p>Note list cleared <span><i class="fa-solid fa-circle-xmark"></i></span></p>';

	clearBtn.classList.add("show-clear-btn");

	clearBtn.addEventListener("click", function removeNotes(){
				localStorage.removeItem("noteEntries");
				clearBtn.classList.remove("show-clear-btn");

				displayAlert(mainAlerts,alertMessage,"show-main-alert",4000);
				//iterate and delete each card
				noteCards.forEach((note) => {
					note.remove();
				});
				// reset the state of the input to their default
				resetAll();
				clearBtn.removeEventListener("click", removeNotes);
		});
}

// TOGGLE INPUT CONTAINER FUNC
//  The function `toggleInputsContainer` toggles the visibility 
// of the form and buttons when triggered by a click event.
function toggleInputsContainer() {
	const addBtn = document.querySelector(".show-inputs-btn");
  form.classList.toggle("show");
  toggleBtnIcons(addBtn);
  resetAll();
}

// TOGGLE BUTTON ICONS
function toggleBtnIcons(btn){
  btn.classList.toggle("show");
}

// SHOW MODALS FUNC
// This function selects the modal element that allows the user to
// add images to their notes.
// it also controls the animated behiour of the modal
function showModals(event,modalElement,closestElmnt) {
  if(event.target.closest(`.${closestElmnt}`) ){
      // adds the class of to display the modal on the page
      modalElement.classList.add("show-modal", "slide-in-fwd-top");

      setTimeout(() => {
        modalElement.classList.remove("slide-in-fwd-top");
      }, 500);
  }

}

// HIDE MODAL FUNC
// This function hides a modal elements.
// and controls the animation on the modal elements.
function hideModals(modalElement) {
  modalElement.classList.add("slide-out-fwd-top");

  setTimeout(() => {
    modalElement.classList.remove("show-modal", "slide-out-fwd-top");
  }, 500);
}

// ADD COVER IMG FUNC
// this function gets the image the user uploads as a cover img for their notes
// then use the previewCoverImg function to create a preview of the cover image.
function addCoverImage() {
  const ImagePreviewContainer = document.querySelector(".cover-img-wrapper");
  const previewImgTitle = document.querySelector(".img-preview-caption");
  const alerts = document.querySelector(".alerts");
  const fileUploadInput = document.getElementById("cover-photo-input");
  let alertMessage = "<p>File is too large. Enter a file less than 500mb</p>";

  coverImgObj = fileUploadInput.files[0];
  // Checks if the size of the image is greater than 500kb
	// if it is then creates an alert and reset the file input values
	// if not then create the preview
  if (coverImgObj.size > 524288) {
    coverImgObj = "";
    fileUploadInput.value = "";
    displayAlert(alerts,alertMessage,"show-alert",5000);
  } else { 
    const previewImg = document.createElement("img");
    previewImg.classList.add("img-fluid", "cover-img");
    // this function reads the file in the cover img variable
    previewCoverImg(coverImgObj,previewImg);
    // removes the default/placeholder img
    ImagePreviewContainer.children[0].remove();
    ImagePreviewContainer.append(previewImg);
    // dispalys a shortened version of the file name on the modal
    trimFileName(previewImgTitle, coverImgObj);
  }
}

// SAVE COVER IMG FUNC
// This function checks if an image object is provided, hides the  modal and sets a flag.
// @param imgObj - The `imgObj` parameter is an object that represents an image.
// @param alertElement - The `alertElement` parameter in the `saveCoverImg` function is\
// a message that will be displayed to the user if the `imgObj` parameter is not
//  provided or is falsy.
function saveCoverImg(imgObj,alertElement) {
  const coverImageModal = document.querySelector(".modal-bg");

  if (imgObj) {
    hideModals(coverImageModal);
    coverImgFlag = true;
  } else {
    let message = "<p>Please, pick an image or click cancel</p>";
    displayAlert(alertElement,message,"show-alert",5000);
  }
}

// CANCEL COVER PHOTO ENTRY FUNC
//  This function resets the cover image preview to a default state 
function cancelCoverImgEntry() {
  const coverImageModal = document.querySelector(".modal-bg");
  resetModalValues();
  hideModals(coverImageModal);
}

// MANAGE FILE INPUT MODAL FUNC
// This function handles events related to a file input modal(cover image modal),
// allowing users to select, save, or cancel cover images.
function manageFileInputModal(event) {
	const alerts = document.querySelector(".alerts");
  if (event.target.closest(".close-modal-btn")) {
    // closes the cover image modal and cancels the cover img upload operation
    cancelCoverImgEntry();
  } else if (event.target.closest(".done-btn")) {
    // saves the inputed image and close the cover img modal.
    saveCoverImg(coverImgObj, alerts);
  }
}

// MANAGE NOTE DISPLAY MODAL FUNC
// This function handles actions such as closing the modal, editing a note, 
// or deleting a note based on user interactions.
// @param modalElement -parameter is a reference to the modal element.
function manageNoteDisplayModal(event,modalElement){
  if(event.target.closest(".back-btn")){
    hideModals(modalElement);
    setTimeout(()=>{
      resetNoteDisplayModal();
    },1000);
		// delete the note id from display modal
    delete modalElement.dataset.noteId;
  }else if(event.target.closest(".edit-btn")){
     editNote();
		 setTimeout(()=>{
      resetNoteDisplayModal();
    },1000);
  }else if(event.target.closest(".del-btn")){
     deleteNote();
		 setTimeout(()=>{
      resetNoteDisplayModal();
    },1000);
  }else if(event.target.closest(".add-to-fav-btn")){
    let id = modalElement.dataset.noteId;
    addToFavourites(id)
  }
}

// MANAGE NAV OFF CANVAS FUNC
function manageNavOffCanvas(event){
  const navToggle = document.querySelector(".nav-toggle-btn");
  const offCanvas = document.querySelector(".nav-off-canvas");
  const notesContainer = document.querySelector(".notes-container");
  let noteCards = document.querySelectorAll(".notes-card");


  if(event.target.closest(".close-canvas-btn")){
    toggleBtnIcons(navToggle);
    offCanvas.classList.remove("show-nav-off-canvas");
  }
  else if(event.target.closest(".fav")){
    let notesArray = retriveFromLocalStorage();
    noteCards.forEach(card =>{
      card.remove();
    })
    notesArray= notesArray.forEach(note=>{
      if(note.isFavourite && note.hasImage){
        buildImgNoteCardsUI(
          note.body,
          note.title,
          note.day,
          note.date,
          note.month,
          note.hrs,
          note.mins,
          note.am_pm,
          note.image,
          note.isEdited,
          note.id)
          notesContainer.append(element);
      }else if(note.isFavourite){

        let cardDetails = buildNoteCardsUI(
          note.body,
          note.title,
          note.day,
          note.date,
          note.month,
          note.hrs,
          note.mins,
          note.am_pm,
        note.isEdited);
        cardDetails.cardElement.dataset.noteId = note.id;
			// append note card to UI
			notesContainer.append(cardDetails.cardElement);
      }
      
     
			makeCardsClickable();
    })

    if(notesContainer.childElementCount > 0){
      manageClearAllNotes();
 }

  }


}

// GENERATE CARD HTML TEMPLATE FUNC
// This function  generates HTML code for a note card with specified content and styling.
// returns an HTML string that represents a note card UI.
function generateCardHTMLTemplates(
	introText,title,
	day,date,mnth,
	hours,mins,timeSuffix
	,cardBody,imge){
    if (imge) {
        return `<!-- note card element with picture start-->
          <div class="row g-0 note-card-center">
              <!-- note card image -->
              <div class="card-head-wrapper">
                  <img src="${imge}" class="img-fluid card-img" alt="note cover img">
              </div>
              <!-- card body -->
              <div class="card-body-wrappper">
                  <div class="card-body">
                      <div class="d-flex justify-content-between">
                          <!-- card title -->
                          <h5 class="card-title">${title}</h5>
                          <!-- card btn -->
                          <button type="button" class="btn my-0 py-0">
                              <i class="fa-solid fa-arrow-right note-btn"></i>
                          </button>
                      </div>
                      <!-- card subtitle -->
                      <h6 class="card-subtitle mb-3 mt-1 text-body-secondary light-txt">
                          <span>${introText}</span> on <span class="note-day">${day}</span>
                        <span class="note-date">${date}</span>  
                        <span class="note-month">${mnth}</span> 
                        <span class="note-time">${hours}:${mins}</span> 
                        <span class="note-time-suffix">${timeSuffix}.</span>
                      </h6>
                      <!-- card text -->
                      <p class="card-text dark-txt line-h card-txt-color">${cardBody}</p>
                  </div>
              </div>
          </div>
 <!-- note card element with picture end-->`;
    } else {
        return `
        <div class="row g-0 py-0">
            <!-- card body -->
            <div class="col-12">
                <div class="card-body">
                    <div class="d-flex justify-content-between">
                        <!-- card title -->
                        <h5 class="card-title">${title}</h5>
                        <!-- card btn -->
                        <button type="button" class="btn my-0 py-0">
                            <i class="fa-solid fa-arrow-right note-btn"></i>
                        </button>
                    </div>
                    <!-- card subtitle -->
                    <h6 class="card-subtitle mb-3 mt-1 text-body-secondary light-txt">
                        <span>${introText}</span> on <span class="note-day">${day}</span>
                        <span class="note-date">${date}</span>  
                        <span class="note-month">${mnth}</span> 
                        <span class="note-time">${hours}:${mins}</span> 
                        <span class="note-time-suffix">${timeSuffix}.</span>
                    </h6>
                    <!-- card text -->
                    <p class="card-text dark-txt line-h card-txt-color">${cardBody}</p>
                </div>
            </div>
        </div>`
    }
}

// BUILD NOTE CARD UI FUNC
/**
 * The function `buildImgNoteCardUI` is responsible for dynamically creating and initializing note
 * cards with specific details and UI elements.
 * @param noteDetails - The `noteDetails` parameter in the `buildImgNoteCardUI` function seems to
 * contain three elements:
 */
function buildImgNoteCardUI(...noteDetails){
  const [noteData,saveNoteDataFunc,id] = noteDetails;


  if(saveNoteDataFunc){
      readNoteData();
  }else if(!saveNoteDataFunc){
    let notesArray = retriveFromLocalStorage();
    notesArray.forEach( note=>{
        initCard(note);
      })
  }
  

  async function readNoteData() {
    let element = await saveNoteDataFunc(noteData);
    element = element.filter(note => {
      if(note.id === noteData.id){
        return note
      }
    })
    element = element.pop();
    initCard(element)
  }

  function initCard(arry){
    const notesContainer = document.querySelector(".notes-container");
    let cardPrefix;
    const cardElement = document.createElement("article");
    // if so then upate the card UI with an edit prefix
    noteData.isEdited ? cardPrefix = "Edited" : cardPrefix = "Created";
    // trim note body text for the card UI
    let cardText = trimUiCardText(arry.body);
    cardElement.classList.add("card", "notes-card", "bg-body-tertiary");
    id? cardId = id : cardId = arry.id ;
    cardElement.dataset.noteId = cardId;
     cardElement.innerHTML = generateCardHTMLTemplates(
        `${cardPrefix}`,
        arry.title,
        arry.day,
        arry.date,
        arry.month,
        arry.hrs,
        arry.mins,
        arry.pm_am,
        cardText,
        arry.image
      );

      notesContainer.append(cardElement);
      makeCardsClickable();
			toggleInputsContainer();
      reOrderCards();

      // sets up the functionality to clear notes
      if(notesContainer.childElementCount > 0){
        manageClearAllNotes();
      }
  }
}

// MAKE CARDCLICKABLE FUNC
// This function adds click event listeners to all note card elements on the UI.
// it enables users to view note details based on the card being clicked.
function makeCardsClickable() {
    let noteCards = document.querySelectorAll(".notes-card");
		noteCards.forEach(noteCard =>{
			let id = noteCard.dataset.noteId
    noteCard.addEventListener("click", (event) => {
      viewNoteDetails(id, event);
    });
	})
}

// UPDATE EDITED CARDS FUNC
// this function updates the card data on the UI based on data the user entered.
function UpdateEditedCards(
	element,noteBody,
	noteTitle,day,date_,
	month,hrs,mins,pm_am,
	cardId,coverImgFlag
){
	const updateNoteBtn = document.querySelector(".create-note-btn");
	// trim note body text for the card UI
	let cardText = trimUiCardText(noteBody);
		if (editFlag && (coverImgObj || coverImgFlag)) {
	 
		// handles cases where the user edits the note and includes a cover image
    const reader = new FileReader();
    reader.onload = (event) => {
      // noteImg is updated with the result of the file reading
      noteImg = event.target.result;
      element.innerHTML = generateCardHTMLTemplates(
				"Edited",noteTitle,day,
				date_,month,hrs,mins,
				pm_am,cardText,noteImg
			);
      // edit in local storage
      editInLocalStorage(
        cardId,noteTitle,
        noteBody,day,date_,
        hrs,mins,pm_am,
        coverImgFlag,
        noteImg,month
			);
      updateNoteBtn.textContent = "Create note";
			// hide form inputs and reset the app
      toggleInputsContainer();
    };
    reader.readAsDataURL(coverImgObj);
  } 
	else if (editFlag && (!coverImgObj || !coverImgFlag)) {
		// handles cases where the user edits the note and does not includes a cover image
    element.innerHTML = generateCardHTMLTemplates(
      "Edited",noteTitle,day,
      date_,month,hrs,
      mins,pm_am,cardText
    );
    // edit in local storage
    editInLocalStorage(
      cardId,noteTitle,noteBody,
      day,date_,hrs,mins,pm_am,
      coverImgFlag,
      noteImg="null",month
    );
    updateNoteBtn.textContent = "Create note";

    toggleInputsContainer();
  } 
}

// VIEW NOTES DETAILS FUNC
// This function retrieves a specific note object from local storage based on its ID and
// updates the UI to display the full details of that note, including title, date, time,
//  body, andoptionally an image.
//  @param id -  is used to identify which note to update
function viewNoteDetails(id,event){
  const noteDisplayModal = document.querySelector(".display-note-modal");
  const noteImgSection = document.querySelector(".note-dp-img-container");
  const noteBody = document.querySelector(".note-dp-txt");
  const noteDay = document.querySelector(".note-dp-day");
  const noteDate = document.querySelector(".note-dp-date");
  const noteMonth = document.querySelector(".note-dp-month");
  const noteTime = document.querySelector(".note-dp-time");
  const noteDpTitle = document.querySelector(".note-dp-title");
  const noteTimeSuffix = document.querySelector(".notedp-time-suffix");
  const noteDisplayBtnsWrapper = document.querySelector(".note-controls");
  let noteElement = retriveFromLocalStorage();
  // filter out the note object whose id is a match to the id of the clicked card
  noteElement = noteElement.filter( note => {
      if(note.id === id){
          return note;
      }
  })
  noteElement = noteElement.pop();
  // update the note display UI with data from the note object
  noteDpTitle.textContent = `${noteElement.title}`;
  noteDay.textContent =`${noteElement.day}`;
  noteDate.textContent =`${noteElement.date}`;
  noteMonth.textContent =`${noteElement.month}`;
  noteTime.textContent =`${noteElement.hrs}:${noteElement.mins}`;
  noteTimeSuffix.textContent =`${noteElement.pm_am}`;
  noteBody.textContent = `${noteElement.body}`;

  // create an on the note display modal using the noteOject's id
  noteDisplayModal.dataset.noteId = noteElement.id;

  // if the note object has an img property update the UI with this image
  if(noteElement.hasImage === true){
  noteImgSection.innerHTML = ` <div class="col-12 note-dp-img-wrapper p-0">
      <img class="img-fluid h-100" src=${noteElement.image} alt="note display img">
  </div>`
  }
  
  // if the note object favourite flag is set to true then update the sate of the favourite btns
 if(noteElement.isFavourite === true){
  noteDisplayBtnsWrapper.classList.add("show")
 }

  // display the note that has been built
  showModals(event,noteDisplayModal,"notes-card");

}

// PREVIEW COVER IMAGE FUNC
// This function reads a file using `FileReader` and sets the `src` attribute
//  of an element to the result.
//  @param file - tis parameter is the file object that you want to read.
//  @param element - The `element` parameter is the image element (`<img>`),
//  where the content of the file being read will be displayed.
function previewCoverImg(file,element) {
     // intantiates a new fileRead instance
     const reader = new FileReader();
     reader.onload = (e) => {
         element.src = e.target.result;
      };
     reader.readAsDataURL(file);
}

//DISPLAY ALERT FUNC
// displays alerts(error,info, etc) msgs when called takes by adding a class and then removing them after a specified duration.
//  @param element - is the HTML element that you want to display the alert message in.
//  @param message - is the message  that you want to display in the specified element.
//  @param d_class - is a CSS class that to display a visual effect.
// @param duration - thi specifies the delay durationof the settimeout func.
function displayAlert(element,message,d_class,duration){
  element.innerHTML = `${message}`;
  element.classList.add(`${d_class}`);

  setTimeout(() => {
    element.classList.remove(`${d_class}`);
		element.innerHTML = "";    
  }, duration);
}

//RESET ALL FUNC
// This function essentially resets the app to its default state.
function resetAll() {
  const notesContainer = document.querySelector(".notes-container");
  const noteCards = document.querySelectorAll(".notes-card");
	// reset form elements
  form.elements.note_title.value = "";
  form.elements.note.value = "";
  form.elements.cover_photo_input.value = "";
	// reset flags
  coverImgFlag = false;
  editFlag = false;
  //resets the card elements after editing
  noteCards.forEach(card =>{
      card.classList.remove("editable-card");
      notesContainer.classList.remove("disabled-cards");
      card.removeAttribute("inert","");
  }) 
  // resets the file input modal to its default state
  resetModalValues();

}

// RESET COVER IMG MODAL FUNC
// This function resets the image preview, cover image object variable, image,
//  preview subtitle, file input to their default values.
function resetModalValues() {
  const previewImgTitle = document.querySelector(".img-preview-caption");
  const ImagePreviewContainer = document.querySelector(".cover-img-wrapper");
  // the default svg file is saved in a variable
  let previewImg = 
	`<!-- place holder image for preview image -->
                   <i>
                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"
                           fill="currentColor" class="size-4">
                           <path fill-rule="evenodd"
                               d="M2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Zm10.5 5.707a.5.5 0 0 0-.146-.353l-1-1a.5.5 0 0 0-.708 0L9.354 9.646a.5.5 0 0 1-.708 0L6.354 7.354a.5.5 0 0 0-.708 0l-2 2a.5.5 0 0 0-.146.353V12a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5V9.707ZM12 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
                               clip-rule="evenodd" />
                       </svg>
                   </i>`;
  coverImgObj = "";
  previewImgTitle.textContent = "image preview";
  form.elements.cover_photo_input.value = "";
  // the selected image is removed
  ImagePreviewContainer.children[0].remove();
  // the default svg image is set as the preview
  ImagePreviewContainer.innerHTML = previewImg;
}

// RESET NOTE DISPLAY MODAL FUNC
// This function clears the content of various elements within the note display modal.
// after the user has viewed a note.
  function resetNoteDisplayModal(){
    const noteImgSection = document.querySelector(".note-dp-img-container");
    const noteBody = document.querySelector(".note-dp-txt");
    const noteDay = document.querySelector(".note-dp-day");
    const noteDate = document.querySelector(".note-dp-date");
    const noteMonth = document.querySelector(".note-dp-month");
    const noteTime = document.querySelector(".note-dp-time");
    const noteDpTitle = document.querySelector(".note-dp-title");
    const noteTimeSuffix = document.querySelector(".notedp-time-suffix");
    const noteDisplayModal = document.querySelector(".display-note-modal");
    const noteDisplayBtnsWrapper = document.querySelector(".note-controls");
   

    noteDpTitle.textContent = "";
    noteDay.textContent ="";
    noteDate.textContent ="";
    noteMonth.textContent ="";
    noteTime.textContent ="";
    noteTimeSuffix.textContent ="";
    noteBody.textContent = "";
    noteImgSection.innerHTML="";
    delete noteDisplayModal.dataset.noteId;
    noteDisplayBtnsWrapper.classList.remove("show");

  }

// TRIM FILE NAME FUNC
// The `trimFileName` function shortens the file name of an image if it exceeds
// 20 characters and updates the text content of a specified element with the shortened name.
function trimFileName(textElement,image) {
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

// TRIM UI CARD BODY TEXT FUNC
// This function takes a string as input and returns a
//  trimmed version of the string.
function trimUiCardText(b_text){
  if(b_text.length > 145){
    return `${b_text.slice(0, 139)}. . .`;
  }else{
    return b_text;
  }

}

// DELETE NOTE FUNC
// This function deletes a note card from the UI, hides the note modal,
//  and removes the clear button if there are no more notes in the container,
//  while also deleting the note from localstorage.
function deleteNote(){
  const noteDisplayModal = document.querySelector(".display-note-modal");
  const noteCards = document.querySelectorAll(".notes-card");
  const notesContainer = document.querySelector(".notes-container");
  const clearBtn = document.querySelector(".clear-btn");
  const mainAlerts = document.querySelector(".main-alerts-display");
  let id = noteDisplayModal.dataset.noteId;

  //deletes card that matches the noteId from the UI. 
  noteCards.forEach(card =>{
    if(id === card.dataset.noteId){
       card.remove();
    }
  })
  hideModals(noteDisplayModal);
  // remove the btn from the display 
  if (notesContainer.childElementCount === 0) {
    clearBtn.classList.remove("show-clear-btn");
  }
  // display alert
  alertMessage ='<p>Note Deleted <span class="pl-1"><i class="fa-solid fa-circle-xmark"></i></span></p>';
 displayAlert (mainAlerts,alertMessage,"show-main-alert",4000);
  deleteNoteFromLocalStorage(id)
  resetAll();
}

// EDIT NOTE FUNC
// This function retrieves a note OBJECT from local storage, 
// updates the UI to allow editing of the note, 
// and populates form inputs with the note's data for editing.
function editNote(){
  const noteDisplayModal = document.querySelector(".display-note-modal");
  const noteCards = document.querySelectorAll(".notes-card");
  const notesContainer = document.querySelector(".notes-container");
  const updateNoteBtn = document.querySelector(".create-note-btn");
  const form = document.getElementById("form");
	const addBtn = document.querySelector(".show-inputs-btn");
	const createNoteBtn = document.querySelector(".create-note-btn");
 
  // get the current note id from the note modal dispaly
  let id = noteDisplayModal.dataset.noteId;
  editFlag = true;
  let notesElement = retriveFromLocalStorage();
  hideModals(noteDisplayModal);
  updateNoteBtn.textContent = "Update note";
// using the card id to implement a test,
// iterate through the cards on the UI
// apply styles to give visual cue to the user based on these test
// showing which card is being edited and disabling the rest of the cards
 noteCards.forEach(card =>{
    if(card.dataset.noteId !== id){
      notesContainer.classList.add("disabled-cards");
      card.setAttribute("inert","");
    }

    if(card.dataset.noteId === id){
      card.classList.add("editable-card");
    }
    })

    // search for a match with the card id from the array 
		// of objects gotten from local storage
    notesElement = notesElement.filter( note =>{
        if(note.id === id){
          return note;
        }
    })

    notesElement = notesElement.pop();
    // update the values of the form inputs with values from note object.
    form.elements.note_title.value = notesElement.title;
    form.elements.note.value = notesElement.body;

		form.classList.add("show");
		addBtn.classList.add("show");
		createNoteBtn.classList.add("show");

		let position = form.getBoundingClientRect().top;
		window.scrollTo({
				top:position,
				left:0,
				behavior:"smooth"
			})
}

// ADD TO FAVOURITES FUNC
/**
 * The function `addToFavourites` toggles a CSS class on a note display button wrapper and updates the
 * favorite status of a note in local storage based on the button's visibility.
 * @param noteId - The `noteId` parameter is the unique identifier of the note that you want to add to
 * or remove from the list of favorites.
 */
function addToFavourites(noteId){
  const noteDisplayBtnsWrapper = document.querySelector(".note-controls");
  noteDisplayBtnsWrapper.classList.toggle("show");
  
  let notesArray = retriveFromLocalStorage();
  if(noteDisplayBtnsWrapper.classList.contains("show")){
    notesArray = notesArray.map(note=>{
      if(noteId === note.id){
        return {
          ...note,
          isFavourite:true
        }
      } return note;
    })
  }else if(!noteDisplayBtnsWrapper.classList.contains("show")){
    notesArray = notesArray.map(note=>{
      if(noteId === note.id){
        return {
          ...note,
          isFavourite:false
        }
      } return note;
    })
  }

  localStorage.setItem("noteEntries", JSON.stringify(notesArray));
}

// ORDER CARDS FUNC
// This function reverses the order of the note cards on the page 
function reOrderCards(){
  const notesContainer = document.querySelector(".notes-container");
	let noteCards = document.querySelectorAll(".notes-card");
  const cardList = [...noteCards];

	noteCards.forEach(card =>{
		card.remove();
	})

 
  cardList.reverse().forEach(card=>{
		notesContainer.append(card)
	})
}

/***** DARK MODE FUNTIONALITY ******/
// ENABLE DARK MODE FUNC
function enableDarkMode(){
	const body = document.querySelector("body");
	body.classList.add("dark-mode");
	localStorage.setItem("theme", "dark");
}

// DISABLE DARK MODE FUNC
function disableDarkMode(){
	const body = document.querySelector("body");
	body.classList.remove("dark-mode");
	localStorage.setItem("theme", "light");
}

// THEME DETECTION FUNC
function themeDetection(){
	const darkModeToggle = document.getElementById("switch");
	let theme = "light"

	if(localStorage.getItem("theme")){

		theme = localStorage.getItem("theme");

	}else if(matchMedia && matchMedia("(prefares-color-scheme: dark)").matches){
		theme = "dark"
	}

	if(theme === "dark"){
		darkModeToggle.checked = true;
	} 
	
	theme === "dark"? enableDarkMode():disableDarkMode();
}

/***** LOCAL STORAGE ******/

// SAVE NOTES TO LOCAL STORAGE FUNC
//  This function  saves note data to local storage, including an image if specified,
//  by converting it to a string using a FileReader.
//  its returned values are the processed note data(object)
function saveNoteDataToLocalStorage(noteData) {
  let imageUrlData;
  //if the flag is set to true, it coverts the coverImgObj(blob) to a string.
  //by performing a file reading operation.
  if(noteData.flag === true){ 

    // consume data generated from the promise that handles the image processing
    async function retriveImageData() {
     let data = await initImageProcessing();
     return data;
    }
    
    // Create a promise to handle image processing task asynchroneously
    function initImageProcessing(){
      return new Promise(resolve=>{
        let fileReading = new FileReader()
        fileReading.onload = (e)=>{
          imageUrlData = e.target.result;
          // updates the noteObj (object) image property the converted blob data
          noteData.image = imageUrlData;
          notesArray = retriveFromLocalStorage();
          notesArray.push(noteData);
          localStorage.setItem("noteEntries", JSON.stringify(notesArray));
          resolve(retriveFromLocalStorage())
        }
        fileReading.readAsDataURL(noteData.coverImgObj)
        
      })
    }

    return retriveImageData()
  }
  else{
    notesArray = retriveFromLocalStorage();
    notesArray.push(noteData);
    localStorage.setItem("noteEntries", JSON.stringify(notesArray));
    // wrap the data in a promise  
    // so it's return values can be properly consumed
    // in the async function where it is called.
    async function processData() {
      let data = await Promise.resolve(retriveFromLocalStorage()); 
      return data;
     }
    return processData()
  }

}

// RETRIVE NOTE DATA FORM LOCAL STORAGE FUNC
function retriveFromLocalStorage() {
  return JSON.parse(localStorage.getItem("noteEntries")) || [];
}

// DELETE NOTE DATA FROM LOCAL STORAGE FUNC
// This function removes a specific note entry from local storage based on its ID.
//  @param _id -  is the unique identifier of the note that you want to delete from the local storage.
function deleteNoteFromLocalStorage(_id){
  let notesArray = retriveFromLocalStorage()
  notesArray = notesArray.filter(noteObj=>{
    if(noteObj.id !== _id){
      return noteObj;
    }
  })
  localStorage.setItem("noteEntries", JSON.stringify(notesArray));
}

// EDIT NOTE DATA IN LOCAL STORAGE FUNC
// This function updates a specific note in local storage with new values.
 function editInLocalStorage(
	editId,nTitle,nBody,
	nDay,nDate,nHrs,
	nMins,tSuffix,noteFlag,
	img_,nMonth){

  let notesArray = retriveFromLocalStorage();

// map through each note in the notes array
// if the current note's ID matches the editId, create a new note object with all original properties.
// update this new object with the function arguments (new values)
// if there's a match, return the updated note; otherwise, return the original note
// map creates a new array of notes, with only the matched note updated
// the original notesArray is replaced with this new mapped array
   notesArray = notesArray.map(note=>{
    if(editId === note.id)
      return {
        ...note,
        title:nTitle,
        body:nBody,
        day:nDay,
        date:nDate,
        month:nMonth,
        hrs:nHrs,
        mins:nMins,
        am_pm:tSuffix,
        image:img_,
        hasImage:noteFlag,
        isEdited:true
    }
    return note;
  });
  localStorage.setItem("noteEntries", JSON.stringify(notesArray));
}