import { SPAWN_LOCATION, GAME_HEIGHT, GAME_WIDTH } from '../constants'
import Block from '../actors/block'
import Blinkers from '../blinkers'

import PolyK from 'polyk'

const MAX_BLOCK_WIDTH = 250
const MAX_BLOCK_HEIGHT = 250

const randomProperty = function (obj) {
  var keys = Object.keys(obj)
  return obj[keys[keys.length * Math.random() << 0]]
}

class BlockSpawner {
  constructor (scene) {
    this.blinkers = new Blinkers(scene)
    this.cursors = scene.input.keyboard.createCursorKeys()
    // DEBUG
    this.scene = scene
    this.blocks = scene.add.group()
    this.padding = { min: 30, max: 40 }
    this.width = { min: 10, max: 250 }
    this.height = { min: 10, max: 250 }
    this.spawnFrequency = 3500
    this.nextSpawn = randomProperty(SPAWN_LOCATION)
    this.spawnOrigin = randomProperty(SPAWN_LOCATION)
    this.spawnCount = 1

    this.spawnOnTimer()
    this.spawnGrid()
    this.spawnSensors()
  }

  spawnOnTimer () {
    this.scene.time.addEvent({
      delay: this.spawnFrequency,
      callback: () => {
        this.spawnGrid()
        this.spawnCount++

        if ((this.spawnCount + 1) % 4 === 0 && this.nextSpawn !== this.spawnOrigin) {
          this.blinkers.showArrow(this.nextSpawn)
        }
        if (this.spawnCount % 4 === 0) {
          this.spawnOrigin = this.nextSpawn
          this.nextSpawn = randomProperty(SPAWN_LOCATION)
          this.blinkers.hideAllArrows()
        }
      },
      callbackScope: this,
      repeat: -1
    })
  }

  makeSensor (
    x, y, width, height
  ) {
    const sensor = this.scene.matter.add.rectangle(
      x,
      y,
      width,
      height,
      { isSensor: true, label: 'blockBoundary' }
    )
    sensor.collisionFilter.category = this.scene.collisionCategories.blockBarrier
  }

  spawnSensors () {
    const width = GAME_WIDTH + 600
    const height = GAME_HEIGHT + 600
    this.makeSensor(
      width / 2 - 300,
      -MAX_BLOCK_WIDTH - 10,
      width,
      10
    )
    this.makeSensor(
      width / 2 - 300,
      GAME_HEIGHT + MAX_BLOCK_HEIGHT + 10,
      width,
      10
    )

    this.makeSensor(
      -MAX_BLOCK_WIDTH - 10,
      height / 2 - 300,
      10,
      height
    )
    this.makeSensor(
      GAME_WIDTH + MAX_BLOCK_WIDTH + 10,
      height / 2 - 300,
      10,
      height
    )
  }

  spawnGrid () {
    let lastSpawn = {
      x: 0,
      width: 0
    }

    do {
      const width = Phaser.Math.Between(this.width.min,
        this.width.max)
      const height = Phaser.Math.Between(this.height.min,
        this.height.max)

      const xOrigin = this.getXOrigin(width,
        lastSpawn)
      const yOrigin = this.getYOrigin(
        height,
        width,
        lastSpawn
      )

      lastSpawn = {
        x: lastSpawn.x = xOrigin,
        y: yOrigin,
        width: width,
        height: height
      }

      if (!xOrigin || !yOrigin) {
        return
      }

      const block = new Block({
        w: width,
        h: height,
        x: xOrigin,
        y: yOrigin,
        scene: this.scene
      })

      this.blocks.add(block)
    }
    while (true)
  }

  getXOrigin (width, lastSpawn) {
    if (this.spawnOrigin === SPAWN_LOCATION.top || this.spawnOrigin === SPAWN_LOCATION.bottom) {
      let spawnLocationX = this.getGridPadding(1) + width / 2
      if (lastSpawn.x) {
        spawnLocationX += lastSpawn.width / 2 + lastSpawn.x
      }

      if (spawnLocationX + width / 2 > GAME_WIDTH) {
        return false
      }
      return spawnLocationX
    } else if (this.spawnOrigin === SPAWN_LOCATION.left) {
      return GAME_WIDTH + width / 2
    } else if (this.spawnOrigin === SPAWN_LOCATION.right) {
      return -width / 2
    }
  }

  getYOrigin (
    height, width, lastSpawn
  ) {
    if (this.spawnOrigin === SPAWN_LOCATION.top) {
      return -height / 2
    } else if (this.spawnOrigin === SPAWN_LOCATION.bottom) {
      return GAME_HEIGHT + height / 2
    } else if (this.spawnOrigin === SPAWN_LOCATION.left || this.spawnOrigin === SPAWN_LOCATION.right) {
      let spawnLocationY = this.getGridPadding(1) + height / 2
      if (lastSpawn.y) {
        spawnLocationY += lastSpawn.height / 2 + lastSpawn.y
      }

      if (spawnLocationY + width / 2 > GAME_HEIGHT) {
        return false
      }
      return spawnLocationY
    }
  }

  getGridPadding (difficulty) {
    return Phaser.Math.Between(this.padding.min,
      this.padding.max)
  }

  update (delta) {
    this.blocks.children.iterate((block) => {
      if (!block) {
        return
      }
      block.move(delta,
        this.spawnOrigin)
    })
    // for debugging
    if (this.cursors.left.isDown) {
      this.spawnOrigin = SPAWN_LOCATION.left
    } else if (this.cursors.right.isDown) {
      this.spawnOrigin = SPAWN_LOCATION.right
    }

    if (this.cursors.up.isDown) {
      slice(
        { x: 0, y: GAME_WIDTH / 2 },
        { x: GAME_WIDTH, y: GAME_WIDTH / 2 },
        this.scene,
        this.blocks.children.entries.map((gameObj) => gameObj.body)
      )

      this.spawnOrigin = SPAWN_LOCATION.bottom
    } else if (this.cursors.down.isDown) {
      this.spawnOrigin = SPAWN_LOCATION.top
    }
  }
}

const slice = (
  startLine, endLine, scene, entitiesToSlice
) => {
  const bodies = entitiesToSlice// scene.matter.world.localWorld.bodies
  const toBeSliced = []
  const toBeCreated = []
  for (let i = 0; i < bodies.length; i++) {
    const vertices = bodies[i].parts[0].vertices
    const pointsArray = []
    vertices.forEach(function (vertex) {
      pointsArray.push(vertex.x,
        vertex.y)
    })
    const slicedPolygons = PolyK.Slice(
      pointsArray,
      startLine.x,
      startLine.y,
      endLine.x,
      endLine.y
    )
    if (slicedPolygons.length > 1) {
      toBeSliced.push(bodies[i])
      slicedPolygons.forEach(function (points) {
        toBeCreated.push(points)
      })
    }
  }

  toBeSliced.forEach(function (body) {
    scene.matter.world.remove(body)
  })
  toBeCreated.forEach(function (points) {
    const polyObject = []
    for (let i = 0; i < points.length / 2; i++) {
      polyObject.push({
        x: points[i * 2],
        y: points[i * 2 + 1]
      })
    }
    const sliceCentre = Phaser.Physics.Matter.Matter.Vertices.centre(polyObject)

    if (!isFinite(sliceCentre.x) || !isFinite(sliceCentre.y)) {
      return
    }
    const slicedBody = scene.matter.add.fromVertices(
      sliceCentre.x,
      sliceCentre.y,
      polyObject,
      {
        isStatic: false
      }
    )
  })
}

export default BlockSpawner
