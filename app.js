/***** VARIABLES ******/
// DOM variables
const noteInputContainer = document.querySelector(".form-center");
const showNoteInputsBtn = document.querySelector(".create-note");
const addNoteBtn = document.querySelector(".add-note-btn");

// const form = document.getElementById('form');
const coverImageInput = document.getElementById('cover-photo');
const coverImage = document.querySelector('.cover-img');
const coverImgLabelBtn = document.querySelector('.cover-img-label');
const noteCards = document.querySelectorAll('.notes-card');
// GLOBAL variables

/***** EVENT LISTENERS ******/
// displays/hide note inputs
// dynamically update the create note btn icon when create note btn clicked
showNoteInputsBtn.addEventListener('click',showNoteInputsContainer);

// craetes a note after the user clicks submits
addNoteBtn.addEventListener('click',addNote)





/***** FUNCTIONS ******/


function addNote(e){
e.preventDefault()

}


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

function showCoverPhotoModal(){
    
}


/***** LOCAL STORAGE ******/



/***** FUNCTIONS ******/


/**** ANIMATIONS ******/


// coverImageInput.addEventListener('change', () => {
//   const file = coverImageInput.files[0]; // Get the selected file
//   if (file) {
//     const reader = new FileReader(); // Create a FileReader instance
//     reader.onload = function(e) {
//       coverImage.src = e.target.result; // Set the src to the file's content
//     };
//     reader.readAsDataURL(file); // Read the file as a data URL
//   }
// });


// function user(name,age,nationality){
//     this.name = name;
//     this.age = age;
//     this.nationality = nationality;

//     this.introduction=function (){
//         return `Hi, my name is ${this.name}, I am ${this.age} years old and, i am a ${this.nationality}`
//     };
// }

// class user{
//     constructor(name,age,nationality){
//     this.name = name;
//     this.age = age;
//     this.nationality = nationality;
// }

//     introduction (){
//         return `Hi, my name is ${this.name}, I am ${this.age} years old and, i am a ${this.nationality}`
//     };
// }





