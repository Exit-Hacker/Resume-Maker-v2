/* ==========================================
   Resume Maker v2
   Furigana Auto
   Japanese / English → Katakana
   Kuromoji + Web Worker

   IMPORTANT:
   - index.html မပြင်ရ
   - Name / Address / Building အကုန် support
   - 「・」 ကို space အဖြစ်ပြောင်း
   - Worker loading အတွင်း input မပျောက်
   ========================================== */


/* ==========================================
   Worker State
   ========================================== */

let furiganaWorker = null;
let workerReady = false;
let workerLoading = false;


/* ==========================================
   Pending Conversion
   Worker မ ready ဖြစ်သေးရင်
   နောက်ဆုံး input ကို သိမ်းထားမယ်
   ========================================== */

const pendingConversions = {};


/* ==========================================
   English / Romanized Name
   → Katakana
   ========================================== */

function englishNameToKatakana(text) {

    if (!text || !text.trim()) {
        return "";
    }

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

    const rules = [

        /* Long combinations */

        ["TION", "ション"],
        ["SION", "ション"],

        ["PHYO", "ピョー"],
        ["PHYU", "ピュー"],
        ["PHYA", "ピャ"],

        ["KYAW", "チョー"],
        ["KYI", "チー"],
        ["KYO", "チョ"],
        ["KYU", "チュ"],

        ["MYA", "ミャ"],
        ["MYI", "ミィ"],
        ["MYO", "ミョー"],
        ["MYU", "ミュ"],

        ["NYA", "ニャ"],
        ["NYI", "ニー"],
        ["NYO", "ニョー"],
        ["NYU", "ニュ"],

        ["HLA", "ラ"],
        ["HLI", "リ"],
        ["HLO", "ロ"],
        ["HLU", "ル"],

        ["THA", "タ"],
        ["THE", "テ"],
        ["THI", "ティ"],
        ["THO", "ト"],
        ["THU", "トゥ"],

        ["HTA", "タ"],
        ["HTE", "テ"],
        ["HTI", "ティ"],
        ["HTO", "ト"],
        ["HTU", "トゥ"],

        ["SHA", "シャ"],
        ["SHE", "シェ"],
        ["SHI", "シ"],
        ["SHO", "ショ"],
        ["SHU", "シュ"],

        ["CHA", "チャ"],
        ["CHE", "チェ"],
        ["CHI", "チ"],
        ["CHO", "チョ"],
        ["CHU", "チュ"],

        ["TRA", "トラ"],
        ["TRE", "トレ"],
        ["TRI", "トリ"],
        ["TRO", "トロ"],
        ["TRU", "トゥル"],

        ["DRA", "ドラ"],
        ["DRE", "ドレ"],
        ["DRI", "ドリ"],
        ["DRO", "ドロ"],
        ["DRU", "ドル"],

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

        /* Consonant combinations */

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

        /* Basic vowels */

        ["A", "ア"],
        ["E", "エ"],
        ["I", "イ"],
        ["O", "オ"],
        ["U", "ウ"],

        /* Basic consonants */

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
       Word by Word
       Space ကို မပျောက်စေဘူး
       ====================================== */

    const words = value.split(" ");

    const convertedWords = words.map(function(word) {

        let converted = word;

        for (const rule of rules) {

            converted =
                converted.replaceAll(
                    rule[0],
                    rule[1]
                );

        }

        return converted;

    });


    return convertedWords
        .join(" ")
        .replace(/・+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
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

    if (furiganaWorker || workerLoading) {
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


            /* ==================================
               Convert
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
                                   Keep English / Numbers
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


                /* ==========================
                   Process pending input
                   ========================== */

                Object.keys(
                    pendingConversions
                ).forEach(function(sourceId) {

                    const item =
                        pendingConversions[
                            sourceId
                        ];


                    if (!item) {
                        return;
                    }


                    const source =
                        document.getElementById(
                            sourceId
                        );


                    if (!source) {
                        return;
                    }


                    /*
                     * User ရိုက်ပြီးသား
                     * နောက်ဆုံး value ကိုပဲ
                     * convert လုပ်မယ်
                     */

                    convertFurigana(
                        sourceId,
                        item.targetId
                    );

                });


                Object.keys(
                    pendingConversions
                ).forEach(function(key) {

                    delete pendingConversions[key];

                });


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

                    /*
                     * Japanese Kuromoji result
                     * မှာ ・ ပါရင် space ပြောင်း
                     */

                    target.value =
                        (data.text || "")
                            .replace(/・+/g, " ")
                            .replace(/\s+/g, " ")
                            .trim();

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

    if (isEnglishText(text)) {

        const result =
            englishNameToKatakana(text);


        target.value =
            result;


        return;
    }


    /* ==================================
       Worker မရှိသေးရင်
       pending ထဲသိမ်း
       ================================== */

    if (!furiganaWorker) {

        pendingConversions[
            sourceId
        ] = {
            targetId: targetId
        };


        createFuriganaWorker();

        return;
    }


    /* ==================================
       Worker Loading
       ================================== */

    if (!workerReady) {

        pendingConversions[
            sourceId
        ] = {
            targetId: targetId
        };


        return;
    }


    /* ==================================
       Japanese → Kuromoji
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
           Start Worker
           ================================== */

        setTimeout(
            function() {

                createFuriganaWorker();

            },
            500
        );

    }
);