export default class Sprite {
    constructor(data,z) {
        this.z = z
        this.sx = data.sx
        this.sy = data.sy
        this.dxOffsetX = data.dxOffsetX || 0
        this.dxOffsetY = data.dxOffsetY || 0
        this.width = data.width
        this.height = data.height
        this.frames = data.frames
        this.currentFrame = 0
        this.animationSpeed = data.speed || 1
        this.flip = false
        this.loop = true
        this.frozen = false
        this.rotation = 0
        this.tick = 0
    }

    set(data) {
        this.sx = data.sx
        this.sy = data.sy
        this.width = data.width
        this.height = data.height
        this.frames = data.frames
        this.loop = true
        this.animationSpeed = data.speed || 1
        this.frozen = false

        this.tick = 0
        this.currentFrame = 0
    }

    animate() {
        if (this.frames > 1 && !this.frozen) {
            if (!this.loop && this.tick / (this.frames - 1) > 1) {
                    return
            }
            this.currentFrame = Math.floor(this.tick % this.frames)
            this.tick += this.animationSpeed
        }
    }
}