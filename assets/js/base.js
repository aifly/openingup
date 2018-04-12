var imgs = {
	play: './assets/images/play.png',
	logo: './assets/images/logo.png',
	bg: './assets/images/bg2.jpg',
	bg1: './assets/images/bg1.jpg',
	indexBg: './assets/images/index-bg.jpg',

	arrow: './assets/images/arrow.png',
	point: './assets/images/point.png',
	//mask: './assets/images/mask.png',
	qrcode: './assets/images/qrcode2.png',
	
	title:'./assets/images/title.png',
	title1:'./assets/images/title1-1.png',
	
	myhead:'./assets/images/logo.png'
  
}


var headImgs = [
	
]
for(i =1 ;i<=100;i++){
	headImgs.push('./assets/images/'+i+'.jpg');
}

var arr = [];

arr = arr.concat(headImgs);
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
		src: './assets/music/bg2.mp3',
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