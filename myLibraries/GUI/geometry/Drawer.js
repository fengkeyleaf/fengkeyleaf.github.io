"use strict"

import DCEL from "../../util/geometry/DCEL/DCEL.js";
import MyMath from "../../lang/MyMath.js";
import SnapShot from "./SnapShot.js";
import Main from "../../../finalProject/JavaScript/Main.js";
import Vector from "../../util/geometry/elements/point/Vector.js";
import Vertex from "../../util/geometry/DCEL/Vertex.js";

export default class Drawer {
    static black = [ 0.0, 0.0, 0.0, 1.0 ];
    static grey = [ 0.7, 0.7, 0.7, 1 ];
    static aqua = [ 0, 1, 1, 1 ];
    static DeepSkyBlue = [ 0, 191 / 255, 1, 1 ];

    /**
     *
     * @param {Vector} vertex1
     * @param {Vector} vertex2
     */

    static addDrawingPoints( vertex1, vertex2 ) {
        let snapshot = new SnapShot();
        snapshot.addAll( Main.main.snapshots[ Main.main.snapshots.length - 1 ] );
        // snapshot.add( Main.main.drawer.polygonsPoints );
        let { points, colors } = Drawer.drawLines( vertex1, vertex2 );
        // console.log( points, colors )
        snapshot.add( new Float32Array( points ), new Float32Array( colors ) );
        Main.main.snapshots.push( snapshot );
    }

    /**
     * @param {[Number]} points
     * @param {Vertex} vertex
     */

    static addPointByVertex( points, vertex ) {
        // normalized coordinates, mapped to [ -1, 1 ]
        // coor * window / origin, window = 1
        let x = vertex.x / Main.main.originalWidth;
        let y = vertex.y / Main.main.originalHeight;
        points.push( x );
        points.push( y );
    }

    /**
     * @param {[HalfEdge]} edges
     */

    static getPolygonsPointsByEdges( edges ) {
        console.assert( edges.length > 2 );
        let points = [];
        let colors = [];
        const black = [ 0.0, 0.0, 0.0, 1.0 ];

        edges.forEach( edge => {
            Drawer.addPointByVertex( points, edge.origin );
            colors = colors.concat( black );
        } );
        Drawer.addPointByVertex( points, edges[ 0 ].origin );
        colors = colors.concat( black );
        return { points, colors };
    }

    // TODO not fixed
    static getPolygonsPointsByVertex( vertices ) {
        console.assert( vertices.length > 2 );
        let points = [];
        vertices.forEach( vertex => {
            Drawer.addPointByVertex( points, vertex );
        } );
        Drawer.addPointByVertex( points, vertices[ 0 ] );
        return points;
    };

    static drawPolygons( faces ) {
        let points = [];
        let colors = [];

        for ( let face of faces ) {
            if ( face.outComponent == null ) continue;

            let edges = DCEL.walkAroundEdgeFace( face );
            let data = Drawer.getPolygonsPointsByEdges( edges );
            points = points.concat( data.points );
            colors = colors.concat( data.colors );
        }

        return { points, colors };
    }

    /**
     * @param {Vector} vertices
     */

    static drawLines( ...vertices ) {
        let points = [];
        let colors = [];
        const grey = [ 0.7, 0.7, 0.7, 1 ];
        vertices.forEach( vertex => {
            Drawer.addPointByVertex( points, vertex );
            colors = colors.concat( grey );
        } );

        return { points, colors };
    }
}