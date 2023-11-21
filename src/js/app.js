import * as webpFunctions from "./modules/functions.js";

webpFunctions.isWebp();

// Spoiler (dropdown)
let _slideUp = (target, duration = 500, showmore = 0) => {
	if (!target.classList.contains("_slide")) {
		target.classList.add("_slide");
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + "ms";
		target.style.height = `${target.offsetHeight}px`;
		target.offsetHeight;
		target.style.overflow = "hidden";
		target.style.height = showmore ? `${showmore}px` : `0px`;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout(() => {
			target.hidden = !showmore ? true : false;
			!showmore ? target.style.removeProperty("height") : null;
			target.style.removeProperty("padding-top");
			target.style.removeProperty("padding-bottom");
			target.style.removeProperty("margin-top");
			target.style.removeProperty("margin-bottom");
			!showmore ? target.style.removeProperty("overflow") : null;
			target.style.removeProperty("transition-duration");
			target.style.removeProperty("transition-property");
			target.classList.remove("_slide");
			// Создаем событие
			document.dispatchEvent(
				new CustomEvent("slideUpDone", {
					detail: {
						target: target
					}
				})
			);
		}, duration);
	}
};
let _slideDown = (target, duration = 500, showmore = 0) => {
	if (!target.classList.contains("_slide")) {
		target.classList.add("_slide");
		target.hidden = target.hidden ? false : null;
		showmore ? target.style.removeProperty("height") : null;
		let height = target.offsetHeight;
		target.style.overflow = "hidden";
		target.style.height = showmore ? `${showmore}px` : `0px`;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + "ms";
		target.style.height = height + "px";
		target.style.removeProperty("padding-top");
		target.style.removeProperty("padding-bottom");
		target.style.removeProperty("margin-top");
		target.style.removeProperty("margin-bottom");
		window.setTimeout(() => {
			target.style.removeProperty("height");
			target.style.removeProperty("overflow");
			target.style.removeProperty("transition-duration");
			target.style.removeProperty("transition-property");
			target.classList.remove("_slide");
			// Создаем событие
			document.dispatchEvent(
				new CustomEvent("slideDownDone", {
					detail: {
						target: target
					}
				})
			);
		}, duration);
	}
};
let _slideToggle = (target, duration = 500) => {
	if (target.hidden) {
		return _slideDown(target, duration);
	} else {
		return _slideUp(target, duration);
	}
};
function dataMediaQueries(array, dataSetValue) {
	// Получение объектов с медиа запросами
	const media = Array.from(array).filter(function (item, index, self) {
		if (item.dataset[dataSetValue]) {
			return item.dataset[dataSetValue].split(",")[0];
		}
	});
	// Инициализация объектов с медиа запросами
	if (media.length) {
		const breakpointsArray = [];
		media.forEach((item) => {
			const params = item.dataset[dataSetValue];
			const breakpoint = {};
			const paramsArray = params.split(",");
			breakpoint.value = paramsArray[0];
			breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
			breakpoint.item = item;
			if (item.hasAttribute("data-em")) {
				breakpoint.dataEm = true;
			}
			breakpointsArray.push(breakpoint);
		});
		// Получаем уникальные брейкпоинты
		let mdQueries = breakpointsArray.map(function (item) {
			if (item.dataEm) {
				item.value = (item.value / 16).toString();
				return (
					"(" +
					item.type +
					"-width: " +
					item.value +
					"em)," +
					item.value +
					"," +
					item.type
				);
			} else {
				return (
					"(" +
					item.type +
					"-width: " +
					item.value +
					"px)," +
					item.value +
					"," +
					item.type
				);
			}
			// item.value = (item.value / 16).toString()
			// return '(' + item.type + "-width: " + item.value + "em)," + item.value + ',' + item.type;
		});
		mdQueries = uniqArray(mdQueries);
		const mdQueriesArray = [];

		if (mdQueries.length) {
			// Работаем с каждым брейкпоинтом
			mdQueries.forEach((breakpoint) => {
				const paramsArray = breakpoint.split(",");
				const mediaBreakpoint = paramsArray[1];
				const mediaType = paramsArray[2];
				const matchMedia = window.matchMedia(paramsArray[0]);
				// Объекты с нужными условиями
				const itemsArray = breakpointsArray.filter(function (item) {
					if (item.value === mediaBreakpoint && item.type === mediaType) {
						return true;
					}
				});
				mdQueriesArray.push({
					itemsArray,
					matchMedia
				});
			});
			return mdQueriesArray;
		}
	}
}
function spollers() {
	const spollersArray = document.querySelectorAll("[data-spollers]");
	if (spollersArray.length > 0) {
		// Получение обычных слойлеров
		const spollersRegular = Array.from(spollersArray).filter(function (
			item,
			index,
			self
		) {
			return !item.dataset.spollers.split(",")[0];
		});
		// Инициализация обычных слойлеров
		if (spollersRegular.length) {
			initSpollers(spollersRegular);
		}
		let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
		if (mdQueriesArray && mdQueriesArray.length) {
			mdQueriesArray.forEach((mdQueriesItem) => {
				// Событие
				// mdQueriesItem.matchMedia.addEventListener("change", function () {
				// 	initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
				// });
				mdQueriesItem.matchMedia.onchange = () => {
					initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
				};
				initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
			});
		}
		// Инициализация
		function initSpollers(spollersArray, matchMedia = false) {
			spollersArray.forEach((spollersBlock) => {
				spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
				if (matchMedia.matches || !matchMedia) {
					spollersBlock.classList.add("_spoller-init");
					initSpollerBody(spollersBlock);
					spollersBlock.addEventListener("click", setSpollerAction);
				} else {
					spollersBlock.classList.remove("_spoller-init");
					initSpollerBody(spollersBlock, false);
					spollersBlock.removeEventListener("click", setSpollerAction);
				}
			});
		}
		// Работа с контентом
		function initSpollerBody(spollersBlock, hideSpollerBody = true) {
			let spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
			if (spollerTitles.length) {
				spollerTitles = Array.from(spollerTitles).filter(
					(item) => item.closest("[data-spollers]") === spollersBlock
				);
				spollerTitles.forEach((spollerTitle) => {
					if (hideSpollerBody) {
						spollerTitle.removeAttribute("tabindex");
						if (!spollerTitle.classList.contains("_spoller-active")) {
							spollerTitle.parentElement.nextElementSibling.hidden = true;
						}
					} else {
						spollerTitle.setAttribute("tabindex", "-1");
						spollerTitle.parentElement.nextElementSibling.hidden = false;
					}
				});
			}
		}
		function setSpollerAction(e) {
			const el = e.target;
			if (el.closest("[data-spoller]")) {
				const spollerTitle = el.closest("[data-spoller]");
				const spollersBlock = spollerTitle.closest("[data-spollers]");
				const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
				const spollerSpeed = spollersBlock.dataset.spollersSpeed
					? parseInt(spollersBlock.dataset.spollersSpeed)
					: 500;
				if (!spollersBlock.querySelectorAll("._slide").length) {
					if (oneSpoller && !spollerTitle.classList.contains("_spoller-active")) {
						hideSpollersBody(spollersBlock);
					}
					spollerTitle.classList.toggle("_spoller-active");
                    spollerTitle.parentElement.parentElement.classList.toggle("faq__item_active");
					_slideToggle(spollerTitle.parentElement.nextElementSibling, spollerSpeed);
				}
				e.preventDefault();
			}
		}
		function hideSpollersBody(spollersBlock) {
			const spollerActiveTitle = spollersBlock.querySelector(
				"[data-spoller]._spoller-active"
			);
			const spollerSpeed = spollersBlock.dataset.spollersSpeed
				? parseInt(spollersBlock.dataset.spollersSpeed)
				: 500;
			if (
				spollerActiveTitle &&
				!spollersBlock.querySelectorAll("._slide").length
			) {
				spollerActiveTitle.classList.remove("_spoller-active");
                spollerActiveTitle.parentElement.parentElement.classList.remove("faq__item_active");
				_slideUp(spollerActiveTitle.parentElement.nextElementSibling, spollerSpeed);
			}
		}
	}
}

spollers();

// Modal

const modalTrigger = document.querySelectorAll('[data-modal]'),
modal = document.querySelector('.modal'),
modalCloseBtn = document.querySelector('[data-close]');

modalTrigger.forEach(btn => {
    btn.addEventListener('click', openModal);
});

function closeModal() {
    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

function openModal() {
    modal.classList.add('show');
    modal.classList.add('fade');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';
}

modalCloseBtn.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.code === "Escape" && modal.classList.contains('show')) { 
        closeModal();
    }
});


$('.burger').click(function (e) {
    $('.burger, .header__nav').toggleClass('active');
    $('body').toggleClass('lock');
})

// $('select').selectmenu({
// 	change: function (event, ui) {
// 		$(this).change();
// 	}
// });


var swiper = new Swiper(".big-list-advantages__swiper", {
	spaceBetween: 30,
	loop: false,
	pagination: {
	  el: ".swiper-pagination",
	  clickable: true,
	},
	navigation: {
	  nextEl: ".swiper-button-next",
	  prevEl: ".swiper-button-prev",
	},
	breakpoints: {
		1230: {
			slidesPerView: 3
		},
		1022: {
			slidesPerView: 3
		},
		798: {
			slidesPerView: 2
		},
		0: {
			slidesPerView: 1
		},
	}
});

var swiper = new Swiper(".carousel-reviews__swiper", {
	slidesPerView: 3,
	spaceBetween: 30,
	loop: false,
	pagination: {
	  el: ".swiper-pagination",
	  clickable: true,
	},
	navigation: {
	  nextEl: ".swiper-button-next",
	  prevEl: ".swiper-button-prev",
	},
	breakpoints: {
		1230: {
			slidesPerView: 3
		},
		1022: {
			slidesPerView: 3
		},
		798: {
			slidesPerView: 2
		},
		606: {
			slidesPerView: 1
		},
		0: {
			slidesPerView: 1
		},
	}
});

var swiper = new Swiper(".carousel-work-examples__swiper", {
	slidesPerView: 3,
	spaceBetween: 30,
	loop: false,
	pagination: {
	  el: ".swiper-pagination",
	  clickable: true,
	},
	navigation: {
	  nextEl: ".swiper-button-next",
	  prevEl: ".swiper-button-prev",
	},
	breakpoints: {
		1230: {
			slidesPerView: 3
		},
		606: {
			slidesPerView: 2
		},
		0: {
			slidesPerView: 1
		},
	}
});