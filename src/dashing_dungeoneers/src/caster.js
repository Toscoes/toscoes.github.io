import Enemy from "./enemy.js";
import Data from "./entitydata.js";
import Projectile from "./projectile.js"
import GameObject from "./gameobject.js";
import Globals from "./globals.js"
import Player from "./player.js"

const CastTime = Data.caster.castTime
const CastRate = Data.caster.castRate

export default class Caster extends Enemy {
    
    static Instances = []

    constructor(x,y) {
        super(x,y,Data.caster);
        this.fireRate = CastRate;
        this.fireTime = CastTime;
        this.changeState(Caster.State.Default);
        Caster.Instances.push(this);
    }

    static new(x,y) {
        let instance = GameObject.getInactive(Caster.Instances);
        if (instance) {
            return instance.revive(x,y);
        } else {
            return new Caster(x,y);
        }
    }

    revive(x,y) {
        super.revive(x,y,Data.caster)
        this.fireRate = CastRate
        this.changeState(Caster.State.Default)
        return this
    }

    update() {
        super.update()
    }

    onCollision(other) {
        if (other instanceof Player) {
            if (other.dashing) {
                this.setActive(false)
                other.score++
            }
        }
    }

    fire() {
        const projectile = Projectile.new(this,Data.caster.projectile)
        let angle = Globals.radBetweenPoint(this.x,this.y,this.target.x,this.target.y)
        projectile.dx = Math.cos(angle) * Data.caster.projectile.speed
        projectile.dy = Math.sin(angle) * Data.caster.projectile.speed
    }

    static State = {
        Default: {
            id: 0,
            onChange: function(caster) {
                caster.setAnimation("casteridle")
            },
            behavior: function(caster) {
                if (caster.target) {
                    if (caster.tick > caster.fireTime) {
                        caster.changeState(Caster.State.Casting)
                    }
                }
            }
        },
        Casting: {
            id: 1,
            onChange: function(caster) {
                caster.setAnimation("castercast")
            },
            behavior: function(caster) {
                if (caster.tick > caster.fireRate) {
                    caster.fire()
                    caster.changeState(Caster.State.Default)
                }
            }
        }
    }

}