import * as THREE from 'three'

import Env from '../env'
import gsap from'gsap'

export default class Tip {

  constructor(mesh) {
    this.env = new Env()
    this.camera = this.env.camera
    this.scene = this.env.scene
    this.mesh = mesh
    this.group = new THREE.Object3D()
    this.mesh.add(this.group)
    this.viewPoint = new THREE.Vector3(-2, 0.2, 0.1)
    this.tweening = false
    this.visible = true
    this.num = 1780
    this.count = 0
    this.startY = 150

    this._init()
  }

  async _init() {
    this.raycaster = new THREE.Raycaster()
    await this._createTips()
  }

  _loadImages() {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = 'textures/arrow.png'
      img.onload = () => {
        resolve()
      }
      this.arrow = img
    })
  }

  async _createTips() {
    const strip1 = this._createStrip(-140, 110, 0)
    const strip2 = this._createStrip(-140, 0, 0)
    this.group.add(strip1, strip2)
    // const arrow1 = this._createArrow(-185, 80, 0, 0)
    // const arrow2 = this._createArrow(-185, 30, 0, Math.PI)
    //this.group.add(arrow1, arrow2)
    await this._loadImages()
    this._createTextCanvas()
    this._createArrowCanvas()
    //this._createSprite()
    this._createArrows()
    this._createText()
  }

  _createTextCanvas() {
    const can = document.createElement('canvas')
    const ctx = can.getContext('2d')
    const w = 150
    const h = 200
    can.width = w
    can.height = h
    can.style.width = w + 'px'
    can.style.height = h + 'px'
    can.style.position = 'absolute'
    can.style.top = '0px'
    can.style.zIndex = 10

    ctx.fillStyle ='#ffffff'
    ctx.strokeStyle = '#ffffff'
    ctx.font = '28px arial'
    ctx.fillText('1780 mm', 0, 30)
    this.textCavnas = can
  }

  _drawText() {
    const ctx = this.textCavnas.getContext('2d')
    ctx.clearRect(0, 0, this.textCavnas.width, this.textCavnas.height)
    ctx.fillText(this.count + ' mm', 0, 30)
    this.textCanvasTexture.needsUpdate = true
  }

  _createText() {
    const tex = new THREE.CanvasTexture(
      this.textCavnas
    )
    tex.needsUpdate = true
    const geo = new THREE.PlaneGeometry(35, 40, 1, 1)
    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      depthTest: false,
      opacity: 0
    })
    const plane = new THREE.Mesh(geo, mat)
    plane.position.set(-180, 40, 0)
    this.group.add(plane)
    this.text = plane
    this.textCanvasTexture = tex
  }

  _createArrows() {
    const tex = new THREE.CanvasTexture(
      this.arrowCavnas
    )
    tex.needsUpdate = true
    const geo = new THREE.PlaneGeometry(8, 106, 1, 1)
    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      side: THREE.DoubleSide,
      opacity: 0
    })
    const plane = new THREE.Mesh(geo, mat)
    plane.position.set(-180, 55, 0)
    this.group.add(plane)
    this.plane = plane
    this.arrowCanvasTexture = tex
  }

  _createSprite() {
    const tex = new THREE.CanvasTexture(
      this.arrowCavnas
    )
    tex.needsUpdate = true
    const mat = new THREE.SpriteMaterial({
      map: tex,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0
    })
    const sprite = new THREE.Sprite(mat)
    sprite.scale.set(8, 105, 1)
    sprite.position.set(-182, 55, 0)
    this.mesh.add(sprite)
  }

  _createArrowCanvas() {
  
    const can = document.createElement('canvas')
    const ctx = can.getContext('2d')
    const w = 30
    const h = 400
    can.width = w
    can.height = h
    can.style.width = w + 'px'
    can.style.height = h + 'px'
    can.style.position = 'absolute'
    can.style.top = '0px'
    can.style.zIndex = 10

    ctx.drawImage(this.arrow, 5, 0, 20, 200)
    ctx.save()
    ctx.translate(w/2, h/2)
    ctx.rotate(Math.PI)
    ctx.translate(-w/2, -h/2)
    ctx.drawImage(this.arrow, 5, 0, 20, 200)
    ctx.restore()
    this.arrowCavnas = can
  }

  _drawArrows() {
    const w = 30
    const h = 400
    const ctx = this.arrowCavnas.getContext('2d')
    ctx.clearRect(0, 0, w, h)
    ctx.drawImage(this.arrow, 5, this.startY, 20, 200)
    ctx.save()
    ctx.translate(w/2, h/2)
    ctx.rotate(Math.PI)
    ctx.translate(-w/2, -h/2)
    ctx.drawImage(this.arrow, 5, this.startY, 20, 200)
    ctx.restore()
    this.arrowCanvasTexture.needsUpdate = true
  }

  _createArrow(x, y, z, rotation = 0) {
    const map = new THREE.TextureLoader().load('textures/arrow.png')
    const mat = new THREE.SpriteMaterial({
      map,
      sizeAttenuation: true,
      rotation,
      opacity: 0
    })
    const sprite = new THREE.Sprite(mat)
    sprite.scale.set(20, 300, 1)
    sprite.position.set(x, y, z)
    return sprite
  }

  _createStrip(x, y, z) {
    const tex = new THREE.TextureLoader().load('textures/strip.png')
    tex.rotation = Math.PI / 2
    const geo = new THREE.CylinderGeometry(0.3, 0.3, 100, 5, 1)
  
    geo.rotateZ(-Math.PI/2)
    const mat = new THREE.MeshBasicMaterial({
      transparent: true,
      map: tex,
      opacity: 0
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.set(x, y, z)
    return mesh
  }

  hide() {
    if(!this.visible) return
    if(this.tweening) return
    this.group.traverse(child => {
      if(child instanceof THREE.Mesh) {
        gsap.to(child.material, {
          duration: 0.8,
          opacity: 0,
          onComplete: () => {
            this.tweening = false
          }
        })
      }
    })
    this.tweening = true
    this.visible = false
  }

  show() {
    if(this.visible) return
    if(this.tweening) return
    this.group.traverse(child => {
      if(child instanceof THREE.Mesh) {
        gsap.to(child.material, {
          duration: 1,
          opacity: 1,
          onComplete: () => {
            this.tweening = false
          }
        })
      }
    })
    this.count = 0
    this.startY = 150
    this.visible = true
    this.tweening = true
  }

  update() {
    if(this.plane) {
      this.plane.rotation.y = this.camera.rotation.z
      this.text.quaternion.copy(this.camera.quaternion)
    }
    if(this.textCavnas) {
      this.count += 20
      this.count = this.count >= this.num ? this.num : this.count
      this._drawText()
    }
    if(this.arrowCavnas) {
      this.startY -= 3
      this.startY = this.startY <= 0 ? 0 : this.startY
      this._drawArrows()
    }
    this._checkVisible()
  }

  _checkVisible() {
    const screenPoint = this.viewPoint.clone()
    screenPoint.project(this.camera)
    this.raycaster.setFromCamera(screenPoint, this.camera)
    const intersects = this.raycaster.intersectObjects(this.scene.children, true)
    if(intersects.length === 0) {
      this.show()
    } else {
      const distance = intersects[0].distance
      const pointDistance = this.viewPoint.distanceTo(this.camera.position)
      if(distance < pointDistance) {
        this.hide()
      } else {
        this.show()
      }
    }
  }

}