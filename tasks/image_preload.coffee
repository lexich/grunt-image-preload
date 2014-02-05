fs = require "fs"

module.exports = (grunt)->
  grunt.registerMultiTask "image_preload", "Generate js file with list of image resourse",->
    options = @options(
      jsvar:"PRELOADER"
      root:"",
      inlineFile:null
    )
    options.inlineLoad = options.inlineFile unless options.inlineLoad?

    data = []

    @files.forEach (filePair)->
      filepath = grunt.util._.map filePair.src,(src)->
        options.root + src
      data = data.concat filepath

    content = JSON.stringify(data)

    fileData = fs.readFileSync("#{__dirname}/../template/inject.min.js").toString()    
    fileData = fileData.replace /window\.PRELOADER[ ]*=/, ""
    script = "window.#{options.jsvar} = #{fileData}; window.#{options.jsvar}=window.#{options.jsvar}(#{content});"
    
    unless options.inlineLoad?
      result = "<!--preloader:js--><script> #{script} </script><!--endpreloader:js--></head>"
    else
      grunt.file.write options.inlineFile, script
      grunt.log.writeln "Create file #{options.inlineFile}"
      result = "<!--preloader:js--><script src=\"#{options.inlineLoad}\"></script><!--endpreloader:js--></head>"    
    processFiles = []
    unless @data.process? and @data.process.files?
      return
    @data.process.files.forEach (opt)->
      res =  grunt.file.expandMapping opt.src, opt.dest, opt
      processFiles = processFiles.concat res    

    rx = /<[ ]*\/[ ]*head[ ]*>/
    rxClean = /<!--[ ]*preloader:js[ ]*-->.+<!--[ ]*endpreloader:js[ ]*-->/
    processFiles.forEach (tmpl)->
      tmpl.src.forEach (tmplPath)->
        html = grunt.file.read tmplPath
        output = html.replace(rxClean,"").replace(rx, result)
        grunt.file.write tmpl.dest, output
        grunt.log.writeln("Create file #{tmpl.dest}")
