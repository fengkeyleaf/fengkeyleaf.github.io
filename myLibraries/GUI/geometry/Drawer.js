"use strict"

import DCEL from "../../util/geometry/DCEL/DCEL.js";
import MyMath from "../../lang/MyMath.js";
import SnapShot from "./SnapShot.js";
import Main from "../../../finalProject/JavaScript/Main.js";

export default class Drawer {

    static addDrawingPoints( vertex1, vertex2 ) {
        let snapshot = new SnapShot();
        snapshot.addAll( Main.main.snapshots[ Main.main.snapshots.length - 1 ].current );
        // snapshot.add( Main.main.drawer.polygonsPoints );
        snapshot.add( new Float32Array( Drawer.drawLines( vertex1, vertex2 ) ) );
        Main.main.snapshots.push( snapshot );
    }

    static addPointByVertex( points, vertex, exponent ) {
        console.assert( exponent, exponent );
        let x = vertex.x / Math.pow( 10, exponent );
        let y = vertex.y / Math.pow( 10, exponent );
        points.push( x );
        points.push( y );
    }

    // TODO not correct for normalized(), the shape would be smaller in some cases
    static getPolygonsPointsByEdges( edges ) {
        console.assert( edges.length > 2 );
        let points = [];
        edges.forEach( edge => {
            points.push( edge.origin.x, edge.origin.y );
        } );

        const EXP = MyMath.findMaxDigits( points );
        points = [];
        edges.forEach( edge => {
            Drawer.addPointByVertex( points, edge.origin, EXP );
        } );
        Drawer.addPointByVertex( points, edges[ 0 ].origin, EXP );
        return points;
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
    }

    static drawPolygons( faces ) {
        let points = [];
        for ( let face of faces ) {
            if ( face.outComponent == null ) continue;

            let edges = DCEL.walkAroundEdgeFace( face );
            points = points.concat( Drawer.getPolygonsPointsByEdges( edges ) );
        }

        return points;
    }

    static drawLines( ...vertices ) {
        // debugger
        let points = [];
        vertices.forEach( vertex => {
            points.push( vertex.x, vertex.y );
        } );

        const EXP = MyMath.findMaxDigits( points );
        points = [];
        vertices.forEach( vertex => Drawer.addPointByVertex( points, vertex, EXP ) );
        return points;
    }
}