var bodyWidth = document.body.clientWidth;
var bodyHeight = document.body.clientHeight;

var frames = $('.frame');

$('.frame').on('click', function (ev) {
	var selectedFrame = this;
	var selectedIndex = $(selectedFrame.parentNode).index();

	// set view to view-gallery
	$('.view').addClass('view-gallery');

	// set selected frame to absolute and full screen
	// set selected frame to z-index 1 to emphasize growing transition
	selectedFrame.classList.add('frame-selected')

	// move other frames to offscreen positions using translate3d
	// calculate first index negative position based on selected frame index
	moveGalleryTo(selectedIndex);

	// set up listeners
	// create hammer for horizontal swipe events and taps
	// for now use arrow keys
	$(document).on('keyup', function (ev) {
		if (ev.keyCode === 37) {
			// left
			moveGalleryTo(selectedIndex-1);
			selectedIndex -= 1;
		}
		else if (ev.keyCode == 39) {
			// right
			moveGalleryTo(selectedIndex+1);
			selectedIndex += 1;
		}
	});

	// show header and footer for img
	// bind cancel event to cancel icon
	// remove frame-selected now that everything is placed
	// selectedFrame.classList.remove('frame-selected')
})

var moveGalleryTo = function (selectedIndex) {
	var firstFramePos = (selectedIndex * (bodyWidth + 80)) * -1;
	for (var i = 0; i < frames.length; i++) {
		var pos = firstFramePos + (i * (bodyWidth + 80));
		frames[i].style.transform = 'translate3d(' + pos + 'px,0,0)';
		frames[i].style.mozTransform = 'translate3d(' + pos + 'px,0,0)';
		frames[i].style.webkitTransform = 'translate3d(' + pos + 'px,0,0)';
	}
}