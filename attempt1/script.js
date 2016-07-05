(function () {
  var PAGE_TURN_THRESHOLD = .2, PAGE_GAP = 50;
  
  var pages = sel('.page');
  var currentIndex = 0; // this should be set based on selection

  // prepare each page's position and gesture handling.
  for (var i = 0; i < pages.length; i++) {
    var x, translate, page = pages[i];

    page.currentX = i * ( page.clientWidth + PAGE_GAP );
    translate = 'translate3d(' + page.currentX + 'px,0,0)';
    if (i > 0) translate += ' scale(.9)';
    transform(page, translate);

    addPageGestures(page);
  }


  // Functions

  function sel (selector, first) {
    return first ? document.querySelector(selector) : document.querySelectorAll(selector);
  };

  Math.sign = Math.sign || function(x) {
    x = +x; // convert to a number
    if (x === 0 || isNaN(x)) {
      return x;
    }
    return x > 0 ? 1 : -1;
  }

  function transform (elem, trans) {
    elem.style.transform = trans;
    elem.style.mozTransform = '-moz-' + trans;
    elem.style.webkitTransform = '-webkit-' + trans;
  };

  function addPageGestures (page) {
    var pageHammer = new Hammer(page, {
        recognizers: [ [Hammer.Pan] ]
      }
    );

    pageHammer.on('panstart panmove panend pancancel', function (ev) {
      panPage(page, ev);
    })
  }

  function panPage(page, ev) {
    var translate;

    // if pan ending, turn page or reset to base position
    if (ev.type == 'panend' || ev.type == 'pancancel') {
      page.classList.add('animate');

      if (shiftOkay(ev.deltaX) && (Math.abs(ev.deltaX) > page.clientWidth * PAGE_TURN_THRESHOLD)) {
        // turn page if not end and pan is past threshold
        shiftPages(ev.deltaX);
      } else {
        // reset page
        translate = 'translate3d(0,0,0)';
        transform(page, translate);
      }
    }
    // otherwise move page with pan
    else {
      page.classList.remove('animate');
      translate = 'translate3d(' + ev.deltaX + 'px, 0, 0)';
      transform(page, translate);
    }
  }

  function shiftOkay(delta) {
    return !(currentIndex == 0 && delta > 0 || currentIndex == pages.length - 1 && delta < 0);
  }

  function shiftPages (delta) {
    currentIndex -= Math.sign(delta);

    for (var i = 0; i < pages.length; i++) {
      var translate, newX, dir, page = pages[i];

      page.classList.add('animate');

      shift = Math.sign(delta) * (page.clientWidth + PAGE_GAP); 
      page.currentX = page.currentX + shift;

      translate = 'translate3d(' + page.currentX + 'px,0,0)';
      if (i !== currentIndex) translate += ' scale(.9)';
      transform(page, translate);
    }
  }
})();
