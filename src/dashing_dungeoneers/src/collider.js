export default class Collider {
    constructor(x,y,r) {
        this.x = x
        this.y = y
        this.radius = r
    }

    collides(other) {
        return Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2) < Math.pow(this.radius + other.radius,2)
    }
}