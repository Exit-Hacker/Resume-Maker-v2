/* ==========================================
   Resume Maker v2
   furigana.js
   Japanese → Katakana
   ========================================== */


/* ==========================================
   DOM
   ========================================== */

const building =
    document.getElementById("building");

const buildingFurigana =
    document.getElementById("buildingFurigana");


/* ==========================================
   Kuromoji
   ========================================== */

let tokenizer = null;

let tokenizerReady = false;


/* ==========================================
   Initialize
   ========================================== */

function initFurigana(){

    if(typeof kuromoji === "undefined"){

        console.error(
            "Kuromoji.js が読み込まれていません。"
        );

        return;

    }


    kuromoji.builder({

        dicPath:
            "https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict/"

    }).build((error, instance) => {

        if(error){

            console.error(
                "Kuromoji initialization failed:",
                error
            );

            return;

        }

        tokenizer = instance;

        tokenizerReady = true;

        console.log(
            "Kuromoji ready"
        );

    });

}


/* ==========================================
   Initialize
   ========================================== */

document.addEventListener(
    "DOMContentLoaded",
    initFurigana
);


/* ==========================================
   Building Input
   ========================================== */

building.addEventListener(
    "input",
    () => {

        const text =
            building.value;


        if(!text){

            buildingFurigana.value = "";

            return;

        }


        if(!tokenizerReady){

            buildingFurigana.value = "";

            return;

        }


        buildingFurigana.value =
            convertToKatakana(text);

    }
);


/* ==========================================
   Convert Japanese → Katakana
   ========================================== */

function convertToKatakana(text){

    const tokens =
        tokenizer.tokenize(text);


    return tokens.map(token => {

        /*
         * Kanji / Japanese word
         * → reading
         */

        if(token.reading){

            return token.reading;

        }


        /*
         * Numbers
         * Alphabet
         * Symbols
         * Unknown characters
         */

        return token.surface_form;

    }).join("");

}