import * as THREE from 'three'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as OIMO from './oimo';
//import * as MW from './meshwalk';

let W, H;
const scene = new THREE.Scene(), renderer = new THREE.WebGLRenderer({alpha: true, antialias: true}), camera = new THREE.PerspectiveCamera(30, W/H, 1, 3000), clock = new THREE.Clock();
const gltfLoader = new GLTFLoader();
const color = [{bg: "transparent", obj: new THREE.Group()}, {bg: "rgba(255, 0, 0, 0.2)", obj: new THREE.Group()}, {bg: "rgba(0, 255, 0, 0.2)", obj: new THREE.Group()}, {bg: "rgba(0, 0, 255, 0.2)", obj: new THREE.Group()}];
let dirLR = 0, dirFB = 0, dirUD = 0, yaw = 0, pitch = 0, camY = 5, dragging = false;
const spFB = 15, spLR = 0.1, spUD = 7, exLR = 1.5, max = 30;
let LRs = new Array(), FBs = new Array(), UDs = new Array(), dirs = [false, false, false, false, false, false];
const pmouse = new THREE.Vector3();

/*const oimo = new OIMO.World({ 
    timestep: 1/60, 
    iterations: 8, 
    broadphase: 2, // 1 brute force, 2 sweep and prune, 3 volume tree
    worldscale: 1, // scale full world 
    random: true,  // randomize sample
    info: true,   // calculate statistic or not
    gravity: [0, -9.8 ,0] 
});

var body = oimo.add({ 
    type:'sphere', // type of shape : sphere, box, cylinder 
    size:[1,1,1], // size of shape
    pos:[0,0,0], // start position in degree
    rot:[0,0,90], // start rotation in degree
    move:true, // dynamic or statique
    density: 1,
    friction: 0.2,
    restitution: 0.2,
    belongsTo: 1, // The bits of the collision groups to which the shape belongs.
    collidesWith: 0xffffffff // The bits of the collision groups with which the shape collides.
});*/


renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000);

document.addEventListener('DOMContentLoaded', () => {
	setMain();
	window.addEventListener("resize", setMain);
	window.addEventListener("orientationchange", setMain);
	document.querySelector("#world").appendChild(renderer.domElement);
	
	camera.position.set(0, 5, 10);
	pitch = camY;
	
	const lights = new THREE.Group();
	const light0 = new THREE.DirectionalLight(0xFFFFFF, 0.5);
	light0.position.set(0, 50, 0);
	lights.add(light0);
	const directionalLightHelper0 = new THREE.DirectionalLightHelper(light0);
	lights.add(directionalLightHelper0);
	scene.add(lights);
	const light1 = new THREE.DirectionalLight(0xFFFFFF, 0.5);
	light1.position.set(50, 50, 0);
	lights.add(light1);
	const directionalLightHelper1 = new THREE.DirectionalLightHelper(light1);
	lights.add(directionalLightHelper1);
	scene.add(lights);
	const light2 = new THREE.DirectionalLight(0xFFFFFF, 0.5);
	light2.position.set(-50, 50, 0);
	lights.add(light2);
	const directionalLightHelper2 = new THREE.DirectionalLightHelper(light2);
	lights.add(directionalLightHelper2);
	scene.add(lights);
	const light3 = new THREE.DirectionalLight(0xFFFFFF, 0.5);
	light3.position.set(0, 50, 50);
	lights.add(light3);
	const directionalLightHelper3 = new THREE.DirectionalLightHelper(light3);
	lights.add(directionalLightHelper3);
	scene.add(lights);
	const light4 = new THREE.DirectionalLight(0xFFFFFF, 0.5);
	light4.position.set(0, 50, -50);
	lights.add(light4);
	const directionalLightHelper4 = new THREE.DirectionalLightHelper(light4);
	lights.add(directionalLightHelper4);
	scene.add(lights);
	const light5 = new THREE.DirectionalLight(0xFFFFFF, 0.5);
	light5.position.set(0, -50, 0);
	lights.add(light5);
	const directionalLightHelper5 = new THREE.DirectionalLightHelper(light5);
	lights.add(directionalLightHelper5);
	scene.add(lights);
	
	gltfLoader.load('/model/iiiEx_field.gltf', (data) => {
	    const gltf = data;
	    const obj = gltf.scene;
/*	    for (let i=0; i<obj.children.length; i++) {
		    console.log(obj.children[i]);
		    let geometry = new THREE.Geometry();
//		    console.log(obj.children[i].geometry.attributes.position.array)
		    for (let j=0; j<obj.children[i].geometry.attributes.position.count; j++) {
//			    console.log(obj.children[i].geometry.attributes.position.array[j*3])
			    geometry.vertices.push(new THREE.Vector3(obj.children[i].geometry.attributes.position.array[j*3], obj.children[i].geometry.attributes.position.array[j*3+1], obj.children[i].geometry.attributes.position.array[j*3+2]));
		    }
		    let terrain = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true}));
		    terrain.scale.set(20, 20, 20);
//		    console.log(terrain);
			scene.add(terrain);
	    }*/
		obj.scale.set(20, 20, 20);
		scene.add(obj);
	});
	
	const axes = new THREE.AxesHelper(100);
	scene.add(axes);
	
	const obj0 = new THREE.Mesh(new THREE.ConeGeometry(2, 10), new THREE.MeshStandardMaterial({color: 0xffffff, roughness:0.5}));
	obj0.position.set(25, 5, 25);
	color[0].obj.add(obj0);
	scene.add(color[0].obj);
	const obj1 = new THREE.Mesh(new THREE.ConeGeometry(2, 10), new THREE.MeshStandardMaterial({color: 0xffffff, roughness:0.5}));
	obj1.position.set(25, 5, -25);
	color[1].obj.add(obj1);
	scene.add(color[1].obj);
	const obj2 = new THREE.Mesh(new THREE.ConeGeometry(2, 10), new THREE.MeshStandardMaterial({color: 0xffffff, roughness:0.5}));
	obj2.position.set(-25, 5, 25);
	color[2].obj.add(obj2);
	scene.add(color[2].obj);
	const obj3 = new THREE.Mesh(new THREE.ConeGeometry(2, 10), new THREE.MeshStandardMaterial({color: 0xffffff, roughness:0.5}));
	obj3.position.set(-25, 5, -25);
	color[3].obj.add(obj3);
	scene.add(color[3].obj);

	for (let i=0; i<color.length; i++) {
		color[i].obj.visible = false;
	}
	color[0].obj.visible = true;
	
	document.addEventListener("keydown", (e) => {
		switch (e.code) {
			case "ArrowRight" :
			case "KeyD" :
				dirs[0] = true;
			break;
			case "ArrowLeft" :
			case "KeyA" :
				dirs[1] = true;
			break;
			case "ArrowUp" :
			case "KeyW" :
				dirs[2] = true;
			break;
			case "ArrowDown" :
			case "KeyS" :
				dirs[3] = true;
			break;
		}
	});
	
	document.addEventListener("keyup", (e) => {
		switch (e.code) {
			case "ArrowRight" :
			case "KeyD" :
				dirs[0] = false;
			break;
			case "ArrowLeft" :
			case "KeyA" :
				dirs[1] = false;
			break;
			case "ArrowUp" :
			case "KeyW" :
				dirs[2] = false;
			break;
			case "ArrowDown" :
			case "KeyS" :
				dirs[3] = false;
			break;
			case "Space" :
				pitch = camY;
			break;
		}
	});
	
	document.querySelector("#world").addEventListener("mousedown", (e) => {
		dragging = true;
		pmouse.x = e.pageX;
		pmouse.y = e.pageY;
	});
	
	document.querySelector("#world").addEventListener("mousemove", (e) => {
		if (dragging) {
			const rot = Math.atan2(e.pageY - pmouse.y, e.pageX - pmouse.x);
			dirLR += -Math.cos(rot) * exLR;
			dirUD += Math.sin(rot);
			pmouse.x = e.pageX;
			pmouse.y = e.pageY;
		}
	});
	
	document.querySelector("#world").addEventListener("mouseup", (e) => {
		dragging = false;
	});
	
	document.querySelectorAll("#glass a").forEach((target) => {
		target.addEventListener("click", (e) => {
			e.preventDefault();
			let n = target.dataset.no;
			document.querySelector("#screen").style.backgroundColor = color[n].bg;
			for (let i=0; i<color.length; i++) {
				color[i].obj.visible = false;
			}
			color[n].obj.visible = true;
		});
	});
	
	update();
});

const setMain = () => {
	W = document.getElementById("world").clientWidth;
	H = window.innerHeight;
	document.getElementById("world").style.height = H + "px";
	document.getElementById("screen").style.width = W + "px";
	document.getElementById("screen").style.height = H + "px";
	renderer.setSize(W, H);
	if (camera) {
		camera.aspect = W/H;
		camera.updateProjectionMatrix();
	}
}

const getSum = (array, value) => {
	array.push(value);
	if (array.length > max) {
		array.shift();
	}
	let sum = 0;
	for (let i=0; i<array.length; i++) {
		sum += array[i];
	}
	sum /= array.length;
	return sum;
}

const moving = () => {
	const delta = clock.getDelta();
	if (dirs[0]) dirLR++;
	if (dirs[1]) dirLR--;
	if (dirs[2]) dirFB++;
	if (dirs[3]) dirFB--;
	if (dirs[4]) dirUD++;
	if (dirs[5]) dirUD--;
	yaw += getSum(LRs, dirLR) * Math.PI * spLR * delta;
	pitch += getSum(UDs, dirUD) * spUD * delta
	
	const offset = getSum(FBs, dirFB) * spFB * delta;
	let offsetX = offset * Math.cos(yaw);
	let offsetZ = offset * Math.sin(yaw);
	camera.position.set(camera.position.x + offsetX, camera.position.y, camera.position.z + offsetZ);
	
	offsetX = spFB * Math.cos(yaw);
	offsetZ = spFB * Math.sin(yaw);
	camera.lookAt(new THREE.Vector3(camera.position.x + offsetX, pitch, camera.position.z + offsetZ));
	dirFB = 0;
	dirLR = 0;
	dirUD = 0;
}

const update = () =>  {
	moving();
	renderer.render(scene, camera);
//	oimo.step();
//	camera.position.copy( body.getPosition() );
	requestAnimationFrame(update);
}
