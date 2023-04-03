"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.filterEverySecondElement = exports.hasOnlyNulls = exports.isEmpty = exports.setIncludesArray = exports.arraysEqual = exports.arrayIncludesArray = exports.filterOutNulls = void 0;
function filterOutNulls(array) {
    var filteredOut = [];
    for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
        var element = array_1[_i];
        if (element) {
            filteredOut.push(element);
        }
    }
    return filteredOut;
}
exports.filterOutNulls = filterOutNulls;
function arrayIncludesArray(searched, array) {
    var flag = true;
    for (var i = 0; i < array.length; i++) {
        if (!searched.includes(array[i])) {
            flag = false;
        }
    }
    return flag;
}
exports.arrayIncludesArray = arrayIncludesArray;
function arraysEqual(array1, array2) {
    if (array1.length !== array2.length) {
        return false;
    }
    array1.sort(function (a, b) { return a - b; });
    array2.sort(function (a, b) { return a - b; });
    for (var i = 0; i < array1.length; i++) {
        if (array1[i] !== array2[i]) {
            return false;
        }
    }
    return true;
}
exports.arraysEqual = arraysEqual;
function setIncludesArray(set, array) {
    var flag = true;
    array.forEach(function (key) {
        if (!set.has(key)) {
            flag = false;
        }
    });
    return flag;
}
exports.setIncludesArray = setIncludesArray;
function isEmpty(array) {
    return array.length == 0;
}
exports.isEmpty = isEmpty;
function hasOnlyNulls(array) {
    return array.some(function (element) {
        return element;
    });
}
exports.hasOnlyNulls = hasOnlyNulls;
function filterEverySecondElement(array) {
    var arr = [];
    for (var i = 0; i < array.length; i += 2) {
        arr.push(array[i]);
    }
    return arr;
}
exports.filterEverySecondElement = filterEverySecondElement;
function sleep(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
exports.sleep = sleep;
//# sourceMappingURL=utility.js.map