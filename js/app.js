/* ==========================================
   Resume Maker v2
   app.js
   ========================================== */


/* ==========================================
   DOM
   ========================================== */

const birthYear =
    document.getElementById("birthYear");

const birthMonth =
    document.getElementById("birthMonth");

const birthDay =
    document.getElementById("birthDay");

const age =
    document.getElementById("age");

const resumeDate =
    document.getElementById("resumeDate");

const generateResume =
    document.getElementById("generateResume");

const phone =
    document.getElementById("phone");

const resetForm =
    document.getElementById("resetForm");


/* ==========================================
   Initialize
   ========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initBirthday();

        initResumeDate();

        calculateAge();

    }
);


/* ==========================================
   Resume Date
   ========================================== */

function initResumeDate(){

    if(!resumeDate){

        return;

    }

    const today =
        new Date();

    const yyyy =
        today.getFullYear();

    const mm =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");

    const dd =
        String(
            today.getDate()
        ).padStart(2, "0");

    resumeDate.value =
        `${yyyy}-${mm}-${dd}`;

}


/* ==========================================
   Birthday
   ========================================== */

function initBirthday(){

    if(
        !birthYear ||
        !birthMonth ||
        !birthDay
    ){

        return;

    }


    const currentYear =
        new Date().getFullYear();


    birthYear.innerHTML = "";

    birthMonth.innerHTML = "";


    for(
        let y = currentYear;
        y >= 1950;
        y--
    ){

        birthYear.innerHTML += `
            <option value="${y}">
                ${y}
            </option>
        `;

    }


    for(
        let m = 1;
        m <= 12;
        m++
    ){

        birthMonth.innerHTML += `
            <option value="${m}">
                ${m}
            </option>
        `;

    }


    updateBirthDay();

}


/* ==========================================
   Update Birthday
   ========================================== */

function updateBirthDay(){

    if(
        !birthYear ||
        !birthMonth ||
        !birthDay
    ){

        return;

    }


    birthDay.innerHTML = "";


    const y =
        parseInt(
            birthYear.value
        );

    const m =
        parseInt(
            birthMonth.value
        );


    const lastDay =
        new Date(
            y,
            m,
            0
        ).getDate();


    for(
        let d = 1;
        d <= lastDay;
        d++
    ){

        birthDay.innerHTML += `
            <option value="${d}">
                ${d}
            </option>
        `;

    }

}


/* ==========================================
   Calculate Age
   ========================================== */

function calculateAge(){

    if(
        !birthYear ||
        !birthMonth ||
        !birthDay ||
        !age
    ){

        return;

    }


    const today =
        new Date();


    const birth =
        new Date(
            Number(birthYear.value),
            Number(birthMonth.value) - 1,
            Number(birthDay.value)
        );


    let result =
        today.getFullYear()
        -
        birth.getFullYear();


    const month =
        today.getMonth()
        -
        birth.getMonth();


    if(
        month < 0 ||
        (
            month === 0 &&
            today.getDate() < birth.getDate()
        )
    ){

        result--;

    }


    age.value =
        result;

}


/* ==========================================
   Birthday Events
   ========================================== */

if(birthYear){

    birthYear.addEventListener(
        "change",
        () => {

            updateBirthDay();

            calculateAge();

        }
    );

}


if(birthMonth){

    birthMonth.addEventListener(
        "change",
        () => {

            updateBirthDay();

            calculateAge();

        }
    );

}


if(birthDay){

    birthDay.addEventListener(
        "change",
        calculateAge
    );

}


/* ==========================================
   Phone Number Auto Format
   ========================================== */

if(phone){

    phone.addEventListener(
        "input",
        () => {

            let value =
                phone.value
                    .replace(/\D/g, "")
                    .substring(0, 11);


            if(value.length > 7){

                value =
                    value.slice(0, 3)
                    + "-"
                    + value.slice(3, 7)
                    + "-"
                    + value.slice(7);

            }

            else if(value.length > 3){

                value =
                    value.slice(0, 3)
                    + "-"
                    + value.slice(3);

            }


            phone.value =
                value;

        }
    );

}


/* ==========================================
   Generate Resume
   ========================================== */

if(generateResume){

    generateResume.addEventListener(
        "click",
        () => {

            if(
                typeof validateForm === "function" &&
                !validateForm()
            ){

                return;

            }


            saveResume();

        }
    );

}


/* ==========================================
   Get Education Data
   ========================================== */

function getEducationData(){

    const rows =
        document.querySelectorAll(
            "#education-list .education-row"
        );


    const data = [];


    rows.forEach(row => {

        const year =
            row.querySelector(
                ".education-year"
            );

        const month =
            row.querySelector(
                ".education-month"
            );

        const school =
            row.querySelector(
                ".education-school"
            );


        if(
            year ||
            month ||
            school
        ){

            data.push({

                year:
                    year
                    ? year.value
                    : "",

                month:
                    month
                    ? month.value
                    : "",

                school:
                    school
                    ? school.value
                    : ""

            });

        }

    });


    return data;

}


/* ==========================================
   Get Work Data
   ========================================== */

function getWorkData(){

    const rows =
        document.querySelectorAll(
            "#work-list .work-row"
        );


    const data = [];


    rows.forEach(row => {

        const year =
            row.querySelector(
                ".work-year"
            );

        const month =
            row.querySelector(
                ".work-month"
            );

        const company =
            row.querySelector(
                ".work-company"
            );


        if(
            year ||
            month ||
            company
        ){

            data.push({

                year:
                    year
                    ? year.value
                    : "",

                month:
                    month
                    ? month.value
                    : "",

                company:
                    company
                    ? company.value
                    : ""

            });

        }

    });


    return data;

}


/* ==========================================
   Get Form Data
   ========================================== */

function getFormData(){

    return {

        name:
            document.getElementById(
                "name"
            )?.value || "",


        furigana:
            document.getElementById(
                "furigana"
            )?.value || "",


        birthday:
            `${birthYear?.value || ""}-${birthMonth?.value || ""}-${birthDay?.value || ""}`,


        age:
            age?.value || "",


        gender:
            document.getElementById(
                "gender"
            )?.value || "",


        phone:
            document.getElementById(
                "phone"
            )?.value || "",


        email:
            document.getElementById(
                "email"
            )?.value || "",


        postalCode:
            document.getElementById(
                "postalCode"
            )?.value || "",


        addressFurigana:
            document.getElementById(
                "addressFurigana"
            )?.value || "",


        address:
            document.getElementById(
                "address"
            )?.value || "",


        building:
            document.getElementById(
                "building"
            )?.value || "",


        buildingFurigana:
            document.getElementById(
                "buildingFurigana"
            )?.value || "",


        resumeDate:
            resumeDate?.value || "",


        /* =========================
           Education
           ========================= */

        education:
            getEducationData(),


        /* =========================
           Work
           ========================= */

        work:
            getWorkData(),


        /* =========================
           Motivation
           ========================= */

        motivation:
            document.getElementById(
                "motivation"
            )?.value || "",


        /* =========================
           Request
           ========================= */

        request:
            document.getElementById(
                "request"
            )?.value || ""

    };

}


/* ==========================================
   Save Resume
   ========================================== */

function saveResume(){

    const data =
        getFormData();


    /* =========================
       Keep Photo
       ========================= */

    try{

        if(
            typeof getPhotoData === "function"
        ){

            data.photo =
                getPhotoData() || "";

        }

    }

    catch(error){

        console.warn(
            "Photo data could not be read.",
            error
        );

    }


    /* =========================
       Existing Photo
       ========================= */

    if(!data.photo){

        const oldData =
            typeof loadFromStorage === "function"
            ? loadFromStorage()
            : null;


        if(
            oldData &&
            oldData.photo
        ){

            data.photo =
                oldData.photo;

        }

    }


    /* =========================
       Save
       ========================= */

    if(
        typeof saveToStorage === "function"
    ){

        saveToStorage(data);

    }

    else{

        localStorage.setItem(
            "resumeData",
            JSON.stringify(data)
        );

    }


    /* =========================
       Preview
       ========================= */

    window.location.href =
        "rirekishou.html";

}


/* ==========================================
   Reset Form
   ========================================== */

if(resetForm){

    resetForm.addEventListener(
        "click",
        (event) => {

            event.preventDefault();


            /* =========================
               Confirm
               ========================= */

            const confirmed = confirm(
                "入力した内容をすべて削除しますか？"
            );

            if(!confirmed){

                return;

            }


            /* =========================
               Clear LocalStorage
               ========================= */

            if(
                typeof clearResume === "function"
            ){

                clearResume();

            }
            else{

                localStorage.removeItem(
                    "resumeData"
                );

            }


            /* =========================
               Clear all input fields
               ========================= */

            document
                .querySelectorAll(
                    "input, textarea"
                )
                .forEach(input => {

                    if(input.type === "file"){

                        input.value = "";

                    }
                    else if(
                        input.type === "radio" ||
                        input.type === "checkbox"
                    ){

                        input.checked = false;

                    }
                    else{

                        input.value = "";

                    }

                });


            /* =========================
               Reset all SELECT
               ========================= */

            document
                .querySelectorAll("select")
                .forEach(select => {

                    select.selectedIndex = 0;

                });


            /* =========================
               Remove Education Rows
               ========================= */

            const educationList =
                document.getElementById(
                    "education-list"
                );

            if(educationList){

                educationList.innerHTML = "";

            }


            /* =========================
               Remove Work Rows
               ========================= */

            const workList =
                document.getElementById(
                    "work-list"
                );

            if(workList){

                workList.innerHTML = "";

            }


            /* =========================
               Remove Photo
               ========================= */

            const photoPreview =
                document.getElementById(
                    "photoPreview"
                );

            if(photoPreview){

                photoPreview.src = "";

                photoPreview.style.display =
                    "none";

            }


            const photoInput =
                document.getElementById(
                    "photo"
                );

            if(photoInput){

                photoInput.value = "";

            }


            /* =========================
               Reset Birthday
               ========================= */

            initBirthday();


            /* =========================
               Reset Resume Date
               ========================= */

            initResumeDate();


            /* =========================
               Reset Age
               ========================= */

            calculateAge();


            /* =========================
               Reset Furigana
               ========================= */

            const furigana =
                document.getElementById(
                    "furigana"
                );

            if(furigana){

                furigana.value = "";

            }


            const addressFurigana =
                document.getElementById(
                    "addressFurigana"
                );

            if(addressFurigana){

                addressFurigana.value = "";

            }


            const buildingFurigana =
                document.getElementById(
                    "buildingFurigana"
                );

            if(buildingFurigana){

                buildingFurigana.value = "";

            }


            /* =========================
               Reset Gender
               ========================= */

            const gender =
                document.getElementById(
                    "gender"
                );

            if(gender){

                gender.selectedIndex = 0;

            }


            /* =========================
               Final
               ========================= */

            console.log(
                "Resume Maker: ALL DATA RESET"
            );

        }
    );

}