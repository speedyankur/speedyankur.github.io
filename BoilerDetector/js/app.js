var imgHeight, imgWidth;
var newWidth, newHeight;
var shapes = [];
var stage, layer;
var bg;
var selectedShape;
var isDragging = false;

var isTextMode = false;
var currentTextGroup;
var projectID = 'ebed371c-7b62-4c63-a100-c6dbdc871ff8';
var publishedName = 'Iteration1';
var predictionKey = 'ffd5506b2b924715b62a58843b67b578';
 
$(document).ready(function() {
	var maxWidth = $('.col-md-12').width() - 20;
	var maxHeight = window.screen.availHeight - 200;	
	$('#open').change(function(evt) {
		var files = evt.target.files; // FileList object

		// Loop through the FileList and render image files as thumbnails.
		for (var i = 0, f; f = files[i]; i++) {

			// Only process image files.
			if (!f.type.match('image.*')) {
			continue;
			}

			var reader = new FileReader();

			// Closure to capture the file information.
			reader.onload = (function(theFile) {
			return function(e) {

				var imageObj = new Image();
				imageObj.onload = function() {
					var height = imageObj.height;
					var width = imageObj.width;
					/*
					 *Image data: (wi, hi) and define ri = wi / hi
					 * Screen resolution: (ws, hs) and define rs = ws / hs
					 * Scaled image dimensions:
					 * rs > ri ? (wi * hs/hi, hs) : (ws, hi * ws/wi)
					 */

					newWidth = width, newHeight = height;
					//console.log(height + "x" + width);
					if ((maxWidth / maxHeight) > (width / height)) {
						newWidth = width*(maxHeight/height);
						newHeight = maxHeight;				
					} else {
						newWidth = maxWidth;
						newHeight = height*(maxWidth/width);								
					}
					//console.log(newHeight + "x" + newWidth);
					bg = new Kinetic.Image({
				        x: newWidth/2,
						y: newHeight/2,
						image : imageObj,
						height : newHeight,
						width : newWidth,
						offset: {
				            x: newWidth/2,
				            y: newHeight/2
				        }				
					});

					stage = new Kinetic.Stage({
						container : 'container',
						width : $('.col-md-12').width() - 20,
						height : newHeight,
						width : newWidth
					});
					layer = new Kinetic.Layer();
					stage.add(layer);
					// add the shape to the layer
					layer.add(bg);
					layer.draw();
				};
				imageObj.src = e.target.result;				

			};
			})(f);

			// Read in the image file as a data URL.
			reader.readAsDataURL(f);	
		}	
	});

	$('#save').click(function() {
		var form = $('#fileUploadForm')[0];

		var data = new FormData(form);	
		var URL = `https://westeurope.api.cognitive.microsoft.com/customvision/v3.0/Prediction/${projectID}/detect/iterations/${publishedName}/image`;
		$.ajax({
			type: "POST",
			beforeSend: function(request) {
			  request.setRequestHeader("Prediction-Key", predictionKey);
			  //request.setRequestHeader("Content-Type", 'application/json');
			},
			url: URL,
			data:data,
			enctype: 'multipart/form-data',
			processData: false,  // Important!
			contentType: false,
			cache: false,
			success: function(result) {
			  console.log(result);
			  var predictions = result.predictions;
			  for(i=0;i<predictions.length;i++){
				  if(predictions[i].probability>0.75){
					  var box = predictions[i].boundingBox;
					  Rectangle(box);
				  }
			  }
			}
		  });
	});

	function Rectangle(box) {

		var rect = new Kinetic.Rect({
			x : box.left*stage.width(),
			y : box.top*stage.height(),
			width : box.width*stage.width(),
			height : box.height*stage.height(),
			stroke : 'red',
			strokeWidth : '5',
			draggable : false,
			startX : box.left,
			startY : box.top
		});
		shapes.push(rect);
		layer.add(rect);
		layer.draw();

		return rect;
	}

});
