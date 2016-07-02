
var thumbnails = document.querySelectorAll('.thumbnail_img');
var hammers = [];

for (var i = 0; i < thumbnails.length; i++) {
	var img = thumbnails[i];

	var mc = new Hammer(img);
	mc.on('tap', tap_thumbnail)
	hammers.push(mc);

	set_orientation(img);
}

function tap_thumbnail (ev) {
	// zoom into image
	console.log(ev.target);
}


function set_orientation (img_node) {
	if (img_node.naturalWidth > img_node.naturalHeight) {
		img_node.orientation = 'landscape';
		img_node.classList.add('img-landscape');
	} else if (img_node.naturalWidth < img_node.naturalHeight) {
		img_node.orientation = 'portrait';
		img_node.classList.add('img-portrait');
	} else {
		img_node.orientation = 'square';
		img_node.classList.add('img-square');
	}
}

function is_portrait (img_node) {
	return img_node.naturalHeight > img_node.naturalWidth;
}

function is_landscape (img_node) {
	return img_node.naturalWidth > img_node.naturalHeight;
}

function is_square (img_node) {
	return img_node.naturalHeight === img_node.naturalWidth;
}