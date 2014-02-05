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

    getFile:(path,_def="")->
      pieces = path.split("/")      
      newPath = ""
      ptr = preload
      for pie in pieces.slice(0,pieces.length-1)
        if(ptr = ptr[pie])
          newPath += pie + "/"
        else return _def
      if(filename = ptr[pieces[pieces.length-1]])
        newPath + filename
      else return _def
    load:->
      @startLoading = new Date
      _p = do (_p=preload)->
        d = []
        pf = (root, _p)->
          for key, item of _p
            if typeof(item) is "string"
              d.push root + item
            else
              path = root + key + "/"
              pf path, item
          d
        pf "", _p
      nextImage =
        index: 0
        procent: 0
        getPersent:->
          @procent += 1
          100.0 * @procent / _p.length
        next: ->
          return null if _p.length <= @index
          src = _p[@index]        
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

    getImageObject:(index, fn)->
      @_getImageObject = {} unless @_getImageObject?
      o = (@_getImageObject[index] or @_getImageObject[index] = {img:new Image, fn:null} )
      events = ["load","error"]
      if o.fn?        
        if o.img.removeEventListener
          o.img.removeEventListener ev, o.fn, false for ev in events
        else if img.detachEvent
          o.img.detachEvent "on#{ev}", o.fn for ev in events

      o.fn = fn
      if o.img.addEventListener
        o.img.addEventListener ev, o.fn, false for ev in events        
      else if o.img.attachEvent        
        o.img.attachEvent "on#{ev}", o.fn for ev in events

      o.img

    loadImage: (index, nextImage, complete)->
      if(src = nextImage.next())        
        img = @getImageObject index, (e)=>
          type = e?.type
          @options.progress nextImage.getPersent(), img.src, type, (new Date - @startLoading)
          @loadImage index, nextImage, complete
        img.src = src
      else
        complete()

  return Preloader