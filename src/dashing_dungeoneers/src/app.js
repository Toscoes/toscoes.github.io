import GameObject from "./gameobject.js"
import Player from "./player.js"
import Arena from "./arena.js"
import Globals from "./globals.js"
import Caster from "./caster.js"
import Turtle from "./paladin.js"
import BinaryTree from "./zindexer.js"
import Oni from "./oni.js"
import Bandit from "./bandit.js"
import Projectile from "./projectile.js"
import Enemy from "./enemy.js"
import Paladin from "./paladin.js"

const debug1 = document.querySelector("p:nth-child(1)")
const debug2 = document.querySelector("p:nth-child(2)")
const debug3 = document.querySelector("p:nth-child(3)")

const score = document.getElementById("score")
const gameOverBox = document.getElementById("game-over")
gameOverBox.querySelector("button").addEventListener("click", ()=>{
    location.reload()
})

const canvas = document.querySelector("canvas")
const app = new PIXI.Application({
    view: canvas, 
    width: canvas.clientWidth, 
    height: canvas.clientHeight, 
    backgroundColor: 0x1f1f1f, 
    resolution: window.devicePixelRatio || 1
});
document.body.appendChild(app.view);
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.settings.SORTABLE_CHILDREN = true;

let graphics = new PIXI.Graphics()
graphics.zIndex = 999;
app.stage.addChild(graphics);

PIXI.Loader.shared
.add("assets/spritesheet.json")
.add("assets/arena.json")
.load(setup);

export let Spritesheet = null;
export let Stage = app.stage;

let ArenaBg; 

let player; 

const MainArena = new Arena(750, 750)

const vertSrc = `
    attribute vec2 aVertexPosition;
    attribute vec2 aTextureCoord;
    uniform mat3 projectionMatrix;
    varying vec2 vTextureCoord;
    void main(void)
    {
        gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
        vTextureCoord = aTextureCoord;
    }
`

const fragSrc = `
    varying vec2 vTextureCoord;
    uniform sampler2D uSampler;
    void main(void)
    {
        vec4 color = texture2D(uSampler, vTextureCoord);

        color.rg += vTextureCoord;

        color.a = 0.8;

        gl_FragColor = color;
    }
`

const uniforms = {
	delta: 0
};

function setup() {
    Spritesheet = PIXI.Loader.shared.resources["assets/spritesheet.json"].spritesheet;
    ArenaBg = PIXI.Loader.shared.resources["assets/arena.json"].spritesheet;

    player = new Player(MainArena.width/2, MainArena.height/2)

    //let filter = new PIXI.Filter(null, fragSrc, uniforms)
    //player.sprite.filters = [filter]

    let t = new Paladin(200,200)
    t.setTarget(player)

    let bg = new PIXI.Sprite(ArenaBg.textures["arena2.png"]);
    bg.anchor.set(0)
    bg.scale.set(Globals.Scale)
    app.stage.addChild(bg)

    // ---------- Input handlers -------------
    function onMouseClick(button) {
        if (button == Mouse.LeftButton) {
            player.dash(Mouse.x, Mouse.y)
        }
    }

    function onMouseMove() {
        player.moveTo(Mouse.x, Mouse.y)
    }

    function onKeyPress(key) {
        if (key == "KeyP") Paused = !Paused
        if (key == "KeyO") Debug = !Debug
    }

    function onKeysHeld(keys) {

    }

    const keysLast = {}
    const keysHeld = {}
    const Mouse = {
        LeftButton: 0,
        RightButton: 2,
        x: -1,
        y: -1
    }

    document.addEventListener("mousemove", event => {
        const rect = canvas.getBoundingClientRect()
        Mouse.x = event.x - rect.left
        Mouse.y = event.y - rect.top
        onMouseMove()
    })

    document.addEventListener("mousedown", event => {
        onMouseClick(event.button)
    })

    canvas.addEventListener("contextmenu", event => event.preventDefault())

    document.addEventListener("keydown", event => {
        const key = event.code

        setKeysLast()

        keysHeld[key] = true

        if (isKeyPressed(key)) {
            onKeyPress(key)
        }

    })

    document.addEventListener("keyup", event => {
        const key = event.code

        setKeysLast()

        keysHeld[key] = false
    })

    function isKeyPressed(key) {
        return keysHeld[key] && !keysLast[key]
    }

    function setKeysLast() {
        for (let key in keysHeld) {
            keysLast[key] = keysHeld[key]; 
        }
    }

    setInterval(Main, 0);
}

let Paused = false
let Debug = false
let GameOver = false

let tick = 0
let maxEnemyCap = 32
let enemyCap = 6
let spawnRate = 60
let maxSpawnRate = 20
let enemyCapInc = 600
let spawnRateInc = 400

let banditChance = .5
let casterChance = .35
let paladinChance = .15

let chances = [paladinChance,casterChance, banditChance]

function spawnEnemy() {
    let x = Math.random() * MainArena.width
    let y = Math.random() * MainArena.height
    let r = Math.random()
    let a = 0;

    for(let i=0; i<chances.length; i++) {
        a+=chances[i];
        if (r < a) {
            if (i == 0) {
                let enemy = Paladin.new(x,y)
                enemy.setTarget(player)
            } else if (i == 1) {
                let enemy = Caster.new(x,y)
                enemy.setTarget(player)
            } else if (i == 2) {
                let enemy = Bandit.new(x,y)
                enemy.setTarget(player)
            }
            break;
        }
    }
}

function draw() {

    graphics.clear()

    GameObject.Instances.forEach(object => {
        if (object.active) {
            
            object.sprite.zIndex = object.sprite.y

            if (Debug) {
                graphics.lineStyle(1,0xe74c3c);
                graphics.drawCircle(object.x, object.y, object.collider.radius);
                graphics.endFill();
            }
        }
    })

    app.stage.sortChildren()

}

let delta = 0;
function update() {

    function animate() {
        delta += 0.1;
        uniforms.delta = 0.5 + Math.sin(delta) * 0.5;
    }

    GameObject.Instances.forEach(object => {
        if (object.active) {
            object.update()
            MainArena.keepBounds(object)

            GameObject.Instances.forEach(other => {
                if (object.active && object.collider.collides(other.collider)) {
                    object.onCollision(other) 
                }
            })

            object.updatePosition()
        }
    })

    if (tick % spawnRate == 0 && Enemy.getNumActive() < enemyCap) 
        spawnEnemy()

    if (tick % spawnRateInc == 0 && spawnRate < maxSpawnRate) {
        spawnRate -= 5
    }

    if (tick % enemyCapInc == 0 && enemyCap < maxEnemyCap) {
        enemyCap++
    }

    tick++

    score.innerText = player.score

    if (!player.active) {
        GameOver = true
        gameOverBox.style.display = "block"
    }
}

const Main = (function() {
    let loops = 0, skipTicks = 1000 / 60,
        maxFrameSkip = 10,
        nextGameTick = (new Date).getTime();

    return function() {
        loops = 0;
        
        while ((new Date).getTime() > nextGameTick && loops < maxFrameSkip && !GameOver) {
            if (!Paused) {
                update()
            }
                nextGameTick += skipTicks;
                loops++;
        }
        
        draw()
    };
})()
