/* ==========================================
   Resume Maker v2
   education.js
   ========================================== */


/* ==========================================
   DOM
   ========================================== */

const educationList =
document.getElementById("education-list");

const addEducation =
document.getElementById("addEducation");


/* ==========================================
   Constants
   ========================================== */

const MAX_EDUCATION = 4;


/* ==========================================
   Initialize
   ========================================== */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        // HTML ထဲမှာ ရှိပြီးသား ပထမ Row ကို initialize
        const firstRow =
        educationList.querySelector(".education-row");

        if (firstRow) {

            initEducationDate(firstRow);

        }

    }

);


/* ==========================================
   Add Button
   ========================================== */

addEducation.addEventListener(

    "click",

    () => {

        const rows =
        educationList.querySelectorAll(
            ".education-row"
        );


        /* =====================================
           Maximum Limit
           ===================================== */

        if (rows.length >= MAX_EDUCATION) {

            alert(
                `学歴は${MAX_EDUCATION}件まで追加できます。`
            );

            return;

        }


        createEducationRow();

    }

);


/* ==========================================
   Create Row
   ========================================== */

function createEducationRow(){

    const row =
    document.createElement("div");

    row.className =
    "education-row";

    row.innerHTML = `

        <td>

            <select class="education-year"></select>

        </td>

        <td>

            <select class="education-month"></select>

        </td>

        <td>

            <input
                type="text"
                class="education-school"
                placeholder="学校名">

        </td>

        <td>

            <button
                type="button"
                class="deleteEducation">

                ✕

            </button>

        </td>

    `;


    educationList.appendChild(row);


    initEducationDate(row);

}


/* ==========================================
   Initialize Date
   ========================================== */

function initEducationDate(row){

    const year =
    row.querySelector(".education-year");

    const month =
    row.querySelector(".education-month");


    for(

        let y = new Date().getFullYear() + 5;

        y >= 1950;

        y--

    ){

        year.innerHTML +=

        `<option value="${y}">${y}</option>`;

    }


    for(

        let m = 1;

        m <= 12;

        m++

    ){

        month.innerHTML +=

        `<option value="${m}">${m}</option>`;

    }


    year.value =
    new Date().getFullYear();

    month.value = 4;

}


/* ==========================================
   Delete Row
   ========================================== */

educationList.addEventListener(

    "click",

    (event) => {

        const deleteButton =
            event.target.closest(
                ".deleteEducation"
            );


        if (!deleteButton) {

            return;

        }


        const row =
            deleteButton.closest(
                ".education-row"
            );


        if (!row) {

            return;

        }


        const rows =
            educationList.querySelectorAll(
                ".education-row"
            );


        /* =====================================
           Minimum 1 Row
           ===================================== */

        if (rows.length <= 1) {

            alert(
                "学歴は最低1件必要です。"
            );

            return;

        }


        row.remove();

    }

);


/* ==========================================
   Get Education Data
   ========================================== */

function getEducationData(){

    const education = [];


    educationList

    .querySelectorAll(".education-row")

    .forEach(row=>{

        education.push({

            year:

            row.querySelector(
                ".education-year"
            ).value,


            month:

            row.querySelector(
                ".education-month"
            ).value,


            school:

            row.querySelector(
                ".education-school"
            ).value

        });

    });


    return education;

}


/* ==========================================
   Load Education Data
   ========================================== */

function loadEducationData(data){

    educationList.innerHTML = "";


    data
    .slice(0, MAX_EDUCATION)
    .forEach(item=>{

        createEducationRow();


        const row =
        educationList.lastElementChild;


        row.querySelector(
            ".education-year"
        ).value = item.year;


        row.querySelector(
            ".education-month"
        ).value = item.month;


        row.querySelector(
            ".education-school"
        ).value = item.school;

    });

}