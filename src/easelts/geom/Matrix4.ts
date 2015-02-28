import Vector3 = require('./Vector3');
import Quaternion = require('./Quaternion');
import Euler = require('./Euler');
import MathUtil = require('../util/MathUtil');

/**
 * @author mrdoob / http://mrdoob.com/
 * @author supereggbert / http://www.paulbrunt.co.uk/
 * @author philogb / http://blog.thejit.org/
 * @author jordi_ros / http://plattsoft.com
 * @author D1plo1d / http://github.com/D1plo1d
 * @author alteredq / http://alteredqualia.com/
 * @author mikael emtinger / http://gomo.se/
 * @author timknip / http://www.floorplanner.com/
 * @author bhouston / http://exocortex.com
 * @author WestLangley / http://github.com/WestLangley
 */

export class Matrix4
{

	public elements:Float32Array;

	constructor()
	{
		this.elements = new Float32Array([

			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1

		]);
	}

	/**
	 *
	 * @param n11
	 * @param n12
	 * @param n13
	 * @param n14
	 * @param n21
	 * @param n22
	 * @param n23
	 * @param n24
	 * @param n31
	 * @param n32
	 * @param n33
	 * @param n34
	 * @param n41
	 * @param n42
	 * @param n43
	 * @param n44
	 * @returns {Matrix4}
	 */
	public set(n11:number, n12:number, n13:number, n14:number, n21:number, n22:number, n23:number, n24:number, n31:number, n32:number, n33:number, n34:number, n41:number, n42:number, n43:number, n44:number):Matrix4
	{
		var te = this.elements;

		te[ 0 ] = n11;
		te[ 4 ] = n12;
		te[ 8 ] = n13;
		te[ 12 ] = n14;
		te[ 1 ] = n21;
		te[ 5 ] = n22;
		te[ 9 ] = n23;
		te[ 13 ] = n24;
		te[ 2 ] = n31;
		te[ 6 ] = n32;
		te[ 10 ] = n33;
		te[ 14 ] = n34;
		te[ 3 ] = n41;
		te[ 7 ] = n42;
		te[ 11 ] = n43;
		te[ 15 ] = n44;

		return this;

	}

	public identity()
	{

		this.set(

			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1

		);

		return this;

	}

	public copy(m)
	{

		this.elements.set(m.elements);

		return this;

	}

	public extractPosition(m)
	{

		console.warn('THREE.Matrix4: .extractPosition() has been renamed to .copyPosition().');
		return this.copyPosition(m);

	}

	public copyPosition(m)
	{

		var te = this.elements;
		var me = m.elements;

		te[ 12 ] = me[ 12 ];
		te[ 13 ] = me[ 13 ];
		te[ 14 ] = me[ 14 ];

		return this;

	}

	private __extractRotation_v1:Vector3 = null;

	public extractRotation(m:Matrix4):Matrix4
	{
		if(!this.__extractRotation_v1){
			this.__extractRotation_v1 = new Vector3(0, 0, 0);
		}


		var v1 = this.__extractRotation_v1;
		var te = this.elements;
		var me = m.elements;

		var scaleX = 1 / v1.set(me[ 0 ], me[ 1 ], me[ 2 ]).length();
		var scaleY = 1 / v1.set(me[ 4 ], me[ 5 ], me[ 6 ]).length();
		var scaleZ = 1 / v1.set(me[ 8 ], me[ 9 ], me[ 10 ]).length();

		te[ 0 ] = me[ 0 ] * scaleX;
		te[ 1 ] = me[ 1 ] * scaleX;
		te[ 2 ] = me[ 2 ] * scaleX;

		te[ 4 ] = me[ 4 ] * scaleY;
		te[ 5 ] = me[ 5 ] * scaleY;
		te[ 6 ] = me[ 6 ] * scaleY;

		te[ 8 ] = me[ 8 ] * scaleZ;
		te[ 9 ] = me[ 9 ] * scaleZ;
		te[ 10 ] = me[ 10 ] * scaleZ;

		return this;

	}


	public makeRotationFromEuler(euler)
	{

		if(euler instanceof Euler === false)
		{

			console.error('THREE.Matrix: .makeRotationFromEuler() now expects a Euler rotation rather than a Vector3 and order.');

		}

		var te = this.elements;

		var x = euler.x, y = euler.y, z = euler.z;
		var a = Math.cos(x), b = Math.sin(x);
		var c = Math.cos(y), d = Math.sin(y);
		var e = Math.cos(z), f = Math.sin(z);

		if(euler.order === 'XYZ')
		{

			var ae = a * e, af = a * f, be = b * e, bf = b * f;

			te[ 0 ] = c * e;
			te[ 4 ] = -c * f;
			te[ 8 ] = d;

			te[ 1 ] = af + be * d;
			te[ 5 ] = ae - bf * d;
			te[ 9 ] = -b * c;

			te[ 2 ] = bf - ae * d;
			te[ 6 ] = be + af * d;
			te[ 10 ] = a * c;

		}
		else if(euler.order === 'YXZ')
		{

			var ce = c * e, cf = c * f, de = d * e, df = d * f;

			te[ 0 ] = ce + df * b;
			te[ 4 ] = de * b - cf;
			te[ 8 ] = a * d;

			te[ 1 ] = a * f;
			te[ 5 ] = a * e;
			te[ 9 ] = -b;

			te[ 2 ] = cf * b - de;
			te[ 6 ] = df + ce * b;
			te[ 10 ] = a * c;

		}
		else if(euler.order === 'ZXY')
		{

			var ce = c * e, cf = c * f, de = d * e, df = d * f;

			te[ 0 ] = ce - df * b;
			te[ 4 ] = -a * f;
			te[ 8 ] = de + cf * b;

			te[ 1 ] = cf + de * b;
			te[ 5 ] = a * e;
			te[ 9 ] = df - ce * b;

			te[ 2 ] = -a * d;
			te[ 6 ] = b;
			te[ 10 ] = a * c;

		}
		else if(euler.order === 'ZYX')
		{

			var ae = a * e, af = a * f, be = b * e, bf = b * f;

			te[ 0 ] = c * e;
			te[ 4 ] = be * d - af;
			te[ 8 ] = ae * d + bf;

			te[ 1 ] = c * f;
			te[ 5 ] = bf * d + ae;
			te[ 9 ] = af * d - be;

			te[ 2 ] = -d;
			te[ 6 ] = b * c;
			te[ 10 ] = a * c;

		}
		else if(euler.order === 'YZX')
		{

			var ac = a * c, ad = a * d, bc = b * c, bd = b * d;

			te[ 0 ] = c * e;
			te[ 4 ] = bd - ac * f;
			te[ 8 ] = bc * f + ad;

			te[ 1 ] = f;
			te[ 5 ] = a * e;
			te[ 9 ] = -b * e;

			te[ 2 ] = -d * e;
			te[ 6 ] = ad * f + bc;
			te[ 10 ] = ac - bd * f;

		}
		else if(euler.order === 'XZY')
		{

			var ac = a * c, ad = a * d, bc = b * c, bd = b * d;

			te[ 0 ] = c * e;
			te[ 4 ] = -f;
			te[ 8 ] = d * e;

			te[ 1 ] = ac * f + bd;
			te[ 5 ] = a * e;
			te[ 9 ] = ad * f - bc;

			te[ 2 ] = bc * f - ad;
			te[ 6 ] = b * e;
			te[ 10 ] = bd * f + ac;

		}

		// last column
		te[ 3 ] = 0;
		te[ 7 ] = 0;
		te[ 11 ] = 0;

		// bottom row
		te[ 12 ] = 0;
		te[ 13 ] = 0;
		te[ 14 ] = 0;
		te[ 15 ] = 1;

		return this;

	}

	public setRotationFromQuaternion(q:Quaternion)
	{
		console.warn('THREE.Matrix4: .setRotationFromQuaternion() has been renamed to .makeRotationFromQuaternion().');
		return this.makeRotationFromQuaternion(q);
	}

	public makeRotationFromQuaternion(q:Quaternion)
	{

		var te = this.elements;

		var x = q.x, y = q.y, z = q.z, w = q.w;
		var x2 = x + x, y2 = y + y, z2 = z + z;
		var xx = x * x2, xy = x * y2, xz = x * z2;
		var yy = y * y2, yz = y * z2, zz = z * z2;
		var wx = w * x2, wy = w * y2, wz = w * z2;

		te[ 0 ] = 1 - ( yy + zz );
		te[ 4 ] = xy - wz;
		te[ 8 ] = xz + wy;

		te[ 1 ] = xy + wz;
		te[ 5 ] = 1 - ( xx + zz );
		te[ 9 ] = yz - wx;

		te[ 2 ] = xz - wy;
		te[ 6 ] = yz + wx;
		te[ 10 ] = 1 - ( xx + yy );

		// last column
		te[ 3 ] = 0;
		te[ 7 ] = 0;
		te[ 11 ] = 0;

		// bottom row
		te[ 12 ] = 0;
		te[ 13 ] = 0;
		te[ 14 ] = 0;
		te[ 15 ] = 1;

		return this;

	}

	private __lookAt_x:Vector3 = null;
	private __lookAt_y:Vector3 = null;
	private __lookAt_z:Vector3 = null;

	public lookAt(eye, target, up)
	{
		if(!this.__lookAt_x){
			this.__lookAt_x = new Vector3(0, 0, 0);
		}

		if(!this.__lookAt_y){
			this.__lookAt_y = new Vector3(0, 0, 0);
		}

		if(!this.__lookAt_z){
			this.__lookAt_z = new Vector3(0, 0, 0);
		}

		var x = this.__lookAt_x;
		var y = this.__lookAt_y;
		var z = this.__lookAt_z;
		var te = this.elements;

		z.subVectors(eye, target).normalize();

		if(z.length() === 0)
		{

			z.z = 1;

		}

		x.crossVectors(up, z).normalize();

		if(x.length() === 0)
		{

			z.x += 0.0001;
			x.crossVectors(up, z).normalize();

		}

		y.crossVectors(z, x);


		te[ 0 ] = x.x;
		te[ 4 ] = y.x;
		te[ 8 ] = z.x;
		te[ 1 ] = x.y;
		te[ 5 ] = y.y;
		te[ 9 ] = z.y;
		te[ 2 ] = x.z;
		te[ 6 ] = y.z;
		te[ 10 ] = z.z;

		return this;

	}

	public multiply(m:Matrix4):Matrix4
	{
		return this.multiplyMatrices(this, m);
	}

	public multiplyMatrices(a:Matrix4, b:Matrix4):Matrix4
	{

		var ae = a.elements;
		var be = b.elements;
		var te = this.elements;

		var a11 = ae[ 0 ], a12 = ae[ 4 ], a13 = ae[ 8 ], a14 = ae[ 12 ];
		var a21 = ae[ 1 ], a22 = ae[ 5 ], a23 = ae[ 9 ], a24 = ae[ 13 ];
		var a31 = ae[ 2 ], a32 = ae[ 6 ], a33 = ae[ 10 ], a34 = ae[ 14 ];
		var a41 = ae[ 3 ], a42 = ae[ 7 ], a43 = ae[ 11 ], a44 = ae[ 15 ];

		var b11 = be[ 0 ], b12 = be[ 4 ], b13 = be[ 8 ], b14 = be[ 12 ];
		var b21 = be[ 1 ], b22 = be[ 5 ], b23 = be[ 9 ], b24 = be[ 13 ];
		var b31 = be[ 2 ], b32 = be[ 6 ], b33 = be[ 10 ], b34 = be[ 14 ];
		var b41 = be[ 3 ], b42 = be[ 7 ], b43 = be[ 11 ], b44 = be[ 15 ];

		te[ 0 ] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
		te[ 4 ] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
		te[ 8 ] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
		te[ 12 ] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

		te[ 1 ] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
		te[ 5 ] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
		te[ 9 ] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
		te[ 13 ] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

		te[ 2 ] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
		te[ 6 ] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
		te[ 10 ] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
		te[ 14 ] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

		te[ 3 ] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
		te[ 7 ] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
		te[ 11 ] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
		te[ 15 ] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

		return this;

	}

	public multiplyToArray(a:Matrix4, b:Matrix4, r:number[]):Matrix4
	{
		var te = this.elements;
		this.multiplyMatrices(a, b);

		r[ 0 ] = te[ 0 ];
		r[ 1 ] = te[ 1 ];
		r[ 2 ] = te[ 2 ];
		r[ 3 ] = te[ 3 ];
		r[ 4 ] = te[ 4 ];
		r[ 5 ] = te[ 5 ];
		r[ 6 ] = te[ 6 ];
		r[ 7 ] = te[ 7 ];
		r[ 8 ] = te[ 8 ];
		r[ 9 ] = te[ 9 ];
		r[ 10 ] = te[ 10 ];
		r[ 11 ] = te[ 11 ];
		r[ 12 ] = te[ 12 ];
		r[ 13 ] = te[ 13 ];
		r[ 14 ] = te[ 14 ];
		r[ 15 ] = te[ 15 ];

		return this;
	}

	public multiplyScalar(s:number):Matrix4
	{
		var te = this.elements;

		te[ 0 ] *= s;
		te[ 4 ] *= s;
		te[ 8 ] *= s;
		te[ 12 ] *= s;
		te[ 1 ] *= s;
		te[ 5 ] *= s;
		te[ 9 ] *= s;
		te[ 13 ] *= s;
		te[ 2 ] *= s;
		te[ 6 ] *= s;
		te[ 10 ] *= s;
		te[ 14 ] *= s;
		te[ 3 ] *= s;
		te[ 7 ] *= s;
		te[ 11 ] *= s;
		te[ 15 ] *= s;

		return this;
	}

	//	public multiplyVector3(vector)
	//	{
	//
	//		console.warn('THREE.Matrix4: .multiplyVector3() has been removed. Use vector.applyMatrix4( matrix ) or vector.applyProjection( matrix ) instead.');
	//		return vector.applyProjection(this);
	//
	//	}
	//
	//	public multiplyVector4(vector)
	//	{
	//
	//		console.warn('THREE.Matrix4: .multiplyVector4() has been removed. Use vector.applyMatrix4( matrix ) instead.');
	//		return vector.applyMatrix4(this);
	//
	//	}
	//
	//	public multiplyVector3Array(a)
	//	{
	//
	//		console.warn('THREE.Matrix4: .multiplyVector3Array() has been renamed. Use matrix.applyToVector3Array( array ) instead.');
	//		return this.applyToVector3Array(a);
	//
	//	}

	private __applyToVector3Array_v1:Vector3 = null;

	public applyToVector3Array(array, offset, length)
	{
		if(!this.__applyToVector3Array_v1){
			this.__applyToVector3Array_v1 = new Vector3(0,0,0);
		}
		var v1 = this.__applyToVector3Array_v1;
		if(offset === undefined)
		{
			offset = 0;
		}
		if(length === undefined)
		{
			length = array.length;
		}

		for(var i = 0, j = offset, il; i < length; i += 3, j += 3)
		{

			v1.x = array[ j ];
			v1.y = array[ j + 1 ];
			v1.z = array[ j + 2 ];

			v1.applyMatrix4(this);

			array[ j ] = v1.x;
			array[ j + 1 ] = v1.y;
			array[ j + 2 ] = v1.z;

		}

		return array;

	}

	//	public rotateAxis(v)
	//	{
	//
	//		console.warn('THREE.Matrix4: .rotateAxis() has been removed. Use Vector3.transformDirection( matrix ) instead.');
	//
	//		v.transformDirection(this);
	//
	//	}
	//
	//	public crossVector(vector)
	//	{
	//
	//		console.warn('THREE.Matrix4: .crossVector() has been removed. Use vector.applyMatrix4( matrix ) instead.');
	//		return vector.applyMatrix4(this);
	//
	//	}

	public determinant():number
	{
		var te = this.elements;

		var n11 = te[ 0 ], n12 = te[ 4 ], n13 = te[ 8 ], n14 = te[ 12 ];
		var n21 = te[ 1 ], n22 = te[ 5 ], n23 = te[ 9 ], n24 = te[ 13 ];
		var n31 = te[ 2 ], n32 = te[ 6 ], n33 = te[ 10 ], n34 = te[ 14 ];
		var n41 = te[ 3 ], n42 = te[ 7 ], n43 = te[ 11 ], n44 = te[ 15 ];

		//TODO: make this more efficient
		//( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )

		return (
			n41 * (
				+n14 * n23 * n32
					- n13 * n24 * n32
					- n14 * n22 * n33
					+ n12 * n24 * n33
					+ n13 * n22 * n34
					- n12 * n23 * n34
				) +
				n42 * (
					+n11 * n23 * n34
						- n11 * n24 * n33
						+ n14 * n21 * n33
						- n13 * n21 * n34
						+ n13 * n24 * n31
						- n14 * n23 * n31
					) +
				n43 * (
					+n11 * n24 * n32
						- n11 * n22 * n34
						- n14 * n21 * n32
						+ n12 * n21 * n34
						+ n14 * n22 * n31
						- n12 * n24 * n31
					) +
				n44 * (
					-n13 * n22 * n31
						- n11 * n23 * n32
						+ n11 * n22 * n33
						+ n13 * n21 * n32
						- n12 * n21 * n33
						+ n12 * n23 * n31
					)

			);

	}

	public transpose():Matrix4
	{

		var te = this.elements;
		var tmp;

		tmp = te[ 1 ];
		te[ 1 ] = te[ 4 ];
		te[ 4 ] = tmp;
		tmp = te[ 2 ];
		te[ 2 ] = te[ 8 ];
		te[ 8 ] = tmp;
		tmp = te[ 6 ];
		te[ 6 ] = te[ 9 ];
		te[ 9 ] = tmp;

		tmp = te[ 3 ];
		te[ 3 ] = te[ 12 ];
		te[ 12 ] = tmp;
		tmp = te[ 7 ];
		te[ 7 ] = te[ 13 ];
		te[ 13 ] = tmp;
		tmp = te[ 11 ];
		te[ 11 ] = te[ 14 ];
		te[ 14 ] = tmp;

		return this;

	}

	public flattenToArrayOffset(array:number[], offset:number):number[]
	{

		var te = this.elements;

		array[ offset     ] = te[ 0 ];
		array[ offset + 1 ] = te[ 1 ];
		array[ offset + 2 ] = te[ 2 ];
		array[ offset + 3 ] = te[ 3 ];

		array[ offset + 4 ] = te[ 4 ];
		array[ offset + 5 ] = te[ 5 ];
		array[ offset + 6 ] = te[ 6 ];
		array[ offset + 7 ] = te[ 7 ];

		array[ offset + 8 ] = te[ 8 ];
		array[ offset + 9 ] = te[ 9 ];
		array[ offset + 10 ] = te[ 10 ];
		array[ offset + 11 ] = te[ 11 ];

		array[ offset + 12 ] = te[ 12 ];
		array[ offset + 13 ] = te[ 13 ];
		array[ offset + 14 ] = te[ 14 ];
		array[ offset + 15 ] = te[ 15 ];

		return array;

	}

	//	public getPosition()
	//	{
	//
	//		var v1 = new THREE.Vector3();
	//
	//		return function()
	//		{
	//
	//			console.warn('THREE.Matrix4: .getPosition() has been removed. Use Vector3.setFromMatrixPosition( matrix ) instead.');
	//
	//			var te = this.elements;
	//			return v1.set(te[ 12 ], te[ 13 ], te[ 14 ]);
	//
	//		};
	//	}

	public setPosition(v:Vector3):Matrix4
	{

		var te = this.elements;

		te[ 12 ] = v.x;
		te[ 13 ] = v.y;
		te[ 14 ] = v.z;

		return this;

	}

	public getInverse(m, throwOnInvertible:boolean = false):Matrix4
	{

		// based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
		var te = this.elements;
		var me = m.elements;

		var n11 = me[ 0 ], n12 = me[ 4 ], n13 = me[ 8 ], n14 = me[ 12 ];
		var n21 = me[ 1 ], n22 = me[ 5 ], n23 = me[ 9 ], n24 = me[ 13 ];
		var n31 = me[ 2 ], n32 = me[ 6 ], n33 = me[ 10 ], n34 = me[ 14 ];
		var n41 = me[ 3 ], n42 = me[ 7 ], n43 = me[ 11 ], n44 = me[ 15 ];

		te[ 0 ] = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
		te[ 4 ] = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
		te[ 8 ] = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
		te[ 12 ] = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
		te[ 1 ] = n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44;
		te[ 5 ] = n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44;
		te[ 9 ] = n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44;
		te[ 13 ] = n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34;
		te[ 2 ] = n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44;
		te[ 6 ] = n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44;
		te[ 10 ] = n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44;
		te[ 14 ] = n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34;
		te[ 3 ] = n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43;
		te[ 7 ] = n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43;
		te[ 11 ] = n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43;
		te[ 15 ] = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33;

		var det = n11 * te[ 0 ] + n21 * te[ 4 ] + n31 * te[ 8 ] + n41 * te[ 12 ];

		if(det == 0)
		{

			var msg = "Matrix4.getInverse(): can't invert matrix, determinant is 0";

			if(throwOnInvertible || false)
			{

				throw new Error(msg);

			}
			else
			{

				console.warn(msg);

			}

			this.identity();

			return this;
		}

		this.multiplyScalar(1 / det);

		return this;

	}

	//
	//	public translate(v)
	//	{
	//
	//		console.warn('THREE.Matrix4: .translate() has been removed.');
	//
	//	}
	//
	//	public rotateX(angle)
	//	{
	//
	//		console.warn('THREE.Matrix4: .rotateX() has been removed.');
	//
	//	}
	//
	//	public rotateY(angle)
	//	{
	//
	//		console.warn('THREE.Matrix4: .rotateY() has been removed.');
	//
	//	}
	//
	//	public rotateZ(angle)
	//	{
	//
	//		console.warn('THREE.Matrix4: .rotateZ() has been removed.');
	//
	//	}
	//
	//	public rotateByAxis(axis, angle)
	//	{
	//
	//		console.warn('THREE.Matrix4: .rotateByAxis() has been removed.');
	//
	//	}

	public scale(v)
	{

		var te = this.elements;
		var x = v.x, y = v.y, z = v.z;

		te[ 0 ] *= x;
		te[ 4 ] *= y;
		te[ 8 ] *= z;
		te[ 1 ] *= x;
		te[ 5 ] *= y;
		te[ 9 ] *= z;
		te[ 2 ] *= x;
		te[ 6 ] *= y;
		te[ 10 ] *= z;
		te[ 3 ] *= x;
		te[ 7 ] *= y;
		te[ 11 ] *= z;

		return this;

	}

	public getMaxScaleOnAxis()
	{

		var te = this.elements;

		var scaleXSq = te[ 0 ] * te[ 0 ] + te[ 1 ] * te[ 1 ] + te[ 2 ] * te[ 2 ];
		var scaleYSq = te[ 4 ] * te[ 4 ] + te[ 5 ] * te[ 5 ] + te[ 6 ] * te[ 6 ];
		var scaleZSq = te[ 8 ] * te[ 8 ] + te[ 9 ] * te[ 9 ] + te[ 10 ] * te[ 10 ];

		return Math.sqrt(Math.max(scaleXSq, Math.max(scaleYSq, scaleZSq)));

	}

	public makeTranslation(x:number, y:number, z:number):Matrix4
	{

		this.set(

			1, 0, 0, x,
			0, 1, 0, y,
			0, 0, 1, z,
			0, 0, 0, 1

		);

		return this;

	}

	public makeRotationX(theta:number):Matrix4
	{

		var c = Math.cos(theta), s = Math.sin(theta);

		this.set(

			1, 0, 0, 0,
			0, c, -s, 0,
			0, s, c, 0,
			0, 0, 0, 1

		);

		return this;

	}

	public makeRotationY(theta:number)
	{

		var c = Math.cos(theta), s = Math.sin(theta);

		this.set(

			c, 0, s, 0,
			0, 1, 0, 0,
			-s, 0, c, 0,
			0, 0, 0, 1

		);

		return this;

	}

	public makeRotationZ(theta:number)
	{

		var c = Math.cos(theta), s = Math.sin(theta);

		this.set(

			c, -s, 0, 0,
			s, c, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1

		);

		return this;

	}

	public makeRotationAxis(axis:Vector3, angle:number)
	{

		// Based on http://www.gamedev.net/reference/articles/article1199.asp

		var c = Math.cos(angle);
		var s = Math.sin(angle);
		var t = 1 - c;
		var x = axis.x, y = axis.y, z = axis.z;
		var tx = t * x, ty = t * y;

		this.set(

			tx * x + c, tx * y - s * z, tx * z + s * y, 0,
			tx * y + s * z, ty * y + c, ty * z - s * x, 0,
			tx * z - s * y, ty * z + s * x, t * z * z + c, 0,
			0, 0, 0, 1

		);

		return this;

	}

	public makeScale(x:number, y:number, z:number)
	{

		this.set(

			x, 0, 0, 0,
			0, y, 0, 0,
			0, 0, z, 0,
			0, 0, 0, 1

		);

		return this;

	}

	public compose(position, quaternion:Quaternion, scale)
	{
		this.makeRotationFromQuaternion(quaternion);
		this.scale(scale);
		this.setPosition(position);

		return this;
	}

	private __decompose_vector = null;
	private __decompose_matrix = null;

	public decompose(position, quaternion:Quaternion, scale)
	{
		if(!this.__decompose_vector){
			this.__decompose_vector = new Vector3(0, 0, 0);
		}

		if(!this.__decompose_matrix){
			this.__decompose_matrix = new Matrix4();
		}

		var vector = this.__decompose_vector;
		var matrix = this.__decompose_matrix;

		var te = this.elements;

		var sx = vector.set(te[ 0 ], te[ 1 ], te[ 2 ]).length();
		var sy = vector.set(te[ 4 ], te[ 5 ], te[ 6 ]).length();
		var sz = vector.set(te[ 8 ], te[ 9 ], te[ 10 ]).length();

		// if determine is negative, we need to invert one scale
		var det = this.determinant();
		if(det < 0)
		{
			sx = -sx;
		}

		position.x = te[ 12 ];
		position.y = te[ 13 ];
		position.z = te[ 14 ];

		// scale the rotation part

		matrix.elements.set(this.elements); // at this point matrix is incomplete so we can't use .copy()

		var invSX = 1 / sx;
		var invSY = 1 / sy;
		var invSZ = 1 / sz;

		matrix.elements[ 0 ] *= invSX;
		matrix.elements[ 1 ] *= invSX;
		matrix.elements[ 2 ] *= invSX;

		matrix.elements[ 4 ] *= invSY;
		matrix.elements[ 5 ] *= invSY;
		matrix.elements[ 6 ] *= invSY;

		matrix.elements[ 8 ] *= invSZ;
		matrix.elements[ 9 ] *= invSZ;
		matrix.elements[ 10 ] *= invSZ;

		quaternion.setFromRotationMatrix(matrix);

		scale.x = sx;
		scale.y = sy;
		scale.z = sz;

		return this;

	}

	/**
	 *
	 * @param left
	 * @param right
	 * @param bottom
	 * @param top
	 * @param near
	 * @param far
	 * @returns {Matrix4}
	 */
	public makeFrustum(left:number, right:number, bottom:number, top:number, near:number, far:number):Matrix4
	{

		var te = this.elements;
		var x = 2 * near / ( right - left );
		var y = 2 * near / ( top - bottom );

		var a = ( right + left ) / ( right - left );
		var b = ( top + bottom ) / ( top - bottom );
		var c = -( far + near ) / ( far - near );
		var d = -2 * far * near / ( far - near );

		te[ 0 ] = x;
		te[ 4 ] = 0;
		te[ 8 ] = a;
		te[ 12 ] = 0;
		te[ 1 ] = 0;
		te[ 5 ] = y;
		te[ 9 ] = b;
		te[ 13 ] = 0;
		te[ 2 ] = 0;
		te[ 6 ] = 0;
		te[ 10 ] = c;
		te[ 14 ] = d;
		te[ 3 ] = 0;
		te[ 7 ] = 0;
		te[ 11 ] = -1;
		te[ 15 ] = 0;

		return this;

	}

	public makePerspective(fov:number, aspect:number, near:number, far:number)
	{

		var ymax = near * Math.tan(MathUtil.degToRad(fov * 0.5));
		var ymin = -ymax;
		var xmin = ymin * aspect;
		var xmax = ymax * aspect;

		return this.makeFrustum(xmin, xmax, ymin, ymax, near, far);

	}

	public makeOrthographic(left:number, right:number, top:number, bottom:number, near:number, far:number)
	{

		var te = this.elements;
		var w = right - left;
		var h = top - bottom;
		var p = far - near;

		var x = ( right + left ) / w;
		var y = ( top + bottom ) / h;
		var z = ( far + near ) / p;

		te[ 0 ] = 2 / w;
		te[ 4 ] = 0;
		te[ 8 ] = 0;
		te[ 12 ] = -x;
		te[ 1 ] = 0;
		te[ 5 ] = 2 / h;
		te[ 9 ] = 0;
		te[ 13 ] = -y;
		te[ 2 ] = 0;
		te[ 6 ] = 0;
		te[ 10 ] = -2 / p;
		te[ 14 ] = -z;
		te[ 3 ] = 0;
		te[ 7 ] = 0;
		te[ 11 ] = 0;
		te[ 15 ] = 1;

		return this;

	}

	public fromArray(array:Float32Array)
	{

		this.elements.set(array);

		return this;

	}

	public toArray():number[]
	{

		var te = this.elements;

		return [
			te[ 0 ], te[ 1 ], te[ 2 ], te[ 3 ],
			te[ 4 ], te[ 5 ], te[ 6 ], te[ 7 ],
			te[ 8 ], te[ 9 ], te[ 10 ], te[ 11 ],
			te[ 12 ], te[ 13 ], te[ 14 ], te[ 15 ]
		];

	}

	public clone()
	{
		return new Matrix4().fromArray(this.elements);
	}

}
