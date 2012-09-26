function dynamicTag()
{

	var userinput = document.getElementById("userinput").value;
	alert(userinput);			
	var request = "http://api.search.yahoo.com/ImageSearchService/V1/imageSearch?appid=YahooDemo&query=" + userinput + "&output=json&callback=getImages";
	var head = document.getElementsByTagName("head").item(0);
	var script = document.createElement("script");
	script.setAttribute("type", "text/javascript");
	script.setAttribute("src", request);
	head.appendChild(script);
}

function getImages(JSONData) {
		if (JSONData != null)
		{
			var div = document.getElementById("PlaceImages");
			for (i=0; i<10; i++)
			{
				var image = document.createElement("image");
				image.setAttribute("src", JSONData.ResultSet.Result[i].Url);
				image.setAttribute("width", 100);
				image.setAttribute("height", 100);
				div.appendChild(image);
			}
		}
}
