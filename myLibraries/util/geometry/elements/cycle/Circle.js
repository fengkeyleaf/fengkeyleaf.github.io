"use strict"

/*
 * Cycle.js
 *
 * Version:
 *     $1.0$
 *
 * Revisions:
 *     $1.0$
 */

import CompareElement from "../../../CompareElement.js";

/**
 * Data structure of Circle
 *
 * @author       Xiaoyu Tongyang, or call me sora for short
 */

export default class Circle {
    static DEFAULT_SPLITS = 36;

    constructor( paras ) {
        // Vector
        this.center = CompareElement.chooseWhich( paras.center, null );
        // double
        this.radius = CompareElement.chooseWhich( paras.radius, null );
    }

    // https://blog.csdn.net/wzwxwc1987/article/details/113586007
    //生成顶点着色器需要的所有点的位置
    // gl.drawArrays( gl.LINE_LOOP, 0, Circle.DEFAULT_SPLITS );
    getPointsOnCircum( n = 36 ) {
        console.assert( n > 0 )
        let points = [];
        this.__getPointsCommonPart( points, n, 360 / n );

        return points;
    }

    getPoints( n = 36 ) {
        console.assert( n > 0 );
        let points = [ this.center.x, this.center.y ];
        this.__getPointsCommonPart( points, n, 360 / n );
        // for ( let i = 0; i < n; i++ ) {
        //     let xy = this.getXYByIndex( i, stepAngle );
        //     let { x, y } = xy;
        //     points.push( x );
        //     points.push( y );
        // }

        //如果没有下面3行代码，会出现一个缺口
        let xyRight = this.__getXYByIndex( 0, n );
        points.push( xyRight.x );
        points.push( xyRight.y );
        return points;
    }

    /**
     * private
     *
     * @param {[]} points
     */

    __getPointsCommonPart( points, n, stepAngle ) {
        for ( let i = 0; i < n; i++ ) {
            let xy = this.__getXYByIndex( i, stepAngle );
            let { x, y } = xy;
            points.push( x );
            points.push( y );
        }
    }

    // private
    // gl.drawArrays( gl.TRIANGLE_FAN, 0, Cycle.DEFAULT_SPLITS + 2 );
    __getXYByIndex( index, stepAngle ) {
        let angle = stepAngle * index;
        let angleInRadian = angle * Math.PI / 180;
        let x = Math.cos( angleInRadian ) * this.radius;
        let y = Math.sin( angleInRadian ) * this.radius;
        return { x, y }
    }
}