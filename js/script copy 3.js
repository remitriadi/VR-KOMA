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

const base_position = {
    x:11,
    y:1.6,
    z:-9
}
const increment = 33 // Row and Column grid !!!IMPORTANT MUST ODD NUMBERS!
const base_coordinate = 735 // Initial camera position
const grid = 1 // Grid in metre

let filename_daylight = '/images/daylight/Image0000' // Filename path for daylight scene, name always start from 0
let filename_night = '/images/night/Image0000' // Filename path for night scene, name always start from 0
let filename_depth = '/images/depth/Depth0000' // Filename path for depth scene, name always start from 0

//  ------------------------------------------------EDIT VARIABLE--------------------------------------------------------

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
            gsap.to(display_element.style, {opacity: 1, duration: 3})
            loading_bar_element.classList.add('ended')
            loading_bar_element.style.transform = ''
                for(const ui of ui_element){
                    ui.style.opacity = 0.4
                }
            
        }, 500
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
    wasd_mode = true
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

document.addEventListener('fullscreenchange', exitHandler);
document.addEventListener('webkitfullscreenchange', exitHandler);
document.addEventListener('mozfullscreenchange', exitHandler);
document.addEventListener('MSFullscreenChange', exitHandler);

function exitHandler() {
    if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
        wasd_mode = false
        cursor_material.uniforms.u_opacity.value = 1
    }
} 

window.addEventListener('mousemove',function(event){
    if(wasd_mode){
        camera.rotation.y -= event.movementX * 0.004
        camera.rotation.x -= event.movementY * 0.004
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
const camera = new THREE.PerspectiveCamera(90, sizes.width / sizes.height, 0.01, 100)
camera.rotation.order = 'YXZ'
camera.position.x = base_position.x
camera.position.y = base_position.y
camera.position.z = base_position.z
scene.add(camera)

const device_orientation_control = new DeviceOrientationControls(camera)
const pointer_lock_control = new PointerLockControls(camera, canvas)
pointer_lock_control.addEventListener( 'lock', function () {

	menu.style.display = 'none';

} );

pointer_lock_control.addEventListener( 'unlock', function () {

	menu.style.display = 'block';

} );


/**
 * Navigating
 */

let duration = 0.15
let coordinates = base_coordinate
let camera_rotation = 0
let row = 0
let odd_even_number = 1
let camera_direction = new THREE.Vector3()
const vec3 = new THREE.Vector3()
let flip_flop = 0
let is_mouse_on_DOM = false

canvas.addEventListener('mouseover', function(event){
    is_mouse_on_DOM = true
})
canvas.addEventListener('mouseout', function(event){
    is_mouse_on_DOM = false
})

function texture_update(){
        // Load base color texture
        if(flip_flop%2 == 0){
            texture_base_color2 = textures360[coordinates]
            texture_base_color2.minFilter = THREE.NearestFilter
            texture_base_color2.generateMipmaps = false
            texture_base_color2.flipY = false
            texture_base_color2.sRGBEncoding = THREE.sRGBEncoding

            texture_depth2 = textures360_depth[coordinates]
            texture_depth2.minFilter = THREE.NearestFilter
            texture_depth2.generateMipmaps = false
            texture_depth2.flipY = false
    
            material_360_1.uniforms.u_texture_base_color2.value = texture_base_color2
            material_360_1.uniforms.u_texture_depth2.value = texture_depth2

            material_360_1.needsUpdate
            
            gsap.to(material_360_1.uniforms.u_mix, {duration, value: 1})

            flip_flop +=1
        }
        else{
            texture_base_color1 = textures360[coordinates]
            texture_base_color1.minFilter = THREE.NearestFilter
            texture_base_color1.generateMipmaps = false
            texture_base_color1.flipY = false
            texture_base_color1.sRGBEncoding = THREE.sRGBEncoding

            texture_depth1 = textures360_depth[coordinates]
            texture_depth1.minFilter = THREE.NearestFilter
            texture_depth1.generateMipmaps = false
            texture_depth1.flipY = false

            material_360_1.uniforms.u_texture_base_color1.value = texture_base_color1
            material_360_1.uniforms.u_texture_depth1.value = texture_depth1

            material_360_1.needsUpdate
            
            gsap.to(material_360_1.uniforms.u_mix, {duration, value: 0})

            flip_flop +=1
        }

        // Update pet material
        
        row = Math.ceil(coordinates/(increment))
        odd_even_number = row % 2 
}

/**
 * Textures
 */

// 360 Texture
const textures360 = []
const textures360_daylight = []
const textures360_night = []
const textures360_depth1 = []
const textures360_depth2 = []
const textures360_depth = []

// Daylight
for(let i = 1; i <= (increment * increment * 2); i++){
    const image_number = String(i)
    const update_filename = filename_daylight.substring(0, filename_daylight.length - image_number.length) + image_number
    const final_filename = update_filename + '.webp'
    textures360_daylight[i] = texture_loader.load(final_filename) 
    textures360[i] = textures360_daylight[i]
}

//Night
for(let i = 1; i <= (increment * increment * 2); i++){
    const image_number = String(i)
    const update_filename = filename_night.substring(0, filename_night.length - image_number.length) + image_number
    const final_filename = update_filename + '.webp'
    textures360_night[i] = texture_loader_wo_load.load(final_filename)  
}

//Depth
for(let i = 1; i <= (increment * increment * 2); i++){
    const image_number = String(i)
    const update_filename = filename_depth.substring(0, filename_depth.length - image_number.length) + image_number
    const final_filename = update_filename + '.webp'
    textures360_depth[i] = texture_loader_wo_load.load(final_filename)  
}


//Load textures
let texture_base_color1 = textures360_daylight[coordinates]
texture_base_color1.minFilter = THREE.NearestFilter
texture_base_color1.generateMipmaps = false
texture_base_color1.flipY = false
texture_base_color1.sRGBEncoding = THREE.sRGBEncoding

let texture_base_color2 = textures360_daylight[coordinates]
texture_base_color2.minFilter = THREE.NearestFilter
texture_base_color2.generateMipmaps = false
texture_base_color2.flipY = false
texture_base_color2.sRGBEncoding = THREE.sRGBEncoding

let texture_depth1 = textures360_depth[coordinates]
texture_depth1.minFilter = THREE.NearestFilter
texture_depth1.generateMipmaps = false
texture_depth1.flipY = false

let texture_depth2 = textures360_depth[coordinates]
texture_depth2.minFilter = THREE.NearestFilter
texture_depth2.generateMipmaps = false
texture_depth2.flipY = false

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
    uniforms:{
        u_texture_depth1: {value: texture_depth1},
        u_texture_depth2: {value: texture_depth2},
        u_texture_base_color1: {value: texture_base_color1},
        u_texture_base_color2: {value: texture_base_color2},
        u_alpha: {value:0},
        u_mix: {value:0},
    },
    vertexShader:`
        uniform sampler2D u_texture_depth1;
        uniform sampler2D u_texture_depth2;
        uniform float u_mix;

        varying vec2 vUv;

        void main(){
            vUv = uv;
            vec4 depth1 = texture2D(u_texture_depth1, vUv);
            vec3 texture_depth1 = vec3(depth1.x, depth1.y, depth1.z);

            vec4 depth2 = texture2D(u_texture_depth2, vUv);
            vec3 texture_depth2 = vec3(depth2.x, depth2.y, depth2.z);
            
            vec3 depth_final = mix(texture_depth1, texture_depth2, u_mix);

            vec4 modelPosition = modelMatrix * vec4(position + (depth_final * normal * -10.0), 1.0) ;
            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectedPosition = projectionMatrix * viewPosition;
        
            gl_Position = projectedPosition;
            
        }
    `,
    fragmentShader:`
        uniform sampler2D u_texture_base_color1;
        uniform sampler2D u_texture_base_color2;
        uniform float u_alpha;
        uniform float u_mix;

        varying vec2 vUv;

        void main(){
            vec4 texture_color1 = texture2D(u_texture_base_color1, vUv);
            vec4 texture_color2 = texture2D(u_texture_base_color2, vUv);

            gl_FragColor = mix(texture_color1,texture_color2,u_mix);
            gl_FragColor.a = 0.5;
        }
    `,
    transparent: true,
    side: THREE.DoubleSide
})

const material_360_2 = new THREE.ShaderMaterial({
    uniforms:{
        u_texture_depth1: {value: texture_depth1},
        u_texture_depth2: {value: texture_depth2},
        u_texture_base_color1: {value: texture_base_color1},
        u_texture_base_color2: {value: texture_base_color2},
        u_alpha: {value:0},
        u_mix: {value:0},
    },
    vertexShader:`
        uniform sampler2D u_texture_depth1;
        uniform sampler2D u_texture_depth2;
        uniform float u_mix;

        varying vec2 vUv;

        void main(){
            vUv = uv;
            vec4 depth1 = texture2D(u_texture_depth1, vUv);
            vec3 texture_depth1 = vec3(depth1.x, depth1.y, depth1.z);

            vec4 depth2 = texture2D(u_texture_depth2, vUv);
            vec3 texture_depth2 = vec3(depth2.x, depth2.y, depth2.z);
            
            vec3 depth_final = mix(texture_depth1, texture_depth2, u_mix);

            vec4 modelPosition = modelMatrix * vec4(position + (depth_final * normal * -10.0), 1.0) ;
            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectedPosition = projectionMatrix * viewPosition;
        
            gl_Position = projectedPosition;
            
        }
    `,
    fragmentShader:`
        uniform sampler2D u_texture_base_color1;
        uniform sampler2D u_texture_base_color2;
        uniform float u_alpha;
        uniform float u_mix;

        varying vec2 vUv;

        void main(){
            vec4 texture_color1 = texture2D(u_texture_base_color1, vUv);
            vec4 texture_color2 = texture2D(u_texture_base_color2, vUv);

            gl_FragColor = mix(texture_color1,texture_color2,u_mix);
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
    opacity: 0.5
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
        model.scale.set(0.25,0.25,0.25)
        
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
const sphere_mesh1 = new THREE.Mesh(
    new THREE.SphereGeometry(10,128,128),
    material_360_1
)
sphere_mesh1.scale.y = -1
sphere_mesh1.scale.x = -1
sphere_mesh1.rotation.y = Math.PI * -0.5
sphere_mesh1.renderOrder = 1
sphere_mesh1.position.x = base_position.x
sphere_mesh1.position.y = base_position.y
sphere_mesh1.position.z = base_position.z
scene.add(sphere_mesh1)

const sphere_mesh2 = new THREE.Mesh(
    new THREE.SphereGeometry(10,128,128),
    material_360_1
)
sphere_mesh2.scale.y = -1
sphere_mesh2.scale.x = -1
sphere_mesh2.rotation.y = Math.PI * -0.5
sphere_mesh2.renderOrder = 1
sphere_mesh2.position.x = base_position.x
sphere_mesh2.position.y = base_position.y
sphere_mesh2.position.z = base_position.z
// scene.add(sphere_mesh2)

// Plane Geo
let wave_sine = 0
const plane_geometry = new THREE.PlaneGeometry(1,1,1,1)
const plane_mesh = new THREE.Mesh(plane_geometry,cursor_material)
plane_mesh.renderOrder = 3
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
    if(is_light_on == false){
        // to Night
        is_light_on = true

        duration = 3
        gsap.to(ambient_light.color, {r:37/255, g:35/255, b:49/255, duration})
        gsap.to(pet_lighting.color, {r:54/255, g:44/255, b:43/255, duration })
        gsap.to(pet_material, {envMapIntensity: 0.1, duration })
        pet_material.envMap = env_texture_night

        for(let i = 1; i <= (increment * increment * 2); i++){
            textures360[i] = textures360_night[i]  
        }

        let texture_base_color1 = textures360[coordinates]
        texture_base_color1.flipY = false
        texture_base_color1.sRGBEncoding = THREE.sRGBEncoding

        let texture_base_color2 = textures360[coordinates]
        texture_base_color2.flipY = false
        texture_base_color2.sRGBEncoding = THREE.sRGBEncoding

        
        texture_update()
    }
    else{
        // to Daylight
        is_light_on = false

        duration = 3
        gsap.to(ambient_light.color, {r:98/255, g:82/255, b:67/255, duration})
        gsap.to(pet_lighting.color, {r:138/255, g:127/255, b:109/255, duration })
        gsap.to(pet_material, {envMapIntensity: 0.2, duration })
        pet_material.envMap = env_texture_night

        for(let i = 1; i <= (increment * increment * 2); i++){
            textures360[i] = textures360_daylight[i]   
        }

        let texture_base_color1 = textures360[coordinates]
        texture_base_color1.flipY = false
        texture_base_color1.sRGBEncoding = THREE.sRGBEncoding

        let texture_base_color2 = textures360[coordinates]
        texture_base_color2.flipY = false
        texture_base_color2.sRGBEncoding = THREE.sRGBEncoding

        texture_update()
    }
}
// Fullscreen browser
const viewport = document.querySelector('body.viewport')
const full_screen = document.getElementById('full-screen')
let is_full_screen = false

full_screen.onclick = function(){
    if(is_full_screen){
        is_full_screen = false
        if (document.exitFullscreen) {
            document.exitFullscreen()
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen()
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen()
          }
    }
    else{
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
        is_sound_on = true
        bgm.loop = true
        bgm.play()
    }
    else{
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
    update_pet_position.x = sphere_mesh1.position.x + forward.x + (right.x * 0.5)
    update_pet_position.y = sphere_mesh1.position.y + forward.y + right.y -0.5
    update_pet_position.z = sphere_mesh1.position.z + forward.z + (right.z * 0.5)

    gsap.to(pet_object.position, {x: update_pet_position.x, duration: 2})
    update_pet_position.y = 1.7
    gsap.to(pet_object.position, {z: update_pet_position.z, duration: 2})

}, 2000)

// Pet Interaction
const chat_sound1 = new Audio('/sounds/mumbling_sound_1.mp3')
const chat_sound2 = new Audio('/sounds/mumbling_sound_2.mp3')
const chat_sound3 = new Audio('/sounds/mumbling_sound_3.mp3')
// chat_sound1.loop = true
// chat_sound2.loop = true
// chat_sound3.loop = true

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
let count = 0


// Start dialog box
canvas.addEventListener('click',function(event){
    mouse_pet.x = event.offsetX / sizes.width * 2 - 1
    mouse_pet.y = - (event.offsetY / sizes.height) * 2 + 1
    raycaster_mouse.setFromCamera(mouse_pet, camera)
    const intersect_pet = raycaster_mouse.intersectObjects(pet_array)

    if(intersect_pet.length > 0){
        chat_box.style.transform = `scale(1)`
        chat_box.style.opacity = 1
        chat_sounds_array[count%3].play()
        chat_content.innerHTML = chat_array[count%3]
    }
},)

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
    odd_even_row = Math.abs((Math.round(camera.position.z * 2)) % 2)

    if((camera.position.x * 2)/2 == 1 ||(camera.position.z * 2)/2 == 1){
        console.log('yes')
        if(odd_even_row === 1){
            coordinates = Math.round(base_coordinate + ((camera.position.x - 0.5) * grid) + -((camera.position.z - 0.5) * increment * 2))
        }
        if(odd_even_row === 0){
            coordinates = Math.round(base_coordinate + (camera.position.x * grid) + -(camera.position.z * increment * 2))
        }
        texture_update() 
    }


    console.log(coordinates, camera.position.x,((Math.round(camera.position.x * 2))/2))
    if(camera.position.xd > (Math.round(camera.position.x * 2))/2){
        console.log('yes')
    }

    switch ( event.code ) {

        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            break;

        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            break;

        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            break;

        case 'ArrowRight':
        case 'KeyD':
            moveRight = true;
            break;

    }

};

const onKeyUp = function ( event ) {

    switch ( event.code ) {

        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;

        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false;
            break;

        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;

        case 'ArrowRight':
        case 'KeyD':
            moveRight = false;
            break;

    }

};

document.addEventListener( 'keydown', onKeyDown );
document.addEventListener( 'keyup', onKeyUp );

const velocity = new THREE.Vector3();
const direction = new THREE.Vector3()

function tick(){
    const delta_time = clock.getDelta()
    const elapsed_time = clock.getElapsedTime()

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




    // Update mixer
    mixer.update(delta_time)

    // Pet Behaviour
    pet_object.lookAt(new THREE.Vector3(sphere_mesh1.position.x, sphere_mesh1.position.y - 0.4, sphere_mesh1.position.z))
    pet_object.position.y += Math.sin(elapsed_time) * 0.003
    pet_object.position.x += Math.sin(elapsed_time * 0.7) * 0.005
    pet_object.position.z += Math.cos(elapsed_time) * 0.003


    // Update device orientation
    if(window.mobileCheck()){
        device_orientation_control.update()
    }

    // Set Camera Rotation
    camera_rotation = (((camera.rotation.y % (Math.PI * 2)) * 180 / Math.PI) + (360 * 1000)) % 360
    
    // Update shader uniforms
    wave_sine += 0.02
    cursor_material.uniforms.u_wave.value = Math.sin(wave_sine)

    // Update Raycaster
    raycaster_mouse.setFromCamera(mouse, camera)
    const intersects = raycaster_mouse.intersectObjects(room_array)

    for(const intersect of intersects){
        //Update Plane
        if(intersects.length > 0){
            plane_mesh.rotation.x = Math.PI * intersects[0].face.normal.y * 0.5
            plane_mesh.rotation.y = Math.PI * intersects[0].face.normal.x * 0.5
            plane_mesh.rotation.z = Math.PI * intersects[0].face.normal.z * 0.5
            
            plane_mesh.position.x = intersects[0].point.x
            plane_mesh.position.y = intersects[0].point.y
            plane_mesh.position.z = intersects[0].point.z 
        }
    }

    // Update Renderer
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
    
}

// Touch Mobile teleport to destination
if(window.mobileCheck()){
    canvas.addEventListener('click', function (event){
        const intersects = raycaster_mouse.intersectObjects(room_array)
        const intersect_pet = raycaster_mouse.intersectObjects(pet_array)

        for(const intersect of intersects){
            if(intersect.object.name.toLowerCase() != 'boundary' && intersect_pet.length < 1){
                duration = 0.6
    
                sphere_mesh1.position.x = Math.round(intersects[0].point.x)
                sphere_mesh1.position.z = Math.round(intersects[0].point.z)
                odd_even_row = Math.abs((sphere_mesh1.position.z * 2) % 2)
                
                if(odd_even_row === 1){
                    sphere_mesh1.position.z = Math.round(sphere_mesh1.position.z) + 0.5
                    sphere_mesh1.position.x = Math.round(sphere_mesh1.position.x) - 0.5
                    coordinates = base_coordinate + ((sphere_mesh1.position.x - 0.5) * grid) + -((sphere_mesh1.position.z - 0.5) * increment * 2)
                }
                if(odd_even_row === 0){
                    sphere_mesh1.position.z = Math.round(sphere_mesh1.position.z)
                    sphere_mesh1.position.x = Math.round(sphere_mesh1.position.x)
                    coordinates = base_coordinate + (sphere_mesh1.position.x * grid) + -(sphere_mesh1.position.z * increment * 2)
                }
            
            // Animate transition
            texture_update() 
            }
    }
        
    })
}

// Double click teleport to destination
let odd_even_row = 0
if(!window.mobileCheck()){
    
    canvas.addEventListener('dblclick', function(event){
    
        // Update Raycaster
        const intersects = raycaster_mouse.intersectObjects(room_array)
    
        for(const intersect of intersects){
            // Teleport to object raycast
            if(intersect.object.name.toLowerCase() != 'boundary'){
                
    
                const hit_x = Math.round(intersects[0].point.x)
                const hit_z = Math.round(intersects[0].point.z)
                odd_even_row = Math.abs((hit_z *2) % 2)
                
                coordinates = base_coordinate + ((hit_x - base_position.x) * grid) - ((hit_z - base_position.z) * (increment * 2))
                
                console.log(hit_x, hit_z, odd_even_row, coordinates)

                gsap.to(camera.position, { x: hit_x, z: hit_z, duration: 2})
                
                
            }
        }
        
    })
}

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



