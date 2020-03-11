(function() {

  var $ = window.___$hermes;
  var ax = {};
  $.ax = ax;

  ax._scrollAnimations = [];
  ax._timeAnimations = [];

  ax.addScrollAnimation = function(animData) {
    if (!animData || !animData.el || !animData.draw) {
      return;
    }

    ax._scrollAnimations.push({
      el: animData.el,

      midPointType: animData.midPointType || "center",
      relativeTo: animData.relativeTo || "",
      clamp: animData.clamp || false,
      abs: animData.abs || false,

      draw: animData.draw
    });

    return true;
  };

  ax.addTimeAnimation = function() {

  };

  ax._runScrollAnimations = function() {
    ax._scrollAnimations.forEach(function(scrollAnim) {

      var $el = scrollAnim.el;

      // Container El would be used to handle data, but only apply animation to $el
      // var $containerEl = scrollAnim.containerEl;

      if ($el.isVisible()) {
        var top = $el.getTop();
        var bounds = $el.getBounds();

        var elHalfHeight = bounds.height * 0.5;
        var elMid = top + elHalfHeight;

        var halfScreenHeight = $.screenHeight * 0.5;

        var midPointType = scrollAnim.midPointType;
        var midPointY = $.scrollY; // Default to half of viewport

        switch (midPointType) {
          case "top":
            break;
          case "bottom":
            midPointY += $.screenHeight;
            break;
          case "center":
            midPointY += halfScreenHeight;
            break;
          default:
            midPointY += halfScreenHeight;
            break;
        }

        scrollAnim.position = (midPointY - elMid) <= 0 ? "below" : "above";

        // Get our relative Y value

        var relativeY = 0;
        var mult = scrollAnim.flip ? -1 : 1;
        var offsetY = 0;

        if (scrollAnim.relativeTo === "viewport") {
          offsetY = halfScreenHeight;
        }

        var targetY = elMid;
        var sfY = (targetY - midPointY) / (offsetY + elHalfHeight);
        relativeY = sfY * mult;

        if (scrollAnim.clamp) {
          relativeY = Math.max( -1, Math.min(1, relativeY) );
        }

        if (scrollAnim.abs) {
          relativeY = Math.abs(relativeY);
        }

        scrollAnim.relativeY = relativeY;

        scrollAnim.draw(relativeY);
      }
    });
  };

  ax._runTimeAnimations = function() {

  };

  $.addUpdate({
    draw: function() {
      ax._runTimeAnimations();
    }
  });

  $.addUpdate({
    updateOnScroll: true,
    draw: function() {
      ax._runScrollAnimations();
    }
  });

})();