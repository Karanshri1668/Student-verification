/*====================================

DEBUGGING DASHBOARD

====================================*/

const participantsContainer =
    document.getElementById("participants");

const verifyInput =
    document.getElementById("verifyInput");

const verifyBtn =
    document.getElementById("verifyBtn");

const verifyResult =
    document.getElementById("verifyResult");


let debuggingDatabase = [];


/*====================================

LOAD CSV

====================================*/

async function loadDebuggingCSV(){

    try{

        const response =
            await fetch("data/Debugging.csv");

        const csv =
            await response.text();

        const parsed =
            Papa.parse(csv, {

                header:true,

                skipEmptyLines:true

            });


        debuggingDatabase =
            parsed.data.filter(row =>

                row["Participant Unique ID"] &&
                row["Participant Unique ID"].trim() !== ""

            );


        console.log(
            "Debugging Database:",
            debuggingDatabase
        );


        displayParticipants();


    }

    catch(error){

        console.error(error);

        participantsContainer.innerHTML = `

            <div class="error-box">

                <h3>Database Error</h3>

                <p>
                    Unable to load debugging.csv
                </p>

            </div>

        `;

    }

}


/*====================================

DISPLAY PARTICIPANTS

====================================*/

function displayParticipants(){

    participantsContainer.innerHTML = "";

    debuggingDatabase.forEach((participant, index) => {

        const card =
            document.createElement("div");

        card.className = "participant-card";


        card.innerHTML = `

            <div class="participant-number">

                ${index + 1}

            </div>


            <div class="participant-info">

                <h3>
                    ${participant["Participant Name"]}
                </h3>

                <p>
                    <strong>Class :</strong>
                    ${participant["Participant Class"]}
                </p>

                <p>
                    <strong>Unique ID :</strong>
                    ${participant["Participant Unique ID"]}
                </p>

            </div>

        `;


        participantsContainer.appendChild(card);

    });

}


/*====================================

VERIFY PARTICIPANT

====================================*/

function verifyParticipant(){

    const enteredId =
        verifyInput.value.trim();


    /*------------------------------
    EMPTY ID
    ------------------------------*/

    if(enteredId === ""){

        verifyResult.innerHTML = `

            <div class="result-error">

                <h3>
                    ⚠ Enter Unique ID
                </h3>

                <p>
                    Please enter a participant
                    Unique ID.
                </p>

            </div>

        `;

        return;

    }


    /*------------------------------
    SEARCH DATABASE
    ------------------------------*/

    const participant =
        debuggingDatabase.find(row => {

            return String(
                row["Participant Unique ID"]
            ).trim() === enteredId;

        });


    /*------------------------------
    FOUND
    ------------------------------*/

    if(participant){

        verifyResult.innerHTML = `

            <div class="result-success">

                <h3>
                    ✅ REGISTERED
                </h3>

                <hr>

                <p>
                    <strong>Name :</strong>
                    ${participant["Participant Name"]}
                </p>

                <p>
                    <strong>Class :</strong>
                    ${participant["Participant Class"]}
                </p>

                <p>
                    <strong>Contact :</strong>
                    ${participant["Participant Contact"]}
                </p>

                <p>
                    <strong>Unique ID :</strong>
                    ${participant["Participant Unique ID"]}
                </p>

            </div>

        `;

    }


    /*------------------------------
    NOT FOUND
    ------------------------------*/

    else{

        verifyResult.innerHTML = `

            <div class="result-error">

                <h3>
                    ❌ NOT REGISTERED
                </h3>

                <hr>

                <p>
                    This Unique ID is not registered
                    for the Debugging event.
                </p>

            </div>

        `;

    }

}


/*====================================

BUTTON

====================================*/

verifyBtn.addEventListener(
    "click",
    verifyParticipant
);


/*====================================

ENTER KEY

====================================*/

verifyInput.addEventListener(
    "keypress",
    function(event){

        if(event.key === "Enter"){

            verifyParticipant();

        }

    }
);


/*====================================

LOAD DATABASE

====================================*/

loadDebuggingCSV();