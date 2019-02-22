var doc = require('sketch/dom').getSelectedDocument()
var docObj = doc.sketchObject

var markDownPath = docObj.fileURL().path().split('.')[0] + '.md'

var markDownFromFile = NSString.stringWithContentsOfFile_encoding_error(markDownPath, NSUTF8StringEncoding, null)
//var markDownFromFile = [NSString stringWithContentsOfFile:markDownPath encoding:NSUTF8StringEncoding error:null]
var markDownChunks = markDownFromFile.split('\n\n')

for (i=0;i<markDownChunks.length;i++){
    var chunkSplit = markDownChunks[i].split('\n')
    if(chunkSplit.length > 1){
        var name = '°°' + chunkSplit[0].split('### ')[1]
        var textID = chunkSplit[1].split('--')[1]
        var text = chunkSplit[2]
        var textLayer = doc.getLayerWithID(textID)
        textLayer.name = name
        textLayer.text = text
    }
}
