/*====================================

TECH QUIZ

====================================*/

const teamsContainer =
    document.getElementById("teams");

const verifyInput =
    document.getElementById("verifyInput");

const verifyBtn =
    document.getElementById("verifyBtn");

const verifyResult =
    document.getElementById("verifyResult");


let techQuizDatabase = [];


/*====================================

LOAD CSV

====================================*/

async function loadTechQuizCSV(){

    try{

        const response =
            await fetch("data/tech-quiz.csv");

        const csv =
            await response.text();

        const parsed =
            Papa.parse(csv, {

                header:true,

                skipEmptyLines:true

            });


        techQuizDatabase =
            parsed.data.filter(row => {

                return (

                    getUniqueId(row,1) ||
                    getUniqueId(row,2) ||
                    getUniqueId(row,3) ||
                    getUniqueId(row,4)

                );

            });


        console.log(
            "Tech Quiz Database:",
            techQuizDatabase
        );


        displayTeams();

    }

    catch(error){

        console.error(error);

        teamsContainer.innerHTML = `

            <div class="error-box">

                <h3>Database Error</h3>

                <p>
                    Unable to load techquiz.csv
                </p>

            </div>

        `;

    }

}


/*====================================

GET UNIQUE ID

====================================*/

function getUniqueId(row, number){

    return (

        row[`Participant ${number} Unique ID`] ||

        row[`Player ${number} Unique ID`] ||

        ""

    ).trim();

}


/*====================================

GET NAME

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

DISPLAY TEAMS

====================================*/

function displayTeams(){

    teamsContainer.innerHTML = "";

    techQuizDatabase.forEach((team,index)=>{

        const card =
            document.createElement("div");

        card.className = "team-card";


        let membersHTML = "";


        for(let i=1;i<=4;i++){

            const name =
                getName(team,i);

            const id =
                getUniqueId(team,i);

            if(!name && !id){

                continue;

            }


            membersHTML += `

                <div class="member">

                    <span>
                        Participant ${i}
                    </span>

                    <h3>
                        ${name || "N/A"}
                    </h3>

                    <p>
                        Unique ID:
                        ${id || "N/A"}
                    </p>

                </div>

            `;

        }


        card.innerHTML = `

            <div class="team-number">

                TEAM ${index + 1}

            </div>


            <h2>
                ${team["Team Name"] || "Unnamed Team"}
            </h2>


            <p class="contact-info">

                ${team["Contact Email"] || "No Email"}

            </p>


            <div class="team-members">

                ${membersHTML}

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


    for(const team of techQuizDatabase){

        for(let i=1;i<=4;i++){

            const id =
                getUniqueId(team,i);


            if(id === enteredId){

                foundTeam = team;

                foundParticipantNumber = i;

                break;

            }

        }


        if(foundTeam){

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
                    for the Tech Quiz.
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


    /*------------------------------
    TEAM MEMBERS
    ------------------------------*/

    let membersHTML = "";


    for(let i=1;i<=4;i++){

        const name =
            getName(foundTeam,i);

        const id =
            getUniqueId(foundTeam,i);

        const studentClass =
            getClass(foundTeam,i);


        if(!name && !id){

            continue;

        }


        const isVerifiedStudent =
            id === enteredId;


        membersHTML += `

            <div class="verified-member
                ${isVerifiedStudent ? "current-member" : ""}">

                <span>
                    Participant ${i}
                </span>

                <h4>
                    ${name || "N/A"}
                </h4>

                <p>
                    <strong>Class:</strong>
                    ${studentClass || "N/A"}
                </p>

                <p>
                    <strong>Unique ID:</strong>
                    ${id || "N/A"}
                </p>

                ${
                    isVerifiedStudent
                    ?
                    `<strong class="current-label">
                        ← MATCHED STUDENT
                    </strong>`
                    :
                    ""
                }

            </div>

        `;

    }


    /*------------------------------
    RESULT
    ------------------------------*/

    verifyResult.innerHTML = `

        <div class="result-success">

            <h3>✅ REGISTERED</h3>

            <hr>


            <div class="matched-person">

                <span>UNIQUE ID MATCH</span>

                <h2>
                    ${currentName || "N/A"}
                </h2>

                <p>
                    <strong>Class:</strong>
                    ${currentClass || "N/A"}
                </p>

                <p>
                    <strong>Unique ID:</strong>
                    ${enteredId}
                </p>

            </div>


            <div class="team-details">

                <h4>TEAM DETAILS</h4>

                <p>
                    <strong>Team Name:</strong>
                    ${foundTeam["Team Name"] || "N/A"}
                </p>

                <p>
                    <strong>Email:</strong>
                    ${foundTeam["Contact Email"] || "N/A"}
                </p>

                <p>
                    <strong>Contact:</strong>
                    ${foundTeam["Contact Number"] || "N/A"}
                </p>

            </div>


            <h4 class="members-title">
                TEAM MEMBERS
            </h4>


            <div class="verified-members">

                ${membersHTML}

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

loadTechQuizCSV();