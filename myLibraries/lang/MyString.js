"use strict"

String.prototype.compareTo = function ( str ) {
    if ( this > str )
        return 1;
    else if ( this < str )
        return -1;

    return 0;
}

String.prototype.isEmpty = function () {
    return this.length === 0;
}
