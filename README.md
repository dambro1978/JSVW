# BindTimeCapsule
// A useful library of 4+1 asynchronous functions for using variables in extemporaneous parallel streams. 

// It can be enriched

// bindJ(data, Type, url, contentType, dataType) passing Json document, data format, or data for control view interface like jquery UI

// bindJ(data, Type, url) passing Json document, data format, or data for control view interface like jquery UI

// bindS(data, Type, url) passing String document, data format or  data for control view interface like jquery UI

// bindX(data, Type, url) passing XML document, data format or  data for control view interface like jquery UI

// bindH(data, Type, url) passing Html document, data format or data for control view interface like jquery UI

<html>
<head>
//need jquery
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
//call library
<script type="text/javascript" src="../bindTimeCapsule.JS"></script>
<head>
<body>
//example of usage with bindJ function with 5 param
 <script type="text/javascript">
		$(function () {
			$("#btnGet").click(function () {
					//example to put response in async variable
					;(async () => {
					 const timeCapsule = await bindJ("Name", "POST", "api/AjaxAPI/AjaxMethod", "application/json; charset=utf-8", "json");
					   alert(timeCapsule.Name+" "+timeCapsule.DateTime);
					  })()
		  });
		});
</script>
</body>
</html>
//Created by Giuseppe D'Ambrosio
