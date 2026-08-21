/* ==========================================
   Resume Maker v2
   validation.js
   ========================================== */


/* ==========================================
   Validate Form
   ========================================== */

function validateForm(){

    if(!validateName()) return false;

    if(!validateFurigana()) return false;

    if(!validateBirthday()) return false;

    if(!validateGender()) return false;

    return true;

}


/* ==========================================
   Name
   ========================================== */

function validateName(){

    const input =
    document.getElementById("name");

    if(input.value.trim()===""){

        alert("氏名を入力してください。");

        input.focus();

        return false;

    }

    return true;

}


/* ==========================================
   Furigana
   ========================================== */

function validateFurigana(){

    const input =
    document.getElementById("furigana");

    if(input.value.trim()===""){

        alert("フリガナを入力してください。");

        input.focus();

        return false;

    }

    return true;

}


/* ==========================================
   Birthday
   ========================================== */

function validateBirthday(){

    const year =
    document.getElementById("birthYear").value;

    const month =
    document.getElementById("birthMonth").value;

    const day =
    document.getElementById("birthDay").value;

    if(

        year==="" ||

        month==="" ||

        day===""

    ){

        alert("生年月日を選択してください。");

        return false;

    }

    return true;

}


/* ==========================================
   Gender
   ========================================== */

function validateGender(){

    const input =
    document.getElementById("gender");

    if(input.value===""){

        alert("性別を選択してください。");

        input.focus();

        return false;

    }

    return true;

}

/* ==========================================
   Phone
   ========================================== */

function validatePhone(){

    const input =
    document.getElementById("phone");

    if(input.value.trim()===""){

        alert("電話番号を入力してください。");

        input.focus();

        return false;

    }

    return true;

}


/* ==========================================
   Email
   ========================================== */

function validateEmail(){

    const input =
    document.getElementById("email");

    if(input.value.trim()===""){

        alert("Emailを入力してください。");

        input.focus();

        return false;

    }

    return true;

}


/* ==========================================
   Postal Code
   ========================================== */

function validatePostalCode(){

    const input =
    document.getElementById("postalCode");

    if(input.value.trim()===""){

        alert("郵便番号を入力してください。");

        input.focus();

        return false;

    }

    return true;

}


/* ==========================================
   Address
   ========================================== */

function validateAddress(){

    const input =
    document.getElementById("address");

    if(input.value.trim()===""){

        alert("住所を入力してください。");

        input.focus();

        return false;

    }

    return true;

}


/* ==========================================
   Building
   ========================================== */

function validateBuilding(){

    const input =
    document.getElementById("building");

    // 建物名は任意
    return true;

}


/* ==========================================
   Update Main Validation
   ========================================== */

function validateForm(){

    if(!validateName()) return false;

    if(!validateFurigana()) return false;

    if(!validateBirthday()) return false;

    if(!validateGender()) return false;

    if(!validatePhone()) return false;

    if(!validateEmail()) return false;

    if(!validatePostalCode()) return false;

    if(!validateAddress()) return false;

    if(!validateBuilding()) return false;

    return true;

}