import * as THREE from 'three'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as iNoBounce from './inobounce.min';

let W, H;
const scene = new THREE.Scene(), renderer = new THREE.WebGLRenderer({alpha: true, antialias: true}), camera = new THREE.PerspectiveCamera(30, W/H, 1, 3000), clock = new THREE.Clock();
const gltfLoader = new GLTFLoader();
const color = [{bg: "transparent", obj: new THREE.Group()}, {bg: "rgba(255, 0, 0, 0.2)", obj: new THREE.Group()}, {bg: "rgba(0, 255, 0, 0.2)", obj: new THREE.Group()}, {bg: "rgba(0, 0, 255, 0.2)", obj: new THREE.Group()}];
let dirLR = 0, dirFB = 0, dirUD = 0, yaw = 0, pitch = 0, camY = 10, dragging = false;
const spFB = 20, spLR = 0.2, spUD = 10, exLR = 1, len = 30;
let LRs = new Array(), FBs = new Array(), UDs = new Array(), dirs = [false, false, false, false, false, false];
const pmouse = new THREE.Vector3();

iNoBounce.enable();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000);

document.addEventListener('DOMContentLoaded', () => {
	setMain();
	window.addEventListener("resize", setMain);
	window.addEventListener("orientationchange", setMain);
	document.querySelector("#world").appendChild(renderer.domElement);
	
	camera.position.set(0, camY, 0);
	pitch = camY;
	
	const lights = new THREE.Group();
	const light0 = new THREE.PointLight(0xffffff, 0.8, 0, 0);
	light0.position.set(0, 150, 0);
	lights.add(light0);
	scene.add(lights);
	
	gltfLoader.load('/model/iiiEx_doom.gltf', (data) => {
	    const gltf = data.scene;
	    console.log(gltf)
	    gltf.position.set(0, -30, 0);
		scene.add(gltf);
		
		gltfLoader.load("/model/landmark.gltf", (data) => {
			const model = data.scene;
			model.position.set(0, 0, 16);
			model.scale.set(16, 16, 16);
			scene.add(model);
		});
		for (var i=0; i<3; i++) {
			loadModel("/model/iiiEx_primitive_bird_niren.gltf");
			loadModel("/model/iiiEx_primitive_fish_niren.gltf");
			loadModel("/model/iiiEx_primitive_snake_niren.gltf");
		}
	});
	
	const geo = new THREE.SphereGeometry(0.1), mat = new THREE.MeshBasicMaterial({color: "#ffff00"});
	for (var i=0; i<3000; i++) {
		const sphere = new THREE.Mesh(geo, mat);
		sphere.position.set(Math.random()*200-100, Math.random()*200-100, Math.random()*200-100);
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
	
	document.querySelector("#world").addEventListener("pointerdown", (e) => {
		dragging = true;
		pmouse.x = e.pageX;
		pmouse.y = e.pageY;
	});
	
	document.querySelector("#world").addEventListener("pointermove", (e) => {
		if (dragging) {
			const rot = Math.atan2(e.pageY - pmouse.y, e.pageX - pmouse.x);
			dirLR += -Math.cos(rot) * exLR;
			dirUD += Math.sin(rot);
			pmouse.x = e.pageX;
			pmouse.y = e.pageY;
		}
	});
	
	document.querySelector("#world").addEventListener("pointerup", (e) => {
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
	
const loadModel = (pass) => {
	gltfLoader.load(pass, (data) => {
		const model = data.scene;
		scene.add(model);
	});
}

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
