document.getElementById("btnOne").addEventListener("click", partOne)
document.getElementById("btnTwo").addEventListener("click", partTwo)
document.getElementById("btnThree").addEventListener("click", partThree)

function clearPage() {
    console.clear()
    deckId = ""
    names = []
    document.body.style.backgroundColor = 'white'
    document.getElementById("partOne").innerText = ""
    $('#getCard').show()
    $("#partTwo").hide()
    document.getElementById("partTwoDiv").innerText = ""
    $("#partThree").hide()
    document.getElementById("pokeArea").innerText = ""
}

document.getElementById("getCard").addEventListener("click", getCard)
document.getElementById("getPokemon").addEventListener("click", getPokemon)

async function getPokemon() {
    let baseURL = "https://pokeapi.co/api/v2/pokemon/"
    let pokeData = []
    document.getElementById("pokeArea").innerText = ""

    let countRes = await axios.get(baseURL)
    let count = countRes.data.count
    let allPokemon = await axios.get(`${baseURL}?limit=${count}`)
    let randomPokemon = _.sampleSize(allPokemon.data.results, 3)
    let randomThree = await Promise.all(randomPokemon.map(p => axios.get(p.url)))
    for (let pokemon of randomThree) {
        pokeData.push({ name: pokemon.data.name, imgSrc: pokemon.data.sprites.front_default })
    }
    let randdom3Desc = await Promise.all(randomThree.map(p => axios.get(p.data.species.url)))
    let pokeDex = randdom3Desc.map(p => {
        let description = p.data.flavor_text_entries.find(
            entry => entry.language.name === "en"
        )
        return description ? description.flavor_text : "No description available"
    })
    pokeDex.forEach((p, i) => {
        createPokemonCard(pokeData[i], p)
    });
}

function createPokemonCard(obj, desc) {
    let card = `
    <div class="card col ms-3" style="width: 18rem;">
    <img src=${obj.imgSrc} class="card-img-top" alt="pokemon pic">
    <div class="card-body">
      <h5 class="card-title">${obj.name}</h5>
      <p class="card-text">${desc}</p>
    </div>
  </div>
    `
    $("#pokeArea").append(card)
}

async function getCard() {
    if (!deckId) {
        return
    }
    let baseURL = "https://deckofcardsapi.com/api/deck";
    let draw = await axios.get(`${baseURL}/${deckId}/draw?count=1`)
    let imgSrc = draw.data.cards[0].image
    let angle = Math.random() * 90
    let card = document.createElement("img")
    card.setAttribute("src", imgSrc)
    card.classList.add("cardPic")
    card.style.transform = `rotate(${angle}deg)`
    document.getElementById("partTwoDiv").append(card)
    if (draw.data.remaining === 0) {
        $('#getCard').hide()
    }
}

async function partOne() {
    let baseURL = "http://numbersapi.com";
    clearPage()
    let favNumRes = await axios.get(`${baseURL}/2?json`)
    $("#partOne").append(`<p>${favNumRes.data.text}</p><hr>`)

    let numListRes = await axios.get(`${baseURL}/5,9,17?json`)
    let resObj = numListRes.data
    for (let key in resObj) {
        $("#partOne").append(`<p>${resObj[key]}</p>`)
    }
    let arr = [27, 27, 27, 27]
    let num27Res = await Promise.all(arr.map(num => axios.get(`${baseURL}/${num}?json`)))
    $("#partOne").append("<hr>")
    for (let fact of num27Res) {
        $("#partOne").append(`<p>${fact.data.text}</p>`)
    }
}

async function partTwo() {
    let baseURL = "https://deckofcardsapi.com/api/deck";
    clearPage()
    document.body.style.backgroundColor = 'green'
    let drawOne = await axios.get(`${baseURL}/new/draw/?count=1`)
    let card = drawOne.data.cards[0]
    console.log(`card: ${card.value} of ${card.suit}`)
    let firstDraw = await axios.get(`${baseURL}/new/draw/?count=1`)

    let cardOne = firstDraw.data.cards[0]

    cardArr = [cardOne]
    let secondDraw = await axios.get(`${baseURL}/${firstDraw.data.deck_id}/draw?count=1`)
    let cardTwo = secondDraw.data.cards[0]
    cardArr.push(cardTwo)
    for (let card of cardArr) {
        console.log(`card: ${card.value} of ${card.suit}`)
    }
    let newDeck = await axios.get(`${baseURL}/new/shuffle/?deck_count=1`)
    deckId = newDeck.data.deck_id
    $("#partTwo").show()
}

async function partThree() {
    let baseURL = "https://pokeapi.co/api/v2/pokemon/"
    clearPage()
    document.body.style.backgroundColor = 'cadetblue'
    let countRes = await axios.get(baseURL)
    let count = countRes.data.count
    let allPokemon = await axios.get(`${baseURL}?limit=${count}`)
    console.log(allPokemon.data)
    let randomPokemon = _.sampleSize(allPokemon.data.results, 3)
    let randomThree = await Promise.all(randomPokemon.map(p => axios.get(p.url)))
    for (let pokemon of randomThree) {
        console.log(pokemon.data)
        names.push(pokemon.data.name)
    }
    let randdom3Desc = await Promise.all(randomThree.map(p => axios.get(p.data.species.url)))
    let pokeDex = randdom3Desc.map(p => {
        let description = p.data.flavor_text_entries.find(
            entry => entry.language.name === "en"
        )
        return description ? description.flavor_text : "No description available"
    })
    pokeDex.forEach((p, i) => {
        console.log(`${names[i]}: ${p}`)
    });
    $("#partThree").show()
}