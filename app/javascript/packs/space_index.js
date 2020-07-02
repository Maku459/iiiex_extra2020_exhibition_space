import * as THREE from 'three'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as iNoBounce from './inobounce.min';
import 'modaal';

(function() {
	const queries  = window.location.search.slice(1).split("&");
	let referer = 10;
	for (let i=0; i<queries.length; i++) {
		if (queries[i].split("=")[0] == "space") {
			referer = queries[i].split("=")[1];
			break;
		}
	}
	
	let W, H;
	const scene = new THREE.Scene(), renderer = new THREE.WebGLRenderer({alpha: true, antialias: true}), camera = new THREE.PerspectiveCamera(30, W/H, 1, 3000), clock = new THREE.Clock();
	const zips = new THREE.Group(), zipsArray = new Array(), obsts = new THREE.Group(), foots = new THREE.Group(), birds = new THREE.Group(), fish = new THREE.Group(), snakes = new THREE.Group();
	const color = [{bg: "transparent", mat: new THREE.MeshBasicMaterial({color: 0xffffff}), balls: new THREE.Group()}, {bg: "rgba(255, 68, 68, 0.5)", mat: new THREE.MeshBasicMaterial({color: 0xff4444}), balls: new THREE.Group()}, {bg: "rgba(68, 255, 68, 0.5)", mat: new THREE.MeshBasicMaterial({color: 0x44ff44}), balls: new THREE.Group()}, {bg: "rgba(68, 68, 255, 0.5)", mat: new THREE.MeshBasicMaterial({color: 0x4444ff}), balls: new THREE.Group()}];
	let dirLR = 0, dirFB = 0, dirUD = 0, yaw = 0, pitch = 0, camY = 10, dragging = false;
	const spFB = 40, spLR = 0.3, spUD = 10, exLR = 1, len = 30;
	const LRs = new Array(), FBs = new Array(), UDs = new Array(), dirs = [false, false, false, false, false, false];
	const pmouse = new THREE.Vector3();
	const dist = {zip: 20, area: 203 - 10, obst: 20};
	const timer = {interval: 5000};
	let hitFlag = true;
	let id = 0;
	const footstamp = new THREE.Mesh();
	const mixers = new Array();
	const animal = 5, snakePos = {center: new THREE.Vector3(0, 1, 0), range: new THREE.Vector3(15, 0, 15)}, fishPos = {center: new THREE.Vector3(0, 1, 0), range: new THREE.Vector3(100, 0, 100)}, birdPos = {center: new THREE.Vector3(0, 0, 0), range: new THREE.Vector3(60, 0, 60)};

	const conohaUrl = "https://object-storage.tyo2.conoha.io/v1/nc_7d0030b822e246239683a325ebfb1974/iiiex/";
	const corsToken = "?Origin=" + "http://"+ $(location).attr('host');
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
							
							let c = 0;
							for (let i=0; i<5; i++) {
								gltfLoader.load(conohaUrl + "model/iiiEx_snake.gltf", (data) => {
									const model = new THREE.Object3D();
									model.add(data.scene);
									const anims = data.animations;
									const mixer = new THREE.AnimationMixer(model);
									const rot = Math.random()*Math.PI*2;
									const pos = new THREE.Vector3(Math.cos(rot) * snakePos.range.x, 0, Math.sin(rot) * snakePos.range.z);
									model.position.copy(pos.add(snakePos.center));
									for (let j=0; j<anims.length; j++) {
										mixer.clipAction(anims[j]).play();
									}
									mixer.clipAction(anims[0]).time += 0.5*i;
									mixer.time += 0.5*i;
									mixers.push(mixer);
									snakes.add(model);
									snakes.children[snakes.children.length-1].rot = rot;
									
									c++
									if (c >= 5) {
										c = 0;
										for (let i=0; i<15; i++) {
											gltfLoader.load(conohaUrl + "model/iiiEx_fish.gltf", (data) => {
												const model = new THREE.Object3D();
												model.add(data.scene);
												const anims = data.animations;
												const mixer = new THREE.AnimationMixer(model);
												const rot = Math.random()*Math.PI*2;
												const pos = new THREE.Vector3(Math.cos(rot) * fishPos.range.x, 0, Math.sin(rot) * fishPos.range.z);
												model.position.copy(pos.add(fishPos.center));
												for (let j=0; j<anims.length; j++) {
													mixer.clipAction(anims[j]).play();
												}
												mixer.clipAction(anims[0]).time += 0.5*i;
												mixer.time += 0.5*i;
												mixers.push(mixer);
												fish.add(model);
												fish.children[fish.children.length-1].rot = rot;
												
												c++
												if (c >= 15) {
													c = 0;
													for (let i=0; i<10; i++) {
														gltfLoader.load(conohaUrl + "model/iiiEx_bird.gltf", (data) => {
															const model = new THREE.Object3D();
															model.add(data.scene);
															const anims = data.animations;
															const mixer = new THREE.AnimationMixer(model);
															const rot = Math.random()*Math.PI*2;
															const pos = new THREE.Vector3(Math.cos(rot) * birdPos.range.x, 30, Math.sin(rot) * birdPos.range.z);
															model.position.copy(pos.add(birdPos.center));
															for (let j=0; j<anims.length; j++) {
																mixer.clipAction(anims[j]).play();
															}
															mixer.clipAction(anims[0]).time += 0.5*i;
															mixer.time += 0.5*i;
															mixers.push(mixer);
															birds.add(model);
															birds.children[birds.children.length-1].rot = rot;
															
															c++
															if (c >= 10) {
																c = 0;
																const txLoader = new THREE.TextureLoader();
																txLoader.setCrossOrigin('*');
																txLoader.load(conohaUrl + "texture/footprint.png" + corsToken, function (tex) {
																	const geo = new THREE.PlaneGeometry(3, 3);
																	const mat = new THREE.MeshBasicMaterial({map: tex, transparent:true, side:THREE.DoubleSide});
																	mat.needsUpdate = true;
																	footstamp.geometry = geo;
																	footstamp.material = mat;
																	
																	txLoader.load(conohaUrl + "texture/zipper.png" + corsToken, function (tex) {
																		const zipMat = new THREE.MeshBasicMaterial({transparent:true, side:THREE.DoubleSide}), zipGeo = new THREE.PlaneGeometry(1,1);
																		const w = 25, radius = 120;
																		for (let i=0; i<10; i++){
																			zipMat.map = tex;
																			zipMat.needsUpdate = true;
																			const h = tex.image.height/(tex.image.width/w);
																			const plane = new THREE.Mesh(zipGeo, zipMat);
																			const rot = i*2*Math.PI/10;
																			plane.position.set(radius*Math.sin(rot), 10, radius*Math.cos(rot));
																			plane.scale.set(w, h, 1);
																			zips.add(plane);
																		}
																		
																		let image_index = ["816.jpg", "819.png", "817.png", "811.jpg", "815.jpg", "818.png", "812.png", "810.jpg", "820.png", "814.jpg"];
																		let textures = new Array(10);
																		for (let i=0; i<10; i++){
																			textures[i] = new THREE.TextureLoader();
																			textures[i].setCrossOrigin('*');
																			textures[i].load(conohaUrl + "texture/" + image_index[i] , (tex) => {
																				const material = new THREE.MeshBasicMaterial({map:tex, transparent:true, side:THREE.DoubleSide});
																				material.needsUpdate = true;
																				const h = tex.image.height/(tex.image.width/w);
																				const plane = new THREE.Mesh(zipGeo, material);
																				const rot = i*2*Math.PI/10;
																				plane.position.set(radius*Math.sin(rot), 25, radius*Math.cos(rot));
																				plane.scale.set(w/5, h/5, 1);
																				zips.add(plane);
																				c++;
																				if (c >= 10) init();
																			});
																		}
																	});
																});
															}
														});
													}
												}
											});
										}
									}
								});
							}
						});
					});
				});
			});
		});
	});
	
	const init = () => {
		if (referer < 10) {
			const radius = 60;
			const rot = referer*2*Math.PI/10;
			yaw = -referer*2*Math.PI/10 + Math.PI/2;
			camera.position.set(radius*Math.sin(rot), camY, radius*Math.cos(rot));
		} else {
			camera.position.set(-60, camY, 10);
		}
		pitch = camY;
		
		const geo = new THREE.SphereGeometry(0.2);
		for (var i=0; i<3000; i++) {
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
		for (let i=0; i<zips.children.length; i++) {
			zipsArray.push(zips.children[i]);
		}
		
		const light = new THREE.PointLight(0xFFFFFF, 1.4, 0, 0);
		light.position.set(0, 150, 0);
		scene.add(light);
		renderer.outputEncoding = THREE.GammaEncoding;
		
		scene.add(zips);
		scene.add(obsts);
		scene.add(foots);
		color[1].balls.add(snakes);
		color[2].balls.add(birds);
		color[3].balls.add(fish);
		getPos();
		setPos();
		
		update();
		
//		timer.post = setInterval(setPos, timer.interval);
		setTimeout(() => {
//			timer.get = setInterval(getPos, timer.interval);
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
		
		$("#world canvas").on("click", function(e) {
			const rect = e.target.getBoundingClientRect();
			let mouse = {x: 0, y: 0};
			mouse.x = e.clientX - rect.left;
			mouse.y = e.clientY - rect.top;
			mouse.x =  (mouse.x / W) * 2 - 1;
			mouse.y = -(mouse.y / H) * 2 + 1;
			var vector = new THREE.Vector3(mouse.x, mouse.y, 1);
			vector.unproject(camera);
			var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
			var obj = ray.intersectObjects(zipsArray);
			console.log(obj);
			if (obj.length > 0){
				$("#alert").show();
				$("#works").stop(true).fadeIn(400);
			}
		});
		
		$('.glass__buttons').modaal({
			content_source: '#glass__buttons'
		});
		
		$('#glass__buttons a').on('click',function(e){
			e.preventDefault();
			gtag('event', 'glass_button');
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
//			console.log("post ", data)
		});
	}
	
	const getPos = () => {
		$.getJSON("/userpositions.json", (data) => {
			const max = 100;
			for (let i=0; i<data.length; i++) {
				if (data[i].id > id) {
					id = data[i].id;
					const foot = footstamp.clone();
					foot.position.set(data[i].x, 0.1, data[i].z);
					foot.rotation.set(-Math.PI/2, 0, Math.random()*Math.PI*2);
					foots.add(foot);
				}
			}
			while (foots.children.length > max) {
				foots.remove(foots.children[0])
			}
//			console.log("get ", data)
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
	
	const update = () =>  {
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
			top: -c.x * 214/203 + 555/2,
			left: c.z * 214/203 + 940/2
		});
		
		for (let i=0; i<snakes.children.length; i++) {
			const a = snakes.children[i];
			const prev = new THREE.Vector3(a.position.x, 0, a.position.z);
			a.rot += -delta/20;
			const pos = new THREE.Vector3(Math.cos(a.rot) * snakePos.range.x, Math.sin(a.rot*10)/2+0.5, Math.sin(a.rot) * snakePos.range.z);
			a.position.copy(pos.add(snakePos.center));
			a.lookAt(snakePos.center);
		}
		for (let i=0; i<fish.children.length; i++) {
			const a = fish.children[i];
			const prev = new THREE.Vector3(a.position.x, 0, a.position.z);
			a.rot += -delta/20;
			const pos = new THREE.Vector3(Math.cos(a.rot) * fishPos.range.x, Math.sin(a.rot*20)*2, Math.sin(a.rot) * fishPos.range.z);
			a.position.copy(pos.add(fishPos.center));
			a.lookAt(fishPos.center);
			a.children[0].rotation.z = Math.sin(a.rot*20+Math.PI/4)/3;
		}
		for (let i=0; i<birds.children.length; i++) {
			const a = birds.children[i];
			const prev = new THREE.Vector3(a.position.x, 0, a.position.z);
			a.rot += -delta/5;
			const pos = new THREE.Vector3(Math.cos(a.rot) * birdPos.range.x, Math.sin(a.rot*10)*2 + 30, Math.sin(a.rot) * birdPos.range.z);
			a.position.copy(pos.add(birdPos.center));
			a.lookAt(birdPos.center);
		}
		for (let i=0; i<mixers.length; i++) {
			mixers[i].update(delta);
		}
		
		dirFB = 0;
		dirLR = 0;
		dirUD = 0;
		renderer.render(scene, camera);
		requestAnimationFrame(update);
	}
})();