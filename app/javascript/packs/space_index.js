import * as THREE from 'three'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as iNoBounce from './inobounce.min';
import 'modaal';

(function() {
	let W, H;
	const scene = new THREE.Scene(), renderer = new THREE.WebGLRenderer({alpha: true, antialias: true}), camera = new THREE.PerspectiveCamera(30, W/H, 1, 3000), clock = new THREE.Clock();
	const zips = new THREE.Group(), obsts = new THREE.Group(), foots = new THREE.Group();
	const color = [{bg: "transparent", mat: new THREE.MeshBasicMaterial({color: 0xffffff}), balls: new THREE.Group()}, {bg: "rgba(255, 68, 68, 0.5)", mat: new THREE.MeshBasicMaterial({color: 0xff4444}), balls: new THREE.Group()}, {bg: "rgba(68, 255, 68, 0.5)", mat: new THREE.MeshBasicMaterial({color: 0x44ff44}), balls: new THREE.Group()}, {bg: "rgba(68, 68, 255, 0.5)", mat: new THREE.MeshBasicMaterial({color: 0x4444ff}), balls: new THREE.Group()}];
	let dirLR = 0, dirFB = 0, dirUD = 0, yaw = 0, pitch = 0, camY = 10, dragging = false;
	const spFB = 40, spLR = 0.3, spUD = 10, exLR = 1, len = 30;
	const LRs = new Array(), FBs = new Array(), UDs = new Array(), dirs = [false, false, false, false, false, false];
	const pmouse = new THREE.Vector3();
	const dist = {zip: 20, area: 203 - 10, obst: 20};
	const timer = {interval: 5000};
	let hitFlag = true;
	let id;
	const footstamp = new THREE.Mesh(new THREE.CircleGeometry(5), new THREE.MeshBasicMaterial({color: 0x666666}));
	const conohaUrl = "https://object-storage.tyo2.conoha.io/v1/nc_7d0030b822e246239683a325ebfb1974/iiiex/";
	const corsToken = "?X-Container-Meta-Access-Control-Allow-Origin=" + "https://"+ $(location).attr('host');
	console.log("corstoken :",corsToken)
	
	iNoBounce.enable();
	
	document.addEventListener('DOMContentLoaded', () => {
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setClearColor(0x000000);
		
		setMain();
		window.addEventListener("resize", setMain);
		window.addEventListener("orientationchange", setMain);
		document.querySelector("#world").appendChild(renderer.domElement);
		
		const gltfLoader = new GLTFLoader();
		gltfLoader.load(conohaUrl + "model/iiiEx_doom.gltf", (data) => {
			const gltf = data.scene;
			scene.add(gltf);
			
			gltfLoader.load(conohaUrl +  "model/iiiEx_landmark.gltf" + corsToken, (data) => {
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
				gltfLoader.load(conohaUrl + "model/iiiEx_who.gltf" + corsToken, (data) => {
					const north = data.scene;
					north.position.set(180,0,0);
					north.rotation.y = - Math.PI / 2;
					for (let i=0; i <north.children.length; i++){
						north.children[i].material = nesMat;
					}
					obsts.add(north);
					
					gltfLoader.load(conohaUrl + "model/iiiEx_zips.gltf" + corsToken, (data) => {
						const east = data.scene;
						east.position.set(0,0,180);
						east.rotation.y = Math.PI;
						for (let i=0; i <east.children.length; i++){
							east.children[i].material = nesMat;
						}
						obsts.add(east);
						
						gltfLoader.load(conohaUrl + "model/iiiEx_youhatena.gltf" + corsToken, (data) => {
							const south = data.scene;
							south.position.set(-180,0,0);
							south.rotation.y = Math.PI / 2;
							for (let i=0; i <south.children.length; i++){
								south.children[i].material = nesMat;
							}
							obsts.add(south);
							
							const txLoader = new THREE.TextureLoader();
							txLoader.setCrossOrigin('*');
							txLoader.load(conohaUrl + "texture/zipper.png" + corsToken, function (tex) {
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
								let textures = new Array(10);
								for (let i=0; i<10; i++){
									textures[i] = new THREE.TextureLoader();
									textures[i].setCrossOrigin('*');
									textures[i].load("https://object-storage.tyo2.conoha.io/v1/nc_7d0030b822e246239683a325ebfb1974/iiiex/texture/" + image_index[i] , (tex) => {
										const material = new THREE.MeshBasicMaterial({map:tex, transparent:true, side:THREE.DoubleSide});
										material.needsUpdate = true;
										const h = tex.image.height/(tex.image.width/w);
										const plane = new THREE.Mesh(zipGeo, material);
										plane.position.set(radius*Math.sin(i*2*Math.PI/10),25,radius*Math.cos(i*2*Math.PI/10));
										plane.scale.set(w/5, h/5, 1);
										zips.add(plane);
										c++;
										if (c >= 10) init();
									});
								}
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
		
		scene.add(foots);
		setPos();
		getPos();
		
		update();
		
		timer.post = setInterval(setPos, timer.interval);
		setTimeout(() => {
			timer.get = setInterval(getPos, timer.interval);
		}, timer.interval/2);
		
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
		
		$("#works .works_btn").on("click", function(e) {
			$("#works").stop(true).fadeOut(200, function() {
				$(".works").hide();
			});
		});
	}
	
	const setMain = () => {
		W = window.innerWidth;
		H = window.innerHeight;
		renderer.setSize(W, H);
		if (camera) {
			camera.aspect = W/H;
			camera.updateProjectionMatrix();
		}
	}
	
	const setPos = () => {
		$.ajax({
			type: "POST",
			url: "/userpositions.json",
			data: JSON.stringify({"userid": -1, "x": camera.position.x, "y": camera.position.y, "z":camera.position.z}),
			dataType: "json",
			contentType: "application/json",
			error: function(e) {
				console.log(e);
			}
		})
		.done((data, textStatus, jqXHR) => {
//			console.log("p ", data)
			id = data.user.id;
		});
	}
	
	const getPos = () => {
		$.getJSON("/userpositions.json", (data) => {
			while (foots.children.length > 0) {
				foots.remove(foots.children[0])
			}
			for (let i=data.length-1; i>=data.length-100; i--) {
				if (id != data[i].id) {
					const foot = footstamp.clone();
					foot.position.set(data[i].x, 0.1, data[i].z);
					foot.rotation.set(-Math.PI/2, 0, 0);
					foots.add(foot);
				}
			}
//			console.log("g ", data)
		});
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
			top: c.z * 1.5 + 300 - 5 - 40,
			left: c.x * 1.5 + 300 - 5 + 260
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