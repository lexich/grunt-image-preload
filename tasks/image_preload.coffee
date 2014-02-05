fs = require "fs"
path = require "path"
_ = require "lodash"
module.exports = (grunt)->
  grunt.registerMultiTask "image_preload", "Generate js file with list of image resourse",->
    options = @options(
      jsvar:"PRELOADER"
      root:"",
      inlineFile:null
      rev:false
      reduceRev:(filename)-> filename.replace(/([^\.]+)\.(.+)/,"$2")
    )
    options.inlineLoad = options.inlineFile unless options.inlineLoad?
    
    data = _.reduce @files, ((data, filePair)->
      filepath = _.reduce filePair.src,((memo,src)->
        p = path.normalize options.root + src
        pieces =  p.split(path.sep)
        pointer =_.reduce pieces.slice(0,pieces.length-1),((pointer,item)->
          pointer[item] or (pointer[item] = {})
        ), memo
        filename = pieces[pieces.length-1]
        processFilename = if options.rev then options.reduceRev filename else filename
        pointer[processFilename] = filename
        memo
      ),data
    ),{}

    content = JSON.stringify data

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
