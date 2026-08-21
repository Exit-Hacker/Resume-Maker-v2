/* ==========================================
   Resume Maker v2
   photo.js
   ========================================== */


/* ==========================================
   DOM
   ========================================== */

const photoInput =
document.getElementById("photo");


let photoData = "";


/* ==========================================
   Upload
   ========================================== */

photoInput.addEventListener(

    "change",

    uploadPhoto

);


/* ==========================================
   Upload Photo
   ========================================== */

function uploadPhoto(event){

    const file =
    event.target.files[0];

    if(!file){

        return;

    }

    validatePhoto(file);

}


/* ==========================================
   Validate
   ========================================== */

function validatePhoto(file){

    if(

        !file.type.startsWith("image/")

    ){

        alert("画像ファイルを選択してください。");

        photoInput.value = "";

        return;

    }

    if(

        file.size >

        5 * 1024 * 1024

    ){

        alert("画像サイズは5MB以下にしてください。");

        photoInput.value = "";

        return;

    }

    readPhoto(file);

}


/* ==========================================
   Read Photo
   ========================================== */

function readPhoto(file){

    const reader =

    new FileReader();

    reader.onload =

    (event)=>{

        photoData =

        event.target.result;

    };

    reader.readAsDataURL(file);

}

/* ==========================================
   Get Photo Data
   ========================================== */

function getPhotoData(){

    return photoData;

}


/* ==========================================
   Load Photo
   ========================================== */

function loadPhoto(data){

    if(!data){

        return;

    }

    photoData = data;

}


/* ==========================================
   Clear Photo
   ========================================== */

function clearPhoto(){

    photoInput.value = "";

    photoData = "";

}


/* ==========================================
   Save Photo
   ========================================== */

function savePhotoToStorage(){

    const data = loadFromStorage() || {};

    data.photo = photoData;

    saveToStorage(data);

}


/* ==========================================
   Auto Load
   ========================================== */

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        const data = loadFromStorage();

        if(

            data &&

            data.photo

        ){

            loadPhoto(

                data.photo

            );

        }

    }

);
