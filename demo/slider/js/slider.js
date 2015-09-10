/**
 * author: xiaoT
 * data: 2015-09-10
 * version: 0.0.1
 */
/**
 * 轮播图
 * @param  {object} obj 自定义参数
 * @param  {obj.container} banner 容器选择器
 * @param  {obj.item} 自定义 具体需要滚动的dom
 * @param  {obj.className} 自定义 index 索引教标切换的class
 * @param  {obj.index} 自定义 索引选择器
 * @param  {obj.auto} 是否自动播放 默认不自动播放
 * @param  {obj.delay} 自动播放 的延迟时间
 * @return {underfined}     [description]
 * 使用方式
 * _this.silder({
		'container': '#js_banner',
		'item': '.banner_list',
		'index': '.banner_index a',
		'className': 'on',
		'auto': true,
		'direction': 'horizontal',
		'prevBtn': '.prev',
		'nextBtn': '.next'
	});
 */
(function(){
	var _this = this;
	
	_this.silder = function(obj){
		var _this = this,
			container = $(obj.container) || $('#slider'),
			item = container.find(obj.item) || container.find('.slider_content'),
			index = container.find(obj.index) || container.find('.index'),
			className = obj.className || 'active',
			direction = obj.direction || 'vertical',
			prevBtn = container.find('.prev'),
			nextBtn = container.find('.next'),
			auto = obj.auto || false,
			delay = obj.delay || 3000,
			containerH = container.height(),
			containerW = container.width(),
			timer = null,
			i = 0,
			animateOpt = {};
		// console.log(containerH)
		// 初始化 slider
		// index 第一个选中状态
		// item 重置到第一个
		if(direction === 'horizontal') {
			item.css({
				'marginLeft': -containerW*i + 'px'
			});
		} else if(direction === 'vertical') {
			item.css({
				'marginTop': -containerH*i + 'px'
			});
		}
		index.removeClass(className);
		index.eq(i).addClass(className);
		// 如果是水平滚动
		// 初始化 列表的整体宽度
		if(direction === 'horizontal') {
			item.css({
				'width': index.length*containerW + 'px'
			})
		}

		// 绑定事件 底部索引角标
		index.hover(function(){
			i = index.index($(this));
			anim(i);
			if(timer) clearTimeout(timer);
		},function(){
		})

		// 上一页 下一页的事件
		// 移入的时候 清除滚动定时器
		// 移出 继续滚动
		// 点击切换下一张 或者 上一张
		if(prevBtn) {
			// 鼠标移入 移出事件
			prevBtn.hover(function(){
				if(timer) clearTimeout(timer);
			},function(){
				if(auto){
					timer = setTimeout(function(){
						autoAnim(i);
					}, delay)
				}
			})
			prevBtn.click(function() {
				if(i < 1){
					i = index.length;
				}
				i--;
				anim(i);
			})
		}
		if(nextBtn) {
			nextBtn.hover(function(){
				if(timer) clearTimeout(timer);
			},function(){
				if(auto){
					timer = setTimeout(function(){
						autoAnim(i);
					}, delay)
				}
			})
			// 单击事件
			nextBtn.click(function() {
				if(i >= index.length-1){
					i = -1;
				}
				i++;
				anim(i);
			})
		}

		// 鼠标移入slider 清除 定时器
		// 停止自动播放
		item.hover(function(){
			if(timer) clearTimeout(timer);
		},function(){
			if(auto){
				timer = setTimeout(function(){
					autoAnim(i);
				}, delay)
			}
		})
		// 自动播放
		// 默认是不自动播放的
		if(auto){

			if(timer) clearTimeout(timer);
			timer = setTimeout(function(){
				autoAnim(i);
			}, delay)
		}
		// 自动播放
		function autoAnim(){
			if(i >= index.length-1){
				i = -1;
			}
			i++;
			anim(i);
			timer = setTimeout(function(){
				autoAnim(i)
			}, delay)
		}
		// 主要动画
		function anim(i){
			index.removeClass(className);
			index.eq(i).addClass(className);
			// 动画滚动的方向
			// 默认是垂直方向滚动
			if(direction === 'horizontal') {
				animateOpt = {
					'marginLeft': -containerW*i + 'px'
				}
			} else if(direction === 'vertical') {
				animateOpt = {
					'marginTop': -containerH*i + 'px'
				}
			}
			item.stop(true).animate(animateOpt, 600)
		}
	}
})($, window)