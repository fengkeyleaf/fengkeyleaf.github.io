"use strict"

/*
 * Lines.java
 *
 * Version:
 *     $1.0$
 *
 * Revisions:
 *     $1.0$
 */

import MyMath from "../../../lang/MyMath.js";
import Triangles from "./Triangles.js";
import Vectors from "./Vectors.js";

/**
 * This class consists exclusively of static methods that
 * related to Line
 *
 * The source code in java is from my own github:
 * @see <a href=https://github.com/fengkeyleaf/Algorithm/blob/main/ComputationalGeometry/ApplicationOfTriangulation/myLibraries/util/geometry/tools/Lines.java>Lines</a>
 *
 * @author       Xiaoyu Tongyang, or call me sora for short
 */

export default class Lines {

    /**
     * if a, b and c are on the same line
     */

    static isOnTheSameLine( a, b, c ) {
        return MyMath.isEqualZero( Triangles.areaTwo( a, b, c ) );
    }

    /**
     * compare by slope
     */

    static compareBySlope( l1, l2 ) {
        let res = l1.dy * l2.dx - l1.dx * l2.dy;
        if ( MyMath.isEqualZero( res ) ) return 0;
        else if ( res > 0 ) return 1;

        return -1;
    }

    /**
     * compare by EndPoint
     */

    static compareByEndPoint( l1, l2 ) {
        return Vectors.sortByX( l1.endPoint, l2.endPoint );
    }

    /**
     * compare by StartPoint
     */

    static compareByStartPoint( l1, l2 ) {
        return Vectors.sortByX( l1.startPoint, l2.startPoint );
    }
}
