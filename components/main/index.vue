<template>
	<transition name='main'>
		<div  class="lt-full zmiti-main-main-ui "  :class="{'show':show}" ref='page'>
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
				headimgs:[]
				
			}
		},
		components:{
		},
		
		methods:{
			createHeadimg(){
				

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
					var gap =12;
					
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


		}
	}
</script>