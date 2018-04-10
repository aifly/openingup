<template>
	<transition name='main'>
		<div class="lt-full zmiti-main-main-ui "  :class="{'show':show}" ref='page'>
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
				pressed:undefined,
				stop:false

				
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
				this.camera = camera;
				var renderer = new THREE.WebGLRenderer();
				this.renderer = renderer;
				///renderer.setClearColor(new THREE.Color(0xffffff, 1.0));
				renderer.setSize(this.viewW,this.viewH);
				renderer.setPixelRatio(window.devicePixelRatio);
				scene.add(new THREE.AmbientLight('#ccc'));

				var skyBoxGeometry = new THREE.BoxGeometry( 250, 350, 400 );  
  
				var texture = new THREE.TextureLoader().load(imgs.bg);  
				  
				var skyBoxMaterial = new THREE.MeshBasicMaterial( { map:texture, side: THREE.DoubleSide } );  
				  
				var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );


				this.skyBox = skyBox;


				skyBox.visible = false;

				var planeGeo = new THREE.

				




				/*var loader = new THREE.FontLoader();
				loader.load('./assets/fonts/font.json',(font)=>{
					console.log("你是第"+this.pv+"位参与者")
					 var textGeometry = new THREE.TextGeometry("THREEJS",{
					 	font,
	                    "size" :2,
	                    "height" : 5,
	                    "bevelEnabled" : true,
	                    "curveSegments" : 30,
	                    bevelSize: 1,
	                    // material: 0,
	                    // extrudeMaterial: 1
	                })


	               var text = new THREE.Mesh(textGeometry,new THREE.MultiMaterial( [
	                    new THREE.MeshBasicMaterial( { color: 0xffffff, shading: THREE.FlatShading } ), // front
	                    new THREE.MeshBasicMaterial( { color: 0xffffff, shading: THREE.SmoothShading } ) // side
	                ] ))

	                textGeometry.computeBoundingBox();
	                var centerOffset = -0.5 * ( textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x );

	                text.position.x = centerOffset;
					text.position.y = 10;
					text.position.z = 0;
					text.rotation.x = 0;
					text.rotation.y = Math.PI ;

	                scene.add(text);
				});
*/

				
				this.fillText();
				
 

				scene.add(camera);
				scene.add(skyBox);  
				//scene.add(ball);
				this.$refs['page'].appendChild(renderer.domElement)
				

				var i = 0;
				var count = 0;
				var render = ()=>{
					if(count>=1){
						i--;
						this.pressed = false;
					}
					renderer.render(scene,camera);					
					!this.stop && requestAnimationFrame(render);
					if(this.pressed && this.headimgs.length){
						/*this.headimgs.forEach((headimg)=>{
							headimg.position.x += headimg.speedX;
							headimg.position.y += headimg.speedY;
							headimg.position.z += headimg.speedZ;
						})*/
					}

					if(this.pressed === false){
						
						
					}
					TWEEN.update();
					if(i>200){
						i = -1;
						count++;
					
						
					}else{
						i++;
					}
				}
				render();

				
			},
			fillText(){
				var canvas = document.createElement('canvas');
				canvas.style.position = 'absolute';
				canvas.style.top = 'auto';
				canvas.style.bottom = 0;
				canvas.style.left=0;
				canvas.width = this.viewW;
				canvas.height = this.viewH/4;
				canvas.style.zIndex = 100;
				canvas.style.border='1px solid red'

				var context = canvas.getContext('2d');
				this.$refs['page'].appendChild(canvas);
				context.textAlign = 'center';
				context.font="40px Georgia";
				context.fillStyle = '#fff';
				context.fillText("你是第"+this.pv+"位参与者",this.viewW/2,this.viewH/4/4);

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
					sprite.position.set((Math.random()*this.viewW-this.viewW/2)/k1,(Math.random()*this.viewH-this.viewH/2)/k1,0)
					var scale = Math.random()*(.6-.2)+.4-.3;
					sprite.scale.set(scale,scale,scale);
					group.add(sprite);
					if(i%2===0){
						sprite.speedX =0;
						sprite.speedY =0;
						sprite.speedZ = Math.random();
					}
					else{

						sprite.speedX = Math.random()*(Math.random()-.5>0?1:-1);
						sprite.speedY = Math.random()*(Math.random()-.5>0?1:-1);
						sprite.speedZ = Math.random()*6+.2;
						

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
			},
			animated(){//运动完成
			}
		},
		mounted(){

			this.initOffScreenCanvas();
			this.initWebgl();

			window.s = this;

			setTimeout(()=>{
				this.pressed = true;


				var num = 0;
				var num1 = 0;
				this.headimgs.forEach((object,i)=>{

					var duration = 2000;
					
					new TWEEN.Tween( object.scale )
						.to( { x:object.scale.x+.3, y:object.scale.y+.3, z:object.scale.z+.3 }, Math.random() * duration/2 + duration/2 )
						.easing( TWEEN.Easing.Exponential.InOut ).onComplete(()=>{
							num1+=1;
							if(num1>=this.defaultPosition.length){
									this.headimgs.forEach((object,i)=>{
										new TWEEN.Tween( object.position )
										.to( { x:Math.random()*30*(Math.random()-.5>0?1:-1), y:Math.random()*100*(Math.random()-.5>0?1:-1), z:Math.random()*1000*(Math.random()-.1>0?1:1) }, Math.random() * duration + duration )
										.easing( TWEEN.Easing.Exponential.InOut ).onComplete(()=>{
											num+=1;
											if(num>=this.defaultPosition.length){
												var s = this;
												var duration = 2000;

												num = 0;
												this.headimgs.forEach((object,i)=>{
													new TWEEN.Tween( object.position )
													.to( { x:this.defaultPosition[i][0], y:this.defaultPosition[i][1], z:this.defaultPosition[i][2] }, Math.random() * duration + duration )
													.easing( TWEEN.Easing.Exponential.InOut ).onComplete(()=>{
														num+=1;
														if(num>=this.defaultPosition.length){
															this.skyBox.visible = true;
															this.animated();
															this.stop = true;
														}

													}).start(); 
												})
											}

										}).start(); 
									});
							}

						}).start(); 


					
				})
 
			},1000)


		}
	}
</script>