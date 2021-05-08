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

var folderName = "AA"
var findCompName = "-EN";
var replaceCompName = "-AA";
var ignoreComp = "(IGNORE)";

var addToFolder;
var foldersObj = {};
foldersObj.parentFolder = app.project.items.addFolder(folderName)
var folderStructureArr = [];

for (var i = 0; i < selection.length; i++) {

    if (selection[i] instanceof CompItem) {
        if (selection[i].name.indexOf(ignoreComp) == 0) continue;
        var comp = selection[i].duplicate();
        addToFolder = makeFolderStructureHelper(comp);
        comp.parentFolder = addToFolder.parentFolder;
        duplicatedComps.push(comp);
        comps.push(selection[i]);
        comp.name = (comp.name.indexOf(findCompName) != -1) ? comp.name.split(findCompName)[0] + replaceCompName : selection[i].name;
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
                layer.replaceSource(dupedPreComp, true)
            } else {
                dupedPreComp = layer.source.duplicate();
                addToFolder = makeFolderStructureHelper(layer.source);
                dupedPreComp.parentFolder = addToFolder.parentFolder;
                dupedPreComp.name = (dupedPreComp.name.indexOf(findCompName) != -1) ? dupedPreComp.name.split(findCompName)[0] + replaceCompName : layer.source.name;
                duplicatedPreComps.push(dupedPreComp);
                preComps.push(layer.source)
                layer.replaceSource(dupedPreComp, true)
                preCompDepth++;
                duplicatePreComps(dupedPreComp);
            }
        }
    }
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

app.endUndoGroup();