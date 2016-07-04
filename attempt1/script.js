(function () {
  var PAGE_TURN_THRESHOLD = .33,
      PAGE_GAP = 50;
  var pages = sel('.page'),
      currentIndex = 0; // this should be set based on selection

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

  function transform (elem, trans) {
    elem.style.transform = trans;
    elem.style.mozTransform = trans;
    elem.style.webkitTransform = trans;
  };

  function addPageGestures (page) {
    var pageHammer = new Hammer(page, {
        recognizers: [ [Hammer.Pan] ]
      }
    );

    pageHammer.on('panstart panmove panend pancancel', function (ev) {
      panImage(page, ev);
    })
  }

  function panImage(page, ev) {
    var translate, img = page.querySelector('img');

    // if pan ending, reset to base or turn page
    if (ev.type == 'panend' || ev.type == 'pancancel') {
      img.classList.add('animate');

      // turn page if past threshold or reset
      if (Math.abs(ev.deltaX) > page.clientWidth * PAGE_TURN_THRESHOLD) {
        shiftPages(ev.deltaX);
      }

      // reset image
      translate = 'translate3d(0,0,0)';
      transform(img, translate);
    }
    // otherwise move image with pan
    else {
      img.classList.remove('animate');
      translate = 'translate3d(' + ev.deltaX + 'px, 0, 0)';
      transform(img, translate);
    }
  }

  function shiftLeft () {
    console.log('move all pages LEFT');

    currentIndex += 1;

    for (var i = 0; i < pages.length; i++) {
      var translate, newX, page = pages[i];

      page.currentX = page.currentX - (page.clientWidth + PAGE_GAP);

      translate = 'translate3d(' + page.currentX + 'px,0,0)';
      transform(page, translate);
    }
  };

  function shiftRight () {
    console.log('move all pages RIGHT');
  }

  function shiftPages (delta) {
    for (var i = 0; i < pages.length; i++) {
      var translate, newX, dir, page = pages[i];

      shift = Math.sign(delta) * (page.clientWidth + PAGE_GAP); 
      page.currentX = page.currentX + shift;

      translate = 'translate3d(' + page.currentX + 'px,0,0)';
      transform(page, translate);
    }
  }
})();
