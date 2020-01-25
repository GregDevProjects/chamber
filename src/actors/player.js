import Bullet from './bullet'
import Actor from './actor'
import Head from './player/head'


/* eslint-disable no-undef */
const MASS = 2.5

class Player extends Actor {
  constructor (config) {
    super(
      config.scene.matter.world,
      config.x,
      config.y,
      'player'
    )
    this.collisions = config.collisions
    this.scaleX = 20 / 128
    this.scaleY = 30 / 128
    // this must be called first or collision filter wont work
    this.setRectangle(20,
      30)
    // const playerCollisionCat = config.scene.matter.world.nextCategory()
    // this.bulletCollisionCat = config.scene.matter.world.nextCategory()
    this.setCollisionCategory(this.scene.collisionCategories.player)
    // collision id of world
    this.setCollidesWith([
      this.scene.collisionCategories.world,
      this.scene.collisionCategories.deathLine,
      this.scene.collisionCategories.block
    ])
    this.setMass(MASS)
    this.collisionEvent()
    this.startPointer()
    this.body.restitution = 1
    this.setTintFill(0xffc0cb)
  

    this.head = new Head({scene:this.scene, x: this.x, y:this.y })

    this.a = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    this.d = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    this.w = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    // this.setFrictionAir(0.2)
    // this.body.position.x =5
    // debugger
    this.gun()
  }

  startPointer () {
    this.scene.input.on('pointerdown',
      (coords) => {
        const force = 0.03
        const mouseVector = {
          x: coords.worldX,
          y: coords.worldY
        }

        this.shoot(mouseVector,
          force)
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

  shoot (mouseVector, force) {
    this.applyForceInOppositeDirection(mouseVector,
      force)
    new Bullet({ scene: this.scene, x: this.x, y: this.y })
      .fire(mouseVector)
  }

  collisionEvent () {
    this.scene.matterCollision.addOnCollideStart({
      objectA: this,
      callback: function (eventData) {
        const collidedWith = eventData.bodyB.collisionFilter.category

        if (collidedWith === this.scene.collisionCategories.deathLine) {
          this.scene.scene.restart()
        }

        if (collidedWith === this.scene.collisionCategories.block &&
          eventData.gameObjectB &&
          eventData.gameObjectB.killPlayer) {
          this.scene.scene.restart()
        }
      },
      context: this // Context to apply to the callback function
    })
  }

  update (delta) {
    // console.log(this.body.angularVelocity)

    const playerAngle = this.angle;
    const x = this.x + 25 * Math.cos(this.degreesToRadians(playerAngle - 90));
    const y = this.y + 25 * Math.sin(this.degreesToRadians(playerAngle - 90));

    this.head.setPosition(x, y)

    this.gun.setPosition(this.x,this.y)
    // debugger

    if (this.w.isDown) {
      this.thrustLeft(delta * 0.000025)
    }

    if (this.a.isDown){
      // this.angle -= delta *0.2
      this.setAngularVelocity(- delta *0.0025)
      return
    } 
    if (this.d.isDown) {
      // this.angle += delta *0.2
      this.setAngularVelocity( delta *0.0025)
      return
    }

    // if (Math.abs(this.body.angularVelocity) > 0.01 ) {
    //   if (this.body.angularVelocity > 0) {
    //     this.setAngularVelocity( -delta *0.00001)
    //   } else {
    //     this.setAngularVelocity( delta *0.00001)
    //   }
    // }

  }

  degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

gun() {
  this.gun = this.scene.add.image(0,0,'gun')

  this.gun.setOrigin(-0.3,0.5)
  this.scene.input.on('pointermove', function(pointer) {

    const angle = Phaser.Math.RAD_TO_DEG * Phaser.Math.Angle.BetweenPoints(this, {x:pointer.worldX, y:pointer.worldY});
     //debugger
    
    this.gun.setAngle( angle);

    // var angle = Phaser.Math.RAD_TO_DEG * Phaser.Math.Angle.BetweenPoints(this.gun, pointer);
    // console.log(angle)
    // this.gun.setAngle(angle);
}, this);

}

}

export default Player
