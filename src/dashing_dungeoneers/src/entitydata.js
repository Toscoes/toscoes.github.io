// design notes
// next tier of bandit can deploy a clone and teleport behind the player and immediately dash, player cannot take head on counter dash attacks

export default {
    player: {
        collider: {
            offsetX: 0,
            offsetY: 0,
            radius: 12
        },
        dashDuration: 25,
        dashPower: 35,
        moveSpeed: 3
    },
    bandit: {
        collider: {
            offsetX: 0,
            offsetY: 0,
            radius: 32
        },
        dashPrepTime: 100,
        dashDuration: 50,
        dashPower: 40,
        dashPrepDist: 15000,
        moveSpeed: 1
    },
    caster: {
        collider: {
            offsetX: 0,
            offsetY: 0,
            radius: 12
        },
        projectile: {
            collider: {
                offsetX: 0,
                offsetY: 0,
                radius: 12
            },
            speed: 10
        },
        castTime: 60,
        castRate: 120
    },
    paladin: {
        collider: {
            offsetX: 0,
            offsetY: 0,
            radius: 16
        },
        shield: {
            collider: {
                offsetX: 0,
                offsetY: 0,
                radius: 0
            }
        },
        slash: {
            collider: {
                offsetX: 0,
                offsetY: 0,
                radius: 32
            }
        },
        attackRange: 4000,
        attackPrepTime: 40,
        attackDownTime: 30,
        attackCooldown: 80,
        moveSpeed: 1.2,
    },
    oni: {
        collider: {
            offsetX: 0,
            offsetY: 0,
            radius: 32
        }
    }
}