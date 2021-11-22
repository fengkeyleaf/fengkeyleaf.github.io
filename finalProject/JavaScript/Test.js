"use strict"

import MyMath from "../../myLibraries/lang/MyMath.js";
import CompareElement from "../../myLibraries/util/CompareElement.js";

class Person {
    constructor( ID ) {
        this.ID = ID;
    }

    compareTo( obj ) {
        return MyMath.doubleCompare( this.ID, obj.ID );
    }
}

let comparator = function ( e1, e2 ) {
    return MyMath.doubleCompare( e1.ID, e2.ID );
}

let person1 = new Person( 1 );
let person2 = new Person( 2 );

console.log( CompareElement.compare( comparator, person1, person2 ) );
console.log( CompareElement.compare( null, person1, person2 ) );