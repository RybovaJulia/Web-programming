'use strict';

const POSTS_MAX_COUNT = 30;

$(document).ready(function(){
	var lastPostTime = 0;
	var responseData = [];
	var tag = "vscocam";
	function getTag(){
		return tag;
	};
	var source = $("#photo-entry-template").html();

	var renderingPhotoPosts = function(){
		var template = Handlebars.compile(source);
		$('.loaded-info').append(template({objects:responseData}));

		$('#loading').show();
		$(".photo-entry").empty();
		$.ajax({
	   		url: 'https://api.vk.com/method/photos.search?q='+tag+'&sort=0&count=20&radius=5000&v=V',
	   		type: 'GET',
	   		dataType: 'jsonp',
	   		crossDomain: true,
	   		success: function(data){
				   		data.response.reverse().forEach( function(entity) {
						if (entity.pid && lastPostTime < entity.created){
							responseData.push(entity);
							lastPostTime = entity.created;
							entity.createTime = Date.parse(entity.created);
							//entity.createTime = prettyDate(new Date(Date.parse(entity.created)).toLocaleString());	
						}
						while (responseData.length > POSTS_MAX_COUNT){
							responseData.pop();
						}
					});
					console.log("Got data on tag "+tag+" refreshing responseDatadata");
					console.log(responseData);
					$('#loading').hide();
					var html = template(data);
					$('.loaded-info').append(template({objects:responseData}));
				},
			error: function(){
				console.log("Cannot retrieve data from [https://api.vk.com]");
				$('#loading').hide();
				}
		});
	}

	renderingPhotoPosts(getTag());

	var timer = setTimeout(function repeat(){
			renderingPhotoPosts(getTag());
			timer = setTimeout(repeat, 20000);
		}, 20000);
})

/*
	$(".loading").hide();

	$("#search-act").on('submit', function(event){
		event.preventDefault();
		$(".loading").show();

		$(".photo-entry").empty();

		tag = $("#tag-filter").val();
		console.log("Tag "+tag+" submited!");

		while(responseData.length){
			responseData.pop();
		};

	});

	function httpGetPhotos(tag){
		$.ajax({
	   		url: 'https://api.vk.com/method/photos.search?q='+tag+'&count=20&v=V',
	   		type: 'GET',
	   		dataType: 'jsonp',
	   		crossDomain: true,
	   		success: function(data){
				console.log("Got data on tag "+tag+" refreshing responseDatadata");
	   			renderPhotoPosts(data);
				}
		})
	};
	
	function renderPhotoPosts(data){
		data.response.forEach ( function (entity) {
			if (entity.pid && lastPostTime < entity.created){
				responseData.push(entity);
				lastPostTime = entity.created;	
			}
			while (responseData.length > POSTS_MAX_COUNT){
				responseData.pop();
			}
		});
		console.log(responseData);
		$(".photo-entry").empty();
		var source = $("#photo-entry-template").html();
		var template = Handlebars.compile(source);
		$('.loaded-info').append(template({objects:responseData}));
	}

	httpGetPhotos(getTag());
	setInterval(httpGetPhotos(getTag()), 20000);
});
*/