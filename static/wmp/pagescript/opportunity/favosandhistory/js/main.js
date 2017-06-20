require(['vue','jquery','wajax','zhsdk','pagescript/opportunity/base/js/widget/iscroll-panel'],function(Vue,$,ajax,zh) {
	try {
		zh.showTxtRightButton('发布机会', function () {
			zh.navigateTo({
				url: wmpurl+"/wmp/user/"+appConfigId+"/resource/app/pub"
			});
		})
	} catch(e) {
	}
	Vue.component('oppo-item',{
		props: ['item'],
		template: '<li class="oppo-card">\
					<a  class="creater" :href="genUserPage(item.userTo.userIdStr)">\
						<div class="avatar" :style="\'background:url(\'+item.userTo.userAvatar+\')\'"></div>\
						<div class="name">{{item.userTo.userName}}<span class="user-type" :class="genUserTypeClass(item.userTo.identityType)"></span></div>\
						<div class="info">{{item.userTo.userCompany}} {{item.userTo.userPosition}}</div>\
					</a>\
					<a href="javascript:;" :data-id="item.resource.resource_id" @click="toDetailPage(item.resource.resource_id)">\
						<div class="oppo-info">\
							<div v-if="item.resource.images.length>0" class="pic" :style="\'background-image:url(\'+item.resource.images[0]+\')\'">\
								<span class="num">{{item.resource.images.length}}</span>\
						   	</div>\
							<div class="flag" v-if="item.resource.isHighQuality"><span>优质</span></div>\
							<div class="title">{{item.resource.title}}</div>\
							<div class="tags">\
								<span v-for="tag,index in item.resource.advantages" v-if="index<3">{{tag}}</span>\
							</div>\
						</div>\
						<div class="tool-bar">\
							<span class="views">{{item.resource.browseCount}}</span>\
							<span class="favs" :class="{light:item.resource.isFavorite}">{{item.resource.favoriteCount}}</span>\
							<span class="update-time">{{item.resource.refreshTime}}更新</span>\
						</div>\
					</a>\
				</li>',
		methods: {
			genUserTypeClass: function(num) {
				var className = 'identify-level-' + num;
				var classObj = {};
				classObj[className] = true;
				return classObj;
			},
			toDetailPage: function(id) {
				var result = wmpurl+'/wmp/user/' + window.appConfigId + '/resource/app/detail/'+ id;
				zh.redirectTo({
					url: result
				});
		    },
			genUserPage: function(id) {
				return 'zhisland://com.zhisland/user/'+id;
			}
		}
	});

	Vue.component('panel',{
		props: ['panelType'],
		template: '<div class="panel-container">\
					<iscroll-panel ref="isc" @end="handleEnd">\
						<oppo-item v-for="item in dataArr" :item="item"></oppo-item>\
						<div v-if="onLoading" class="loading"></div>\
				  </iscroll-panel>\
						<template v-if="panelType==panelTypes.FAVOS">\
							<div :class="{show:dataArr.length==0 && onLoading == false }" class="empty-promotion star">\
								<p class="epm">\
								呃...还没有收藏过机会<br>\
								赶紧查看机会吧<br>\
								</p>\
								<div class="btn-container">\
									<a class="ep-btn" @click="toAllPage" href="javascript:;">查看机会</a>\
								</div>\
							</div>\
						</template>\
						<template v-else-if="panelType==panelTypes.HISTORY">\
							<div :class="{show:dataArr.length==0 && onLoading == false }" class="empty-promotion box">\
								<p class="epm">\
									呃...你什么都还没看过<br>\
									赶紧查看机会吧<br>\
								</p>\
								<div class="btn-container">\
									<a class="ep-btn" @click="toAllPage" href="javascript:;">查看机会</a>\
								</div>\
							</div>\
						</template>\
				  </div>',
		data: function() {
			return {
				panelTypes: panelType,
				dataArr: [],
				onLoading: false,
				curPage: 1
			};
		},
		methods: {
			handleEnd: function() {
				if(!this.onLoading) {
					this.$refs.isc.scrollYBy(-40);
					this.loadData();
				}
		    },
			toAllPage: function() {
				var result = wmpurl+'/wmp/user/' + window.appConfigId + '/resource/app/toSearch';
				zh.redirectTo({
					url: result
				});
		    },
			loadData: function() {
				var self = this;
				var url = '';
				if(self.panelType == self.panelTypes.FAVOS) {
					url = './loadUserFavorite';
				} else if (self.panelType == self.panelTypes.HISTORY) {
					url = './loadUserVisit';
				}
				self.onLoading = true;
				ajax({
					url: url,
					data: {
						cp: self.curPage,
					},
					success: function(obj) {
						var data = obj['data'];
						self.dataArr = self.dataArr.concat(data['list']);
						self.curPage += 1; 
						self.onLoading = false;
						Vue.nextTick(function() {
							console.log('refresh');
							self.$refs.isc.refresh();
						});
					}
				});
		    }

		},
		created: function() {
			this.loadData();
	    }
		
	});


	var panelType = {
		FAVOS: '0',
		HISTORY: '1'
	};
	var app = new Vue({
		el: '#app',
		data: {
			panelType: panelType,
			curPanel: panelType.FAVOS
		}
	});
});
