module.exports = (grunt)->
  grunt.registerMultiTask "image_preload", "Generate js file with list of image resourse",->
    options = @options(
      jsvar:"PRELOADER"
      root:""
    )

    
    data = []

    @files.forEach (filePair)->
      filepath = grunt.util._.map filePair.src,(src)->
        options.root + src
      data = data.concat filepath

    content = JSON.stringify(data)

    result = "<!--preloader:js--><script>window.#{options.jsvar} = #{content};</script><!--endpreloader:js--></head>"
    processFiles = []
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
