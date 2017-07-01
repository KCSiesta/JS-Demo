// 构造一个幻灯片的类
;(function($){
	var Carousel = function(poster){
		var _this = this; 

		this.poster = poster;

		//获取ul
		this.posterItemList = this.poster.find('ul.poster-list');
		//获取左右btn
		this.posterNextBtn = this.poster.find('div.poster-next-btn');
		this.posterPrevBtn = this.poster.find('div.poster-prev-btn');
		//获取第一帧的li
		this.itemList = this.poster.find('ul.poster-list li');
		//解决偶数帧的问题,辅助第一章图到最后一张。个人觉得复制第几张都有问题，不能解决重复出现的现象，接下来我会模仿虎牙的解决方式来写一个插件。
		if(this.itemList.length%2 == 0){
			console.log(1);
			this.posterItemList.append(this.itemList.eq(2).clone());
			this.itemList = this.posterItemList.children();
		}
		this.firstItemList = this.itemList.first();
		this.lastItemList = this.itemList.last();
		//确定旋转是否结束
		this.rotateFlag = true;

		//console.log(poster.attr('data-setting'));
		//配置默认参数
		this.setting = {
	                      "width":1000,//幻灯片的总宽度
	                      "height":300,//幻灯片总高度
	                      "posterWidth":760,//幻灯片第一帧的宽度
	                      "posterHeight":250,//幻灯片第一帧的高度
	                      "speed":500,//转换速度
	                      "scale":0.9,//缩放程度
	                      "verticalAlign":"bottom",//显示方式
	                      "autoPlay":false,
	                      "delay":2000
	           };
	           $.extend(this.setting,this.getSetting());
	           //console.log(this.getSetting());
	           //执行配置函数
	           this.setSettingValue();
	           this.setPosterPos();
	           this.posterNextBtn.click(function(){
	           	if(_this.rotateFlag == true){
	           		_this.rotateFlag = false;
	           		_this.carouselRotate('left');
	           	}
	           });
	           this.posterPrevBtn.click(function(){
	           	if(_this.rotateFlag == true){
	           		_this.rotateFlag = false;
	           		_this.carouselRotate('right');
	           	}
	           });
	           if(this.setting.autoPlay){
	           	console.log(this.firstItemList.css('zIndex'));
	           	this.autoPlay();
	           	this.poster.hover(function(){
	           		clearInterval(_this.timer);
	           	},function(){
	           		_this.autoPlay();
	           	})
	           }
	};
	Carousel.prototype = {
		//自动播放函数
		autoPlay:function(){
			var _this = this;
			this.timer = setTimeout(function(){
				_this.posterNextBtn.click();
				_this.autoPlay();
			},_this.setting.delay)
		},
		//定义旋转函数
		carouselRotate:function(dir){
			var zIndexArry = [];
			var _this = this;
			if(dir == 'left'){
				this.itemList.each(function(i){
					var _self = $(this);

					var prev = _self.prev().get(0) ? _self.prev() : _this.lastItemList;//_self.prev().get(0)表示当前li的前一个节点是第一个元素吗
					var width = prev.width(),
					      height = prev.height(),
					      top = prev.css('top'),
					      left = prev.css('left'),
					      zIndex = prev.css('zIndex'),
					      opacity = prev.css('opacity');
					      zIndexArry.push(zIndex);

					           _self.animate({
					                      width:width,
					                      height:height,
					                      top:top,
					                      left:left,
					           	opacity:opacity
					           },_this.setting.speed,function(){
					           	  _this.rotateFlag = true;
					           });
				})
				this.itemList.each(function(i){
					$(this).css("zIndex",zIndexArry[i]);
				});
			}else if(dir == 'right'){
				this.itemList.each(function(){
					var _self = $(this);
					var next = _self.next().get(0) ? _self.next() : _this.firstItemList;
					var width = next.width(),
					      height = next.height(),
					      zIndex = next.css('zIndex'),
					      top = next.css('top'),
					      left = next.css('left'),
					      opacity = next.css('opacity');
					      zIndexArry.push(zIndex);
					_self.animate({
					           width:width,
					           height:height,
					           top:top,
					           left:left,
					           opacity:opacity
					},_this.setting.speed,function(){
					           	  _this.rotateFlag = true;
					});
					})
				this.itemList.each(function(i){
					$(this).css("zIndex",zIndexArry[i]);
				});
			}
		},
		//设置垂直对齐方式
		setVerticalAlign:function(height){
			var top = 0;
			var verticalAlign = this.setting.verticalAlign;
			if(verticalAlign === 'middle'){
				top = (this.setting.height - height) / 2;
			}else if(verticalAlign === 'bottom'){
				top =this.firstItemList[0].offsetTop + (this.setting.posterHeight - height);
			}else if(verticalAlign === 'top'){
				top = this.firstItemList[0].offsetTop;
			}else{
				top = (this.setting.height - height) / 2;
			}
			return top;
		},
		//设置剩余帧的位置关系
		setPosterPos:function(){
			var _this = this;
			//定义第一帧变量
			var sliceItem = this.itemList.slice(1);
			//定义左边、右边帧变量
			var rightItem = sliceItem.slice(0,sliceItem.length / 2);
			var leftItem = sliceItem.slice(sliceItem.length/2,sliceItem.length);
			//定义层级最大值
			var level = Math.floor(this.itemList.length / 2);
			//设置右边帧的位置关系
			var rightItemWidth = this.setting.posterWidth;
			var rightItemHeight = this.setting.posterHeight;
			var gap = ((this.setting.width - this.setting.posterWidth) / 2) / level;
			//第一帧的left
			var firstItemListLeft = (this.setting.width - this.setting.posterWidth) / 2;
			//右边第一帧的left(不包含gap，准确的说不是它的left)
			var rightFirstLeft = firstItemListLeft + rightItemWidth;

		           //设置右边帧的样式
		           rightItem.each(function(i){
		           	level--;
		           	var j = i+1;
		           	rightItemWidth *= _this.setting.scale;
		           	rightItemHeight *= _this.setting.scale;
		           	$(this).css({
		           		zIndex:level,
		           		width:rightItemWidth,
		           		height:rightItemHeight,
		           		left:rightFirstLeft + (++i) * gap - rightItemWidth,
		           		top:_this.setVerticalAlign(rightItemHeight),
		           		opacity:1 / (++j)
		           	});
		           });
		           //保存最右边的li的样式。
		           var leftItemWidth = rightItem.last().width();
		           var leftItemHeight = rightItem.last().height();
		           var opacityLoop = Math.ceil((this.itemList.length) / 2);
		           leftItem.each(function(i){
		           	$(this).css({
		           		zIndex:level++,
		           		width:leftItemWidth,
		           		height:leftItemHeight,
		           		left:(i++) * gap,
		           		top:_this.setVerticalAlign(leftItemHeight),
		           		opacity:1 / opacityLoop--
		           	})
		           	leftItemWidth /= _this.setting.scale;
		           	leftItemHeight /=_this.setting.scale;
		           })
		},//逗号不能忘。
		//设置基本配置参数来控制宽高
		setSettingValue:function(){
			this.poster.css({
				width:this.setting.width,
				height:this.setting.height
			});
			this.posterItemList.css({
				width:this.setting.width,
				height:this.setting.height
			});
			this.posterPrevBtn.css({
				width:(this.setting.width - this.setting.posterWidth) / 2,
				height:this.setting.posterHeight,
				zIndex:Math.ceil((this.itemList.length) / 2),
				top:(this.setting.height - this.setting.posterHeight) / 2
			});
			this.posterNextBtn.css({
				width:(this.setting.width - this.setting.posterWidth) / 2,
				height:this.setting.posterHeight,
				zIndex:Math.ceil((this.itemList.length) / 2),
				top:(this.setting.height - this.setting.posterHeight) / 2
			});
			this.firstItemList.css({
				zIndex:Math.ceil((this.itemList.length) / 2),
				width:this.setting.posterWidth,
				height:this.setting.posterHeight,
				//marginLeft:-(this.setting.posterWidth / 2),
				left:(this.setting.width - this.setting.posterWidth) / 2,
				top:(this.setting.height - this.setting.posterHeight) / 2
			})
		},
		//获取人工参数
		getSetting:function(){
			var setting = this.poster.attr('data-setting');
			//转换为JSON对象,转换为JSON对象必需有双引号;
			if(setting && setting != ''){
				return $.parseJSON(setting);
			}else{
				return {};
			}
		}
	};
	Carousel.init = function(posters){
		var _this = this;
		posters.each(function(i,elem){
			new _this($(this));
		});
	};
	window["Carousel"] = Carousel;
})(jQuery);