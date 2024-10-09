/***** VARIABLES ******/
// Global DOM variables
const showNoteInputsBtn = document.querySelector(".create-note");
const addNoteBtn = document.querySelector(".add-note-btn");
const addCoverImageBtn = document.querySelector(".add-cover-img-btn");
const coverImageInput = document.getElementById("cover-photo-input");
const closeModalBtn = document.querySelector(".close-modal-btn");
const doneBtn = document.querySelector(".done-btn");
// const form = document.getElementById('form');



// GLOBAL variables
const editFlag = false;
const CoverImgFlag = false;
let coverImgObj;
let editID;
let edited;


/***** EVENT LISTENERS ******/
// displays/hide note inputs
// dynamically update the create note btn icon when create note btn clicked
showNoteInputsBtn.addEventListener("click",showNoteInputsContainer);

// creates a note after the user clicks submits
form.addEventListener("click",addNote);

//pulls a modal that allows the user add a cover image to their note
 addCoverImageBtn.addEventListener("click",showCoverPhotoModal);

//sets up the cover photo preview when the user uploads an image
// coverImageInput.addEventListener("change",addCoverImage);
coverImageInput.addEventListener("click",()=>{ console.log("firing on click")});

// closes the cover image modal and cancels the user img inputs
// closeModalBtn.addEventListener("click",cancelCoverImgEntry);


// close the cover image modal but saves the inputed image to a variable 
// doneBtn.addEventListener("click",()=>{
//     const alerts = document.querySelector(".alerts");
//     if(coverImgObj){
//         hideCoverImgModal();
//         CoverImgFlag = true;
//     }else{
//         displayAlert(alerts,"red", "Please, pick an image or click cancle","show-alert",5000);
//     }
    
// });





/***** FUNCTIONS ******/

// ADD NEW NOTE FUNC
function addNote(e){
e.preventDefault()

}

// SHOW INPUT CONTAINER FUNC
// dynamically displays the form container that holds the note inputs .
// dynamically adjust create note btn icons
function showNoteInputsContainer(e){
    const noteInputContainer = document.querySelector(".form-center");
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
    const coverImageModal = document.querySelector(".modal-bg");
    // adds the class of to display the modal on the page
    coverImageModal.classList.add("show-modal","slide-in-bck-center");

    setTimeout(()=>{
        coverImageModal.classList.remove("slide-in-bck-center");
    },2000)
    
}

// CANCEL COVER PHOTO ENTRY FUNC
function cancelCoverImgEntry(){
    
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
                   </i>`
    /*the cover image object is reset to default */
    coverImgObj = "";
    /*image preview subtitle reset to default*/
    previewImgTitle.textContent= "image preview";
    /*the file input is also reset*/
    coverImageInput.length= 0;
    /*the selected image is removed*/
    ImagePreviewContainer.children[0].remove()
    /*the default svg image is set as the preview*/
    ImagePreviewContainer.innerHTML = previewImg;
    // the modal is then hidden
    hideCoverImgModal()
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
function addCoverImage(){
    // local DOM variables 
    const ImagePreviewContainer = document.querySelector(".cover-img-wrapper");
    const previewImgTitle = document.querySelector(".img-preview-caption");
    const alerts = document.querySelector(".alerts");
    console.log("i am being clicked")
    // user uploaded file is accessed via files object using index
    // and then passed to the coverImage Global Variable
    coverImgObj = coverImageInput.files[0]
    // Checks if the size of the image is greater than 500kb
    if(coverImgObj.size > 524288){
        // reset the cover uploaded file
         coverImgObj = "";
        //reset the value of the file input  
         coverImageInput.value="";
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










