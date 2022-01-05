import { Spritesheet, Stage } from "./app.js"
import Collider from "./collider.js"
import Globals from "./globals.js"

export default class GameObject {

    static Instances = []

    constructor(x,y,data) {
        this.dataCollider = data.collider
        this.x = x
        this.y = y
        this.dx = 0
        this.dy = 0
        this.rotation = 0
        this.collider = new Collider(x+data.collider.offsetX,y+data.collider.offsetY,+data.collider.radius)
        this.sprite = new PIXI.AnimatedSprite(Spritesheet.animations["playerrun"])
        this.sprite.position.set(this.x, this.y)
        this.sprite.anchor.set(0.5)
        this.sprite.scale.set(Globals.Scale)
        this.sprite.animationSpeed = .2
        this.sprite.visible = false
        this.active = true
        Stage.addChild(this.sprite)
        GameObject.Instances.push(this)
    }

    static getInactive(instances) {
        for(let i = 0; i < instances.length; i++) {
            if (!instances[i].active) {
                return instances[i];
            }
        }
        return null;
    }

    revive(x,y,data) {
        this.dataCollider = data.collider;
        this.collider.x = x
        this.collider.y = y
        this.x = x;
        this.y = y;
        this.dx = 0;
        this.dy = 0;
        this.rotation = 0;
        this.sprite.position.set(this.x, this.y);
        this.collider = new Collider(x+data.collider.offsetX,y+data.collider.offsetY,+data.collider.radius);
        this.setActive(true)
    }

    updatePosition() {
        this.collider.x += this.dx;
        this.collider.y += this.dy;
        this.x = this.collider.x;
        this.y = this.collider.y;
        this.sprite.position.set(this.x, this.y);
    }

    setRotation(rot) {
        this.rotation = rot
        this.sprite.rotation = rot
    }

    setAnimation(animation) {
        this.sprite.visible = true
        try {
            this.sprite.textures = Spritesheet.animations[animation]
            this.sprite.play()
        } catch(e) {
            const singleFrame = [Spritesheet.textures[animation+".png"]]
            this.sprite.textures = singleFrame
            this.sprite.play()
        }
    }

    setActive(a) {
        this.active = a
        this.sprite.visible = a
    }

    update() {}
    onCollision(other) {}
}