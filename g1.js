// currently using body width as the default container for the gallery
// and the frames class, which assumes absolute pos and full screen
// this could be generalized into a Gallery object

// todo: change click to contruct a gallery, which keeps track of current index and frame
$('.frame').on('click', function (ev) {
	var selectedFrame = this;
	var selectedIndex = $(selectedFrame.parentNode).index();

	// set view to view-gallery
	// set frames to absolute and full screen
	view.classList.add('view-gallery');

	// set selected frame to z-index 1 to emphasize
	selectedFrame.classList.add('frame-selected');

	// construct gallery, showing selected frame first
	// btw, reason Carousel from before wasn't working:
	// assumed a single layer nested structure
	// if that was changed to just accept a container and an arbitrary set of panes...

	// show header and footer for img, should this be part of moveGalleryTo?
	// move all frames positions using translate3d
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
	// bind cancel event to cancel icon
	// remove frame-selected now that everything is placed
	// selectedFrame.classList.remove('frame-selected')
})

// todo: make this a gallery method
// calculate first index negative position based on selected frame index
var moveGalleryTo = function (selectedIndex) {
	var firstFramePos = (selectedIndex * (bodyWidth + 80)) * -1;
	for (var i = 0; i < frames.length; i++) {
		var pos = firstFramePos + (i * (bodyWidth + 80));
		frames[i].style.transform = 'translate3d(' + pos + 'px,0,0)';
		frames[i].style.mozTransform = 'translate3d(' + pos + 'px,0,0)';
		frames[i].style.webkitTransform = 'translate3d(' + pos + 'px,0,0)';
	}
}
