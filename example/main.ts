/**
 * The smallest useful Arterial program: a level loaded from data (floor, walls, pillars, a ledge, lights), baked and
 * streamed by the engine, a sky, a stream of smoke and bursts of sparks from the particle engine, a camera circling
 * it, and the fixed-step loop driving it all.
 */

import * as THREE from 'three'
import { World, Loop, LightBlock, registerCoreEntities, applySky, prepareLevelMaterial, animateLevelMaterial, animateSurfaces, type LevelFile } from '../src'

registerCoreEntities()

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
renderer.setSize(innerWidth, innerHeight)
document.body.appendChild(renderer.domElement)
const camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 400)
addEventListener('resize', () => {
  renderer.setSize(innerWidth, innerHeight)
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()
})

const world = new World()
prepareLevelMaterial(renderer)
applySky(world.scene)
// The baked level's depth goes down first, as part of the scene (StaticChunks.depthScene): add it once.
world.scene.add(world.statics.depthScene)
// The world's lights, sent to the graphics chip once a frame in one block every lit shader reads (render/lightblock.ts).
const lightBlock = new LightBlock(renderer, world.scene)

const brush = (pos: [number, number, number], size: [number, number, number], surface = 'wall') => ({ type: 'brush', pos, props: { size, surface } })
const level: LevelFile = {
  name: 'example',
  version: 1,
  entities: [
    { type: 'spawn', pos: [0, 1, 12] },
    brush([0, -0.5, 0], [40, 1, 40], 'floor'),
    brush([0, 3, -20], [40, 6, 1]),
    brush([-20, 3, 0], [1, 6, 40]),
    brush([20, 3, 0], [1, 6, 40]),
    brush([-6, 2.5, -4], [2, 5, 2], 'accent'),
    brush([6, 2.5, -4], [2, 5, 2], 'accent'),
    brush([0, 3, -12], [10, 0.5, 4], 'platform'),
    brush([0, 0.05, 4], [6, 0.1, 6], 'hazard'),
    { type: 'light', pos: [0, 8, 0], props: { kind: 'point', color: 0xffc58a, intensity: 40, distance: 30 } },
    { type: 'light', pos: [0, 0, 0], props: { kind: 'ambient', color: 0x8890a8, intensity: 0.6 } },
    { type: 'light', pos: [10, 20, 8], props: { kind: 'directional', color: 0xffffff, intensity: 1.4 } },
  ],
}
world.load(level)
// Once the level's materials are compiled (they are at the first drawing): the light block takes three.js's light state.
let lightsAdopted = false

// Effects are named data: the engine draws every particle; a game only says what each effect is.
world.particles.register('smoke', {
  layers: [{ style: 'smoke', model: 'smoke', rate: 9, shape: 'disc', radius: 0.3, dir: [0, 1, 0], speed: 2.4, spread: 0.12, life: 5, size: 0.7, grow: 4.5, alpha: 0.42, color: 0x3a3836, colorEnd: 0x56524e, drag: 0.35, gravity: -0.15, turbulence: 0.9, turbulenceFreq: 0.35, spin: 0.4 }],
})
world.particles.register('sparks', {
  layers: [{ style: 'streak', count: 24, speed: 9, spread: 0.9, life: 0.6, size: 0.05, color: 0xffc070, gravity: 14, drag: 1.2 }],
})
const smoke = world.particles.emitter('smoke')
smoke.position.set(6, 5, -4)
let sparkIn = 0

const info = document.getElementById('info')!
let t = 0
const loop = new Loop(
  (dt) => {
    t += dt
    world.update(dt)
    sparkIn -= dt
    if (sparkIn <= 0) {
      sparkIn = 1.2
      world.particles.fire('sparks', new THREE.Vector3(-6, 5, -4), { dir: new THREE.Vector3(0, 1, 0) })
    }
  },
  () => {
    camera.position.set(Math.sin(t * 0.15) * 16, 6, Math.cos(t * 0.15) * 16)
    camera.lookAt(0, 2, -4)
    world.updateLod(camera.position)
    world.particles.update(loop.stats.frameMs / 1000, camera)
    animateSurfaces(t)
    animateLevelMaterial(t)
    renderer.render(world.scene, camera)
    if (!lightsAdopted) lightsAdopted = lightBlock.adopt()
    info.textContent = `${loop.stats.fps.toFixed(0)} fps · ${world.renderTriangles} level triangles · ${Object.values(world.particles.live()).reduce((a, b) => a + b, 0)} particles`
  },
)
loop.start()
