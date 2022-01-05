const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")

const Mouse = {
    x: -1,
    y: -1
}


class Point {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    draw() {
        context.beginPath();
        context.fillStyle = "red";
        context.arc(this.x, this.y, 2, 0, Math.PI * 2);
        context.fill();
    }
}

class Line {
    constructor(x,y,sx,sy) {
        this.x = x;
        this.y = y;
        this.sx = sx;
        this.sy = sy;
        this.dx = this.sx - this.x;
        this.dy = this.sy - this.y;
    }
    drawTo(x, y) {
        context.beginPath();
        context.strokeStyle = "red";
        context.moveTo(this.x, this.y);
        context.lineTo(x,y);
        context.stroke();
        context.beginPath();
        context.fillStyle = "red";
        context.arc(x, y, 4, 0, Math.PI * 2);
        context.fill();
    }
    setOrigin(x,y) {
        this.x = x;
        this.y = y;
        this.dx = this.sx - this.x;
        this.dy = this.sy - this.y;
    }
    setEndpoint(x,y) {
        this.sx = x;
        this.sy = y;
        this.dx = this.sx - this.x;
        this.dy = this.sy - this.y;
    }
    intersects(other) {
        let s_dx = other.dx;
        let s_dy = other.dy;
        let s_px = other.x;
        let s_py = other.y;
        let T2Denominator = ((s_dx*this.dy)-(s_dy*this.dx));
        let T2 = ((this.dx*(s_py-this.y)) + (this.dy*(this.x-s_px)))/T2Denominator;
        let T1 = (s_px+(s_dx*T2)-this.x)/this.dx;
        return (T1 >= 0 && T2 >= 0 && T2 <= 1)? T1 : -1;
    }
}

class Rectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.corners = [
            new Point(this.x,this.y), // top left
            new Point(this.x + this.w,this.y), // top right
            new Point(this.x+this.w,this.y+this.h), // bottom right
            new Point(this.x,this.y+this.h) // bottom left
        ];
        this.edges = [
            new Line(this.x, this.y, this.x+this.w, this.y), //top
            new Line(this.x+this.w, this.y, this.x+this.w, this.y+this.h), // right
            new Line(this.x+this.w, this.y+this.h, this.x, this.y+this.h), // bottom
            new Line(this.x, this.y, this.x, this.y+this.h) //left
        ]
    }
    draw() {
        context.beginPath();
        context.fillStyle = "white";
        context.rect(this.x, this.y, this.w, this.h);
        context.fill();
    }

    contains(x,y) {
        return (x < this.x + this.w) && (x > this.x) && (y < this.y + this.h) && (y > this.y)
    }
}

let rects         = [];
let edges         = [];
let rays          = [];
let corners       = [];
let sortedCorners = [];

const numberOfRects = 5;
const maxWidth = 250;
const minWidth = 10;
const maxHeight = 250;
const minHeight = 10;

const ScreenPadding = 10

// must avoid overlapping rectangles

function init() {

    // initialize with canvas corners and edges
    corners.push(    
        new Point(-ScreenPadding,-ScreenPadding),
        new Point(context.canvas.width+ScreenPadding,-ScreenPadding),
        new Point(context.canvas.width + ScreenPadding,context.canvas.height + ScreenPadding),
        new Point(-ScreenPadding,context.canvas.height+ScreenPadding)
    );

    edges.push(
        new Line(-ScreenPadding,-ScreenPadding,context.canvas.width+ScreenPadding,-ScreenPadding),
        new Line(context.canvas.width+ScreenPadding,-ScreenPadding,context.canvas.width+ScreenPadding,context.canvas.height+ScreenPadding),
        new Line(context.canvas.width+ScreenPadding,context.canvas.height+ScreenPadding,-context.canvas.width-ScreenPadding,context.canvas.height+ScreenPadding),
        new Line(-ScreenPadding,-ScreenPadding,-ScreenPadding,context.canvas.height+ScreenPadding)
    );

    // place rectangles
    for (let i = 0; i < numberOfRects; i++) {
        rects.push(
            new Rectangle(
                Math.random() * context.canvas.width,
                Math.random() * context.canvas.height,
                (Math.random() * maxWidth) + minWidth,
                (Math.random() * maxHeight) + minHeight,
            )
        );
    }


    // add rectangle corners to list of corners and edges to list
    // of edges
    for (let i = 0; i < rects.length; i++) {
        let rect = rects[i];
        corners = corners.concat(rect.corners);
        edges = edges.concat(rect.edges);
    }

    // cast rays to corners 
    for (let i = 0; i < corners.length; i++) {
        let corner = corners[i]

        let ray = new Line(Mouse.x, Mouse.y, corner.x, corner.y)
        let raya = new Line(Mouse.x, Mouse.y, corner.x+0.01, corner.y)
        let rayb = new Line(Mouse.x, Mouse.y, corner.x-0.01, corner.y)
        rays.push(ray)
        rays.push(raya)
        rays.push(rayb)
    }

    requestAnimationFrame(update)
}

const radBetweenPoints = (x1,y1,x2,y2) => Math.atan2(y2 - y1, x2- x1)

function update() {

    context.clearRect(0,0,context.canvas.width,context.canvas.height)

    for(let i = 0; i < rays.length; i++) {
        let ray = rays[i];
        ray.setOrigin(Mouse.x,Mouse.y);
    }

    // calculate where each ray collides
    for (let i = 0; i < rays.length; i++) {
        let ray = rays[i];
        let closest = 9999;
        for (let j = 0; j < edges.length; j++) {
            let result = ray.intersects(edges[j]);
            if(result != -1 && result < closest) {
                closest = result;
            }
        }
        let ex = ray.x + (ray.dx * closest);
        let ey = ray.y + (ray.dy * closest);
        ray.drawTo(ex,ey);

        sortedCorners[i] = {x:ex,y:ey,angle:radBetweenPoints(Mouse.x,Mouse.y,ex,ey)}
    }

    sortedCorners.sort((a,b) => a.angle > b.angle? 1 : -1)

    context.fillStyle="green"
    for(let i = 1; i <= sortedCorners.length; i++) {

        if (i == sortedCorners.length) {
            let corner = sortedCorners[i-1]
            let prev = sortedCorners[0]
            context.beginPath();
            context.moveTo(Mouse.x, Mouse.y);
            context.lineTo(prev.x, prev.y);
            context.lineTo(corner.x, corner.y);
            context.fill();
        } else {
            let corner = sortedCorners[i]
            let prev = sortedCorners[i-1]
            context.beginPath();
            context.moveTo(Mouse.x, Mouse.y);
            context.lineTo(prev.x, prev.y);
            context.lineTo(corner.x, corner.y);
            context.fill();
        }


    }

    // draw rectangles
    for (let i = 0; i < rects.length; i++) {
        rects[i].draw();
    }

    requestAnimationFrame(update)
}

// input handlers
function onMouseClick(x, y) {

}

function onMouseMove(x, y) {

}

function onKeyPress(key) {

}

const keysLast = {}
const keysHeld = {}

document.addEventListener("mousemove", event => {
    Mouse.x = event.clientX
    Mouse.y = event.clientY
    onMouseMove(Mouse.x, Mouse.y)
})

document.addEventListener("click", event => {
    onMouseClick(Mouse.x, Mouse.y)
})

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

window.addEventListener("resize", resize)
function resize() {
    canvas.width = canvas.clientWidth * window.devicePixelRatio
    canvas.height = canvas.clientHeight * window.devicePixelRatio
    context.canvas.width = canvas.width
    context.canvas.height = canvas.height
    context.imageSmoothingEnabled = false

    init()
}
resize()