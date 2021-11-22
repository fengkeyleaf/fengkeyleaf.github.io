"use strict"

import CollidingObject from "./CollidingObject.js";

export default class Cushion extends CollidingObject {
    constructor( group, mesh, mass, n, name ) {
        super( group, mesh, mass, name );
        super.isStatic = true;

        // debugger
        // console.log( this.isStatic );
        // let p = this.group.position.clone();
        // p.setY( p.y + 1 );
        // this.n = p.clone().sub( this.group.position ).normalize();
        this.n = n.clone();
        // console.log( group.position );
    }
}