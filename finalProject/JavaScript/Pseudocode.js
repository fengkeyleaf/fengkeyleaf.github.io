"use strict"

export default class Pseudocode {
    constructor() {
        // pseudocode element array
        this.monoPse = null;
        this.triPse = null;
        this.startV = null;
        this.endV = null;
        this.splitV = null;
        this.mergeV = null;
        this.regularV = null;

        this.__getPseElements();
    }

    __getPseElements() {
        this.monoPse = document.getElementById( "monoPse" );
        // this.monoPseChildren = this.monoPse.children;
        this.triPse = document.getElementById( "triPse" );
        // this.triPseChildren = this.triPse.children;
        this.startV = document.getElementById( "startV" );
        // this.startVChildren = this.startV.children;
        this.endV = document.getElementById( "endV" );
        // this.endVChildren = this.endV.children;
        this.splitV = document.getElementById( "splitV" );
        // this.splitVChildren= this.splitV.children;
        this.mergeV = document.getElementById( "mergeV" );
        // this.mergeVChildren = this.mergeV.children;
        this.regularV = document.getElementById( "regularV" );
        // this.regularVChildren = this.regularV.children;
    }
}