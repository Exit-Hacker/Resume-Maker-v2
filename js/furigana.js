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

    }
);/* ==========================================
   Resume Maker v2
   Furigana Auto
   Kuromoji + Web Worker
   ========================================== */


/* ==========================================
   Variables
   ========================================== */

let furiganaWorker = null;

let workerReady = false;

let workerLoading = false;

let latestName = "";


/* ==========================================
   Create Furigana Worker
   ========================================== */

function createFuriganaWorker(){

    /* Already exists */
    if(furiganaWorker){

        return;

    }


    /* Already loading */
    if(workerLoading){

        return;

    }


    workerLoading = true;


    /* ======================================
       Worker Code
       ====================================== */

    const workerCode = `

        let tokenizer = null;


        self.onmessage = function(event){

            const data = event.data;


            /* ==================================
               LOAD KUROMOJI
               ================================== */

            if(data.type === "load"){

                try{

                    importScripts(
                        "https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/build/kuromoji.js"
                    );


                    kuromoji
                        .builder({

                            dicPath:
                                "https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict/"

                        })
                        .build(

                            function(error, instance){

                                if(error){

                                    self.postMessage({

                                        type: "error",

                                        message:
                                            "Kuromoji loading failed."

                                    });

                                    return;

                                }


                                tokenizer =
                                    instance;


                                self.postMessage({

                                    type: "ready"

                                });

                            }

                        );

                }

                catch(error){

                    self.postMessage({

                        type: "error",

                        message:
                            error.message ||
                            "Kuromoji error."

                    });

                }

            }


            /* ==================================
               CONVERT
               ================================== */

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


                try{

                    const tokens =
                        tokenizer.tokenize(text);


                    const result =
                        tokens
                            .map(

                                function(token){

                                    return (
                                        token.reading ||
                                        token.surface_form ||
                                        ""
                                    );

                                }

                            )
                            .join("");


                    self.postMessage({

                        type: "result",

                        text: result

                    });

                }

                catch(error){

                    self.postMessage({

                        type: "error",

                        message:
                            error.message ||
                            "Conversion failed."

                    });

                }

            }

        };

    `;


    /* ======================================
       Create Blob
       ====================================== */

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


    /* ======================================
       Create Worker
       ====================================== */

    furiganaWorker =
        new Worker(workerURL);


    /* ======================================
       Worker Message
       ====================================== */

    furiganaWorker.onmessage =
        function(event){

            const data =
                event.data;


            /* ==============================
               READY
               ============================== */

            if(data.type === "ready"){

                workerReady = true;

                workerLoading = false;


                console.log(
                    "Kuromoji Worker is ready."
                );


                /* Convert current name */

                if(latestName){

                    convertToFurigana(
                        latestName
                    );

                }

            }


            /* ==============================
               RESULT
               ============================== */

            if(data.type === "result"){

                const furigana =
                    document.getElementById(
                        "furigana"
                    );


                if(!furigana){

                    return;

                }


                /*
                 * Only update if the result
                 * belongs to the current name.
                 */

                if(
                    latestName &&
                    data.text
                ){

                    furigana.value =
                        data.text;

                }

            }


            /* ==============================
               ERROR
               ============================== */

            if(data.type === "error"){

                workerLoading = false;


                console.error(
                    "Furigana Worker Error:",
                    data.message
                );

            }

        };


    /* ======================================
       Worker Error
       ====================================== */

    furiganaWorker.onerror =
        function(error){

            workerLoading = false;

            workerReady = false;


            console.error(
                "Furigana Worker Error:",
                error
            );

        };


    /* ======================================
       Start Kuromoji
       ====================================== */

    furiganaWorker.postMessage({

        type: "load"

    });

}


/* ==========================================
   Convert To Furigana
   ========================================== */

function convertToFurigana(text){

    latestName =
        text || "";


    /* Empty */

    if(!latestName.trim()){

        const furigana =
            document.getElementById(
                "furigana"
            );


        if(furigana){

            furigana.value = "";

        }

        return;

    }


    /* Worker doesn't exist */

    if(!furiganaWorker){

        createFuriganaWorker();

        return;

    }


    /* Worker is still loading */

    if(!workerReady){

        return;

    }


    /* Send to Worker */

    furiganaWorker.postMessage({

        type: "convert",

        text: latestName

    });

}


/* ==========================================
   Initialize Furigana
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


        /* ==================================
           Name Input
           ================================== */

        name.addEventListener(

            "input",

            function(){

                latestName =
                    name.value;


                /*
                 * Do NOT create/load Kuromoji
                 * on every keystroke.
                 */


                if(
                    !latestName.trim()
                ){

                    furigana.value = "";

                    return;

                }


                if(workerReady){

                    convertToFurigana(
                        latestName
                    );

                }

                else if(
                    !workerLoading
                ){

                    /*
                     * Start Kuromoji only
                     * when user actually uses
                     * the name field.
                     */

                    createFuriganaWorker();

                }

            }

        );


        /* ==================================
           Clear Furigana
           ================================== */

        furigana.addEventListener(

            "input",

            function(){

                /*
                 * Allow user to manually
                 * edit the Furigana field.
                 */

            }

        );


    }

);