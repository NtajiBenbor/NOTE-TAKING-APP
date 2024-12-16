// /***** VARIABLES ******/
// GLOBAL variables
let editFlag = false;
let coverImgFlag = false;
let showFavs = false;
let coverImgObj;
let editedObj;
const feedbackObj = {
  fbText: "All notes",
  gridLayout: true,
  ascending: true
}



/***** EVENT LISTENERS ******/
// Waits for the document to fully load, 
// then initializes the application by calling initApp().
document.addEventListener("readystatechange", (event) => {
  if (event.target.readyState === "complete") {
		themeDetection();
    initApp();
    loadNoteDataOnPageLoad();
  }
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
  const formModal = document.querySelector(".form-modal");
  

  /***** EVENT LISTENERS ******/
  // Displays the Form inputs modal
  showInputsBtn.addEventListener("click", (event)=>{
    // const formModal = document.querySelector(".form-modal");
    showModals(event, formModal, "show-inputs-btn");
    resetAll();
  });

  // Creates a note when the user submits the form.
  form.addEventListener("submit", createNewNote);

  // Opens the cover image modal when the "add-cover-img-btn" is clicked,
  //  allowing the user to add a cover image to their note.
  // todo:rewrite this comment to be suitable
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
    this.toggleNav();
    offCanvas.classList.toggle("show-nav-off-canvas");
  })

  //Handles User actions on the Nav Off Canvas Element
  offCanvas.addEventListener("click",(event)=>{
    manageNavOffCanvas(event);
  })

  // Closes the note input modal when the user clicks the close btn
 formModal.addEventListener("click", (event) => {
   if (event.target.closest(".close-btn")) {
     resetAll();
     hideModals(formModal);
   }
 });

}


// ADD NEW NOTE FUNC
// Creates a new note card with title, body, date, and optional image, 
// appending it to the UI,
// saving note data to local storage, 
// and handling alerts for successful or unsuccessful creation.
function createNewNote(event) {
  event.preventDefault();
  const mainAlerts = document.querySelector(".main-alerts-display");
  const feedBackTxt = document.querySelector(".feedback-text");
  const emptyNotesPlaceHolder = document.querySelector(".note-place-holder");
  const formModal = document.querySelector(".form-modal");
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  let alrtMsg;
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
  hrs < 12 ? (pm_am = "pm") : (pm_am = "am");
  mins < 10 ? (mins = `0${mins}`) : mins;

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
    isEdited: false,
    isFavourite: false
  };

  if (title && body && !editFlag) {
    // if the place holder text is there it removes it and 
    // updates the feedback icons text.
    if(emptyNotesPlaceHolder){
      emptyNotesPlaceHolder.remove();
      feedBackTxt.textContent === ""
        ?feedBackTxt.textContent ="All notes"
        :feedBackTxt.textContent = feedBackTxt.textContent
    }
    // save note data to storageand the create a note card on UI
    buildNoteCardUI(noteData, saveNoteDataToLocalStorage, id);
    // remove hide the note creation page 
    hideModals(formModal);
    resetAll()
    // alert that note has been created
    alrtMsg =
      `<p>Note created  <span>
      <i class="fa-solid fa-circle-check"></i></span></p>`;
    displayAlert(mainAlerts, alrtMsg, "show-main-alert", 4000);
  } 
  else if (title && body && editFlag) {
    const editedCardElement = document.querySelector(".editable-card");
    let cardId = editedCardElement.dataset.noteId;
    noteData.id = cardId;
    // Update the UI to reflect changes made to the currently edited card
    UpdateEditedCards(noteData, editedCardElement, cardId);
    // apply this scroll effect only on mobile display
    // if (window.matchMedia("(max-width: 767px)").matches) {
    //   let position = editedCardElement.getBoundingClientRect().bottom;
    //   window.scrollTo({
    //     top: position,
    //     left: 0,
    //     behavior: "smooth",
    //   });
    // }
    // display alert
    alrtMsg =
      `<p>Note Updated <span class="pl-1"> 
      <i class="fa-solid fa-circle-exclamation"></i></span></p>`;
    displayAlert(mainAlerts, alrtMsg, "show-main-alert", 4000);
  } 
  else {
    // display error alert
    alrtMsg = `<p>Error! you can not create a blank note. 
    <span class="pl-1"> <i class="fa-solid fa-circle-exclamation"></i></span></p>`;
    displayAlert(mainAlerts, alrtMsg, "show-main-alert", 4000);
    // reset program
    resetAll();
  }
}

//LOAD NOTE DATA ON PAGE LOAD
function loadNoteDataOnPageLoad() {

  let notesArray = retriveFromLocalStorage();
  if (notesArray.length > 0) {
    // if note data is available the build the note cards using data from Local storage
    buildNoteCardUI();
    // update the icons and text on the within the notes container component
    // to give visual feedback to users.

    feedbackObj.fbText = "All Notes"
    notesContainerFeedback(feedbackObj);
  }
  else if (notesArray.length <= 0){
    // if note data(note list) is empty generate a place holder text
    let text = 
    `<p><span class="px-3"><i class="fa-regular fa-circle-plus"></i></span>
    <span>No Notes Yet!</span></p>`;
    buildEmptyNotePlaceHolder(text);
  }
}


// NOTE CONTAINER FEEDBACK
// this func uses the icons and text within the notes container component
// to give visual feed back on what sort of preference selections in terms of 
// Notes UI layout and how the Cards are sorted(ascending or decsending order)
function notesContainerFeedback(feedbackObj){
  const feedBackTxt = document.querySelector(".feedback-text");
  const gridListIcon = document.querySelector(".icon-1");
  const upDownIcon = document.querySelector(".icon-2");

  feedBackTxt.textContent = feedbackObj.fbText;
  // dynamically update the grid/list icon on the notes container UI
  feedbackObj.gridLayout
    ?gridListIcon.classList.remove("show")
    :gridListIcon.classList.add("show");

  // dynamically update the up/down icon on the notes container UI
  feedbackObj.ascending
    ?upDownIcon.classList.remove("show")
    :upDownIcon.classList.add("show");

}


// CLEAR ALL NOTES FUNC
// this function clears all notes from the UI, updates the display,and resets input states.
function manageClearAllNotes() {
  const mainAlerts = document.querySelector(".main-alerts-display");
  const clearBtn = document.querySelector(".clear-btn");
  let noteCards = document.querySelectorAll(".notes-card");
  const navToggle = document.querySelector(".nav-toggle-btn");
  const offCanvas = document.querySelector(".nav-off-canvas");

  alrtMsg =
    `<p>Note list cleared <span>
    <i class="fa-solid fa-circle-xmark"></i></span></p>`;
  clearBtn.addEventListener("click", removeNotes);

  // close the nav-off-canvas component
  navToggle.classList.remove("show");
  offCanvas.classList.remove("show-nav-off-canvas");

  // REMOVE NOTES FUNCTION
  // this func clears all the note and fav data in local storage
  // deletes each card from the UI and resets the UI to an empty state
  function removeNotes() {
    // clear every note entry from Local storage
    localStorage.removeItem("noteEntries");
    // clear all fav data from Local storage
    localStorage.removeItem("favNotes");
    displayAlert(mainAlerts, alrtMsg, "show-main-alert", 4000);
    //iterate and delete each card
    noteCards.forEach((note) => {
      note.remove();
    });
    // reset the state of the input to their default
    resetAll();
    clearBtn.removeEventListener("click", removeNotes);
    // add the placeholder when the card list is empty
    let text = 
    `<p><span class="px-3"><i class="fa-regular fa-circle-plus"></i></span>
    <span>No Notes Yet!</span></p>`;
    buildEmptyNotePlaceHolder(text);
  }
}


  // TODO:  
  // TODO: add an alert for when a note gets aded or removed from favs
  // TODO: work on how alerts are displayed on larger screens
  // TODO: update ui when user is in fav and removes or adds a note accordingly
  // TODO: add animations to card when they are appended, and when the layout is adjusted
  // TODO: Make app buttons responsive especially on mobile displays.
  // TODO: Create a Utils.js file and the use exports.



// TOGGLE BUTTON ICONS
function toggleBtnIcons(btn){
  btn.classList.toggle("show");
}

// NAV TOGGLE FUNC
function toggleNav(){
  const navToggle = document.querySelector(".nav-toggle-btn");
  navToggle.classList.toggle("show");
}

// SHOW MODALS FUNC
// this function shows modal elements
// it also controls the animated behiour of the modal
function showModals(event, modalElement, closestElmnt) {
  if (event.target.closest(`.${closestElmnt}`)) {
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
  let alrtMsg = "<p>File is too large. Enter a file less than 500mb</p>";

  coverImgObj = fileUploadInput.files[0];
  // Checks if the size of the image is greater than 500kb
	// if it is then creates an alert and reset the file input values
	// if not then create the preview
  if (coverImgObj.size > 524288) {
    coverImgObj = "";
    fileUploadInput.value = "";
    displayAlert(alerts,alrtMsg,"show-alert",5000);
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
    const formModal = document.querySelector(".form-modal")
     editNote();
     showModals(event,formModal,"edit-btn");
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
    addToFavourites(id);
  }
}

// MANAGE NAV OFF CANVAS FUNC
// handles user intraction the sort,important and layout options on the off-canvas element
function manageNavOffCanvas(event){
  // TODO: refactor to use switch satements from if/else statement in main func logic
  const notesSection = document.querySelector(".notes-section");
  const navToggle = document.querySelector(".nav-toggle-btn");
  const offCanvas = document.querySelector(".nav-off-canvas");
  const feedBackTxt = document.querySelector(".feedback-text");
  const favsElement= document.querySelector(".fav");
  const sortElement = document.querySelector(".sort");
  const sortTxt = document.querySelector(".sort-txt");
  const layoutElement = document.querySelector(".lay");
  const layoutTxt = document.querySelector(".lay-txt");
  let noteCards = document.querySelectorAll(".notes-card");
  const addBtn = document.querySelector(".show-inputs-btn");
  const placeholderElement = document.querySelector(".note-place-holder")

  if(event.target.closest(".close-canvas-btn") || event.target.closest(".clear-btn")){
    // handles cases where the close button or delete element is clicked
    toggleNav();
    offCanvas.classList.remove("show-nav-off-canvas");
  }
  else if(event.target.closest(".fav")){
    // handles cases where the fav button is clicked 
    // UI is updated with cards that have been added to favourites list
    let favsArry = retriveFavsDataLocalStorage();
    showFavs? showFavs = false : showFavs = true;
    noteCards.forEach(card =>{card.remove()});
    if(showFavs){
      // update the state of the heart element and fav-text in the UI
      // then display the notes that have been added to the fav list on the UI
      favsElement.classList.add("active");
      feedbackObj.fbText = "Important notes";
      notesContainerFeedback(feedbackObj);
      addBtn.parentElement.classList.add("hide");
      // if importan cards exist then show them else dispalay a feedback message to the user
      if (favsArry.length > 0) {
        buildNoteCardUI(favsArry);
      }else{
        let text = 
        `<p><span class="px-3"><i class="fa-regular fa-heart"></i></span><span>
        No note has been added as important</span></p>`;
        buildEmptyNotePlaceHolder(text);
      }
    }else{
      // revert back to displaying all card elements
      let notesArray = retriveFromLocalStorage();
      favsElement.classList.remove("active");
      feedbackObj.fbText = "All notes"
      notesContainerFeedback(feedbackObj);
      buildNoteCardUI(notesArray);
      addBtn.parentElement.classList.remove("hide");
      // If the place holder element is there then remove it
      placeholderElement && placeholderElement.remove();
    }
    navToggle.classList.remove("show");
    offCanvas.classList.remove("show-nav-off-canvas")
  }
  else if(event.target.closest(".sort")){
    // handles interactions with the sort element
    // update the elements icons
      sortElement.classList.toggle("show");
      // update the elements text color
      sortElement.classList.toggle("active");
      //update the nav sort element text dynamically 
      sortElement.classList.contains("show")
        ?sortTxt.textContent = "Sort by Newest"
        :sortTxt.textContent = "Sort by Oldest";
     // updates the order of the cards being displayed 
     // in ascending or decending order
      if(sortElement.classList.contains("show")){
        feedbackObj.ascending= false;
        notesContainerFeedback(feedbackObj);
        reOrderCards("oldest");
      }else {
        notesContainerFeedback(feedbackObj);
        reOrderCards("newest");
      }
  }
  else if(event.target.closest(".lay")){
    // displays the cards in either rows of grid layout base on user interactions
      // update the elements icons
      layoutElement.classList.toggle("show");
      // update the elements text color
      layoutElement.classList.toggle("active");
      notesSection.classList.toggle("change-layout");
      // change the text on the nav off canvas for the layout option
      layoutElement.classList.contains("show")
        ? (layoutTxt.textContent = "Grid Layout")
        : (layoutTxt.textContent = "List Layout"); 
      // maintain the text on the feedback text element
      feedbackObj.fbText = feedBackTxt.textContent;
      // Update the layout based on the state of the layout property in feedbackobject
      if(layoutElement.classList.contains("show")){
        feedbackObj.gridLayout = false;
        notesContainerFeedback(feedbackObj);
      }else{
        notesContainerFeedback(feedbackObj);
      }
  }

  // reset the parts of thre feedback object
  feedbackObj.gridLayout = true;
  feedbackObj.ascending = true;
}


// GENERATE CARD HTML TEMPLATE FUNC
// This function  generates HTML code for a note card with specified content and styling.
// returns an HTML string that represents a note card UI.
function generateCardHTMLTemplates(...cardDetails) {
  const [introText, cardData, cardBody] = cardDetails;
  if (cardData.image) {
    return `<!-- note card element with picture start-->
          <div class="row g-0 note-card-center">
              <!-- note card image -->
              <div class="card-head-wrapper">
                  <img src="${cardData.image}" class="img-fluid card-img" alt="note cover img">
              </div>
              <!-- card body -->
              <div class="card-body-wrappper">
                  <div class="card-body">
                      <div class="d-flex justify-content-between">
                          <!-- card title -->
                          <h5 class="card-title">${cardData.title}</h5>
                          <!-- card btn -->
                          <button type="button" class="btn my-0 py-0">
                              <i class="fa-solid fa-arrow-right note-btn"></i>
                          </button>
                      </div>
                      <!-- card subtitle -->
                      <h6 class="card-subtitle mb-3 mt-1 text-body-secondary light-txt">
                          <span>${introText}</span> on <span class="note-day">${cardData.day}</span>
                        <span class="note-date">${cardData.date}</span>  
                        <span class="note-month">${cardData.month}</span> 
                        <span class="note-time">${cardData.hrs}:${cardData.mins}</span> 
                        <span class="note-time-suffix">${cardData.pm_am}.</span>
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
                        <h5 class="card-title">${cardData.title}</h5>
                        <!-- card btn -->
                        <button type="button" class="btn my-0 py-0">
                            <i class="fa-solid fa-arrow-right note-btn"></i>
                        </button>
                    </div>
                    <!-- card subtitle -->
                    <h6 class="card-subtitle mb-3 mt-1 text-body-secondary light-txt">
                        <span>${introText}</span> on <span class="note-day">${cardData.day}</span>
                        <span class="note-date">${cardData.date}</span>  
                        <span class="note-month">${cardData.month}</span> 
                        <span class="note-time">${cardData.hrs}:${cardData.mins}</span> 
                        <span class="note-time-suffix">${cardData.pm_am}.</span>
                    </h6>
                    <!-- card text -->
                    <p class="card-text dark-txt line-h card-txt-color">${cardBody}</p>
                </div>
            </div>
        </div>`;
  }
}

// BUILD NOTE CARD UI FUNC
// this function saves the note data to local storage.
// the data is then processed(image-blob, is converted to a URLstring and saved in LS).
// the data is used to build cards in the UI when the user create a note entry or when the app is initialized.
function buildNoteCardUI(...noteDetails) {
  const [noteData, saveNoteDataFunc, id] = noteDetails;
  // handles card creation when the user creates a new note
  if (saveNoteDataFunc && noteData) {
    readNoteData();
  } else if (!saveNoteDataFunc && !noteData) {
    // handles card creation when the app is initilized by loading data from local storage
    let notesArray = retriveFromLocalStorage();
    notesArray.forEach(note => {initCard(note)});
  } 
  else if(noteData && !saveNoteDataFunc){
    // handles card creation when the user selects favourites
    noteData.forEach(note => {initCard(note)});
  }

  // INIT CARD FUNCTION
  // This function uses data from array parameter to create a new card element in the DOM.
  function initCard(arry) {
    let cardPrefix;
    const notesContainer = document.querySelector(".notes-container");
    const cardElement = document.createElement("article");
    // if so then update the card UI with an edit prefix
    arry.isEdited === true ? (cardPrefix = "Edited") : (cardPrefix = "Created");
    // trim note body text for the card UI
    let cardText = trimUiCardText(arry.body);
    cardElement.classList.add("card", "notes-card", "bg-body-tertiary");
    id ? (cardId = id) : (cardId = arry.id);
    cardElement.dataset.noteId = cardId;
    cardElement.innerHTML = generateCardHTMLTemplates(cardPrefix,arry,cardText);
    notesContainer.append(cardElement);
    makeCardsClickable();
    if (!editFlag) {
      reOrderCards("newest")
    }
    resetAll()
    // sets up the functionality to clear notes
    if (notesContainer.childElementCount > 0) {
      manageClearAllNotes();
    }
  }

  // READ NOTE DATA FUNC
  //Processed data from then retrived and used to Populate cards in the UI
  async function readNoteData() {
    let element = await saveNoteDataFunc(noteData);
    element = element.filter((note) => {
      if (note.id === noteData.id) {
        return note;
      }
    });
    element = element.pop();
    initCard(element);
  }
}

// BUILD EMPTY NOTE PLACEHOLDER FUNC
// this func returns the app to its default state when note data is has been created
// or the note data has been cleard
function buildEmptyNotePlaceHolder(placeholderTxt) {
  const notesContainer = document.querySelector(".notes-container");
  const feedBackTxt = document.querySelector(".feedback-text");
  const gridListIcon = document.querySelector(".icon-1");
  const upDownIcon = document.querySelector(".icon-2");
  const emptyNotesPlaceHolder = document.createElement("article");

  emptyNotesPlaceHolder.classList.add("note-place-holder");
  emptyNotesPlaceHolder.innerHTML = placeholderTxt;
  // reset all the feedback element to an empty state
  feedBackTxt.textContent = "";
  gridListIcon.classList.remove("fa-list","fa-border-all");
  upDownIcon.classList.remove("fa-arrow-up","fa-arrow-down");
  notesContainer.append(emptyNotesPlaceHolder);
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
function UpdateEditedCards(...cardDetails){
  const [noteData,element,cardId]= cardDetails;
  const updateNoteBtn = document.querySelector(".create-note-btn");
  const formModal = document.querySelector(".form-modal");
	// trim note body text for the card UI
	let cardText = trimUiCardText(noteData.body);
	if (editFlag && (coverImgObj || coverImgFlag)) {
     // handles cases where the user edits the note and includes a cover image
      (async ()=>{
          let processedImg = await retriveImageData();
          noteData.image = processedImg;
          element.innerHTML = generateCardHTMLTemplates( "Edited",noteData,cardText);
          editInLocalStorage(noteData,cardId);
          // hide form inputs and reset the app
          hideModals(formModal);
          resetAll()
      })();

  } 
	else if (editFlag && (!coverImgObj || !coverImgFlag)) {
		// handles cases where the user edits the note and does not includes a cover image
    element.innerHTML = generateCardHTMLTemplates( "Edited",noteData,cardText);
    editInLocalStorage(noteData,cardId);
    updateNoteBtn.textContent = "Create note";
    // hide form inputs and reset the app
    resetAll()
  }
  // RETRIVE PROCCESSED IMG DATA FUNC
  async function retriveImageData() {
    let data = await initImageProcessing(noteData);
    return data;
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
  const offCanvas = document.querySelector(".nav-off-canvas");
  const navToggle = document.querySelector(".nav-toggle-btn");
  const noteBody = document.querySelector(".note-dp-txt");
  const noteDay = document.querySelector(".note-dp-day");
  const noteDate = document.querySelector(".note-dp-date");
  const noteMonth = document.querySelector(".note-dp-month");
  const noteTime = document.querySelector(".note-dp-time");
  const noteDpTitle = document.querySelector(".note-dp-title");
  const noteTimeSuffix = document.querySelector(".notedp-time-suffix");
  const noteDisplayBtnsWrapper = document.querySelector(".note-controls");
  let noteElement = retriveFromLocalStorage();
  // when the nav-off-canvas component is open close it
  navToggle.classList.remove("show");
  offCanvas.classList.remove("show-nav-off-canvas");

  // filter out the note object whose id is a match to the id of the clicked card
  noteElement = noteElement.filter(note => {if(note.id === id){return note;}})
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
  if(noteElement.hasImage){
  noteImgSection.innerHTML = `<div class="col-12 note-dp-img-wrapper p-0">
      <img class="img-fluid h-100" src=${noteElement.image} alt="note display img">
  </div>`
  }
  // if the note object favourite flag is set to true then update the state of the favourite btns
  if(noteElement.isFavourite){
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
// This function resets the app to its default state.
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
// This function shortens the file name of an image if it exceeds
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
  const notesContainer = document.querySelector(".notes-container")
  const noteDisplayModal = document.querySelector(".display-note-modal");
  const noteCards = document.querySelectorAll(".notes-card");
  const mainAlerts = document.querySelector(".main-alerts-display");
  let id = noteDisplayModal.dataset.noteId;

  //deletes card that matches the noteId from the UI.
  noteCards.forEach((card) => {
    if (id === card.dataset.noteId) {
      card.remove()}
    });
  hideModals(noteDisplayModal);
  // display alert
  alrtMsg =
    '<p>Note Deleted <span class="pl-1"><i class="fa-solid fa-circle-xmark"></i></span></p>';
  displayAlert(mainAlerts, alrtMsg, "show-main-alert", 4000);
  deleteNoteFromLocalStorage(id);
  resetAll();

  // remove the btn from the display
  if (notesContainer.childElementCount === 0) {
    let text =  `<p><span class="px-3"><i class="fa-regular fa-circle-plus"></i></span><span>No Notes Yet!</span></p>`;
    buildEmptyNotePlaceHolder(text);
  }
}

// EDIT NOTE FUNC
// This function retrieves a note OBJECT from local storage, 
// updates the UI to allow editing of the note, 
// and populates form inputs with the note's data for editing.
function editNote(){
  const noteDisplayModal = document.querySelector(".display-note-modal");
  const noteCards = document.querySelectorAll(".notes-card");
  const form = document.getElementById("form");
  // get the current note id from the note modal dispaly
  let id = noteDisplayModal.dataset.noteId;
  editFlag = true;
  let notesArray = retriveFromLocalStorage();
  hideModals(noteDisplayModal);
// using the card id to implement a test,
// iterate through the cards on the UI
// apply styles to give visual cue to the user based on these test
// showing which card is being edited and disabling the rest of the cards
 noteCards.forEach(card =>{
    if(card.dataset.noteId !== id){
      card.setAttribute("inert","");
    }

    if(card.dataset.noteId === id){
      card.classList.add("editable-card");
    }
    })

    // search for a match with the card id from the array 
		// of objects gotten from local storage
    notesArray = notesArray.filter( note =>{
        if(note.id === id){
          return note;
        }
    })

    notesArray = notesArray.pop();
    // update the values of the form inputs with values from note object.
    form.elements.note_title.value = notesArray.title;
    form.elements.note.value = notesArray.body;
}

// ADD TO FAVOURITES FUNC
function addToFavourites(noteId){
  const noteDisplayBtnsWrapper = document.querySelector(".note-controls");
  // update the state of the heart element in the UI
  noteDisplayBtnsWrapper.classList.toggle("show");
  // retrive notes and favourites data from local storage
  let notesArray = retriveFromLocalStorage();
  let favsArry = retriveFavsDataLocalStorage();
  if(noteDisplayBtnsWrapper.classList.contains("show")){
    // handles cases where the note has been added to favourites
    notesArray = notesArray.map(note=>{
      if(noteId === note.id){ return {...note,isFavourite:true}};
          return note;});
    localStorage.setItem("noteEntries", JSON.stringify(notesArray));
    notesArray = notesArray.filter(note=>{if(noteId === note.id){return note}})
    notesArray = notesArray.pop(); 
    favsArry.push(notesArray);
    localStorage.setItem("favNotes", JSON.stringify(favsArry));
  }
  else if(!noteDisplayBtnsWrapper.classList.contains("show")){
    // handles cases where the note has been removed from favourites
    favsArry = favsArry.filter(note=>{if(noteId !== note.id){return note}});
    notesArray = notesArray.map(note=>
      {if(noteId === note.id){return{...note,isFavourite:false}}
        return note});
    localStorage.setItem("noteEntries", JSON.stringify(notesArray));
    localStorage.setItem("favNotes", JSON.stringify(favsArry));
  }
}

// ORDER CARDS FUNC
// This function reverses the order of the note cards on the page 
function reOrderCards(ans){
  const notesContainer = document.querySelector(".notes-container");
	let noteCards = document.querySelectorAll(".notes-card");
  const cardList = [...noteCards];
	noteCards.forEach(card =>{
		card.remove()});

  if(ans === "newest"){
    cardList.reverse().forEach(card=>{
      notesContainer.append(card)})
  }
  else if(ans === "oldest"){
    cardList.reverse().forEach(card=>{
      notesContainer.append(card)})
  }
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
	}else if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){
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
  //if the flag is set to true, it coverts the coverImgObj(blob) to a string.
  //by performing a file reading operation.
  let data;
  if(noteData.hasImage){ 
    // consume data generated from the promise that handles the image processing
    async function retriveImageData() {
      data = await initImageProcessing(noteData);
      return data;
    }
    return retriveImageData();
  }
  else{
    notesArray = retriveFromLocalStorage();
    notesArray.push(noteData);
    localStorage.setItem("noteEntries", JSON.stringify(notesArray));
    // wrap the data in a promise  
    // so it's return values can be properly consumed
    // in the async function where it is called.
    async function processData(){
      data = await Promise.resolve(retriveFromLocalStorage()); 
      return data;
     }
     return processData()
  }

}

// INIT IMAGE PROCESSING FUNC
// This function processes an image file, updates a note object with the image
// data, and either saves the note to local storage or returns it based on an edit flag.
function initImageProcessing(noteObj){
  return new Promise(resolve=>{
    let fileReading = new FileReader()
    fileReading.onload = (e)=>{
      noteObj.image = e.target.result;
      // updates the noteObj (object) image property the converted blob data
      if(editFlag){
        resolve(noteObj.image);
      }else{
        let notesArray = retriveFromLocalStorage();
        notesArray.push(noteObj);
        localStorage.setItem("noteEntries", JSON.stringify(notesArray));
        resolve(retriveFromLocalStorage());
      }
    }
    fileReading.readAsDataURL(noteObj.image)
    
  })
}

// RETRIVE NOTE DATA FORM LOCAL STORAGE FUNC
function retriveFromLocalStorage() {
 return JSON.parse(localStorage.getItem("noteEntries")) || [];
}
// RETRIVE FAVOURITES DATA FORM LOCAL STORAGE FUNC
function retriveFavsDataLocalStorage() {
 return JSON.parse(localStorage.getItem("favNotes")) || [];
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
function editInLocalStorage(...editDetails){
const [dataObj,editId] = editDetails
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
       ...dataObj,
       isEdited:true
   }
   return note;
 });
 localStorage.setItem("noteEntries", JSON.stringify(notesArray));
}