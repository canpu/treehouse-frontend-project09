/* Settings */
const animationTiny = 150;
const animationShort = 250;
const animationMedium = 500;
const animationLong = 750;
const animationLongLong = 1000;
const scrollSpeed = 1.8; // pixel per millisecond
const revealDistance = "50px";
const revealOffset = 50;
const degreeLevelRgb = {"doctoral": "115, 0, 230",
                           "master": "0, 102, 204",
                           "bachelor": "0, 153, 153",
                           "professional": "67, 146, 146"};
const degreeLevelAbbrev = {"doctoral": "D",
                           "master": "M",
                           "bachelor": "B",
                           "professional": "P"};
const host = "https://canpu.github.io/treehouse-frontend-project09";
const educationCardOpacity = 0.15;
const educationCardOpacityHover = 0.75;
const educationOverlayZindex = 1050;
const educationPageGutterZ = 0.01;
const skillBarGrowSpeed = 0.1; // percentage per millisecond
const interval = 50; // check the visibility of skillset or opacity of modal window for the number of milliseconds

/* Pre-Processing */
const breakpoints = { 'sm': 576,
                      'md': 768,
                      'lg': 992,
                      'xl': 1200 };
const $window = $(window);
const $welcomeSection = $("#section-welcome");
const $navbar = $("#navbar-main");
const $navToggler = $("#navbar-main .navbar-toggler");
const $webHeading = $("#navbar-main .navbar-brand");
const $skillSetsWrapper = $("#section-skills .section-wrapper");
var windowWidth = $window.width();
var windowHeight = $window.height();
var windowPosition = $window.scrollTop();
const revealFromLeftSetting = {
  origin: 'left',
  duration: animationLongLong,
  delay: animationTiny,
  distance: revealDistance,
  viewFactor: 0.3,
  viewOffset: {
    top: revealOffset,
    bottom: revealOffset
  }
};
const revealFromRightSetting = {
  origin: 'right',
  duration: animationLongLong,
  delay: animationTiny,
  distance: revealDistance,
  viewFactor: 0.3,
  viewOffset: {
    top: revealOffset,
    bottom: revealOffset
  }
};
const revealFromBottomSetting = {
  origin: 'bottom',
  duration: animationLongLong,
  delay: animationShort,
  distance: revealDistance,
  viewFactor: 0.3,
  viewOffset: {
    top: revealOffset,
  }
};

/* Display Education Experiences in Main Window */
var currentEducationPageIndex = 0;

function adjustEducationCanvasDimensions() {
  if (educationExperiences == null)
    $("#education-canvas").attr("height", "0").attr("axis-length", "0");
  else {
    let cards = document.getElementsByClassName("education-card");
    let num = cards.length; // number of loaded education experiences
    let axisLength = $(cards[num - 1]).offset().top - $(cards[0]).offset().top;
    let additionalHeight = $(cards[num - 1]).height() + parseFloat($("#education-canvas").css("margin-bottom"));
    $("#education-canvas").css("height", `${axisLength + additionalHeight}px`);
    $("#education-axis").css("height", `${axisLength}px`);
  }
}

var educationExperiences = null;
const createEducationItemElementInMainWindow = text => `<p class="education-label text-white text-center my-0 small">${text}</p>`;
function displayEducationInMainWindow() {
  let index = 1;
  educationExperiences.forEach(education => {
    let $card = $(`<div id="education-card-${index}" class="education-card education-${index} reveal-education" level="${degreeLevelAbbrev[education.level]}" data-toggle="modal" data-target="#modal-education"></div>`);
    let programName = education.degreeAbbreviation != null ? education.degreeAbbreviation : "";
    let status = education.completionStatus == "completed" ?  `Year: ${education.endYear}`: (education.completionStatus == "in progress" ? `Status: Ongoing` : "");
    if (education.major != null)
      programName += " of " + education.major;
    let color = `rgba(${degreeLevelRgb[education.level]}, ${educationCardOpacity})`;
    let hoverColor = `rgba(${degreeLevelRgb[education.level]}, ${educationCardOpacityHover})`;
    let $overlay = $(`<div class="education-card-overlay"></div>`);
    $card.appendTo("#education-canvas")
         .css("background-color", color)
         .append($overlay.css("background-color", hoverColor)
                         .append("<img class='education-card-view-btn' src='images/icons/eye.svg' alt='view more'/>"))
         .append(`<h3 class="education-experience-institute text-white text-center h5">${education.institute}</h3>`)
         .append(createEducationItemElementInMainWindow(programName))
         .append(createEducationItemElementInMainWindow(status));
    index++;
  });
  adjustEducationCanvasDimensions();
}

/* Loading the information of education experiences from the server */
$.ajax({
  url: `${host}/json/education-experiences.json`,
  dataType: 'json',
  success: function(data) {

    /* Display education experiences in the main window
      1. Display the brief information on cards
      2. Add click handlers to cards - turn to the selected page
    */
    educationExperiences = data.experiences.reverse();
    displayEducationInMainWindow();
    ScrollReveal(revealFromBottomSetting).reveal(".reveal-education");
    $("#education-canvas .education-card").click(event => {
      let $target = $(event.target);
      $target = $target.hasClass("education-card") ? $target : $target.parents(".education-card");
      window.setTimeout(() => educationBookFlipTo($target.index()), 250);
    });

    /* Create education experiences in the modal window
      1. Display more detailed information about the education experience on a page
      2. Add handlers to next and previous buttons
    */
    const createEducationPageElement = text => `<p class='education-item text-center my-0 small'>${text}</p>`

    function createEducationPage(educationIndex) {
      let education = educationExperiences[educationIndex];
      let $page = $(`<div class="education-page" data-page="${educationIndex + 1}"></div>`);
      let pages = document.querySelectorAll("#education-book .education-page");
      let $previousBackImg = $(pages[educationIndex]).find(".education-page-back-img");
      let programName = education.degreeAbbreviation != null ? education.degreeAbbreviation : "";
      if (education.major != null)
        programName += " of " + education.major;
      let status = education.completionStatus == "completed" ?  `Year: ${education.endYear}`: (education.completionStatus == "in progress" ? `Status: Ongoing` : "");
      let grade = education.grade != null ? createEducationPageElement(`GPA: ${education.grade} ${education.gradePossible != null ? " / " + education.gradePossible : ""}`) : "";
      let honor = education.honor != null ? createEducationPageElement(`Honor: ${education.honor}`) : "";
      let track = education.track != null ? createEducationPageElement(`${education.track} Track`) : "";
      let brief = education.brief != null ? education.brief.reduce((html, paragraph) => html += `<p class='education-item text-left small my-0'>${paragraph}</p>`, "") : "Brief Introduction: N/A";
      $page.appendTo("#education-book")
           .css("z-index", `${educationOverlayZindex - $page.attr("data-page")}`)
           .append(`<div class="education-page-front"></div>
                    <div class="education-page-back d-flex flex-column justify-content-center align-items-center"><img class="education-page-back-img" src="" alt=""></div>`)
           .find(".education-page-front")
           .append(``)
           .append(`<div class="education-page-wrapper bg-container d-flex flex-column align-items-center">
                      <div class="education-page-control-wrapper modal-header w-100 d-flex flex-row align-items-center justify-content-around py-0">
                        <button type="button" class="modal-previous close"><span>&#8249;</span></button>
                        <button type="button" class="modal-next close"><span>&#8250;</span></button>
                        <button type="button" class="modal-close close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      </div>
                      <img class="bg-img" src="${education.instituteImg}" alt="${education.instituteImg != null ? education.instituteAbbreviation : null}" />
                      <div class="modal-body d-flex flex-column align-items-center">
                        <h4 class="h5 text-center">${education.institute}</h4>
                        ${createEducationPageElement(programName)}
                        ${track}
                        ${honor}
                        ${createEducationPageElement(status)}
                        ${grade}
                      </div>
                      <div class="modal-footer">
                        <article class="education-brief">
                          ${brief}
                        </article>
                      </div>
                    </div>`);
        $previousBackImg.attr("src", education.instituteImg)
                        .attr("alt", `${education.instituteImg != null ? education.instituteAbbreviation : null}`);
    }

    for (let pageIndex = 0; pageIndex < educationExperiences.length; pageIndex++)
      createEducationPage(pageIndex);
    $("#education-book-cover").css("z-index", `${educationOverlayZindex}`);
    $("#education-book .modal-previous").click(educationBookFlipPrevious);
    $("#education-book .modal-next").click(educationBookFlipNext);
  },

  error: function(jqXHR, textStatus, errorThrown) {
    alert("Error encountered ---> XHR status: " + jqXHR.status + ". / Error thrown: " + errorThrown.toString() + ". / XHR response Text: " + jqXHR.responseText + ". / XHR response XML:  " + jqXHR.responseXML + ". / Text status: " + textStatus);
  }
});

/* Education Book Flipping Function
  1. Takes the target page index, and turn the current page to the target page
  2. Update the current page index
*/
var isEducationBookAnimated = false;
function educationBookFlipTo(targetEducationPageIndex) {
  if (!isEducationBookAnimated) {
    isEducationBookAnimated = true;
    let pages = document.querySelectorAll("#education-book .education-page");
    let rotateDegree;
    let startingIndex;
    let endingIndex;
    let isIndexInRange;
    let incrementIndex;
    if (targetEducationPageIndex < currentEducationPageIndex) {
      let flipIndex = currentEducationPageIndex - 1;
      const flipPreviousPage = () => {
        let $page = $(pages[flipIndex]);
        if (flipIndex >= targetEducationPageIndex) {
        $page.removeClass("education-page-flipped");
        window.setTimeout(() => $page.removeClass("z0"), animationLong * 0.15);
        window.setTimeout(() => {
          --flipIndex;
          flipPreviousPage();}, animationShort);
        } else {
          window.setTimeout(() => isEducationBookAnimated = false, animationLong * 0.85);
        }
      };
      flipPreviousPage();
    } else {
      let flipIndex = currentEducationPageIndex;
      const flipNextPage = () => {
        let $page = $(pages[flipIndex]);
        if (flipIndex <= targetEducationPageIndex - 1) {
        $page.addClass("education-page-flipped");
        window.setTimeout(() => $page.addClass("z0"), animationLong * 0.85);
        window.setTimeout(() => {
          ++flipIndex;
          flipNextPage();}, animationShort);
        } else {
          window.setTimeout(() => isEducationBookAnimated = false, animationLong * 0.85);
        }
      };
      flipNextPage();
    }
    currentEducationPageIndex = targetEducationPageIndex;
  }
}

/* Education Book Flipping to the Next or Previous Page */
function educationBookFlipPrevious() {
  let targetEducationPageIndex = currentEducationPageIndex - 1;
  targetEducationPageIndex = targetEducationPageIndex >= 0 ? targetEducationPageIndex : targetEducationPageIndex + educationExperiences.length + 1;
  educationBookFlipTo(targetEducationPageIndex);
}

function  educationBookFlipNext() {
  let targetEducationPageIndex = currentEducationPageIndex + 1;
  targetEducationPageIndex = targetEducationPageIndex <= educationExperiences.length ? targetEducationPageIndex : 0;
  educationBookFlipTo(targetEducationPageIndex);
}

/* Loading the information of skills from the server */
var skillSets;
$.ajax({
  url: `${host}/json/skills.json`,
  dataType: 'json',
  success: function(data) {
    skillSets = data.skillSets;
    skillSets.forEach(skillSet => {
      let $skillSet = $('<div class="skill-group col-md-5 my-4 d-flex flex-column p-3"></div>');
      $skillSet.append(`<h4 class="h5 text-center text-white w-100 mb-3">${skillSet.skillSetName}</h4>`)
               .appendTo($skillSetsWrapper);
      let $skillSetWrapper = $('<div class="skill-group-wrapper h-100 justify-content-around align-items-center d-flex flex-column justify-content-center align-items-stretch"></div>');
      $skillSetWrapper.appendTo($skillSet);
      skillSet.skills.forEach(skill => {
        let $skillTube = $('<div class="skill-max-tube w-100 mb-3"></div>');
        $skillTube.append(`<p class="text-center text-white w-100 small my-0">${skill.skillName}</p>`)
                  .append(`<div class="skill-act-tube" score="${skill.skillScore}"></div>`)
                  .appendTo($skillSetWrapper);
      });
    });
    ScrollReveal(revealFromBottomSetting).reveal(".skill-group");

    /* Let skill bars grow to full size once visible */
    function growSkillsetBars($skillSet) {
      let $skillBars = $skillSet.find(".skill-act-tube");
      $skillBars.each(function() {
        $(this).animate({
          width: `${$(this).attr("score")}%`
        }, $(this).attr("score") / skillBarGrowSpeed);
      });
    }

    $("#section-skills .skill-group").each(function() {
      let intervalCheck = setInterval(() => {
        if ($(this).css("transform").indexOf("matrix") == -1) {
          clearInterval(intervalCheck);
          growSkillsetBars($(this));
        }
      }, interval);
    });
  },

  error: function(jqXHR, textStatus, errorThrown) {
    alert("Error encountered ---> XHR status: " + jqXHR.status + ". / Error thrown: " + errorThrown.toString() + ". / XHR response Text: " + jqXHR.responseText + ". / XHR response XML:  " + jqXHR.responseXML + ". / Text status: " + textStatus);
  }
});

/* Loading projects information */
var projects = null;
$.ajax({
  url: `${host}/json/projects.json`,
  dataType: 'json',
  success: function(data) {
    projects = data.projects;

    /* Display project information */
    projects.forEach(project => {
      let $project = $('<div class="project-card mb-5 mx-3 mx-md-4" data-toggle="modal" data-target="#modal-project"></div>');

      /* Display projects in main window */
      $project.append(`<img class="project-card-img" src="${project.secondaryImage}" alt="image of ${project.title}" />
                       <div class="project-card-slide d-flex flex-column justify-content-between align-items-center">
                         <p class="project-card-title lead">${project.title}</p>
                         <p class="project-card-subtitle small">${project.subtitle}</p>
                         <img class="project-card-view-icon section-icon" src="images/icons/eye.svg" alt="eye"/>
                       </div>`)
              .appendTo($("#section-portfolio .section-wrapper"));

      /* Create projects in modal carousel */
      $project = $('<div class="container carousel-item"></div>');
      $project.append(`<div class="row">
                         <div class="col-lg-6 d-none d-lg-flex flex-row justify-content-between align-items-stretch">
                           <img class="project-modal-img" src=${project.primaryImage} alt="image of ${project.title}" />
                         </div>
                         <div class="col-lg-6 d-flex flex-column justify-content-center align-items-center">
                           <p class="text-center lead">${project.title}</p>
                           <p class="text-center small">${project.subtitle}</p>
                           <p class="text-center project-techniques small">Techniques: <span class="tag">${project.techniques.join('</span><span class="tag ml-2">')}</span></p>
                           <div class="row d-flex flex-row justify-content-around align-items-center w-100">
                             <a class="btn btn-icon btn-view-more btn-primary bg-info mt-auto d-block col-md ml-md-4 btn-outline-info" href="${project.url}" target="_blank"><p class="d-block">Demo</p></a>
                             <a class="btn btn-icon btn-code btn-primary bg-info  mt-auto d-block col-md ml-md-4 btn-outline-info" href="${project.github}" target="_blank"><p class="d-blocks">Github</p></a>
                           </div>
                         </div>
                       </div>
                       <hr />
                       <div class="row">
                         <p class="text-left small my-0">${project.brief.join('</p><p class="text-left small my-0">')}</p>
                       </div>`)
              .appendTo($("#carousel-project .carousel-inner"));
    });
    $("#carousel-project .carousel-inner .carousel-item:first-child").addClass("active");
    const $slides = $("#carousel-project .carousel-inner .carousel-item");
    $("#section-portfolio .project-card").click(event => {
      let $target = $(event.target);
      $target = $target.hasClass("project-card") ? $target : $target.parents(".project-card");
      $("#carousel-project .carousel-inner .carousel-item").removeClass("active");
      $($slides[$target.index()]).addClass("active");
      $("#carousel-project").focus();
    });
    ScrollReveal(revealFromBottomSetting).reveal(".project-card");
  },

  error: function(jqXHR, textStatus, errorThrown) {
    alert("Error encountered ---> XHR status: " + jqXHR.status + ". / Error thrown: " + errorThrown.toString() + ". / XHR response Text: " + jqXHR.responseText + ". / XHR response XML:  " + jqXHR.responseXML + ". / Text status: " + textStatus);
  }
});

/* Navigation Bar Resizing and Scrolling Animation
  1. Shrink when scrolling below the about section
  2. Background color fading when scrolling above the about section
  3. Hide the website title when scrolling above the about section
  4. When dropdown menu is triggered, the color is back to the original color
*/
function adjustNavItemHeight() {
  if ($window.width() >= breakpoints['md'] && windowPosition >= $welcomeSection.offset().top + $welcomeSection.height()) {
    $(".nav-link, .nav-item, .navbar-container").removeClass("navbar-height-secondary")
                                                .addClass("navbar-height-primary");
  } else {
    $(".nav-link, .nav-item").removeClass("navbar-height-primary").addClass("navbar-height-secondary");
  }
}

function adjustNavbarHeight() {
  let $elementsChangingHeight = $("#navbar-main, .navbar-container");
  if (windowPosition >= $welcomeSection.offset().top + $welcomeSection.height()) {
    $navbar.removeClass("navbar-bg-secondary").addClass("navbar-bg-primary");
    $webHeading.show(animationShort);
    $elementsChangingHeight.removeClass("navbar-height-secondary").addClass("navbar-height-primary");
    adjustNavItemHeight();
  } else {
    if ($navToggler.attr("aria-expanded") != "true") {
      $navbar.removeClass("navbar-bg-primary").addClass("navbar-bg-secondary");
      $("#navbar-main .nav-link").removeClass("navbar-bg-primary");
    }
    else {
      $navbar.removeClass("navbar-bg-secondary").addClass("navbar-bg-primary");
      $("#navbar-main .nav-link").addClass("navbar-bg-primary");
    }
    $webHeading.hide(animationShort);
    $elementsChangingHeight.removeClass("navbar-height-primary").addClass("navbar-height-secondary");
    adjustNavItemHeight();
  }
}

$navToggler.click(event => {
  if ($navToggler.attr("aria-expanded") == "true") {
    $("#navbar-main .nav-link").removeClass("navbar-bg-primary");
    windowHeight = $window.height();
    windowPosition = $window.scrollTop();
    if (windowPosition < $welcomeSection.offset().top + $welcomeSection.height())
      $navbar.removeClass("navbar-bg-primary").addClass("navbar-bg-secondary");
  } else {
    $("#navbar-main .nav-link").addClass("navbar-bg-primary");
    $navbar.removeClass("navbar-bg-secondary").addClass("navbar-bg-primary");
  }
});

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
      }, Math.max(scrollTime, animationMedium), function(){
        window.location.hash = $hash;
      });
    }, animationTiny);
  }
});

/* Ripple Effect */
function rippleEffect(event) {
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
}
$(".ripple").click(rippleEffect);

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

/* Resizing */
$window.resize(event => {
  windowPosition = $window.scrollTop();
  windowWidth = $window.width();
  if (windowWidth >= breakpoints['md'])
    $navToggler.attr("aria-expanded", "false");
  adjustNavItemHeight();
  adjustEducationCanvasDimensions();
});

/* Keyboard */
$("body").keyup(event => {
  if (event.which == 37) {
    if ($("#modal-education").hasClass("show"))
      educationBookFlipPrevious();
    if ($("#modal-project").hasClass("show"))
      $('#modal-project .carousel-control-prev').trigger("click");
  }
  else if (event.which == 39) {
    if ($("#modal-education").hasClass("show"))
      educationBookFlipNext();
    if ($("#modal-project").hasClass("show"))
      $('#modal-project .carousel-control-next').trigger("click");
  }
});

/* Revealing Effect */
ScrollReveal(revealFromLeftSetting).reveal(".reveal-left");
ScrollReveal(revealFromRightSetting).reveal(".reveal-right");
ScrollReveal(revealFromBottomSetting).reveal(".reveal-bottom");

/* Force Window to Go to Top After Refreshing */
$(document).ready(() => $(window).scrollTop(0););
