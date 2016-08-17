$(function() {

	$('#imgFile').on('change', function() {
		$('#fileNum').html('点击重选文件(共' + this.files.length + '张) 鼠标停留显示文件列表');
	});
	$('#imgType').on('change', function() {
		if($(this).val() === 'jpg') {
			$('#blockquote-quality').addClass('blockquote-info');
		} else {
			$('#blockquote-quality').removeClass('blockquote-info');
		}
	})
	$('#start').on('click', function() {
		start($('#imgFile')[0].files);
	});
});
var IMGTYPE = {
	png: 'image/png',
	jpg: 'image/jpeg',
}

function start(files_) {
	var files = [];
	var drawN = 0;
	var canvas = document.createElement('canvas');
	var canvas2d = canvas.getContext("2d");
	var direction = $('#direction').val();
	var sortType = $('#sortType').val();
	if(sortType === 'name1' || sortType === 'name2') {
		var numTest = /(\d+)\.\w+$/;
		for(var i = 0; i < files_.length; i++) {
			files.push(files_[i]);
		}
		console.log(files);

		files.sort(function(a, b) {
			var nameA = a.name.match(numTest)[1],
				nameB = b.name.match(numTest)[1];
			if(sortType === 'name1') return(Number(nameA) - Number(nameB));
			else return(Number(nameB) - Number(nameA));
		});
	} else {
		files = files_;
	}

	function draw(num, img) {
		if(direction === 'horizontal') {
			canvas2d.drawImage(img, num * img.width, 0, img.width, img.height);
		} else {
			canvas2d.drawImage(img, 0, num * img.height, img.width, img.height);
		}
	}

	for(var i = 0; i < files.length; i++) {
		var img = new Image;
		img.num = i;
		img.name = files[i].name;
		$(img).on('load', function() {
			var img = this;
			console.log(this.num);
			console.log(this.name);
			if(drawN === 0) {
				if(direction === 'horizontal') {
					canvas.width = files.length * img.width;
					canvas.height = img.height;
				} else {
					canvas.width = img.width;
					canvas.height = files.length * img.height;
				}

			}
			draw(this.num, img);
			drawN++;
			if(drawN === files.length) {
				var imgType = $('#imgType').val();

				canvas.toBlob(function(data) {
					var imgUrl = URL.createObjectURL(data);
					var filename = $('#imgName').val() + '.' + imgType;
					var down = document.createElement('a');
					down.href = imgUrl;
					down.download = filename;
					var evt = document.createEvent("HTMLEvents");
					evt.initEvent("click", false, false);
					down.dispatchEvent(evt);
					URL.revokeObjectURL(imgUrl);
				}, IMGTYPE[imgType], $('#quality').val() / 100);
				//alert('拼接完毕');
			}
		});
		img.src = URL.createObjectURL(files[i]);
	}
}