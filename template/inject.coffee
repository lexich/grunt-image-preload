window.PRELOADER = (preload)->  
  #injected
  class Preloader
    constructor:(options)->
      for k,v of options
        @options[k] = v

    options:
      complete:->
      progress:(n,src, type)->
      threads:1

    getPreload:-> [].concat preload
    load:->
      @startLoading = new Date
      nextImage =
        index: 0
        procent: 0
        getPersent:->
          @procent += 1
          100.0 * @procent / preload.length
        next: ->
          return null if preload.length <= @index
          src = preload[@index]        
          @index += 1
          return src

      numThread = @options.threads - 1

      callbackIter = 0
      complete = =>
        if callbackIter >= numThread
          @options.complete()
        callbackIter += 1
      @startLoading = new Date
      @loadImage i, nextImage, complete for i in [0..@options.threads-1]

    getImageObject:(index)-> new Image()

    loadImage: (index, nextImage, complete)->
      if(src = nextImage.next())        
        img = @getImageObject index
        img.onload = img.onerror = (e)=>
          type = e?.type
          @options.progress nextImage.getPersent(), img.src, type, (new Date - @startLoading)
          @loadImage index, nextImage, complete
        img.src = src
      else
        complete()

  return Preloader