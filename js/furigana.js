/* ==========================================
   Resume Maker v2
   Furigana Auto
   Japanese / English → Katakana
   Kuromoji + Web Worker
   ========================================== */

let furiganaWorker = null;
let workerReady = false;
let workerLoading = false;


/* ==========================================
   English → Katakana
   ========================================== */

function englishToKatakana(text) {

    let value =
        text
            .trim()
            .replace(/\s+/g, " ")
            .toUpperCase();

    if (!value) {
        return "";
    }


    /*
     * Known/common name patterns.
     * Longest patterns first.
     */

    const rules = [

        ["WUNNA", "ウンナ"],
        ["PHYO", "ピョー"],
        ["WAI", "ワイ"],

        ["THWE", "トゥエ"],
        ["THU", "トゥ"],
        ["THE", "ザ"],
        ["THA", "タ"],

        ["PHYU", "ピュー"],
        ["PHY", "フィ"],

        ["KHIN", "キン"],
        ["KHANT", "カン"],
        ["KHA", "カ"],

        ["KYAW", "チョー"],
        ["KYI", "チー"],

        ["MYAT", "ミャッ"],
        ["MYO", "ミョー"],
        ["MYA", "ミャ"],

        ["NYI", "ニー"],
        ["NYO", "ニョー"],

        ["NWE", "ヌエ"],
        ["NWAY", "ヌウェ"],

        ["HTET", "テッ"],
        ["HTUN", "トゥン"],
        ["HTOO", "トゥー"],

        ["HLA", "ラ"],
        ["HLYA", "リャ"],

        ["ZAW", "ゾー"],
        ["ZIN", "ジン"],
        ["ZAY", "ゼイ"],

        ["TUN", "トゥン"],
        ["TUN", "トゥン"],

        ["SOE", "ソー"],
        ["KO", "コー"],
        ["MIN", "ミン"],
        ["WIN", "ウィン"],
        ["LIN", "リン"],
        ["LWIN", "ルイン"],

        ["AUNG", "アウン"],
        ["AUNG", "アウン"],

        ["OO", "ウー"],
        ["OO", "ウー"],

        ["PH", "フ"],
        ["KH", "ク"],
        ["KY", "キ"],
        ["MY", "ミ"],
        ["NY", "ニ"],
        ["TH", "ト"],
        ["HT", "ト"],

        ["SH", "シュ"],
        ["CH", "チ"],
        ["NG", "ン"],

        ["AE", "エ"],
        ["AI", "アイ"],
        ["AY", "エイ"],
        ["AW", "オー"],
        ["EI", "エイ"],
        ["EE", "イー"],
        ["EA", "イー"],
        ["IE", "イー"],
        ["OA", "オア"],
        ["OE", "オー"],
        ["OO", "ウー"],
        ["OU", "オウ"],

        ["A", "ア"],
        ["B", "ブ"],
        ["C", "ク"],
        ["D", "ド"],
        ["E", "エ"],
        ["F", "フ"],
        ["G", "グ"],
        ["H", "ハ"],
        ["I", "イ"],
        ["J", "ジ"],
        ["K", "ク"],
        ["L", "ル"],
        ["M", "ム"],
        ["N", "ン"],
        ["O", "オ"],
        ["P", "プ"],
        ["Q", "ク"],
        ["R", "ル"],
        ["S", "ス"],
        ["T", "ト"],
        ["U", "ウ"],
        ["V", "ブ"],
        ["W", "ワ"],
        ["X", "クス"],
        ["Y", "イ"],
        ["Z", "ズ"]

    ];


    /*
     * Keep spaces.
     */

    const words =
        value.split(" ");


    const result =
        words.map(function(word) {

            let output = word;


            /*
             * Apply rules.
             */

            for (const rule of rules) {

                output =
                    output.replaceAll(
                        rule[0],
                        rule[1]
                    );

            }


            return output;

        });


    return result.join("・");
}


/* ==========================================
   Check English Name
   ========================================== */

function isEnglishName(text) {

    return /^[A-Za-z\s.'-]+$/.test(
        text.trim()
    );

}


/* ==========================================
   Create Kuromoji Worker
   ========================================== */

function createFuriganaWorker() {

    if (
        furiganaWorker ||
        workerLoading
    ) {
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

            if(data.type === "load") {

                try {

                    importScripts(
                        "https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/build/kuromoji.js"
                    );


                    kuromoji.builder({

                        dicPath:
                            "https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict/"

                    }).build(

                        function(error, instance) {

                            if(error) {

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
                catch(error) {

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
               Japanese → Katakana
               ============================== */

            if(data.type === "convert") {

                if(!tokenizer) {
                    return;
                }


                const text =
                    data.text || "";


                if(!text.trim()) {

                    self.postMessage({

                        type: "result",

                        target:
                            data.target,

                        text: ""

                    });

                    return;

                }


                try {

                    const tokens =
                        tokenizer.tokenize(
                            text
                        );


                    const result =
                        tokens
                            .map(
                                function(token) {

                                    if(
                                        /^[0-9A-Za-z\\s\\-]+$/
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

                                }
                            )
                            .join("");


                    self.postMessage({

                        type: "result",

                        target:
                            data.target,

                        text:
                            result

                    });

                }
                catch(error) {

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


    furiganaWorker.onmessage =
        function(event) {

            const data =
                event.data;


            if(data.type === "ready") {

                workerReady = true;
                workerLoading = false;

                console.log(
                    "Kuromoji Worker ready."
                );

                return;
            }


            if(data.type === "result") {

                const target =
                    document.getElementById(
                        data.target
                    );


                if(target) {

                    target.value =
                        data.text || "";

                }

                return;
            }


            if(data.type === "error") {

                console.error(
                    "Kuromoji:",
                    data.message
                );

                workerLoading = false;

            }

        };


    furiganaWorker.onerror =
        function(error) {

            workerReady = false;
            workerLoading = false;

            console.error(
                "Furigana Worker Error:",
                error
            );

        };


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


    if(!source || !target) {
        return;
    }


    const text =
        source.value.trim();


    if(!text) {

        target.value = "";

        return;
    }


    /* ======================================
       English → Katakana
       ====================================== */

    if(
        sourceId === "name" &&
        isEnglishName(text)
    ) {

        target.value =
            englishToKatakana(
                text
            );

        return;
    }


    /* ======================================
       Japanese → Kuromoji
       ====================================== */

    if(!furiganaWorker) {

        createFuriganaWorker();

        return;
    }


    if(!workerReady) {

        return;
    }


    furiganaWorker.postMessage({

        type: "convert",

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

        if(name) {

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

        if(address) {

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

        if(building) {

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

        setTimeout(
            function() {

                createFuriganaWorker();

            },
            500
        );

    }
);