/* ==========================================
   Resume Maker v2
   work.js
   ========================================== */


/* ==========================================
   DOM
   ========================================== */

const workList =
document.getElementById("work-list");

const addWork =
document.getElementById("addWork");


/* ==========================================
   Constants
   ========================================== */

const MAX_WORK = 4;


/* ==========================================
   Initialize
   ========================================== */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        /* HTML ထဲမှာ ရှိပြီးသား ပထမ Row */
        const firstRow =
        workList.querySelector(".work-row");


        if (firstRow) {

            initWorkDate(firstRow);

        }

    }

);


/* ==========================================
   Add Button
   ========================================== */

addWork.addEventListener(

    "click",

    () => {

        /* လက်ရှိ Row အရေအတွက် */

        const rows =
        workList.querySelectorAll(
            ".work-row"
        );


        /* =====================================
           Maximum Limit
           ===================================== */

        if (rows.length >= MAX_WORK) {

            alert(
                `職歴は${MAX_WORK}件まで追加できます。`
            );

            return;

        }


        createWorkRow();

    }

);


/* ==========================================
   Create Row
   ========================================== */

function createWorkRow(){

    const row =
    document.createElement("div");

    row.className =
    "work-row";


    row.innerHTML = `

        <select class="work-year"></select>

        <select class="work-month"></select>

        <input
            type="text"
            class="work-company"
            placeholder="会社名">

        <button
            type="button"
            class="deleteWork">

            ✕

        </button>

    `;


    workList.appendChild(row);


    initWorkDate(row);

}


/* ==========================================
   Initialize Date
   ========================================== */

function initWorkDate(row){

    const year =
    row.querySelector(".work-year");

    const month =
    row.querySelector(".work-month");


    /* ==========================================
       Year
       ========================================== */

    for(

        let y = new Date().getFullYear() + 5;

        y >= 1950;

        y--

    ){

        year.innerHTML +=

        `<option value="${y}">${y}</option>`;

    }


    /* ==========================================
       Month
       ========================================== */

    for(

        let m = 1;

        m <= 12;

        m++

    ){

        month.innerHTML +=

        `<option value="${m}">${m}</option>`;

    }


    /* ==========================================
       Default
       ========================================== */

    year.value =
    new Date().getFullYear();

    month.value = 4;

}


/* ==========================================
   Delete Row
   ========================================== */

workList.addEventListener(

    "click",

    (event) => {

        const deleteButton =
        event.target.closest(
            ".deleteWork"
        );


        if (!deleteButton) {

            return;

        }


        const row =
        deleteButton.closest(
            ".work-row"
        );


        if (!row) {

            return;

        }


        const rows =
        workList.querySelectorAll(
            ".work-row"
        );


        /* =====================================
           Minimum 1 Row
           ===================================== */

        if (rows.length <= 1) {

            alert(
                "職歴は最低1件必要です。"
            );

            return;

        }


        /* Row Delete */

        row.remove();

    }

);


/* ==========================================
   Get Work Data
   ========================================== */

function getWorkData(){

    const work = [];


    workList

        .querySelectorAll(".work-row")

        .forEach(row => {

            work.push({

                year:

                row.querySelector(
                    ".work-year"
                ).value,


                month:

                row.querySelector(
                    ".work-month"
                ).value,


                company:

                row.querySelector(
                    ".work-company"
                ).value

            });

        });


    return work;

}


/* ==========================================
   Load Work Data
   ========================================== */

function loadWorkData(data){

    workList.innerHTML = "";


    data

    .slice(0, MAX_WORK)

    .forEach(item => {

        createWorkRow();


        const row =
        workList.lastElementChild;


        row.querySelector(
            ".work-year"
        ).value = item.year;


        row.querySelector(
            ".work-month"
        ).value = item.month;


        row.querySelector(
            ".work-company"
        ).value = item.company;

    });

}