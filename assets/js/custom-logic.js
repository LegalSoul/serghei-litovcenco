import PhotoSwipeLightbox from './photoswipe-lightbox.esm.min.js';
import PhotoSwipe from './photoswipe.esm.min.js';

const global_swiper_photoswipe_loop_setting = false;

(function($) {
$(document).ready(function(){
	// alert("ready");

	$(".lightBoxVideoLink").each(function(){ $(this).simpleLightbox(); });

	$(".mySwiper").each(function(index){
		const calcSlidesPerViewMobile = $(this).attr("swiper-size") ? parseInt($(this).attr("swiper-size")) : 2;
		const calcSlidesPerViewDesktop = $(this).attr("swiper-size-mobile") ? parseInt($(this).attr("swiper-size")) : 3;
		let currentSwiper = new Swiper(this, {
			slidesPerView: calcSlidesPerViewMobile,
			slidesPerGroup: calcSlidesPerViewMobile,
			spaceBetween: 10,
			centeredSlides: false,
			grabCursor: true,
			// touchEventsTarget: "container",
			touchEventsTarget: "wrapper",
			threshold: 2,
		
			loop: global_swiper_photoswipe_loop_setting,
			pagination: {
				el: '.swiper-pagination',
				clickable: true
			},
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
			breakpoints: {
				// when window width is >= 768 (tablet, desktop)
				768: {
					slidesPerView: calcSlidesPerViewDesktop,
					slidesPerGroup: calcSlidesPerViewDesktop,
				}
			},
			keyboard: { enabled: false },
			preventClicks: true,
		});

		setupPhotoswipe(currentSwiper);

	});

	setHueRotation();



});
})(jQuery);


function setHueRotation() {
	setInterval(function(){
		let timeStamp = new Date().getTime() / 1.3;
		let degreesValue = Math.round( Math.sin(timeStamp / 1000) * 35 ) + 10;
		// console.log(timeStamp);
		// console.log(degreesValue);
		// console.log("----------");
		$("#main-image-with-hue").css("filter", "hue-rotate("+ degreesValue + "deg" +")")
	}, 50);
}


function setupPhotoswipe(mainSwiper) {
	const photo_swipe_options = {
		gallery: mainSwiper.$el,
		pswpModule: PhotoSwipe,
		children: 'a',

		// initialZoomLevel: (zoomLevelObject) => {
		// 	// console.log(zoomLevelObject);
		// 	// let isLandscapeWindow = (zoomLevelObject.panAreaSize.x > zoomLevelObject.panAreaSize.y);
		// 	let isLandscapeImage = (zoomLevelObject.elementSize.x > zoomLevelObject.elementSize.y);
		// 	let zoomX = zoomLevelObject.panAreaSize.x / zoomLevelObject.elementSize.x;
		// 	let zoomY = zoomLevelObject.panAreaSize.y / zoomLevelObject.elementSize.y;
		// 	let resultingZoom = zoomX < zoomY ? zoomX : zoomY;
		// 	return resultingZoom;
		// },
		// maxZoomLevel: 10,


		loop: global_swiper_photoswipe_loop_setting,
		showHideAnimationType: 'zoom', /* options: fade, zoom, none */
		/* ## Hiding a specific UI element ## */

		close: true,
		tapAction: 'close',
		counter: !global_swiper_photoswipe_loop_setting,
		arrowKeys: true,
		/* ## Options ## */
		bgOpacity: 0.9,/* deafult: 0.8 */
		// wheelToZoom: true, /* deafult: undefined */
	};

	const lightbox = new PhotoSwipeLightbox(photo_swipe_options);

	lightbox.init();

	lightbox.on('uiRegister', function() {
		lightbox.pswp.ui.registerElement({
			name: 'custom-caption',
			order: 9,
			isButton: false,
			appendTo: 'root',
			html: 'Caption text',
			onInit: (el, pswp) => {
				lightbox.pswp.on('change', () => {
					const currSlideElement = lightbox.pswp.currSlide.data.element;
					let captionHTML = '';
					if (currSlideElement) {
						const hiddenCaption = currSlideElement.querySelector('.hidden-caption-content');
						if (hiddenCaption) {
							// get caption from element with class hidden-caption-content
							captionHTML = hiddenCaption.innerHTML;
						} else {
							// get caption from alt attribute
							captionHTML = currSlideElement.querySelector('img').getAttribute('alt');
						}
					}
					el.innerHTML = captionHTML || '';
					if (captionHTML) {
						$(el).show();
					} else {
						$(el).hide();
					}
				});
			}
		});
	});

}

function isPhonePortrait() {
	return window.matchMedia('(max-width: 600px) and (orientation: portrait)').matches;
}