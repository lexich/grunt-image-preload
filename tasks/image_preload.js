var fs;

fs = require("fs");

module.exports = function(grunt) {
  return grunt.registerMultiTask("image_preload", "Generate js file with list of image resourse", function() {
    var content, data, fileData, options, processFiles, result, rx, rxClean, script;
    options = this.options({
      jsvar: "PRELOADER",
      root: ""
    });
    data = [];
    this.files.forEach(function(filePair) {
      var filepath;
      filepath = grunt.util._.map(filePair.src, function(src) {
        return options.root + src;
      });
      return data = data.concat(filepath);
    });
    content = JSON.stringify(data);
    fileData = fs.readFileSync("" + __dirname + "/../template/inject.min.js").toString();
    fileData = fileData.replace(/window\.PRELOADER[ ]*=/, "");
    script = "window." + options.jsvar + " = " + fileData + "; window." + options.jsvar + "=window." + options.jsvar + "(" + content + ");";
    result = "<!--preloader:js--><script> " + script + " </script><!--endpreloader:js--></head>";
    processFiles = [];
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
