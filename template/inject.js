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

    Preloader.prototype.getFile = function(path, _def) {
      var filename, newPath, pie, pieces, ptr, _i, _len, _ref;
      if (_def == null) {
        _def = "";
      }
      pieces = path.split("/");
      newPath = "";
      ptr = preload;
      _ref = pieces.slice(0, pieces.length - 1);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pie = _ref[_i];
        if ((ptr = ptr[pie])) {
          newPath += pie + "/";
        } else {
          return _def;
        }
      }
      if ((filename = ptr[pieces[pieces.length - 1]])) {
        return newPath + filename;
      } else {
        return _def;
      }
    };

    Preloader.prototype.load = function() {
      var callbackIter, complete, i, nextImage, numThread, _i, _p, _ref, _results,
        _this = this;
      this.startLoading = new Date;
      _p = (function(_p) {
        var d, pf;
        d = [];
        pf = function(root, _p) {
          var item, key, path;
          for (key in _p) {
            item = _p[key];
            if (typeof item === "string") {
              d.push(root + item);
            } else {
              path = root + key + "/";
              pf(path, item);
            }
          }
          return d;
        };
        return pf("", _p);
      })(preload);
      nextImage = {
        index: 0,
        procent: 0,
        getPersent: function() {
          this.procent += 1;
          return 100.0 * this.procent / _p.length;
        },
        next: function() {
          var src;
          if (_p.length <= this.index) {
            return null;
          }
          src = _p[this.index];
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
