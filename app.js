/***** VARIABLES ******/
// DOM variables
const coverImageInput = document.getElementById('cover-photo');
const coverImage = document.querySelector('.cover-img');
const coverImgLabelBtn = document.querySelector('.cover-img-label');
const noteCards = document.querySelectorAll('.notes-card');

// GLOBAL variables

/***** EVENT LISTENERS ******/

const scores = [60,50,60,58,54,54,
                58,50,5,54,48,69,
                34,55,51,52,44,51,
                69,64,66,55,52,61,
                46,31,57,52,44,18,
                41,53,55,61,51,44]



function generateScoresData(scoresArr){


    for(let i=0; i<scoresArr.length; i++){
        console.log("Bubble solution #"+i+" score:"+scoresArr[i]);
    }

    console.log("Bubble tests:"+scoresArr.length)

    let max = getHeighestNum(scoresArr)

    console.log("Highest bubble score:"+ max)


    for(let i=0; i<scoresArr.length; i++){
    
        if(scoresArr[i] == max){
            console.log("solutions with the highest score#:"+ [i])
        }

    }


}

function getHeighestNum(arr){
    let max=0;
    if(arr){
        for(let counter = 0; counter < arr.length; counter++){
            if(max <= arr[counter]){
                max = arr[counter]
            }
        }
    }
    return max
}



// noteCards.forEach(
//     function(card){
//         card.addEventListener('mouseover',applyShakeAnimation)
//     }
// );

// noteCards.forEach(
//     function(card){
//         card.addEventListener('mouseout',removeShakeAnimation)
//     }
    
// );




/***** FUNCTIONS ******/




/*apply shake animation to note cards function*/
// function applyShakeAnimation(){
    //     this.classList.add('shake-bottom');
    //     console.log("mouseover")
    //     // noteCards.forEach(card=>card.classList.add('shake-bottom'));
// }
// function removeShakeAnimation(){
//     this.classList.remove('shake-bottom');
//     console.log("mouseout")
//     // noteCards.forEach(card=>card.classList.remove('shake-bottom'));
// }


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





