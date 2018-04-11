var imgs = {
	play: './assets/images/play.png',
	logo: './assets/images/logo.png',
	bg: './assets/images/bg.jpg',
	bg1: './assets/images/bg1.jpg',
	indexBg: './assets/images/index-bg.jpg',

	arrow: './assets/images/arrow.png',
	point: './assets/images/point.png',
	mask: './assets/images/mask.png',
	qrcode: './assets/images/qrcode.png',
	
	title:'./assets/images/title.png',
	title1:'./assets/images/title1.png',
	headimg5:'http://api.zmiti.com/zmiti_ele/wx/20180410/7068977170.jpeg',
	headimg2:'./assets/images/1.jpg',//http://wx.qlogo.cn/mmopen/ajNVdqHZLLBdRPD56QKxojEyLE4HvhKFYFkLa2zPib2VJW3hlkmBvjL4I9f9yurwMNbDkUTibKMiaVX7zjN8R9QUbccqo7T9jJZ4Nic8cI7c99M/0',
	headimg3:'http://api.zmiti.com/zmiti_ele/wx/20180410/7068977170.jpeg',
	headimg4:'./assets/images/4.jpg',
	headimg1:'./assets/images/5.jpg',
	myhead:'http://api.zmiti.com/zmiti_ele/user/xuchang/material/20161210/29bf8fc29f42bd723e2feb83f6465f9f.jpg'
  
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