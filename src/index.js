/* Hi, if you're reading this: I know this is quite, quite messy :( 
   I really wanted to get this in for the application
*/

const Content = [
    {
        image: "./images/pong.png",
        title: "Pong",
        description:`A clone of pong made using JavaScript, Node, and socket.io. 
        Create a game, send the game code to a friend, and be the 
        first to score 7 points! Oh, and you can also 'dash' up and down 
        by pressing the spacebar, for a bit of spice.`,
        link: "https://toscoes-socket-pong.herokuapp.com/",
        src: "https://github.com/Toscoes/socket-pong"
    },
    {
        image: "./images/dd.png",
        title: "Dashing Dungeoneers",
        description:`Slash through endless enemies in this 1-button, fast paced game. 
        Made in pure JavaScript, my own programmer art, and inspired by an old flash game. 
        Try to fake out the big guys with shields!.`,
        link: "./src/dashing_dungeoneers/index.html",
        src: "https://github.com/Toscoes/toscoes.github.io/tree/master/src/dashing_dungeoneers"
    },
    {
        image: "./images/solarsystem.png",
        title: "CSS Solar System",
        description:`A depiction of our solar system. No JavaScript, just HTML and CSS.`,
        link: "./src/cssss/solarsystem.html",
        src: "https://github.com/Toscoes/toscoes.github.io/blob/master/src/cssss/solarsystem.html"
    },
    {
        image: "./images/snowfall.png",
        title: "Falling Snow",
        description:`A pleasantly relaxing page of uniquely generated snowflakes.`,
        link: "./src/snowfall/index.html",
        src: "https://github.com/Toscoes/toscoes.github.io/tree/master/src/snowfall"
    }
]

const Carousel = document.getElementById("images")
const DescriptionCarousel = document.getElementById("descriptions")
const btnPrev = document.getElementById("prev")
const btnNext = document.getElementById("next")
const Blips = document.getElementById("blips")
let intervalId = null

function init() {
    let startingIndex = -1
    let currentIndex = -startingIndex
    Content.forEach(e => {
        let item = document.createElement("div")
        item.classList.add("carousel-item")
        item.style.backgroundImage = `url(${e.image})`
        item.style.left = `${currentIndex * 100}%`
        
        Carousel.appendChild(item)

        let descriptionContainer = document.createElement("div")
        descriptionContainer.classList.add("container")
        descriptionContainer.classList.add("description")
        descriptionContainer.style.right = `${currentIndex * -120}%`

        descriptionContainer.innerHTML = `
        <span class="bigger title text">${e.title}</span>&nbsp;&nbsp;&nbsp;<span class="card desc text">${e.description}</span></span>
        <div class="links desc text">
            <a class="title text btn" href="${e.link}">View</a><a class="title text btn" href="${e.src}">Source</a>
        </div>
    `

        DescriptionCarousel.appendChild(descriptionContainer)

        let blip = document.createElement("div")
        let circle = document.createElement("div")
        blip.classList.add("blip")
        let b = currentIndex - 1
        circle.addEventListener("click", function() {
            jump(b)
        })
        blip.appendChild(circle)
        Blips.appendChild(blip)

        currentIndex++
    })

    btnPrev.addEventListener("click", function() {
        resetInterval()
        next(-1)
    })

    btnNext.addEventListener("click", function() {
        resetInterval()
        next(1)
    })

    function resetInterval() {
        if (intervalId) {
            clearInterval(intervalId)
            intervalId = setInterval(()=> {
                next(1)
            }, 5000)
        }
    }

    function next(direction) {
        startingIndex += direction
        if (startingIndex >= Content.length) {
            startingIndex = 0
        }
        if (startingIndex < 0) {
            startingIndex = Content.length - 1
        }
        jump(startingIndex)
    }

    let currentBlip = null
    function jump(index) {
        startingIndex = index
        const DescriptionCarouselChildren = document.querySelectorAll("#descriptions > div")
        const ImagesCarouselChildren = document.querySelectorAll("#images > div")
        const NavigationBlips = document.querySelectorAll("#blips > div")
        currentIndex = -startingIndex
        let b = currentIndex
        ImagesCarouselChildren.forEach(carItem => {
            carItem.style.left = `${currentIndex * 100}%`
            currentIndex++
        })

        DescriptionCarouselChildren.forEach(carItem => {
            carItem.style.right = `${b * -120}%`
            b++
        })

        if (currentBlip) {
            currentBlip.firstElementChild.classList.toggle("selected")
        }
        currentBlip = NavigationBlips[index]
        currentBlip.firstElementChild.classList.toggle("selected")
    }

    setTimeout(()=> {
        jump(0)
        intervalId = setInterval(()=> {
            next(1)
        }, 5000)
    }, 750)


}

init()
