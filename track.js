var pattern = [];
window.onbeforeunload = savePattern;
var domainValue = null;

function registerDomain() {
	var domain = document.getElementById("domain").value;
// 	window.open("http://localhost:8080/register?name=" + domain);
// 	var request = "http://localhost:8080/register?name=" + domain + "&output=json&callback=registrationResult";
	var req = new XMLHttpRequest();
	req.open("GET", "http://localhost:8080/register?name=" + domain, true);
	req.send(null);
	alert(domain + ' Registered');
	
}	

function track(domain, trackField) {
	domainValue = domain;
	var req = new XMLHttpRequest();
	req.open("GET", "http://localhost:8080/trackHits?domain=" + domain + "&trackField=" + trackField);
	req.send(null);
	pattern.push(trackField);
	
}

function savePattern() {
	var str = "";
	var n = pattern.length;
	for(i=0;i<n;i++) {
		str += pattern[i] + ",";
	}
	var req = new XMLHttpRequest();
	req.open("GET", "http://localhost:8080/savePattern?domain=" + domainValue + "&pattern=" + str);
	req.send(null);
	alert('You are Navigating Away');
}

function registrationResult() {
	alert('Result Received');
}