/* ==========================================
   Resume Maker v2
   preview.js
   A4 One Page Auto Fit
   ========================================== */


/* ==========================================
   Storage
   ========================================== */

const resumeData =
    loadFromStorage();


/* ==========================================
   Limits
   ========================================== */

const MAX_EDUCATION = 8;

const MAX_WORK = 6;


/* ==========================================
   Base Layout
   ========================================== */

const BASE = {

    resume: 10,

    table: 9,

    small: 8.5,

    title: 22,

    section: 11,

    padding: 4,

    gap: 8

};


/* ==========================================
   A4
   ========================================== */

const A4_HEIGHT_MM = 296;


/* ==========================================
   Initialize
   ========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if(!resumeData){

            alert(
                "履歴書データがありません。"
            );

            window.location.href =
                "index.html";

            return;

        }


        loadBasicInfo();

        loadAddress();

        loadEducationPreview(
            resumeData.education || []
        );

        loadWorkPreview(
            resumeData.work || []
        );

        loadMotivation();

        loadRequest();

        loadPhoto();


        /*
         * Wait for browser layout
         * and image rendering.
         */

        requestAnimationFrame(
            () => {

                requestAnimationFrame(
                    () => {

                        fitResumeToA4();

                    }
                );

            }
        );

    }
);


/* ==========================================
   Basic Information
   ========================================== */

function loadBasicInfo(){

    setText(
        "r-name",
        resumeData.name
    );

    setText(
        "r-furigana",
        resumeData.furigana
    );

    setText(
        "r-gender",
        resumeData.gender
    );

    setText(
        "r-age",
        resumeData.age
    );

    setText(
        "r-phone",
        resumeData.phone
    );

    setText(
        "r-email",
        resumeData.email
    );

    setText(
        "r-birthday",
        resumeData.birthday
    );

    setText(
        "r-resume-date",
        resumeData.resumeDate
    );

}


/* ==========================================
   Address
   ========================================== */

function loadAddress(){

    setText(
        "r-postal",
        resumeData.postalCode
    );

    setText(
        "r-address-furigana",
        resumeData.addressFurigana
    );

    setText(
        "r-address",
        resumeData.address
    );

    setText(
        "r-building",
        resumeData.building
    );

    setText(
        "r-building-furigana",
        resumeData.buildingFurigana
    );

}


/* ==========================================
   Education
   ========================================== */

function loadEducationPreview(data){

    const table =
        document.getElementById(
            "education-body"
        );


    if(!table){

        return;

    }


    table.innerHTML = "";


    data
        .slice(0, MAX_EDUCATION)
        .forEach(item => {

            const row =
                document.createElement("tr");


            const year =
                document.createElement("td");

            year.textContent =
                item.year || "";


            const month =
                document.createElement("td");

            month.textContent =
                item.month || "";


            const school =
                document.createElement("td");

            school.textContent =
                item.school || "";


            row.appendChild(year);

            row.appendChild(month);

            row.appendChild(school);


            table.appendChild(row);

        });

}


/* ==========================================
   Work
   ========================================== */

function loadWorkPreview(data){

    const table =
        document.getElementById(
            "work-body"
        );


    if(!table){

        return;

    }


    table.innerHTML = "";


    data
        .slice(0, MAX_WORK)
        .forEach(item => {

            const row =
                document.createElement("tr");


            const year =
                document.createElement("td");

            year.textContent =
                item.year || "";


            const month =
                document.createElement("td");

            month.textContent =
                item.month || "";


            const company =
                document.createElement("td");

            company.textContent =
                item.company || "";


            row.appendChild(year);

            row.appendChild(month);

            row.appendChild(company);


            table.appendChild(row);

        });

}


/* ==========================================
   Motivation
   ========================================== */

function loadMotivation(){

    const value =
        resumeData.motivation;


    if(value){

        setText(
            "r-motivation",
            value
        );

    }

}


/* ==========================================
   Request
   ========================================== */

function loadRequest(){

    const value =
        resumeData.request;


    if(value){

        setText(
            "r-request",
            value
        );

    }

}


/* ==========================================
   Photo
   ========================================== */

function loadPhoto(){

    if(!resumeData.photo){

        return;

    }


    const photo =
        document.getElementById(
            "r-photo"
        );


    if(photo){

        photo.src =
            resumeData.photo;

    }

}


/* ==========================================
   Helper
   ========================================== */

function setText(
    id,
    value
){

    const element =
        document.getElementById(id);


    if(element){

        element.textContent =
            value || "";

    }

}


/* ==========================================
   Apply Scale
   ========================================== */

function applyScale(scale){

    const resume =
        document.querySelector(
            ".resume"
        );


    if(!resume){

        return;

    }


    resume.style.setProperty(
        "--resume-font",
        `${BASE.resume * scale}pt`
    );


    resume.style.setProperty(
        "--table-font",
        `${BASE.table * scale}pt`
    );


    resume.style.setProperty(
        "--small-font",
        `${BASE.small * scale}pt`
    );


    resume.style.setProperty(
        "--title-font",
        `${BASE.title * scale}pt`
    );


    resume.style.setProperty(
        "--section-font",
        `${BASE.section * scale}pt`
    );


    resume.style.setProperty(
        "--cell-padding",
        `${BASE.padding * scale}px`
    );


    resume.style.setProperty(
        "--section-gap",
        `${BASE.gap * scale}px`
    );

}


/* ==========================================
   Get A4 Available Height
   ========================================== */

function getA4AvailableHeight(){

    const resume =
        document.querySelector(
            ".resume"
        );


    if(!resume){

        return 0;

    }


    /*
     * clientHeight includes
     * padding but not border.
     */

    return resume.clientHeight;

}


/* ==========================================
   Check Overflow
   ========================================== */

function doesOverflow(){

    const resume =
        document.querySelector(
            ".resume"
        );


    if(!resume){

        return true;

    }


    return (
        resume.scrollHeight
        >
        resume.clientHeight + 1
    );

}


/* ==========================================
   Fit A4
   ========================================== */

function fitResumeToA4(){

    const resume =
        document.querySelector(
            ".resume"
        );


    if(!resume){

        return;

    }


    /*
     * Keep overflow hidden.
     */

    resume.style.overflow =
        "hidden";


    /*
     * ------------------------------------------------
     * PHASE 1
     * Find a scale that fits.
     * ------------------------------------------------
     *
     * Start very large.
     */

    let low = 0.60;

    let high = 1.60;

    let best = low;


    /*
     * Binary search.
     *
     * This finds the largest font
     * that still fits inside A4.
     */

    for(
        let i = 0;
        i < 18;
        i++
    ){

        const middle =
            (low + high) / 2;


        applyScale(middle);


        /*
         * Force layout.
         */

        void resume.offsetHeight;


        if(
            doesOverflow()
        ){

            /*
             * Too large.
             */

            high =
                middle;

        }

        else{

            /*
             * Fits.
             * Try even larger.
             */

            best =
                middle;

            low =
                middle;

        }

    }


    applyScale(best);


    void resume.offsetHeight;


    /*
     * ------------------------------------------------
     * PHASE 2
     * Final check.
     * ------------------------------------------------
     */

    if(
        doesOverflow()
    ){

        applyScale(
            best - 0.01
        );

    }


    console.log(
        "A4 font scale:",
        best.toFixed(3)
    );

}


/* ==========================================
   Re-fit Before Print
   ========================================== */

const printButton =
    document.getElementById(
        "printResume"
    );


if(printButton){

    printButton.addEventListener(
        "click",
        () => {

            /*
             * Fit again.
             */

            fitResumeToA4();


            /*
             * Give browser time
             * to recalculate layout.
             */

            setTimeout(
                () => {

                    window.print();

                },
                150
            );

        }
    );

}


/* ==========================================
   Re-fit After Window Resize
   ========================================== */

window.addEventListener(
    "resize",
    () => {

        fitResumeToA4();

    }
);