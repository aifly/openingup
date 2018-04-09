<template>
	<transition name='main'>
		<div @touchstart='pressed = true' @touchend='pressed = false' class="lt-full zmiti-main-main-ui "  :class="{'show':show}" ref='page'>
			<canvas :width='viewW' :height='viewH' ref='canvas'></canvas>
		</div>
	</transition>
</template>

<script>
	import './index.css';
	import {imgs,mainImgList} from '../lib/assets.js';
	import $ from 'jquery';
	import HeadImg from '../lib/headimg'
	export default {
		props:['obserable','pv','randomPv','nickname','headimgurl'],
		name:'zmitiindex',
		data(){
			return{
				imgs,
				showTeam:false,
				showQrcode:false,
				show:true,
				viewW:window.innerWidth,
				viewH:window.innerHeight,
				showMasks:false,
				dots:[],
				headimgs:[],
				defaultPosition:[],
				pressed:false

				
			}
		},
		components:{
		},
		
		methods:{

			initWebgl(){//
				var scene = new THREE.Scene();
				scene.background = new THREE.Color('#333');
				this.scene = scene;
				var camera = new THREE.PerspectiveCamera(45,this.viewW/this.viewH,1,1000);
				camera.position.z = 120;
				camera.position.y = 0;
				var renderer = new THREE.WebGLRenderer();
				///renderer.setClearColor(new THREE.Color(0xffffff, 1.0));
				renderer.setSize(this.viewW,this.viewH);
				renderer.setPixelRatio(window.devicePixelRatio);
				scene.add(new THREE.AmbientLight('#f00'));

			
				scene.add(camera);
				//scene.add(ball);
				this.$refs['page'].appendChild(renderer.domElement)

				var render = ()=>{
					renderer.render(scene,camera);					
					requestAnimationFrame(render);
					if(this.pressed && this.headimgs.length){
						this.headimgs.forEach((headimg)=>{
							headimg.position.x += headimg.speedX;
							headimg.position.y += headimg.speedY;
							headimg.position.z += headimg.speedZ;
						})
					}
					if(!this.pressed && this.headimgs.length){
						this.headimgs.forEach((headimg)=>{
							//headimg.position.z -= headimg.speed;

						})
					}
				}
				render();

				
			},
			loadingTexture(){
				var arr = [];

				[imgs.headimg1,imgs.headimg2,imgs.headimg3,imgs.headimg4,imgs.headimg5].forEach(item=>{
					var loader = new THREE.TextureLoader();
					var myloader = loader.load(item);
					var materials = new THREE.SpriteMaterial({
							map:myloader
						});

					arr.push(materials)
				});


				return arr;

				
			},
			createHeadimg(){

 
				var k = 20,
					k1 = 10;

				var materials = this.loadingTexture();
				
				var group = new THREE.Group();
				 
				this.dots.forEach((dot,i)=>{
					var sprite = new THREE.Sprite(materials[i%materials.length]);
					this.defaultPosition.push([-(this.viewW/2-dot.x)/k,(this.viewH/2-dot.y)/k,0])
					sprite.position.set((Math.random()*this.viewW-this.viewW/2)/k1,(Math.random()*this.viewH-this.viewH/2)/k1,(Math.random()*250-250/2))
					sprite.scale.set(Math.random()*(.6-.4)+.4,Math.random()*(.6-.4)+.4,Math.random()*(.6-.4)+.4);
					group.add(sprite);
					if(i%3===0){
						sprite.speedX =0;
						sprite.speedY =0;
						sprite.speedZ = 0.1;
					}
					else{

						sprite.speedX = Math.random()*(Math.random()-.5>0?1:-1);
						sprite.speedY = Math.random()*(Math.random()-.5>0?1:-1);
						sprite.speedZ = Math.random()*5+.2;
						

					}
					this.headimgs.push(sprite);
				});
				//group.rotation.x = Math.PI/180*-70;
				this.scene.add(group)

				

				return;
				

				var img1 = new Image();
				img1.src = imgs.headimg1;

				var img2 = new Image();
				img2.src = imgs.headimg2;


				var img3 = new Image();
				img3.src = imgs.headimg3;


				var img4 = new Image();
				img4.src = imgs.headimg4;


				var img5 = new Image();
				img5.src = imgs.headimg5;

				this.dots.map((dot,i)=>{
					var imgObj = img1;
					switch(i%5){
						case 0:
						imgObj = img2;
						break;
						case 1:
						imgObj = img3;
						break;
						case 2:
							imgObj = img4;
						break;
						case 3:
							imgObj = img5;
						break;
					}
					



					var headimg = new HeadImg({
						context:this.context,
						x:dot.x,
						y:dot.y,
						img:imgObj
					});



					this.headimgs.push(headimg)

				})
			},
			initOffScreenCanvas(){
				var canvas = document.createElement('canvas');
				var img = new Image();
				var myCanavs = this.$refs['canvas'];
				var myContext = myCanavs.getContext('2d');
				this.context = myContext;
				var s = this;
				img.onload = function(){
					canvas.width = this.width;
					canvas.height = this.height;
					var context = canvas.getContext('2d');
					context.drawImage(this,0,0);

					var imgData =  context.getImageData(0,0,this.width,this.height);
					var gap = 16
					
					for(var x =0;x<imgData.width;x+=gap){
						for(var y =0 ; y < imgData.height;y+=gap){

							var a = (x + y * imgData.width)*4;
							if(imgData.data[a+3]>128){
								s.dots.push({
									x,
									y,
									r:imgData.data[a],
									g:imgData.data[a+1],
									b:imgData.data[a+2],
									a:imgData.data[a+3]
								})
							}
						}
					}

					s.createHeadimg();

					//myContext.putImageData(imgData,30,100);
				}
				img.src = imgs.title;
			}
		},
		mounted(){

			this.initOffScreenCanvas();
			this.initWebgl();


		}
	}
</script>