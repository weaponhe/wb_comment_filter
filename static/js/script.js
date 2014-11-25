
var commentArray=new Array();

$("#btn-wb-url").click(function(){
	var url = $("#text-wb-url").val();
	var mid = URL2Mid(url);
	getCommentsByMid(mid);
});

function URL2Mid(url){
	return url;
}


function getCommentsByMid(mid){
	var request_url = host + api_statuses_queryid+"?mid="+mid+"&isBase62="+"1"+"&type="+"1"+"&access_token="+AccessToken;
    var JSONP=document.createElement("script");  
    JSONP.type="text/javascript";  
    JSONP.src=request_url+"&callback=jsonpCallback";
    document.getElementsByTagName("body")[0].appendChild(JSONP);
}

function jsonpCallback(result) {
	var id = result.data.id;
	getCommentsById(id, 0, 1);
	getWeibo(id);
}


function getCommentsById(id, max_id, page){
	var request_url = host + api_comments_show + "?id=" + id 
											   + "&max_id=" + max_id 
											   + "&page=" + page 
											   +"&count="+ COUNT_PER_PAGE
											   + "&access_token=" + AccessToken;
	var JSONP=document.createElement("script");  
    JSONP.type="text/javascript";
    JSONP.src=request_url+"&callback=jsonpCallback2";  
    document.getElementsByTagName("body")[0].appendChild(JSONP);
}


function jsonpCallback2(result) {
	console.log(result);
	adaptComments(result.data);
}

function getWeibo(id){
	var request_url = host + api_statuses_show + "?id=" + id +
											     "&source=" + AppKey;
	var JSONP=document.createElement("script");  
	JSONP.type="text/javascript";
    JSONP.src=request_url+"&callback=jsonpCallback3";
    document.getElementsByTagName("body")[0].appendChild(JSONP);
}

function jsonpCallback3(result) {
	console.log(result);
	$("#div-status").html(result.data.text);
}

function adaptComments(data){
	var comments = data.comments;
	//设置页数,最大评论id,微博id
	if(!data.previous_cursor){
		setPage(1);
		setTotalNumber(data.total_number);
		setWbId(comments[0].status.id);
		setMaxIdOfComments(comments[0].id);
	}
	//评论列表
	$.each(comments,function(n,value){
		var created_time = new Date(value.created_at);
		var now_time = new Date();
		var created_at = created_time.getYear() == now_time.getYear()?"":created_time.getFullYear()+"年";
		created_at += (created_time.getMonth()+1)+"月"+created_time.getDate()+"日"+" ";
		created_at += created_time.getHours()+":"+created_time.getMinutes()+"";
		$("#list-comments").append("<li class='list-group-item' style='cursor:pointer;min-height: 58px' comment_id="+ value.id +">"
					   +"<dt>"
						   +"<a href='"+host_user_prefix+value.user.id+"' target='_blank'>"
							   +"<img src='"+value.user.profile_image_url+"' width='30' height='30' alt='"+value.user.name+"' />"
						   +"</a>"
					   +"</dt>"
					   +"<dd>"
					   		+"<a href='"+host_user_prefix+value.user.id+"' target='_blank' title='"+value.user.name+"'>"+value.user.name
					   		+"</a>"
					   		+"："+value.text
					   		+"<span>"
					   			+"("+created_at+")"	
					   		+"</span>"
					   +"</dd>"
				   +"</li>");
	});

	$(".list-group-item").click(function(){
		if(!$(this).hasClass("list-group-item-success")){
			$(this).removeClass("list-group-item-info");
			$(this).addClass("list-group-item-success");
			add($(this).clone());
		} else{
			$(this).removeClass("list-group-item-success");
			$(this).addClass("list-group-item-info");
		}
	});

	
	function add(item){
		commentArray.push(item);
		// commentArray.push($(item).attr("comment_id"));
		// commentArray.sort(function(a,b){return a<b?1:-1})
		console.log(commentArray);
		// $("#list-comments-selected").append(item);
	}

	

	$(".list-group-item").mouseover(function(){
		if(!$(this).hasClass("list-group-item-success")){
	    	$(this).addClass("list-group-item-info");
		}
	});
	  $(".list-group-item").mouseout(function(){
	    $(this).removeClass("list-group-item-info");
	  });

	//分页
	$("#pager-comments").append("<li class='previous'>"
			   	   +"<a href='#'>&larr; Older</a>"
			   +"</li>"
    		   +"<li class='next'>"
    		   	   +"<a href='#'>Newer &rarr;</a>"
    		   +"</li>");

	if(getPage() == 1){
		$(".previous").addClass("disabled");
	} else{
		$(".previous").removeClass("disabled");
	}

	if(COUNT_PER_PAGE * getPage() >= Math.min(getTotalNumber(), 2000-COUNT_PER_PAGE)){
		$(".next").addClass("disabled");
	}
	else{
		$(".next").removeClass("disabled");
	}

	$(".next").click(function(){
	    var page = parseInt(getPage())+1;
	    $("#list-comments").empty();
	    $("#pager-comments").empty();
	    setPage(page);
	    getCommentsById(getWbId(), getMaxIdOfComments(), page);
	  });
	$(".previous").click(function(){
	    var page = parseInt(getPage())-1;
		$("#list-comments").empty();
	    $("#pager-comments").empty();
	    setPage(page);
	    getCommentsById(getWbId(), getMaxIdOfComments(), page);
	});

	function setPage(page){
		$("#list-comments").attr("page",page);
	}	
	function getPage(){
		return $("#list-comments").attr("page");
	}
	function setMaxIdOfComments(max_id){
		$("#list-comments").attr("max_id",max_id);
	}
	function getMaxIdOfComments(){
		return $("#list-comments").attr("max_id");
	}
	function setWbId(wb_id){
		$("#list-comments").attr("wb_id",wb_id);
	}
	function getWbId(){
		return $("#list-comments").attr("wb_id");
	}
	function setTotalNumber(total_number){
		$("#list-comments").attr("total_number",total_number);
	}
	function getTotalNumber(){
		return $("#list-comments").attr("total_number");
	}
}


// console.log("1$(document).width()="+$(document).width());
var canvas_width = $(document).width();
$("#btn-preview").click(function(){
	// console.log("2$(document).width()="+$(document).width());
 	html2canvas($("html"), {
		  onrendered: function(canvas) {
		  	//test
		  	console.log("3$(document).width()="+$(document).width());
			console.log($("#div-comments"));
			console.log("canvas.width="+canvas.width);
			var top = $("#div-comments").offset().top;    //获取div的居上位置
			var left = $("#div-comments").offset().left;    //获取div的居左位置
			console.log("top="+top);
			console.log("left="+left);

		    document.body.appendChild(canvas);
			var ctx_new = canvas.getContext("2d");
		    var imgData = ctx_new.getImageData((canvas_width-980)/2,top,490,700);
		    // var imgData = ctx_new.getImageData(0,0,490,700);
		    var canvas_modal=document.getElementById("canvas_modal");
			var ctx_pre=canvas_modal.getContext("2d");
			ctx_pre.putImageData(imgData,0,0);
		  },
		  width:canvas_width,
		  //$(document).attr("scrollWidth"),	
		  //$(document).width(),
		  height:$(document).height()
		  // allowTaint: true
		});
	
});



$("#btn-download").click(function(){
	var canvas=document.getElementById("canvas_modal");
	// var image = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");   
    // window.location.href=image; // it will save locally  
	var a = document.createElement('a');
	a.download = '我是文件名' + ".jpg";
	a.href = canvas.toDataURL();
	a.click();

 		// var myCanvas = document.getElementById("canvas_modal");  
   //      // here is the most important part because if you dont replace you will get a DOM 18 exception.  
   //      // var image = myCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream;Content-Disposition: attachment;filename=foobar.png");  
   //      var image = myCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");   
   //      window.location.href=image; // it will save locally 

});


//点击变换成已选评论
$("#btn-test").click(function(){
	adaptCommentsSelected();
	$("#div-comments").animate({left:'-250px',
						    opacity:'0'},function(){
						        $("#list-comments").css("display","none");
						    	$("#list-comments-selected").css("display","block");
						    	$("#div-comments").animate({left:'0',
						    		opacity:'1'});
						    });
});

//点击还原评论框
$("#btn-test2").click(function(){
	$("#div-comments").animate({left:'-250px',
						    opacity:'0'},function(){
						    	$("#list-comments-selected").css("display","none");
						        $("#list-comments").css("display","block");
						    	$("#div-comments").animate({left:'0',
						    		opacity:'1'});
						    });
});

function adaptCommentsSelected(){
		// $("#list-comments-selected").empty();
		$.each(commentArray,function(n,item){
			$("#list-comments-selected").append(item);
		});
	}
