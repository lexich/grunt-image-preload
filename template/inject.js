window.PRELOADER = function(preload) {
  var Preloader;
  Preloader = (function() {
    function Preloader(options) {
      var k, v;
      for (k in options) {
        v = options[k];
        this.options[k] = v;
      }
    }

    Preloader.prototype.options = {
      complete: function() {},
      progress: function(n, src, type) {},
      threads: 1
    };

    Preloader.prototype.getPreload = function() {
      return [].concat(preload);
    };

    Preloader.prototype.load = function() {
      var callbackIter, complete, i, nextImage, numThread, _i, _ref, _results,
        _this = this;
      this.startLoading = new Date;
      nextImage = {
        index: 0,
        procent: 0,
        getPersent: function() {
          this.procent += 1;
          return 100.0 * this.procent / preload.length;
        },
        next: function() {
          var src;
          if (preload.length <= this.index) {
            return null;
          }
          src = preload[this.index];
          this.index += 1;
          return src;
        }
      };
      numThread = this.options.threads - 1;
      callbackIter = 0;
      complete = function() {
        if (callbackIter >= numThread) {
          _this.options.complete();
        }
        return callbackIter += 1;
      };
      this.startLoading = new Date;
      _results = [];
      for (i = _i = 0, _ref = this.options.threads - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        _results.push(this.loadImage(i, nextImage, complete));
      }
      return _results;
    };

    Preloader.prototype.getImageObject = function(index, fn) {
      var ev, events, o, _i, _j, _k, _l, _len, _len1, _len2, _len3;
      if (this._getImageObject == null) {
        this._getImageObject = {};
      }
      o = this._getImageObject[index] || (this._getImageObject[index] = {
        img: new Image,
        fn: null
      });
      events = ["load", "error"];
      if (o.fn != null) {
        if (o.img.removeEventListener) {
          for (_i = 0, _len = events.length; _i < _len; _i++) {
            ev = events[_i];
            o.img.removeEventListener(ev, o.fn, false);
          }
        } else if (img.detachEvent) {
          for (_j = 0, _len1 = events.length; _j < _len1; _j++) {
            ev = events[_j];
            o.img.detachEvent("on" + ev, o.fn);
          }
        }
      }
      o.fn = fn;
      if (o.img.addEventListener) {
        for (_k = 0, _len2 = events.length; _k < _len2; _k++) {
          ev = events[_k];
          o.img.addEventListener(ev, o.fn, false);
        }
      } else if (o.img.attachEvent) {
        for (_l = 0, _len3 = events.length; _l < _len3; _l++) {
          ev = events[_l];
          o.img.attachEvent("on" + ev, o.fn);
        }
      }
      return o.img;
    };

    Preloader.prototype.loadImage = function(index, nextImage, complete) {
      var img, src,
        _this = this;
      if ((src = nextImage.next())) {
        img = this.getImageObject(index, function(e) {
          var type;
          type = e != null ? e.type : void 0;
          _this.options.progress(nextImage.getPersent(), img.src, type, new Date - _this.startLoading);
          return _this.loadImage(index, nextImage, complete);
        });
        return img.src = src;
      } else {
        return complete();
      }
    };

    return Preloader;

  })();
  return Preloader;
};
