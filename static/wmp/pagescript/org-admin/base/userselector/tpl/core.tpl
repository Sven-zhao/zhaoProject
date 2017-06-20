<div class="user-selector hide" id="user-selector">
	<template us-data-role="add-member-item-tpl">
	<a class="item" href="javascript:;" data-uid="{{uid}}">
			<div class="avatar" style="background-image:url({{avatar}});"></div>
			<div class="title">{{name}}</div>
			<div class="desc">{{corpName}}</div>
			{% if isMember == true %}
			<div class="status">已添加</div>
			{% else %}
			<div class="add-btn"></div>
			{% endif %}
	</a>
	</template>
	<div class="container">
		<div class="title-bar">
			<h1>选择岛邻</h1>
			<div class="search">
				<input type="text" us-data-role="search-key-word">
				<a class="search-btn" us-data-role="search-btn" href="javascript:;" disabled></a>
			</div>		
		</div>
		<div class="item-list" us-data-role="item-list">
		</div>
		<div class="loading" us-data-role="loading"></div>
		<div class="prompt-pic search-result-empty" us-data-role="empty-result">
			<div class="pic"></div>
			<div class="prompt">没有找到该岛邻</div>
		</div>
	</div>
</div>
