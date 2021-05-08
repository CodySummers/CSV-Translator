function makeCSV() {


    var selection = app.project.selection;

    var headertext = '"EN"'
    var addText = [headertext];

    for (var i = 0; i < selection.length; i++) {
        if (selection[i] instanceof CompItem) {
            findText(selection[i])
        }
    }

    saveCSV();

    function findText(comp) {
        for (var i = 1; i <= comp.numLayers; i++) {
            var layer = comp.layers[i];
            if (layer.source instanceof CompItem) findText(layer.source);
            if (layer instanceof TextLayer) {
                var text = '"' + layer.property("Text")("Source Text").value.toString() + '"';
                if (addText.indexOf(text) == -1) {
                    addText.push(text);
                }

            }
        }
    }

    function saveCSV() {
        var csvFile = File("C:/Users/grego/Downloads/ " + app.project.file.name.split(".")[0] + " Translations.csv");

        csvFile.open("w");
        csvFile.write(addText.join("\n"));

        csvFile.close();
    }
}