import Enemy from "./enemy.js";
import Data from "./entitydata.js";
import GameObject from "./gameobject.js";
import Globals from "./globals.js";
import Player from "./player.js";

const AttackRange = Data.paladin.attackRange;
const AttackPrepTime = Data.paladin.attackPrepTime;
const AttackDownTime = Data.paladin.attackDownTime;
const AttackCooldown = Data.paladin.attackCooldown;
const MoveSpeed = Data.paladin.moveSpeed;

export default class Paladin extends Enemy {

    static Instances = []

    constructor(x,y) {
        super(x,y,Data.paladin)
        this.shield = new GameObject(x,y,Data.paladin.shield)
        this.slash = new GameObject(x,y,Data.paladin.slash)
        this.slash.hitbox = true
        this.shield.sprite.anchor.set(-0.05,0.5)
        this.shield.setAnimation("paladinshield");
        this.slash.sprite.anchor.set(0.5,0.5);
        this.slash.setAnimation("paladinslash");
        this.slash.sprite.gotoAndStop(0);
        this.slash.sprite.loop = false;
        this.slash.setActive(false);
        this.attackCooldown = AttackCooldown
        this.attackPrepTime = AttackPrepTime
        this.attackDownTime = AttackDownTime
        this.attackRange = AttackRange
        this.moveSpeed = MoveSpeed
        this.range = new GameObject(x,y,{collider:{offsetX:x,offsetY:y,radius:Math.sqrt(AttackRange)}})
        this.changeState(Paladin.State.Default)
    }

    static new(x,y) {
        let instance = GameObject.getInactive(Paladin.Instances);
        if (instance) {
            return instance.revive(x,y);
        } else {
            return new Paladin(x,y);
        }
    }

    revive(x,y) {
        super.revive(x,y,Data.paladin)
        this.setActive(true)
        this.changeState(Paladin.State.Default)
        return this
    }

    update() {
        super.update()
        this.range.collider.x = this.x;
        this.range.collider.y = this.y;
        if (this.target) {
            // move and rotate shield
            this.shield.collider.x = this.x
            this.shield.collider.y = this.y
            let angleShield = Globals.radBetweenPoint(this.x,this.y,this.target.x,this.target.y)
            this.shield.setRotation(angleShield)
            if (angleShield > Math.PI/2 || angleShield < -Math.PI/2) {
                this.shield.setRotation(-Math.PI + angleShield)
                this.shield.sprite.scale.x = -Globals.Scale
            } else {
                this.shield.setRotation(angleShield)
                this.shield.sprite.scale.x = Globals.Scale
            }
        }
    }

    onCollision(other) {
        if (other instanceof Player) {

            const Player = other

            if (Player.dashing) {
                if (!Player.crashed && this.shield.active) {
                    Player.crashed = true
                    Player.dx *= -.5
                    Player.dy *= -.5
                }

                if (!Player.crashed && !this.shield.active) {
                    other.score++;
                    this.setActive(false)
                }
            }
        }
    }

    setActive(a) {
        super.setActive(a)
        this.slash.setActive(a);
        this.shield.setActive(a);
    }

    static State = {
        Default: {
            id: 0,
            onChange: function(paladin) {
                paladin.setAnimation("paladinidle");
                paladin.sprite.loop = true;
                paladin.sprite.animationSpeed = .2;
                paladin.shield.setActive(true)
                paladin.slash.setActive(false);
                paladin.slash.sprite.gotoAndStop(0);
                paladin.turnToTarget = true;
            },
            behavior: function(paladin) {
                const target = paladin.target;
                if (Globals.distance(paladin.target.x, paladin.target.y, paladin.x,paladin.y) > paladin.attackRange) {
                    paladin.changeState(Paladin.State.Moving);
                } else if (paladin.tick > paladin.attackCooldown) {
                    if (target instanceof Player && (!target.dashing || target.crashed))
                        paladin.changeState(Paladin.State.PrepareAttack)
                }
            }
        },
        Moving: {
            id: 3,
            onChange(paladin) {
                paladin.setAnimation("paladinwalk");
                paladin.sprite.loop = true;
                paladin.sprite.animationSpeed = .2;
                paladin.shield.setActive(true)
            },
            behavior(paladin) {
                const target = paladin.target;
                if (Globals.distance(target.x, target.y, paladin.x, paladin.y) > paladin.attackRange) {
                    const angle = Globals.radBetweenPoint(paladin.x, paladin.y, target.x, target.y)
                    paladin.dx = Math.cos(angle) * paladin.moveSpeed
                    paladin.dy = Math.sin(angle) * paladin.moveSpeed
                } else if (paladin.tick > paladin.attackCooldown) {
                    if (target instanceof Player && (!target.dashing || target.crashed))
                        paladin.changeState(Paladin.State.PrepareAttack)
                }
            }
        },
        PrepareAttack: {
            id: 1,
            onChange: function(paladin) {
                paladin.setAnimation("paladinattack");
                paladin.sprite.animationSpeed = 1;
                paladin.sprite.gotoAndStop(0);
                paladin.sprite.loop = false;
                paladin.shield.setActive(false)
            },
            behavior: function(paladin) {
                if (paladin.tick > paladin.attackPrepTime) {
                    paladin.changeState(Paladin.State.Attack);
                }
                paladin.dx *= (Math.abs(paladin.dx) < Globals.Epsilon? 0 : Globals.Mu)
                paladin.dy *= (Math.abs(paladin.dy) < Globals.Epsilon? 0 : Globals.Mu)

                if (Globals.distance(paladin.target.x, paladin.target.y, paladin.x,paladin.y) > paladin.attackRange) {
                    paladin.changeState(Paladin.State.Default)
                }
            }
        },
        Attack: {
            id: 2,
            onChange: function(paladin) {
                paladin.turnToTarget = false;
                paladin.sprite.play();
                let a = Globals.radBetweenPoint(paladin.x,paladin.y,paladin.target.x,paladin.target.y)
                paladin.slash.collider.x = paladin.x + Math.cos(a) * 16;
                paladin.slash.collider.y = paladin.y + Math.sin(a) * 16;
                paladin.slash.setRotation(a)
                if (a > Math.PI/2 || a < -Math.PI/2) {
                    paladin.slash.setRotation(-Math.PI + a)
                    paladin.slash.sprite.scale.x = -Globals.Scale
                } else {
                    paladin.slash.setRotation(a)
                    paladin.slash.sprite.scale.x = Globals.Scale
                }

                paladin.slash.setActive(true);
                paladin.slash.sprite.play();
            },
            behavior: function(paladin) {
                if (paladin.tick > paladin.attackDownTime) {
                    paladin.changeState(Paladin.State.Default)
                }
            }
        }
    }
}