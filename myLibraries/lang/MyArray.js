"use strict"

Array.prototype.isEmpty = function () {
    return this.length === 0;
}

Array.prototype.getLast = function () {
    return this.isEmpty() ? null : this[ this.length - 1 ];
}

Array.prototype.getFirst = function () {
    return this.isEmpty() ? null : this[ 0 ];
}