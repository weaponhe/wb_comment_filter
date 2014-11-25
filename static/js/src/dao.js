
function queryStatusId(mid){
	var request_url = host + api_statuses_queryid + "?mid=" + mid +
											   "&isBase62=" + "1" +
											       "&type=" + "1" +
									       "&access_token=" + AccessToken;
	var JSONP=document.createElement("script");  
    JSONP.type="text/javascript";  
    JSONP.src=request_url+"&callback=jsonpCallback1";
    JSONP.id="jsonpCallback1";
    document.getElementsByTagName("body")[0].appendChild(JSONP);
}

function queryCommentsById(id, max_id, page){
	var request_url = host + api_comments_show + "?id=" + id 
											   + "&max_id=" + max_id 
											   + "&page=" + page 
											   + "&count="+ COUNT_PER_PAGE
											   + "&access_token=" + AccessToken;
	var JSONP=document.createElement("script");  
    JSONP.type="text/javascript";
    JSONP.src=request_url+"&callback=jsonpCallback2";  
    JSONP.id="jsonpCallback2";
    document.getElementsByTagName("body")[0].appendChild(JSONP);
}

function queryStatus(id){
	var request_url = host + api_statuses_show + "?id=" + id +
											     "&source=" + AppKey;
	var JSONP=document.createElement("script");  
	JSONP.type="text/javascript";
    JSONP.src=request_url+"&callback=jsonpCallback3";
    JSONP.id="jsonpCallback3";
    document.getElementsByTagName("body")[0].appendChild(JSONP);
}

function jsonpCallback1(result) {
	$("#jsonpCallback1").remove();
	id = result.data.id;
	queryCommentsById(id, 0, 1);
	queryStatus(id);
}

function jsonpCallback2(result) {
	$("#jsonpCallback2").remove();
	console.log(result);
	adaptComments(result.data);
}

function jsonpCallback3(result) {
	$("#jsonpCallback3").remove();
	console.log(result);
	$("#div-status").html(result.data.text);
}
