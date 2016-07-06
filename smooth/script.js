// var gallery = new Gallery(document.querySelector('.gallery'));

var units = document.querySelectorAll('.unit');
for (var i = 0; i < units.length; i++) {
	units[i].addEventListener('click', function (ev) {
		if (this.classList.contains('unit-open')) {
			this.classList.remove('unit-open');
		} else {
			this.classList.add('unit-open');
		}
	});
}