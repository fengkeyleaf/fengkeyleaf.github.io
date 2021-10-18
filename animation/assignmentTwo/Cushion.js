"use strict"

import CollidingObject from "./CollidingObject.js";

export default class Cushion extends CollidingObject {
    constructor( group, mesh, mass, name ) {
        super( group, mesh, mass, name );
        super.isStatic = true;

        // debugger
        console.log( this.isStatic );
        let p = this.group.position.clone();
        p.setY( p.y + 1 );
        this.n = p.clone().sub( this.group.position ).normalize();
    }
}