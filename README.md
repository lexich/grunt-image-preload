# grunt-image-preload

> The best Grunt plugin ever.

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-image-preload --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-image-preload');
```

## The "image_preload" task

### Overview
In your project's Gruntfile, add a section named `image_preload` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  image_preload: {
    options: {
      jsname:"PRELOADER",
      root:"http://example.com/"
    },
    files:[{
      cwd: "test/fixtures/images", 
      src: "**/*.{jpg,jpeg,png,gif}"
    }],        
    process:{
      files:[{
        cwd: "test/fixtures/",
        src: "index.html",
        dest: "tmp/"
      }]
    }
  },
});
```

### Options

#### options.jsname
Type: `String`
Default value: `PRELOADER`

This is name of global js variable which will be integrated to *.html document "window.PRELOADER"


#### options.root
Type: `String`
Default value: ``

Root of all resources

#### files
type: `Object`

Grunt path to all processing resources

#### process.files
type: `Object`

Grunt path from processing resources to destination of generator


### Usage Examples

#### Default Options
In this example, task search all files in folder "test/fixtures/images" according mask "**/*.{jpg,jpeg,png,gif}"
and in file test/fixtures/index.html injected js code with array of resources and put result in tmp/index.html

```js
grunt.initConfig({
  image_preload: {
    options: {
      jsname:"PRELOADER",
      root:"http://example.com/"
    },
    files:[{
      cwd: "test/fixtures/images", 
      src: "**/*.{jpg,jpeg,png,gif}"
    }],        
    process:{
      files:[{
        cwd: "test/fixtures/",
        src: "index.html",
        dest: "tmp/"
      }]
    }
  },
});
```
from index.html
```html
<html>
	<head>
		<title></title>
	</head>
	<body></body>
</html>
```
generated

```html
<html>
	<head>
		<title></title>
	<!--preloader:js--><script>window.PRELOADER = funtion(){...};</script><!--endpreloader:js--></head>
	<body></body>
</html>
```

using ClientSide code
```js
var preloader = new window.PRELOADER({
  threads:4,
  progress: function(pro, src, type, time) {
    return log("progress(" + type + ") " + time + ": " + pro + "% - " + src);
  },
  complete: function() {
    return log("COMPLETE");
  }
});
preloader.getPreload();
preloader.load();
```

#### window.PRELOADER - or name using in jsvar
Type: `Function`
Create prototype for loading resourses

#### options.threads
Type: `Integer`
number of parralel loading

#### options.progress
Type: `function`
callback execute every type where resource is success/fail loaded
params:
pro - procents  
src - path to resource
type - type of responce
time - time since start of loading

#### options.complete
Type: `function`
callback execute where loading is complete

#### getPreload
Type: `Function`
return array of resource

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
