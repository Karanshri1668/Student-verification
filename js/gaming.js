const teamsContainer = document.getElementById("teams");
const verifyInput = document.getElementById("verifyInput");
const verifyBtn = document.getElementById("verifyBtn");
const verifyResult = document.getElementById("verifyResult");

let gamingDatabase = [];

async function loadGamingCSV(){

    const response = await fetch("data/Gaming.csv");

    const csv = await response.text();

    const parsed = Papa.parse(csv,{

        header:true,

        skipEmptyLines:true

    });

    const rows = parsed.data;

    rows.forEach(row=>{

        const squad={

            squadName:row["Squad Name"],

            leader:{

                name:row["Leader Name"],

                email:row["Leader Email"],

                phone:row["Leader Phone"]

            },

            game:row["Game"],

            utr:row["UTR ID"],

            players:[]

        };

        for(let i=1;i<=4;i++){

            const id=row[`Player ${i} Unique ID`];

            if(id && id.trim()!==""){

                squad.players.push({

                    name:row[`Player ${i} Name`],

                    class:row[`Player ${i} Class`],

                    uniqueId:id

                });

            }

        }

        gamingDatabase.push(squad);

    });

    console.log(gamingDatabase);

    displayTeams();

}

loadGamingCSV();

function displayTeams(){

    teamsContainer.innerHTML="";

    gamingDatabase.forEach((team,index)=>{

        const card=document.createElement("div");

        card.className="team-card";

        card.innerHTML=`

            <h2>${team.squadName}</h2>

            <p><strong>Game :</strong> ${team.game}</p>
            <p><strong>UPI Transction ID :</strong> ${team.utr}</p>

            <p><strong>Leader :</strong> ${team.leader.name}</p>

            <p><strong>Players :</strong> ${team.players.length}</p>

            <button onclick="viewTeam(${index})">

                View Squad

            </button>

        `;

        teamsContainer.appendChild(card);

    });

}

const modal = document.getElementById("teamModal");

const modalBody = document.getElementById("modalBody");

const closeModal = document.getElementById("closeModal");

// console.log(modal);
// console.log(modalBody);
// console.log(closeModal);

function viewTeam(index){

    console.log(index);
    const team = gamingDatabase[index];

    let html = `

        <div class="leader-box">

            <h2>${team.squadName}</h2>

            <p><strong>Game :</strong> ${team.game}</p>

            <p><strong>Leader :</strong> ${team.leader.name}</p>

            <p><strong>Email :</strong> ${team.leader.email}</p>

            <p><strong>Phone :</strong> ${team.leader.phone}</p>

        </div>

        <div class="players">

    `;

    team.players.forEach((player,i)=>{

        html += `

            <div class="player-card">

                <h3>Player ${i+1}</h3>

                <p><strong>Name :</strong> ${player.name}</p>

                <p><strong>Class :</strong> ${player.class}</p>

                <p><strong>Unique ID :</strong> ${player.uniqueId}</p>

            </div>

        `;

    });

    html += `</div>`;

    modalBody.innerHTML = html;

    modal.classList.add("active");

}

closeModal.addEventListener("click",()=>{

    modal.classList.remove("active");

});

window.addEventListener("click",(e)=>{

    if(e.target===modal){

        modal.classList.remove("active");

    }

});

function verifyParticipant(){

    const id = verifyInput.value.trim();

    if(id===""){

        verifyResult.innerHTML=`

            <div class="not-found">

                Please enter a Unique ID.

            </div>

        `;

        return;

    }

    let foundPlayer=null;

    let foundTeam=null;

    for(const team of gamingDatabase){

        const player=team.players.find(

            p=>String(p.uniqueId).trim()===id

        );

        if(player){

            foundPlayer=player;

            foundTeam=team;

            break;

        }

    }

    if(foundPlayer){

        verifyResult.innerHTML=`

            <div class="verified">

                <h3>✅ REGISTERED</h3>

                <hr>

                <p><strong>Name :</strong> ${foundPlayer.name}</p>

                <p><strong>Class :</strong> ${foundPlayer.class}</p>

                <p><strong>Unique ID :</strong> ${foundPlayer.uniqueId}</p>

                <br>

                <p><strong>Squad :</strong> ${foundTeam.squadName}</p>

                <p><strong>Game :</strong> ${foundTeam.game}</p>

                <p><strong>Leader :</strong> ${foundTeam.leader.name}</p>

            </div>

        `;

    }

    else{

        verifyResult.innerHTML=`

            <div class="not-found">

                <h3>❌ NOT REGISTERED</h3>

                <hr>

                <p>No player found with this Unique ID.</p>

            </div>

        `;

    }

}

verifyBtn.addEventListener("click",verifyParticipant);

verifyInput.addEventListener("keypress",(e)=>{

    if(e.key==="Enter"){

        verifyParticipant();

    }

});

