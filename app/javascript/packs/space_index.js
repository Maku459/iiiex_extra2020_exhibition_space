import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';


let W, H;
const scene = new THREE.Scene(), renderer = new THREE.WebGLRenderer({alpha: true, antialias: true}), camera = new THREE.PerspectiveCamera(90, W/H, 1, 3000), controls = new OrbitControls(camera, renderer.domElement);
const color = [{bg: "transparent", obj: new THREE.Group()}, {bg: "rgba(255, 0, 0, 0.2)", obj: new THREE.Group()}, {bg: "rgba(0, 255, 0, 0.2)", obj: new THREE.Group()}, {bg: "rgba(0, 0, 255, 0.2)", obj: new THREE.Group()}];
const　gltfLoader = new GLTFLoader();
renderer.setPixelRatio(window.devicePixelRatio);

renderer.setClearColor(0x000000);


document.addEventListener('DOMContentLoaded', () => {
	setMain();
	window.addEventListener("resize", setMain);
	window.addEventListener("orientationchange", setMain);
	document.querySelector("#world").appendChild(renderer.domElement);
	
	camera.position.set(0, 5, 100);
//	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.enableKeys = true;
	const light = new THREE.DirectionalLight(0xFFFFFF, 1);
	light.position.set(0, 50, 0);
	scene.add(light);
	const directionalLightHelper = new THREE.DirectionalLightHelper(light);
	scene.add(directionalLightHelper);
	
	gltfLoader.load('model/iiiEx_field.gltf', (data) => {
	    const gltf = data;
	    const obj = gltf.scene;
		obj.scale.set(10, 10, 10);
		scene.add(obj);
	});
	
	const axes = new THREE.AxesHelper(100);
	scene.add(axes);
	for (let i=0; i<20; i++) {
		const sphere = new THREE.Mesh(new THREE.SphereGeometry(1), new THREE.MeshStandardMaterial({color: 0xffff00, roughness:0.5}));
		scene.add(sphere);
		sphere.position.set(Math.random()*100-50, Math.random()*5, Math.random()*100-50);
	}
	
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

const update = () =>  {
	controls.update();
	renderer.render(scene, camera);
	requestAnimationFrame(update);
}
