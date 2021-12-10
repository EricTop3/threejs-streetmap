import Env from './env'
import * as THREE from 'three'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

export default class Map {
  
  constructor() {
    this.env = new Env()
    this.pane = this.env.pane
    this.scene = this.env.scene
    this.camera = this.env.camera
    this.renderer = this.env.renderer
    this._setFog()
    this._setLights()
    this._createFloor()
    this._loadModel()
  }

  _setFog() {
    this.scene.fog = new THREE.Fog(0x000000, 5, 60)
  }

  _setLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
    this.scene.add(ambientLight)
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.3)
    dirLight.position.set(0, 3, 0)
    this.scene.add(dirLight)
  }

  _createFloor() {
    const geometry = new THREE.PlaneGeometry(100, 100, 1, 1)
    const material = new THREE.MeshLambertMaterial({
      color: 0x999999
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.rotateX(-Math.PI/2)
    mesh.position.y = -0.1
    //this.scene.add(mesh)
  }

  _loadModel() {
    const container = new THREE.Group()
    const loader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('draco/')
    loader.setDRACOLoader(dracoLoader)
    loader.load('models/map.glb', gltf => {
      gltf.scene.traverse(child => {
        if(child instanceof THREE.Mesh) {
          let color = 0x0033ff
          if(child.name === 'map_9osm_buildings') {
            color = 0x0033ff
          } else {
            color = 0x3300ff
          }
          const geometry = new THREE.EdgesGeometry(child.geometry, 1)
          const material = new THREE.LineBasicMaterial({
            color,
            blending: THREE.AdditiveBlending
          })
          const line = new THREE.LineSegments(geometry, material)
          container.add(line)

          // if(child.name === 'map_9osm_buildings') {
          //   child.material = new THREE.MeshLambertMaterial({
          //     color: 0x00eeff
          //   })
          // } else {
          //   child.material = new THREE.MeshStandardMaterial({
          //     color: 0x0033ff
          //   })
          // }
          
        }
      })
      const scale = 0.005
      container.scale.set(scale, scale, scale)
      this.scene.add(container)

    })
  }

}


