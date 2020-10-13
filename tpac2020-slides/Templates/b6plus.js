/* b6plus.js
 *
 * Script to simulate projection mode on browsers that don't support
 * media=projection or 'overflow-block: optional-paged' but do support
 * Javascript.
 *
 * Documentation and latest version:
 *
 *   https://www.w3.org/Talks/Tools/b6plus/
 *
 * Brief usage instructions:
 *
 * Add the script to a page with
 *
 *   <script src="b6plus.js" type="text/javascript"></script>
 *
 * The script assumes each slide starts with an H1 or an element with
 * class "slide", which is a direct child of the BODY. All elements
 * until the next H1 or class "slide" are part of the slide, except
 * for those with a class of "comment", which are hidden in slide
 * mode.
 *
 * Elements with a class of "progress", "slidenum" or "numslides" are
 * treated specially. They can be used to display progress in the
 * slide show, as follows. Elements with a class of "numslides" will
 * have their content replaced by the total number of slides in
 * decimal. Elements with a class of "slidenum" will have their
 * content replaced by the number of the currently displayed slide in
 * decimal. The first slide is numbered 1. Elements with a class of
 * "progress" will get a 'width' property whose value is a percentage
 * between 0% and 100%, corresponding to the progress in the slide
 * show: if there are M slide in total and the currently displayed
 * slide is number N, the 'width' property will be N/M * 100%.
 *
 * There can be as many of these elements as desired. If they are
 * defined as children of the BODY, they will be visible all the time.
 * Otherwise their visibility depends on their parent.
 *
 * Usage:
 *
 * - Press A to toggle normal and slide mode. The script starts in
 *   normal mode.
 *
 * - Press Page-Down to go to the next slide. Press Page-Up, up arrow
 *   or left arrow to back-up one page.
 *
 * - Press Space, right arrow, down arrow or mouse button 1 to advance
 *   (incremental display or next slide)
 *
 * On touch screens, a tap with three fingers toggles slide mode, a
 * tap with two fingers goes back one slide, and a tap with one finger
 * (click) advances.
 *
 * To do: use whatever element has 'page-break-before: always; instead
 * of H1. (Is this possible? Do browsers store properties they don't
 * implement?)
 *
 * Derived from code by Dave Raggett.
 *
 * Author: Bert Bos <bert@w3.org>
 * Created: May 23, 2005 (b5)
 * Modified: Jan 2012 (b5 -> b6)
 * Modified: Oct 2016 (added jump to ID; fixes bugs with Home/End key handling)
 * Modified: Apr 2018 (added touch events)
 * Modified: May 2018 (support 'overflow-block' from Media Queries 4)
 * Modified: Mar 2019 (support fixed aspect ratio, progress elements, b6 -> b6+)
 * Modified: Aug 2020 (add class=visited to past elts in incremental display)
 *
 * Copyright 2005-2020 W3C (MIT, ERCIM, Keio, Beihang)
 * See http://www.w3.org/Consortium/Legal/copyright-software
 */

(function() {


/* Global variables */
var curslide = null;
var slidemode = false;		// In slide show mode or normal mode?
var curincremental = null;	// Current elt. in an incremental display
var incremental = null;		// Next elt. in an incremental display
var gesture = {};		// Info about touch/pointer gesture
var numslides = 0;		// Number of slides
var stylesToLoad = 0;		// # of load events to wait for
var limit = 0;			// A time limit used by toggleMode()
var nextid = 0;			// For generating unique IDs


/* generateID -- generate a unique ID */
function generateID()
{
  var id;

  do {id = "x" + nextid++;} while (document.getElementById(id));
  return id;
}


/* initIncrementalElement -- initialize an incremental display, if any */
function initIncrementalElement(e)
{
  var h, first = null;

  /* Recursively find the first child of the first element with
   * class=incremental (if any) in the tree rooted at e */

  if (e.nodeType != 1 /*Node.ELEMENT_NODE*/) return null;
  if (e.classList.contains("incremental") || e.classList.contains("overlay")) {
    first = e.firstChild;
    while (first != null && first.nodeType != 1) first = first.nextSibling;
    /* Make e's children invisible */
    for (h = first; h != null; h = h.nextSibling)
      if (h.nodeType == 1 /*Node.ELEMENT_NODE*/) {
	h.style.visibility = "hidden";
	h.classList.remove("visited");
      }
  }
  /* If e isn't incremental, try recursively among its children */
  for (h = e.firstChild; first == null && h != null; h = h.nextSibling)
    first = initIncrementalElement(h);

  return first;
}


/* initNextElement -- initialize incremental display with class=next elements */
function initNextElement(e)
{
  var f, h, first;

  /* Recursively look for elements with class=next without
   * class=active. Make those elements invisible. Return the first
   * one, or null. */

  if (e.nodeType != 1 /*Node.ELEMENT_NODE*/) return null;

  for (h = e.firstChild; h; h = h.nextSibling) {
    if (h.nodeType != 1 /*Node.ELEMENT_NODE*/) continue;
    if (h.classList.contains("next") && !h.classList.contains("active")) {
      if (!first) first = h;
      h.style.visibility = "hidden";
    }
    f = initNextElement(h);	// Recursive
    if (!first) first = f;
  }
  return first;
}


/* isStartOfSlide -- check if the element is an H1 or has class=slide */
function isStartOfSlide(elt)
{
  if (elt.nodeType != 1) return false;		// Not an element
  if (elt.nodeName == "H1") return true;
  if (elt.classList.contains("slide")) return true;
}


/* updateProgress -- update the progress bars and slide numbers, if any */
function updateProgress(elt)
{
  var p, i;

  /* Set the width of the progress bars */
  p = document.getElementsByClassName("progress");
  for (i = 0; i < p.length; i++)
    p[i].style.width = 100 * elt.b6slidenum / numslides + "%";

  /* Set the content of .slidenum elements to the current slide number */
  p = document.getElementsByClassName("slidenum");
  for (i = 0; i < p.length; i++)
    p[i].textContent = elt.b6slidenum;
}


/* initProgress -- find .progress and .slidenum elements, count slides */
function initProgress()
{
  var h;

  /* Count the number of slides, give each slide a number */
  numslides = 0;
  for (h = document.body.firstChild; h; h = h.nextSibling)
    if (isStartOfSlide(h)) {
      numslides++;
      h.b6slidenum = numslides;		// Store the number in the element
    }

  /* Make .progress, .slidenum and .numslides elements visible */
  p = document.getElementsByClassName("progress");
  for (i = 0; i < p.length; i++)
    if (p[i].b6savedstyle) p[i].style = p[i].b6savedstyle;
  p = document.getElementsByClassName("slidenum");
  for (i = 0; i < p.length; i++)
    if (p[i].b6savedstyle) p[i].style = p[i].b6savedstyle;
  p = document.getElementsByClassName("numslides");
  for (i = 0; i < p.length; i++) {
    if (p[i].b6savedstyle) p[i].style = p[i].b6savedstyle;
    p[i].textContent = numslides;	// Set content to number of slides
  }
}


/* displaySlide -- make the slide starting with elt visible */
function displaySlide(elt)
{
  var h;

  /* assert(elt.nodeName == "H1" || hasClass(elt, "slide")) */
  elt.style = elt.b6savedstyle;
  curincremental = null;
  incremental = initIncrementalElement(elt) || initNextElement(elt);
  updateProgress(elt);
  if (!elt.id) elt.id = generateID();	// Make sure the elt has an ID
  location.replace("#" + elt.id);
  elt.classList.add("active");		// Compatibility with Shower

  for (h = elt.nextSibling; h && !isStartOfSlide(h); h = h.nextSibling)
    if (h.nodeType == 1 /*Node.ELEMENT_NODE*/) {
      h.style = h.b6savedstyle;
      if (incremental == null)
	incremental = initIncrementalElement(h) || initNextElement(h);
    }
}


/* hideSlide -- make the slide starting with elt invisible */
function hideSlide(elt)
{
  var h;

  /* assert(elt.nodeName == "H1" || hasClass(elt, "slide")) */
  elt.classList.remove("active");		// Compatibility with Shower
  elt.classList.add("visited");			// Compatibility with Shower
  elt.style.visibility = "hidden";
  elt.style.position = "absolute";
  elt.style.top = "0";
  for (h = elt.nextSibling; h && !isStartOfSlide(h); h = h.nextSibling)
    if (h.nodeType == 1 /*Node.ELEMENT_NODE*/) {
      h.style.visibility = "hidden";
      h.style.position = "absolute";
      elt.style.top = "0";
    }
}


/* keyDown -- handle key presses on the body element */
function keyDown(event)
{
  if (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA")
    return;

  if (slidemode) {
    switch (event.key) {
    case "PageDown":   nextSlide(); break;
    case "PageUp":     previousSlide(); break;
    case "Left":       previousSlide(); break; // Some older browsers
    case "ArrowLeft":  previousSlide(); break;
    case "Up":         previousSlide(); break; // Some older browsers
    case "ArrowUp":    previousSlide(); break;
    case " ":          nextSlideOrElt(); break;
    case "Right":      nextSlideOrElt(); break; // Some older browsers
    case "ArrowRight": nextSlideOrElt(); break;
    case "Down":       nextSlideOrElt(); break; // Some older browsers
    case "ArrowDown":  nextSlideOrElt(); break;
    case "Home":       firstSlide(); break;
    case "End":        lastSlide(); break;
    case "a":          toggleMode(); break;
    case "Esc":        toggleMode(); break; // Some older browsers
    case "Escape":     toggleMode(); break;
    default:           return;
    }
  } else {
    if (event.key == "a") toggleMode();
    else return;
  }

  event.preventDefault();
}


/* load -- handle the load event */
function load(e)
{
  if (stylesToLoad) stylesToLoad--;
  e.target.removeEventListener(e.type, load);
}


/* toggleMedia -- swap styles for projection and screen */
function toggleMedia()
{
  var i, e, s;

  var re1 = /\(\s*overflow-block\s*:\s*optional-paged\s*\)/gi;
  var sub1 = "(min-width: 0) /* optional-paged */";
  var re2 = /\(\s*min-width\s*:\s*0\s*\)\s*\/\*\s*optional-paged\s*\*\//gi;
  var sub2 = "(overflow-block: optional-paged)";
  var re3 = /\bprojection\b/gi;
  var sub3 = "screen";
  var re4 = /\bscreen\b/gi;
  var sub4 = "projection";

  /* Swap projection and screen in MEDIA attributes of LINK elements */
  with (document.getElementsByTagName("link"))
    for (i = 0; i < length; i++)
      with (item(i))
	if (rel == "stylesheet" && media) {
	  if (re1.test(media)) s = media.replace(re1, sub1);
	  else s = media.replace(re2, sub2);
	  if (re3.test(s)) s = s.replace(re3, sub3);
	  else s = s.replace(re4, sub4);
	  if (s != media) {
	    stylesToLoad++;
	    addEventListener('load', load, false);
	    media = s;
	  }
	}

  /* Swap projection and screen in MEDIA attributes of STYLE elements */
  with (document.getElementsByTagName("style"))
    for (i = 0; i < length; i++)
      with (item(i))
	if (media) {
	  if (re1.test(media)) s = media.replace(re1, sub1);
	  else s = media.replace(re2, sub2);
	  if (re3.test(s)) s = s.replace(re3, sub3);
	  else s = s.replace(re4, sub4);
	  if (s != media) {
	    stylesToLoad++;
	    addEventListener('load', load, false);
	    media = s;
	  }
	}

  /* Swap projection and screen in the MEDIA pseudo-attribute of the style PI */
  for (i = 0; i < document.childNodes.length; i++)
    with (document.childNodes[i])
      if (nodeType == 7 && target == "xml-stylesheet") {
	if (re1.test(data)) s = data.replace(re1, sub1);
	else s = data.replace(re2, sub2);
	if (re3.test(s)) s = s.replace(re3, sub3);
	else s = s.replace(re4, sub4);
	if (s != data) {
	  stylesToLoad++;
	  addEventListener('load', load, false);	// TODO: possible?
	  data = s;
	}
      }
}


/* finishToggleMode -- finish switching to slide mode */
function finishToggleMode()
{
  var w, h, scale;

  if (stylesToLoad != 0 && Date.now() < limit) {

    setTimeout(finishToggleMode, 100);	// Wait some more

  } else if (stylesToLoad == 0 && Date.now() < limit) {

    limit = 0;
    setTimeout(finishToggleMode, 100);	// Wait 100ms for styles to apply

  } else {

    stylesToLoad = 0;

    /* If the BODY has a fixed size, scale it to fit the window */
    if (document.body.clientWidth && document.body.clientHeight) {
      w = document.body.clientWidth;
      h = document.body.clientHeight;
      scale = Math.min(window.innerWidth/w, window.innerHeight/h);
      document.body.style.transform = "scale(" + scale + ")";
      document.body.style.position = "relative";
      document.body.style.marginLeft = (window.innerWidth - w)/2 + "px";
      document.body.style.marginTop = (window.innerHeight - h)/2 + "px";
      document.body.style.top = "0";
      document.body.style.left = "0";
    }

    initProgress();		// Find and initialize progress bar, etc.

    curslide = null;
    if (location.hash) targetSlide(location.hash.substring(1));
    if (!curslide) firstSlide();
  }
}


/* toggleMode -- toggle between slide show and normal display */
function toggleMode()
{
  var h, limit;

  if (! slidemode) {
    slidemode = true;
    document.body.classList.add("full");		// Set .full on BODY

    /* Make all children of BODY invisible */
    for (h = document.body.firstChild; h; h = h.nextSibling)
      if (h.nodeType == 1 /*Node.ELEMENT_NODE*/) {
	h.b6savedstyle = h.style;			// Remember properties
	h.style.visibility = "hidden";
	h.style.position = "absolute";
	h.style.top = "0";
      }

    /* Swap style sheets for projection and screen, then wait 100ms
     * before calling a function to do the rest of the initialization
     * of slide mode. That function will wait for the style sheets to
     * load, but no longer than until limit, i.e., 3 seconds */
    document.body.b6savedstyle = document.body.style;	// Remember properties
    toggleMedia();					// Swap style sheets
    limit = Date.now() + 3000;
    setTimeout(finishToggleMode, 100);

  } else {

    /* Unhide all children again */
    for (h = document.body.firstChild; h; h = h.nextSibling)
      if (h.nodeType == 1 /*Node.ELEMENT_NODE*/) h.style = h.b6savedstyle;

    toggleMedia(); 					// Swap style sheets
    document.body.style = document.body.b6savedstyle;	// Restore the properties
    document.body.classList.remove("full");		// Remove .full from BODY
    slidemode = false;
  }
}


/* nextSlideOrElt -- next incremental element or next slide if none */
function nextSlideOrElt()
{
  if (curincremental) curincremental.classList.add("visited");
  curincremental = incremental;

  if (!incremental) {
    nextSlide();
  } else if (incremental.classList.contains("next")) {
    incremental.style.visibility = null;
    incremental.classList.add("active");
    incremental = incremental.nextSibling || incremental.parentNode;
    while (!isStartOfSlide(incremental) &&
	   (incremental.nodeType != 1 ||
	    !incremental.classList.contains("next") ||
	    incremental.classList.contains("active")))
      incremental = incremental.nextSibling || incremental.parentNode;
    if (isStartOfSlide(incremental)) incremental = null;
  } else {
    incremental.style.visibility = null;
    incremental = incremental.nextSibling;
    while (incremental && incremental.nodeType != 1 /*Node.ELEMENT_NODE*/)
      incremental = incremental.nextSibling;
  }
}


/* nextSlide -- display the next slide, if any */
function nextSlide()
{
  var h;

  if (curslide == null) return;

  /* assert(curslide.nodeName == "H1" || hasClass(curslide, "slide")) */
  h = curslide.nextSibling;
  while (h && !isStartOfSlide(h)) h = h.nextSibling;

  if (h != null) {
    hideSlide(curslide);
    curslide = h;
    displaySlide(curslide);
  }
}


/* previousSlide -- display the next slide, if any */
function previousSlide()
{
  var h;

  if (curslide == null) return;

  /* assert(curslide.nodeName == "H1" || hasClass(curslide, "slide")) */
  h = curslide.previousSibling;
  while (h && !isStartOfSlide(h)) h = h.previousSibling;

  if (h != null) {
    if (curslide != null) hideSlide(curslide);
    curslide = h;
    displaySlide(curslide);
  }
}


/* firstSlide -- display the first slide */
function firstSlide()
{
  var h;

  h = document.body.firstChild;
  while (h && !isStartOfSlide(h)) h = h.nextSibling;

  if (h != null) {
    if (curslide != null) hideSlide(curslide);
    curslide = h;
    displaySlide(curslide);
  }
}


/* lastSlide -- display the last slide */
function lastSlide()
{
  var h;

  h = document.body.lastChild;
  while (h && !isStartOfSlide(h)) h = h.previousSibling;

  if (h != null) {
    hideSlide(curslide);
    curslide = h;
    displaySlide(curslide);
  }
}


/* targetSlide -- display slide containing ID=id */
function targetSlide(id)
{
  var h;

  /* Find enclosing .slide or preceding H1 */
  h = document.getElementById(id);
  while (h && !isStartOfSlide(h)) {
    if (h.previousSibling != null) h = h.previousSibling;
    else h = h.parentNode;
  }
  if (h != null && h != curslide) {
    if (curslide) hideSlide(curslide);
    curslide = h;
    displaySlide(curslide);
  }
}


/* mouseButtonClick -- handle mouse click event */
function mouseButtonClick(e)
{
  var target = e.target;

  if (!slidemode) return;
  if (e.button != 0 || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;

  // work around Safari bug
  if (target.nodeType == 3)
    target = target.parentNode;

  // check if target is not something that probably wants clicks
  // e.g. embed, object, input, textarea, select, option
  if (target.nodeName === "A" || target.nodeName === "EMBED" ||
      target.nodeName === "OBJECT" || target.nodeName === "INPUT" ||
      target.nodeName === "TEXTAREA" || target.nodeName === "SELECT" ||
      target.nodeName === "OPTION") return;

  nextSlideOrElt();
  e.stopPropagation();
}


/* gestureStart -- handle start of a touch event */
function gestureStart(e)
{
  if (!gesture.on) {
    gesture.on = true;
    gesture.x2 = gesture.x1 = e.touches[0].clientX;
    gesture.y2 = gesture.y1 = e.touches[0].clientY;
    gesture.opacity = document.documentElement.style.opacity;
  }
  gesture.touches = e.touches.length;
}


/* gestureMove -- handle move event */
function gestureMove(e)
{
  if (gesture.on && slidemode) {
    gesture.x2 = e.touches[0].clientX;
    gesture.y2 = e.touches[0].clientY;

    /* Give some visual feedback: */
    var dx = Math.abs(gesture.x2 - gesture.x1);
    var dy = Math.abs(gesture.y2 - gesture.y1);
    if (gesture.touches != 1 || dx < dy)
      document.documentElement.style.opacity = gesture.opacity;
    else
      document.documentElement.style.opacity = 3*(1 - dx/window.innerWidth)/2;
  }
}


/* gestureEnd -- handle end of a touch event */
function gestureEnd(e)
{
  if (gesture.on) {
    gesture.on = false;

    /* Undo visual feedback */
    if (slidemode) document.documentElement.style.opacity = gesture.opacity;

    var dx = gesture.x2 - gesture.x1;
    var dy = gesture.y2 - gesture.y1;
    if (gesture.touches > 2) toggleMode();
    else if (gesture.touches > 1) return; // 2-finger gesture
    else if (!slidemode) return; // Not in slide mode
    else if (Math.abs(dx) < window.innerWidth/3) return; // Swipe too short
    else if (Math.abs(dx) < Math.abs(dy)) return; // Swipe too vertical
    else if (dx > 0) previousSlide();
    else nextSlide();
    e.preventDefault();
    e.stopPropagation();
  }
}


/* gestureCancel -- handle cancellation of a touch event */
function gestureCancel(e)
{
  gesture.on = false;
}


/* doubleClick -- handle a double click on the body */
function doubleClick(event)
{
  var h;

  if (event.button != 0 || event.altKey || event.ctrlKey ||
      event.metaKey || event.shiftKey) return;

  if (!slidemode) {
    /* If we are entering slide mode and the double click was on or
     * inside a slide that has an ID, start with that slide. */
    h = event.target;
    while (h && !isStartOfSlide(h)) {
      if (h.previousSibling != null) h = h.previousSibling;
      else h = h.parentNode;
    }
    if (h) {
      /* The target in the URL will make toggleMode() start with that slide. */
      if (!h.id) h.id = generateID();
      location.replace("#" + h.id);
    }
  }

  toggleMode();
  event.stopPropagation();
}


/* hashchange -- handle fragment id event, make target slide the current one */
function hashchange(e)
{
  if (slidemode) targetSlide(location.hash.substring(1));
}


/* main */

/* To do: don't do anything if media = projection */

document.onclick = mouseButtonClick;
document.onkeydown = keyDown;
document.ondblclick = doubleClick;
window.onhashchange = hashchange;
document.addEventListener('touchstart', gestureStart, false);
document.addEventListener('touchmove', gestureMove, false);
document.addEventListener('touchend', gestureEnd, false);
document.addEventListener('touchcancel', gestureCancel, false);

})();
