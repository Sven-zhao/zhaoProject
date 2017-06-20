require(['vue','jquery','wajax','modules/ui/showMsg/js/main','zhsdk','pagescript/opportunity/base/js/urlAdapter','common/wxshare'],function(Vue,$,ajax,showMsg,zh,adapter) {
	function init(conf) {
		if(conf['isMy']) {
			zh.showGraphicalButton('navMore', function (){
				var actions = {
					share: {
						name: '分享给朋友们',
						type: 'default', //'primary' 'default' 'warn',
						handlerEvent : function (){
							zh.onMenuShareWxTimeLine(SHARE_TIMELINE_CONFIG);
							zh.onMenuShareWxMessage(SHARE_CONFIG);
							zh.onMenuShareFeed(SHARE_CONFIG);
							zh.onMenuShareShearPlate(SHARE_CONFIG);
							zh.onMenuShareShearImpress(SHARE_CONFIG);
							zh.showShareMenu();
						}
					},
					edit: {
						name: '编辑机会',
						type: 'default', //'primary' 'default' 'warn',
						handlerEvent : function (){
							setTimeout(function(){
								zh.navigateTo({
									url: wmpurl+ '/wmp/user/'+ appConfigId + '/resource/app/toCreate?id=' +  oppoInfo.id
								});
							},500);
						}
					},
					offline: {
						name: '关闭',
						type: 'warn', //'primary' 'default' 'warn',
						msg: '关闭后将不再公开展示和推广    确定关闭？',
						handlerEvent : function (){
							ajax({
								url: '/wmp/user/' + appConfigId + '/resource/app/offline',
							type: 'post',
							data: {
								resourceId: oppoInfo.id
							},
							success: function() {
										 showMsg({
											 msg: '关闭成功'
										 });
										 toUsersPage();
									 }
							});
						}
					},
					del: {
						name: '删除',
						type: 'warn', //'primary' 'default' 'warn',
						msg: '此机会删除后将无法恢复            确定删除？',
						handlerEvent : function () {
							ajax({
								url: '/wmp/user/'+ appConfigId +'/resource/app/delete',
							type: 'post',
							data: {
								resourceId: oppoInfo.id
							},
							success: function() {
										 showMsg({
											 msg: '删除成功'
										 });
										 toUsersPage();
									 }
							});
						}
					}
				};
				if(conf['isStopped']) {
					zh.showActionSheet({
						actions: [actions['edit'],actions['del']]
					})
				} else {
					zh.showActionSheet({
						actions: [actions['share'],actions['edit'],actions['offline'],actions['del']]
					})
				}
			}).then(function(){
			}).catch(function(obj){
			});
		} else {
			zh.showGraphicalButton('navShare', function (){
				zh.onMenuShareWxTimeLine(SHARE_TIMELINE_CONFIG);
				zh.onMenuShareWxMessage(SHARE_CONFIG);
				zh.onMenuShareFeed(SHARE_CONFIG);
				zh.onMenuShareShearPlate(SHARE_CONFIG);
				zh.onMenuShareShearImpress(SHARE_CONFIG);
				zh.showShareMenu();
			});
		}
	};

	function initCornerBtn(conf) {
		try {
			init(conf);
			zh.ready(function() {
				init(conf);
			});
		} catch (e) {
		}
	}

  var detail = {
	  wmpurl: window.wmpurl,
      showInvitation: false,
	  showAuthWindow: false,
	  showResourceManageBox: false,
      expandContent: false,
      moreOppos : [],
      invitMsg: '',
      serviceUser: null,
      promptMsg: '',
      showAuthWindow: false,
      showCompleteWindow: false,
      showPrompt: false,
      appConfigId: appConfigId,
	  showMoreOppo: false
  };

  function toUsersPage() {
	  setTimeout(function() {
		  zh.navigateTo({url:wmpurl+"/wmp/user/" + appConfigId + "/resource/app/user/" + oppoInfo.userId});
		  //window.location.href = "/wmp/user/" + appConfigId + "/resource/app/user/" + oppoInfo.userId;
	  },2000);
  }

  ajax({
    url: '../detailData/'+oppoInfo.id,
    type: 'post',
    success: function(obj) {
      console.log(obj);
      $.extend(true,detail,obj.data)
      $('.wrap').addClass('show');
      initApp();
	  oppoInfo.userId = obj.data.userTo.userIdStr; 
	  initCornerBtn({isStopped:obj.data.resource.isStopped,isMy:obj.data.isMy});
    }
  });

  function reloadData() {
	  ajax({
		url: '../detailData/'+oppoInfo.id,
		type: 'post',
		success: function(obj) {
		  console.log(obj);
		  $.extend(true,detail,obj.data)
		}
	  });
  }

  function initApp() {
    var app = new Vue({
      el: '.wrap',
      data: detail,
      mounted: function() {
        var self = this;
        ajax({
          url: '../loadUserOtherResource/'+ self.resource.uid,
		  data: {
			resourceId: self.resource.resource_id,
			count: 3
		  },
          type: 'post',
          success: function(obj) {
			self.showMoreOppo = obj.data.haveMore;
            self.moreOppos=obj.data.list;
          }
        });
      },
      methods: {
		gotoUrl: adapter.goToUrl,
		toServerPage: function() {
			this.gotoUrl({url:'zhisland://com.zhisland/user/'+this.serviceUser.userIdStr});
		},
		toHostPage: function() {
			this.gotoUrl({url:'zhisland://com.zhisland/user/'+this.userTo.userIdStr});
		},
		handleTagClick: function(evt) {
			var ele = $(evt.target);
			var url = wmpurl+'/wmp/user/'+ appConfigId+ '/resource/app/toSearch?'+ele.attr('data-type')+'='+ele.attr('data-id');
			this.gotoUrl({
				url: url,
				newLayer: true
			});
		},
		handleInvClick:function(evt) {
		   console.log(evt);
	    },
        identityType: function(num) {
		  var result = '';
          var typeMap = {
			  '280': '认证用户',
			  '300': '海客用户',
			  '400': '岛邻用户'
		  };
		  result = typeMap[num]?typeMap[num]:'用户';
          return result;
        },
        closeInvitation: function(evt) {
            if(evt.target != $('.invitaion a').get(0)) {
              this.showInvitation = false;
            }
        },
		created: function() {
	    },
		manageResource: function() {
			window.location.href='/wmp/user/'+appConfigId+'/resource/app/user/'+this.myUserTo.userIdStr;
			this.showResourceManageBox = false;
		},
        repub: function() {
          var self = this;
            if(!this.completeInfo) {
              this.showCompleteWindow = true;
              return;
            }
			if(!self.isAuth) {
			  self.showAuthWindow = true;	
			  return;
			}
          ajax({
            url: '../online',
            type: 'post',
            data: {
              resourceId: oppoInfo.id
            },
			error: function(obj) {
				if(obj.code == 1) {
					self.showResourceManageBox = true;
				}
		    },
            success: function(obj) {
              console.log(obj);
              self.prompt('发布成功，当前位置前进'+obj.data.upOrder+'名，明天再来哦');
			  reloadData();
            }
          });
        },
        prompt: function(str) {
          this.promptMsg = str;
          var self = this
          self.showPrompt = true;
          setTimeout(function(){
            self.showPrompt = false;
          },7000)
        },
		promotion: function(id) {
			var self = this;
            if(!this.completeInfo) {
              this.showCompleteWindow = true;
              return;
            }
			if(!self.isAuth) {
			  self.showAuthWindow = true;	
			  return;
			}
			var url = wmpurl+'/wmp/user/'+appConfigId+'/resource/app/toExpand?resourceId='+id;
			try {
				zh.redirectTo({
					url: url
				}); 
			} catch (e) {
				window.location.href = url;
			}
	    },
        refresh: function() {
          var self = this;
			if(!this.completeInfo) {
			  this.showCompleteWindow = true;
			  return;
			}
			if(!self.isAuth) {
			  self.showAuthWindow = true;	
			  return;
			}
          ajax({
            url: '../refresh',
            type: 'post',
            data: {
              resourceId: oppoInfo.id
            },
            success: function(obj) {
              self.prompt('刷新成功，展示排名已提升'+obj.data.upOrder+'名，明天再来哦');
              self.resource.validAsDay = self.resource.expireAsDay-1;
            }
          })
        },
        isEmpty: function(str) {
            return $.trim(str).length == 0;
        },
        follow: function() {
          var self  = this;
          if(self.followedPubUser) {
            return;
          }
          ajax({
            url: "../follow",
            data: {
              userId: self.userTo.userIdStr
            },
            success: function(obj) {
              self.followedPubUser = true;
            }
          })
        },
        doExpand: function() {
            this.expandContent = true;
        },
		fillProfile: function() {
			var self = this;
			 zh.notifyProfileGuide({
				 success: function(){
					self.showCompleteWindow = false;
					self.completeInfo = true;
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
        doInvite: function() {
			var self = this;
			if(self.resource.isStopped) {
				return;
			}
			if(this.cooperstionStatus != 0 ) {
				var tourl = 'zhisland://com.zhisland/chat/single/'+self.userTo.userIdStr;
				window.location.href = tourl; 
				return;
			}
            if(!this.completeInfo) {
              this.showCompleteWindow = true;
              return;
            }
			if(!this.isAuth) {
			  self.showAuthWindow = true;	
			  return;
			}
			if(self.chartCount > 0 || self.followedEachOther == true || self.chartPromise.status==1) {
			  self.showInvitation = true;
			  return;
			}
			if(self.chartPromise.status==0 ) {//没有权限或权限用完
				var tourl = 'zhisland://com.zhisland/chat/single/'+self.userTo.userIdStr;
				window.location.href = tourl; 
				return;
			}
			if(self.chartPromise.status==2 && self.chartCount==0){
			  self.showInvitation = true;
			  return;
			}
		 },
        sendInvite: function() {
          var self = this;
		  if(self.isEmpty(self.invitMsg)) {
			  return;
		  }
          ajax({
            url: '../cooperation',
            type: 'post',
            data: {
              resourceId: self.resource.resource_id,
              introduce: self.invitMsg
            },
            success: function(obj) {
			  if(!self.resource.isFavorite) {
				  self.resource.favoriteCount+=1;
				  self.resource.isFavorite = true;
			  }
              self.cooperstionStatus = 1;
              self.showInvitation = false;
              showMsg({msg:'消息已发送成功'});
            }
          })
        },
        doFavo: function() {
          var self = this;
          var url;
          if(self.resource.isFavorite) {
            url = "../cancelFavority";
          } else {
            url = '../favority';
          }
          ajax({
            url: url,
            data: {
              resourceId: self.resource.resource_id
            },
            success: function(obj) {
                self.resource.isFavorite = !self.resource.isFavorite;
                if(self.resource.isFavorite) {
                  self.resource.favoriteCount += 1;
                } else {
                  self.resource.favoriteCount -= 1;
                }
            }
          })
        }
      },
      computed: {
          tags: function() {
              var result = [];
              result.push({type: 'categorie',id:this.category.category_id,name:this.category.name});
			  this.resource.areas.forEach(function(obj){
				  result.push({
					  type: 'area',
					  id: obj.areaKey,
					  name: obj.areaName
				  });
			  });
			  this.resource.industries.forEach(function(obj) {
				  result.push({
					  type: 'industrie',
					  id: obj.tagId,
					  name: obj.tagName
				  });
			  });
              //result = result.concat(this.resource.areas.map(function(obj){return obj.areaName;}));
              // result = result.concat(this.resource.industries.map(function(obj){
              //     return obj.tagName;
              // }));
              return result;
          },
          'createrAvatar': function() {
            return 'background-image:url('+this.userTo.userAvatar+');';
          },
          'serverAvatar': function() {
            return 'background-image:url('+this.serviceUser.userAvatar+');';
          },
          'createrType': function() {
            return 'identify-level-'+this.userTo.identityType;
          },
          serverType: function() {
            return 'identify-level-'+this.serviceUser.identityType;
          },
          invitBtnText: function() {
            var status = this.cooperstionStatus;
            var text = '';
			if(this.resource.isStopped) {
				text = '机会已关闭';
			} else {
				if(status == 0 ) {
				  text = '我想合作';
				} else if(status == 1) {
				  text = '合作请求已发出，请等待回应';
				} else if(status == 2) {
				  text = '对方已回应，马上查看';
				}
			}
            return text;
          },
          followBtnText: function() {
            if(this.followedPubUser) {
              return '已关注'
            } else {
              return '+ 关注'
            }
          }
      }
    });
  }
});
