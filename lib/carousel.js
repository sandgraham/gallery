function Carousel(container, threshold, gap) {
    this.container = container;
    this.threshold = threshold || 20;
    this.gap = gap || 100;

    this.panes = Array.prototype.slice.call(this.container.children, 0);
    this.containerSize = this.container.offsetWidth + this.gap;

    this.currentIndex = 0; // should accept an input

    this.hammer = new Hammer.Manager(this.container);
    this.hammer.add(new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 10 }));
    this.hammer.on("panstart panmove panend pancancel", Hammer.bindFn(this.onPan, this));

    this.show(this.currentIndex);
}


Carousel.prototype = {

    // show the indicated pane with percent visible and optional animate
    show: function(showIndex, percent, animate){
        showIndex = Math.max(0, Math.min(showIndex, this.panes.length - 1));
        percent = percent || 0;

        if (animate) {
            this.container.classList.add('animate');
        } else {
            this.container.classList.remove('animate');
        }

        var paneIndex, pos, translate;
        for (paneIndex = 0; paneIndex < this.panes.length; paneIndex++) {
            pos = (this.containerSize / 100) * (((paneIndex - showIndex) * 100) + percent);
            
            translate = 'translate3d(' + pos + 'px, 0, 0)';

            if (paneIndex !== showIndex) {
                translate += ' scale(.9)';
            }

            this.panes[paneIndex].style.transform = translate;
            this.panes[paneIndex].style.mozTransform = translate;
            this.panes[paneIndex].style.webkitTransform = translate;
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
    }
};
