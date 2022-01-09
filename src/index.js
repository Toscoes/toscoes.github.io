import "./style.scss"
import pong from "../images/pong.png"

/* Hi, if you're reading this: I know this is quite, quite messy :( 
   I really wanted to get this in for the application
*/

const Images = [pong,pong,pong]
const Titles = ["", "Pong", "Asteroids 2.0", "Dashing Dungeoneers" ]
const Hrefs = ["", "https://toscoes-socket-pong.herokuapp.com/", "", ""]
const Source = []

const Descriptions = [
    "",

    `A clone of pong made using JavaScript, Node, and socket.io. 
    Create a game, send the game code to a friend, and be the 
    first to score 7 points! Oh, and you can also 'dash' up and down 
    by pressing the spacebar, for a bit of spice.`,

    `Dodge and destroy asteroids. Made in pure JavaScript and my own programmer art.`,

    `Slash through endless enemies in this 1-button, fast paced game. 
    Inspired by an old flash game. 
    Try to fake out the big guys with shields!`
    
]

const Carousel = document.getElementById("images")
const Description = document.getElementById("description")
const btnPrev = document.getElementById("prev")
const btnNext = document.getElementById("next")
const Blips = document.getElementById("blips")

function init() {
    let startingIndex = -1
    let currentIndex = -startingIndex
    Images.forEach(img => {
        let item = document.createElement("div")
        item.classList.add("carousel-item")
        item.style.backgroundImage = `url(${img})`
        item.style.left = `${currentIndex * 100}%`
        
        Carousel.appendChild(item)

        let description = document.createElement("div")
        description.classList.add("carousel-item")
        description.style.top = `${(currentIndex * 100) + 15}%`
        description.innerHTML = `
        <div>
            <div class="title text">${Titles[currentIndex]}</div>
            <br>
            <div class="card desc text">${Descriptions[currentIndex]}</div>
            <br>
            <div class="links desc text">
                <a class="btn" href="${Hrefs[currentIndex]}">View</a><a class="btn" href="#">Source</a>
            </div>
        </div>`
        Description.appendChild(description)

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
        next(-1)
    })

    btnNext.addEventListener("click", function() {
        next(1)
    })

    function next(direction) {
        startingIndex += direction
        if (startingIndex >= Images.length) {
            startingIndex = 0
        }
        if (startingIndex < 0) {
            startingIndex = Images.length - 1
        }
        jump(startingIndex)
    }

    let currentBlip = null
    function jump(index) {
        startingIndex = index
        const ImagesCarouselChildren = document.querySelectorAll("#images > div")
        const DescriptionCarouselChildren = document.querySelectorAll("#description > div")
        const NavigationBlips = document.querySelectorAll("#blips > div")
        currentIndex = -startingIndex
        let b = currentIndex
        ImagesCarouselChildren.forEach(carItem => {
            carItem.style.left = `${currentIndex * 100}%`
            currentIndex++
        })
        DescriptionCarouselChildren.forEach(carItem => {
            carItem.style.top = `${(b * 100) + 15}%`
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
    }, 750)
}

init()
