define(['vue','jquery'],function(Vue,$) {
	var HISTORY = 'oppo-search-history';
	Vue.component('oppo-search-box',{
		props: {
			keywords: {
				type: String,
				default: ''
		    } 
	    },
		data: function() {
			return {
				focused: false,
				inputValue: '',
				input$Ele: '',
				storage: null,
				history: []
			};
	    },
		mounted: function() {
			this.input$Ele = $(this.$el).find('input');
		},
		created: function() {
			if(window.localStorage != null) {
				this.storage = window.localStorage;
				try {
					var content = JSON.parse(this.storage.getItem(HISTORY));
					if(content.length != null) {
						this.history = content;
					}
				} catch (err) {
					this.history = [];
				}
			}
		},
		computed: {
			his: function() {
				return this.history.slice(0,5);
			}				 
	    },
		methods: {
			addHistory: function(str) {
				if(str != '' && this.his.indexOf(str) < 0) {
					this.history.unshift(str);
				}
			},
			onSubmit: function(evt) {
				evt.preventDefault() ;
				this.focused = false;
				this.inputValue != this.keywords && this.change(this.inputValue);
				this.blurInput();
			},
			onHistoryClick: function(evt) {
				var tmp = evt.target.innerHTML;
				this.focused = false;
				this.inputValue = tmp;
				this.inputValue != this.keywords && this.change(this.inputValue);
				this.blurInput();
			},
			change: function(str) {
				this.$emit('change',{
					keywords: str 
				});		
				this.blurInput();
				this.addHistory(str);
			},
			onReset: function() {
				this.inputValue = '';
				this.change(this.inputValue);
				this.blurInput();
		    },
			onCancel: function() {
				this.inputValue = this.keywords;
				this.focused = false;
				this.blurInput();
			},
			blurInput: function() {
				this.input$Ele.blur();
		    }
		},
		watch: {
			"history.length": function() {
				this.storage.setItem(HISTORY,JSON.stringify(this.his));
			},
			keywords: function(newVal,oldVal) {
				this.inputValue = this.keywords;	
			}
	    },
		template: '<div class="oppo-search-box">\
						<div class="input-container" :class="{focused:focused}">\
							<form @submit="onSubmit">\
								<input type="search" v-model="inputValue" placeholder="请输入姓名、公司或关键词" @focus="focused = true">\
						    </form>\
							<button v-if="focused" class="cancel-btn" @click="onCancel">取消</button>\
							<a href="javascript:;" v-if="!focused && keywords!=\'\'" class="reset-btn" @click="onReset"></a>\
						</div>\
						<div v-if="focused" class="history">\
							<div class="title">搜索历史</div>\
							<ul>\
								<li v-for="item in his">\
									<a @click="onHistoryClick">{{item}}</a>\
								</li>\
							</ul>\
						</div>\
				  </div>'
	});
});
