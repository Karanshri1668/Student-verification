/*====================================

AI PROMPT BATTLE

====================================*/

const teamsContainer =
    document.getElementById("teams");

const verifyInput =
    document.getElementById("verifyInput");

const verifyBtn =
    document.getElementById("verifyBtn");

const verifyResult =
    document.getElementById("verifyResult");


let aiPromptDatabase = [];


/*====================================

LOAD CSV

====================================*/

async function loadAIPromptCSV(){

    try{

        const response =
            await fetch("data/Ai-prompt.csv");

        const csv =
            await response.text();

        const parsed =
            Papa.parse(csv, {

                header:true,

                skipEmptyLines:true

            });


        aiPromptDatabase = parsed.data.filter(row => {

            return getUniqueId(row, 1) ||
                   getUniqueId(row, 2);

        });


        console.log(
            "AI Prompt Database:",
            aiPromptDatabase
        );


        displayTeams();

    }

    catch(error){

        console.error(error);

        teamsContainer.innerHTML = `

            <div class="error-box">

                <h3>Database Error</h3>

                <p>
                    Unable to load aiprompt.csv
                </p>

            </div>

        `;

    }

}


/*====================================

GET UNIQUE ID

Supports:

Participant 1 Unique ID
Player 1 Unique ID

====================================*/

function getUniqueId(row, number){

    return (

        row[`Participant ${number} Unique ID`] ||

        row[`Player ${number} Unique ID`] ||

        ""

    ).trim();

}


/*====================================

GET PARTICIPANT NAME

====================================*/

function getName(row, number){

    return (

        row[`Participant ${number} Name`] ||

        row[`Player ${number} Name`] ||

        ""

    ).trim();

}


/*====================================

GET CLASS

====================================*/

function getClass(row, number){

    return (

        row[`Participant ${number} Class`] ||

        row[`Player ${number} Class`] ||

        ""

    ).trim();

}


/*====================================

GET EMAIL

====================================*/

function getEmail(row, number){

    return (

        row[`Participant ${number} Email`] ||

        row[`Player ${number} Email`] ||

        ""

    ).trim();

}


/*====================================

GET CONTACT

====================================*/

function getContact(row, number){

    return (

        row[`Participant ${number} Contact`] ||

        row[`Player ${number} Contact`] ||

        ""

    ).trim();

}


/*====================================

DISPLAY TEAMS

====================================*/

function displayTeams(){

    teamsContainer.innerHTML = "";

    aiPromptDatabase.forEach((team, index) => {

        const participant1 =
            getName(team, 1);

        const participant2 =
            getName(team, 2);

        const card =
            document.createElement("div");

        card.className = "team-card";


        card.innerHTML = `

            <div class="team-number">

                TEAM ${index + 1}

            </div>


            <div class="team-members">

                <div class="member">

                    <span>Participant 1</span>

                    <h3>
                        ${participant1 || "N/A"}
                    </h3>

                    <p>
                        Unique ID:
                        ${getUniqueId(team, 1) || "N/A"}
                    </p>

                </div>


                <div class="member">

                    <span>Participant 2</span>

                    <h3>
                        ${participant2 || "N/A"}
                    </h3>

                    <p>
                        Unique ID:
                        ${getUniqueId(team, 2) || "N/A"}
                    </p>

                </div>

            </div>

        `;


        teamsContainer.appendChild(card);

    });

}


/*====================================

VERIFY PARTICIPANT

====================================*/

function verifyParticipant(){

    const enteredId =
        verifyInput.value.trim();


    /*------------------------------
    EMPTY
    ------------------------------*/

    if(enteredId === ""){

        verifyResult.innerHTML = `

            <div class="result-error">

                <h3>⚠ Enter Unique ID</h3>

                <p>
                    Please enter a participant
                    Unique ID.
                </p>

            </div>

        `;

        return;

    }


    /*------------------------------
    SEARCH TEAM
    ------------------------------*/

    let foundTeam = null;

    let foundParticipantNumber = 0;


    for(const team of aiPromptDatabase){

        const id1 =
            getUniqueId(team, 1);

        const id2 =
            getUniqueId(team, 2);


        if(id1 === enteredId){

            foundTeam = team;

            foundParticipantNumber = 1;

            break;

        }


        if(id2 === enteredId){

            foundTeam = team;

            foundParticipantNumber = 2;

            break;

        }

    }


    /*------------------------------
    NOT FOUND
    ------------------------------*/

    if(!foundTeam){

        verifyResult.innerHTML = `

            <div class="result-error">

                <h3>❌ NOT REGISTERED</h3>

                <hr>

                <p>
                    This Unique ID is not registered
                    for the AI Prompt Battle.
                </p>

            </div>

        `;

        return;

    }


    /*------------------------------
    CURRENT PARTICIPANT
    ------------------------------*/

    const currentName =
        getName(
            foundTeam,
            foundParticipantNumber
        );

    const currentClass =
        getClass(
            foundTeam,
            foundParticipantNumber
        );

    const currentEmail =
        getEmail(
            foundTeam,
            foundParticipantNumber
        );

    const currentContact =
        getContact(
            foundTeam,
            foundParticipantNumber
        );


    /*------------------------------
    PARTNER
    ------------------------------*/

    const partnerNumber =
        foundParticipantNumber === 1
        ? 2
        : 1;


    const partnerName =
        getName(foundTeam, partnerNumber);

    const partnerId =
        getUniqueId(foundTeam, partnerNumber);

    const partnerClass =
        getClass(foundTeam, partnerNumber);


    /*------------------------------
    RESULT
    ------------------------------*/

    verifyResult.innerHTML = `

        <div class="result-success">

            <h3>✅ REGISTERED</h3>

            <hr>


            <div class="verified-person">

                <span>Participant</span>

                <h2>
                    ${currentName || "N/A"}
                </h2>

                <p>
                    <strong>Class :</strong>
                    ${currentClass || "N/A"}
                </p>

                <p>
                    <strong>Contact :</strong>
                    ${currentContact || "N/A"}
                </p>

                <p>
                    <strong>Email :</strong>
                    ${currentEmail || "N/A"}
                </p>

                <p>
                    <strong>Unique ID :</strong>
                    ${enteredId}
                </p>

            </div>


            <div class="partner-box">

                <h4>DUO PARTNER</h4>

                <p>
                    <strong>Name :</strong>
                    ${partnerName || "N/A"}
                </p>

                <p>
                    <strong>Class :</strong>
                    ${partnerClass || "N/A"}
                </p>

                <p>
                    <strong>Unique ID :</strong>
                    ${partnerId || "N/A"}
                </p>

            </div>

        </div>

    `;

}


/*====================================

VERIFY BUTTON

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

loadAIPromptCSV();