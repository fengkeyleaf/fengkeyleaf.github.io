"use strict"

/*
 * Vertex.java
 *
 * Version:
 *     $1.0$
 *
 * Revisions:
 *     $1.0$
 */

import Vector from "../elements/point/Vector.js";

/**
 * Data structure of vertex for DCEL
 *
 * The source code in java is from my own github:
 * @see <a href=>Vertex</a>
 *
 * @author       Xiaoyu Tongyang, or call me sora for short
 */

export default class Vertex extends Vector {
    static IDStatic = 0;

    /**
     * constructs to create an instance of Vertex
     * */

    constructor( x, y ) {
        super( x, y, Vertex._IDStatic++ );
        this.incidentEdge = null;
    }
}

