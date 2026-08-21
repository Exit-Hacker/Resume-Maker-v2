/* ==========================================
   Resume Maker v2
   Furigana Auto
   Japanese / English → Katakana
   Kuromoji + Web Worker
   ========================================== */


/* ==========================================
   Worker State
   ========================================== */

let furiganaWorker = null;
let workerReady = false;
let workerLoading = false;


/* ==========================================
   Pending Conversion
   Worker loading ဖြစ်နေတုန်း
   input မပျောက်အောင် သိမ်းထားမယ်
   ========================================== */

let pendingConversions = {};


/* ==========================================
   English / Romanized Name
   → Katakana
   ========================================== */

function englishNameToKatakana(text) {

    if (!text || !text.trim()) {
        return "";
    }


    /* ======================================
       Normalize
       ====================================== */

    const value =
        text
            .trim()
            .replace(/\s+/g, " ")
            .toUpperCase();


    /* ======================================
       Exact Name Dictionary
       ====================================== */

    const dictionary = {

        "WUNNA PHYO WAI":
            "ウンナ ピョー ワイ",

        "KYAW HTAY OO":
            "チョー テー ウー",

        "KYAW HTEIK":
            "チョー テイク",

        "AUNG AUNG":
            "アウン アウン",

        "KO KO":
            "コー コー",

        "MIN MIN":
            "ミン ミン",

        "THU ZAR":
            "トゥー ザー",

        "SU SU":
            "スー スー",

        "MAY MYAT":
            "メイ ミャッ",

        "MYO MYO":
            "ミョー ミョー",

        "PHYO PHYO":
            "ピョー ピョー",

        "WAI WAI":
            "ワイ ワイ"

    };


    /* ======================================
       Exact Match
       ====================================== */

    if (dictionary[value]) {

        return dictionary[value];

    }


    /* ======================================
       Generic English → Katakana
       ====================================== */

    let result = value;


    /* ======================================
       Conversion Rules
       အရှည်ဆုံး combination ကနေ
       အတိုဆုံးကို ပြောင်းမယ်
       ====================================== */

    const rules = [

        /* ==============================
           Special / Long combinations
           ============================== */

        ["TION", "ション"],
        ["SION", "ション"],

        ["PHYO", "ピョー"],
        ["PHYU", "ピュー"],
        ["PHYA", "ピャ"],

        ["KYAW", "チョー"],
        ["KYI", "チー"],
        ["KYE", "チェ"],
        ["KYO", "チョー"],
        ["KYU", "チュ"],

        ["MYA", "ミャ"],
        ["MYE", "ミェ"],
        ["MYI", "ミー"],
        ["MYO", "ミョー"],
        ["MYU", "ミュ"],

        ["NYA", "ニャ"],
        ["NYE", "ニェ"],
        ["NYI", "ニー"],
        ["NYO", "ニョー"],
        ["NYU", "ニュ"],

        ["HLA", "ラ"],
        ["HLE", "レ"],
        ["HLI", "リ"],
        ["HLO", "ロ"],
        ["HLU", "ル"],

        /* ==============================
           TH
           ============================== */

        ["THA", "タ"],
        ["THE", "テ"],
        ["THI", "ティ"],
        ["THO", "ト"],
        ["THU", "トゥ"],

        /* ==============================
           HT
           ============================== */

        ["HTA", "タ"],
        ["HTE", "テ"],
        ["HTI", "ティ"],
        ["HTO", "ト"],
        ["HTU", "トゥ"],

        /* ==============================
           SH
           ============================== */

        ["SHA", "シャ"],
        ["SHE", "シェ"],
        ["SHI", "シ"],
        ["SHO", "ショ"],
        ["SHU", "シュ"],

        /* ==============================
           CH
           ============================== */

        ["CHA", "チャ"],
        ["CHE", "チェ"],
        ["CHI", "チ"],
        ["CHO", "チョ"],
        ["CHU", "チュ"],

        /* ==============================
           TR
           ============================== */

        ["TRA", "トラ"],
        ["TRE", "トレ"],
        ["TRI", "トリ"],
        ["TRO", "トロ"],
        ["TRU", "トゥル"],

        /* ==============================
           DR
           ============================== */

        ["DRA", "ドラ"],
        ["DRE", "ドレ"],
        ["DRI", "ドリ"],
        ["DRO", "ドロ"],
        ["DRU", "ドル"],

        /* ==============================
           Myanmar common patterns
           ============================== */

        ["AUNG", "アウン"],

        ["LWIN", "ルイン"],
        ["LW", "ル"],

        ["NWAY", "ヌウェ"],
        ["NWE", "ヌエ"],

        ["ZAW", "ゾー"],
        ["ZAY", "ゼイ"],
        ["ZIN", "ジン"],

        ["SOE", "ソー"],

        ["OO", "ウー"],
        ["EI", "エイ"],
        ["AY", "エイ"],
        ["AI", "アイ"],
        ["AE", "エ"],
        ["AW", "オー"],
        ["EE", "イー"],
        ["EA", "イー"],
        ["IE", "イー"],
        ["OU", "オウ"],
        ["OA", "オア"],
        ["OE", "オー"],

        /* ==============================
           Consonant combinations
           ============================== */

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

        /* ==============================
           Basic vowels
           ============================== */

        ["A", "ア"],
        ["E", "エ"],
        ["I", "イ"],
        ["O", "オ"],
        ["U", "ウ"],

        /* ==============================
           Basic consonants
           ============================== */

        ["B", "ブ"],
        ["C", "ク"],
        ["D", "ド"],
        ["F", "フ"],
        ["G", "グ"],
        ["H", "ハ"],
        ["J", "ジ"],
        ["K", "ク"],
        ["L", "ル"],
        ["M", "ム"],
        ["N", "ン"],
        ["P", "プ"],
        ["Q", "ク"],
        ["R", "ル"],
        ["S", "ス"],
        ["T", "ト"],
        ["V", "ブ"],
        ["W", "ワ"],
        ["X", "クス"],
        ["Y", "イ"],
        ["Z", "ズ"]

    ];


    /* ======================================
       Word by Word Conversion

       Space ကို မပျောက်စေဘူး
       ====================================== */

    const words =
        value.split(" ");


    const convertedWords =
        words.map(function(word) {

            let converted =
                word;


            for (const rule of rules) {

                converted =
                    converted.replaceAll(
                        rule[0],
                        rule[1]
                    );

            }


            return converted;

        });


    /* ======================================
       Final Cleanup

       ・ မသုံးဘူး
       Space ပဲသုံးမယ်
       ====================================== */

    result =
        convertedWords
            .join(" ")
            .replace(/・/g, " ")
            .replace(/\s+/g, " ")
            .trim();


    return result;

}


/* ==========================================
   Detect English / Roman Text
   ========================================== */

function isEnglishText(text) {

    if (!text || !text.trim()) {
        return false;
    }


    return /^[A-Za-z0-9\s.'-]+$/.test(
        text.trim()
    );

}


/* ==========================================
   Create Kuromoji Web Worker
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


            /* ==================================
               Load Kuromoji
               ================================== */

            if (data.type === "load") {

                try {

                    importScripts(
                        "https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/build/kuromoji.js"
                    );


                    kuromoji.builder({

                        dicPath:
                            "https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict/"

                    }).build(

                        function(error, instance) {

                            if (error) {

                                self.postMessage({

                                    type: "error",

                                    message:
                                        error.message ||
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


            /* ==================================
               Japanese → Katakana
               ================================== */

            if (data.type === "convert") {

                if (!tokenizer) {
                    return;
                }


                const text =
                    data.text || "";


                if (!text.trim()) {

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
                        tokenizer.tokenize(text);


                    const result =
                        tokens
                            .map(function(token) {

                                const surface =
                                    token.surface_form || "";


                                /* ==========================
                                   English / numbers
                                   ========================== */

                                if (
                                    /^[0-9A-Za-z\\s.'-]+$/.test(
                                        surface
                                    )
                                ) {

                                    return surface;

                                }


                                return (
                                    token.reading ||
                                    surface ||
                                    ""
                                );

                            })
                            .join("");


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
               Worker Ready
               ============================== */

            if (data.type === "ready") {

                workerReady = true;
                workerLoading = false;


                console.log(
                    "Kuromoji Worker ready."
                );


                /* ==============================
                   Pending conversion
                   ============================== */

                Object.keys(
                    pendingConversions
                ).forEach(function(sourceId) {

                    const targetId =
                        pendingConversions[
                            sourceId
                        ];


                    convertFurigana(
                        sourceId,
                        targetId
                    );

                });


                pendingConversions = {};


                return;

            }


            /* ==============================
               Conversion Result
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

        type:
            "load"

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


    if (
        !source ||
        !target
    ) {

        return;

    }


    const text =
        source.value;


    /* ==================================
       Empty
       ================================== */

    if (!text.trim()) {

        target.value = "";

        return;

    }


    /* ==================================
       English → Katakana
       ================================== */

    if (
        isEnglishText(text)
    ) {

        const result =
            englishNameToKatakana(
                text
            );


        target.value =
            result;


        return;

    }


    /* ==================================
       Japanese → Kuromoji
       ================================== */

    if (!furiganaWorker) {

        pendingConversions[
            sourceId
        ] = targetId;


        createFuriganaWorker();

        return;

    }


    /* ==================================
       Worker Loading
       ================================== */

    if (!workerReady) {

        pendingConversions[
            sourceId
        ] = targetId;


        return;

    }


    /* ==================================
       Convert
       ================================== */

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
   Convert All Existing Values
   Browser Auto-Fill Support
   ========================================== */

function convertAllExistingValues() {

    convertFurigana(
        "name",
        "furigana"
    );


    convertFurigana(
        "address",
        "addressFurigana"
    );


    convertFurigana(
        "building",
        "buildingFurigana"
    );

}


/* ==========================================
   DOM Ready
   ========================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {


        /* ==================================
           Get Elements
           ================================== */

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
           Name Input
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
           Address Input
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
           Building Input
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

        setTimeout(
            function() {

                createFuriganaWorker();

            },
            500
        );


        /* ==================================
           Browser Auto-Fill Support
           
           Browser က input value ကို
           auto-fill လုပ်ပြီးသားဖြစ်နိုင်လို့
           1 sec နောက်မှာ ပြန်စစ်မယ်
           ================================== */

        setTimeout(
            function() {

                convertAllExistingValues();

            },
            1000
        );


        /* ==================================
           Extra Auto-Fill Check
           
           Browser autofill က နောက်ကျနိုင်လို့
           2 sec နောက်တစ်ခါ ထပ်စစ်မယ်
           ================================== */

        setTimeout(
            function() {

                convertAllExistingValues();

            },
            2000
        );


    }
);