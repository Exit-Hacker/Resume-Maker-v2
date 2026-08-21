/* ==========================================
   Resume Maker v2
   furigana.js
   Lazy Kuromoji initialization
   ========================================== */

const building =
    document.getElementById("building");

const buildingFurigana =
    document.getElementById("buildingFurigana");

let tokenizer = null;
let tokenizerReady = false;
let tokenizerLoading = false;


/* ==========================================
   Initialize Kuromoji
   ========================================== */

function initFurigana(){

    if(tokenizerReady || tokenizerLoading){
        return;
    }

    if(typeof kuromoji === "undefined"){
        console.error(
            "Kuromoji.js が読み込まれていません。"
        );
        return;
    }

    tokenizerLoading = true;

    kuromoji.builder({

        dicPath:
            "https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict/"

    }).build((error, instance) => {

        tokenizerLoading = false;

        if(error){

            console.error(
                "Kuromoji initialization failed:",
                error
            );

            return;
        }

        tokenizer = instance;

        tokenizerReady = true;


        /* Convert existing text */

        if(
            building &&
            building.value.trim()
        ){

            buildingFurigana.value =
                convertToKatakana(
                    building.value
                );

        }

    });

}


/* ==========================================
   Building Input
   ========================================== */

if(building){

    /* User can type normally */

    building.addEventListener(
        "input",
        () => {

            if(!building.value.trim()){

                buildingFurigana.value = "";

            }

        }
    );


    /* Start Kuromoji AFTER leaving field */

    building.addEventListener(
        "blur",
        () => {

            if(!building.value.trim()){

                return;

            }


            if(!tokenizerReady){

                initFurigana();

                return;

            }


            buildingFurigana.value =
                convertToKatakana(
                    building.value
                );

        }
    );

}


/* ==========================================
   Convert Japanese → Katakana
   ========================================== */

function convertToKatakana(text){

    if(!tokenizer){

        return text;

    }

    const tokens =
        tokenizer.tokenize(text);


    return tokens
        .map(token => {

            return (
                token.reading ||
                token.surface_form
            );

        })
        .join("");

}