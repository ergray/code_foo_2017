function formSubmitted(){
		var amount = document.getElementById("amount").value
		var choice = document.getElementById("choice").value
		var page = document.getElementById("page").value
		makeRequest(amount, choice, page);
}

function serverCall(method, uri, data){
	var xhr = new XMLHttpRequest();
	xhr.open(method, uri);
	if (data){
		xhr.send(data);
	} else {
		xhr.send();
	}	
}


function makeRequest(amount, choice, page){
	if (!page){
		page=0
	};
	var xmlRequest = $.ajax({
		url: 'http://ign-apis.herokuapp.com/'+choice+'?startIndex='+page+'\u0026count='+amount,
		dataType: "jsonp",
		success: function (html){
			console.log(html);
			var results = []
			for (var result of html["data"]){
				results = [];
			results.push(JSON.stringify(result['metadata']))
			serverCall('POST',  '/insert/'+choice, results)
			}
		},
		error: function(){
			console.log('failure')
		}
	})
	return xmlRequest;
}

window.onload = function(){
	document.getElementById("submitForm").addEventListener("submit", function(event){
		event.preventDefault();
	});
}