# zhaoProject
my test springBoot 
This is used to learn springBoot@sven-zhao!
###
git diff		#显示修改/不同
git status 		#显示文档区状态
git add  wmp-webapp/src/main/java/com/zhisland/weizhan/controller/TestController.java		#把文件添加到暂存区
git commit -m "测试是否成功"		#提交到本地仓库

git log			#可以查看提交历史，以便确定要回退到哪个版本。
git log --pretty=oneline 	#一行显示log
git reset --hard HEAD^		#代码回退到上个版本
git reset --hard HEAD^^
git reset --hard HEAD~100	
git reflog 		#记录你的每一次命令,查看命令历史，以便确定要回到未来的哪个版本
git reset --hard 0bdbf916aa8d6a21f73f5ed20b10cb7141eba1f5	#代码回退到特定版本
git diff HEAD -- wmp-webapp/src/main/java/com/zhisland/weizhan/controller/TestController.java	#命令可以查看工作区和版本库里面最新版本的区别
git checkout -- wmp-webapp/src/main/java/com/zhisland/weizhan/controller/TestController.java	#可以丢弃工作区该文件的修改，就是让这个文件回到最近一次git commit或git add时的状态:其实是用版本库里的版本替换工作区的版本，无论工作区是修改还是删除。
git reset HEAD file		#可以把暂存区的修改撤销掉（unstage），重新放回工作区

cd ~/.ssh/
ssh-keygen -t rsa -C "86882722@qq.com"

git remote add origin git@github.com:Sven-zhao/myProject.git 		#本地关联远程库,远程库的名字就是origin，这是Git默认的叫法，也可以改成别的
git push [-u] origin master 	#把本地库的内容推送到远程，实际上是把当前分支master推送到远程。
git clone git@github.com:Sven-zhao/myProject.git  		#克隆

git branch devName		#创建dev分支
git checkout devName 	#切换到dev分支
#git checkout -b devName 		#创建并切换
git merge --no-ff -m "merged bug fix 101" issue-101		#合并issue-101到当前分支

git remote	[-v]	#列出所有remote
git remote add origin [url] 	#添加一个新的远程仓库,可以指定一个简单的名字：origin
git remte origin set-url [url] 		#修改
git remote rm origin				#删除
git checkout origin/wxapi -b wxapi		#获取远程分支wxapi 到本地新分支wxapi，并跳到分支

git merge <name>		#合并某分支到当前分支
git branch -d <name> 	#合并完成后删除分支

git stash		#把当前工作现场“储藏”起来，等以后恢复现场后继续工作
git stash list
git stash apply + git stash drop	#恢复+清除
git stash pop		#恢复+清除

git push origin master[dev] 	#推送分支到远程
git branch --set-upstream dev origin/dev		#设置dev和origin/dev的链接
