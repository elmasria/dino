(async () => {
    /**
     * Returns the converted height in inches
     * @param {float} hFeet - The height in feet
     * @param {float} hInches - The height of the inches
     * @returns {float} height - The height in inches
     */
    function convertHeight (hFeet, hInches) {
        return (hFeet * 12) + hInches
    }

    /**
     * Returns the DOM element value by id
     * @param {string} elementId - The Elemnet id
     * @returns {string} The Elemnet value
     */
    function getInputValue (elementId) {
        return document.getElementById(elementId).value
    }

    /**
     * Returns the DOM element div contains grid elments
     * @param {string} species
     * @param {string} imageUrl
     * @param {string} fact
     * @returns {string} DOM element div contains grid elments
     */
    function generateGridItem (species, imageUrl, fact) {
        const gridDiv = document.createElement('div')
        gridDiv.className = 'grid-item'

        const speciesDiv = document.createElement('h3')
        speciesDiv.innerText = species
        gridDiv.appendChild(speciesDiv)

        const imageDiv = document.createElement('img')
        imageDiv.src = imageUrl
        gridDiv.appendChild(imageDiv)

        if (fact) {
            const factFiv = document.createElement('p')
            factFiv.innerText = fact
            gridDiv.appendChild(factFiv)
        }

        return gridDiv
    }

    const response = await fetch('./dino.json')
    const json = await response.json()
    let dinos = json.Dinos

    /**
     * Represents an Animal.
     * @constructor
     * @param {species} title
     * @param {float} weight
     * @param {float} height
     */
    function Animal (species, weight, height) {
        this.species = species
        this.weight = weight
        this.height = height
    }

    Animal.prototype.getImage = function () {
        return `images/${this.species.toLowerCase()}.png`
    }

    /**
     * Represents an Dino.
     * @constructor
     * @param {species} title
     * @param {float} weight
     * @param {float} height
     * @param {string} diet
     * @param {string} where
     * @param {string} when
     * @param {string} fact
     */
    function Dino (species, weight, height, diet, where, when, fact) {
        Animal.call(this, species, weight, height)
        this.diet = diet
        this.where = where
        this.when = when
        this.facts = [fact]
    }

    Dino.prototype = Object.create(Animal.prototype)
    Dino.prototype.constructor = Dino

    Dino.prototype.setFacts = function () {
        this.facts.push(`Species is ${this.species}.`)
        this.facts.push(`I was in ${this.when}.`)
        this.facts.push(`I am from ${this.where}.`)
    }

    Animal.prototype.getAFact = function () {
        const index = Math.floor(Math.random() * 10) % this.facts.length
        return this.facts[index]
    }

    /** Create Dino Compare by name Method. */
    Dino.prototype.compareName = function (name) {
        let result = 'Same name weight!'
        if (this.name > name) {
            result = `Based on alphabetical ${this.name} comes before ${name}!`
        } else if (this.name < name) {
            result = `Based on alphabetical ${name} comes before ${this.name}!`
        }
        this.facts.push(result)
    }

    /** Create Dino Compare by weight Method. */
    Dino.prototype.compareWeight = function (weight, name) {
        let result = 'Same weight'
        if (this.weight > weight) {
            result = `${this.weight} lbs for ${this.species} is bigger than ${weight} lbs for ${name}`
        } else if (this.weight < weight) {
            result = `${weight} lbs for ${name} is bigger than ${this.weight} lbs for ${this.species}`
        }
        this.facts.push(result)
    }

    /** Create Dino Compare by height Method. */
    Dino.prototype.compareHeight = function (height, name) {
        let result = 'Same height.'
        if (this.height > height) {
            result = `${this.height} inches for ${this.species} is bigger than ${height} inches for ${name}`
        } else if (this.height < height) {
            result = `${height} inches for ${name} is bigger than ${this.height} inches for ${this.species}`
        }
        this.facts.push(result)
    }

    /** Create Dino Objects. */
    dinos = dinos.map((dino) => {
        const { species, weight, height, diet, where, when, fact } = dino
        const cDino = new Dino(species, weight, height, diet, where, when, fact)
        cDino.setFacts()
        return cDino
    })

    /**
     * Represents an Human.
     * @constructor
     * @param {name} name
     * @param {float} weight
     * @param {float} height
     */
    function Human (name, weight, height) {
        Animal.call(this, 'human', weight, height)
        this.name = name
    }

    Human.prototype = Object.create(Animal.prototype)
    Human.prototype.constructor = Human

    /** Use IIFE to get human data from form. */
    function getHumanData () {
        return (function () {
            const name = getInputValue('name')
            const heightFeet = parseFloat(getInputValue('feet'))
            const heightInches = parseFloat(getInputValue('inches'))
            const weight = parseFloat(getInputValue('weight'))
            const height = convertHeight(heightFeet, heightInches)
            return new Human(name, weight, height)
        })()
    }

    /** Generate Tiles for each Dino in Array. */
    function generateTileForDino (human) {
        dinos.forEach(dino => {
            dino.compareName(human.name)
            dino.compareHeight(human.height, human.name)
            dino.compareWeight(human.weight, human.name)
        })
    }

    function generateFragment (human) {
        const frag = document.createDocumentFragment()
        dinos.forEach((dino, i) => {
            let fact = dino.getAFact()
            if (dino.species === 'Pigeon') {
                fact = 'All birds are Dinosaurs'
            }
            const elem = generateGridItem(dino.species, dino.getImage(), fact)
            frag.appendChild(elem)
            if (i === 3) {
                const humanElem = generateGridItem(human.name, human.getImage())
                frag.appendChild(humanElem)
            }
        })
        return frag
    }

    /** On button click, prepare and display infographic. */
    const btnCompare = document.getElementById('btn')
    btnCompare.addEventListener('click', function () {
        const diGrid = document.getElementById('grid')
        const human = getHumanData()
        generateTileForDino(human)

        // Add tiles to DOM
        const frag = generateFragment(human)
        diGrid.appendChild(frag)

        // Remove form from screen
        document.getElementById('dino-compare').style.display = 'none'
    })
})()
