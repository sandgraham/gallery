'use strict';

(function(){
    var view = document.querySelector('.view');
    var nodes = document.querySelectorAll('.node');
    var detail = document.querySelector('.detail');
    var detailTitle = document.querySelector('.detail_title');
    
    var imageTitles = [];
    var currentIndex = 0;

    var PAN_LIMIT = 20;
    var PAN_WIDTH = document.body.clientWidth + 100;

    var init = function () {
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];

            positionNode(node);
            addTapListener(node, i);
            imageTitles.push(node.children[0].getAttribute('alt'));
        }

        // attach initial listeners for pan and close
        var viewHammer = new Hammer.Manager(view);
        viewHammer.add(new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 10 }));
        viewHammer.on('panstart panmove panend pancancel', pan);

        var closeGalleryHammer = new Hammer.Manager(document.querySelector('.detail_closeGallery'));
        closeGalleryHammer.add(new Hammer.Tap());
        closeGalleryHammer.on('tap', closeGallery);

        view.classList.add('fs');
    }

    var positionNode = function (node) {
        node.style.top = node.nTop = node.offsetTop + 'px';
        node.style.left = node.nLeft = node.offsetLeft + 'px';

        setTimeout(function() {
            node.classList.add('absolute');
        }, 100);
    }

    var addTapListener = function (node, index) {
        var nodeHammer = new Hammer.Manager(node);
        nodeHammer.add( new Hammer.Tap() );
        nodeHammer.on('tap', function(){
            if (view.classList.contains('gallery')) {
                toggleDetail();
            } else {
                openGallery(index);
            }
        });
    }

    var toggleDetail = function () {
        if (detail.classList.contains('detail-show')) {
            detail.classList.remove('detail-show');
        } else {
            detail.classList.add('detail-show');
        }
    }

    var openGallery = function (index) {
        view.classList.add('gallery');
        nodes[index].classList.add('front');

        for (var i = 0; i < nodes.length; i++) {
            nodes[i].style.top = 0;
            nodes[i].style.left = 0;
        }

        show(index, 0, true);
        toggleDetail();
    }

    var closeGallery = function () {
        view.classList.add('animate');
        view.classList.remove('gallery');
        detail.classList.remove('detail-show');

        var translate = 'none';
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].style.top = nodes[i].nTop;
            nodes[i].style.left = nodes[i].nLeft;
            nodes[i].style.transform = translate;
            nodes[i].style.mozTransform = translate;
            nodes[i].style.webkitTransform = translate;
        }

        var scroll = requestAnimationFrame(function scrolling (){
            nodes[currentIndex].scrollIntoViewIfNeeded();
            scroll = requestAnimationFrame(scrolling);
        });

        setTimeout(function(){
            cancelAnimationFrame(scroll);
            nodes[currentIndex].classList.remove('front');
        }, 600);
    }

    var moveToNode = function (node) {
        requestAnimationFrame( moveToNode );
    }

    var show = function (showIndex, percent, animate) {
        showIndex = Math.max(0, Math.min(showIndex, nodes.length - 1));
        percent = percent || 0;

        if (animate) {
            view.classList.add('animate');
            detailTitle.textContent = imageTitles[showIndex];
        } else {
            view.classList.remove('animate');
        }

        document.querySelector('.front').classList.remove('front');
        nodes[showIndex].classList.add('front');

        var pos, translate;
        for (var i = 0; i < nodes.length; i++) {
            pos = (PAN_WIDTH / 100) * (((i - showIndex) * 100) + percent);

            translate = 'translate3d(' + pos + 'px, 0, 0)';

            if (i !== showIndex) {
                translate += ' scale(.6)'
            }

            nodes[i].style.transform = translate;
            nodes[i].style.mozTransform = translate;
            nodes[i].style.webkitTransform = translate;        
        }

        currentIndex = showIndex;
    }

    var pan = function (ev) {
        if (!view.classList.contains('gallery')) return;

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

        show(currentIndex, percent, animate);
    }

    // start app
    init();

})();