<template>
	<transition name='main'>
		<div class="lt-full zmiti-main-main-ui "  :class="{'show':show}" ref='page'>
			<canvas :width='viewW' :height='viewH' ref='canvas'></canvas>
			<img :src="rendererImg" v-if='rendererImg' />
			<div class="zmiti-operator" v-if='isAnimated && !isPreview'>
				<div class='zmiti-pv'>你是第{{pv}}位参与者</div>
				<div v-if='overView' v-tap='[seeHead]' class="zmiti-myheadimg">查看我的头像的位置</div>
				<div v-if='!overView'  v-tap='[backToImg]' class="zmiti-myheadimg">回看全景</div>
				<div v-tap='[preview]' class="zmiti-preview">预览分享图片</div>
			</div>

			<div class="lt-full zmiti-main-info" :class='{"show":isPreview}' ref='zmiti-cache-page'>
				<h1></h1>
				<section>
					<div class="zmiti-code">
						勋章编号：{{pv}}
					</div>
					<div class="zmiti-head">
						<div><img v-if='imgs.myhead' :src="imgs.myhead"></div>
						<div>
							我是 {{nickname||'新华社网友'}} 纪念是为了更好地出发，不忘初心，继续前行！
						</div>
					</div>
					<div class="zmiti-qrcode">
						<img :src="imgs.qrcode">
					</div>
					<div class="zmiti-text">
						<div v-for="t in text">{{t}}</div>
					</div>

					<div class="zmiti-logo" >
						<img :src="imgs.logo">
					</div>
				</section>

			</div>

		</div>
	</transition>
</template>

<script>
	import './index.css';
	import {imgs,mainImgList} from '../lib/assets.js';
	import $ from 'jquery'; 
	import zmitiUtil from '../lib/util';
	import '../lib/html2canvas'
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
				isPreview:false,
				viewH:window.innerHeight,
				showMasks:false,
				dots:[],
				headimgs:[],
				defaultPosition:[],
				pressed:undefined,
				stop:false,
				rendererImg:'',
				isAnimated:false,
				overView:true,
				cameraZ:90,
				text:[
					'2018年，我们将迎来改革开放40周年',
					'改革开放是当代中国发展的必由之路',
					'是实现中国梦的必由之路',
					'我们要以庆祝改革开放40周年为契机'
				]
				
			}
		},
		components:{
		},
		
		methods:{

			preview(){//预览分享图片


				var duration = 3000;
				duration =  Math.random() * duration/2 + duration/2;
				this.isPreview = true;
				new TWEEN.Tween( this.camera.position )
					.to( { y:-12,z:this.camera.position.z+30},duration)
					.easing( TWEEN.Easing.Exponential.InOut ).onComplete(()=>{
						//console.log(this.renderer.domElement.toDataURL())

						var canvasMap = this.fillText();
					}).start();
			},

			backToImg(){
				var duration = 3000;
				duration =  Math.random() * duration/2 + duration/2 
				
				new TWEEN.Tween( this.camera.position )
						.to( { z:this.cameraZ,x:0,y:0},duration)
						.easing( TWEEN.Easing.Exponential.InOut ).onUpdate(()=>{
							
						}).start();
				var scale = Math.random()*(.6-.2)+.4-.3;
				new TWEEN.Tween( this.myHead.scale )
					.to( {x:scale,y:scale},duration )
					.easing( TWEEN.Easing.Exponential.InOut ).onComplete(()=>{
						this.point.visible = true;
						this.overView = true;
					}).start();
			},

			seeHead(){
				var duration = 3000;


				duration =  Math.random() * duration/2 + duration/2 
				
				new TWEEN.Tween( this.camera.position )
						.to( { z:10,x:this.point.position.x,y:this.point.position.y},duration)
						.easing( TWEEN.Easing.Exponential.InOut ).onComplete(()=>{
							this.overView = false;
						}).start();
				this.point.visible = false;
				new TWEEN.Tween( this.myHead.scale )
					.to( {x:3,y:3},duration )
					.easing( TWEEN.Easing.Exponential.InOut ).onUpdate(()=>{
						
					}).start();
			},

			initWebgl(){//
				var scene = new THREE.Scene();
				scene.background = new THREE.Color('#333');
				this.scene = scene;
				var camera = new THREE.PerspectiveCamera(45,this.viewW/this.viewH,1,1000);
				camera.position.z = this.cameraZ;
				camera.position.y = 0;
				this.camera = camera;
				var renderer = new THREE.WebGLRenderer();
				this.renderer = renderer;
				///renderer.setClearColor(new THREE.Color(0xffffff, 1.0));
				renderer.setSize(this.viewW,this.viewH);
				renderer.setPixelRatio(window.devicePixelRatio);
				scene.add(new THREE.AmbientLight('#f90'));

				var skyBoxGeometry = new THREE.BoxGeometry( 250, 350, 400 );  
  
				var texture = new THREE.TextureLoader().load(imgs.bg);
				 texture.needsUpdate = true;
				  
				var skyBoxMaterial = new THREE.MeshBasicMaterial( { map:texture,side: THREE.DoubleSide  } ); 


				var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
				skyBox.position.y=20;
				this.skyBox = skyBox;

				//skyBox.visible = false;

				

				


				/*var infoPlane = new THREE.Mesh(new THREE.PlaneGeometry(50,50,20),new THREE.MeshLambertMaterial({
					map:new THREE.Texture(canvasMap),transparent:true}))
				infoPlane.position.y = -13;
				infoPlane.position.z = 13;*/




				
				scene.add(camera);
				scene.add(skyBox);  
				//scene.add(infoPlane);
				//scene.add(ball);
				this.$refs['page'].appendChild(renderer.domElement)

				

				var i = 1;
				var count = 0;
				var sp = .05;
				var render = ()=>{
					if(count>=1){
						
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

					if(this.point && this.isAnimated){
						i+=4;
						i%=150;
						//console.log(Math.sin(Math.PI/180*i),i)
						this.point.scale.x =  Math.sin(Math.PI/180*i);
						this.point.scale.y =  Math.sin(Math.PI/180*i);
						


					}
					 
					TWEEN.update();
					 
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
				canvas.height = this.viewH;
				var height =  this.viewH*.62
				canvas.style.zIndex = 100;
				var context = canvas.getContext('2d');
				this.$refs['page'].appendChild(canvas);

				//this.rendererImg = this.renderer.domElement.toDataURL();
				//this.renderer.domElement.style.opacity =0;
				this.html2img(context);

				/*

					context.restore();

					context.translate(0,this.viewH*.38)
					this.$refs['page'].appendChild(canvas);
					context.textAlign = 'center';
					context.font="30px Georgia";
					context.fillStyle = '#696b72';
					context.fillText('勋章编号：' + this.pv,this.viewW/2,50);

					context.strokeStyle = 'rgba(105,107,114,.4)';
					context.beginPath();
					context.lineWidth = 1;
					context.moveTo(50,80);
					context.lineTo(this.viewW-50,80);
					context.stroke();


					var img = new Image();
					img.onload = ()=>{
						context.drawImage(img,50,120,100,100);	
					}
					img.src = imgs.myhead;
					img.crossOrigin = 'anonymous'
					
					context.textAlign = 'start';
					context.font="24px Arial";
					this.drawText(context,'我是 '+(this.nickname||"新华社网友") + ' 纪念是为了更好地出发，不忘初心，继续前行 ！',200,130,this.viewW - 300);


					var img1 = new Image();
					img1.onload = ()=>{

						context.drawImage(img1,(this.viewW-200)/2,height/3,200,200)
					}
					img1.src = imgs.qrcode;


					context.textAlign = 'center';
					context.fillStyle = '#fff';
					this.text.forEach((t,i)=>{
						context.fillText(t,this.viewW/2,height/1.5 + i * 36)
					})



					var img3 = new Image();
					img3.onload = ()=>{
						context.drawImage(img3,50,height*.85,60,60)
						
					}
					img3.src = imgs.logo;


					setTimeout(()=>{
						console.log(canvas.toDataURL())
					},100);


					//context.fillText("你是第"+this.pv+"位参与者",this.viewW/2,this.viewH/4*3);
					//this.isAnimated = true;
				*/
				return canvas;

			},
			drawText(context,t,x,y,w){
			    var chr = t.split("");
			    var temp = "";              
			    var row = [];

			    context.textBaseline = "middle";

			    for(var a = 0; a < chr.length; a++){
			        if( context.measureText(temp).width < w ){
			            ;
			        }
			        else{
			            row.push(temp);
			            temp = "";
			        }
			        temp += chr[a];
			    }

			    row.push(temp);
			    for(var b = 0; b < row.length; b++){
			        context.fillText(row[b],x,y+(b+1)*30);
			    }
			},
			html2img(context){
				var s = this;

				var {obserable} = this;



				//document.title = '开始截图....'


				setTimeout(()=>{
					//this.showLoading = true;
					var ref = 'zmiti-cache-page';
					var dom = this.$refs[ref];
					html2canvas(dom,{
						useCORS: true,
						onrendered: function(canvas) {
							document.body.appendChild(canvas);
							var src = canvas.toDataURL();
							context.drawImage(canvas,0,0,s.viewW,s.viewH)
							console.log(src);

							return;
					        var src = canvas.toDataURL();
					        s.createImg = src;
		             		s.showBtns = true;
		             		s.showLoading = false;
		             		console.log(src)
		             		return;

		             		obserable.trigger({
								type:'playVoice',
								data:"photo"
							})

		             		setTimeout(()=>{
		             			//document.title=s.viewH+','+(s.$refs['createimgs'].offsetHeight*1.2)
								s.$refs['createimgs'].style.WebkitTransform = 'scale('+s.viewH/(s.$refs['createimgs'].offsetHeight*1.2)+')'

								///s.deleteImg(s.headimg);

								
							},100);



							$.ajax({
					          url:window.protocol+'//'+window.server+'.zmiti.com/v2/share/base64_image/',
					          type: 'post',
					          data: {
					            setcontents: src,
					            setwidth: dom.clientWidth,
					            setheight:dom.clientHeight
					          },
					          success: function(data) {
					            if (data.getret === 0) {
					            	//s.deleteImg(dt.img);
						            var src = data.getimageurl;
									var url = window.location.href.split('#')[0];
					            	console.log(src);

									url = zmitiUtil.changeURLPar(url,'src',src);
									url = zmitiUtil.changeURLPar(url,'num',s.pv);
									zmitiUtil.wxConfig('我是第'+s.pv+'位为雄安过周岁者',window.desc,url);
									
								       
					            }

					          }
					        })

							/*zmitiUtil.wxConfig(window.zmitiConfig.shareTitle.replace(/{{totalPv}}/ig, s.totalpv),
							window.zmitiConfig.shareDesc.replace(/{{periods}}/ig, s.periodsUpper[window.zmitiConfig.periods - 1]).replace(/{{pv}}/ig, s.randomPv));*/
					      },
					      width: dom.clientWidth,
					      height:dom.clientHeight
					})
				},100)
			},
			loadingTexture2(){
				var arr = [];
				var imgList = [imgs.headimg5,imgs.headimg1,imgs.headimg2,imgs.headimg3,imgs.headimg4];
				for(var i=0;i<imgList.length;i++){
					var canvas = document.createElement('canvas');
					var img = new Image();
					img.crossOrigin = '*';
					img.src = imgList[i];
					canvas.width = 300;
					canvas.height = 300;
					canvas.className = 'myCanavs';
					//this.$refs['page'].appendChild(canvas);
					var context = canvas.getContext('2d');
					var texture = new THREE.Texture(canvas);
					console.log(texture)
					texture.needsUpdate = true;
					context.drawImage(img,0,0,300,300);
					var materials = new THREE.SpriteMaterial({
							map:texture
						});

					arr.push(materials)
				}
				imgList.forEach(item=>{
			/*		var loader = new THREE.TextureLoader();
					var myloader = loader.load(item);*/

					
				});

				this.arr = arr;

				return arr;

				
			},
		 
			loadingTexture(){
				var arr = [];
				var imgList = [imgs.headimg5,imgs.headimg1,imgs.headimg2,imgs.headimg3,imgs.headimg4];
				imgList.forEach(item=>{
					var loader = new THREE.TextureLoader();
					var myloader = loader.load(item);
					var materials = new THREE.SpriteMaterial({
							map:myloader
						});

					arr.push(materials)
				});

				this.arr = arr;

				return arr;

				
			},
			createHeadimg(){

 
				var k = 20,
					k1 = 10;

				var materials =this.arr;
				
				var group = new THREE.Group();
				var index = (this.dots.length*Math.random())|0
				this.dots.forEach((dot,i)=>{
					if(index ===i ){

						var loader = new THREE.TextureLoader();
						var myloader = loader.load(this.headimgurl || imgs.myhead);
						var material = new THREE.SpriteMaterial({
								map:myloader
							});
						var sprite = new THREE.Sprite(material);
						this.defaultPosition.push([-(this.viewW/2-dot.x)/k,(this.viewH/2-dot.y)/k,2])
						this.defaultPosition.push([-(this.viewW/2-dot.x)/k,(this.viewH/2-dot.y)/k,1])
						sprite.position.set((Math.random()*this.viewW-this.viewW/2)/k1,(Math.random()*this.viewH-this.viewH/2)/k1,0)
						var scale = Math.random()*(.6-.2)+.4-.3;
						//scale =2;
						sprite.scale.set(scale,scale,scale);

						var pointLoader = new THREE.TextureLoader();
						var pointTexture = pointLoader.load(imgs.point);
						var plane = new THREE.Mesh(new THREE.CircleGeometry(2,20,20),new THREE.MeshLambertMaterial({map:pointTexture,transparent:true}))
						plane.position.x = sprite.position.x;
						plane.position.y= sprite.position.y;
						plane.position.z = sprite.position.z+1;
						this.myHead = sprite;

						group.add(sprite);
						group.add(plane);
						plane.scale.x = plane.scale.y = 0;
						this.point = plane;
						this.point.visible = false;
						
						this.headimgs.push(plane);
					}else{
						var sprite = new THREE.Sprite(materials[i%materials.length]);
						this.defaultPosition.push([-(this.viewW/2-dot.x)/k,(this.viewH/2-dot.y)/k,0])
						sprite.position.set((Math.random()*this.viewW-this.viewW/2)/k1,(Math.random()*this.viewH-this.viewH/2)/k1,0)
						var scale = Math.random()*(.3-.2);
						sprite.scale.set(scale,scale,scale);
						
						group.add(sprite);
					}




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
					var gap = 12
					
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
				 
				this.skyBox.material.needsUpdate = true;


				

				
			}
		},
		mounted(){

			this.loadingTexture();


			this.initOffScreenCanvas();
			this.initWebgl();
			//this.fillText();

			window.s = this;

			setTimeout(()=>{
				this.pressed = true;


				var num = 0;
				var num1 = 0;
			
				this.headimgs.forEach((object,i)=>{

					var duration = 2000;

					var easing = TWEEN.Easing.Exponential.InOut;
					
					new TWEEN.Tween( object.scale )
						.to( { x:object.scale.x+.3, y:object.scale.y+.3, z:object.scale.z+.3 }, Math.random() * duration + duration ).delay(Math.random()*800)
						.easing( easing ).onComplete(()=>{
							num1+=1;
							if(num1>=this.defaultPosition.length){
								
									this.headimgs.forEach((object,i)=>{
										new TWEEN.Tween( object.position )
										.to( { x:Math.random()*10*(Math.random()-.5>0?1:-1), y:Math.random()*10*(Math.random()-.5>0?1:-1), z:Math.random()*1000*(Math.random()-.1>0?1:1) }, Math.random() * duration + duration ).delay(Math.random()*300)
										.easing( easing ).onComplete(()=>{
											num+=1;
											if(num>=this.defaultPosition.length){
												var s = this;
												var duration = 2000;

												num = 0;
												this.headimgs.forEach((object,i)=>{
													new TWEEN.Tween( object.position )
													.to( { x:this.defaultPosition[i][0], y:this.defaultPosition[i][1], z:this.defaultPosition[i][2] }, Math.random() * duration + duration ).delay(Math.random()*300)
													.easing( easing ).onComplete(()=>{
														num+=1;
														if(num>=this.defaultPosition.length){
															this.skyBox.visible = true;
															this.animated();
															this.isAnimated = true;
															this.point.visible = true;
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