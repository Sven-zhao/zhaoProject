<!DOCTYPE HTML>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <title>测试页面</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <link rel="stylesheet" type="text/css" href="${urls.getForLookupPath('/css/index.css')}">
    <script type="text/javascript" src="${urls.getForLookupPath('/js/index.js')}"></script>
</head>
<body>
<img src="${urls.getForLookupPath('/img/index.jpg')}">
aabbcc
${name!}
${prize.title!}
</body>
</html>