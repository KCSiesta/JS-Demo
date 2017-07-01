/*使用块模式--立即执行的匿名函数*/
(function(){
       //所有声明的变量在构造函数内部，不会向windows添加任何属性
	/*
	构造函数的基本规范：
	             1、构造函数的第一个字母是大写的，与其他函数区分开来
	             2、调用构造函数的时候需要用new，不然会创建全局变量
	*/
           var Menubar = function(){
	           	this.el = document.querySelector('#sidebar ul'); //菜单项的DOM元素通过css的querySelctor查找得到
	           	this.state = 'allClosed';//初始状态时，allClosed，当打开某一个时，则为hasOpened
		this.el.addEventListener('click',function(e){
		           //7.1阻止冒泡事件向上传播，这样点击菜单项，只响应菜单项事件，无关sidebar
		           	e.stopPropagation();
		 });
		var self = this;
		var currentOpendMenuContent = null;
		          //7.2点击菜单项添加监听事件
		this.menuList = document.querySelectorAll('#sidebar ul > li');
		for( var i=0; i<this.menuList.length;i++){
                                   this.menuList[i].addEventListener('click',function(e){
                         //找到相应的菜单项的内容区域
	                     var menuContentEl = document.getElementById(e.currentTarget.id + '-content' );
	             /*
	             7.2-1：没有打开菜单项，打开响应的菜单项
	             7.2-2：有打开的菜单项，关闭该菜单项再打开响应的菜单项
	             */
	                    if(self.state === 'allClosed'){
	                    	console.log( '打开' + menuContentEl.id);
	                    	/*9.1菜单项打开的动画效果*/
	                    	//先设置菜单栏的高和左边的位置
	                    	menuContentEl.style.top = '0px';
	                    	menuContentEl.style.left = '-85px';
	                    	menuContentEl.classList.add('menuContent-move-right');
	                    	self.state = 'hasOpened';
	                         self.currentOpendMenuContent = menuContentEl;
	                    }else{
	                    	console.log('关闭' + self.currentOpendMenuContent.id);
	                    	/*9.2菜单栏关闭的动画效果*/
	                    	self.currentOpendMenuContent.className = 'nav-content';
	                    	self.currentOpendMenuContent.style.top = '0';
	                    	self.currentOpendMenuContent.style.left = '35px';
	                    	self.currentOpendMenuContent.classList.add('menuContent-move-left')
	                    	console.log( '打开' + menuContentEl.id);
	                    	menuContentEl.className = "nav-content"
	                           menuContentEl.style.top = '250px';
	                           menuContentEl.style.left = '35px';
	                           menuContentEl.classList.add('menuContent-move-up');
	                    	self.state = 'hasOpened';
	                           self.currentOpendMenuContent = menuContentEl;
	                    }

		              });
		}
		/*10、关闭按钮的样式*/
		this.menuContentList = document.querySelectorAll('.nav-content >div.nav-con-close');
		for(i=0;i<this.menuContentList.length;i++){
			this.menuContentList[i].addEventListener('click', function(e){
				//要关闭菜单内容项，所以要先得到菜单内容项
	                    	var menuContent = e.currentTarget.parentNode;
	                    	menuContent.className = "nav-content";
	                    	menuContent.style.top = '0';
	                    	menuContent.style.left = '35px';
	                    	menuContent.classList.add('menuContent-move-left');
	                    	that.state = 'allClosed';
			});
		}
	};
           /*1、使用构造函数创建sidebar对象 ，
	实例化该对象，向内提供属性eId、closeId*/
           var Sidebar = function(eId,closeBarId){
           /*2、定义对象的状态和属性和方法*/
             this.state = 'opened';          
           /*4、继续完成构造函数
                     4.1、完成对象的初始化,获取所需要的DOM元素
                     4.2、在构造函数的关闭按钮中增加事件响应函数
                              {借助Javascript的事件的冒泡传播机制:使用向上冒泡的机制来传播,在'sidebar的div上能监听closebar按钮的事件响应'}
                     */
                     this.el = document.getElementById(eId || 'sidebar'); //在参数中，需要传入默认的id以防不提供参数
                     this.closeBarEl = document.getElementById(closeBarId || 'closeBar');
                    /*4.3、在el元素上面调用事件函数*/
                    var self = this; 
                    /*
                    修改事件函数内的this指向回Sidebar对象有两种方法:
                          1、修改函数的上下文(比较复杂)
                          2、javascript的特性--闭包
                    this指向构造函数返回的对象，则指向下方 new sidebar返回的对象，
                    闭包原理，再在事件响应函数中调用该变量
                    */
           /*7、在sidebar构造函数中，需要将Menubar函数作为一个属性传进*/
                    this.menubar = new Menubar();
                    this.el.addEventListener("click",function(event){
                    	       if(event.target !== self.el){
                    	       	self.triggerSwitch(); //代表打开和关闭的统一函数名称
                    	       }
                    });

           }; 
           /*3、声明sidebar的两个行为
           对象的行为添加在构造函数的原型链上*/
           Sidebar.prototype.close = function(){
           	console.log('关闭sidebar');
           /*8、增加sidebar和关闭按钮的动画效果*/
             this.el.className = 'sidebar-move-left';
             this.closeBarEl.className = 'closeBar-move-right';
           	this.state = 'closed';
           };
           Sidebar.prototype.open =  function(){
           	console.log('打开sidebar');
           /* 9、增加sidebar打开和关闭按钮向左移动的动画效果*/
             //9.1需要先将sidebar的位置定位到上次关闭的位置
             this.el.style.left ='-120px';
             this.el.className = 'sidebar-move-right';
             this.closeBarEl.style.left = '160px';
             this.closeBarEl.className = 'closeBar-move-left';
           	this.state = 'opened';
           };
           /*5、增加triggerSwich()函数*/
           Sidebar.prototype.triggerSwitch = function(){
           	if(this.state === 'opened'){
           		this.close();
           	}else{
           		this.open();
           	}
           };
           /*6、验证构造函数的成果
                    6.1在close函数中console.log输出值来验证
                    6.2增加test单元测试，单元测试一直伴随代码存在*/
           var sidebar = new Sidebar();

})();
