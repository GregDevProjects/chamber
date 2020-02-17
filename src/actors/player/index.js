import Bullet from '../bullet'
import Actor from '../actor'
import Head from './head'
import Controller from './controller'
import Gun from './gun'
import Torso from './torso'
/* eslint-disable no-undef */
const MASS = 1
const RECOIL_FORCE = 0.03

class Player extends Phaser.Physics.Matter.Image {
  constructor (config) {
    super(
      config.scene.matter.world,
      200,
      200,
      ''
    )
    this.scene = config.scene
    this.collisions = config.collisions

    // this.setCollisionCategory(this.scene.collisionCategories.player)
    // collision id of world

    // this.collisionEvent()
    this.startPointer()
    this.body.restitution = 1

    // this.setTintFill(0xffc0cb)
    // this.torso = new Torso({ scene: this.scene, player: this })
    // this.head = new Head({ scene: this.scene, player: this })
    this.controller = new Controller(this)
    this.gun = new Gun(this)
    this.head = new Head({ scene: this.scene, player: this })
    this.torso = new Torso({ scene: this.scene, player: this })
    this.allowMovement = true

    var M = Phaser.Physics.Matter.Matter
    // const parent = M.Bodies.rectangle(
    //   config.x,
    //   config.y,
    //   20,
    //   50,
    //   { isSensor: true }
    // )

    var compoundBody = M.Body.create({
      parts: [
        // parent,
        this.torso.getBody(config.x,
          config.y),
        this.head.getBody(config.x,
          config.y)
      ],
      friction: 0.01,
      restitution: 1 // Prevent body from sticking against a wall
    })

    this.setExistingBody(compoundBody)
    this.setMass(MASS)
    this.setCollisionCategory(this.scene.collisionCategories.player)
    // debugger
    this.setCollidesWith([
      this.scene.collisionCategories.world,
      this.scene.collisionCategories.deathLine,
      this.scene.collisionCategories.block
    ])
  }

  startPointer () {
    this.scene.input.on('pointerdown',
      (coords) => {
        if (!this.gun.active) {
          return
        }

        const mouseVector = {
          x: coords.worldX,
          y: coords.worldY
        }

        this.shoot(mouseVector,
          RECOIL_FORCE)
      })
  }

  applyForceInOppositeDirection (vector, force) {
    const playerVector = {
      x: this.x,
      y: this.y
    }
    const targetAngle = Phaser.Math.Angle.Between(
      vector.x,
      vector.y,
      playerVector.x,
      playerVector.y
    )

    this.applyForce({
      x: Math.cos(targetAngle) * force,
      y: Math.sin(targetAngle) * force
    })
  }

  death () {
    this.scene.resetScene()
  }

  shoot (mouseVector, force) {
    this.applyForceInOppositeDirection(mouseVector,
      force)
    new Bullet({ scene: this.scene, x: this.x, y: this.y })
      .fire(mouseVector)
  }

  removeGun () {
    this.gun.destroy()
  }

  giveGun () {
    this.gun = new Gun(this)
  }

  removeControls () {
    this.allowMovement = false
  }

  giveControls () {
    this.allowMovement = true
  }

  update (delta) {
    // console.log(this.body.angularVelocity)
    if (this.allowMovement) {
      this.controller.update(delta)
    }

    if (this.gun) {
      this.gun.update()
    }

    this.head.update()
    this.torso.update()
  }
}

export default Player
