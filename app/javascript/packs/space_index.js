import * as THREE from 'three'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as iNoBounce from './inobounce.min';
import 'modaal';

(function() {
	let W, H;
	const scene = new THREE.Scene(), renderer = new THREE.WebGLRenderer({alpha: true, antialias: true}), camera = new THREE.PerspectiveCamera(30, W/H, 1, 3000), clock = new THREE.Clock();
	const zips = new THREE.Group(), obsts = new THREE.Group();
	const color = [{bg: "transparent", mat: new THREE.MeshBasicMaterial({color: 0xffffff}), balls: new THREE.Group()}, {bg: "rgba(255, 68, 68, 0.5)", mat: new THREE.MeshBasicMaterial({color: 0xff4444}), balls: new THREE.Group()}, {bg: "rgba(68, 255, 68, 0.5)", mat: new THREE.MeshBasicMaterial({color: 0x44ff44}), balls: new THREE.Group()}, {bg: "rgba(68, 68, 255, 0.5)", mat: new THREE.MeshBasicMaterial({color: 0x4444ff}), balls: new THREE.Group()}];
	let dirLR = 0, dirFB = 0, dirUD = 0, yaw = 0, pitch = 0, camY = 10, dragging = false;
	const spFB = 40, spLR = 0.3, spUD = 10, exLR = 1, len = 30;
	const LRs = new Array(), FBs = new Array(), UDs = new Array(), dirs = [false, false, false, false, false, false];
	const pmouse = new THREE.Vector3();
	const dist = {zip: 20, area: 203 - 10, obst: 20};
	let hitFlag = true;
	
	iNoBounce.enable();
	
	document.addEventListener('DOMContentLoaded', () => {
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setClearColor(0x000000);
		
		setMain();
		window.addEventListener("resize", setMain);
		window.addEventListener("orientationchange", setMain);
		document.querySelector("#world").appendChild(renderer.domElement);
		
		const gltfLoader = new GLTFLoader();
		gltfLoader.load("https://object-storage.tyo2.conoha.io/v1/nc_7d0030b822e246239683a325ebfb1974/iiiex/model/iiiEx_doom.gltf", (data) => {
			const gltf = data.scene;
			scene.add(gltf);
			
			gltfLoader.load("https://object-storage.tyo2.conoha.io/v1/nc_7d0030b822e246239683a325ebfb1974/iiiex/model/iiiEx_landmark.gltf", (data) => {
				const landmark = data.scene;
				const matArray = [new THREE.MeshBasicMaterial({color: 0xff4444}), new THREE.MeshBasicMaterial({color: 0x44ff44}), new THREE.MeshBasicMaterial({color: 0x4444ff})];
				for (let i=0; i <landmark.children.length; i++){
					if (landmark.children[i].name == "tree") {
						landmark.children[i].material = new THREE.MeshBasicMaterial({color: 0x8F4B38});
					} else {
						landmark.children[i].material = matArray[i%3];
					}
				}
				landmark.scale.set(10, 10, 10);
				obsts.add(landmark);
				scene.add(obsts);
				
				const nesMat = new THREE.MeshBasicMaterial({color: 0xf4ae3b});
				gltfLoader.load("https://object-storage.tyo2.conoha.io/v1/nc_7d0030b822e246239683a325ebfb1974/iiiex/model/iiiEx_who.gltf", (data) => {
					const north = data.scene;
					north.position.set(180,0,0);
					north.rotation.y = - Math.PI / 2;
					for (let i=0; i <north.children.length; i++){
						north.children[i].material = nesMat;
					}
					obsts.add(north);
					
					gltfLoader.load("https://object-storage.tyo2.conoha.io/v1/nc_7d0030b822e246239683a325ebfb1974/iiiex/model/iiiEx_zips.gltf", (data) => {
						const east = data.scene;
						east.position.set(0,0,180);
						east.rotation.y = Math.PI;
						for (let i=0; i <east.children.length; i++){
							east.children[i].material = nesMat;
						}
						obsts.add(east);
						
						gltfLoader.load("https://object-storage.tyo2.conoha.io/v1/nc_7d0030b822e246239683a325ebfb1974/iiiex/model/iiiEx_youhatena.gltf", (data) => {
							const south = data.scene;
							south.position.set(-180,0,0);
							south.rotation.y = Math.PI / 2;
							for (let i=0; i <south.children.length; i++){
								south.children[i].material = nesMat;
							}
							obsts.add(south);
							
							const txLoader = new THREE.TextureLoader();
							txLoader.load("https://object-storage.tyo2.conoha.io/v1/nc_7d0030b822e246239683a325ebfb1974/iiiex/texture/zipper.png", function (tex) {
								const zipMat = new THREE.MeshBasicMaterial({transparent:true, side:THREE.DoubleSide}), zipGeo = new THREE.PlaneGeometry(1,1);
								const w = 25, radius = 120;
								for (let i=0; i<10; i++){
									zipMat.map = tex;
									zipMat.needsUpdate = true;
									const h = tex.image.height/(tex.image.width/w);
									const plane = new THREE.Mesh(zipGeo, zipMat);
									plane.position.set(radius*Math.sin(i*2*Math.PI/10),10,radius*Math.cos(i*2*Math.PI/10));
									plane.scale.set(w, h, 1);
									zips.add(plane);
								}
								scene.add(zips);
								
								let c = 0
								let image_index = ["816.jpg", "819.png", "817.png", "811.jpg", "815.jpg", "818.png", "812.png", "810.jpg", "820.png", "814.jpg"];
/*								for (let i=0; i<10; i++){
									txLoader.load("https://object-storage.tyo2.conoha.io/v1/nc_7d0030b822e246239683a325ebfb1974/iiiex/texture/" + image_index[i] , (tex) => {
										zipMat.map = tex;
										zipMat.needsUpdate = true;
										const h = tex.image.height/(tex.image.width/w);
										const plane = new THREE.Mesh(zipGeo, zipMat);
										plane.position.set(radius*Math.sin(i*2*Math.PI/10),25,radius*Math.cos(i*2*Math.PI/10));
										plane.rotation.y = i*2*Math.PI/10;
										plane.rotation.z = 0;
										plane.scale.set(w/5, h/5, 1);
										szips.add(plane);
										c++;
										if (c >= 10) init();
									});
								}*/
								init();
							});
						});
					});
				});
			});
		});
	});
	
	const init = () => {
		camera.position.set(-60, camY, 10);
		pitch = camY;
		
		const geo = new THREE.SphereGeometry(0.2);
		for (var i=0; i<9000; i++) {
			const sphere = new THREE.Mesh(geo, color[(i%3)+1].mat);
			let rot = Math.random() * Math.PI * 2;
			let range = Math.random() * dist.area;
			sphere.position.set(Math.cos(rot)*range, Math.random()*150, Math.sin(rot)*range);
			color[(i%3)+1].balls.add(sphere)
		}
		for (let i=0; i<color.length; i++) {
			scene.add(color[i].balls);
			color[i].balls.visible = false;
		}
		color[0].balls.visible = true;
		
		const light = new THREE.PointLight(0xFFFFFF, 1.4, 0, 0);
		light.position.set(0, 150, 0);
		scene.add(light);
		renderer.outputEncoding = THREE.GammaEncoding;

/*		const axes = new THREE.AxesHelper(100);
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
		color[0].obj.visible = true;*/
		
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
		
			$('.glass__buttons').modaal({
					content_source: '#glass__buttons'
			});
	
		$('#glass__buttons a').on('click',function(e){
					e.preventDefault();
					let src = $(this).children('img').attr('src');
					$('.glass__buttons').children('img').attr('src', src);
					$('.glass__buttons').modaal('close');
					let n = this.dataset.no;
					$("#screen").css({background: color[n].bg});
			for (let i=0; i<color.length; i++) {
				color[i].balls.visible = false;
			}
			color[n].balls.visible = true;
			$("#screen").stop(true).fadeOut(2000, function() {
				$("#screen").css({background: color[0].bg});
				$("#screen").show();
			});

			});
	
		$("#works .close").on("click", function(e) {
			e.preventDefault();
			$("#works").stop(true).fadeOut(200, function() {
				$(".works").hide();
			});
		});
	}
	
/*	const loadModel = (pass) => {
		gltfLoader.load(pass, (data) => {
			const model = data.scene;
			scene.add(model);
		});
	}*/
	
	const setMain = () => {
		W = window.innerWidth;
		H = window.innerHeight;
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
		
		const c = camera.position;
		if (Math.pow(c.x, 2) + Math.pow(c.z, 2) > Math.pow(dist.area, 2)) {
			const rot = Math.atan2(c.z, c.x);
			c.x = Math.cos(rot) * dist.area;
			c.z = Math.sin(rot) * dist.area;
		}
		
		for (let i=0; i<obsts.children.length; i++) {
			const o = obsts.children[i].position;
			if (Math.pow(o.x-c.x, 2) + Math.pow(o.z-c.z, 2) <= Math.pow(dist.obst, 2)) {
				const rot = Math.atan2(c.z-o.z, c.x-o.x);
				c.x = Math.cos(rot) * dist.obst + o.x;
				c.z = Math.sin(rot) * dist.obst + o.z;
			}
		}
		
		let hitNo = zips.children.length;
		for (let i=0; i<zips.children.length; i++) {
			zips.children[i].lookAt(c);
			const z = zips.children[i].position;
			if (Math.pow(z.x-c.x, 2) + Math.pow(z.y-c.y, 2) + Math.pow(z.z-c.z, 2) <= Math.pow(dist.zip, 2)) {
				hitNo = i;
				break;
			}
		}
		
		if (hitNo < zips.children.length) {
			if (hitFlag) {
				if ($("#works").css("display") == "none") {
					$("#works" + hitNo).show();
					$("#works").stop(true).fadeIn(400);
					hitFlag = false;
				}
			}
		} else {
			if (!hitFlag) {
				if ($("#works").css("opacity") > 0) {
					$("#works").stop(true).fadeOut(200, function() {
						$(".works").hide();
					});
				}
				hitFlag = true;
			}
		}
		
		$("#map_point").css({
			top: c.z * 1.5 + 300 - 5,
			left: c.x * 1.5 + 300 - 5
		});
		
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