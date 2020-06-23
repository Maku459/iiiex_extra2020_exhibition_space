import * as THREE from 'three'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as iNoBounce from './inobounce.min';

(function() {
	let W, H;
	const scene = new THREE.Scene(), renderer = new THREE.WebGLRenderer({alpha: true, antialias: true}), camera = new THREE.PerspectiveCamera(30, W/H, 1, 3000), clock = new THREE.Clock();
	const gltfLoader = new GLTFLoader(), txLoader = new THREE.TextureLoader();
	const zipMat = new THREE.MeshBasicMaterial({transparent:true, side:THREE.DoubleSide}), zipGeo = new THREE.PlaneGeometry(1,1);
	const zips = new THREE.Group(), obsts = new THREE.Group();
	const matArray = [new THREE.MeshBasicMaterial({color: 0xff4444, roughness: 0.5}), new THREE.MeshBasicMaterial({ color: 0x44ff44, roughness: 0.5 }), new THREE.MeshBasicMaterial({ color: 0x4444ff, roughness: 0.5 })];
	const color = [{bg: "transparent", obj: new THREE.Group()}, {bg: "rgba(255, 0, 0, 0.2)", obj: new THREE.Group()}, {bg: "rgba(0, 255, 0, 0.2)", obj: new THREE.Group()}, {bg: "rgba(0, 0, 255, 0.2)", obj: new THREE.Group()}];
	let dirLR = 0, dirFB = 0, dirUD = 0, yaw = 0, pitch = 0, camY = 10, dragging = false;
	const spFB = 40, spLR = 0.3, spUD = 10, exLR = 1, len = 30;
	let LRs = new Array(), FBs = new Array(), UDs = new Array(), dirs = [false, false, false, false, false, false];
	const pmouse = new THREE.Vector3();
	const dist = {zip: 20, area: 203 - 10, obst: 20};
	
	iNoBounce.enable();
	
	document.addEventListener('DOMContentLoaded', () => {
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setClearColor(0x000000);
		
		setMain();
		window.addEventListener("resize", setMain);
		window.addEventListener("orientationchange", setMain);
		document.querySelector("#world").appendChild(renderer.domElement);
		
		gltfLoader.load("https://objectstore-r1nd1001.cnode.jp/v1/nc_6ddd44b3effa451b9ee2e663f54565a4/iiiex/model/iiiEx_doom3.gltf", (data) => {
			const gltf = data.scene;
			scene.add(gltf);
			
			gltfLoader.load("https://objectstore-r1nd1001.cnode.jp/v1/nc_6ddd44b3effa451b9ee2e663f54565a4/iiiex/model/iiiEx_landmark7.gltf", (data) => {
				const landmark = data.scene;
				for (let i=0; i <landmark.children.length; i++){
					if (landmark.children[i].name != "tree") {
						landmark.children[i].material = matArray[i%3];
					} else {
						landmark.children[i].material = new THREE.MeshBasicMaterial({color: 0x8F4B38, roughness: 0.5});
					}
				}
				landmark.scale.set(10, 10, 10);
				obsts.add(landmark);
				scene.add(obsts);
				
				txLoader.load("https://objectstore-r1nd1001.cnode.jp/v1/nc_6ddd44b3effa451b9ee2e663f54565a4/iiiex/texture/zipper.png", function (texture) {
					for (let i=0; i<10; i++){
						zipMat.map = texture;
						zipMat.needsUpdate = true;
						const w = 25;
						const h = texture.image.height/(texture.image.width/w);
						const plane = new THREE.Mesh(zipGeo, zipMat);
						const radius = 80;
						plane.position.set(radius*Math.sin(i*2*Math.PI/10),10,radius*Math.cos(i*2*Math.PI/10));
						plane.rotation.y = i*2*Math.PI/10;
						plane.rotation.z = - Math.PI / 2;
						plane.scale.set(w, h, 1);
						zips.add(plane);
					}
					scene.add(zips);
					
					init();
				});
			});
		});
	});
	
	const init = () => {
		camera.position.set(0, camY, 0);
		pitch = camY;
		
		const geo = new THREE.SphereGeometry(0.2), mat = new THREE.MeshBasicMaterial({color: "#3366ff"});
		for (var i=0; i<3000; i++) {
			const sphere = new THREE.Mesh(geo, mat);
			let rot = Math.random() * Math.PI * 2;
			let range = Math.random() * dist.area;
			sphere.position.set(Math.cos(rot)*range, Math.random()*150, Math.sin(rot)*range);
			scene.add(sphere);
		}
		
		const light = new THREE.PointLight(0xFFFFFF, 1.4, 0, 0);
		light.position.set(0, 150, 0);
		scene.add(light);
		renderer.gammaInput = true;
		renderer.gammaOutput = true;

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
	}
	
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
		
		let c = camera.position;
		if (Math.pow(c.x, 2) + Math.pow(c.z, 2) > Math.pow(dist.area, 2)) {
			let rot = Math.atan2(c.z, c.x);
			c.x = Math.cos(rot) * dist.area;
			c.z = Math.sin(rot) * dist.area;
		}
		
		for (let i=0; i<obsts.children.length; i++) {
			let o = obsts.children[i].position;
			if (Math.pow(o.x - c.x, 2) + Math.pow(o.z - c.z, 2) <= Math.pow(dist.obst, 2)) {
				let rot = Math.atan2(c.z-o.z, c.x-o.x);
				c.x = Math.cos(rot) * dist.obst;
				c.z = Math.sin(rot) * dist.obst;
			}
		}
		
		let hit = false;
		for (let i=0; i<zips.children.length; i++) {
			let z = zips.children[i].position;
			if (Math.pow(z.x-c.x, 2) + Math.pow(z.y-c.y, 2) + Math.pow(z.z-c.z, 2) <= Math.pow(dist.zip, 2)) {
				hit = true;
				break;
			}
		}
		if (hit) {
			document.querySelector("#plate").style.display = "block";
		} else {
			document.querySelector("#plate").style.display = "none";
		}
		
		dirFB = 0;
		dirLR = 0;
		dirUD = 0;
	}
	
	const update = () =>  {
		moving();
		renderer.render(scene, camera);
		requestAnimationFrame(update);
	}
})();