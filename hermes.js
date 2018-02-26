(function(_scope, _hermes) {

  var find = function(that, query) {
    var parentEl = that;
    if (!that.querySelector) {
      parentEl = document;
    }

    if (typeof(query) === "string") {
      var el = parentEl.querySelector(query);
      $._extendSingleNode(el);
      return el;
    } else if (typeof(query) === "object") {
      if (query.nodeName) {
        $._extendSingleNode(query);
        return query;
      } else if (query.length && typeof(query[0]) === "string") {
        var tempElArr = parentEl.querySelectorAll(query);
        var elArr = [];
        for (var i = 0; i < tempElArr.length; i++) {
          elArr[i] = tempElArr[i];
        }
        $._extendMultiNode(elArr);
        return elArr;
      }
    }
  };

  var $ = function(query) {
    // Pass in `query` [`query`] `<element>`

    if (typeof(query) === "string" && query.indexOf("<") === 0) {
      var el = document.createElement(query
        .replace("<", "").replace(">", "")
      );
      $._extendSingleNode(el);
      return el;
    }

    return find(this, query);
  };

  _scope[_hermes] = $;
  window.___$hermes = $;

  // -- Single extensions

  $._ = {};

  $._.find = function(query) {
    return find(this, query);
  };

  $._.getBounds = function() {
    var bounds = this._$bounds;

    if (($.time !== this._$accessed && ($._scrolled || $._resized)) || !bounds) {
      bounds = this.getBoundingClientRect();
    }

    this.getBounds._$bounds = bounds;
    this.getBounds._$accessed = $.time;

    return bounds;
  };

  $._.getTop = function() {
    return this.getBounds().top + $.scrollY;
  };

  $._.isVisible = function() {
    var top = this.getTop();
    var height = this.getBounds().height;
    var bottom = top + height;
    return $.scrollY + $.screenHeight >= top && $.scrollY < bottom;
  };

  $._.on = function(_events, callback) {
    var events = _events.split(" ");
    for (var i = 0; i < events.length; i++) {
      this.addEventListener(events[i], callback);
    }
    return this;
  };

  $._.off = function(_events, callback) {
    var events = _events.split(" ");
    for (var i = 0; i < events.length; i++) {
      this.removeEventListener(events[i], callback);
    }
    return this;
  };

  $._.emit = function(eventName, eventData) {
    var _event = new CustomEvent(eventName, eventData);
    this.dispatchEvent(_event);
    return this;
  };

  $._.append = function(el) {
    this.appendChild(el);
    return this;
  };

  $._.prepend = function(el) {
    if (this.firstChild) {
      this.insertBefore(el, this.firstChild);
    }
    return this;
  };

  $._.show = function() {
    this.removeAttribute("hidden");
    return this;
  };

  $._.hide = function() {
    this.setAttribute("hidden", "true");
    return this;
  };

  $._.attr = function(prop, value, modifier) {
    if (prop.indexOf("!") === 0) {
      this.removeAttribute(prop.split("!")[1]);
      return this;
    }

    if (value === undefined) {
      return this.getAttribute(prop);
    }

    if (modifier === undefined) {
      this.setAttribute(prop, value);
    } else {
      this.setAttribute(prop, value, modifier);
    }
    return this;
  };

  $._.addClass = function(className) {
    this.classList.add(className);
    return this;
  };

  $._.hasClass = function(className) {
    return this.classList.contains(className);
  };

  $._.removeClass = function(className) {
    this.classList.remove(className);
    return this;
  };

  // -- Array extensions

  $.__ = {};

  $.__.show = function() {
    this.forEach(function(el) {
      el.show();
    });
    return this;
  };

  $.__.hide = function() {
    this.forEach(function(el) {
      el.hide();
    });
    return this;
  };

  $.__.attr = function(prop, value) {
    if (value === undefined) {
      return this;
    }
    this.forEach(function(el) {
      el.attr(prop, value);
    });
    return this;
  };

  $.__.on = function(_events, callback) {
    this.forEach(function(el) {
      el.on(_events, callback);
    });
    return this;
  };

  $.__.off = function(_events, callback) {
    this.forEach(function(el) {
      el.off(_events, callback);
    });
    return this;
  };

  $.__.addClass = function(className) {
    this.forEach(function(el) {
      el.addClass(className);
    });
    return this;
  };

  $.__.removeClass = function(className) {
    this.forEach(function(el) {
      el.removeClass(className);
    });
    return this;
  };

  // -- Extensions

  $._extendSingleNode = function(el) {
    if (el) {
      for (var key in $._) {
        if (!el[key]) {
          el[key] = $._[key];
        }
      }
    }
  };

  $._extendMultiNode = function(elArr) {
    if (elArr) {
      elArr.multi = true;

      for (var key in $.__) {
        if (!elArr[key]) {
          elArr[key] = $.__[key];
        }
      }

      elArr.forEach(function(el) {
        $._extendSingleNode(el);
      });
    }
  };

  // -- Debugging

  $.newID = function() {
    var newID = _hermes + "_" + this.newID._id;
    this.newID._id++;
    return newID;
  };

  $.newID._id = 0;

  $.log = function(message) {
    if (!message) {
      return;
    }

    var showTimestamp = true;

    if (this.log.history.length > 0) {
      if ($.time < this.log.history[this.log.history.length - 1].time + 2000) {
        showTimestamp = false;
      }
    }

    if (showTimestamp) {
      window.console.info("log timeStamp " + new Date());
    }

    this.log.history.push({
      message: message,
      time: $.time
    });

    window.console.log.apply(this, arguments);
  };

  $.log.history = [];

  $.error = function(message) {
    var err = new Error();
    window.console.error(message);
    window.console.error(err.stack);
  };

  // -- Communications

  $.fetch = function(endpoint, options) {
    if (!endpoint) {
      $.error("Comms error: Missing endpoint from request");
    }

    if (!window.Promise) {
      $.error("Comms error: No Promise API");
      return false;
    }

    options = options || {};

    return new window.Promise(function(resolve, reject) {
      var url = this.api + (endpoint || "");

      var xhr = new XMLHttpRequest();
      xhr.open(options.method || "GET", url, true);

      if (options.contentType) {
        xhr.setRequestHeader('Content-Type', options.contentType);
      }

      xhr.onload = function () {
        if (this.status >= 200 && this.status < 300) {
          resolve(xhr.response);
        } else {
          reject({
            status: this.status,
            statusText: xhr.statusText
          });
        }
      };

      xhr.onerror = function () {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      };

      xhr.send(options.data);
    });
  };

  $.send = function(endpoint, data, options) {
    if (!data) {
      $.error("Send error: No data to send");
    }

    // var optionsStart = {
    //   method: options.method || 'POST',
    //   contentType: options.contentType ||
    //     'application/x-www-form-urlencoded; charset=UTF-8',
    //   data: data
    // }

    return $.fetch(endpoint, options);
  };

  $.go = function(url, tab) {
    if (tab === false) {
      window.location = url;
    } else {
      window.open(url, '_blank');
    }
  };

  // -- Window

  $.screenWidth = window.innerWidth;
  $.screenHeight = window.innerHeight;
  $._resized = false;

  $._onResize = function() {
    $._resized = true;
    $.screenWidth = window.innerWidth;
    $.screenHeight = window.innerHeight;

    $._scrolled = true;
    $.scrollY = window.pageYOffset;
  };

  window.addEventListener("resize", $._onResize);

  // -- Scroll

  $.scrollY = 0;
  $._scrolled = false;

  $._onScroll = function() {
    $._scrolled = true;
    $.scrollY = window.pageYOffset;

    $._onResize();
  };

  window.addEventListener("scroll", $._onScroll);

  // -- Updating

  $.start = Date.now();
  $.time = Date.now();
  $.elapsed = 0;

  $._updates = [];
  $._accumulator = 0;
  $._interval = ((1 / 60) * 1000);

  $._prevTime = Date.now();
  $._passed = 0;

  $.addUpdate = function(updateData) {
    if (!updateData) {
      return;
    }

    var updateObject = {
      id: $.newID(),
      dirty: false,
      time: $.time,

      interval: updateData.interval || 0,
      repeat: updateData.hasOwnProperty("repeat") ? updateData.repeat : -1,

      updateOnScroll: updateData.updateOnScroll || false,
      updateOnResize: updateData.updateOnResize || false,

      _scrolled: true,
      _resized: true
    };

    updateObject.preUpdate = function() {
      if (updateObject.updateOnScroll) {
        updateObject._scrolled = $._scrolled;
      }

      if (updateObject.updateOnResize) {
        updateObject._resized = $._resized;
      }

      if (updateData.preUpdate) {
        updateData.preUpdate();
      }
    };

    updateObject.update = function() {
      if (updateObject.repeat !== 0 &&
      $.time >= this.time + this.interval &&
      (updateObject.updateOnScroll ? updateObject._scrolled : true) &&
      (updateObject.updateOnResize ? updateObject._resized : true)
      ) {
        updateObject.dirty = true;

        updateObject._scrolled = false;
        updateObject._resized = false;

        if (updateData.update) {
          var output = updateData.update();
          if (typeof(output) === "boolean") {
            updateObject.dirty = output;
          }
        }
      }

      if (updateObject.dirty) {
        updateObject.time = $.time;

        if (updateObject.repeat > 0) {
          updateObject.repeat--;
        }
      }
    };

    updateObject.draw = function() {
      if (updateObject.dirty && updateData.draw) {
        updateData.draw();
      }

      updateObject.dirty = false;
    };

    if (updateObject.priority === -1) {
      $._updates.unshift(updateObject);
    } else {
      $._updates.push(updateObject);
    }

    if (updateData.run) {
      updateObject.preUpdate();
      updateObject.update();
      updateObject.draw();
    }

    return updateObject;
  };

  $.removeUpdate = function(updateID) {
    $._updates.forEach(function(updateObject) {
      if (updateObject.id === updateID) {
        // TODO
      }
    });
  };

  $.update = function() {
    $._theUpdate(true);
  };

  $._scheduleUpdate = function() {
    requestAnimationFrame(function() {
      $._theUpdate();
      $._scheduleUpdate();
    });
  };

  $._theUpdate = function(redraw) {
    var now = Date.now();
    $.time = now;
    $._passed = Math.max(100, now - $._prevTime);
    $.elapsed = $.time - $.start;

    // Updates

    $._updates.forEach(function(updateObject) {
      updateObject.preUpdate($._interval);

      if (redraw) {
        $._updates.forEach(function(updateObject) {
          updateObject.update($._interval);
        });
        updateObject.dirty = true;
      } else {
        $._accumulator += $._passed;
        while ($._accumulator >= $._interval) {
          updateObject.update($._interval);
          $._accumulator -= $._interval;
        }
      }

      updateObject.draw($._passed);
    });

    // Clean up

    $._resized = false;
    $._scrolled = false;
    $._prevTime = now;
  };

  // -- Finish

  $._onLoad = function() {
    $._scheduleUpdate();
  };

  window.addEventListener("load", $._onLoad);

})(window, (!window.hasOwnProperty('$') ? '$' : '_$'));