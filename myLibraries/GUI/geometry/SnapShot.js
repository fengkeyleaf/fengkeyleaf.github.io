"use strict"

import Stack from "../../util/Stack.js";
import Main from "../../../finalProject/JavaScript/Main.js";

export default class SnapShot {

    constructor( paras ) {
        this.current = [];
        this.currentAnimations = [];

        // this.next = new Stack();
        // this.nextAnimations = new Stack();
    }

    addCurrent( data, animation ) {
        this.current.push( data );
        this.currentAnimations.push( animation );
        return this;
    }

    add( data ) {
        this.current.push( data );
        return this;
    }

    addAll( data ) {
        data.forEach( d => this.current.push( d ) );
    }

    draw() {
        // console.assert( this.current.length === this.currentAnimations.length );
        Main.main.drawer.drawLines( this.current );
        // for ( let i = 0; i < this.current.length; i++ ) {
        //     this.currentAnimations[ i ].draw( this.current[ i ] );
        // }
    }

    // addNext( data, animation ) {
    //     this.next.push( data );
    //     this.nextAnimations.push( animation );
    // }

    isEmpty() {
        // console.assert( this.current.length === this.currentAnimations.length );
        return this.current.isEmpty();
    }

    size() {
        // console.assert( this.current.length === this.currentAnimations.length );
        return this.current.length;
    }
}