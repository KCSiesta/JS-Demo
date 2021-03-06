;(function($){
 
    var LightBox = function(settings){
           var self = this;
           
           this.settings = {
                 speed : 500
           };
           $.extend(this.settings,settings||{});
           //创建遮罩和弹出框
           this.popupMask = $('<div id="G-lightbox-mask">');
           this.popupWin = $('<div id="G-lightbox-popup">');

           //保存body
           this.bodyNode = $(document.body);
           //直接渲染剩余的DOM到Body中
           this.readerDOM();

           this.picViewArea=this.popupWin.find("div.lightbox-pic-view");//图片预览区域
           this.popupPic = this.popupWin.find("img.lightbox-image");//弹出图片
           this.picCaptionArea = this.popupWin.find("div.lightbox-pic-caption");//图片描述区域
           this.preBtn = this.popupWin.find("span.lightbox-prev-btn");
           this.nextBtn = this.popupWin.find("span.lightbox-next-btn");

           this.captionText = this.popupWin.find("div.lightbox-caption-area");//图片描述
           this.currentIndex = this.popupWin.find("span.lightbox-of-index") ;//图片当前索引
           this.closeBtn = this.popupWin.find("span.lightbox-close-btn");


           //准备开发事件委托，获取组数据
           this.groupName = null;
           //存储同一组的数据
           this.groupData=[];
           this.bodyNode.delegate(".js-lightbox,*[data-role=lightbox]","click",function(e){
                //阻止事件冒泡
                 e.stopPropagation();     
                 //获取数据
                 // alert($(this).attr("data-group"));
                 var currentGroupName = $(this).attr("data-group");
                 if(currentGroupName != self.groupName){
                          self.groupName = currentGroupName;
                          //根据当前组名获取同一组数据
                          self.getGroup();
                 }

                 //初始化弹框
                 self.initPopup($(this));

           });
             //关闭弹出
       	this.popupMask.click(function() {
       		$(this).fadeOut();//关闭自身
       		self.popupWin.fadeOut();//关闭弹出框
       		this.clear=false;
       	});
       	this.closeBtn.click(function(){
                           self.popupMask.fadeOut();
                           self.popupWin.fadeOut();
       	});
       	//优化代码
       	this.flag = true;
       	
       	//绑定上下切换按钮和事件
       	//绑定hover，移上与移出都需要执行一次函数
       	this.nextBtn.hover(function(){
	       	if(!$(this).hasClass("disabled")&&self.groupData.length-1){
	                  $(this).addClass("lightbox-next-btn-show");
	              };
	},function(){
	       	if(!$(this).hasClass("disabled")&&self.groupData.length-1){
	       	     $(this).removeClass("lightbox-next-btn-show");
	       	};
	}).click(function(e){

	             if(!$(this).hasClass("disabled")&&self.flag){
	                   self.flag = false;
	                  e.stopPropagation();
                               self.goto("next");
       		};
	       	});

       	this.preBtn.hover(function(){
       		if(!$(this).hasClass("disabled")&&self.groupData.length>1){
                             $(this).addClass("lightbox-prev-btn-show");
       		};
       	},function(){
       		if(!$(this).hasClass("disabled")&&self.groupData.length>1){
       	                $(this).removeClass("lightbox-prev-btn-show");
      		};
       	}).click(function(e){
       		if(!$(this).hasClass("disabled")&&self.flag){
       			self.flag = false;
       		        e.stopPropagation();
       			self.goto("prev");
       		};
       	});
          
          //绑定窗口调整事件
          var timer = null;
          this.clear = false;
          $(window).resize(function(){
          	         if(self.clear){
                    window.clearTimeout(timer);
          	         timer = window.setTimeout(function(){
          	         	 self.loadPicSize(self.groupData[self.index].src);
          	         },500);
          	     };
          }).keyup(function(e) {
   	
             var keyValue = e.which;
         
                // console.log(keyValue);
                if(keyValue == 38 || keyValue ==37 ){
                      self.preBtn.click();
                }else if(keyValue == 39 || keyValue==40){
                	self.nextBtn.click();
              
            };
          });

    };
    LightBox.prototype={
       goto: function(dir){
             
             if(dir === "next"){

             this.index++;
             if(this.index>= this.groupData.length-1){
                this.nextBtn.addClass("disabled").removeClass("lightbox-next-btn-show");          
             };
             if(this.index!=0){
             	this.preBtn.removeClass("disabled");
             };

             var src = this.groupData[this.index].src;
                      this.loadPicSize(src);

             }else if(dir === "prev"){
                      this.index--;

             if(this.index<=0){
                       this.preBtn.addClass("disabled").removeClass("lightbox-prev-btn-show");
                      };  
             if(this.index!=this.groupData.length-1){
             	this.nextBtn.removeClass("disabled");
             };

             var src = this.groupData[this.index].src;
                       this.loadPicSize(src);
          
             };
       },
       loadPicSize:function(sourceSrc){
             var self = this;
             //加载图片之前，需要把图片的宽高设为auto
             self.popupPic.css({
                   width:"auto",
                   htight:"auto"
             }).hide();
           this.picCaptionArea.hide();
       	this.preLoadImg(sourceSrc,function(){
       	       // alert("ok");
       	       self.popupPic.attr("src",sourceSrc);
       	       var picWidth = self.popupPic.width();
       	             picHeight = self.popupPic.height();
                     
                    self.changePic(picWidth,picHeight);
       	});            
        },
        changePic: function(width,height){
              
              var self = this,
                    winWidth=$(window).width(),
                    winHeight=$(window).height();

              //如果图片的宽高大于浏览器视口的宽高比例，看下是否溢出
              var scale = Math.min(winWidth/(width+10),winHeight/(height+10),1);

                    width=width*scale;
                    height=height*scale;

              this.picViewArea.animate({
              	width: width-10,
              	height: height-10
                         },self.settings.speed);

              this.popupWin.animate({
              	width:width,
              	height:height,
              	marginLeft:-(width/2),
              	top:(winHeight-height)/2
	              },self.settings.speed,function(){
	                     self.popupPic.css({
	                     	                  width:width-10,
	                     	                  height:height-10
			                     }).fadeIn();
	                     self.picCaptionArea.fadeIn();
	                     self.flag = true;
	                     this.clear = true;
	              });
              //设置描述文字和当前索引
              this.captionText.text(this.groupData[this.index].caption);
              this.currentIndex.text("当前索引:"+(this.index+1)+"of"+this.groupData.length);

        },

        preLoadImg:function(src,callback){
        	var img = new Image();
        	if(!!window.ActiveXObject){
        		img.onreadystatechange=function(){
        			if(this.readystatechange == "complete"){
        				callback();
        			};
        		};
        	}else{
        		img.onload=function(){
        			callback();
        		};
        	};
        	img.src = src;
        },

        showMaskAndPopup: function(sourceSrc,currentId){
             
             var self = this;
        	//先隐藏图片和文字描述区域
        	this.popupPic.hide();
        	this.picCaptionArea.hide();
             //最先弹出遮罩层
             this.popupMask.fadeIn();
        	//先弹出白色背景图片
        	//白色背景图片的宽和高均为窗口宽高的一半
            var  winWidth = $(window).width(),
        	       winHeight = $(window).height();

            var viewHeight = winHeight/2+10;
         	this.popupWin.fadeIn();
        	//白色背景图片居中定位
        	this.popupWin.css({
        		width:winWidth/2+10,
        		height:winHeight/2+10,
        		marginLeft: -(winWidth/2+10)/2,//包括图片边框的5px
        		top:-viewHeight//先将其隐藏，再通过动画效果从上落下
        	            }).animate({
        	            	               top:(winHeight-viewHeight)/2
        	            },self.settings.speed,function(){
        	            	           //加载原图图片，通过图片的尺寸
                                    self.loadPicSize(sourceSrc);
        	            });

        	//获取当前currentId获取在当前组别的索引
        	this.index = this.getIndexOf(currentId);
             // console.log(this.index);
             var groupDataLength = this.groupData.length;
             if(groupDataLength>1){

                        if(this.index === 0){
                        	this.preBtn.addClass('disabled');
                        	this.nextBtn.removeClass('disabled');
                        }else if(this.index === groupDataLength-1){
                        	this.preBtn.removeClass('disabled');
                        	this.nextBtn.addClass('disabled');
                        }else{
                        	this.nextBtn.removeClass('disabled');
                        	this.preBtn.removeClass('disabled');
                        }
            };


        },

        getIndexOf : function(currentId){

        	var index = 0;
              
             $(this.groupData).each(function(i){
             	index = i;
             	if(this.id === currentId){
                                  return false;
             	};

             });

                     return index;
        },
  
        //初始弹框，当前点击的图片，我们要知道该图的原址和id
        initPopup : function(currentObj){
              
              var self  = this,
                   sourceSrc = currentObj.attr("data-source"),
                   currentId    = currentObj.attr("data-id");

                    //独立处理显示遮罩层和弹出层的函数,传入当前的参数
                   this.showMaskAndPopup(sourceSrc,currentId);
    	},

         getGroup : function(){
            
              var self = this;
              //根据当前的组别的名称获取页面中所有相同的组别的对象
              var groupList = this.bodyNode.find("*[data-group="+this.groupName+"]");
               
               //清空数组数据
               self.groupData.length = 0;
               
               groupList.each(function(){
                      
                      self.groupData.push({
                      	               src:$(this).attr("data-source"),
                      	               id:$(this).attr("data-id"),
                      	               caption:$(this).attr("data-caption")
	                      });
               });


          },

         readerDOM:function(){
             var strDom = '<div class="lightbox-pic-view">'+
    		'<span class="lightbox-btn lightbox-prev-btn"></span>'+
    		'<img  class="lightbox-image" src="img/1.jpg" >'+
    		'<span class="lightbox-btn lightbox-next-btn "></span>'+
    	'</div>'+
    	'<div class="lightbox-pic-caption">'+
    		'<div class="lightbox-caption-area">'+
    			'<p class="lightbox-pic-desc"></p>'+
    			'<span class="lightbox-of-index">00</span>'+
    		'</div>'+
     			'<span class="lightbox-close-btn"></span>'+   		
    	'</div>';

    	//将strDOM插入到popWin中
    	this.popupWin.html(strDom);
    	//把遮罩和弹出框插入到body中
    	//append()插入，需要注意先后顺序
    	this.bodyNode.append(this.popupMask,this.popupWin);

    	}

    };

    window["LightBox"] = LightBox;

})(jQuery);