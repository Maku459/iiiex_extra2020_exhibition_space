import * as THREE from 'three'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as MW from 'meshwalk';

let W, H;
const scene = new THREE.Scene(), renderer = new THREE.WebGLRenderer({alpha: true, antialias: true}), camera = new THREE.PerspectiveCamera(30, W/H, 1, 3000), clock = new THREE.Clock();
const gltfLoader = new GLTFLoader();
const color = [{bg: "transparent", obj: new THREE.Group()}, {bg: "rgba(255, 0, 0, 0.2)", obj: new THREE.Group()}, {bg: "rgba(0, 255, 0, 0.2)", obj: new THREE.Group()}, {bg: "rgba(0, 0, 255, 0.2)", obj: new THREE.Group()}];
let dirLR = 0, dirFB = 0, dirUD = 0, yaw = 0, pitch = 0, camY = 10, dragging = false;
const spFB = 20, spLR = 0.2, spUD = 10, exLR = 1, len = 30;
let LRs = new Array(), FBs = new Array(), UDs = new Array(), dirs = [false, false, false, false, false, false];
const pmouse = new THREE.Vector3();

MW.install(THREE);
const world = new MW.World(), min = new THREE.Vector3(-50, -1, -50), max = new THREE.Vector3(50, 50, 50), partition = 5, playerRadius = 1;
const octree = new MW.Octree(min, max, partition);
world.add(octree);

const playerObjectHolder = new THREE.Object3D();
playerObjectHolder.position.set(0, camY, 0);
scene.add(playerObjectHolder);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(playerRadius, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true}));
playerObjectHolder.add(sphere);

//const playerController = new MW.CharacterController(playerObjectHolder, playerRadius);
//world.add(playerController);


renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000);

document.addEventListener('DOMContentLoaded', () => {
	setMain();
	window.addEventListener("resize", setMain);
	window.addEventListener("orientationchange", setMain);
	document.querySelector("#world").appendChild(renderer.domElement);
	
	camera.position.set(0, camY, 10);
	pitch = camY;
	
	const lights = new THREE.Group();
	const light0 = new THREE.DirectionalLight(0xFFFFFF, 0.2);
	light0.position.set(0, 50, 0);
	lights.add(light0);
	const directionalLightHelper0 = new THREE.DirectionalLightHelper(light0);
	lights.add(directionalLightHelper0);
	scene.add(lights);
	const light1 = new THREE.DirectionalLight(0xFFFFFF, 0.2);
	light1.position.set(50, 50, 0);
	lights.add(light1);
	const directionalLightHelper1 = new THREE.DirectionalLightHelper(light1);
	lights.add(directionalLightHelper1);
	scene.add(lights);
	const light2 = new THREE.DirectionalLight(0xFFFFFF, 0.2);
	light2.position.set(-50, 50, 0);
	lights.add(light2);
	const directionalLightHelper2 = new THREE.DirectionalLightHelper(light2);
	lights.add(directionalLightHelper2);
	scene.add(lights);
	const light3 = new THREE.DirectionalLight(0xFFFFFF, 0.2);
	light3.position.set(0, 50, 50);
	lights.add(light3);
	const directionalLightHelper3 = new THREE.DirectionalLightHelper(light3);
	lights.add(directionalLightHelper3);
	scene.add(lights);
	const light4 = new THREE.DirectionalLight(0xFFFFFF, 0.2);
	light4.position.set(0, 50, -50);
	lights.add(light4);
	const directionalLightHelper4 = new THREE.DirectionalLightHelper(light4);
	lights.add(directionalLightHelper4);
	scene.add(lights);
	const light5 = new THREE.DirectionalLight(0xFFFFFF, 0.2);
	light5.position.set(0, -50, 0);
	lights.add(light5);
	const directionalLightHelper5 = new THREE.DirectionalLightHelper(light5);
	lights.add(directionalLightHelper5);
	scene.add(lights);
	
	gltfLoader.load('/model/iiiEx_field_only.gltf', (data) => {
	    const gltf = data;
	    const obj = gltf.scene;
//		console.log(obj.children[2]);
		scene.add(obj.children[2]);
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
//		obj.scale.set(20, 20, 20);
	});
	const geo = new THREE.SphereGeometry(0.1), mat = new THREE.MeshBasicMaterial({color: "#ffff00"});
	for (var i=0; i<5000; i++) {
		const sphere = new THREE.Mesh(geo, mat);
		sphere.position.set(Math.random()*100-50, Math.random()*100-50, Math.random()*100-50);
		scene.add(sphere);
	}
		
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
	
	update();
	
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
	if (array.length > len) {
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
	requestAnimationFrame(update);
}
