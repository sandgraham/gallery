(function(){
	var PAN_LIMIT = 20;
	var view = document.querySelector('.view');
	var units = document.querySelectorAll('.unit');
	var frames = document.querySelectorAll('.frame');
	var imgs = document.querySelectorAll('img');
	var details = document.querySelector('.details');
	var detailHeader = document.querySelector('.detail-header');
	var title = document.querySelector('.detail_title');
	var detailFooter = document.querySelector('.detail-footer');
	var bodyWidth = document.body.clientWidth;
	var frameWidth = bodyWidth + 100;
	var currentIndex = 0;
	var initialFrame = frames[0];
	var viewHammerManager;
	var unitHammerManagers = [];

	var init = function () {
		initGrid();
		initHeader();
	}

	var initHeader = function () {
		var headerCloseElem = document.querySelector('.detail_close');
		var headerCloseHammer = new Hammer.Manager(headerCloseElem);
		headerCloseHammer.add(new Hammer.Tap());
		headerCloseHammer.on('tap', onHeaderClose);
	}

	// create hammer tap managers for units or reenable them
	var initGrid = function () {
		if (unitHammerManagers.length) {
			for (var i = 0; i < unitHammerManagers.length; i++) {
				unitHammerManagers[i].get('tap').set({enable: true});
			}
		} else {
			for (var i = 0; i < units.length; i++) {
				unitHammerManagers.push(createUnitHammerManager(units[i], i));
			}
		}
	}

	// create a hammer manager for the given unit, pass index as a favor
	var createUnitHammerManager = function (unitElem, index) {
		var unitHammerManager = new Hammer.Manager(unitElem);
		unitHammerManager.add(new Hammer.Tap());
		unitHammerManager.on('tap', function () {
			if (view.classList.contains('view-grid')) {
				openGalleryTo(index);
			}
		});

		return unitHammerManager;
	}

	// close gallery from currentIndex
	var closeGallery = function () {
		details.classList.remove('details-show');

		// push closing frame to front
		initialFrame.classList.remove('frame-selected');
		frames[currentIndex].classList.add('frame-selected');

		// transition to grid
		view.classList.remove('view-gallery')
		view.classList.add('view-grid')

		for (var i = 0; i < frames.length; i++) {
			frames[i].style.transform = 'none';
		    frames[i].style.mozTransform = 'none';
		    frames[i].style.webkitTransform = 'none';
		}

		viewHammerManager.get('pan').set({enable: false});
		viewHammerManager.get('tap').set({enable: false});

		initGrid();
	}

	var openGalleryTo = function (selectedIndex) {
		initialFrame = frames[selectedIndex];

		// give it a z-index to push image to front
		initialFrame.classList.add('frame-selected');

		// transition to gallery
		view.classList.add('view-gallery')
		view.classList.remove('view-grid')

		moveGalleryTo(selectedIndex, 0, true);
		details.classList.add('details-show');

		// set up manager for panning or reenable it
		if (viewHammerManager) {
			// disable handling for a beat before enabling again
			setTimeout(function(){
				viewHammerManager.get('pan').set({enable: true});
				viewHammerManager.get('tap').set({enable: true});
			}, 100);
		} else {
			viewHammerManager = new Hammer.Manager(view);
		   	viewHammerManager.add(new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 10 }));
		   	viewHammerManager.on('panstart panmove panend pancancel', onPanGallery);
		   	viewHammerManager.add(new Hammer.Tap());
	    	viewHammerManager.on('tap', onTapGallery);
		}
	}

	// move Gallery along x-axis
	var moveGalleryTo = function (showIndex, percent, animate) {
		showIndex = Math.max(0, Math.min(showIndex, frames.length - 1));
		percent = percent || 0;

		if (animate) {
			view.classList.add('animate-frames');

			setTitle(showIndex);
		} else {
			view.classList.remove('animate-frames');
		}

		var pos, translate;
		for (var i = 0; i < frames.length; i++) {
			pos = (frameWidth / 100) * (((i - showIndex) * 100) + percent);

			translate = 'translate3d(' + pos + 'px, 0, 0)';

			if (i !== showIndex) {
				translate += ' scale(.9)'
			}

			frames[i].style.transform = translate;
	        frames[i].style.mozTransform = translate;
	        frames[i].style.webkitTransform = translate;		
		}

		currentIndex = showIndex;
	}

	var onPanGallery = function (ev) {
		var delta = ev.deltaX;
		var percent = (100 / frameWidth) * delta;
		var animate = false;

		if (ev.type == 'panend' || ev.type == 'pancancel') {
	        if (Math.abs(percent) > PAN_LIMIT && ev.type == 'panend') {
	            currentIndex += (percent < 0) ? 1 : -1;
	        }
	        percent = 0;
	        animate = true;
	    }

	    moveGalleryTo(currentIndex, percent, animate);
	}

	// might add later
	var onTapGallery = function (ev) {
		toggleDetails();
	}

	// might add later
	var onHeaderClose = function () {
		closeGallery();
	}

	var toggleDetails = function () {
		if (details.classList.contains('details-show')) {
			details.classList.remove('details-show');
		} else {
			details.classList.add('details-show');
		}
	}

	var setTitle = function (newTitleIndex) {
		title.innerText = imgs[newTitleIndex].getAttribute('alt');
	}

	// start page in grid view
	init();
})();