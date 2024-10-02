/***** VARIABLES ******/
// Global DOM variables
const noteInputContainer = document.querySelector(".form-center");
const showNoteInputsBtn = document.querySelector(".create-note");
const addNoteBtn = document.querySelector(".add-note-btn");
const addCoverImageBtn = document.querySelector(".add-cover-img-btn");
const coverImageInput = document.getElementById("cover-photo-input");
const alerts = document.querySelector(".alerts");

// const form = document.getElementById('form');



// GLOBAL variables
const editFlag = false;
const hasCoverImg = false;
let coverImgObj;
let editID;
let edited;


/***** EVENT LISTENERS ******/
// displays/hide note inputs
// dynamically update the create note btn icon when create note btn clicked
showNoteInputsBtn.addEventListener("click",showNoteInputsContainer);

// creates a note after the user clicks submits
addNoteBtn.addEventListener("click",addNote);

//pulls a modal that allows the user add a cover image to their note
addCoverImageBtn.addEventListener("click",showCoverPhotoModal);

//sets up the cover photo preview when the user uploads an image
coverImageInput.addEventListener("change",addCoverImage)





/***** FUNCTIONS ******/


function addNote(e){
e.preventDefault()

}

// SHOW INPUT CONTAINER FUNC
// dynamically displays the form container that holds the note inputs .
// dynamically adjust create note btn icons
function showNoteInputsContainer(e){
    // selects the add note btn via it's eventListener
    const addBtn = e.currentTarget;
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
/*The function `showCoverPhotoModal` selects the modal element that allows user to add
  images to their notes in the DOM and adds a class to display the modal on the page.*/
function showCoverPhotoModal(){
    // selects the cover modal element in the DOM
    const coverImageModal = document.querySelector(".modal-bg")
    // adds the class of to display the modal on the page
    coverImageModal.classList.add("show-modal","slide-in-bck-top")
}

// ADD COVER IMG FUNC
/*  this function gets the image the user uploads as a cover img for their notes
    then use the readFiles function to display a preview of the cover image.*/
function addCoverImage(){
    // local DOM variables 
    const ImagePreviewContainer = document.querySelector(".cover-img-wrapper");
    const previewImgTitle = document.querySelector(".img-preview-caption");
    
    // user uploaded file is accessed via files object using index
    // and then passed to the coverImage Global Variable
    coverImgObj = coverImageInput.files[0]
    // Checks if the size of the image is greater than 500mb
    if(coverImgObj.size > 524288){
        // rest the cover uploaded file
         coverImgObj = "";
        //reset the value of the file input  
         coverImageInput.length=0;
        //  display an error message
         alerts.classList.add("show-alert");
         displayAlert(alerts,"red", "file is to large enter a file less than 500mb");
        //clear the error message  
         setTimeout(()=>{
             alerts.classList.remove("show-alert")
         },5000)
        
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



// READ FILES FUNC
/*The function `readFiles` reads a file using `FileReader` and sets the `src` attribute
 of an element to the result.
  file - The `file` parameter is the file object that you want to read.
  element - The `element` parameter in the `readFiles` function is typically a reference to an
  HTML element, such as an image element (`<img>`), where the content of the file being read will be displayed.*/
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
function displayAlert(element,color,text){
    element.style.color = `${color}`;
    element.textContent = `${text}`;

}







/***** LOCAL STORAGE ******/



/***** FUNCTIONS ******/


/**** ANIMATIONS ******/










