/* Settings */
const animationTiny = 150;
const animationShort = 250;
const animationMedium = 500;
const animationLong = 750;
const scrollSpeed = 1.8; // pixel per millisecond
const revealDistance = "10%";
const revealOffset = 75;
const revealFromLeftSetting = {
  origin: 'left',
  duration: animationLong,
  delay: animationTiny,
  distance: revealDistance,
  viewFactor: 0.5,
  viewOffset: {
    top: revealOffset,
    bottom: revealOffset
  }
};
const revealFromRightSetting = {
  origin: 'right',
  duration: animationLong,
  delay: animationTiny,
  distance: revealDistance,
  viewFactor: 0.5,
  viewOffset: {
    top: revealOffset,
    bottom: revealOffset
  }
};
const revealFromTopSetting = {
  origin: 'top',
  duration: animationLong,
  delay: animationTiny,
  distance: revealDistance,
  viewFactor: 0.5,
  viewOffset: {
    top: revealOffset,
    bottom: revealOffset
  }
};
const revealFromBottomSetting = {
  origin: 'bottom',
  duration: animationLong,
  delay: animationTiny,
  distance: revealDistance,
  viewFactor: 0.5,
  viewOffset: {
    top: revealOffset,
    bottom: revealOffset
  }
};

/* Data Retrieval */
const breakpoints = { 'sm': 576,
                      'md': 768,
                      'lg': 992,
                      'xl': 1200 };
const $window = $(window);
const $welcomeSection = $("#section-welcome");
const $navbar = $("#navbar-main");
const $webHeading = $("#navbar-main .navbar-brand");
var windowWidth = $window.width();
var windowHeight = $window.height();
var windowPosition = $window.scrollTop();

/* Navigation Bar Resizing and Scrolling Animation
  1. Shrink when scrolling below the about section
  2. Background color fading when scrolling above the about section
  3. Hide the website title when scrolling above the about section
*/
function adjustNavItemHeight() {
  if ($window.width() >= breakpoints['md'] && windowPosition >= $welcomeSection.offset().top + $welcomeSection.height()) {
    $(".nav-link, .nav-item, .navbar-container").removeClass("navbar-height-secondary")
                                                .addClass("navbar-height-primary");
  } else {
    $(".nav-link, .nav-item").removeClass("navbar-height-primary").addClass("navbar-height-secondary");
  }
}

$window.resize(event => {
  windowPosition = $window.scrollTop();
  adjustNavItemHeight();
});

function adjustNavbarHeight() {
  let $elementsChangingHeight = $("#navbar-main, .navbar-container");
  if (windowPosition >= $welcomeSection.offset().top + $welcomeSection.height()) {
    $navbar.removeClass("navbar-bg-secondary").addClass("navbar-bg-primary");
    $webHeading.show(animationShort);
    $elementsChangingHeight.removeClass("navbar-height-secondary").addClass("navbar-height-primary");
    adjustNavItemHeight();
  } else {
    $navbar.removeClass("navbar-bg-primary").addClass("navbar-bg-secondary");
    $webHeading.hide(animationShort);
    $elementsChangingHeight.removeClass("navbar-height-primary").addClass("navbar-height-secondary");
    adjustNavItemHeight();
  }
}

/* Scrollspy Effect
  Making the scrolling smoother
*/
$("#navbar-main a, #btn-view-more").click(function(event) {
  windowPosition = $window.scrollTop();
  event.preventDefault();
  if (this.hash !== "") {
    let $hash = $(this.hash);
    let targetPosition = $hash.offset().top;
    let scrollTime = Math.abs(windowPosition - targetPosition) / scrollSpeed;
    window.setTimeout(function () {
      $('html, body').animate({
        scrollTop: $hash.offset().top
      }, Math.max(scrollTime, animationShort), function(){
        window.location.hash = $hash;
      });
    }, animationTiny);
  }
});

/* Ripple Effect */
$(".ripple").click(function(event) {
  if ($(this).find(".ripple-wave").length != 0)
    $(this).find(".ripple-wave").remove();
  $(this).append("<div class='ripple-wave'></div>");
  let $wave = $(this).find(".ripple-wave");
  let offset = Math.max(parseInt($(this).outerWidth()), parseInt($(this).outerHeight()));
  $wave.css({
    "width": (offset * 2) + "px",
    "height": (offset * 2) + "px",
    "top": (event.pageY - $(this).offset().top - offset) + "px",
    "left": (event.pageX - $(this).offset().left - offset) + "px",
    "transform": "scale(2)",
    "opacity": "0"
  });
});

/* Scrolling */
adjustNavbarHeight(); // Decide the visibility of the navbar when loading the page
$window.scroll(event => {
  /* Data Retrieval */
  windowWidth = $window.width();
  windowHeight = $window.height();
  windowPosition = $window.scrollTop();

  /* Navigation Bar */
  adjustNavbarHeight();

});

/* Revealing Effect */
ScrollReveal(revealFromLeftSetting).reveal(".reveal-left");
ScrollReveal(revealFromRightSetting).reveal(".reveal-right");
ScrollReveal(revealFromTopSetting).reveal(".reveal-top");
ScrollReveal(revealFromBottomSetting).reveal(".reveal-bottom");
