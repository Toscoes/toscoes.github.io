import Projectile from "./projectile.js"

export default class Arena {
    constructor(width, height) {
        this.width = width
        this.height = height
    }

    keepBounds(object) {

        if (object.collider.x - object.collider.radius + object.dx < 0) { // left arena
            object.dx = 0
            object.collider.x = object.collider.radius + object.dataCollider.offsetX

            object.x = object.collider.radius

            object.onCollision(this)
        }
    
        if (object.collider.x + object.collider.radius + object.dx > this.width) { // right arena
            object.dx = 0
            object.collider.x = this.width - object.collider.radius - object.dataCollider.offsetX

            object.x = this.width - object.collider.radius

            object.onCollision(this)
        }
    
        if (object.collider.y - object.collider.radius + object.dy < 0) { // top arena
            object.dy = 0
            object.collider.y = object.collider.radius + object.dataCollider.offsetY

            object.y = object.collider.radius

            object.onCollision(this)
        }
    
        if (object.collider.y + object.collider.radius + object.dy > this.height) { // bottom arena
            object.dy = 0
            object.collider.y = this.height - object.collider.radius - object.dataCollider.offsetY

            object.y = this.height - object.collider.radius

            object.onCollision(this)
        }
    }
}