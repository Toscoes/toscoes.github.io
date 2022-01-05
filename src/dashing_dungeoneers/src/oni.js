import Enemy from "./enemy.js";
import Data from "./entitydata.js";
import Player from "./player.js";

const CastCooldown = 60

export default class Oni extends Enemy {
    constructor(x,y) {
        super(x,y,Data.oni)
        this.castTick = 0
        this.changeState(Oni.State.Default)
    }

    update() {
        super.update()
        this.castTick++
    }

    onCollision(other) {
        if (other instanceof Player) {

        }
    }

    // fix animation not not looping
    static State = {
        Default: {
            id: 0,
            onChange: function(oni) {
                oni.sprite.set(Data.oni.sprite)
                oni.castTick = 0
            },
            behavior: function(oni) {
                if (oni.castTick > CastCooldown) {
                    oni.changeState(Oni.State.Casting)
                }
            }
        },
        Casting: {
            id: 1,
            onChange: function(oni) {
                oni.sprite.set(Data.oni.casting)
            },
            behavior: function(oni) {
                if (oni.castTick > CastCooldown + 180) {
                    oni.changeState(Oni.State.Default)
                }
            }
        }
    }
}