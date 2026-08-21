/* ==========================================
   Resume Maker v2
   Furigana Auto
   Kuromoji + Web Worker
   ========================================== */

let furiganaWorker = null;
let workerReady = false;
let workerLoading = false;
let latestName = "";


/* ==========================================
   Create Worker
   ========================================== */

function createFuriganaWorker() {

    if (furiganaWorker || workerLoading) {
        return;
    }

    workerLoading = true;


    /* ======================================
       Worker source
       ====================================== */

    const workerCode = `

        let tokenizer = null;


        self.onmessage = function(event) {

            const data = event.data;


            /* ==================================
               Load Kuromoji
               ================================== */

            if (data.type === "load") {

                try {

                    importScripts(
                        "https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/build/kuromoji.js"
                    );


                    kuromoji
                        .builder({

                            dicPath:
                                "https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict/"

                        })
                        .build(function(error, instance) {

                            if (error) {

                                self.postMessage({

                                    type: "error",

                                    message:
                                        "Kuromoji loading failed."

                                });

                                return;
                            }


                            tokenizer = instance;


                            self.postMessage({

                                type: "ready"

                            });

                        });

                }
                catch (error) {

                    self.postMessage({

                        type: "error",

                        message:
                            error.message ||
                            "Kuromoji error."

                    });

                }

            }


            /* ==================================
               Convert Kanji → Katakana
               ================================== */

            if (data.type === "convert") {

                if (!tokenizer) {

                    self.postMessage({

                        type: "error",

                        message:
                            "Tokenizer is not ready."

                    });

                    return;
                }


                const text =
                    data.text || "";


                if (!text.trim()) {

                    self.postMessage({

                        type: "result",

                        text: ""

                    });

                    return;
                }


                try {

                    const tokens =
                        tokenizer.tokenize(text);


                    const result =
                        tokens
                            .map(function(token) {

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
                catch (error) {

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
       Create Worker Blob
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
       Start Worker
       ====================================== */

    furiganaWorker =
        new Worker(workerURL);


    /* ======================================
       Worker Message
       ====================================== */

    furiganaWorker.onmessage =
        function(event) {

            const data =
                event.data;


            /* ==================================
               Kuromoji Ready
               ================================== */

            if (data.type === "ready") {

                workerReady = true;
                workerLoading = false;


                console.log(
                    "Kuromoji Worker ready."
                );


                /*
                 * If user already typed a name
                 * while Kuromoji was loading,
                 * convert it now.
                 */

                if (latestName.trim()) {

                    convertToFurigana(
                        latestName
                    );

                }

            }


            /* ==================================
               Conversion Result
               ================================== */

            if (data.type === "result") {

                const furigana =
                    document.getElementById(
                        "furigana"
                    );


                if (!furigana) {
                    return;
                }


                /*
                 * Only put result into the
                 * furigana field.
                 */

                furigana.value =
                    data.text || "";

            }


            /* ==================================
               Error
               ================================== */

            if (data.type === "error") {

                workerLoading = false;

                console.error(
                    "Kuromoji Worker:",
                    data.message
                );

            }

        };


    /* ======================================
       Worker Error
       ====================================== */

    furiganaWorker.onerror =
        function(error) {

            workerLoading = false;
            workerReady = false;

            console.error(
                "Furigana Worker Error:",
                error
            );

        };


    /* ======================================
       Tell Worker to load Kuromoji
       ====================================== */

    furiganaWorker.postMessage({

        type: "load"

    });

}


/* ==========================================
   Convert Name
   ========================================== */

function convertToFurigana(text) {

    latestName =
        text || "";


    const furigana =
        document.getElementById(
            "furigana"
        );


    /* ======================================
       Empty name
       ====================================== */

    if (!latestName.trim()) {

        if (furigana) {

            furigana.value = "";

        }

        return;

    }


    /* ======================================
       Worker doesn't exist
       ====================================== */

    if (!furiganaWorker) {

        createFuriganaWorker();

        return;

    }


    /* ======================================
       Worker still loading
       ====================================== */

    if (!workerReady) {

        return;

    }


    /* ======================================
       Send to Kuromoji
       ====================================== */

    furiganaWorker.postMessage({

        type: "convert",

        text: latestName

    });

}


/* ==========================================
   DOM Ready
   ========================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const name =
            document.getElementById(
                "name"
            );


        const furigana =
            document.getElementById(
                "furigana"
            );


        if (!name || !furigana) {

            return;

        }


        /* ==================================
           Name Input
           ================================== */

        name.addEventListener(
            "input",
            function() {

                latestName =
                    name.value;


                /*
                 * Empty
                 */

                if (!latestName.trim()) {

                    furigana.value = "";

                    return;

                }


                /*
                 * Kuromoji already ready
                 */

                if (workerReady) {

                    convertToFurigana(
                        latestName
                    );

                    return;

                }


                /*
                 * Start Kuromoji only once
                 */

                if (!workerLoading) {

                    createFuriganaWorker();

                }

            }
        );


        /* ==================================
           Name Blur
           ================================== */

        name.addEventListener(
            "blur",
            function() {

                if (
                    workerReady &&
                    latestName.trim()
                ) {

                    convertToFurigana(
                        latestName
                    );

                }

            }
        );

    }
);