var fs, path, _;

fs = require("fs");

path = require("path");

_ = require("lodash");

module.exports = function(grunt) {
  return grunt.registerMultiTask("image_preload", "Generate js file with list of image resourse", function() {
    var content, data, fileData, options, processFiles, result, rx, rxClean, script;
    options = this.options({
      jsvar: "PRELOADER",
      root: "",
      inlineFile: null,
      rev: true,
      reduceRev: function(filename) {
        return filename.replace(/([^\.]+)\.(.+)/, "$2");
      }
    });
    if (options.inlineLoad == null) {
      options.inlineLoad = options.inlineFile;
    }
    data = _.reduce(this.files, (function(data, filePair) {
      var filepath;
      return filepath = _.reduce(filePair.src, (function(memo, src) {
        var filename, p, pieces, pointer, processFilename;
        p = path.normalize(options.root + src);
        pieces = p.split(path.sep);
        pointer = _.reduce(pieces.slice(0, pieces.length - 1), (function(pointer, item) {
          return pointer[item] || (pointer[item] = {});
        }), memo);
        filename = pieces[pieces.length - 1];
        processFilename = options.rev ? options.reduceRev(filename) : filename;
        pointer[processFilename] = filename;
        return memo;
      }), data);
    }), {});
    content = JSON.stringify(data);
    fileData = fs.readFileSync("" + __dirname + "/../template/inject.min.js").toString();
    fileData = fileData.replace(/window\.PRELOADER[ ]*=/, "");
    script = "window." + options.jsvar + " = " + fileData + "; window." + options.jsvar + "=window." + options.jsvar + "(" + content + ");";
    if (options.inlineLoad == null) {
      result = "<!--preloader:js--><script> " + script + " </script><!--endpreloader:js--></head>";
    } else {
      grunt.file.write(options.inlineFile, script);
      grunt.log.writeln("Create file " + options.inlineFile);
      result = "<!--preloader:js--><script src=\"" + options.inlineLoad + "\"></script><!--endpreloader:js--></head>";
    }
    processFiles = [];
    if (!((this.data.process != null) && (this.data.process.files != null))) {
      return;
    }
    this.data.process.files.forEach(function(opt) {
      var res;
      res = grunt.file.expandMapping(opt.src, opt.dest, opt);
      return processFiles = processFiles.concat(res);
    });
    rx = /<[ ]*\/[ ]*head[ ]*>/;
    rxClean = /<!--[ ]*preloader:js[ ]*-->.+<!--[ ]*endpreloader:js[ ]*-->/;
    return processFiles.forEach(function(tmpl) {
      return tmpl.src.forEach(function(tmplPath) {
        var html, output;
        html = grunt.file.read(tmplPath);
        output = html.replace(rxClean, "").replace(rx, result);
        grunt.file.write(tmpl.dest, output);
        return grunt.log.writeln("Create file " + tmpl.dest);
      });
    });
  });
};
