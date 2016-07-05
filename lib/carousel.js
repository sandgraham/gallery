function Carousel(container, threshold, gap) {
    this.container = container;
    this.threshold = threshold || 20;
    this.gap = gap || 100;

    this.pages = Array.prototype.slice.call(this.container.children, 0);
    this.containerSize = this.container.offsetWidth + this.gap;

    this.currentIndex = 0; // should accept an input
    this.hideDetails = false;
    this.headerTitle = document.querySelector('.header_title');

    this.hammer = new Hammer.Manager(this.container);
    this.hammer.add(new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 10 }));
    this.hammer.on("panstart panmove panend pancancel", Hammer.bindFn(this.onPan, this));
    this.hammer.add(new Hammer.Tap());
    this.hammer.on('tap', Hammer.bindFn(this.onTap, this));

    this.show(this.currentIndex);
}


Carousel.prototype = {

    // show the indicated page with percent visible and optional animate
    show: function(showIndex, percent, animate){
        showIndex = Math.max(0, Math.min(showIndex, this.pages.length - 1));
        percent = percent || 0;

        if (animate) {
            this.container.classList.add('animate');
        } else {
            this.container.classList.remove('animate');
        }

        // Update header
        this.headerTitle.innerText = this.pages[showIndex].getAttribute('data-title');

        var pageIndex, pos, translate;
        for (pageIndex = 0; pageIndex < this.pages.length; pageIndex++) {
            pos = (this.containerSize / 100) * (((pageIndex - showIndex) * 100) + percent);
            
            translate = 'translate3d(' + pos + 'px, 0, 0)';

            if (pageIndex !== showIndex) {
                translate += ' scale(.9)';
            }

            this.pages[pageIndex].style.transform = translate;
            this.pages[pageIndex].style.mozTransform = translate;
            this.pages[pageIndex].style.webkitTransform = translate;
        }

        this.currentIndex = showIndex;
    },

    // handle a pan event
    onPan : function (ev) {
        var delta = ev.deltaX;
        var percent = (100 / this.containerSize) * delta;
        var animate = false;

        if (ev.type == 'panend' || ev.type == 'pancancel') {
            if (Math.abs(percent) > this.threshold && ev.type == 'panend') {
                this.currentIndex += (percent < 0) ? 1 : -1;
            }
            percent = 0;
            animate = true;
        }

        this.show(this.currentIndex, percent, animate);
    },

    // tap to show or hide image details
    onTap : function (ev) {
        if (this.hideDetails) {
            document.body.classList.remove('hideDetails')
        } else {
            document.body.classList.add('hideDetails')
        }
        this.hideDetails = !this.hideDetails;
    }
};
