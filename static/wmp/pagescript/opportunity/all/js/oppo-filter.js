define(['vue','jquery','wajax','common/jquery-plugins/iscroll'],function(Vue,$,ajax){
	var listSource = {
		categorys: {
		},
		categorys_sort: [],
		industrys: {
			level_1: {
			},
			level_2: {
			}
		},
		addresses: {
		},
		addresses_sort: []
	};

	Vue.component('oppo-filter', {
		props: {
			state: {
				type: Object
			}
		},
		data: function() {
			return {
				source: listSource,
				viewState: {
					category: '',
					industry_lv1: '',
					industry_lv2: '',
					address: ''
				},
				activePanel: null,
				tabText: {
					category: '机会类别',
					industry: '行业',
					address: '地区'
				},
				scroller: {
					category: null,
					address: null,
					industry_lv1: null,
					industry_lv2: null
				}
			};
	    },
		methods: {
			sync: function() {
				$.extend(true,this.viewState,this.state);
				this.$nextTick(function() {
					this.updateTabText();
				})
			},
			handlePanelItemClick: function(evt) {
				 var $target = $(evt.target),
				 		 evtObj = {},
				 		 dataValue = $target.attr('data-value'),
				 		 dataType = $target.attr('data-type');
				 if($target.is('.list-viewport a')) {
					 		this.viewState[dataType] = dataValue;
							if(dataType != 'industry_lv1') {
								if(dataType == 'industry_lv2') {
									evtObj['industry_lv1'] = this.viewState.industry_lv1;
									evtObj['industry_lv2'] = this.viewState.industry_lv2;
								} else {
									evtObj[dataType] = dataValue;
								}
								this.$nextTick(function() {
									this.updateTabText();
								})
								this.$emit('selected',evtObj);
							}
				 }
			},
			updateViewState: function() {
				$.extend(true,this.viewState,this.state);
			},
			updateTabText: function() {
				this.activePanel = null;
				var status = this.state;
				if(status.category == '') {
					this.tabText.category = '机会类别';
				} else {
					this.tabText.category = this.source.categorys[status.category];
				}

				if(status.industry_lv2 == '') {
					this.tabText.industry = '行业'
				}
				else if(status.industry_lv2 == status.industry_lv1) {
					this.tabText.industry = this.source.industrys.level_1[status.industry_lv1];
				} else {
					this.tabText.industry = this.source.industrys.level_2[status.industry_lv1][status.industry_lv2];
				}

				if(status.address == '') {
					this.tabText.address= '地区';
				} else {
					this.tabText.address= this.source.addresses[status.address];
					if(this.tabText.address == '' || this.tabText.address == undefined ) {
						this.tabText.address= '地区';
					}
				}

			},
			onTabClick: function(evt) {
				var panelType = $(evt.currentTarget).attr('data-panel-type');
				if(panelType == this.activePanel) {
					this.activePanel = null;
				} else {
					this.activePanel = panelType;
					if (panelType == 'industry') {
						this.initScroller('industry_lv1');
						this.initScroller('industry_lv2');
					} else {
						this.initScroller(panelType);
					}
				}
			},
			initScroller: function(panelType) {
				if(panelType == null) {
					return;
				}
				var self = this;
				self.scroller[panelType] && self.scroller[panelType].destroy();
				Vue.nextTick(function() {
					self.scroller[panelType] = new IScroll($(self.$el).find('.panels [data-panel-type="' + panelType + '"]').get(0),{
						disableMouse: true,
						disablePointer: true,
						preventDefaultException: {
							tagName: /^(A)$/
						}
					});
				});
		    }
		},
		mounted: function() {
			var self = this;
			ajax({
				url: 'getFilter',
				type: 'post',
				success: function(obj) {
					$.extend(true,self.source,obj.data);
					Vue.nextTick(function() {
						self.$emit('source');
					});
				}
			});
		},
		watch: {
			'state.industry_lv1': function(newVal) {
					this.viewState.industry_lv1 = newVal;
			},
			'state.address': 'sync',
			'state.category': 'sync',
			'state.industry_lv1': 'sync',
			'state.industry_lv2': 'sync',
			'state.address': function() {
				this.updateTabText();
			},
			"viewState.industry_lv1": function() {
				this.activePanel != null && this.initScroller('industry_lv2');
			}
		},
		template: '<div class="oppo-filters">\
						<div class="bg" v-if="activePanel!=null" @click="activePanel=null"></div>\
						<div class="tabs">\
							<a class="tab" href="javascript:;" data-panel-type="category" :class="{active:activePanel == \'category\',sel:state.category.length>0 }" @touchstart="onTabClick">\
								<span>{{tabText.category}}</span>\
							</a>\
							<a class="tab" href="javascript:;" data-panel-type="industry" :class="{active:activePanel == \'industry\',sel:state.industry_lv1.length>0 }" @touchstart="onTabClick">\
								<span>{{tabText.industry}}</span>\
							</a>\
							<a class="tab" href="javascript:;" :class="{active:activePanel == \'address\',sel:state.address.length>0 }" data-panel-type="address" @touchstart="onTabClick">\
								<span>{{tabText.address}}</span>\
							</a>\
						</div>\
						<div class="panels" @click="handlePanelItemClick">\
							<div class="panel single" v-if="activePanel == \'category\'">\
								<div class="list-viewport" data-panel-type="category">\
									<ul>\
										<li>\
											<a href="javascript:;" data-type="category" data-value="" :class="{active:state.category == \'\'}">全部</a>\
										</li>\
										<li v-for="item,key in source.categorys_sort">\
											<a href="javascript:;" data-type="category" :data-value="item.name" :class="{active:item.name==state.category}">{{item.value}}</a>\
										</li>\
									</ul>\
								</div>\
							</div>\
							<div class="panel dual"  v-if="activePanel == \'industry\'">\
								<div class="list-viewport" data-panel-type="industry_lv1">\
									<ul class="level-1">\
										<li>\
											<a href="javascript:;" data-type="industry_lv1" data-value="" :class="{active:viewState.industry_lv1.length == 0}">全部</a>\
										</li>\
										<li v-for="item,key in source.industrys.level_1_sort">\
											<a href="javascript:;" data-type="industry_lv1" :data-value="item.name" :class="{active:item.name == viewState.industry_lv1}">{{item.value}}</a>\
										</li>\
									</ul>\
								</div>\
								<div class="list-viewport" data-panel-type="industry_lv2">\
									<ul class="level-2">\
										<li>\
											<a href="javascript:;" data-type="industry_lv2" :data-value="viewState.industry_lv1" :class="{active:viewState.industry_lv2 == viewState.industry_lv1}">全部</a>\
										</li>\
										<li v-for="item,key in source.industrys.level_2[viewState.industry_lv1+\'_sort\']">\
											<a href="javascript:;" data-type="industry_lv2" :data-value="item.name" :class="{active:item.name==state.industry_lv2}">{{item.value}}</a>\
										</li>\
									</ul>\
								</div>\
							</div>\
							<div class="panel single" v-if="activePanel == \'address\'">\
								<div class="list-viewport" data-panel-type="address">\
									<ul>\
										<li>\
											<a href="javascript:;" data-type="address" data-value="" :class="{active:state.address.length == 0}">全部</a>\
										</li>\
										<li v-for="item,key in source.addresses">\
											<a href="javascript:;" data-type="address" :data-value="key" :class="{active:key==state.address}">{{item}}</a>\
										</li>\
									</ul>\
								</div>\
							</div>\
						</div>\
				   </div>'
	});
});
