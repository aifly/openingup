var imgs = {
	play: './assets/images/play.png',
	logo: './assets/images/logo.png',

	arrow: './assets/images/arrow.png',
	
	title:'./assets/images/title.png',
	headimg1:'./assets/images/1.jpg',
	headimg2:'./assets/images/2.jpg',
	headimg3:'./assets/images/3.png',
	headimg4:'./assets/images/4.jpg',
	headimg5:'./assets/images/5.jpg',
  
}


var arr = [];
for (var attr in imgs) {
	arr.push(imgs[attr]);
}

var xionganDesc ='';// '雄安新区雄安新区（Xiongan New Area）[1]  位于中国河北省保定市境内，地处北京、天津、保定腹地，规划范围涵盖河北省雄县、容城、安新。 '

var mainImgList = [
	{
		url:imgs.img1,
		type:'rect'
	},{
		url:imgs.img2,
		type:'circle'
	},{
		url:imgs.img3,
		type:'circle'
	}
];

var musics = {
	music: {
		src: './assets/music/bg.mp3',
		autoplay: false,
		name: 'bg',
		loop: true
	},
	photo:{
		src:'./assets/music/photo.mp3',
		autoplay:false,
		name:"photo",
		loop:false
	}
}