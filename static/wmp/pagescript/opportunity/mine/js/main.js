require(['vue','jquery','wajax','zhsdk','pagescript/opportunity/base/js/widget/iscroll-panel'],function(Vue,$,ajax,zh) {
	try {
		zh.showTxtRightButton('发布机会', function () {
			zh.navigateTo({
				url: wmpurl+"/wmp/user/"+appConfigId+"/resource/app/pub"
			});
		})
	} catch(e) {
	}
	/*
	 * 机会分类
	 * 1 已推广
	 * 0 未推广
	 * 2 已下线
	 */
	var oppoType = {
		IN_PROM : '1',
		OUT_PROM : '0',
		STOP : '2'
	};

	function showTip(str) {
		$('#tip-msg').html(str).show();
		setTimeout(function() {
			$('#tip-msg').hide();
		},7000);
	}

	/*
	 * 列表项
	 */
	Vue.component('oppo-item-short',{
		props: ['category','dataObj'],
		template:'<div class="oppo">\
						<a href="javascript:;" @click="gotoUrl({url:wmpurl+\'/wmp/user/\'+appConfigId+\'/resource/app/detail/\'+dataObj.resource.resource_id})" class="title">{{dataObj.resource.title}}</a>\
						<div class="actions">\
							<span v-if="category == oppoType.STOP" class="hint warn">{{dataObj.resource.stopResourceTime}} 已关闭</span>\
							<span v-else-if="category == oppoType.IN_PROM" class="hint">{{dataObj.resource.validAsDay}} 天后过期</span>\
							<span v-else-if="category == oppoType.OUT_PROM" class="hint">当前曝光度为0</span>\
							<a v-if="category ==  oppoType.IN_PROM && dataObj.resource.validAsDay >= dataObj.resource.expireAsDay-1" class="link-btn disabled" href="javascript:;">刷新</a>\
							<a v-if="category ==  oppoType.IN_PROM && dataObj.resource.validAsDay < dataObj.resource.expireAsDay-1" class="link-btn" href="javascript:;" @click="refresh">刷新</a>\
							<a v-if="category ==  oppoType.STOP && dataObj.resource.isStopped && !dataObj.resource.isAdminStopped" class="link-btn" href="javascript:;" @click="pub">重新发布</a>\
							<a v-if="category ==  oppoType.STOP && !dataObj.resource.isStopped" class="link-btn disabled" href="javascript:;">发布成功</a>\
							<a v-if="category ==  oppoType.OUT_PROM" class="link-btn" @click="expand(dataObj.resource.resource_id)">推广</a>\
							<a class="link" href="javascript:;" @click="gotoUrl({url:wmpurl+\'/wmp/user/\'+appConfigId+\'/resource/app/toCreate?id=\'+dataObj.resource.resource_id})">编辑</a>\
							<a class="link" href="javascript:;" @click="gotoUrl({url:wmpurl+\'/wmp/user/\'+appConfigId+\'/resource/app/detail/\'+dataObj.resource.resource_id})" v-if="category != oppoType.OUT_PROM" >推广效果</a>\
						</div>\
					</div>',
		data: function() {
			return {
				wmpurl: window.wmpurl,
				appConfigId: appConfigId,
				oppoType: oppoType
			};
		},
		methods: {
			gotoUrl: function(obj) {
				try{
					zh.navigateTo({
						url: obj.url
					});
				}catch(e) {
				}
			},
			expand: function(id) {
				var self = this;
				var url = wmpurl+'/wmp/user/'+appConfigId+'/resource/app/toExpand?resourceId='+id;
				console.log(url);
				if(!window.completeInfo) {
					console.log(self);
					self.$emit('completereq');
					return;
				}
				if(!self.dataObj.isAuth) {
					self.$emit('authreq');
					return;
				}
				try {
					console.log('zh.redirct');
					zh.redirectTo({
						url: url
					});
				} catch(e) {
					window.location.href = url;
					console.log('location');
				}
			},	
			refresh: function() {
				var self = this;
				if(!window.completeInfo) {
					self.$emit('completereq');
					return;
				}
				if(!self.dataObj.isAuth) {
					self.$emit('authreq');
					return;
				}
				ajax({
					url: '../refresh',
					data: {
						resourceId: self.dataObj.resource.resource_id
					},
					success: function(obj) {
						self.dataObj.resource.validAsDay = self.dataObj.resource.expireAsDay-1;		
						showTip('刷新成功，展示排名已提升'+obj.data.upOrder+'名，明天再来哦');
					}
				});
			},
			pub: function() {
				var self = this;
				if(!window.completeInfo) {
					self.$emit('completereq');
					return;
				}
				if(!self.dataObj.isAuth) {
					self.$emit('authreq');
					return;
				}
				ajax({
					url: '../online',
					data: {
						resourceId: self.dataObj.resource.resource_id
					},
					error: function(obj) {
						self.$emit('beyondlimit',{
							userIdStr: self.dataObj.userTo.userIdStr
						});						
				    },
					success: function(obj) {
						self.dataObj.resource.isStopped = false;		
						showTip('发布成功，展示排名已提升了' + obj.data.upOrder + '名');
						console.log('parent');
						self.$parent.$parent.$parent.reloadData();
						console.log('parent');
					}
				});
			}
		}
	});


	/*
	 * 与 tab 项目对应的 panel
	 */
	Vue.component('panel', {
		props: ['category'],
		template: '<div class="panel-container">\
					<iscroll-panel ref="isc" @end="handleEnd">\
						<slot>\
						</slot>\
						<div v-if="category==0 && dataArr.length>0" class="not-prompt-tip">\
							<div class="title">还没有人发现你的机会</div>\
							<div class="desc">每分钟都有1名企业家与你擦肩而过<br>立即开始推广，坐等合作伙伴上门</div>\
						</div>\
						<oppo-item-short @beyondlimit="handleBeyond" @completereq="handleCompleteReq"  @authreq="handleAuthReq" v-for="item in dataArr" :category="category" :dataObj="item"></oppo-item-short>\
						<div v-if="onLoading" class="loading"></div>\
					  </iscroll-panel>\
						<div :class="{show:dataArr.length==0 && onLoading == false }" class="empty-promotion box">\
							<p class="epm">\
							呃...什么都还没有<br>\
							你已经错过了好几个亿<br>\
							</p>\
							<div class="btn-container">\
								<a class="ep-btn" href="javascript:;" @click="topub">马上发布机会</a>\
							</div>\
						</div>\
				  </div>',
		data: function() {
			return {
				url: '../loadUserResource/'+userId,
				dataArr: [],
				onLoading: true,
				curPage: 1
			};
		},
		beforeCreate: function() {
			console.log('before');
	    },
		created: function() {
			this.loadData();
		},
		mounted: function() {
			this.$refs.isc.refresh();
		},
		updated: function() {
			console.log('update');
	    },
		methods: {
			topub: function() {
				zh.navigateTo({
					url: wmpurl + '/wmp/user/' + appConfigId + '/resource/app/pub'
				});
		    },
			handleAuthReq: function() {
				this.$emit('authreq');
		    },
			handleCompleteReq: function() {
				this.$emit('completereq');
			},
			handleBeyond: function(obj) {
				this.$emit('beyondlimit',obj);
			},
			handleEnd: function() {
				if(!this.onLoading) {
					this.$refs.isc.scrollYBy(-40);
					this.loadData();
				}
		    },
			reload: function() {
				this.curPage = 1; 
				this.dataArr = [];
				this.loadData();
			},
			loadData: function() {
				var self = this;
				self.onLoading = true;
				ajax({
					url: this.url,
					data: {
						status: this.category,
						cp: this.curPage,
						count: 6
					},
					success: function(obj) {
						self.onLoading = false;
						var data = obj['data'];
						self.dataArr = self.dataArr.concat(data['resultList']);
						self.curPage = data.cp + 1; 
						self.$emit('loaded',{category:self.category,total:data.total});
						Vue.nextTick(function() {
							console.log('refresh');
							self.$refs.isc.refresh();
						});
				    },
					complete: function() {
						self.onLoading = false;
				    }
				});
		    }
		}
	});


	/*
	 * 主程序入口
	 */
	var app = new Vue({
		el: '#app',
		data: {
			show: false,
			curUserIdStr: null,
			showResourceManageBox: false,
			showAuthWindow: false,
			showCompleteWindow: false,
			oppoType: oppoType,
			curPanel: oppoType.IN_PROM,
			panelData: {
				"0": {
					total: 0
				},
				"1": {
					total: 0
				},
				"2": {
					total: 0
				}
			}
		},
		mounted: function() {
					 console.log('---');
			console.log(this.$children);
					 console.log('---');
		},
		created: function() {
		}, 
		methods: {
			fillProfile: function() {
				var self = this;
				 zh.notifyProfileGuide({
					 success: function(){
						self.showCompleteWindow = false;
						window.completeInfo = true;
					 },
					 fail: function(){
						showMsg({
							msg: '资料完善失败'
						});
					 },
					 complete: function(){
						self.showCompleteWindow = false;
					 },
				 })
				 zh.profileGuide();
				showCompleteWindow = false;
			},
			doAuth: function() {
				var self = this;
				zh.notifyAuthstep({
				 success: function(){
				 },
				 fail: function(){
					showMsg({
						msg: '认证失败'
					});
				 },
				 complete: function(){
					self.showAuthWindow = false;	
				 },
				})
				zh.authstep();
				return;
			},
			reloadData: function() {
				console.log('reload data');
				var children = this.$children;
				for(var i in children) {
					children[i].reload();
				}	
			},
			handleCompleteReq: function() {
				this.showCompleteWindow = true;
		    },
			handelAuthReq: function() {
				this.showAuthWindow = true;
		    },
			handleBeyond: function(obj) {
				this.showResourceManageBox = true;
				this.curUserIdStr = obj.userIdStr;
			},
			manageResource: function() {
				var url = wmpurl+'/wmp/user/'+appConfigId+'/resource/app/user/'+this.curUserIdStr;
				try {
					zh.navigateTo({
						url: url
					});
				} catch(e) {
					window.location.href =  url;
				}
				this.showResourceManageBox = false;
			},
			setTotal: function(evt) {
				this.panelData[evt.category].total = evt.total;
				this.show = true;
		    }
	    },
		watch: {
	    }
	});
			
});
