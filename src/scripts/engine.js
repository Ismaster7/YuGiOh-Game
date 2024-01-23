const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score-points")
    },
    cardSprite: {
        avatar:document.getElementById("card-image"),
        name:document.getElementById("card-name"),
        type:document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    playerSides : {
        player1: "player-cards",
        computer: "computer-cards",
       player1Box: document.querySelector("#computer-cards"),
        computerBox: document.querySelector("#player-cards"),
    },
    actions: {
        button: document.getElementById("next-duel"), 
    }
}

const pathImages = "./src/assets/icons/"

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        WinOf: [1],
        LoseOf: [2],

    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        WinOf: [2],
        LoseOf: [0],

    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        WinOf: [0],
        LoseOf: [1],

    }
]
async function getRandomCardId(){
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id
}

async function createCardImage(IdCard, fieldSide){

    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100rem");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if (fieldSide === state.playerSides.player1){
        cardImage.addEventListener("mouseover", ()=>{
            drawSelectCard(IdCard);
        })


        cardImage.addEventListener("click", () =>{
            setCardsField(cardImage.getAttribute("data-id"));
            
        })
    }

    return cardImage;
};


async function setCardsField(cardId){

    await removeAllCardsImage();

    let computerCardId = await getRandomCardId();

    state.fieldCards.player.style.display = "block"
    state.fieldCards.computer.style.display = "block"

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResult = await checkDuelResult(cardId, computerCardId);
    
    await updateScore();
    await drawButton(duelResult);

}

async function updateScore(){
    
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore}
    | Lose : ${state.score.computerScore}`
}

async function drawButton(resultado){
    state.actions.button.innerText = resultado;
    state.actions.button.style.display = "block";
}

async function resetDuel(){
    state.cardSprite.avatar.src = "";
    state.actions.button.style.display = "none";
    state.fieldCards.computer.style.display = "none"
    state.fieldCards.player.style.display = "none" 
    main();
}

async function checkDuelResult(playerCardId, computerCardId){
    let duelResult = "Empate";
    let playerCard = cardData[playerCardId];

    if(playerCard.WinOf.includes(computerCardId)){
        duelResult = "Ganhou";
        state.score.playerScore++;
    }

    if(playerCard.LoseOf.includes(computerCardId)){
        duelResult = "Perdeu";
        state.score.computerScore++;
    }
    
    return duelResult;
}

async function removeAllCardsImage(){
    let {computerBox, player1Box} = state.playerSides
    let imgElements = computerBox.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
    
    
    imgElements = player1Box.querySelectorAll("img")
    imgElements.forEach((img) => img.remove());
}


async function drawSelectCard (index){

    state.cardSprite.avatar.src = cardData[index].img;
    state.cardSprite.name.innerText = cardData[index].name;
    state.cardSprite.type.innerText = "Atributte : " + cardData[index].type;

}

async function drawCards(cardNumbers, fieldSide){
    for(let i = 0; i < cardNumbers; i++){
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage)
    }
}

function main(){
    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);
}

main()