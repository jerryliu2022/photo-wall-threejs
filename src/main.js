import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const scene = new THREE.Scene()
// 湛蓝天空背景
scene.background = new THREE.Color(0x87CEEB)

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200)
camera.position.set(0, 2.8, 8.5)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true

renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.3
renderer.outputColorSpace = THREE.SRGBColorSpace
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0, 3.875, -4.675)
controls.enableDamping = true
controls.minDistance = 3
controls.maxDistance = 22

const ambientLight = new THREE.AmbientLight(0xffffff, 1.05)
scene.add(ambientLight)
const dirLight = new THREE.DirectionalLight(0xffffff, 1.1)
dirLight.position.set(0, 5, 7)
dirLight.castShadow = true
scene.add(dirLight)

const textureLoader = new THREE.TextureLoader()

// ========== 照片墙【高度增加1.25（一个半相框高度），原6.5 →7.75】 ==========
const wallGeo = new THREE.BoxGeometry(14.5, 7.75, 0.35)
const wallMat = new THREE.MeshStandardMaterial({
    color: 0xF2E8D5,
    roughness: 0.82,
    metalness: 0.02
})
const wall = new THREE.Mesh(wallGeo, wallMat)
wall.position.set(0, 3.875, -4.675)
scene.add(wall)

textureLoader.load(
    "/images/wall.jpg",
    (tex) => {
        tex.wrapS = THREE.ClampToEdgeWrapping
        tex.wrapT = THREE.ClampToEdgeWrapping
        tex.repeat.set(1, 1)

        // --------提升清晰度重点配置--------
        // 开启各向异性过滤，取显卡支持最大值，斜着看不会模糊
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();

        // 过滤：不用Mipmap缩小模糊，改用双线性
        tex.generateMipmaps = false; 
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;

        // 色彩空间
        tex.colorSpace = THREE.SRGBColorSpace;
        // --------------------------------

        wallMat.map = tex
        wallMat.needsUpdate = true
        console.log("✅墙面本地贴图加载成功")
    },
    undefined,
    (err) => {
        console.error("❌墙面贴图加载失败，保持羊皮纸纯色", err)
    }
)

// ==========标题：张家界之旅，向上增加半个相框高度 +0.625 原5.4 →6.025 ==========
const titleCanvas = document.createElement('canvas')
titleCanvas.width = 2048
titleCanvas.height = 512
const ctx = titleCanvas.getContext('2d')

ctx.fillStyle = '#ffffff'
ctx.font = 'bold 220px "Microsoft YaHei", "PingFang SC", sans-serif'
ctx.textAlign = 'center'
ctx.textBaseline = 'middle'
ctx.shadowColor = 'rgba(0,0,0,0.6)'
ctx.shadowBlur = 12
ctx.shadowOffsetX = 3
ctx.shadowOffsetY = 3
ctx.fillText('张家界之旅', 1024, 256)

const titleTexture = new THREE.CanvasTexture(titleCanvas)
titleTexture.colorSpace = THREE.SRGBColorSpace

const titleGeo = new THREE.PlaneGeometry(5.6, 1.4)
const titleMat = new THREE.MeshStandardMaterial({
  map: titleTexture,
  transparent: true,
  side: THREE.DoubleSide
})
const titleMesh = new THREE.Mesh(titleGeo, titleMat)
titleMesh.position.set(0, 7.0, -4.48)
scene.add(titleMesh)

// ==========地面【本地floor.jpg，整个地面只显示一张图，无重复平铺】 ==========
const floorGeo = new THREE.PlaneGeometry(20, 20)
const floorMat = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    roughness: 0.82,
    metalness: 0.02,
    side: THREE.DoubleSide
})
const floor = new THREE.Mesh(floorGeo, floorMat)
floor.rotation.x = -Math.PI / 2
floor.position.y = 0
floor.receiveShadow = true
scene.add(floor)

textureLoader.load(
    "/images/floor.jpg",
    (tex) => {
        tex.wrapS = THREE.ClampToEdgeWrapping
        tex.wrapT = THREE.ClampToEdgeWrapping
        tex.repeat.set(1, 1)

        // --------提升清晰度重点配置--------
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        tex.generateMipmaps = false;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.colorSpace = THREE.SRGBColorSpace;
        // --------------------------------

        floorMat.map = tex
        floorMat.needsUpdate = true
        console.log("✅地面本地贴图加载成功")
    },
    undefined,
    (err) => {
        console.error("❌地面贴图加载失败，保持灰色纯色", err)
    }
)

// ========== 照片位置保持不变 ==========
const photoList = [
  { url: "/images/1.jpg", posX: -5.0, posY: 1.2 },
  { url: "/images/2.jpg", posX: -1.8, posY: 1.2 },
  { url: "/images/3.jpg", posX:  1.8, posY: 1.2 },
  { url: "/images/4.jpg", posX:  5.0, posY: 1.2 },

  { url: "/images/5.jpg", posX: -5.0, posY: 2.6 },
  { url: "/images/6.jpg", posX: -1.8, posY: 2.6 },
  { url: "/images/7.jpg", posX:  1.8, posY: 2.6 },
  { url: "/images/8.jpg", posX:  5.0, posY: 2.6 },

  { url: "/images/9.jpg", posX: -5.0, posY: 4.0 },
  { url: "/images/10.jpg", posX: -1.8, posY: 4.0 },
  { url: "/images/11.jpg", posX:  1.8, posY: 4.0 },
  { url: "/images/12.jpg", posX:  5.0, posY: 4.0 },

  { url: "/images/13.jpg", posX: -5.0, posY: 5.4 },
  { url: "/images/14.jpg", posX: -1.8, posY: 5.4 },
  { url: "/images/15.jpg", posX:  1.8, posY: 5.4 },
  { url: "/images/16.jpg", posX:  5.0, posY: 5.4 }
]

const photoGroupArr = []
let activePhoto = null

photoList.forEach(item => {
  const group = new THREE.Group()
  group.userData = {
    originX: item.posX,
    originY: item.posY,
    originZ: -4.25,
    zoomZ: -0.8,
    isZoom: false,
    originW: 1.6,
    originH: 1.1,
    zoomW: 8.4,
    zoomH: 5.8
  }
  group.position.set(item.posX, item.posY, -4.25)

  const frameGeo = new THREE.BoxGeometry(1.75, 1.25, 0.08)
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.4 })
  const frameMesh = new THREE.Mesh(frameGeo, frameMat)
  group.add(frameMesh)

  const texture = textureLoader.load(item.url)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter

  const picGeo = new THREE.PlaneGeometry(1.6, 1.1)
  const picMat = new THREE.MeshStandardMaterial({ map: texture })
  const picMesh = new THREE.Mesh(picGeo, picMat)
  picMesh.position.z = 0.05
  group.add(picMesh)

  group.userData.picMesh = picMesh
  group.userData.frameMesh = frameMesh

  scene.add(group)
  photoGroupArr.push(group)
})

// ========== 点击交互 ==========
const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()

window.addEventListener('pointerdown', (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
  raycaster.setFromCamera(pointer, camera)

  const intersects = raycaster.intersectObjects(photoGroupArr, true)

  if (intersects.length > 0) {
    const hitGroup = intersects[0].object.parent
    const data = hitGroup.userData

    if (activePhoto && activePhoto !== hitGroup) {
      activePhoto.userData.isZoom = false
    }

    data.isZoom = !data.isZoom
    activePhoto = data.isZoom ? hitGroup : null
  }
})

// ========== 动画 ==========
function animate() {
  requestAnimationFrame(animate)
  const t = 0.08

  photoGroupArr.forEach(g => {
    const d = g.userData
    const pic = d.picMesh
    const frame = d.frameMesh

    const targetZ = d.isZoom ? d.zoomZ : d.originZ
    g.position.z += (targetZ - g.position.z) * t

    let targetW, targetH

    if (d.isZoom) {
      targetW = d.zoomW
      targetH = d.zoomH
      frame.visible = false
    } else {
      targetW = d.originW
      targetH = d.originH
      frame.visible = true
    }

    pic.scale.x += (targetW / d.originW - pic.scale.x) * t
    pic.scale.y += (targetH / d.originH - pic.scale.y) * t
  })

  controls.update()
  renderer.render(scene, camera)
}

animate()

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})