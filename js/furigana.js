/* ==========================================
   Resume Maker v2
   Furigana Auto
   Web Worker Version
   ========================================== */

let furiganaWorker = null;
let workerReady = false;
let workerLoading = false;


/* ==========================================
   Create Worker
   ========================================== */

function createFuriganaWorker(){

    if(furiganaWorker || workerLoading){

        return;

    }

    workerLoading = true;


    const workerCode = `

        let tokenizer = null;

        self.onmessage = function(event){

            const data = event.data;


            /* =========================
               Load Kuromoji
               ========================= */

            if(data.type === "load"){

                importScripts(
                    "https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/build/kuromoji.js"
                );


                kuromoji.builder({

                    dicPath:
                        "https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict/"

                }).build(
                    function(error, instance){

                        if(error){

                            self.postMessage({

                                type: "error",

                                message:
                                    error.message ||
                                    "Kuromoji loading failed."

                            });

                            return;

                        }


                        tokenizer = instance;


                        self.postMessage({

                            type: "ready"

                        });

                    }
                );

            }


            /* =========================
               Convert
               ========================= */

            if(data.type === "convert"){

                if(!tokenizer){

                    self.postMessage({

                        type: "error",

                        message:
                            "Tokenizer is not ready."

                    });

                    return;

                }


                const text =
                    data.text || "";


                if(!text.trim()){

                    self.postMessage({

                        type: "result",

                        text: ""

                    });

                    return;

                }


                const tokens =
                    tokenizer.tokenize(text);


                const result =
                    tokens
                        .map(token => {

                            return (
                                token.reading ||
                                token.surface_form ||
                                ""
                            );

                        })
                        .join("");


                self.postMessage({

                    type: "result",

                    text: result

                });

            }

        };

    `;


    const blob =
        new Blob(
            [workerCode],
            {
                type:
                    "application/javascript"
            }
        );


    const workerURL =
        URL.createObjectURL(blob);


    furiganaWorker =
        new Worker(workerURL);


    furiganaWorker.onmessage =
        function(event){

            const data =
                event.data;


            /* =========================
               Worker Ready
               ========================= */

            if(data.type === "ready"){

                workerReady = true;
                workerLoading = false;


                console.log(
                    "Furigana Worker ready."
                );


                convertCurrentName();

            }


            /* =========================
               Conversion Result
               ========================= */

            if(data.type === "result"){

                const furigana =
                    document.getElementById(
                        "furigana"
                    );


                if(furigana){

                    furigana.value =
                        data.text;

                }

            }


            /* =========================
               Error
               ========================= */

            if(data.type === "error"){

                workerLoading = false;


                console.error(
                    "Furigana Worker:",
                    data.message
                );

            }

        };


    furiganaWorker.onerror =
        function(error){

            workerLoading = false;

            console.error(
                "Furigana Worker error:",
                error
            );

        };


    /* =========================
       Start Kuromoji
       ========================= */

    furiganaWorker.postMessage({

        type: "load"

    });

}


/* ==========================================
   Convert Current Name
   ========================================== */

function convertCurrentName(){

    const name =
        document.getElementById(
            "name"
        );


    if(!name){

        return;

    }


    if(!name.value.trim()){

        return;

    }


    convertToFurigana(
        name.value
    );

}


/* ==========================================
   Convert Name
   ========================================== */

function convertToFurigana(text){

    if(!furiganaWorker){

        createFuriganaWorker();

    }


    if(!workerReady){

        return;

    }


    furiganaWorker.postMessage({

        type: "convert",

        text: text

    });

}


/* ==========================================
   Initialize
   ========================================== */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        const name =
            document.getElementById(
                "name"
            );


        const furigana =
            document.getElementById(
                "furigana"
            );


        if(!name || !furigana){

            return;

        }


        /* =========================
           Name Input
           ========================= */

        name.addEventListener(
            "input",
            function(){

                /*
                 * Do NOT load Kuromoji
                 * on every keystroke.
                 */

                if(workerReady){

                    convertToFurigana(
                        name.value
                    );

                }

            }
        );


        /* =========================
           Start Worker
           ========================= */

        /*
         * Start after the page is ready,
         * but do not block the main UI.
         */

        setTimeout(
            function(){

                createFuriganaWorker();

            },
            100
        );

    }
);