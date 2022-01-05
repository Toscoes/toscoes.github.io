class Node {
    constructor(sprite) {
        this.sprite = sprite
        this.left = null
        this.right = null
    }
}

export default class BinaryTree {

    constructor() {
        this.root = null
    }

    insert(sprite) {
        this.root = this.insertHelper(this.root, sprite)
        console.log(this.root)
    }

    insertHelper(curr, sprite) {
        if (!curr) {
            return new Node(sprite)
        } else {
            let diff = curr.sprite.y - sprite.y
            if (Math.abs(diff) < 1) { 
                // if y values are very close, fall back to z index, relevant for sprites stacked on top another
                if (curr.sprite.zIndex > sprite.zIndex) {
                    curr.left = this.insertHelper(curr.left, sprite)
                    return curr
                } else {
                    curr.right = this.insertHelper(curr.right, sprite)
                    return curr
                }
            } else if (curr.sprite.y > sprite.y) {
                curr.left = this.insertHelper(curr.left, sprite)
                return curr
            } else if (curr.sprite.y < sprite.y) {
                curr.right = this.insertHelper(curr.right, sprite)
                return curr
            }
        }
    }

    getInOrder(curr) {
        let acc = []
        if (!curr) {
            return acc
        } else {
            acc = acc.concat(this.getInOrder(curr.left))
            acc.push(curr.sprite)
            acc = acc.concat(this.getInOrder(curr.right))
        }
        return acc
    }
}