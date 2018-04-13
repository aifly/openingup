<template>
	<div v-tap='[entry]'  class="lt-full zmiti-index-main-ui " :style="{background:'url('+imgs.indexBg+') no-repeat center bottom',backgroundSize:'cover'}"  :class="{'show':show}">
		
		<transition name='index'>
			<div class="zmiti-index" v-if='!showIndexMask'>
				<div class="zmiti-title">
					<img @touchstart='imgStart' :src="imgs.title1">
				</div>
				<div class="zmiti-entry" >
					进入
				</div>
			</div>
		</transition>

		<!-- <transition name='mask'>
			<div class="zmiti-mask lt-full" v-if='showIndexMask' :style="{background:'url('+imgs.mask+') no-repeat center bottom',backgroundSize:'cover'}">
			
			</div>
		</transition> -->
		
		<transition name='video'>
			<section v-if='showIndexMask' class="zmiti-vidoe-page">
				<div class="zmiti-text">中共中央总书记、国家主席、中央军委主席习近平带领全国人民深化改革、扩大开放，为实现中华民族伟大复兴的中国梦接力奋斗。</div>
				<div class="zmiti-video-C" v-show='show' >
					<video  ref="video" id="video" controls x-webkit-airplay="true"  webkit-playsinline="true" playsinline="true" >
						<source src="./assets/video/1.mp4" type="video/mp4">
					</video>
				</div>
				<div class="zmiti-text zmiti-text1">回顾中国40年沧桑巨变</div>
			</section>
		</transition>
		
		<transition name='open'>
			<div v-if='showIndexMask' class="zmiti-open" v-tap='[open]'>
				开启接力
			</div>
		</transition>

	</div>
</template>

<script>
	import './index.css';
	import {imgs} from '../lib/assets.js';
	import zmitiUtil from '../lib/util';
	export default {
		props:['obserable'],
		name:'zmitiindex',
		data(){
			return{
				imgs,
				show:true,
				showIndexMask:false,
				showMasks:false,
			}
		},
		components:{
		},
		
		methods:{

			imgStart(e){
				e.preventDefault(); 
			},

			entry(){
				this.showIndexMask = true;
				setTimeout(()=>{
					this.$refs['video'].play()
				},200)
			},
			open(){
				this.show = false;
				setTimeout(()=>{
					this.$refs['video'].pause()
				},400)
				var {obserable} = this;
				obserable.trigger({
					type:'openWebGl'
				})
			}
			
		},
		mounted(){


			var {obserable} = this;

			obserable.on('toggleIndex',(data)=>{
				this.show = data.show;
			})

 


		}
	}
</script>