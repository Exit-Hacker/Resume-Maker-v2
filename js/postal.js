/* ==========================================
   Resume Maker v2
   postal.js
   ========================================== */


/* ==========================================
   DOM
   ========================================== */

const postalCode =
document.getElementById("postalCode");

const searchAddress =
document.getElementById("searchAddress");

const address =
document.getElementById("address");

const addressFurigana =
document.getElementById("addressFurigana");


/* ==========================================
   Search Button
   ========================================== */

searchAddress.addEventListener(

    "click",

    searchPostalCode

);


/* ==========================================
   Search Postal Code
   ========================================== */

async function searchPostalCode(){

    const code =

    postalCode.value

    .replace("-", "")

    .trim();


    if(code.length !== 7){

        alert("郵便番号は7桁で入力してください。");

        postalCode.focus();

        return;

    }


    try{

        const response =

        await fetch(

            `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${code}`

        );

        const data =

        await response.json();


        handlePostalResult(data);

    }

    catch(error){

        console.error(error);

        alert("住所検索に失敗しました。");

    }

}

/* ==========================================
   Handle Result
   ========================================== */

function handlePostalResult(data){

    if(

        data.status !== 200 ||

        !data.results

    ){

        alert("住所が見つかりません。");

        return;

    }

    const result = data.results[0];

    fillAddress(result);

}


/* ==========================================
   Fill Address
   ========================================== */

function fillAddress(result){

    // 住所
    address.value =
        `${result.address1}${result.address2}${result.address3}`;

    // 住所フリガナ
    addressFurigana.value =
        `${result.kana1}${result.kana2}${result.kana3}`;

}



/* ==========================================
   Enter Key
   ========================================== */

postalCode.addEventListener(

    "keydown",

    (event)=>{

        if(event.key === "Enter"){

            event.preventDefault();

            searchPostalCode();

        }

    }

);


/* ==========================================
   Auto Format
   ========================================== */

postalCode.addEventListener(

    "input",

    ()=>{

        let value =

        postalCode.value

        .replace(/\D/g,"")

        .substring(0,7);

        if(value.length > 3){

            value =

            value.slice(0,3)

            + "-"

            +

            value.slice(3);

        }

        postalCode.value = value;

    }

);