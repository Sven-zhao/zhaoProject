define(['vue','jquery','iscroll'], function(Vue,$) {
	Vue.component('iscroll-panel',{
		template: '<div class="iscroll-panel">\
						<div class="iscroll-panel-roller">\
							<slot>\
							</slot>\
						</div>\
					</div>',
		data: function() {
			return {
				isc: null
			};
		},
		mounted: function() {
			var self = this;
			if(this.isc) {
				this.isc.refresh();
			} else {
				this.isc = new IScroll($(this.$el).get(0),{
					disableMouse: true,
					disablePointer: true,
					preventDefaultException: {
						tagName: /^(A)$/
					}
				});
				this.isc.on('scrollEnd',function() {
					if(this.directionY > 0 && Math.abs(this.y) + $(self.$el).height() > $(self.$el).find('.iscroll-panel-roller').height() - 10) {
						self.$emit('end');
						console.log('load');
					} else {
						console.log('noload');
					}
				});
			}
		},
		methods: {
		    scrollYBy: function (length) {
				this.isc.scrollBy(0,length);
		    },
			refresh: function() {
				this.isc.refresh();
			} 
		}
	});
});
