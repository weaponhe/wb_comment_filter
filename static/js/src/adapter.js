var commentArray = new Array();
var commentContentArray = new Array();

function URL2Mid(url){
	return url;
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
			remove(this);
		}

		function add(item){
			if(!commentArray[getPage()]){
				commentArray[getPage()] = new Array();
			} 
			commentArray[getPage()].push(item);

			if(!commentContentArray[getPage()]){
				commentContentArray[getPage()] = new Array();
			} 
			commentContentArray[getPage()].push({
				"id":$(item).attr("comment_id"),
				"text":$(item).children("dd").text(),
				"img":$(item).find("img").attr("src")
			});
			console.log(commentContentArray);
		}
		function remove(item){
			$.each(commentArray[getPage()],function(n,value){
				if($(value).attr("comment_id") == $(item).attr("comment_id")){
					commentArray[getPage()][n]=commentArray[getPage()][commentArray[getPage()].length-1];
					commentArray[getPage()].pop();
				}
			});

			$.each(commentContentArray[getPage()],function(n,value){
				console.log(value.id);
				if(value.id == $(item).attr("comment_id")){
					commentContentArray[getPage()][n]=commentContentArray[getPage()][commentContentArray[getPage()].length-1];
					commentContentArray[getPage()].pop();
					return false;
				}
			});
		}
	});


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
	    queryCommentsById(getWbId(), getMaxIdOfComments(), page);
	  });
	$(".previous").click(function(){
	    var page = parseInt(getPage())-1;
		$("#list-comments").empty();
	    $("#pager-comments").empty();
	    setPage(page);
	    queryCommentsById(getWbId(), getMaxIdOfComments(), page);
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
