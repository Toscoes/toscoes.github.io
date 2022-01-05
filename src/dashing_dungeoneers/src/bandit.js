import Enemy from "./enemy.js";
import Data from "./entitydata.js";
import GameObject from "./gameobject.js";
import Globals from "./globals.js";
import Player from "./player.js";

// Default Values
const DashPrepTime = Data.bandit.dashPrepTime
const DashDuration = Data.bandit.dashDuration
const DashPower = Data.bandit.dashPower
const DashPrepDist = Data.bandit.dashPrepDist
const MoveSpeed = Data.bandit.moveSpeed

export default class Bandit extends Enemy {

    static Instances = []

    constructor(x,y) {
        super(x,y,Data.bandit)
        this.dashPrepTime = DashPrepTime
        this.dashDuration = DashDuration
        this.dashPower = DashPower
        this.dashPrepDist = DashPrepDist
        this.moveSpeed = MoveSpeed 
        this.changeState(Bandit.State.Default)
        Bandit.Instances.push(this)
    }

    static new(x,y) {
        let instance = GameObject.getInactive(Bandit.Instances)
        if (instance) {
            return instance.revive(x,y)
        } else {
            return new Bandit(x,y)
        }
    }

    revive(x,y) {
        super.revive(x,y,Data.bandit)
        this.changeState(Bandit.State.Default)
        return this
    }

    update() {
        super.update()
    }

    onCollision(other) {
        if (other instanceof Player) {
            if (other.dashing) {
                other.score++
                this.setActive(false)
            } else if (this.stateId == Bandit.State.Dashing.id) {
                other.setActive(false)
            }
        }
    }

    static State = {
        Default: {
            id: 0,
            onChange: function(bandit) {
                bandit.setAnimation("banditidle");
                bandit.turnToTarget = true
            },
            behavior: function(bandit) {
                if (bandit.target && Globals.distance(bandit.target.x, bandit.target.y, bandit.x,bandit.y) > bandit.dashPrepDist) {
                    bandit.changeState(Bandit.State.Moving)
                } else {
                    bandit.changeState(Bandit.State.DashingPrep)
                }
            }
        },
        Moving: {
            id: 3,
            onChange: function(bandit) {
                bandit.setAnimation("banditrun");
            },
            behavior: function(bandit) {
                if (Globals.distance(bandit.target.x, bandit.target.y, bandit.x,bandit.y) > bandit.dashPrepDist) {
                    let angle = Globals.radBetweenPoint(bandit.x,bandit.y,bandit.target.x,bandit.target.y)
                    bandit.dx = Math.cos(angle) * bandit.moveSpeed
                    bandit.dy = Math.sin(angle) * bandit.moveSpeed
                } else {
                    bandit.changeState(Bandit.State.DashingPrep)
                }
            }
        },
        DashingPrep: {
            id: 1,
            onChange: function(bandit) {
                bandit.setAnimation("banditidle");
            },
            behavior: function(bandit) {
                if (bandit.tick > bandit.dashPrepTime) {
                    bandit.changeState(Bandit.State.Dashing)
                }
                bandit.dx *= (Math.abs(bandit.dx) < Globals.Epsilon? 0 : Globals.Mu)
                bandit.dy *= (Math.abs(bandit.dy) < Globals.Epsilon? 0 : Globals.Mu)
            }
        },
        Dashing: {
            id: 2,
            onChange: function(bandit) {
                bandit.setAnimation("banditdash");
                let rads = Globals.radBetweenPoint(bandit.x, bandit.y, bandit.target.x, bandit.target.y)
                bandit.dx = bandit.dashPower * Math.cos(rads)
                bandit.dy = bandit.dashPower * Math.sin(rads)
                bandit.turnToTarget = false
            },
            behavior: function(bandit) {
                if (bandit.tick > bandit.dashDuration) {
                    bandit.changeState(Bandit.State.Default)
                }
                bandit.dx *= .8
                bandit.dy *= .8
            }
        },
    }
}