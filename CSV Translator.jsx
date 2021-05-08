//@include "./babyparse.jsxinc"

var panelGlobal = this;
var palette = (function () {

    // PALETTE
    // =======
    var palette = (panelGlobal instanceof Panel) ? panelGlobal : new Window("palette", undefined, undefined, { resizeable: true });
    if (!(panelGlobal instanceof Panel)) palette.text = "CSV Translator";
    palette.orientation = "column";
    palette.alignChildren = ["fill", "top"];
    palette.spacing = 10;
    palette.margins = 16;

    // EXCLUDECOMPSGROUP
    // =================
    var excludeCompsGroup = palette.add("group", undefined, { name: "excludeCompsGroup" });
    excludeCompsGroup.orientation = "row";
    excludeCompsGroup.alignChildren = ["left", "center"];
    excludeCompsGroup.spacing = 10;
    excludeCompsGroup.margins = 0;

    var excludeCompsCheck = excludeCompsGroup.add("checkbox", undefined, undefined, { name: "excludeCompsCheck" });

    var excludeCompsStatic = excludeCompsGroup.add("statictext", undefined, undefined, { name: "excludeCompsStatic" });
    excludeCompsStatic.enabled = false;
    excludeCompsStatic.text = "Exclude Comps:";

    var excludeCompText = excludeCompsGroup.add('edittext {properties: {name: "excludeCompText"}}');
    excludeCompText.enabled = false;
    excludeCompText.text = "Prefix";
    excludeCompText.preferredSize.width = 100;

    excludeCompsCheck.onClick = function () { excludeCompsStatic.enabled = excludeCompText.enabled = excludeCompsCheck.value; };

    // DELIMITERGROUP
    // ==============
    var delimiterGroup = palette.add("group", undefined, { name: "delimiterGroup" });
    delimiterGroup.orientation = "row";
    delimiterGroup.alignChildren = ["left", "center"];
    delimiterGroup.spacing = 10;
    delimiterGroup.margins = 0;

    var delimiterCheck = delimiterGroup.add("checkbox", undefined, undefined, { name: "delimiterCheck" });

    var delimiterStatic = delimiterGroup.add("statictext", undefined, undefined, { name: "delimiterStatic" });
    delimiterStatic.enabled = false;
    delimiterStatic.text = "Find/Replace Delimiter:";

    var delimiterText = delimiterGroup.add('edittext {properties: {name: "delimiterText"}}');
    delimiterText.enabled = false;
    delimiterText.text = "-";
    delimiterText.preferredSize.width = 25;

    delimiterCheck.onClick = function () { delimiterStatic.enabled = delimiterText.enabled = delimiterCheck.value; };

    // FOLDERDEPTHGROUP
    // ================
    var folderDepthGroup = palette.add("group", undefined, { name: "folderDepthGroup" });
    folderDepthGroup.orientation = "row";
    folderDepthGroup.alignChildren = ["left", "center"];
    folderDepthGroup.spacing = 10;
    folderDepthGroup.margins = 0;

    var folderDepthCheck = folderDepthGroup.add("checkbox", undefined, undefined, { name: "folderDepthCheck" });

    var folderDepthStatic = folderDepthGroup.add("statictext", undefined, undefined, { name: "folderDepthStatic" });
    folderDepthStatic.enabled = false;
    folderDepthStatic.text = "Folder Depth:";

    var folderDepthNum = folderDepthGroup.add('edittext {properties: {name: "folderDepthNum"}}');
    folderDepthNum.enabled = false;
    folderDepthNum.text = "0";
    folderDepthNum.preferredSize.width = 23;

    folderDepthCheck.onClick = function () { folderDepthStatic.enabled = folderDepthNum.enabled = folderDepthCheck.value; };

    // PERCOMPDEPTHGROUP
    // =================
    var perCompDepthGroup = palette.add("group", undefined, { name: "perCompDepthGroup" });
    perCompDepthGroup.orientation = "row";
    perCompDepthGroup.alignChildren = ["left", "center"];
    perCompDepthGroup.spacing = 10;
    perCompDepthGroup.margins = 0;

    var preCompDepthCheck = perCompDepthGroup.add("checkbox", undefined, undefined, { name: "preCompDepthCheck" });

    var preCompDepthStatic = perCompDepthGroup.add("statictext", undefined, undefined, { name: "preCompDepthStatic" });
    preCompDepthStatic.enabled = false;
    preCompDepthStatic.text = "Pre Comp Depth:";

    var preCompDepthNum = perCompDepthGroup.add('edittext {properties: {name: "preCompDepthNum"}}');
    preCompDepthNum.enabled = false;
    preCompDepthNum.text = "0";
    preCompDepthNum.preferredSize.width = 23;

    preCompDepthCheck.onClick = function () { preCompDepthStatic.enabled = preCompDepthNum.enabled = preCompDepthCheck.value; };

    // LOADRUNGROUP
    // ============
    var loadRunGroup = palette.add("group", undefined, { name: "loadRunGroup" });
    loadRunGroup.orientation = "row";
    loadRunGroup.alignChildren = ["fill", "center"];
    loadRunGroup.spacing = 10;
    loadRunGroup.margins = 0;

    var makeCSVButton = loadRunGroup.add("button", undefined, undefined, { name: "makeCSVButton" });
    makeCSVButton.text = "Make CSV";

    makeCSVButton.onClick = function () { makeCSV() }

    var loadCSVButton = loadRunGroup.add("button", undefined, undefined, { name: "loadCSVButton" });
    loadCSVButton.text = "Load CSV";

    var csvFile
    var csvPicked = false;
    loadCSVButton.onClick = function () {loadCSV()}

    var runButton = loadRunGroup.add("button", undefined, undefined, { name: "runButton" });
    runButton.text = "Run";
    runButton.onClick = function () { 
        if(csvPicked){
            run();
        }else{
            loadCSV();
        }
    }

    function loadCSV(){
        csvFile = File.openDialog("Choose CSV");
        csvPicked = true;
        if (csvFile == null) {
            csvPicked = false;
        };
    }

    var textChangeGroup = palette.add("group", undefined, { name: "textChangeGroup" });
    textChangeGroup.orientation = "row";
    textChangeGroup.alignChildren = ["right", "center"];
    textChangeGroup.spacing = 10;
    textChangeGroup.margins = 0;

    var textChanges = [];
    var textLoop, textCounter;
    var changesMadeStatic = textChangeGroup.add("statictext", undefined, undefined, { name: "changesMadeStatic" });
    changesMadeStatic.text = "No Changes made";
    changesMadeStatic.justify = "right";

    //Arrows
    var arrowGroup = textChangeGroup.add("group");

    arrowGroup.orientation = "column";
    arrowGroup.spacing = 0;
    arrowGroup.margins = 5;
    drawArrow(3, -1);
    drawArrow(12, 1);

    function drawArrow(facing, direction) {
        var arrow = arrowGroup.add("group");
        arrow.preferredSize = [15, 15];
        arrow.onDraw = function () {
            pen = arrow.graphics.newPen(arrow.graphics.PenType.SOLID_COLOR, [1, 1, 1, 1], 3);
            graphics = arrow.graphics;
            graphics.newPath();			// inner frame */
            graphics.moveTo(3, 7.5);
            graphics.lineTo(7.5, facing);
            graphics.lineTo(12, 7.5);
            graphics.strokePath(pen);
        }
        //Arrow Click Function
        arrow.addEventListener('click', function () { upDownArrows(direction) });
    }

    palette.layout.layout(true);
    palette.layout.resize();
    palette.onResizing = palette.onResize = function () { this.layout.resize(); }

    if (palette instanceof Window) palette.show();

    function run() {

        app.beginUndoGroup('Auto Translate');

        var selection = app.project.selection;

        var comps = []; //original comp check to see if it's already been duped
        var duplicatedComps = [];
        var preComps = [];
        var duplicatedPreComps = [];
        textChanges = [];

        var preCompDepthLimit = (preCompDepthCheck.value) ? parseInt(preCompDepthNum.text) : -1; //-1 no limit
        var preCompDepth;

        var folderDepthLimit = (folderDepthCheck.value) ? parseInt(folderDepthNum.text) : -1; //-1 no limit
        var folderDepth;
        var folderName;
        var findCompName;
        var replaceCompName;
        var delimiter = (delimiterCheck.value) ? delimiterText.text : '';
        var ignoreComp = excludeCompText.text;
        var ignoreCompCheck = (excludeCompText.text == '') ? false : excludeCompsCheck.value;

        //Read CSV
        var csvFileRead = "";
        csvFile.open("r");
        while (!csvFile.eof) {
            csvFileRead += csvFile.read();
        }
        csvFile.close();

        var csvRows = Baby.parse(csvFileRead).data;
        //

        var foldersObj = {};
        var folderStructureArr = [];

        //findTextInProject(find, replace);

        for (var i = 1; i < csvRows[0].length; i++) {
            duplicatedComps = [];
            preComps = [];
            duplicatedPreComps = [];

            folderName = csvRows[0][i];
            findCompName = csvRows[0][0];
            replaceCompName = folderName;

            foldersObj = {};
            foldersObj.parentFolder = app.project.items.addFolder(folderName)
            folderStructureArr = [];

            main();

            findTextInProject(i);
        }

        //Text Layer Arrow Selector Setup
        changesMadeStatic.text = "0/" + textChanges.length;
        textCounter = textChanges.length * textChanges.length - 1; //Quick fix to make arrows go up and down
        textLoop = Math.abs(layerCounter % changes.length);

        app.endUndoGroup();

        function main() {

            for (var i = 0; i < selection.length; i++) {
                if (selection[i] instanceof CompItem) {
                    if (selection[i].name.indexOf(ignoreComp) == 0 && ignoreCompCheck) continue;
                    makeDuplicate(selection[i], comps, duplicatedComps);
                }
            }

            for (var i = 0; i < duplicatedComps.length; i++) {
                preCompDepth = 0;
                duplicatePreComps(duplicatedComps[i]);
            }

            function duplicatePreComps(comp) {
                if (preCompDepth == preCompDepthLimit) return
                for (var i = 1; i <= comp.numLayers; i++) {
                    var layer = comp.layers[i];
                    if (layer.source instanceof CompItem) {
                        if (layer.source.name.indexOf(ignoreComp) == 0 && ignoreCompCheck) continue;
                        var dupedPreComp = checkduplicatedPreComps(layer.source);
                        if (dupedPreComp != null) {
                            layer.replaceSource(dupedPreComp, true);
                        } else {
                            dupedPreComp = makeDuplicate(layer.source, preComps, duplicatedPreComps);
                            layer.replaceSource(dupedPreComp, true);
                            preCompDepth++;
                            duplicatePreComps(dupedPreComp);
                        }
                    }
                }
            }

            function makeDuplicate(item, compType, dupedCompType) {
                var dupedComp = item.duplicate();
                var addToFolder = makeFolderStructureHelper(item);
                dupedComp.parentFolder = addToFolder.parentFolder;

                var regex = new RegExp('(\\' + delimiter + findCompName + '\\b)(?!.*[\\r\\n]*.*\\1)', 'gi'); //Find and replace last instance of a word
                dupedComp.name = item.name.replace(regex, delimiter + replaceCompName);

                dupedCompType.push(dupedComp);
                compType.push(item);

                return dupedComp;
            }

            function checkduplicatedPreComps(layer) {
                for (var i = 0; i < preComps.length; i++) {
                    if (layer == preComps[i]) {
                        return duplicatedPreComps[i];
                    }
                }
                for (var i = 0; i < comps.length; i++) {
                    if (layer == comps[i]) {
                        return comps[i];
                    }
                }
                return null;
            }

            function makeFolderStructureHelper(item) {
                folderDepth = 0;
                folderStructureArr = [];

                return makeFolderStructure(item)
            }

            function makeFolderStructure(item) {
                if (item.parentFolder.name != "Root") {
                    if (folderDepth == folderDepthLimit) return makeFolders(foldersObj, folderStructureArr);
                    folderStructureArr.unshift(item.parentFolder.name);
                    folderDepth++;
                    makeFolderStructure(item.parentFolder)
                } else folderStructureArr.shift();

                return makeFolders(foldersObj, folderStructureArr);
            }

            function makeFolders(folder, folderStructureFunArr) {
                if (folderStructureFunArr.length > 0 && typeof folder[folderStructureFunArr[0]] == "undefined") {
                    folder[folderStructureFunArr[0]] = { parentFolder: app.project.items.addFolder(folderStructureFunArr[0]) };
                    folder[folderStructureFunArr[0]].parentFolder.parentFolder = folder.parentFolder;
                }

                if (folderStructureFunArr.length > 0) return makeFolders(folder[folderStructureFunArr[0]], folderStructureFunArr.slice(1))

                return folder
            }

            function updateExpressions(comp) {
                var expression = app.project.item(1).layer(1)('ADBE Transform Group')('ADBE Position');
                expression.expression = expression.expression.replace(/Comp 2/gm, "Comp 1")
            }
        }

        function findTextInProject(row) {

            for (var i = 0; i < duplicatedComps.length; i++) {
                search(duplicatedComps[i]);
            }
            for (var i = 0; i < duplicatedPreComps.length; i++) {
                search(duplicatedPreComps[i]);
            }

            function search(comp) {

                var layer = comp.layers;

                for (var i = 1; i <= comp.numLayers; i++) {
                    if (layer[i] instanceof TextLayer) {
                        textChanges.push([comp, layer[i]])
                        var text = layer[i].property("Text").property("Source Text");

                        for (var j = 1; j < csvRows.length; j++) {
                            var find = csvRows[j][0];
                            var replace = csvRows[j][row];
                            replace = (replace == undefined) ? "" : replace;
                            var findTextCap = find.toUpperCase();
                            var comppareTextCap = text.value.toString().toUpperCase();

                            var findTextCapWhiteSpace = findTextCap.replace(/(\r\n|\n|\r|\s+|\s+$)/gm, ""); //Remove white space
                            var comppareTextCapWhiteSpace = comppareTextCap.replace(/(\r\n|\n|\r|\s+|\s+$)/gm, "");

                            if (findTextCapWhiteSpace === comppareTextCapWhiteSpace) {
                                text.setValue(replace);
                            }
                        }
                    }
                }
            }
        }
    }

    function upDownArrows(direction) {
        if (textChanges.length > 0) {
            if (direction == 1) { //Up arrow
                textCounter++;
            } else textCounter--;
            textLoop = Math.abs(textCounter % textChanges.length);

            gotoLayer(textChanges[textLoop][0], textChanges[textLoop][1]);
            changesMadeStatic.text = (textLoop + 1) + "/" + textChanges.length;
        }
    }

    function gotoLayer(compToShow, layerToShow) {
        try {
            compToShow.name
            layerToShow.name
        }
        catch (err) {
            return;
        }
        compToShow.openInViewer();
        app.executeCommand(app.findMenuCommandId("Deselect All"));
        layerToShow.selected = true;
    }

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
            var csvFile = File("C:/Users/grego/Downloads/" + app.project.file.name.split(".")[0] + " Translations.csv");

            csvFile.open("w");
            csvFile.write(addText.join("\n"));

            csvFile.close();
        }
    }


    return palette;

}());