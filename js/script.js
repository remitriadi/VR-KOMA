import * as THREE from 'three'
import gsap from 'gsap'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DeviceOrientationControls } from 'three/examples/jsm/controls/DeviceOrientationControls.js'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import { Raycaster, Vector3 } from 'three'

/**
 * Base !!IMPORTANT
 */
const canvas = document.querySelector('canvas.webgl')

//  ------------------------------------------------EDIT VARIABLE--------------------------------------------------------
const displace_strength = 15
const base_position = {
    x:13,
    y:1.6,
    z:-9
}
const increment = 33 // Row and Column grid !!!IMPORTANT MUST ODD NUMBERS!
const base_coordinate = 242 // Initial camera position
const grid = 1 // Grid in metre

let filename_daylight = '/images/daylight/Image0000' // Filename path for daylight scene, name always start from 0
let filename_night = '/images/night/Image0000' // Filename path for night scene, name always start from 0
let filename_depth = '/images/depth/Image0000' // Filename path for depth scene, name always start from 0

//  ------------------------------------------------EDIT VARIABLE--------------------------------------------------------

let count = 0
let object_ray_array = []
let is_mouse_on_pet = false

/**
 * Raycaster
 */
 const raycaster_mouse = new THREE.Raycaster()
 const raycaster_pet = new THREE.Raycaster()
 const raycaster_camera = new THREE.Raycaster()

 /**
  * Loader
  */

 // Start loading UI
 const ui_element = document.querySelectorAll('.ui')
 const loading_bar_element = document.querySelector('div#loading--bar')
 const display_element = document.querySelector('canvas.display')

 const loading_manager = new THREE.LoadingManager(
    // Loaded
    function (){
        window.setTimeout(function(){
            // Load UI
            gsap.to(display_element.style, {opacity: 1, duration: 3})
            loading_bar_element.classList.add('ended')
            loading_bar_element.style.transform = ''
                for(const ui of ui_element){
                    ui.style.opacity = 0.9
                }
            
            // Emptying texture if file isn't in folder
            function emptying(texture_array){
                count = 0
                for(const texture of texture_array){
                    if(texture){
                        if(!texture.image){
                            texture_array[count] = null
                        }
                    }
                    count += 1
                }
                for(const texture of texture_array){
                    if(texture){
                        texture.minFilter = THREE.NearestFilter
                        texture.generateMipmaps = false
                        texture.flipY = false
                        texture.sRGBEncoding = THREE.sRGBEncoding
                    }
                }
            }

            emptying(textures360)
            emptying(textures360_daylight)
            emptying(textures360_night)
            emptying(textures360_depth)


            // Create raycast object
            for(const ob of pet_array){
                object_ray_array.push(ob)
            }
            for(const ob of room_array){
                object_ray_array.push(ob)
            }
            
        }, 1000
        )   
    },

    // Progress
    function(item_url, item_loaded, item_total){
        const progress_ratio = item_loaded/item_total
        loading_bar_element.style.transform = `scaleX(${progress_ratio})`
    }
)



const gltf_loader = new GLTFLoader(loading_manager)
const texture_loader = new THREE.TextureLoader(loading_manager)
const texture_loader_wo_load = new THREE.TextureLoader()
const cube_texture_loader = new THREE.CubeTextureLoader()

/**
 * Control
 */
 const mouse = new THREE.Vector2()
 const mouse_pet = new THREE.Vector2()

 /**
 * Mobile checking
 */
window.mobileCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
    };


// Rotate camera with mouse
if(!window.mobileCheck()){
    canvas.addEventListener('mousemove',function (event){
        mouse.x = event.offsetX / sizes.width * 2 - 1
        mouse.y = - (event.offsetY / sizes.height) * 2 + 1
    
        if(event.which === 1){
            camera.rotation.y += event.movementX * 0.002
            camera.rotation.x += event.movementY * 0.002
        }
    })
}

// Rotate camera in WASD mode
let wasd_mode = false
const wasd_element = document.querySelector('#wasd')
wasd_element.onclick = function(){
    if(!is_transitioning){
        wasd_mode = true
        camera.fov = 90
    
        position_x = camera.position.x
        position_z = camera.position.z
    
        if (flip_flop % 2 == 0){
            material_360_1.depthWrite = true
            material_360_2.depthWrite = false
        }
        else{
            material_360_2.depthWrite = true
            material_360_1.depthWrite = false
        }
    
        material_360_1.uniforms.u_displace.value = -displace_strength  
        material_360_2.uniforms.u_displace.value = -displace_strength
    
        canvas.requestPointerLock()
        cursor_material.uniforms.u_opacity.value = 0
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen()
        } 
        else if (canvas.webkitRequestFullscreen){
            canvas.webkitRequestFullscreen()
        }
        else if (canvas.msRequestFullscreen){
            canvas.msRequestFullscreen();
        }
    }

}

document.addEventListener('fullscreenchange', exitHandler);
document.addEventListener('webkitfullscreenchange', exitHandler);
document.addEventListener('mozfullscreenchange', exitHandler);
document.addEventListener('MSFullscreenChange', exitHandler);

function exitHandler() {
    if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
        wasd_mode = false
        camera.fov = 80
        
        material_360_1.depthWrite = false
        material_360_2.depthWrite = false

        material_360_1.uniforms.u_displace.value = 0
        material_360_2.uniforms.u_displace.value = 0

        cursor_material.uniforms.u_opacity.value = 1
    }
} 

window.addEventListener('mousemove',function(event){
    if(wasd_mode){
        camera.rotation.y -= event.movementX * 0.0005
        camera.rotation.x -= event.movementY * 0.0005

        camera.rotation.x = Math.min(camera.rotation.x, 1.3)
        camera.rotation.x = Math.max(camera.rotation.x, -1.3)
    }
})

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Scene
const scene = new THREE.Scene()

// Camera
const camera = new THREE.PerspectiveCamera(80, sizes.width / sizes.height, 0.01, 100)
camera.rotation.order = 'YXZ'
camera.position.x = base_position.x
camera.position.y = base_position.y
camera.position.z = base_position.z
scene.add(camera)


const device_orientation_control = new DeviceOrientationControls(camera)
const pointer_lock_control = new PointerLockControls(camera, canvas)
pointer_lock_control.addEventListener('lock', function () {
} );
pointer_lock_control.addEventListener('unlock', function () {
} );


/**
 * Navigating
 */

let duration = 0.15
let coordinates = base_coordinate
let row = 0
const vec3 = new THREE.Vector3()
let flip_flop = 0
let is_mouse_on_DOM = false

canvas.addEventListener('mouseover', function(event){
    is_mouse_on_DOM = true
    this.style.cursor = `none`;
})
canvas.addEventListener('mouseout', function(event){
    is_mouse_on_DOM = false
})

/**
 * Textures
 */

// 360 Texture
const textures360 = []
const textures360_daylight = []
const textures360_night = []
const textures360_depth = []



const x = texture_loader.load('231ss',function(a){
    console.log(a)
})
console.log(x)
// console.log(x)

// Daylight
for(let i = 1; i <= (increment * increment); i++){
    const image_number = String(i)
    const update_filename = filename_daylight.substring(0, filename_daylight.length - image_number.length) + image_number
    const final_filename = update_filename + '.webp'
    try{
        textures360_daylight[i] = texture_loader.load(final_filename) 
    }
    catch(err){
        break
    }
    textures360[i] = textures360_daylight[i]
}


//Night
for(let i = 1; i <= (increment * increment); i++){
    const image_number = String(i)
    const update_filename = filename_night.substring(0, filename_night.length - image_number.length) + image_number
    const final_filename = update_filename + '.webp'
    try{
        textures360_night[i] = texture_loader_wo_load.load(final_filename)  
    }
    catch(err){
        break
    }
}

//Depth
for(let i = 1; i <= (increment * increment); i++){
    const image_number = String(i)
    const update_filename = filename_depth.substring(0, filename_depth.length - image_number.length) + image_number
    const final_filename = update_filename + '.png'
    try{
        textures360_depth[i] = texture_loader.load(final_filename)
    }
    catch(err){
        break
    }
}

//Load textures
let texture_base_color = textures360_daylight[coordinates]
texture_base_color.minFilter = THREE.NearestFilter
texture_base_color.generateMipmaps = false
texture_base_color.flipY = false
texture_base_color.sRGBEncoding = THREE.sRGBEncoding

let texture_depth = textures360_depth[coordinates]
texture_depth.minFilter = THREE.NearestFilter
texture_depth.generateMipmaps = false
texture_depth.flipY = false

// Environment Map
const env_texture_daylight = cube_texture_loader.load([
    '/images/env_daylight/px.jpg',
    '/images/env_daylight/nx.jpg',
    '/images/env_daylight/py.jpg',
    '/images/env_daylight/nx.jpg',
    '/images/env_daylight/pz.jpg',
    '/images/env_daylight/nz.jpg',
])

const env_texture_night = cube_texture_loader.load([
    '/images/env_night/px.jpg',
    '/images/env_night/nx.jpg',
    '/images/env_night/py.jpg',
    '/images/env_night/nx.jpg',
    '/images/env_night/pz.jpg',
    '/images/env_night/nz.jpg',
])

/**
 * Material
 */

// Shader Material
const cursor_material = new THREE.ShaderMaterial({
    depthTest: false,
    uniforms:{
        u_wave: {value: 0},
        u_opacity: {value: 1}
    },
    vertexShader:`
        varying vec2 vUv;

        void main(){
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            vUv = uv;
        }
    `,
    fragmentShader:`
        uniform float u_wave;
        uniform float u_opacity;

        varying vec2 vUv;

        void main(){
            float value = distance(vUv, vec2(0.5));
            value -= 0.3 + u_wave * 0.05;
            value = abs(value);
            value = step(0.02, value);
            value = 1.0 - value;

            float opacity = value * u_opacity;

            gl_FragColor = vec4(value,value,value,opacity);
        }
    `,
    transparent: true,
    side: THREE.DoubleSide
})

const material_360_1 = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms:{
        u_texture_depth: {value: texture_depth},
        u_texture_base_color: {value: texture_base_color},
        u_alpha: {value:1},
        u_mix: {value:0},
        u_displace: {value: 0},
    },
    vertexShader:`
        uniform sampler2D u_texture_depth;
        uniform float u_mix;
        uniform float u_displace;

        varying vec2 vUv;

        void main(){
            vUv = uv;
            vec4 depth = texture2D(u_texture_depth, vUv);
            vec3 texture_depth = vec3(depth.x, depth.y, depth.z);

            vec4 modelPosition = modelMatrix * vec4(position + (texture_depth * normal * u_displace), 1.0) ;
            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectedPosition = projectionMatrix * viewPosition;
        
            gl_Position = projectedPosition;
            
        }
    `,
    fragmentShader:`
        uniform sampler2D u_texture_base_color;
        uniform float u_alpha;
        uniform float u_mix;

        varying vec2 vUv;

        void main(){
            vec4 texture_color = texture2D(u_texture_base_color, vUv);

            gl_FragColor = texture_color;
            gl_FragColor.a = u_alpha;
        }
    `,
    transparent: true,
    side: THREE.DoubleSide
})


const material_360_2 = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms:{
        u_texture_depth: {value: texture_depth},
        u_texture_base_color: {value: texture_base_color},
        u_alpha: {value:0},
        u_mix: {value:0},
        u_displace: {value: 0},
    },
    vertexShader:`
        uniform sampler2D u_texture_depth;
        uniform float u_mix;
        uniform float u_displace;

        varying vec2 vUv;

        void main(){
            vUv = uv;
            vec4 depth = texture2D(u_texture_depth, vUv);
            vec3 texture_depth = vec3(depth.x, depth.y, depth.z);

            vec4 modelPosition = modelMatrix * vec4(position + (texture_depth * normal * u_displace), 1.0) ;
            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectedPosition = projectionMatrix * viewPosition;
        
            gl_Position = projectedPosition;
            
        }
    `,
    fragmentShader:`
        uniform sampler2D u_texture_base_color;
        uniform float u_alpha;
        uniform float u_mix;

        varying vec2 vUv;

        void main(){
            vec4 texture_color = texture2D(u_texture_base_color, vUv);

            gl_FragColor = texture_color;
            gl_FragColor.a = u_alpha;
        }
    `,
    transparent: true,
    side: THREE.DoubleSide
})

// Pet Material
const pet_material = new THREE.MeshStandardMaterial({
    color: 'white',
    roughness: 0.5,
    envMap: env_texture_daylight,
    envMapIntensity: 1
})

// Shadow material
const shadow_material = new THREE.ShadowMaterial()
shadow_material.transparent = true
shadow_material.opacity = 0.2

// Transparent Material
const transparent_material = new THREE.MeshStandardMaterial({
    transparent: true,
    wireframe: true,
    opacity: 0.2
})

/**
 * Models
 */

// Guide Pet
const pet_array = []
const pet_object = new THREE.Group()
const pet_lighting = new THREE.SpotLight(new THREE.Color(138/255, 127/255, 109/255), 3, 50, 90)
pet_lighting.castShadow = true
pet_lighting.position.set(1,2,1)
pet_lighting.lookAt(new THREE.Vector3(0,0,0))

pet_lighting.shadow.mapSize.set(1024,1024)
pet_lighting.shadow.radius = 15
pet_object.add(pet_lighting)

let mixer
gltf_loader.load(
    '/gltf/Pet2.glb',
    function (gltf)
    {
        for(const children of gltf.scene.children){
            pet_array.push(children)
            children.castShadow = true
            children.receiveShadow = true
            children.material = pet_material
        }

        const model = gltf.scene
        const animations = gltf.animations
        model.scale.set(0.1,0.1,0.1)
        
        mixer = new THREE.AnimationMixer(model)
        mixer.timeScale = 1
        
        const action_eye_movement = mixer.clipAction(animations[0])
        const action_flying = mixer.clipAction(animations[1])
        const action_iddle = mixer.clipAction(animations[2])
        
        const actions = [action_eye_movement, action_flying, action_iddle]
        
        for(const action of actions){
            action.play()
            action.enabled = true
            action.setEffectiveTimeScale(1)
            action.setEffectiveWeight(1)
        }
        
        pet_object.position.y = 0.5
        pet_object.add(gltf.scene)
        scene.add(pet_object)
    },
)


// Room Object
const room_array = []
gltf_loader.load(
    '/gltf/Room.glb',
    function (gltf)
    {
        for(const children of gltf.scene.children){
            if(!(children.name.toLowerCase() == 'boundary')){
                children.receiveShadow = true
            }
            children.material = shadow_material
            children.renderOrder = 4
            room_array.push(children)
            
        }
        scene.add(gltf.scene)
    },
)

// Sphere Object
//Sphere 1
const sphere_mesh1 = new THREE.Mesh(
    new THREE.SphereGeometry(15,1024,1024),
    material_360_1
)
sphere_mesh1.scale.y = -1
sphere_mesh1.scale.x = -1
sphere_mesh1.rotation.y = Math.PI * -0.5
sphere_mesh1.position.x = base_position.x
sphere_mesh1.position.y = base_position.y
sphere_mesh1.position.z = base_position.z
scene.add(sphere_mesh1)

//Sphere 2
const sphere_mesh2 = new THREE.Mesh(
    new THREE.SphereGeometry(15,1024,1024),
    material_360_2
)
sphere_mesh2.scale.y = -1
sphere_mesh2.scale.x = -1
sphere_mesh2.rotation.y = Math.PI * -0.5
sphere_mesh2.position.x = base_position.x
sphere_mesh2.position.y = base_position.y
sphere_mesh2.position.z = base_position.z
scene.add(sphere_mesh2)

// Plane Geo
let wave_sine = 0
const plane_geometry = new THREE.PlaneGeometry(1,1,1,1)
const plane_mesh = new THREE.Mesh(plane_geometry,cursor_material)
plane_mesh.renderOrder = 1
scene.add(plane_mesh)

/**
 * Lighting
 */
const ambient_light = new THREE.AmbientLight(new THREE.Color(98/255, 82/255, 67/255), 1.5)
scene.add(ambient_light)


/**
 * UI
 */

// Switching lights
let is_light_on = false
const light_switch = document.getElementById('light-switch')
light_switch.onclick = function (){
    if(!is_light_on && !is_transitioning){
        // to Night
        is_light_on = true
        is_transitioning = true

        duration = 3
        gsap.to(ambient_light.color, {r:37/255, g:35/255, b:49/255, duration})
        gsap.to(pet_lighting.color, {r:54/255, g:44/255, b:43/255, duration })
        gsap.to(pet_material, {envMapIntensity: 0.1, duration })
        pet_material.envMap = env_texture_night

        for(let i = 1; i <= (increment * increment); i++){
            textures360[i] = textures360_night[i]  
        }

        texture_base_color = textures360[coordinates]
        texture_depth = textures360_depth[coordinates]

        if (flip_flop % 2 == 0){
            sphere_mesh2.position.x = camera.position.x
            sphere_mesh2.position.z = camera.position.z

            material_360_2.depthWrite = true
            material_360_1.depthWrite = false
            
            material_360_2.uniforms.u_texture_depth.value = texture_depth
            material_360_2.uniforms.u_texture_base_color.value = texture_base_color

            gsap.to(material_360_2.uniforms.u_alpha, {duration: 3, value: 1, delay: 0})
            gsap.to(material_360_1.uniforms.u_alpha, {duration: 1.5, value: 0, delay: 1.5, onComplete:function(){
                is_transitioning = false
            }})
            flip_flop += 1
        }
        else{
            sphere_mesh1.position.x = camera.position.x
            sphere_mesh1.position.z = camera.position.z

            material_360_1.depthWrite = true
            material_360_2.depthWrite = false

            material_360_1.uniforms.u_texture_depth.value = texture_depth
            material_360_1.uniforms.u_texture_base_color.value = texture_base_color

            gsap.to(material_360_1.uniforms.u_alpha, {duration: 3, value: 1, delay: 0})
            gsap.to(material_360_2.uniforms.u_alpha, {duration: 1.5, value: 0, delay: 1.5, onComplete:function(){
                is_transitioning = false
            }})
            flip_flop += 1
        }
    }
    else if(is_light_on && !is_transitioning){
        // to Daylight
        is_light_on = false
        is_transitioning = true

        duration = 3
        gsap.to(ambient_light.color, {r:37/255, g:35/255, b:49/255, duration})
        gsap.to(pet_lighting.color, {r:54/255, g:44/255, b:43/255, duration })
        gsap.to(pet_material, {envMapIntensity: 0.1, duration })
        pet_material.envMap = env_texture_daylight

        for(let i = 1; i <= (increment * increment); i++){
            textures360[i] = textures360_daylight[i]  
        }

        texture_base_color = textures360[coordinates]
        texture_depth = textures360_depth[coordinates]


        if (flip_flop % 2 == 0){
            sphere_mesh2.position.x = camera.position.x
            sphere_mesh2.position.z = camera.position.z

            material_360_2.uniforms.u_texture_depth.value = texture_depth
            material_360_2.uniforms.u_texture_base_color.value = texture_base_color

            gsap.to(material_360_2.uniforms.u_alpha, {duration: 3, value: 1, delay: 0})
            gsap.to(material_360_1.uniforms.u_alpha, {duration: 1.5, value: 0, delay: 1.5, onComplete:function(){
                is_transitioning = false
            }})
            flip_flop += 1
        }
        else{
            sphere_mesh1.position.x = camera.position.x
            sphere_mesh1.position.z = camera.position.z

            material_360_1.uniforms.u_texture_depth.value = texture_depth
            material_360_1.uniforms.u_texture_base_color.value = texture_base_color

            gsap.to(material_360_1.uniforms.u_alpha, {duration: 3, value: 1, delay: 0})
            gsap.to(material_360_2.uniforms.u_alpha, {duration: 1.5, value: 0, delay: 1.5, onComplete:function(){
                is_transitioning = false
            }})
            flip_flop += 1
        }
    }
}
// Fullscreen browser
const viewport = document.querySelector('body.viewport')
const full_screen = document.getElementById('full-screen')
let is_full_screen = false

full_screen.onclick = function(){
    if(!is_full_screen){
        is_full_screen = true
        if (viewport.requestFullscreen) {
            viewport.requestFullscreen()
        } 
        else if (viewport.webkitRequestFullscreen){
            viewport.webkitRequestFullscreen()
        }
        else if (viewport.msRequestFullscreen){
            viewport.msRequestFullscreen();
        }
    }
    else{
        is_full_screen = false
        if (document.exitFullscreen) {
            document.exitFullscreen()
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen()
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen()
          }
    }
}

// Disable zoom in mobile
canvas.addEventListener('gesturestart', function(e) {
    e.preventDefault();
    // special hack to prevent zoom-to-tabs gesture in safari
    canvas.body.style.zoom = 0.99;
});

canvas.addEventListener('gesturechange', function(e) {
    e.preventDefault();
    // special hack to prevent zoom-to-tabs gesture in safari
    canvas.body.style.zoom = 0.99;
});

canvas.addEventListener('gestureend', function(e) {
    e.preventDefault();
    // special hack to prevent zoom-to-tabs gesture in safari
    canvas.body.style.zoom = 0.99;
});

/**
 * Renderer
 */

const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
})

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(sizes.width, sizes.height)
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.shadowMap.enabled = true
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding

const position1 = plane_mesh.position
let position2 = plane_mesh.position

// Clock
const clock = new THREE.Clock()

/**
 * Sound
 */


// BGM
const bgm = new Audio('/sounds/bgm.wav')
let is_sound_on = false
const sound_element1 = document.getElementById('sound-mute')
sound_element1.onclick = function(){
    if(is_sound_on == false){
        sound_element1.classList.replace('fa-volume-off','fa-volume-up')
        is_sound_on = true
        bgm.loop = true
        bgm.play()
    }
    else{
        sound_element1.classList.replace('fa-volume-up','fa-volume-off')
        is_sound_on = false
        bgm.pause()
    }
}

/**
 * Animate
 */


// Pet Behaviour
window.setInterval(function (){
    const forward = camera.getWorldDirection(new THREE.Vector3)
    const right = camera.getWorldDirection(new THREE.Vector3).cross(camera.up)

    const update_pet_position = new THREE.Vector3()
    update_pet_position.x = camera.position.x + forward.x + (right.x * 1)
    update_pet_position.y = camera.position.y + forward.y + (right.y * 1)
    update_pet_position.z = camera.position.z + forward.z + (right.z * 1)

    gsap.to(pet_object.position, {x: update_pet_position.x, y: update_pet_position.y, z: update_pet_position.z, duration: 2})

}, 2000)

// Pet Interaction
const chat_sound1 = new Audio('/sounds/mumbling_sound_1.mp3')
const chat_sound2 = new Audio('/sounds/mumbling_sound_2.mp3')
const chat_sound3 = new Audio('/sounds/mumbling_sound_3.mp3')

const chat_box = document.querySelector('div.chat-box')
const chat_content = document.querySelector('p.chat-content')
const button_next = document.getElementById('button-next')
const button_previous = document.getElementById('button-previous')
const button_exit = document.getElementById('button-exit')
const chat_array = []
const chat_sounds_array = []
chat_sounds_array[0] = chat_sound1
chat_sounds_array[1] = chat_sound2
chat_sounds_array[2] = chat_sound3
chat_array[0] = 'Halo semua, saya adalah monyet blender'
chat_array[1] = 'Pada kesempatan kali ini, kita lolololo'
chat_array[2] = 'yagitu'


// Start dialog box
window.addEventListener('mousedown', function () { dragged = false })
window.addEventListener('mousemove', function () { dragged = true })
window.addEventListener('mouseup', function(event) {
        if (dragged == true) { return }
        mouse_pet.x = event.offsetX / sizes.width * 2 - 1
        mouse_pet.y = - (event.offsetY / sizes.height) * 2 + 1
        raycaster_mouse.setFromCamera(mouse_pet, camera)
        const intersect_pet = raycaster_mouse.intersectObjects(pet_array, true)
        
        if(intersect_pet.length > 0){
            chat_box.style.transform = `scale(1)`
            chat_box.style.opacity = 1
            chat_sounds_array[count%3].play()
            chat_content.innerHTML = chat_array[count%3]
        }
})

// Next dialog box
button_next.onclick = function(){
    chat_sounds_array[count%3].pause()
    chat_sounds_array[count%3].currentTime = 0
    count += 1
    chat_sounds_array[count%3].play()
    chat_content.innerHTML = chat_array[count%3]
}

// Previous dialog box
button_previous.onclick = function(){
    chat_sounds_array[count%3].pause()
    chat_sounds_array[count%3].currentTime = 0
    count -= 1
    chat_sounds_array[count%3].play()
    chat_content.innerHTML = chat_array[count%3]
}

// Close dialog box
button_exit.onclick = function(){
    chat_sounds_array[count%3].pause()
    chat_sounds_array[count%3].currentTime = 0
    chat_box.style.transform = `scale(0)`
    chat_box.style.opacity = 0
}




// WASD Movement
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;



const onKeyDown = function ( event ) {
    //Update texture while WASD Movement
    switch ( event.code ) {

        case 'ArrowUp':
        case 'KeyW':
            moveForward = true
            break

        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true
            break

        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true
            break

        case 'ArrowRight':
        case 'KeyD':
            moveRight = true
            break

    }

}

const onKeyUp = function ( event ) {

    switch ( event.code ) {

        case 'ArrowUp':
        case 'KeyW':
            moveForward = false
            break

        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false
            break

        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false
            break

        case 'ArrowRight':
        case 'KeyD':
            moveRight = false
            break

    }

}
document.addEventListener( 'keydown', onKeyDown )
document.addEventListener( 'keyup', onKeyUp )

const velocity = new THREE.Vector3()
const direction = new THREE.Vector3()

let position_x = camera.position.x
let position_z = camera.position.z

let pos_x = camera.position.x
let pos_z = camera.position.z

let iddle_timeout = 0

function tick(){

    const delta_time = clock.getDelta()
    const elapsed_time = clock.getElapsedTime()

    // Reset camera position if iddle
    const current_pos_x = camera.position.x
    const current_pos_z = camera.position.z
    const delta_pos_x = current_pos_x - pos_x
    const delta_pos_z = current_pos_z - pos_z
    pos_x = current_pos_x
    pos_z = current_pos_z

    if(Math.abs(delta_pos_z + delta_pos_x) < 0.005){
        iddle_timeout += 1
    }
    else{
        iddle_timeout = 0
    }

    if(iddle_timeout == 5000){
        is_transitioning = true
        gsap.to(camera.position, { x: Math.round(camera.position.x), z: Math.round(camera.position.z), duration: 1,onComplete:function(){
            is_transitioning = false
        }})
    }

    if(wasd_mode){
        // WASD Controller
        velocity.x -= velocity.x * 10.0 * delta_time;
        velocity.z -= velocity.z * 10.0 * delta_time;

        direction.z = Number( moveForward ) - Number( moveBackward );
        direction.x = Number( moveRight ) - Number( moveLeft );
        direction.normalize(); // this ensures consistent movements in all directions

        if ( moveForward || moveBackward ) velocity.z -= direction.z * 10.0 * delta_time;
        if ( moveLeft || moveRight ) velocity.x -= direction.x * 10.0 * delta_time;

        pointer_lock_control.moveRight( - velocity.x * delta_time );
        pointer_lock_control.moveForward( - velocity.z * delta_time );

        // WASD Changing Image Variable
        const current_position_x = Math.round(camera.position.x)
        const current_position_z = Math.round(camera.position.z)
        const delta_position_x = current_position_x - position_x
        const delta_position_z = current_position_z - position_z
        position_x = current_position_x
        position_z = current_position_z

        try{
            if(delta_position_x !== 0 || delta_position_z !== 0){
                coordinates = coordinates + (delta_position_x * grid) - (delta_position_z * increment)
        
                texture_base_color = textures360[coordinates]
                texture_depth = textures360_depth[coordinates]
        
                if(texture_base_color.image && texture_depth.image && !is_transitioning){
                    is_transitioning = true
                    if (flip_flop % 2 == 0){

                        material_360_2.uniforms.u_texture_base_color.value = texture_base_color
                        material_360_2.uniforms.u_texture_depth.value = texture_depth

                        material_360_2.depthWrite = true
                        material_360_1.depthWrite = false
        
                        sphere_mesh2.position.x = Math.round(camera.position.x)
                        sphere_mesh2.position.z = Math.round(camera.position.z)
    
                        material_360_2.uniforms.u_alpha.value = 1
                        material_360_1.uniforms.u_alpha.value = 0
    
                        is_transitioning = false
                        flip_flop += 1
                    }
                    else{
 
                        material_360_1.uniforms.u_texture_base_color.value = texture_base_color
                        material_360_1.uniforms.u_texture_depth.value = texture_depth

                        material_360_1.depthWrite = true
                        material_360_2.depthWrite = false
        
                        sphere_mesh1.position.x = Math.round(camera.position.x)
                        sphere_mesh1.position.z = Math.round(camera.position.z)
    
                        material_360_1.uniforms.u_alpha.value = 1
                        material_360_2.uniforms.u_alpha.value = 0
        
                        is_transitioning = false
                        flip_flop += 1
                    }
                }
            }
        }
        catch (err){

        }
    }

    // Update 360 material
    material_360_1.needsUpdate
    material_360_2.needsUpdate

    // Update mixer
    mixer.update(delta_time)

    // Pet Behaviour
    pet_object.lookAt(new THREE.Vector3(camera.position.x, camera.position.y - 0.4, camera.position.z))
    pet_object.position.y += Math.sin(elapsed_time) * 0.003
    pet_object.position.x += Math.sin(elapsed_time * 0.7) * 0.005
    pet_object.position.z += Math.cos(elapsed_time) * 0.003


    // Update device orientation
    if(window.mobileCheck()){
        device_orientation_control.update()
    }
    
    // Update shader uniforms
    wave_sine += 0.02
    cursor_material.uniforms.u_wave.value = Math.sin(wave_sine)

    // Update Raycaster
    raycaster_mouse.setFromCamera(mouse, camera)
    const intersects = raycaster_mouse.intersectObjects(object_ray_array, true)

    for(const intersect of intersects){
        //Update Plane
        if(intersects.length > 0){
            if(intersects[0].object.type == 'Mesh'){
                is_mouse_on_pet = false
                plane_mesh.rotation.x = Math.PI * intersects[0].face.normal.y * 0.5
                plane_mesh.rotation.y = Math.PI * intersects[0].face.normal.x * 0.5
                plane_mesh.rotation.z = Math.PI * intersects[0].face.normal.z * 0.5
                
                plane_mesh.position.x = intersects[0].point.x
                plane_mesh.position.y = intersects[0].point.y
                plane_mesh.position.z = intersects[0].point.z 
            }
            else if(intersects[0].object.type == 'SkinnedMesh') {
                is_mouse_on_pet = true
                plane_mesh.lookAt(camera.position)

                plane_mesh.position.x = pet_object.position.x
                plane_mesh.position.y = pet_object.position.y + 0.2
                plane_mesh.position.z = pet_object.position.z
            }
        }
    }

    // Update Renderer
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
    
}

//Click to teleport
let is_transitioning = false
let dragged = false
let is_mouse_on_button = false


const button_element = document.querySelectorAll('.button')
for(const button of button_element){
    button.addEventListener('mouseover',function(){ is_mouse_on_button = true })
    button.addEventListener('mouseout', function(){ is_mouse_on_button = false })
}
window.addEventListener('mousedown', function () { dragged = false })
window.addEventListener('mousemove', function () { dragged = true })
window.addEventListener('mouseup', function() {
        if (dragged == true) { return }
        // Update Raycaster
        const intersects = raycaster_mouse.intersectObjects(room_array, true)
        for(const intersect of intersects){
            // Teleport to object raycast
            try{
                if(intersect.object.name.toLowerCase() != 'boundary' && !is_transitioning && !wasd_mode && !is_mouse_on_button && !is_mouse_on_pet){
                    const hit_x = Math.round(intersects[0].point.x)
                    const hit_z = Math.round(intersects[0].point.z)
                    
                    coordinates = base_coordinate + ((hit_x - base_position.x) * grid) - ((hit_z - base_position.z) * increment)
    
                    texture_base_color = textures360[coordinates]
                    texture_depth = textures360_depth[coordinates]
 
                    if(texture_base_color.image && texture_depth.image){
                        is_transitioning = true
     
                        material_360_1.uniforms.u_displace.value = -displace_strength
                        material_360_2.uniforms.u_displace.value = -displace_strength
    
                        gsap.to(camera.position, { x: hit_x, z: hit_z, duration: 2})
    
                        if (flip_flop % 2 == 0){
                            material_360_2.uniforms.u_texture_base_color.value = texture_base_color
                            material_360_2.uniforms.u_texture_depth.value = texture_depth

                            material_360_2.depthWrite = true
                            material_360_1.depthWrite = false
            
                            sphere_mesh2.position.x = hit_x
                            sphere_mesh2.position.z = hit_z
    
        
                            gsap.to(material_360_2.uniforms.u_alpha, {duration: 1, value: 1, delay: 0.5})
                            gsap.to(material_360_1.uniforms.u_alpha, {duration: 0.1, value: 0, delay: 1.4, onComplete: function(){
                                is_transitioning = false
                            }})
                            flip_flop += 1
                        }
                        else{
    
                            material_360_1.uniforms.u_texture_base_color.value = texture_base_color
                            material_360_1.uniforms.u_texture_depth.value = texture_depth

                            material_360_1.depthWrite = true
                            material_360_2.depthWrite = false
            
                            sphere_mesh1.position.x = hit_x
                            sphere_mesh1.position.z = hit_z
    
                
                            gsap.to(material_360_1.uniforms.u_alpha, {duration: 1, value: 1, delay: 0.5})
                            gsap.to(material_360_2.uniforms.u_alpha, {duration: 0.1, value: 0, delay: 1.4, onComplete: function(){
                                is_transitioning = false
                            }})
                            flip_flop += 1
                        }
                    }
                }
            }
            catch(err){

            }
        }

})

/**
 * Resize window
 */
window.addEventListener('resize', function(){

    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    
    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    
    //Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

})


window.setTimeout(function (){
    tick()
}, 2000)



