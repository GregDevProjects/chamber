import { FRAME_HEIGHT, FRAME_WIDTH, GAME_HEIGHT, GAME_WIDTH } from '../constants'

const drawBackground = (scene) => {
  scene.graphics = scene.add.graphics()

  scene.graphics.lineStyle(
    2,
    0x000000,
    1
  )

  scene.graphics.fillStyle(0x00FFFF,
    1)

  const framePadding = 150

  scene.graphics.fillRect(
    0,
    0,
    FRAME_WIDTH,
    framePadding
  )

  scene.graphics.fillRect(
    0,
    0,
    framePadding,
    FRAME_HEIGHT
  )

  scene.graphics.fillRect(
    FRAME_WIDTH - framePadding,
    0,
    framePadding,
    FRAME_HEIGHT
  )

  scene.graphics.fillRect(
    framePadding,
    FRAME_HEIGHT - framePadding,
    FRAME_WIDTH - framePadding,
    framePadding
  )

  scene.graphics.strokeRect(
    0,
    0,
    FRAME_WIDTH,
    FRAME_HEIGHT
  )

  scene.graphics.strokeRect(
    framePadding,
    framePadding,
    GAME_WIDTH,
    GAME_HEIGHT
  )

  scene.graphics.fillPath()
  scene.graphics.strokePath()
  scene.graphics.setDepth(1)

  scene.graphics.generateTexture('frameBackground')
  scene.graphics.destroy()
  scene.add.image(
    FRAME_WIDTH / 2,
    FRAME_HEIGHT / 2,
    scene.textures.get('frameBackground')
  ).setDepth(9)
}

export default drawBackground
