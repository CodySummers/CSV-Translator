//@include "./babyparse.jsxinc"

app.beginUndoGroup('Auto Translate');

var selection = app.project.selection;

var comps = []; //original comp check to see if it's already been duped
var duplicatedComps = [];
var preComps = [];
var duplicatedPreComps = [];

var preCompDepthLimit = -1; //-1 no limit
var preCompDepth;

var folderDepthLimit = -1;
var folderDepth;

var folderName;
var findCompName;
var replaceCompName;
var ignoreComp = "(IGNORE)";

//Read CSV
var csvFile = File("~/Desktop/AE%20Scripts/Auto%20Translate/WFM4Translation_FINAL_210427.csv");

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
    findCompName = csvRows[0][1];
    replaceCompName = folderName;

    foldersObj = {};
    foldersObj.parentFolder = app.project.items.addFolder(folderName)
    folderStructureArr = [];

    main();

    for (var j = 1; j < csvRows.length; j++) {
        findTextInProject(csvRows[j][0], csvRows[j][i]);
    }
}

app.endUndoGroup();

function main() {

    for (var i = 0; i < selection.length; i++) {
        if (selection[i] instanceof CompItem) {
            if (selection[i].name.indexOf(ignoreComp) == 0) continue;
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
                if (layer.source.name.indexOf(ignoreComp) == 0) continue;
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
        dupedComp.name = (dupedComp.name.indexOf(findCompName) != -1) ? dupedComp.name.split(findCompName)[0] + replaceCompName : item.name;
        dupedCompType.push(dupedComp);
        compType.push(item)

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

function findTextInProject(find, replace) {

    for (var i = 0; i < duplicatedComps.length; i++) {
        search(duplicatedComps[i]);
    }
    for (var i = 0; i < duplicatedPreComps.length; i++) {
        search(duplicatedPreComps[i]);
    }

    function search(comp) {

        var layer = comp.layers;

        for (var j = 1; j <= comp.numLayers; j++) {
            if (layer[j] instanceof TextLayer) {
                var text = layer[j].property("Text").property("Source Text");
                var findTextCap = find.toUpperCase();
                var comppareTextCap = text.value.toString().toUpperCase();

                var findTextCapWhiteSpace = findTextCap.replace(/(\r\n|\n|\r|\s+|\s+$)/gm, "");
                var comppareTextCapWhiteSpace = comppareTextCap.replace(/(\r\n|\n|\r|\s+|\s+$)/gm, "");

                if (findTextCapWhiteSpace == comppareTextCapWhiteSpace) {
                    text.setValue(replace);
                }
            }
        }
    }
}