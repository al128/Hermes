# Hermes

A fast JS utility library with basic DOM manipulation (à la "jQuery") and repeating event creation.

Supersedes my previous utility library [`SOLO`](https://github.com/al128/SOLO).

Apart of Studio Universe's _Olympus Suite_.

# Docs

Find a single element (this should be cached):

    let myEl = $("a.submit");

Find a child element:

    $("a.submit").find(".icon");

Add a click event:

    $("a.submit").on("click", function() {
      // Do something
    });

Chain methods:

    $("a.submit")
      .on("click", function() {
        // Do something
      })
      .show();

Create a new element:

    let mySpan = $("<span>");

Append a new child element:

    $("a.submit").append($("<span>"));

Hide an element:

    [aria-hidden] { display: none }

    $("a.submit").hide();

Change an attribute:

    $("a.submit").attr("href", "/contact");

Find multiple elements:

    $(["a"]);

Manipulate multiple elements:

    $(["a"]).forEach(function(el) { el.hide() });
    $(["a"]).hide();
    $(["a"]).show();
    $(["a"]).attr("data-test", "123");
    $(["a"]).on("mouseenter touchstart", eventHandler);
    $(["a"]).off("mouseenter touchstart", eventHandler);

Add your own single element method:

    $._.myFunction = function() { }

Add your own multiple element method:

    $.__.myFunction = function() { }

Log shortcut:

    $.log("Something went wrong", eventData);

Get something from your REST API (XHR):

    $.fetch("http://myapi.io/1/endpoint").then(successHandler)
      .catch(errorHandler);

Post something to your REST API (XHR):

    $.send("http://myapi.io/1/endpoint", { firstName: 'John' }, { method: 'POST' })
      .then(successHandler)
      .catch(errorHandler);

Change URL:

    $.go("http://studiouniver.se")

Create a repeating event:

    var updateID = $.addUpdate({
                      interval: 1000,
                      update: function() {
                        $.log($.time);
                      }
                    })
