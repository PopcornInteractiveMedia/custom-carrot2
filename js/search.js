/*
* @name search.js
* @author => Shiv Kemar Tiwari
* @description => handles all type of serach related queries
*/

function __searchController() {
	//http://localhost:8080/dcs/rest?dcs.source=indeed&query=data&results=10&dcs.algorithm=lingo&dcs.output.format=JSON&dcs.json.callback=
	self = this;
    //var baseUrl = "http://localhost:8080/dcs/rest";
    var baseUrl = "http://142.54.189.154:8080/dcs/rest";
    this.hitWebAjax = function(objData){
    	if(objData.val!=""){
            console.log(objData);
            self.showOverLay();
        	$.ajax({
        		url: baseUrl,
        		dataType: "jsonp",
                jsonp: "dcs.json.callback",
                type: "post",
        		data: {
        		  "dcs.source": objData.searchType,
                  "query": self.filteredText(objData.val),
                  "results":10,
                  "dcs.algorithm":"stc",
                  "dcs.output.format": "JSON"
        		},
        		success:function(response){
        			//console.log(response);
                    if(objData.searchType=="solr"){
                        $("#woz-main-search-container").html(self.createHtmlForWeb(response));
                    }else{
                        $("#woz-main-search-container").html(self.createHtml(response));
                        self.hitAjaxForImages(objData);
                    }
        			
        		},
        		complete:function(response){
        			self.hideOverLay();
        		}
        	});
        }
    }

    // ajax for solr
    // this.hitAjaxForSolr = function(objData){
    //     if($.trim(objData.val()!="")){
    //         self.showOverLay();
    //         $.ajax({
    //             url: baseUrl,
    //             dataType: "jsonp",
    //             jsonp: "dcs.json.callback",
    //             type: "post",
    //             data: {
    //               "dcs.source": "solr",
    //               "query": self.filteredText(objData.val()),
    //               "results":10,
    //               "dcs.algorithm":"stc",
    //               "dcs.output.format": "JSON"
    //             },
    //             success:function(response){
    //                 console.log(response);
    //                 $("#woz-main-search-container").html(self.createHtmlForWeb(response));
    //             },
    //             complete:function(response){
    //                 self.hideOverLay();
    //             }
    //         });
    //     }
    // }    
   
    this.hitAjaxForImages = function(objData){
    	if(objData.val!=""){
            
            $.ajax({
        		url: baseUrl,
        		dataType: "jsonp",
                jsonp: "dcs.json.callback",
                type: "post",
        		data: {
        		  "dcs.source": "images",
                  "query": self.filteredText(objData.val),
                  "results":10,
                  "dcs.algorithm":"stc",
                  "dcs.output.format": "JSON"
        		},
        		success:function(response){
                    if(response.documents.length > 0){
                        for(var i = 0; i < response.documents.length; i++){
                            var objDocs = response.documents[i];
                            $("#dcs-images-"+i).attr('src', objDocs.fields['thumbnail-url']);;
                        }    
                    }
        			
        		},
        		complete:function(response){
        			self.hideOverLay();
        		}
        	});
        }
    }


    this.filteredText = function(srtText){
    	return srtText;
    }

    /* show overlay*/
    this.showOverLay = function(){
    	$("#overlayStyle").show();
    }
	/* hide overlay*/
    this.hideOverLay = function(){
    	$("#overlayStyle").hide();
    }

    /* function works to make the butify html */    
    this.createHtmlForWeb = function(responseData){
        var strHtml = "";
        if(responseData.documents.length > 0){
            var innerHtml = "";
            for(var i = 0;i < responseData.documents.length; i++){
                objData = responseData.documents[i];
                innerHtml+="<div class='woz-search-col'>";
                innerHtml+="<div class='woz-search-text col-xs-12'>";
                innerHtml+="<h1 class='woz-title'><a href='"+objData.url+"'>"+objData.title+"</a></h1>";
                innerHtml+="<p class='woz-permalink'><a href='"+objData.url+"'>"+objData.url+"</a></p>";
                innerHtml+="<p class='woz-excerpt'>"+objData.snippet+" </p>";
                innerHtml+="</div>";
                innerHtml+="</div>";
            }

        }
        strHtml+=innerHtml;
        return strHtml;
    }

    /* function works to make teh butify html for all content */
    this.createHtml = function(responseData){
    	var strHtml = "";
    	if(responseData.documents.length > 0){
    		var innerHtml = "";
    		for(var i = 0;i < responseData.documents.length; i++){
    			objData = responseData.documents[i];
    			innerHtml+="<div class='woz-search-col'>";
    			innerHtml+="<div class='woz-search-text col-xs-6'>";
    			innerHtml+="<h1 class='woz-title'><a href='"+objData.url+"'>"+objData.title+"</a></h1>";
    			innerHtml+="<p class='woz-permalink'><a href='"+objData.url+"'>"+objData.url+"</a></p>";
    			innerHtml+="<p class='woz-excerpt'>"+objData.snippet+" </p>";
    			innerHtml+="</div>";
    			// for images and videos start
    			innerHtml+="<div class='woz-search-other col-xs-6'>";
    			innerHtml+="<div class='woz-search-img col-xs-6'><p class='woz-cat-link'><a href='#'>Images</a></p><img id='dcs-images-"+i+"' src='images/images-demo.jpg'/></div>";
    			innerHtml+="<div class='woz-search-video col-xs-6'>";
    			innerHtml+="<div class='woz-vdo col-xs-8'><p class='woz-cat-link'><a href='#'>Videos</a></p><img src='images/video.jpg'/></div>";
    			innerHtml+="<div class='col-xs-4'><span class='fa fa-star'></span></div>";
    			innerHtml+="</div>";
    			innerHtml+="</div>";
    			// for images and videos end
    			innerHtml+="</div>";
    		}

    	}
    	strHtml+=innerHtml;
    	return strHtml;
    }

}


$(document).ready(function(){
	var objSearchController = new __searchController();
	$("body").on('keyup','#q',function(e){
		 var objData = {val:$.trim($("#q").val()),searchType:$('.woz-sm-activate').attr('st')};
		e.preventDefault();
		if(e.keyCode==13){
			objSearchController.hitWebAjax(objData);	
		}
	});

    //search
    $("body").on("click","#search",function(e){
        e.preventDefault();
        var objData = {val:$.trim($("#q").val()),searchType:$('.woz-sm-activate').attr('st')};
        objSearchController.hitWebAjax(objData);  
    });

    // when some one click on the serach button
    $("body").on("click","#woz-search-all",function(e){
        e.preventDefault();
        var serchSource = $(this).attr('st');
        var objData = {val:$.trim($("#q").val()),searchType:serchSource};
        $('.woz-sm-activate').removeClass('woz-sm-activate');
        $(this).addClass('woz-sm-activate');
        objSearchController.hitWebAjax(objData);    
    });
    // when someone click on the web
    $("body").on("click","#woz-search-web",function(e){
        e.preventDefault();
        var serchSource = $(this).attr('st');
        var objData = {val:$.trim($("#q").val()),searchType:serchSource};
        $('.woz-sm-activate').removeClass('woz-sm-activate');
        $(this).addClass('woz-sm-activate');
        objSearchController.hitWebAjax(objData);
    });


});