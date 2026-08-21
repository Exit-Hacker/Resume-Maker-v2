/* ==========================================
   Furigana Auto
   Lazy Kuromoji Loading
   ========================================== */

let tokenizer = null;
let tokenizerLoading = false;
let tokenizerReady = false;


/* ==========================================
   Load Kuromoji in background
   ========================================== */

function loadKuromoji(){

    if(tokenizerReady || tokenizerLoading){
        return;
    }

    if(typeof kuromoji === "undefined"){
        console.error("Kuromoji.js is not loaded.");
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
                "Kuromoji loading failed:",
                error
            );

            return;
        }

        tokenizer = instance;
        tokenizerReady = true;

        console.log("Kuromoji ready.");

        autoFurigana();

    });
}


/* ==========================================
   Convert text to Katakana
   ========================================== */

function convertToKatakana(text){

    if(!tokenizer || !text){

        return "";

    }

    const tokens =
        tokenizer.tokenize(text);

    return tokens
        .map(token => {

            return (
                token.reading ||
                token.surface_form ||
                ""
            );

        })
        .join("");
}


/* ==========================================
   Name → Furigana
   ========================================== */

function autoFurigana(){

    const name =
        document.getElementById("name");

    const furigana =
        document.getElementById("furigana");

    if(!name || !furigana){

        return;
    }

    if(!name.value.trim()){

        return;
    }

    if(!tokenizerReady){

        return;
    }

    const result =
        convertToKatakana(
            name.value
        );

    if(result){

        furigana.value = result;

    }
}


/* ==========================================
   Start background loading
   ========================================== */

window.addEventListener(
    "load",
    () => {

        /*
         * Wait a little after page load.
         * This prevents the form from freezing.
         */

        setTimeout(() => {

            loadKuromoji();

        }, 1500);

    }
);


/* ==========================================
   Name input
   ========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const name =
            document.getElementById("name");

        if(!name){

            return;
        }

        name.addEventListener(
            "input",
            () => {

                /*
                 * If Kuromoji is already ready,
                 * update immediately.
                 */

                if(tokenizerReady){

                    autoFurigana();

                }

            }
        );


        name.addEventListener(
            "blur",
            () => {

                /*
                 * If tokenizer hasn't loaded yet,
                 * start it now.
                 */

                if(!tokenizerReady){

                    loadKuromoji();

                    return;
                }

                autoFurigana();

            }
        );

    }
);