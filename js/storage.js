/* ==========================================
   Resume Maker v2
   storage.js
   ========================================== */

const STORAGE_KEY = "resumeData";


/* ==========================================
   Save
   ========================================== */

function saveToStorage(data){

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(data)

    );

}


/* ==========================================
   Load
   ========================================== */

function loadFromStorage(){

    const data =

        localStorage.getItem(

            STORAGE_KEY

        );

    if(!data){

        return null;

    }

    return JSON.parse(data);

}


/* ==========================================
   Remove
   ========================================== */

function removeStorage(){

    localStorage.removeItem(

        STORAGE_KEY

    );

}


/* ==========================================
   Clear
   ========================================== */

function clearStorage(){

    localStorage.clear();

}

/* ==========================================
   Has Resume Data
   ========================================== */

function hasResumeData(){

    return localStorage.getItem(

        STORAGE_KEY

    ) !== null;

}


/* ==========================================
   Fill Form
   ========================================== */

function fillFormFromStorage(){

    const data = loadFromStorage();

    if(!data){

        return;

    }

    document.getElementById("name").value =
    data.name || "";

    document.getElementById("furigana").value =
    data.furigana || "";

    document.getElementById("phone").value =
    data.phone || "";

    document.getElementById("email").value =
    data.email || "";

    document.getElementById("postalCode").value =
    data.postalCode || "";

    document.getElementById("addressFurigana").value =
    data.addressFurigana || "";

    document.getElementById("address").value =
    data.address || "";

    document.getElementById("building").value =
    data.building || "";

    document.getElementById("buildingFurigana").value =
    data.buildingFurigana || "";

    document.getElementById("gender").value =
    data.gender || "";

    // document.getElementById("resumeDate").value =
    // data.resumeDate || "";

}


/* ==========================================
   Auto Load
   ========================================== */

function autoLoadResume(){

    if(hasResumeData()){

        fillFormFromStorage();

    }

}


/* ==========================================
   Clear Resume
   ========================================== */

function clearResume(){

    removeStorage();

}


/* ==========================================
   Initialize
   ========================================== */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        autoLoadResume();

    }

);