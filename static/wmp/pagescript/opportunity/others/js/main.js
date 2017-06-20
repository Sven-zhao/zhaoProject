require(['vue','jquery','wajax','zhsdk'],function(Vue,$,ajax,zh) {
	window.$ = $;
	Vue.component('user',{
		props: {
			item: {
				type: Object,
				required: true
			}
	    },
		template: '<div class="user-container">\
						<a  class="creater" :href="\'zhisland://com.zhisland/user/\'+item.userIdStr">\
							<div class="avatar" :style="genBg()"></div>\
							<div class="name">{{item.userName}}<span class="user-type" :class="genUserTypeClass(item.identityType)"></span></div>\
							<div class="info">{{item.userCompany}} {{item.userPosition}}</div>\
						</a>\
					</div>',
		methods: {
			genUserTypeClass: function(num) {
				var className = 'identify-level-' + num;
				var classObj = {};
				classObj[className] = true;
				return classObj;
			},
			genBg: function() {
					   console.log(this.item.userAvatar);
				return this.item.userAvatar ? 'background-image:url(' + this.item.userAvatar + ')':'';
		    }
		}
	});

	Vue.component('common-list',{
		props: {
			list: {
				type: Array,
				required: true
			}
		},
		template: '<div>\
						<a v-for="item in list" href="javascript:;" class="oppo-item" :data-id="item.resource.resource_id" @click="toDetailPage(item.resource.resource_id)">\
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
					</div>',
		methods: {
			toDetailPage: function(num) {
				var url = wmpurl+'/wmp/user/' + appConfigId + '/resource/app/detail/'+num;
				zh.navigateTo({
					url: url
				});
		    }
		}
	});

	Vue.component('recommend-list',{
		template: '<div class="rec-list">\
						<div class="title">推荐其他优质机会</div>\
						<common-list :list="list"></common-list>\
					</div>',
		data: function() {
			return {
				list: []
			};
		},
		mounted: function() {
			var self = this;
			ajax({
				url: '../loadRecommendUserResource',
				type: 'post',
				success: function(obj) {
					console.log(obj);
					self.list = obj.data.list;	
				}
			});
		}
	});

	Vue.component('oppo-list',{
		props: {
			list: {
				type: Array,
				required: true
			}
		},
		template: '<div>\
					<common-list :list="list"></common-list>\
					<div class="empty" v-if="list.length==0"></div>\
				  </div>'
	});


	var app = new Vue({
		el: '#app',
		data: {
			loaded: false,
			userTo: {},
			oppoList: [],
			recoList: []
		},
		mounted: function() {
			var self = this;
			ajax({
				url: '../loadUserResource/'+userId,
				type: 'post',
				data: {
					status: 3
				},
				success: function(obj) {
					self.userTo = obj.data.userTo;
					self.oppoList = obj.data.resultList;
					self.loaded = true;
				},
				complete: function() {
					Vue.nextTick(function() {
						$('#app').addClass('show');
					});
				}
			});
	    }
	});
});
