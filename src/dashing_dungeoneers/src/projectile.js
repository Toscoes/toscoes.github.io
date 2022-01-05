import GameObject from "./gameobject.js";
import Arena from "./arena.js";
import Player from "./player.js";

export default class Projectile extends GameObject {
    constructor(shooter,data) {
        super(shooter.x,shooter.y,data)
        this.shooter = shooter
        this.setAnimation("casterproj")

        Projectile.Instances.push(this)
    }

    static Instances = []

    static new(shooter, data) {
        let instance = GameObject.getInactive(Projectile.Instances)
        if (instance) {
            return instance.revive(shooter, data)
        } else {
            return new Projectile(shooter, data)
        }
    }

    revive(shooter, data) {
        super.revive(shooter.x, shooter.y, data)
        this.shooter = shooter
        this.sprite.gotoAndPlay(0)
        
        return this
    }

    update() {
        super.update()
    }

    onCollision(other) {
        if (other instanceof Arena) {
            this.setActive(false)
        }
        if (other instanceof Player) {
            other.setActive(false)
        }
    }
}