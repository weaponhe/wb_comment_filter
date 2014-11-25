

$("#btn-wb-url").click(function(){
	//clear all
	$("#list-comments").empty();
	$("#pager-comments").empty();
	$("#div-status").empty();
	var url = $("#text-wb-url").val();
	var mid = URL2Mid(url);
	queryStatusId(mid);
});

var canvas_width = $(document).width();
$("#btn-preview").click(function(){
	$("#list-comments-selected").empty();
	for(var i=1;i<commentArray.length;i++){
		var array=commentArray[i];
		if(array){
			array.sort(function(a,b){
				return $(a).attr("comment_id")<$(b).attr("comment_id")?1:-1
			});
			$.each(array,function(m,item){
				$(item).removeClass("list-group-item-success");
				$("#list-comments-selected").append(item);
			});
		}
	}
	
});



$(".btn-download").click(function(){
	draw();
});

function draw(){
	var canvas = document.createElement("canvas");
	var ctx=canvas.getContext("2d");
	ctx.font='14px "Helvetica Neue",Helvetica,Arial,sans-serif';

	var outer_padding = 15;
	var outer_border = 1;

	var hr_border = 1;
	
	var inner_pading_left = 15;
	var inner_pading_right = 15;
	var inner_pading_top = 10;
	var inner_pading_bottom = 10;
	
	var line_height = 21;
	var min_line_height = 36;
	var line_width = 496;

	var img_width = 30;
	var img_height = 30;

	var img_comment_padding = 10;

	var width = 598;
	var height = 0;
	//计算总高度
	height += outer_padding * 2 + outer_border;

	for(var i=1;i<commentContentArray.length;i++){
		var array=commentContentArray[i];
		if(array){
			array.sort(function(a,b){
				return a.id<b.id?1:-1
			});
			$.each(array,function(m,item){
				item.width=ctx.measureText(item.text).width;
				var lines = Math.ceil(item.width/line_width);
				item.lines = lines;
				var textArray = new Array();
				var head = 0;
				var tail = 0;
				for(var i = 0;i < lines;i++){
					while(ctx.measureText(item.text.substring(head,tail)).width<line_width && tail<item.text.length){
						tail += 1;
					}
					textArray.push(item.text.substring(head,tail));
					head = tail;
				}
				item.textArray = textArray;
				//计算总高度
				if(item.lines == 1){
					height += min_line_height;
				}
				else{
					height += line_height * item.lines;
				}
				height += inner_pading_top + inner_pading_bottom + hr_border;
			});
		}
	}

	canvas.width = width;
	canvas.height = height;
	//画背景
	ctx.fillStyle="#FFF";
	ctx.fillRect(0,0,canvas.width,canvas.height);
	//画边框
	ctx.fillStyle="#000";
	drawRoundRect(outer_padding,outer_padding,canvas.width-outer_padding*2,canvas.height-outer_padding*2,5,ctx);
	//画评论
	ctx.font='14px "Helvetica Neue",Helvetica,Arial,sans-serif';
	ctx.textBaseline="top"; 
	var img_padding_left = outer_padding + outer_border + inner_pading_left;
	var comment_padding_left = img_padding_left + img_width + img_comment_padding;
	var hr = 0;
	hr += outer_padding;
	var isFirst = true;
	var count = 0;
	for(var i=1;i<commentContentArray.length;i++){
		$.each(commentContentArray[i],function(n,item){
			count += 1;
			hr += hr_border;
			if(isFirst){
				isFirst = false;
			}else{
				//画水平线
				ctx.beginPath();
				ctx.moveTo(outer_padding + outer_border,hr);
				ctx.lineTo(canvas.width - outer_padding - outer_border ,hr);
				ctx.stroke();
			}
			hr += inner_pading_top; 

			//画头像
			item.hr = hr;
			//画文字
			for(var i = 0; i < item.lines; i++){
				ctx.fillText(item.textArray[i],comment_padding_left,hr);
				if(item.lines == 1){
					hr += min_line_height;
				}
				else{
					hr += line_height;
				}
			}
			hr += inner_pading_bottom;
		});
	}

	console.log("count!!!!!!!!!!!!"+count);

	var count_img_load = 0;
	//画头像
	for(var i=1;i<commentContentArray.length;i++){
		$.each(commentContentArray[i],function(n,item){
			$.get("/getimg?url="+item.img,function(data,status){
				var img=new Image();
				img.src = data;
				ctx.drawImage(img,img_padding_left,item.hr,img_width,img_height);
				count_img_load += 1;
				// console.log("@@@@@@@count_img_load="+count_img_load);
				// console.log("@@@@@@@count="+count);

				if(count == count_img_load){
					var a = document.createElement('a');
					a.download = '我是文件名' + ".png";
					a.href = canvas.toDataURL();
					a.click();
				}
			});
			
		});
	}
	
	$("body").append(canvas);
}

function drawRoundRect(x, y, w, h, r,ctx) {
        ctx.beginPath();
        ctx.moveTo(x+r, y);
        ctx.arcTo(x+w, y, x+w, y+h, r);
        ctx.arcTo(x+w, y+h, x, y+h, r);
        ctx.arcTo(x, y+h, x, y, r);
        ctx.arcTo(x, y, x+w, y, r);
        ctx.closePath();
        ctx.stroke();
    }





//点击变换成已选评论
// $("#btn-test").click(function(){
// 	adaptCommentsSelected();
// 	$("#div-comments").animate({left:'-250px',
// 						    opacity:'0'},function(){
// 						        $("#list-comments").css("display","none");
// 						    	$("#list-comments-selected").css("display","block");
// 						    	$("#div-comments").animate({left:'0',
// 						    		opacity:'1'});
// 						    });
// });

//点击还原评论框
// $("#btn-test2").click(function(){
// 	$("#div-comments").animate({left:'-250px',
// 						    opacity:'0'},function(){
// 						    	$("#list-comments-selected").css("display","none");
// 						        $("#list-comments").css("display","block");
// 						    	$("#div-comments").animate({left:'0',
// 						    		opacity:'1'});
// 						    });
// });
 // $.post("http://localhost:3000/users");


					
					//另一种图片下载的方法
					// var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"); 
     				// window.location.href=image; // it will save locally  