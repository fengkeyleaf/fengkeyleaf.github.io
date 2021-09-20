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

/*
export default class MyString {

    static compareTo( str1, str2 ) {
        if ( str1 > str2 )
            return 1;
        else if ( str1 < str2 )
            return -1;

        return 0;
    }
}*/
