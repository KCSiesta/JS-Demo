
          	       	// 1、数据的定义，在实际生产的环境中是直接由后台给出
                          	var data =[
             	                               { img:1, h1:'Creative', h2:'DUET'},
             	                               { img:2, h1:'Friendly', h2:'DEVTL'},
             	                               { img:3, h1:'Tranquilent', h2:'COMPATRIOT'},
             	                               { img:4, h1:'Insecure', h2:'HUSSLER'},
             	                               { img:5, h1:'Loving', h2:'REBEL'},
             	                               { img:6, h1:'Passionate', h2:'SEEKER'},
             	                               { img:7, h1:'Crazy', h2:'FRIEND'}
                          	];
                     //2.通用函数,获取DOM元素
                               var g = function(id){
                                     if( id.substr(0,1) == '.'){ 
                                     	return document.getElementsByClassName(id.substr(1));
                                     }
                                     return document.getElementById(id);
                               }
                    
                    //3.添加幻灯片的操作（所有的幻灯片&&对应的按钮）
                               function addSliders(n){
                                       //3.1获取模板
                                       var tpl_main = g('template_main').innerHTML.replace(/^\s*/,' ')
                                                              .replace(/\s*$/,' ');
                                       var tpl_ctrl    = g('template_ctrl').innerHTML.replace(/^\s*/,' ')
                                                              .replace(/\s*$/,' ');
                                       //利用正则表达式(/^\s*/,' ')、(/\s*$/,' ')清除DOM元素里的首尾空格

			//3.2定义最终输出的HTML的变量
                                       var out_main = [ ];
                                       var out_ctrl = [ ];
			//3.3遍历所有数据，构建最终输出的HTML

			for( i in data ){
                                           var _html_main = tpl_main.replace(/{{index}}/g, data[i].img)
                                                                                    .replace(/{{h2}}/g, data[i].h1)
                                                                                    .replace(/{{h3}}/g, data[i].h2)
                                                                                    .replace(/{{css}}/g,[' ','main-i_rigth'][i%2]);
                                                                               //在构建最终的HTML模板时，随机增加一个main-i_right的样式
                                            var _html_ctrl = tpl_ctrl.replace(/{{index}}/g, data[i].img);

                                           out_main.push(_html_main);
                                           out_ctrl.push(_html_ctrl);

				}
			//3.4把HTML回写到DOM元素里面
                                            g('template_main').innerHTML = out_main.join(' ');
                                            g('template_ctrl').innerHTML = out_ctrl.join(' ');
                                
                                //8、增加#main_background
                                           g('template_main').innerHTML += tpl_main.replace(/{{index}}/g, '{{index}}')
                                                                                    .replace(/{{h2}}/g, data[i].h1)
                                                                                    .replace(/{{h3}}/g, data[i].h2);

                                            g('main_{{index}}').id = 'main_background';
                               }

                              // 6、幻灯片切换操作
                               function switchSlider(n){
			//6.1获得将要展现的幻灯片的DOM元素
                                              var main = g('main_'+n);
                                              var ctrl = g('ctrl_'+n);
			//6.2获得所有幻灯片&&对应的控制按钮
                                              var clear_main = g('.main-i');  //注意！！.main-i前面无空格
                                              var clear_ctrl = g('.ctrl-i');
			//6.3清除它们的active样式
			        for( i=0;i<clear_ctrl.length;i++){
			        	clear_main[i].className = clear_main[i].className.replace(' main-i_active',' ');
			        	clear_ctrl[i].className = clear_ctrl[i].className.replace(' ctrl-i_active',' ');

			        } 
			//6.3添加当前按钮和幻灯片的附件样式
			       main.className += ' main-i_active';
			       ctrl.className += ' ctrl-i_active';
			//8.1切换时，复制上一张幻灯片到#main_background中
			        //需要设置setTimeout，才能使背景图晚出现
			setTimeout(function(){
                                       g('main_background').innerHTML = main.innerHTML;
			},1000);

                               }

                            //7、动态调整图片的margin-top，使图片垂直居中
                                function movePictures(){
                                	   var pictures = g('.picture');
                                	   for( i=0;i<pictures.length;i++){
                                	   	pictures[i].style.marginTop = ( -1 * pictures[i].clientHeight/2) + 'px';
                                	   }

                                }

                            //5、幻灯片要在DOM加载完成后操作

                               window.onload=function(){
	                               	addSliders();
	                               	switchSlider(2);
	                               	setTimeout(function(){
	                               		movePictures()
	                               	},100);
                               }
