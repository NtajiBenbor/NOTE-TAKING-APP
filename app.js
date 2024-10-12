/***** VARIABLES ******/
// Global DOM variables
const showInputsBtn = document.querySelector(".show-note-inputs");
const createNoteBtn = document.querySelector(".create-note");
const pickCoverImgBtn = document.querySelector(".add-cover-img-btn");
const fileUploadModal = document.querySelector(".cover-img-modal");
const fileUploadInput= document.getElementById("cover-photo-input");
const form = document.getElementById('form');




// GLOBAL variables
let editFlag = false;
let CoverImgFlag = false;
let coverImgObj;
let editID;
let edited;


/***** EVENT LISTENERS ******/
// displays/hide note inputs
// dynamically update the create note btn icon when create note btn clicked
showInputsBtn.addEventListener("click",showNoteInputsContainer);

// creates a note after the user clicks submits
form.addEventListener("click",addNote);

//pulls a modal that allows the user add a cover image to their note
 pickCoverImgBtn.addEventListener("click",showCoverPhotoModal);

//sets up the cover photo preview when the user uploads an image
fileUploadModal.addEventListener("click",manageFileInputModal);

//change event fires the addCoverImage func(it displays a preview of the selected img) 
fileUploadInput.addEventListener("change",addCoverImage);











/***** FUNCTIONS ******/

// ADD NEW NOTE FUNC
function addNote(event){
// event.preventDefault()

}

// SHOW INPUT CONTAINER FUNC
// dynamically displays the form container that holds the note inputs .
// dynamically adjust create note btn icons
function showNoteInputsContainer(event){
    const noteInputContainer = document.querySelector(".form-center");
    // selects the add note btn via it's eventListener
    const addBtn = event.currentTarget;

    /* toggles the CSS classes that dynamically controls the height values
       of the note input container displaying the note input on user interaction
       with the addnote button*/  
    noteInputContainer.classList.toggle('show-input');
    /* dynamically changes the icons that displays within the add note button 
       based on user interaction. this is done by applying the show-btn class
       to the button */
    addBtn.classList.toggle('show-btn');

   
}


// SHOWCOVER PHOTO MODAL FUNC
/*The function `showCoverPhotoModal` selects the modal element that allows the user to add
  images to their notes. It displays the modal by adding a class to it.*/
  function showCoverPhotoModal(){
    // selects the cover modal element in the DOM
    const coverImageModal = document.querySelector(".modal-bg");
    // adds the class of to display the modal on the page
    coverImageModal.classList.add("show-modal","slide-in-bck-center");

    setTimeout(()=>{
        coverImageModal.classList.remove("slide-in-bck-center");
    },2000)
    
}


// HIDE MODAL FUNC
/* The function `hideCoverImgModal` hides a modal with a cover image by adding and removing CSS classes for animation.
 */
function hideCoverImgModal(){
    const coverImageModal = document.querySelector(".modal-bg");
    coverImageModal.classList.add("slide-out-bck-center");
    
    setTimeout(()=>{
        coverImageModal.classList.remove("show-modal");
        coverImageModal.classList.remove("slide-out-bck-center");
    },1000)
}


// ADD COVER IMG FUNC
/*  this function gets the image the user uploads as a cover img for their notes
    then use the readFiles function to display a preview of the cover image.*/
function addCoverImage(event){
    // event.stopPropagation()
    const ImagePreviewContainer = document.querySelector(".cover-img-wrapper");
    const previewImgTitle = document.querySelector(".img-preview-caption");
    const alerts = document.querySelector(".alerts");
    const fileUploadInput= document.getElementById("cover-photo-input");
    // user uploaded file is accessed via files object using index
    // and then passed to the coverImage Global Variable
    coverImgObj = fileUploadInput.files[0]
    // Checks if the size of the image is greater than 500kb
    if(coverImgObj.size > 524288){
        // reset the cover uploaded file
         coverImgObj = "";
        //reset the value of the file input  
         fileUploadInput.value="";
        //  display an error message
         displayAlert(alerts,"red", "file is to large enter a file less than 500mb","show-alert",5000);
        
    }else{
        // an image element is created. this element is used to handle the preview
        const previewImg = document.createElement("img");
        // CSS styling is add to the created element
        previewImg.classList.add("img-fluid","cover-img");
        // this function reads the file in the cover img variable
        // then updates the src property of the img element that was created  
        readFiles(coverImgObj,previewImg)
        // removes the default/placeholder img
        ImagePreviewContainer.children[0].remove()
        // displays the uploaded img as a preview
        ImagePreviewContainer.append(previewImg )
    }
    // updates the img caption with uploaded img name
     previewImgTitle.textContent = coverImgObj.name;


}


// SAVE COVER PHOTO IMG FUNC
/**
 * The function `saveImg` checks if an image object is provided, hides a modal and sets a flag.
 * @param imgObj - The `imgObj` parameter is an object that represents an image. It is used to  check if an image object is provided as input to the `saveImg` function.
 * @param alertMsg - The `alertMsg` parameter in the `saveImg` function is a message that will be
 displayed to the user if the `imgObj` parameter is not provided or is falsy. 
 */
 function saveImg(imgObj,alertMsg){
    if(imgObj){
        hideCoverImgModal();
        CoverImgFlag = true;
    }else{
        displayAlert(alertMsg,"red", "Please, pick an image or click cancel","show-alert",5000);
    }
}


// CANCEL COVER PHOTO ENTRY FUNC
/**
 * The function `cancelCoverImgEntry` resets the cover image preview to a default placeholder and
 * clears the selected image input.
 */
function cancelCoverImgEntry(){
    
    const previewImgTitle = document.querySelector(".img-preview-caption");
    const ImagePreviewContainer = document.querySelector(".cover-img-wrapper");
    const fileUploadInput= document.getElementById("cover-photo-input");
    /*the default svg file is saved in a variable*/
    let previewImg = `<!-- place holder image for preview image -->
                   <i>
                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"
                           fill="currentColor" class="size-4">
                           <path fill-rule="evenodd"
                               d="M2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Zm10.5 5.707a.5.5 0 0 0-.146-.353l-1-1a.5.5 0 0 0-.708 0L9.354 9.646a.5.5 0 0 1-.708 0L6.354 7.354a.5.5 0 0 0-.708 0l-2 2a.5.5 0 0 0-.146.353V12a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5V9.707ZM12 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
                               clip-rule="evenodd" />
                       </svg>
                   </i>`
    /*the cover image object is reset to default */
    coverImgObj = "";
    /*image preview subtitle reset to default*/
    previewImgTitle.textContent= "image preview";
    /*the file input is also reset*/
    fileUploadInput.value= "";
    /*the selected image is removed*/
    ImagePreviewContainer.children[0].remove()
    /*the default svg image is set as the preview*/
    ImagePreviewContainer.innerHTML = previewImg;

    console.log("firing cancel")

    // the modal is then hidden
    hideCoverImgModal()
}


// MANAGE FILE INPUT MODAL FUNC
/**
 * The function `manageFileInputModal` handles events related to a file input modal, allowing users to select, save, or cancel cover images.
 * @param event - The `event` parameter in the `manageFileInputModal` function is an object that
 * represents the event that occurred, such as a click or change event. It contains information about
 * the event, including the target element that triggered the event. In this case, the function is
 * using the `event.target
 */
function manageFileInputModal(event){
    let element = event.target;
    const closeModalBtn = document.querySelector(".close-modal-btn");
    const saveImgBtn = document.querySelector('.done-btn');
    const alerts = document.querySelector(".alerts");  

    if(element.closest("button") === closeModalBtn){

       // closes the cover image modal and cancels the user img inputs
       cancelCoverImgEntry();

    }else if(element.closest('.done-btn') === saveImgBtn){

        // closes the cover image modal but saves the inputed image to a variable 
        saveImg(coverImgObj,alerts);
           
    }

}



// READ FILES FUNC
/** 
The function `readFiles` reads a file using `FileReader` and sets the `src` attribute
 of an element to the result.
  * @param file - The `file` parameter is the file object that you want to read.
  * @param element - The `element` parameter in the `readFiles` function is typically a reference to an HTML element, such as an image element (`<img>`), where the content of the file being read will be displayed.*/
function readFiles(file,element){
    // intantiates a new fileRead instance
    const reader = new FileReader();
    // asynchronously updates the element src with the result of the file reading 
    reader.onload =(e)=>{
       element.src = e.target.result 
    }
    // file is being read here
    reader.readAsDataURL(file)
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
function displayAlert(element,color,text,d_class,duration){
    element.style.color = `${color}`;
    element.textContent = `${text}`;

    element.classList.add(`${d_class}`);
    setTimeout(()=>{
        element.classList.remove(`${d_class}`);
    },duration)

}












/***** LOCAL STORAGE ******/



/***** FUNCTIONS ******/


/**** ANIMATIONS ******/










