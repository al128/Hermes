# Hermes

Fast JS utility library for creating event loops (with basic DOM manipulation).

Maintained as part of [`Studio Universe`](https://studiouniverse.co)'s in-house toolkit. If you need help with CSS and styling pages, please checkout [`Classic`](https://github.com/studiouniverse/Classic).

# Docs

Find a single element (this should be cached in a variable):

    let $el = $("a.submit");

Find a child element:

    $("a.submit").find(".icon");
    $el.find(".icon");

Add a click event:

    $("a.submit").on("click", function() {
      // Do something
    });

Chain methods:

    $el
      .on("click", function() {
        // Do something
      })
      .addClass("clickable");

Create a new element:

    let $span = $("<span>");

Append a new child element:

    $span.append($("<small>"));

Hide an element:

    [hidden] { display: none !important; }

    $("a.submit").hide();

Change an attribute:

    $("a.submit").attr("href", "/contact");

Change a class:

    $el
      .addClass("bg-important")
      .removeClass("bg-primary");

Find multiple elements by wrapping selectors in an array:

    $(["a"]);
    let $messages = $([".error", ".warning"]);

Manipulate multiple elements:

    let $anchors = $(["a"]);
    $anchors.forEach(function(el) { el.hide() });
    $anchors.hide();
    $anchors.attr("data-test", "123");
    $anchors.on("mouseenter touchstart", eventHandler);
    $anchors.off("mouseenter touchstart", eventHandler);

Add your own single element method:

    $._.myFunction = function() { }

Add your own multiple element method:

    $.__.myFunction = function() { }

Log shortcut:

    $.log("Something happened", eventData);

Log an error:

    $.error("Something went wrong");

Get something from your REST API (XHR):

    $.fetch("http://myapi.io/1/endpoint").then(successHandler)
      .catch(errorHandler);

Post something to your REST API (XHR):

    $.send("http://myapi.io/1/endpoint", { firstName: 'John' }, { method: 'POST' })
      .then(successHandler)
      .catch(errorHandler);

Go to new URL (in a new tab by default):

    $.go("https://studiouniverse.co/");
    $.go("https://studiouniverse.co/#cool-stuff", false);

Create a repeating event:

    var updateID = $.addUpdate({
                      interval: 1000,
                      update: function() {
                        $.log($.time);
                      }
                    });

Create a repeating on-scroll event:

    var updateID = $.addUpdate({
                      updateOnScroll: true,
                      update: function() {
                        $.log($.time);
                      }
                    });

[![forthebadge](http://forthebadge.com/images/badges/60-percent-of-the-time-works-every-time.svg)](http://forthebadge.com)
