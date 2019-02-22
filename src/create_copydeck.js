// Setup
var sketch = require('sketch/dom')
var doc = require('sketch/dom').getSelectedDocument()
var docObj = doc.sketchObject

var paths = {}
paths.markDown = docObj.fileURL().path().split('.')[0] + '.md'
paths.screenShots = docObj.fileURL().path().split('.')[0] + '_screens'
paths.screenShotsRelative = './' + paths.screenShots.split('/').pop()

var excludedPages = ['Symbols']
var exportOptions = { scales: '1', formats: 'png', output: paths.screenShots}

// Utilities

var getLayerIndex = function (layer){
    return layer.parent.layers.map(function(l) { return l.name; }).indexOf(layer.name)
}

var getLayerSibling = function(layer){
    return layer.parent.layers[getLayerIndex(layer) + 1]
}

var iterateLayers = function walk(layer, func, index){
    func(layer)
    layer = layer.layers ? layer.layers[0]:0
    while (layer){
        walk(layer, func, index)
        layer = getLayerSibling(layer)
    }
}

// Core functions

var getTextString = function(artboard){
    var textString = ''
    artboard.layers.forEach(function(layer){
        iterateLayers(layer, function(layer){
            if(!layer.name.indexOf('°°')){
              if(layer.type === 'Text'){
                var textName = '### ' + layer.name.split('°°')[1] + '\n'
                var textID = '<!--' + layer._object.objectID() + '-->\n'
                var textContent = layer.text + '\n\n'
                textString = textName + textID + textContent + textString
              } else if (layer.type === 'SymbolInstance'){

              }
    }
        }, 0)
    })
    return textString
}

var getArtboardString = function(page){
    var artboards = page.layers.filter(l => l.type === 'Artboard')
    var artboardString = ''
    artboards.forEach(function(artboard){
        sketch.export(artboard, exportOptions)
        var thisArtboardString = '## Artboard: ' + artboard.name + '\n\n'
        thisArtboardString += '![](' + paths.screenShotsRelative + '/' + artboard.name + '.png)\n\n'
        thisArtboardString += getTextString(artboard)
        artboardString = thisArtboardString + artboardString
    })
    return artboardString
}

var getPageString = function(doc){
    var pages = doc.pages
    var pageString = ''
    pages.forEach(function(page){
      if (!excludedPages.includes(page.name)){
        var thisPageString = '# Page: ' + page.name + '\n\n'
        thisPageString += getArtboardString(page)
        pageString += thisPageString
      }
    })
    return pageString
}

var getMarkDown = function(doc){
    return getPageString(doc)
}

// At least: do stuff

var saveString = NSString.stringWithString(getMarkDown(doc))
saveString.writeToFile_atomically_encoding_error(paths.markDown, true, NSUTF8StringEncoding, null)

//var saveString = [NSString stringWithString:markDownString]
//[saveString writeToFile:markDownPath atomically:true encoding:NSUTF8StringEncoding error:null]
