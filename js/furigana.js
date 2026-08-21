/* ==========================================
   Resume Maker v2
   Furigana Auto
   Kuromoji + Web Worker
   ========================================== */

let furiganaWorker = null;
let workerReady = false;
let workerLoading = false;

let latestName = "";
let latestBuilding = "";


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


            /* ==============================
               Load Kuromoji
               ============================== */

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


                                tokenizer = instance;


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


            /* ==============================
               Convert
               ============================== */

            if(data.type === "convert"){

                if(!tokenizer){

                    return;

                }


                const text =
                    data.text || "";


                if(!text.trim()){

                    self.postMessage({

                        type: data.target,

                        text: ""

                    });

                    return;

                }


                try{

                    const tokens =
                        tokenizer.tokenize(text);


                    const result =
                        tokens
                            .map(function(token){

                                /*
                                 * Keep numbers and
                                 * English characters.
                                 */

                                if(
                                    /^[0-9A-Za-z\s\-]+$/
                                        .test(
                                            token.surface_form
                                        )
                                ){

                                    return token.surface_form;

                                }


                                return (
                                    token.reading ||
                                    token.surface_form ||
                                    ""
                                );

                            })
                            .join("");


                    self.postMessage({

                        type: data.target,

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
        function(event){

            const data =
                event.data;


            /* ==============================
               Ready
               ============================== */

            if(data.type === "ready"){

                workerReady = true;
                workerLoading = false;


                console.log(
                    "Kuromoji Worker ready."
                );


                if(latestName){

                    convertName(
                        latestName
                    );

                }


                if(latestBuilding){

                    convertBuilding(
                        latestBuilding
                    );

                }

            }


            /* ==============================
               Name Result
               ============================== */

            if(data.type === "name-result"){

                const furigana =
                    document.getElementById(
                        "furigana"
                    );


                if(furigana){

                    furigana.value =
                        data.text || "";

                }

            }


            /* ==============================
               Building Result
               ============================== */

            if(data.type === "building-result"){

                const buildingFurigana =
                    document.getElementById(
                        "buildingFurigana"
                    );


                if(buildingFurigana){

                    buildingFurigana.value =
                        data.text || "";

                }

            }


            /* ==============================
               Error
               ============================== */

            if(data.type === "error"){

                console.error(
                    "Kuromoji Worker:",
                    data.message
                );

                workerLoading = false;

            }

        };


    /* ==========================================
       Worker Error
       ========================================== */

    furiganaWorker.onerror =
        function(error){

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
   Convert Name
   ========================================== */

function convertName(text){

    latestName =
        text || "";


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


    if(!workerReady){

        return;

    }


    furiganaWorker.postMessage({

        type: "convert",

        target: "name-result",

        text: latestName

    });

}


/* ==========================================
   Convert Building
   ========================================== */

function convertBuilding(text){

    latestBuilding =
        text || "";


    if(!latestBuilding.trim()){

        const buildingFurigana =
            document.getElementById(
                "buildingFurigana"
            );


        if(buildingFurigana){

            buildingFurigana.value = "";

        }

        return;

    }


    if(!workerReady){

        return;

    }


    furiganaWorker.postMessage({

        type: "convert",

        target: "building-result",

        text: latestBuilding

    });

}


/* ==========================================
   DOM Ready
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


        const building =
            document.getElementById(
                "building"
            );


        const buildingFurigana =
            document.getElementById(
                "buildingFurigana"
            );


        /* ==================================
           No required fields
           ================================== */

        if(
            !name &&
            !building
        ){

            return;

        }


        /* ==================================
           Name Input
           ================================== */

        if(name){

            name.addEventListener(
                "input",
                function(){

                    latestName =
                        name.value;


                    if(
                        !latestName.trim()
                    ){

                        if(furigana){

                            furigana.value = "";

                        }

                        return;

                    }


                    if(workerReady){

                        convertName(
                            latestName
                        );

                    }
                    else if(!workerLoading){

                        createFuriganaWorker();

                    }

                }
            );

        }


        /* ==================================
           Building Input
           ================================== */

        if(building){

            building.addEventListener(
                "input",
                function(){

                    latestBuilding =
                        building.value;


                    if(
                        !latestBuilding.trim()
                    ){

                        if(buildingFurigana){

                            buildingFurigana.value = "";

                        }

                        return;

                    }


                    if(workerReady){

                        convertBuilding(
                            latestBuilding
                        );

                    }
                    else if(!workerLoading){

                        createFuriganaWorker();

                    }

                }
            );

        }

    }
);