/* ==========================================
   Resume Maker v2
   Furigana Auto
   Kuromoji + Web Worker
   ========================================== */

let furiganaWorker = null;
let workerReady = false;
let workerLoading = false;


/* ==========================================
   Create Kuromoji Worker
   ========================================== */

function createFuriganaWorker() {

    if (furiganaWorker || workerLoading) {
        return;
    }

    workerLoading = true;

    const workerCode = `

        let tokenizer = null;

        self.onmessage = function(event) {

            const data = event.data;

            /* ==============================
               Load Kuromoji
               ============================== */

            if (data.type === "load") {

                try {

                    importScripts(
                        "https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/build/kuromoji.js"
                    );

                    kuromoji.builder({

                        dicPath:
                            "https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict/"

                    }).build(function(error, instance) {

                        if (error) {

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

                return;
            }


            /* ==============================
               Convert text
               ============================== */

            if (data.type === "convert") {

                if (!tokenizer) {
                    return;
                }

                const text =
                    data.text || "";

                if (!text.trim()) {

                    self.postMessage({
                        type: "result",
                        target: data.target,
                        text: ""
                    });

                    return;
                }

                try {

                    const tokens =
                        tokenizer.tokenize(text);

                    const result =
                        tokens.map(function(token) {

                            /*
                             * Keep numbers,
                             * English and symbols.
                             */

                            if (
                                /^[0-9A-Za-z\s\-]+$/
                                    .test(
                                        token.surface_form
                                    )
                            ) {

                                return token.surface_form;

                            }

                            return (
                                token.reading ||
                                token.surface_form ||
                                ""
                            );

                        }).join("");


                    self.postMessage({

                        type: "result",

                        target:
                            data.target,

                        text:
                            result

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


    /* ==========================================
       Worker Message
       ========================================== */

    furiganaWorker.onmessage =
        function(event) {

            const data =
                event.data;


            /* ==============================
               Ready
               ============================== */

            if (data.type === "ready") {

                workerReady = true;
                workerLoading = false;

                console.log(
                    "Kuromoji Worker ready."
                );

                return;
            }


            /* ==============================
               Result
               ============================== */

            if (data.type === "result") {

                const target =
                    document.getElementById(
                        data.target
                    );


                if (target) {

                    target.value =
                        data.text || "";

                }

                return;
            }


            /* ==============================
               Error
               ============================== */

            if (data.type === "error") {

                console.error(
                    "Kuromoji:",
                    data.message
                );

                workerLoading = false;

            }

        };


    /* ==========================================
       Worker Error
       ========================================== */

    furiganaWorker.onerror =
        function(error) {

            workerReady = false;
            workerLoading = false;

            console.error(
                "Furigana Worker Error:",
                error
            );

        };


    /* ==========================================
       Start Kuromoji
       ========================================== */

    furiganaWorker.postMessage({

        type: "load"

    });

}


/* ==========================================
   Convert Field
   ========================================== */

function convertFurigana(
    sourceId,
    targetId
) {

    const source =
        document.getElementById(
            sourceId
        );

    const target =
        document.getElementById(
            targetId
        );


    if (!source || !target) {
        return;
    }


    const text =
        source.value;


    /* ==============================
       Empty
       ============================== */

    if (!text.trim()) {

        target.value = "";

        return;
    }


    /* ==============================
       Start Worker
       ============================== */

    if (!furiganaWorker) {

        createFuriganaWorker();

        return;
    }


    /* ==============================
       Worker loading
       ============================== */

    if (!workerReady) {

        return;
    }


    /* ==============================
       Convert
       ============================== */

    furiganaWorker.postMessage({

        type:
            "convert",

        target:
            targetId,

        text:
            text

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

        const address =
            document.getElementById(
                "address"
            );

        const building =
            document.getElementById(
                "building"
            );


        /* ==================================
           Name
           ================================== */

        if (name) {

            name.addEventListener(
                "input",
                function() {

                    convertFurigana(
                        "name",
                        "furigana"
                    );

                }
            );

        }


        /* ==================================
           Address
           ================================== */

        if (address) {

            address.addEventListener(
                "input",
                function() {

                    convertFurigana(
                        "address",
                        "addressFurigana"
                    );

                }
            );

        }


        /* ==================================
           Building
           ================================== */

        if (building) {

            building.addEventListener(
                "input",
                function() {

                    convertFurigana(
                        "building",
                        "buildingFurigana"
                    );

                }
            );

        }


        /* ==================================
           Start Kuromoji
           ================================== */

        /*
         * Start after page is ready.
         * Worker prevents the main page
         * from freezing.
         */

        setTimeout(
            function() {

                createFuriganaWorker();

            },
            500
        );

    }
);