<template>
    <canvas id="djClub"></canvas>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeMount,
  onBeforeUnmount,
  onBeforeUpdate,
  onMounted,
  onUnmounted,
  onUpdated,
  reactive,
  ref,
  toRefs,
} from "vue"
import { 
  Scene, 
  Camera, 
  AmbientLight,
  DirectionalLight,
  SpotLight,
  PointLight, 
  PerspectiveCamera, 
  WebGLRenderer, 
  BoxGeometry, 
  CubeGeometry,
  PlaneGeometry,
  PlaneBufferGeometry,
  SphereGeometry,
  ShadowMaterial,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshPhongMaterial,
  Mesh, 
  TextureLoader, 
  DoubleSide,
  GridHelper,
  ArrowHelper,
  AxesHelper,
  CameraHelper,
  SpotLightHelper,
  PointLightHelper,
  Vector3,
  AnimationMixer,
  Clock,
  RepeatWrapping,
  sRGBEncoding,
  PCFShadowMap,
  PCFSoftShadowMap,
  Fog,
  Color,
  Multiply,
  MixOperation,
  AddOperation,
  Object3D,
  AnimationClip,
  AudioListener,
  PositionalAudio,
  AudioLoader,
} from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import Stats from 'stats.js'
// import { OrbitControls } from 'three-orbitcontrols-ts'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { AnimationAction } from 'three/src/animation/AnimationAction'
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js'

import { TweenMax } from 'gsap'
// console.log(TweenMax)
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
const  { Tween, Easing  } = TWEEN

import { spotLights, pointLights, modelPosition } from '../mockData'


let renderer : WebGLRenderer
let scene : Scene
let mesh : Mesh
let camera : PerspectiveCamera
let stats : Stats
let mixer: AnimationMixer = null
let clock : Clock
let textureLoader: TextureLoader
let grassland : Mesh

const landSide = 200

export default defineComponent({
    name: 'DjClub',
    setup() {
        let spotObject: SpotLight[] = []
        let spotObjectHelper: SpotLightHelper[] = []

        let mixers : AnimationMixer[] = []

        const spotLightColors = [
            new Color(0xff0000),
            new Color(0x54FF9F),
            new Color(0x483D8B),
            new Color(0x1E90FF),
            new Color(0xffff00),
        ]

        // 初始化画布
        const initCanvas = function() {
            window.addEventListener('resize', () => onWindowResize(), false)
            // 场景
            scene = new Scene()
            scene.background = new Color(0xdcdcdc)
            // 雾
            scene.fog = new Fog(0xdcdcdc, 200, 1000)
            // 创建时钟
            clock = new Clock()
            // 创建纹理贴图加载器
            textureLoader = new TextureLoader()

            let canvas = document.getElementById("djClub")
            // 渲染器
            renderer = new WebGLRenderer({
                canvas,
                antialias: true,
                alpha: true,
            })
            renderer.shadowMap.enabled = true
            renderer.shadowMap.type = PCFSoftShadowMap // 默认 PCFShadowMap // 阴影类型
            // renderer.gammaInput = true
            // renderer.gammaOutput = true
            renderer.setClearColor(0xffffff)
            renderer.setPixelRatio(window.devicePixelRatio)
            renderer.setSize(window.innerWidth, window.innerHeight)
            document.body.appendChild(renderer.domElement)
            // 相机
            camera = new PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000)
            // x: -135.66415801538906, y: 51.599454527167914, z: -115.43501285275018
            // camera.position.set(33.61778077269789, 18.7881632185595, 98.20260623346174)
            camera.position.set(77.59014070493724, 27.281956522211484, 173.9190071215408)
            // 环境光
            let ambientLight = new AmbientLight(0xffffff, 1)
            // 添加环境光
            // scene.add(ambientLight)
            // 太阳光
            let sunLight = new DirectionalLight(0xffff00, 1)
            // let sunLight = new SpotLight(0xffffff, 5, 1000)
            // sunLight.angle = 0.5
			// sunLight.penumbra = 0.5
            sunLight.castShadow = true
            sunLight.position.set(0, 150, -150)
            // sunLight.target = grassland
            // scene.add(sunLight)
            // 设置阴影属性
            sunLight.shadow.mapSize.width = 1024 // 默认值
            sunLight.shadow.mapSize.height = 1024 // 默认值
            sunLight.shadow.camera.near = 0.5 // 默认值
            sunLight.shadow.camera.far = 500 // 默认值
            sunLight.shadow.camera.zoom = 4 // 使阴影边界更加清晰

            sunLight.shadow.camera.left = -50 * 4
            sunLight.shadow.camera.right = 50 * 4
            sunLight.shadow.camera.top = 50 * 4
            sunLight.shadow.camera.bottom = -50 * 4

            // 设置mapSize属性可以使阴影更清晰，不那么模糊
            // sunLight.shadow.mapSize.set(1024, 1024)

            // 测试聚光源
            // let testSpotLight = new SpotLight(0xffffff, 2, 100)
            // testSpotLight.position.set(0, 60, 0)
            // scene.add(testSpotLight)
            // const spotLightRedHelper = new SpotLightHelper(testSpotLight)
            // scene.add(spotLightRedHelper)

            addHelper(sunLight)

            // 加载人物动画模型
            // loadModels('../../public/models/Swing Dancing.fbx')
            // loadModels('../../public/models/Hip Hop Dancing.fbx')
            // loadModels('../../public/models/Dancing.fbx')
            // loadModels('../../public/models/Flair.fbx')
            // loadModels('../../public/models/Hip Hop Dancing (1).fbx')
            // loadModels('../../public/models/Hip Hop Dancing (2).fbx')
            // loadModels('../../public/models/House Dancing.fbx')
            loadModels('../../public/models/Samba Dancing.fbx')
            
            addGrassland()
            addFrontStage()
            addBackStage()
            addLeftRightStage()
            addUpStage()

            document.documentElement.addEventListener('dblclick', addMusic)

            addSpotLight()
            addPointLight()
            spotLightAnimate()
            
            // 控制
            let controls = new OrbitControls(camera, renderer.domElement)
            controls.target.set(0, 0, 0)
            controls.update()
        
            render()
        }

        // 添加草地
        const addGrassland = function() {
            let geometry = new BoxGeometry(landSide, 10, landSide * 2)
            // let geometry = new PlaneGeometry( 100, 200 )
            let materials = [
                new MeshBasicMaterial({ map: textureLoader.load('../../public/mesh/around.png'), side: DoubleSide }),
                new MeshBasicMaterial({ map: textureLoader.load('../../public/mesh/around.png'), side: DoubleSide }),
                new MeshPhongMaterial({ // MeshLambertMaterial MeshPhongMaterial
                    // color: 0xffffff,
                    // transparent: false,
                    // map: textureLoader.load('../../public/mesh/top.png'),
                    map: textureLoader.load('../../public/mesh/grasslight-big.jpg'),
                    // specular: 0x000000,
                    // combine: AddOperation,
                    side: DoubleSide
                }),
                new MeshBasicMaterial({ map: textureLoader.load('../../public/mesh/bottom.png'), side: DoubleSide }),
                new MeshBasicMaterial({ map: textureLoader.load('../../public/mesh/around.png'), side: DoubleSide }),
                new MeshBasicMaterial({ map: textureLoader.load('../../public/mesh/around.png'), side: DoubleSide }),
            ]
            // let gt = textureLoader.load('../../public/mesh/grasslight-big.jpg')
            // let materials = new MeshPhongMaterial({ color: 0xffffff, map: gt, side: DoubleSide })
            grassland = new Mesh(geometry, materials)
            // grassland.rotation.x = - Math.PI / 2
            grassland.position.y = -5
            grassland.name = 'grassland'
            // grassland.material.map.repeat.set(64, 64)
            // grassland.material.map.wrapS = RepeatWrapping
            // grassland.material.map.wrapT = RepeatWrapping
            // grassland.material.map.encoding = sRGBEncoding
            grassland.receiveShadow = true // 开启接收阴影投影
            scene.add(grassland)
        }

        // 添加前置舞台
        const addFrontStage = function() {
            let geometry = new PlaneGeometry(200, 60)
            let gt = textureLoader.load('../../public/mesh/front.png')
            let materials = new MeshPhongMaterial({ color: 0xffffff, map: gt, side: DoubleSide })
            let frontStage = new Mesh(geometry, materials)
            frontStage.rotation.x = Math.PI * 2
            frontStage.rotation.y = Math.PI
            // frontStage.rotation.z = -Math.PI / 2
            frontStage.position.z = 200
            frontStage.position.y = 30
            scene.add(frontStage)
        }
        // 添加后置舞台
        const addBackStage = function() {
            let geometry = new PlaneGeometry(200, 60)
            let gt = textureLoader.load('../../public/mesh/back.png')
            let materials = new MeshPhongMaterial({ color: 0xffffff, map: gt, side: DoubleSide })
            let backStage = new Mesh(geometry, materials)
            backStage.rotation.x = Math.PI * 2
            // backStage.rotation.y = Math.PI
            // backStage.rotation.z = -Math.PI / 2
            backStage.position.z = -200
            backStage.position.y = 30
            scene.add(backStage)
        }
        // 添加左右墙壁
        const addLeftRightStage = function() {
            let geometry = new PlaneGeometry(400, 60)
            let gt = textureLoader.load('../../public/mesh/hardwood2_diffuse.jpg')
            let materials = new MeshPhongMaterial({ color: 0xffffff, map: gt, side: DoubleSide })
            let leftStage = new Mesh(geometry, materials)
            // leftStage.rotation.x = Math.PI * 2
            leftStage.rotation.y = Math.PI / 2
            // leftStage.rotation.z = -Math.PI / 2
            leftStage.position.x = 100
            leftStage.position.y = 30
            leftStage.position.z = 0
            scene.add(leftStage)

            let rightStage = new Mesh(geometry, materials)
            // rightStage.rotation.x = Math.PI * 2
            rightStage.rotation.y = Math.PI / 2
            // rightStage.rotation.z = -Math.PI / 2
            rightStage.position.x = -100
            rightStage.position.y = 30
            rightStage.position.z = 0
            scene.add(rightStage)
        }
        // 添加天花板
        const addUpStage = function() {
            let geometry = new PlaneGeometry(400, 200)
            let gt = textureLoader.load('../../public/mesh/up.png')
            let materials = new MeshPhongMaterial({ color: 0xffffff, map: gt, side: DoubleSide })
            let frontStage = new Mesh(geometry, materials)
            frontStage.rotation.x = Math.PI / 2
            // frontStage.rotation.y = Math.PI
            frontStage.rotation.z = Math.PI / 2
            frontStage.position.z = 0
            frontStage.position.y = 60
            scene.add(frontStage)
        }

        // 添加聚光灯
        const addSpotLight = function() {
            spotLights.forEach(item => {
                const spotLightRed = new SpotLight(item.spotLight.color, item.spotLight.intensity, item.spotLight.distance, item.spotLight.angle, item.spotLight.penumbra, item.spotLight.decay)
                spotLightRed.position.set(item.position.x, item.position.y, item.position.z)
                spotLightRed.target = grassland

                spotLightRed.castShadow = true
    
                spotLightRed.shadow.mapSize.width = 1024
                spotLightRed.shadow.mapSize.height = 1024
    
                // 设置计算阴影的区域，注意包裹对象的周围
                spotLightRed.shadow.camera.near = 1
                spotLightRed.shadow.camera.far = 300
                spotLightRed.shadow.camera.fov = 20
                spotLightRed.shadow.focus = 1

                scene.add(spotLightRed)
                spotObject.push(spotLightRed)
    
                const spotLightRedHelper = new SpotLightHelper(spotLightRed)
                spotObjectHelper.push(spotLightRedHelper)
                // scene.add(spotLightRedHelper)
            })
        }

        // 让聚光灯转起来 变颜色 - 未实现
        const spotLightRotation = function(spot : SpotLight) {
            const targetObject = new Object3D()
            targetObject.position.set(0, 0, 100)
            scene.add(targetObject)
            spot.target = targetObject

            // console.log(spot)
            const { x, y, z } = spot.position
            let colorIndex = Math.floor(Math.random() * spotLightColors.length)
            // spot.lookAt(new Vector3(0, 0, 0))
            TweenMax.to(spot, 2, {
                onComplete: () => {
                    spot.lookAt(spot.target)
                    // spot.lookAt(0, 0, 50)
                    // spot.lookAt(new Vector3(100, 0, 100))
                    // spot.color = spotLightColors[colorIndex]
                }
            })
            // console.log(spot)
            // setInterval(() => {
            //     let xx = (Math.random() * x + 1) * 2 - x
            //     let yy = (Math.random() * y + 1) * 2 - y
            //     let zz = (Math.random() * z + 1) * 2 - z
            //     console.log(xx, yy, zz)
            //     spot.lookAt(new Vector3(xx, yy, zz))
            // }, 1000)
        }

        // 聚光灯动画
        const spotLightTween = function(light: SpotLight, spot: any) {
            new Tween(light).to({
                angle: (Math.random() * 0.7) + 0.1,
                penumbra: Math.random() + 1
            }, Math.random() * 3000 + 2000).easing(Easing.Quadratic.Out).start()

            new Tween(light.position).to({
                x: (Math.random() * spot.range.x) * (Math.floor(Math.random() * 100) % 2 == 0 ? 1 : -1),
                y: spot.range.y,
                z: (Math.random() * spot.range.z) * (Math.floor(Math.random() * 100) % 2 == 0 ? 1 : -1)
            }, Math.random() * 3000 + 2000).easing(Easing.Quadratic.Out).start()
        }

        // 多个聚光灯动画执行
        const spotLightAnimate = function() {
            for(let i = 0; i < spotLights.length; i++) {
                spotLightTween(spotObject[i], spotLights[i])
            }
            setTimeout(spotLightAnimate, 1000)
        }

        // 添加点光源 灯泡
        const addPointLight = function() {
            pointLights.forEach(item => {
                let pointLight = new PointLight(item.pointLight.color, item.pointLight.intensity, item.pointLight.distance, item.pointLight.decay)
                pointLight.position.set(item.position.x, item.position.y, item.position.z)
                scene.add(pointLight)
    
                const sphereSize = 1
                let pointLightHelper = new PointLightHelper(pointLight, sphereSize)
                // scene.add(pointLightHelper)
            })
        }

        // 添加辅助线
        const addHelper = function(sunLight : DirectionalLight) {
            // 添加辅助线
            let gridHelper = new GridHelper(landSide, landSide)
            gridHelper.material.opacity = 0
		    gridHelper.material.transparent = true
            scene.add(gridHelper)
            // 添加三维箭头
            // X
            let dirX = new Vector3(10, 0, 0) // 三维向量
            dirX.normalize()
            let origin = new Vector3(0, 0, 0)
            let length = 1
            let hexX = 0xff0000
            let arrowHelperX = new ArrowHelper(dirX, origin, length, hexX)
            scene.add(arrowHelperX)
            // Y
            let dirY = new Vector3(0, 10, 0) // 三维向量
            dirX.normalize()
            let hexY = 0xffff00
            let arrowHelperY = new ArrowHelper(dirY, origin, length, hexY)
            scene.add(arrowHelperY)
            // Z
            let dirZ = new Vector3(0, 0, 10) // 三维向量
            dirZ.normalize()
            let hexZ = 0x0000ff
            let arrowHelperZ = new ArrowHelper(dirZ, origin, length, hexZ)
            scene.add(arrowHelperZ)

            // 简单模拟3个坐标轴的对象  红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴
            let axesHelper = new AxesHelper(landSide / 2)
            // scene.add(axesHelper)

            // 模拟相机视锥体的辅助对象
            // let cameraHelper = new CameraHelper(camera)
            let cameraHelper = new CameraHelper(sunLight.shadow.camera)
            // scene.add(cameraHelper)

            // 模拟场景中平行光  表示光位置的平面和表示光方向的线段
            // let DirectionalLightHelper
        }

        // 加载模型
        const loadModels = function(path: string) {
            let loader = new FBXLoader()
            loader.load(path, (obj: any) => {

                obj.traverse((child : Mesh) => {
                    if (child.isMesh) {
                        child.castShadow = true
                        child.receiveShadow = true
                    }
                })

                let models: any[] = []

                modelPosition.forEach(item => {
                    const model1 = SkeletonUtils.clone(obj)
                    const mixer1 = new AnimationMixer(model1)
                    mixer1.clipAction(obj.animations[0]).play()
                    model1.position.set(item.x, item.y, item.z)
                    model1.scale.set(0.08, 0.08, 0.08)
                    models.push(model1)
                    mixers.push(mixer1)
                })
                scene.add(...models)
            })
        }

        // 添加音乐
        const addMusic = function() {
            let listener = new AudioListener()
            camera.add(listener)

            let sound = new PositionalAudio(listener)

            let audioLoader = new AudioLoader()
            audioLoader.load('../../public/music/wavefile_short.mp3', (buffer: any) => {
                sound.setBuffer(buffer)
                sound.setRefDistance(100)
                sound.play()
            })
            const sphere = new SphereGeometry(20, 32, 16, 0, 3.11645991236108, 6.283185307179586, 3.19185813604723)
            // const sphere = new SphereGeometry(20, 32, 16, 0, 0, 0, 0)
            const material = new MeshPhongMaterial({ color: 0xffffff, side: DoubleSide })
            const mesh = new Mesh(sphere, material)
            mesh.position.set(0, 60, 0)
            mesh.rotation.x = Math.PI / 2
            scene.add(mesh)
            grassland.add(sound)

            document.documentElement.removeEventListener('dblclick', addMusic)
        }

        // 性能监视器
        const loadStats = function() {
            stats = new Stats()
            stats.showPanel(0)
            document.body.appendChild(stats.dom)
        }

        // 响应式
        const onWindowResize = function() {
            renderer.setSize(window.innerWidth, window.innerHeight)
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
        }

        // 渲染
        const render = function() {
            stats.begin()
            requestAnimationFrame(render)
            let delta = clock.getDelta()
            // 模型动画的执行更新
            for ( const mixer of mixers ) mixer.update(delta)
            // spotLightRotation(spotObject[0])
            renderer.render(scene, camera)
            TWEEN.update()
            for(let i = 0; i < spotObjectHelper.length; i++) {
                spotObjectHelper[i].update()
            }
            // console.log(camera.position)
            stats.end()
        }

        onMounted(() => {
            loadStats()
            initCanvas()
        })
    },
})
</script>

<style scoped>
</style>
