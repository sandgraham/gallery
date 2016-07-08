(function(){
	var view = document.querySelector('.view');
    var detail = document.querySelector('.detail');
    var detailTitle = document.querySelector('.detail_title');

	var units = document.querySelectorAll('.grid_unit');
	var frames = document.querySelectorAll('.frame');

	var PAN_LIMIT = 20;
	var PAN_WIDTH = document.body.clientWidth + 100;

    // TODO: Create Gallery and Grid objects to wrap all this loose behavior/data up.
    var imageTitles = [];
    var unitHammerManagers = [];
    var viewHammerManager,
        currentIndex,
        initialFrame;

	var init = function () {
		initGrid();
		initHeader();
        getImageTitles();
	}

	var initHeader = function () {
		var closeGalleryElem = document.querySelector('.detail_closeGallery');
		var closeGalleryHammer = new Hammer.Manager(closeGalleryElem);
		closeGalleryHammer.add(new Hammer.Tap());
		closeGalleryHammer.on('tap', closeGallery);
	}

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

	var createUnitHammerManager = function (unitElem, index) {
		var unitHammerManager = new Hammer.Manager(unitElem);
		unitHammerManager.add(new Hammer.Tap());
		unitHammerManager.on('tap', function () {
			if (!view.classList.contains('gallery')) {
				openGalleryTo(index);
			}
		});

		return unitHammerManager;
	}

	var closeGallery = function () {
		detail.classList.remove('detail-show');

		// push closing frame to front
		initialFrame.classList.remove('frame-selected');
		frames[currentIndex].classList.add('frame-selected');

		// transition to grid
		view.classList.remove('gallery');

        units[currentIndex].scrollIntoViewIfNeeded();

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

		// give it a z-index to push selected frame to front
		initialFrame.classList.add('frame-selected');

		// transition to gallery
		view.classList.add('gallery')

		moveGalleryTo(selectedIndex, 0, true);
		detail.classList.add('detail-show');

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
	    	viewHammerManager.on('tap', toggleDetail);
		}
	}

	// Move frames along x-axis
	var moveGalleryTo = function (showIndex, percent, animate) {
		showIndex = Math.max(0, Math.min(showIndex, frames.length - 1));
		percent = percent || 0;

		if (animate) {
			view.classList.add('view-animateFrames');
			detailTitle.textContent = imageTitles[showIndex];
		} else {
			view.classList.remove('view-animateFrames');
		}

		var pos, translate;
		for (var i = 0; i < frames.length; i++) {
			pos = (PAN_WIDTH / 100) * (((i - showIndex) * 100) + percent);

			translate = 'translate3d(' + pos + 'px, 0, 0)';

			if (i !== showIndex) {
				translate += ' scale(.8)'
			}

			frames[i].style.transform = translate;
	        frames[i].style.mozTransform = translate;
	        frames[i].style.webkitTransform = translate;		
		}

		currentIndex = showIndex;
	}

	var onPanGallery = function (ev) {
		var delta = ev.deltaX;
		var percent = (100 / PAN_WIDTH) * delta;
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

	var toggleDetail = function () {
		if (detail.classList.contains('detail-show')) {
			detail.classList.remove('detail-show');
		} else {
			detail.classList.add('detail-show');
		}
	}

    // Seems a bit circuitous
    var getImageTitles = function () {
        for (var i = 0; i < frames.length; i++) {
            var title = frames[i].children[0].getAttribute('alt');
            imageTitles.push(title);
        }
    }

	// Start the page in Grid View.
	init();
})();