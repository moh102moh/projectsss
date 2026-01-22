self["webpackHotUpdatepandemic_globe"]("main",{

/***/ "./node_modules/three/examples/jsm/postprocessing/EffectComposer.js":
/*!**************************************************************************!*\
  !*** ./node_modules/three/examples/jsm/postprocessing/EffectComposer.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EffectComposer": () => /* binding */ EffectComposer,
/* harmony export */   "Pass": () => /* binding */ Pass,
/* harmony export */   "FullScreenQuad": () => /* binding */ FullScreenQuad
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _shaders_CopyShader_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shaders/CopyShader.js */ "./node_modules/three/examples/jsm/shaders/CopyShader.js");
/* harmony import */ var _postprocessing_ShaderPass_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../postprocessing/ShaderPass.js */ "./node_modules/three/examples/jsm/postprocessing/ShaderPass.js");
/* harmony import */ var _postprocessing_MaskPass_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../postprocessing/MaskPass.js */ "./node_modules/three/examples/jsm/postprocessing/MaskPass.js");






class EffectComposer {

	constructor( renderer, renderTarget ) {

		this.renderer = renderer;

		if ( renderTarget === undefined ) {

			const parameters = {
				minFilter: three__WEBPACK_IMPORTED_MODULE_0__.LinearFilter,
				magFilter: three__WEBPACK_IMPORTED_MODULE_0__.LinearFilter,
				format: three__WEBPACK_IMPORTED_MODULE_0__.RGBAFormat
			};

			const size = renderer.getSize( new three__WEBPACK_IMPORTED_MODULE_0__.Vector2() );
			this._pixelRatio = renderer.getPixelRatio();
			this._width = size.width;
			this._height = size.height;

			renderTarget = new three__WEBPACK_IMPORTED_MODULE_0__.WebGLRenderTarget( this._width * this._pixelRatio, this._height * this._pixelRatio, parameters );
			renderTarget.texture.name = 'EffectComposer.rt1';

		} else {

			this._pixelRatio = 1;
			this._width = renderTarget.width;
			this._height = renderTarget.height;

		}

		this.renderTarget1 = renderTarget;
		this.renderTarget2 = renderTarget.clone();
		this.renderTarget2.texture.name = 'EffectComposer.rt2';

		this.writeBuffer = this.renderTarget1;
		this.readBuffer = this.renderTarget2;

		this.renderToScreen = true;

		this.passes = [];

		// dependencies

		if ( _shaders_CopyShader_js__WEBPACK_IMPORTED_MODULE_1__.CopyShader === undefined ) {

			console.error( 'THREE.EffectComposer relies on CopyShader' );

		}

		if ( _postprocessing_ShaderPass_js__WEBPACK_IMPORTED_MODULE_2__.ShaderPass === undefined ) {

			console.error( 'THREE.EffectComposer relies on ShaderPass' );

		}

		this.copyPass = new _postprocessing_ShaderPass_js__WEBPACK_IMPORTED_MODULE_2__.ShaderPass( _shaders_CopyShader_js__WEBPACK_IMPORTED_MODULE_1__.CopyShader );

		this.clock = new three__WEBPACK_IMPORTED_MODULE_0__.Clock();

	}

	swapBuffers() {

		const tmp = this.readBuffer;
		this.readBuffer = this.writeBuffer;
		this.writeBuffer = tmp;

	}

	addPass( pass ) {

		this.passes.push( pass );
		pass.setSize( this._width * this._pixelRatio, this._height * this._pixelRatio );

	}

	insertPass( pass, index ) {

		this.passes.splice( index, 0, pass );
		pass.setSize( this._width * this._pixelRatio, this._height * this._pixelRatio );

	}

	removePass( pass ) {

		const index = this.passes.indexOf( pass );

		if ( index !== - 1 ) {

			this.passes.splice( index, 1 );

		}

	}

	isLastEnabledPass( passIndex ) {

		for ( let i = passIndex + 1; i < this.passes.length; i ++ ) {

			if ( this.passes[ i ].enabled ) {

				return false;

			}

		}

		return true;

	}

	render( deltaTime ) {

		// deltaTime value is in seconds

		if ( deltaTime === undefined ) {

			deltaTime = this.clock.getDelta();

		}

		const currentRenderTarget = this.renderer.getRenderTarget();

		let maskActive = false;

		for ( let i = 0, il = this.passes.length; i < il; i ++ ) {

			const pass = this.passes[ i ];

			if ( pass.enabled === false ) continue;

			pass.renderToScreen = ( this.renderToScreen && this.isLastEnabledPass( i ) );
			pass.render( this.renderer, this.writeBuffer, this.readBuffer, deltaTime, maskActive );

			if ( pass.needsSwap ) {

				if ( maskActive ) {

					const context = this.renderer.getContext();
					const stencil = this.renderer.state.buffers.stencil;

					//context.stencilFunc( context.NOTEQUAL, 1, 0xffffffff );
					stencil.setFunc( context.NOTEQUAL, 1, 0xffffffff );

					this.copyPass.render( this.renderer, this.writeBuffer, this.readBuffer, deltaTime );

					//context.stencilFunc( context.EQUAL, 1, 0xffffffff );
					stencil.setFunc( context.EQUAL, 1, 0xffffffff );

				}

				this.swapBuffers();

			}

			if ( _postprocessing_MaskPass_js__WEBPACK_IMPORTED_MODULE_3__.MaskPass !== undefined ) {

				if ( pass instanceof _postprocessing_MaskPass_js__WEBPACK_IMPORTED_MODULE_3__.MaskPass ) {

					maskActive = true;

				} else if ( pass instanceof _postprocessing_MaskPass_js__WEBPACK_IMPORTED_MODULE_3__.ClearMaskPass ) {

					maskActive = false;

				}

			}

		}

		this.renderer.setRenderTarget( currentRenderTarget );

	}

	reset( renderTarget ) {

		if ( renderTarget === undefined ) {

			const size = this.renderer.getSize( new three__WEBPACK_IMPORTED_MODULE_0__.Vector2() );
			this._pixelRatio = this.renderer.getPixelRatio();
			this._width = size.width;
			this._height = size.height;

			renderTarget = this.renderTarget1.clone();
			renderTarget.setSize( this._width * this._pixelRatio, this._height * this._pixelRatio );

		}

		this.renderTarget1.dispose();
		this.renderTarget2.dispose();
		this.renderTarget1 = renderTarget;
		this.renderTarget2 = renderTarget.clone();

		this.writeBuffer = this.renderTarget1;
		this.readBuffer = this.renderTarget2;

	}

	setSize( width, height ) {

		this._width = width;
		this._height = height;

		const effectiveWidth = this._width * this._pixelRatio;
		const effectiveHeight = this._height * this._pixelRatio;

		this.renderTarget1.setSize( effectiveWidth, effectiveHeight );
		this.renderTarget2.setSize( effectiveWidth, effectiveHeight );

		for ( let i = 0; i < this.passes.length; i ++ ) {

			this.passes[ i ].setSize( effectiveWidth, effectiveHeight );

		}

	}

	setPixelRatio( pixelRatio ) {

		this._pixelRatio = pixelRatio;

		this.setSize( this._width, this._height );

	}

}


class Pass {

	constructor() {

		// if set to true, the pass is processed by the composer
		this.enabled = true;

		// if set to true, the pass indicates to swap read and write buffer after rendering
		this.needsSwap = true;

		// if set to true, the pass clears its buffer before rendering
		this.clear = false;

		// if set to true, the result of the pass is rendered to screen. This is set automatically by EffectComposer.
		this.renderToScreen = false;

	}

	setSize( /* width, height */ ) {}

	render( /* renderer, writeBuffer, readBuffer, deltaTime, maskActive */ ) {

		console.error( 'THREE.Pass: .render() must be implemented in derived pass.' );

	}

}

// Helper for passes that need to fill the viewport with a single quad.

const _camera = new three__WEBPACK_IMPORTED_MODULE_0__.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );

// https://github.com/mrdoob/three.js/pull/21358

const _geometry = new three__WEBPACK_IMPORTED_MODULE_0__.BufferGeometry();
_geometry.setAttribute( 'position', new three__WEBPACK_IMPORTED_MODULE_0__.Float32BufferAttribute( [ - 1, 3, 0, - 1, - 1, 0, 3, - 1, 0 ], 3 ) );
_geometry.setAttribute( 'uv', new three__WEBPACK_IMPORTED_MODULE_0__.Float32BufferAttribute( [ 0, 2, 0, 0, 2, 0 ], 2 ) );

class FullScreenQuad {

	constructor( material ) {

		this._mesh = new three__WEBPACK_IMPORTED_MODULE_0__.Mesh( _geometry, material );

	}

	dispose() {

		this._mesh.geometry.dispose();

	}

	render( renderer ) {

		renderer.render( this._mesh, _camera );

	}

	get material() {

		return this._mesh.material;

	}

	set material( value ) {

		this._mesh.material = value;

	}

}




/***/ }),

/***/ "./node_modules/three/examples/jsm/postprocessing/MaskPass.js":
/*!********************************************************************!*\
  !*** ./node_modules/three/examples/jsm/postprocessing/MaskPass.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MaskPass": () => /* binding */ MaskPass,
/* harmony export */   "ClearMaskPass": () => /* binding */ ClearMaskPass
/* harmony export */ });
/* harmony import */ var _postprocessing_Pass_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../postprocessing/Pass.js */ "./node_modules/three/examples/jsm/postprocessing/Pass.js");


class MaskPass extends _postprocessing_Pass_js__WEBPACK_IMPORTED_MODULE_0__.Pass {

	constructor( scene, camera ) {

		super();

		this.scene = scene;
		this.camera = camera;

		this.clear = true;
		this.needsSwap = false;

		this.inverse = false;

	}

	render( renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */ ) {

		const context = renderer.getContext();
		const state = renderer.state;

		// don't update color or depth

		state.buffers.color.setMask( false );
		state.buffers.depth.setMask( false );

		// lock buffers

		state.buffers.color.setLocked( true );
		state.buffers.depth.setLocked( true );

		// set up stencil

		let writeValue, clearValue;

		if ( this.inverse ) {

			writeValue = 0;
			clearValue = 1;

		} else {

			writeValue = 1;
			clearValue = 0;

		}

		state.buffers.stencil.setTest( true );
		state.buffers.stencil.setOp( context.REPLACE, context.REPLACE, context.REPLACE );
		state.buffers.stencil.setFunc( context.ALWAYS, writeValue, 0xffffffff );
		state.buffers.stencil.setClear( clearValue );
		state.buffers.stencil.setLocked( true );

		// draw into the stencil buffer

		renderer.setRenderTarget( readBuffer );
		if ( this.clear ) renderer.clear();
		renderer.render( this.scene, this.camera );

		renderer.setRenderTarget( writeBuffer );
		if ( this.clear ) renderer.clear();
		renderer.render( this.scene, this.camera );

		// unlock color and depth buffer for subsequent rendering

		state.buffers.color.setLocked( false );
		state.buffers.depth.setLocked( false );

		// only render where stencil is set to 1

		state.buffers.stencil.setLocked( false );
		state.buffers.stencil.setFunc( context.EQUAL, 1, 0xffffffff ); // draw if == 1
		state.buffers.stencil.setOp( context.KEEP, context.KEEP, context.KEEP );
		state.buffers.stencil.setLocked( true );

	}

}

class ClearMaskPass extends _postprocessing_Pass_js__WEBPACK_IMPORTED_MODULE_0__.Pass {

	constructor() {

		super();

		this.needsSwap = false;

	}

	render( renderer /*, writeBuffer, readBuffer, deltaTime, maskActive */ ) {

		renderer.state.buffers.stencil.setLocked( false );
		renderer.state.buffers.stencil.setTest( false );

	}

}




/***/ }),

/***/ "./node_modules/three/examples/jsm/postprocessing/Pass.js":
/*!****************************************************************!*\
  !*** ./node_modules/three/examples/jsm/postprocessing/Pass.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Pass": () => /* binding */ Pass,
/* harmony export */   "FullScreenQuad": () => /* binding */ FullScreenQuad
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");


class Pass {

	constructor() {

		// if set to true, the pass is processed by the composer
		this.enabled = true;

		// if set to true, the pass indicates to swap read and write buffer after rendering
		this.needsSwap = true;

		// if set to true, the pass clears its buffer before rendering
		this.clear = false;

		// if set to true, the result of the pass is rendered to screen. This is set automatically by EffectComposer.
		this.renderToScreen = false;

	}

	setSize( /* width, height */ ) {}

	render( /* renderer, writeBuffer, readBuffer, deltaTime, maskActive */ ) {

		console.error( 'THREE.Pass: .render() must be implemented in derived pass.' );

	}

}

// Helper for passes that need to fill the viewport with a single quad.

const _camera = new three__WEBPACK_IMPORTED_MODULE_0__.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );

// https://github.com/mrdoob/three.js/pull/21358

const _geometry = new three__WEBPACK_IMPORTED_MODULE_0__.BufferGeometry();
_geometry.setAttribute( 'position', new three__WEBPACK_IMPORTED_MODULE_0__.Float32BufferAttribute( [ - 1, 3, 0, - 1, - 1, 0, 3, - 1, 0 ], 3 ) );
_geometry.setAttribute( 'uv', new three__WEBPACK_IMPORTED_MODULE_0__.Float32BufferAttribute( [ 0, 2, 0, 0, 2, 0 ], 2 ) );

class FullScreenQuad {

	constructor( material ) {

		this._mesh = new three__WEBPACK_IMPORTED_MODULE_0__.Mesh( _geometry, material );

	}

	dispose() {

		this._mesh.geometry.dispose();

	}

	render( renderer ) {

		renderer.render( this._mesh, _camera );

	}

	get material() {

		return this._mesh.material;

	}

	set material( value ) {

		this._mesh.material = value;

	}

}




/***/ }),

/***/ "./node_modules/three/examples/jsm/postprocessing/RenderPass.js":
/*!**********************************************************************!*\
  !*** ./node_modules/three/examples/jsm/postprocessing/RenderPass.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RenderPass": () => /* binding */ RenderPass
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _postprocessing_Pass_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../postprocessing/Pass.js */ "./node_modules/three/examples/jsm/postprocessing/Pass.js");



class RenderPass extends _postprocessing_Pass_js__WEBPACK_IMPORTED_MODULE_0__.Pass {

	constructor( scene, camera, overrideMaterial, clearColor, clearAlpha ) {

		super();

		this.scene = scene;
		this.camera = camera;

		this.overrideMaterial = overrideMaterial;

		this.clearColor = clearColor;
		this.clearAlpha = ( clearAlpha !== undefined ) ? clearAlpha : 0;

		this.clear = true;
		this.clearDepth = false;
		this.needsSwap = false;
		this._oldClearColor = new three__WEBPACK_IMPORTED_MODULE_1__.Color();

	}

	render( renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */ ) {

		const oldAutoClear = renderer.autoClear;
		renderer.autoClear = false;

		let oldClearAlpha, oldOverrideMaterial;

		if ( this.overrideMaterial !== undefined ) {

			oldOverrideMaterial = this.scene.overrideMaterial;

			this.scene.overrideMaterial = this.overrideMaterial;

		}

		if ( this.clearColor ) {

			renderer.getClearColor( this._oldClearColor );
			oldClearAlpha = renderer.getClearAlpha();

			renderer.setClearColor( this.clearColor, this.clearAlpha );

		}

		if ( this.clearDepth ) {

			renderer.clearDepth();

		}

		renderer.setRenderTarget( this.renderToScreen ? null : readBuffer );

		// TODO: Avoid using autoClear properties, see https://github.com/mrdoob/three.js/pull/15571#issuecomment-465669600
		if ( this.clear ) renderer.clear( renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil );
		renderer.render( this.scene, this.camera );

		if ( this.clearColor ) {

			renderer.setClearColor( this._oldClearColor, oldClearAlpha );

		}

		if ( this.overrideMaterial !== undefined ) {

			this.scene.overrideMaterial = oldOverrideMaterial;

		}

		renderer.autoClear = oldAutoClear;

	}

}




/***/ }),

/***/ "./node_modules/three/examples/jsm/postprocessing/ShaderPass.js":
/*!**********************************************************************!*\
  !*** ./node_modules/three/examples/jsm/postprocessing/ShaderPass.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ShaderPass": () => /* binding */ ShaderPass
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _postprocessing_Pass_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../postprocessing/Pass.js */ "./node_modules/three/examples/jsm/postprocessing/Pass.js");



class ShaderPass extends _postprocessing_Pass_js__WEBPACK_IMPORTED_MODULE_0__.Pass {

	constructor( shader, textureID ) {

		super();

		this.textureID = ( textureID !== undefined ) ? textureID : 'tDiffuse';

		if ( shader instanceof three__WEBPACK_IMPORTED_MODULE_1__.ShaderMaterial ) {

			this.uniforms = shader.uniforms;

			this.material = shader;

		} else if ( shader ) {

			this.uniforms = three__WEBPACK_IMPORTED_MODULE_1__.UniformsUtils.clone( shader.uniforms );

			this.material = new three__WEBPACK_IMPORTED_MODULE_1__.ShaderMaterial( {

				defines: Object.assign( {}, shader.defines ),
				uniforms: this.uniforms,
				vertexShader: shader.vertexShader,
				fragmentShader: shader.fragmentShader

			} );

		}

		this.fsQuad = new _postprocessing_Pass_js__WEBPACK_IMPORTED_MODULE_0__.FullScreenQuad( this.material );

	}

	render( renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */ ) {

		if ( this.uniforms[ this.textureID ] ) {

			this.uniforms[ this.textureID ].value = readBuffer.texture;

		}

		this.fsQuad.material = this.material;

		if ( this.renderToScreen ) {

			renderer.setRenderTarget( null );
			this.fsQuad.render( renderer );

		} else {

			renderer.setRenderTarget( writeBuffer );
			// TODO: Avoid using autoClear properties, see https://github.com/mrdoob/three.js/pull/15571#issuecomment-465669600
			if ( this.clear ) renderer.clear( renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil );
			this.fsQuad.render( renderer );

		}

	}

}




/***/ }),

/***/ "./node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js":
/*!***************************************************************************!*\
  !*** ./node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UnrealBloomPass": () => /* binding */ UnrealBloomPass
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _postprocessing_Pass_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../postprocessing/Pass.js */ "./node_modules/three/examples/jsm/postprocessing/Pass.js");
/* harmony import */ var _shaders_CopyShader_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../shaders/CopyShader.js */ "./node_modules/three/examples/jsm/shaders/CopyShader.js");
/* harmony import */ var _shaders_LuminosityHighPassShader_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shaders/LuminosityHighPassShader.js */ "./node_modules/three/examples/jsm/shaders/LuminosityHighPassShader.js");





/**
 * UnrealBloomPass is inspired by the bloom pass of Unreal Engine. It creates a
 * mip map chain of bloom textures and blurs them with different radii. Because
 * of the weighted combination of mips, and because larger blurs are done on
 * higher mips, this effect provides good quality and performance.
 *
 * Reference:
 * - https://docs.unrealengine.com/latest/INT/Engine/Rendering/PostProcessEffects/Bloom/
 */
class UnrealBloomPass extends _postprocessing_Pass_js__WEBPACK_IMPORTED_MODULE_0__.Pass {

	constructor( resolution, strength, radius, threshold ) {

		super();

		this.strength = ( strength !== undefined ) ? strength : 1;
		this.radius = radius;
		this.threshold = threshold;
		this.resolution = ( resolution !== undefined ) ? new three__WEBPACK_IMPORTED_MODULE_1__.Vector2( resolution.x, resolution.y ) : new three__WEBPACK_IMPORTED_MODULE_1__.Vector2( 256, 256 );

		// create color only once here, reuse it later inside the render function
		this.clearColor = new three__WEBPACK_IMPORTED_MODULE_1__.Color( 0, 0, 0 );

		// render targets
		const pars = { minFilter: three__WEBPACK_IMPORTED_MODULE_1__.LinearFilter, magFilter: three__WEBPACK_IMPORTED_MODULE_1__.LinearFilter, format: three__WEBPACK_IMPORTED_MODULE_1__.RGBAFormat };
		this.renderTargetsHorizontal = [];
		this.renderTargetsVertical = [];
		this.nMips = 5;
		let resx = Math.round( this.resolution.x / 2 );
		let resy = Math.round( this.resolution.y / 2 );

		this.renderTargetBright = new three__WEBPACK_IMPORTED_MODULE_1__.WebGLRenderTarget( resx, resy, pars );
		this.renderTargetBright.texture.name = 'UnrealBloomPass.bright';
		this.renderTargetBright.texture.generateMipmaps = false;

		for ( let i = 0; i < this.nMips; i ++ ) {

			const renderTargetHorizonal = new three__WEBPACK_IMPORTED_MODULE_1__.WebGLRenderTarget( resx, resy, pars );

			renderTargetHorizonal.texture.name = 'UnrealBloomPass.h' + i;
			renderTargetHorizonal.texture.generateMipmaps = false;

			this.renderTargetsHorizontal.push( renderTargetHorizonal );

			const renderTargetVertical = new three__WEBPACK_IMPORTED_MODULE_1__.WebGLRenderTarget( resx, resy, pars );

			renderTargetVertical.texture.name = 'UnrealBloomPass.v' + i;
			renderTargetVertical.texture.generateMipmaps = false;

			this.renderTargetsVertical.push( renderTargetVertical );

			resx = Math.round( resx / 2 );

			resy = Math.round( resy / 2 );

		}

		// luminosity high pass material

		if ( _shaders_LuminosityHighPassShader_js__WEBPACK_IMPORTED_MODULE_2__.LuminosityHighPassShader === undefined )
			console.error( 'THREE.UnrealBloomPass relies on LuminosityHighPassShader' );

		const highPassShader = _shaders_LuminosityHighPassShader_js__WEBPACK_IMPORTED_MODULE_2__.LuminosityHighPassShader;
		this.highPassUniforms = three__WEBPACK_IMPORTED_MODULE_1__.UniformsUtils.clone( highPassShader.uniforms );

		this.highPassUniforms[ 'luminosityThreshold' ].value = threshold;
		this.highPassUniforms[ 'smoothWidth' ].value = 0.01;

		this.materialHighPassFilter = new three__WEBPACK_IMPORTED_MODULE_1__.ShaderMaterial( {
			uniforms: this.highPassUniforms,
			vertexShader: highPassShader.vertexShader,
			fragmentShader: highPassShader.fragmentShader,
			defines: {}
		} );

		// Gaussian Blur Materials
		this.separableBlurMaterials = [];
		const kernelSizeArray = [ 3, 5, 7, 9, 11 ];
		resx = Math.round( this.resolution.x / 2 );
		resy = Math.round( this.resolution.y / 2 );

		for ( let i = 0; i < this.nMips; i ++ ) {

			this.separableBlurMaterials.push( this.getSeperableBlurMaterial( kernelSizeArray[ i ] ) );

			this.separableBlurMaterials[ i ].uniforms[ 'texSize' ].value = new three__WEBPACK_IMPORTED_MODULE_1__.Vector2( resx, resy );

			resx = Math.round( resx / 2 );

			resy = Math.round( resy / 2 );

		}

		// Composite material
		this.compositeMaterial = this.getCompositeMaterial( this.nMips );
		this.compositeMaterial.uniforms[ 'blurTexture1' ].value = this.renderTargetsVertical[ 0 ].texture;
		this.compositeMaterial.uniforms[ 'blurTexture2' ].value = this.renderTargetsVertical[ 1 ].texture;
		this.compositeMaterial.uniforms[ 'blurTexture3' ].value = this.renderTargetsVertical[ 2 ].texture;
		this.compositeMaterial.uniforms[ 'blurTexture4' ].value = this.renderTargetsVertical[ 3 ].texture;
		this.compositeMaterial.uniforms[ 'blurTexture5' ].value = this.renderTargetsVertical[ 4 ].texture;
		this.compositeMaterial.uniforms[ 'bloomStrength' ].value = strength;
		this.compositeMaterial.uniforms[ 'bloomRadius' ].value = 0.1;
		this.compositeMaterial.needsUpdate = true;

		const bloomFactors = [ 1.0, 0.8, 0.6, 0.4, 0.2 ];
		this.compositeMaterial.uniforms[ 'bloomFactors' ].value = bloomFactors;
		this.bloomTintColors = [ new three__WEBPACK_IMPORTED_MODULE_1__.Vector3( 1, 1, 1 ), new three__WEBPACK_IMPORTED_MODULE_1__.Vector3( 1, 1, 1 ), new three__WEBPACK_IMPORTED_MODULE_1__.Vector3( 1, 1, 1 ), new three__WEBPACK_IMPORTED_MODULE_1__.Vector3( 1, 1, 1 ), new three__WEBPACK_IMPORTED_MODULE_1__.Vector3( 1, 1, 1 ) ];
		this.compositeMaterial.uniforms[ 'bloomTintColors' ].value = this.bloomTintColors;

		// copy material
		if ( _shaders_CopyShader_js__WEBPACK_IMPORTED_MODULE_3__.CopyShader === undefined ) {

			console.error( 'THREE.UnrealBloomPass relies on CopyShader' );

		}

		const copyShader = _shaders_CopyShader_js__WEBPACK_IMPORTED_MODULE_3__.CopyShader;

		this.copyUniforms = three__WEBPACK_IMPORTED_MODULE_1__.UniformsUtils.clone( copyShader.uniforms );
		this.copyUniforms[ 'opacity' ].value = 1.0;

		this.materialCopy = new three__WEBPACK_IMPORTED_MODULE_1__.ShaderMaterial( {
			uniforms: this.copyUniforms,
			vertexShader: copyShader.vertexShader,
			fragmentShader: copyShader.fragmentShader,
			blending: three__WEBPACK_IMPORTED_MODULE_1__.AdditiveBlending,
			depthTest: false,
			depthWrite: false,
			transparent: true
		} );

		this.enabled = true;
		this.needsSwap = false;

		this._oldClearColor = new three__WEBPACK_IMPORTED_MODULE_1__.Color();
		this.oldClearAlpha = 1;

		this.basic = new three__WEBPACK_IMPORTED_MODULE_1__.MeshBasicMaterial();

		this.fsQuad = new _postprocessing_Pass_js__WEBPACK_IMPORTED_MODULE_0__.FullScreenQuad( null );

	}

	dispose() {

		for ( let i = 0; i < this.renderTargetsHorizontal.length; i ++ ) {

			this.renderTargetsHorizontal[ i ].dispose();

		}

		for ( let i = 0; i < this.renderTargetsVertical.length; i ++ ) {

			this.renderTargetsVertical[ i ].dispose();

		}

		this.renderTargetBright.dispose();

	}

	setSize( width, height ) {

		let resx = Math.round( width / 2 );
		let resy = Math.round( height / 2 );

		this.renderTargetBright.setSize( resx, resy );

		for ( let i = 0; i < this.nMips; i ++ ) {

			this.renderTargetsHorizontal[ i ].setSize( resx, resy );
			this.renderTargetsVertical[ i ].setSize( resx, resy );

			this.separableBlurMaterials[ i ].uniforms[ 'texSize' ].value = new three__WEBPACK_IMPORTED_MODULE_1__.Vector2( resx, resy );

			resx = Math.round( resx / 2 );
			resy = Math.round( resy / 2 );

		}

	}

	render( renderer, writeBuffer, readBuffer, deltaTime, maskActive ) {

		renderer.getClearColor( this._oldClearColor );
		this.oldClearAlpha = renderer.getClearAlpha();
		const oldAutoClear = renderer.autoClear;
		renderer.autoClear = false;

		renderer.setClearColor( this.clearColor, 0 );

		if ( maskActive ) renderer.state.buffers.stencil.setTest( false );

		// Render input to screen

		if ( this.renderToScreen ) {

			this.fsQuad.material = this.basic;
			this.basic.map = readBuffer.texture;

			renderer.setRenderTarget( null );
			renderer.clear();
			this.fsQuad.render( renderer );

		}

		// 1. Extract Bright Areas

		this.highPassUniforms[ 'tDiffuse' ].value = readBuffer.texture;
		this.highPassUniforms[ 'luminosityThreshold' ].value = this.threshold;
		this.fsQuad.material = this.materialHighPassFilter;

		renderer.setRenderTarget( this.renderTargetBright );
		renderer.clear();
		this.fsQuad.render( renderer );

		// 2. Blur All the mips progressively

		let inputRenderTarget = this.renderTargetBright;

		for ( let i = 0; i < this.nMips; i ++ ) {

			this.fsQuad.material = this.separableBlurMaterials[ i ];

			this.separableBlurMaterials[ i ].uniforms[ 'colorTexture' ].value = inputRenderTarget.texture;
			this.separableBlurMaterials[ i ].uniforms[ 'direction' ].value = UnrealBloomPass.BlurDirectionX;
			renderer.setRenderTarget( this.renderTargetsHorizontal[ i ] );
			renderer.clear();
			this.fsQuad.render( renderer );

			this.separableBlurMaterials[ i ].uniforms[ 'colorTexture' ].value = this.renderTargetsHorizontal[ i ].texture;
			this.separableBlurMaterials[ i ].uniforms[ 'direction' ].value = UnrealBloomPass.BlurDirectionY;
			renderer.setRenderTarget( this.renderTargetsVertical[ i ] );
			renderer.clear();
			this.fsQuad.render( renderer );

			inputRenderTarget = this.renderTargetsVertical[ i ];

		}

		// Composite All the mips

		this.fsQuad.material = this.compositeMaterial;
		this.compositeMaterial.uniforms[ 'bloomStrength' ].value = this.strength;
		this.compositeMaterial.uniforms[ 'bloomRadius' ].value = this.radius;
		this.compositeMaterial.uniforms[ 'bloomTintColors' ].value = this.bloomTintColors;

		renderer.setRenderTarget( this.renderTargetsHorizontal[ 0 ] );
		renderer.clear();
		this.fsQuad.render( renderer );

		// Blend it additively over the input texture

		this.fsQuad.material = this.materialCopy;
		this.copyUniforms[ 'tDiffuse' ].value = this.renderTargetsHorizontal[ 0 ].texture;

		if ( maskActive ) renderer.state.buffers.stencil.setTest( true );

		if ( this.renderToScreen ) {

			renderer.setRenderTarget( null );
			this.fsQuad.render( renderer );

		} else {

			renderer.setRenderTarget( readBuffer );
			this.fsQuad.render( renderer );

		}

		// Restore renderer settings

		renderer.setClearColor( this._oldClearColor, this.oldClearAlpha );
		renderer.autoClear = oldAutoClear;

	}

	getSeperableBlurMaterial( kernelRadius ) {

		return new three__WEBPACK_IMPORTED_MODULE_1__.ShaderMaterial( {

			defines: {
				'KERNEL_RADIUS': kernelRadius,
				'SIGMA': kernelRadius
			},

			uniforms: {
				'colorTexture': { value: null },
				'texSize': { value: new three__WEBPACK_IMPORTED_MODULE_1__.Vector2( 0.5, 0.5 ) },
				'direction': { value: new three__WEBPACK_IMPORTED_MODULE_1__.Vector2( 0.5, 0.5 ) }
			},

			vertexShader:
				`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,

			fragmentShader:
				`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 texSize;
				uniform vec2 direction;

				float gaussianPdf(in float x, in float sigma) {
					return 0.39894 * exp( -0.5 * x * x/( sigma * sigma))/sigma;
				}
				void main() {
					vec2 invSize = 1.0 / texSize;
					float fSigma = float(SIGMA);
					float weightSum = gaussianPdf(0.0, fSigma);
					vec3 diffuseSum = texture2D( colorTexture, vUv).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianPdf(x, fSigma);
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`
		} );

	}

	getCompositeMaterial( nMips ) {

		return new three__WEBPACK_IMPORTED_MODULE_1__.ShaderMaterial( {

			defines: {
				'NUM_MIPS': nMips
			},

			uniforms: {
				'blurTexture1': { value: null },
				'blurTexture2': { value: null },
				'blurTexture3': { value: null },
				'blurTexture4': { value: null },
				'blurTexture5': { value: null },
				'dirtTexture': { value: null },
				'bloomStrength': { value: 1.0 },
				'bloomFactors': { value: null },
				'bloomTintColors': { value: null },
				'bloomRadius': { value: 0.0 }
			},

			vertexShader:
				`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,

			fragmentShader:
				`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform sampler2D dirtTexture;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`
		} );

	}

}

UnrealBloomPass.BlurDirectionX = new three__WEBPACK_IMPORTED_MODULE_1__.Vector2( 1.0, 0.0 );
UnrealBloomPass.BlurDirectionY = new three__WEBPACK_IMPORTED_MODULE_1__.Vector2( 0.0, 1.0 );




/***/ }),

/***/ "./node_modules/three/examples/jsm/shaders/CopyShader.js":
/*!***************************************************************!*\
  !*** ./node_modules/three/examples/jsm/shaders/CopyShader.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CopyShader": () => /* binding */ CopyShader
/* harmony export */ });
/**
 * Full-screen textured quad shader
 */

var CopyShader = {

	uniforms: {

		'tDiffuse': { value: null },
		'opacity': { value: 1.0 }

	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: /* glsl */`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;

		}`

};




/***/ }),

/***/ "./node_modules/three/examples/jsm/shaders/LuminosityHighPassShader.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/three/examples/jsm/shaders/LuminosityHighPassShader.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LuminosityHighPassShader": () => /* binding */ LuminosityHighPassShader
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");


/**
 * Luminosity
 * http://en.wikipedia.org/wiki/Luminosity
 */

const LuminosityHighPassShader = {

	shaderID: 'luminosityHighPass',

	uniforms: {

		'tDiffuse': { value: null },
		'luminosityThreshold': { value: 1.0 },
		'smoothWidth': { value: 1.0 },
		'defaultColor': { value: new three__WEBPACK_IMPORTED_MODULE_0__.Color( 0x000000 ) },
		'defaultOpacity': { value: 0.0 }

	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: /* glsl */`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			vec3 luma = vec3( 0.299, 0.587, 0.114 );

			float v = dot( texel.xyz, luma );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`

};




/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three_globe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three-globe */ "./node_modules/three-globe/dist/three-globe.module.js");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three_examples_jsm_postprocessing_EffectComposer_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! three/examples/jsm/postprocessing/EffectComposer.js */ "./node_modules/three/examples/jsm/postprocessing/EffectComposer.js");
/* harmony import */ var three_examples_jsm_postprocessing_RenderPass_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! three/examples/jsm/postprocessing/RenderPass.js */ "./node_modules/three/examples/jsm/postprocessing/RenderPass.js");
/* harmony import */ var three_examples_jsm_postprocessing_UnrealBloomPass_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! three/examples/jsm/postprocessing/UnrealBloomPass.js */ "./node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js");
/* harmony import */ var three_examples_jsm_controls_OrbitControls_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls.js */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");
/* harmony import */ var three_glow_mesh__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three-glow-mesh */ "./node_modules/three-glow-mesh/dist/index.module.js");
/* harmony import */ var _files_globe_data_min_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./files/globe-data-min.json */ "./src/files/globe-data-min.json");
/* harmony import */ var _files_my_flights_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./files/my-flights.json */ "./src/files/my-flights.json");
/* harmony import */ var _files_my_airports_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./files/my-airports.json */ "./src/files/my-airports.json");












var renderer, camera, scene, controls ,composer;
let mouseX = 0;
let mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
var Globe;

init();
initGlobe();
onWindowResize();
animate();

// SECTION Initializing core ThreeJS elements
function init() {
  // Initialize renderer
  renderer = new three__WEBPACK_IMPORTED_MODULE_5__.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.outputEncoding = THREE.sRGBEncoding;
  document.body.appendChild(renderer.domElement);

  // Initialize scene, light
  scene = new three__WEBPACK_IMPORTED_MODULE_5__.Scene();
  scene.add(new three__WEBPACK_IMPORTED_MODULE_5__.AmbientLight(0xbbbbbb, 0.3));
  scene.background = new three__WEBPACK_IMPORTED_MODULE_5__.Color(0x000000);

  // Initialize camera, light
  camera = new three__WEBPACK_IMPORTED_MODULE_5__.PerspectiveCamera();
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

   const renderPass = new three_examples_jsm_postprocessing_RenderPass_js__WEBPACK_IMPORTED_MODULE_6__.RenderPass(scene, camera);
  const bloomPass = new three_examples_jsm_postprocessing_UnrealBloomPass_js__WEBPACK_IMPORTED_MODULE_7__.UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.8,  // strength
    0.3,  // radius
    0.1   // threshold
  );
  composer = new three_examples_jsm_postprocessing_EffectComposer_js__WEBPACK_IMPORTED_MODULE_8__.EffectComposer(renderer);
  composer.addPass(renderPass);
  composer.addPass(bloomPass);
  
  var dLight = new three__WEBPACK_IMPORTED_MODULE_5__.DirectionalLight(0xffffff, 0.8);
  dLight.position.set(-800, 2000, 400);
  camera.add(dLight);

  var dLight1 = new three__WEBPACK_IMPORTED_MODULE_5__.DirectionalLight(0x7982f6, 1);
  dLight1.position.set(-200, 500, 200);
  camera.add(dLight1);

  var dLight2 = new three__WEBPACK_IMPORTED_MODULE_5__.PointLight(0x8566cc, 0.5);
  dLight2.position.set(-200, 500, 200);
  camera.add(dLight2);

  camera.position.z = 400;
  camera.position.x = 0;
  camera.position.y = 0;

  scene.add(camera);

  // Additional effects
  scene.fog = new three__WEBPACK_IMPORTED_MODULE_5__.Fog(0x535ef3, 400, 2000);

  // Helpers
  // const axesHelper = new AxesHelper(800);
  // scene.add(axesHelper);
  // var helper = new DirectionalLightHelper(dLight);
  // scene.add(helper);
  // var helperCamera = new CameraHelper(dLight.shadow.camera);
  // scene.add(helperCamera);

  // Initialize controls
  controls = new three_examples_jsm_controls_OrbitControls_js__WEBPACK_IMPORTED_MODULE_9__.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dynamicDampingFactor = 0.01;
  controls.enablePan = false;
  controls.minDistance = 200;
  controls.maxDistance = 500;
  controls.rotateSpeed = 0.8;
  controls.zoomSpeed = 1;
  controls.autoRotate = false;

  controls.minPolarAngle = Math.PI / 3.5;
  controls.maxPolarAngle = Math.PI - Math.PI / 3;

  window.addEventListener("resize", onWindowResize, false);
  document.addEventListener("mousemove", onMouseMove);
}
// SECTION Globe
// ----------------------------------------------------------------
// --- REPLACE YOUR OLD initGlobe FUNCTION WITH THIS ENTIRE BLOCK ---
// ----------------------------------------------------------------

function initGlobe() {
  // 1. --- Initialize the Globe and set up the hexagon style ---
  Globe = new three_globe__WEBPACK_IMPORTED_MODULE_0__.default({
    waitForGlobeReady: true,
    animateIn: true,
  })
    .hexPolygonsData(_files_globe_data_min_json__WEBPACK_IMPORTED_MODULE_2__.features)
    //
    // --- KEY CHANGES for VISIBLE, TIGHT HEXAGONS ---
    .hexPolygonResolution(3) // Lower number = BIGGER hexagons
    .hexPolygonMargin(0.4)   // Small number = hexagons are VERY CLOSE
    //
    .showAtmosphere(true)
    .atmosphereColor('#7b8b2fff')
    .atmosphereAltitude(0.25)
    // --- Set a single, bright color for ALL hexagons ---
    .hexPolygonColor(() => '#c5a920ff');

  // 2. --- Your original label and point code ---
  setTimeout(() => {
    Globe.labelsData(_files_my_airports_json__WEBPACK_IMPORTED_MODULE_4__.airports)
      .labelColor(() => '#ffcb21')
      .labelDotOrientation((e) => (e.text === 'ALA' ? 'top' : 'right'))
      .labelDotRadius(0.3)
      .labelSize((e) => e.size)
      .labelText('city')
      .labelResolution(6)
      .labelAltitude(0.01)
      .pointsData(_files_my_airports_json__WEBPACK_IMPORTED_MODULE_4__.airports)
      .pointColor(() => '#ffffff')
      .pointsMerge(true)
      .pointAltitude(0.07)
      .pointRadius(0.05);
  }, 1000);

  // 3. --- Globe Base Material (THE CRITICAL FIX) ---
  // The globe *underneath* the hexagons must be dark and solid.
  const globeMaterial = Globe.globeMaterial();

// --- Settings for True Transparency ---
globeMaterial.transparent = true;
globeMaterial.opacity = 0.5;      // <-- Adjust this value (0.1 to 0.5 is good)
globeMaterial.color = new three__WEBPACK_IMPORTED_MODULE_5__.Color(0x000000); 
globeMaterial.emissive = new three__WEBPACK_IMPORTED_MODULE_5__.Color(0x000000);
globeMaterial.shininess = 0;

  // 4. --- Final Globe orientation and adding to scene ---
  const lat = 24;
  const lng = 45;
  const rotationY = -lng * (Math.PI / 180);
  const rotationZ = lat * (Math.PI / 180);
  Globe.rotateY(rotationY);
  Globe.rotateZ(rotationZ);

  scene.add(Globe);

}

function onMouseMove(event) {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
  // console.log("x: " + mouseX + " y: " + mouseY);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  windowHalfX = window.innerWidth / 1.5;
  windowHalfY = window.innerHeight / 1.5;
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  camera.position.x +=
    Math.abs(mouseX) <= windowHalfX / 2
      ? (mouseX / 2 - camera.position.x) * 0.005
      : 0;
  camera.position.y += (-mouseY / 2 - camera.position.y) * 0.005;
  camera.lookAt(scene.position);
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ 	"use strict";
/******/ 
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => "b5265000f10c832b03c6"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL25vZGVfbW9kdWxlcy90aHJlZS9leGFtcGxlcy9qc20vcG9zdHByb2Nlc3NpbmcvRWZmZWN0Q29tcG9zZXIuanMiLCJ3ZWJwYWNrOi8vcGFuZGVtaWMtZ2xvYmUvLi9ub2RlX21vZHVsZXMvdGhyZWUvZXhhbXBsZXMvanNtL3Bvc3Rwcm9jZXNzaW5nL01hc2tQYXNzLmpzIiwid2VicGFjazovL3BhbmRlbWljLWdsb2JlLy4vbm9kZV9tb2R1bGVzL3RocmVlL2V4YW1wbGVzL2pzbS9wb3N0cHJvY2Vzc2luZy9QYXNzLmpzIiwid2VicGFjazovL3BhbmRlbWljLWdsb2JlLy4vbm9kZV9tb2R1bGVzL3RocmVlL2V4YW1wbGVzL2pzbS9wb3N0cHJvY2Vzc2luZy9SZW5kZXJQYXNzLmpzIiwid2VicGFjazovL3BhbmRlbWljLWdsb2JlLy4vbm9kZV9tb2R1bGVzL3RocmVlL2V4YW1wbGVzL2pzbS9wb3N0cHJvY2Vzc2luZy9TaGFkZXJQYXNzLmpzIiwid2VicGFjazovL3BhbmRlbWljLWdsb2JlLy4vbm9kZV9tb2R1bGVzL3RocmVlL2V4YW1wbGVzL2pzbS9wb3N0cHJvY2Vzc2luZy9VbnJlYWxCbG9vbVBhc3MuanMiLCJ3ZWJwYWNrOi8vcGFuZGVtaWMtZ2xvYmUvLi9ub2RlX21vZHVsZXMvdGhyZWUvZXhhbXBsZXMvanNtL3NoYWRlcnMvQ29weVNoYWRlci5qcyIsIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL25vZGVfbW9kdWxlcy90aHJlZS9leGFtcGxlcy9qc20vc2hhZGVycy9MdW1pbm9zaXR5SGlnaFBhc3NTaGFkZXIuanMiLCJ3ZWJwYWNrOi8vcGFuZGVtaWMtZ2xvYmUvLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vcGFuZGVtaWMtZ2xvYmUvd2VicGFjay9ydW50aW1lL2dldEZ1bGxIYXNoIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFVZTtBQUN1QztBQUNP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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHFCQUFxQiw2REFBdUI7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsNkRBQXVCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDRCQUE0QjtBQUM1QiwwQkFBMEIsd0NBQUssVztBQUMvQiw2QkFBNkIsd0NBQUs7QUFDbEM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztXQ3ZNQSxvRCIsImZpbGUiOiJtYWluLmMzMTIxYjkyMzM0MDMxYzBkMDIwLmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuXHRCdWZmZXJHZW9tZXRyeSxcblx0Q2xvY2ssXG5cdEZsb2F0MzJCdWZmZXJBdHRyaWJ1dGUsXG5cdExpbmVhckZpbHRlcixcblx0TWVzaCxcblx0T3J0aG9ncmFwaGljQ2FtZXJhLFxuXHRSR0JBRm9ybWF0LFxuXHRWZWN0b3IyLFxuXHRXZWJHTFJlbmRlclRhcmdldFxufSBmcm9tICd0aHJlZSc7XG5pbXBvcnQgeyBDb3B5U2hhZGVyIH0gZnJvbSAnLi4vc2hhZGVycy9Db3B5U2hhZGVyLmpzJztcbmltcG9ydCB7IFNoYWRlclBhc3MgfSBmcm9tICcuLi9wb3N0cHJvY2Vzc2luZy9TaGFkZXJQYXNzLmpzJztcbmltcG9ydCB7IE1hc2tQYXNzIH0gZnJvbSAnLi4vcG9zdHByb2Nlc3NpbmcvTWFza1Bhc3MuanMnO1xuaW1wb3J0IHsgQ2xlYXJNYXNrUGFzcyB9IGZyb20gJy4uL3Bvc3Rwcm9jZXNzaW5nL01hc2tQYXNzLmpzJztcblxuY2xhc3MgRWZmZWN0Q29tcG9zZXIge1xuXG5cdGNvbnN0cnVjdG9yKCByZW5kZXJlciwgcmVuZGVyVGFyZ2V0ICkge1xuXG5cdFx0dGhpcy5yZW5kZXJlciA9IHJlbmRlcmVyO1xuXG5cdFx0aWYgKCByZW5kZXJUYXJnZXQgPT09IHVuZGVmaW5lZCApIHtcblxuXHRcdFx0Y29uc3QgcGFyYW1ldGVycyA9IHtcblx0XHRcdFx0bWluRmlsdGVyOiBMaW5lYXJGaWx0ZXIsXG5cdFx0XHRcdG1hZ0ZpbHRlcjogTGluZWFyRmlsdGVyLFxuXHRcdFx0XHRmb3JtYXQ6IFJHQkFGb3JtYXRcblx0XHRcdH07XG5cblx0XHRcdGNvbnN0IHNpemUgPSByZW5kZXJlci5nZXRTaXplKCBuZXcgVmVjdG9yMigpICk7XG5cdFx0XHR0aGlzLl9waXhlbFJhdGlvID0gcmVuZGVyZXIuZ2V0UGl4ZWxSYXRpbygpO1xuXHRcdFx0dGhpcy5fd2lkdGggPSBzaXplLndpZHRoO1xuXHRcdFx0dGhpcy5faGVpZ2h0ID0gc2l6ZS5oZWlnaHQ7XG5cblx0XHRcdHJlbmRlclRhcmdldCA9IG5ldyBXZWJHTFJlbmRlclRhcmdldCggdGhpcy5fd2lkdGggKiB0aGlzLl9waXhlbFJhdGlvLCB0aGlzLl9oZWlnaHQgKiB0aGlzLl9waXhlbFJhdGlvLCBwYXJhbWV0ZXJzICk7XG5cdFx0XHRyZW5kZXJUYXJnZXQudGV4dHVyZS5uYW1lID0gJ0VmZmVjdENvbXBvc2VyLnJ0MSc7XG5cblx0XHR9IGVsc2Uge1xuXG5cdFx0XHR0aGlzLl9waXhlbFJhdGlvID0gMTtcblx0XHRcdHRoaXMuX3dpZHRoID0gcmVuZGVyVGFyZ2V0LndpZHRoO1xuXHRcdFx0dGhpcy5faGVpZ2h0ID0gcmVuZGVyVGFyZ2V0LmhlaWdodDtcblxuXHRcdH1cblxuXHRcdHRoaXMucmVuZGVyVGFyZ2V0MSA9IHJlbmRlclRhcmdldDtcblx0XHR0aGlzLnJlbmRlclRhcmdldDIgPSByZW5kZXJUYXJnZXQuY2xvbmUoKTtcblx0XHR0aGlzLnJlbmRlclRhcmdldDIudGV4dHVyZS5uYW1lID0gJ0VmZmVjdENvbXBvc2VyLnJ0Mic7XG5cblx0XHR0aGlzLndyaXRlQnVmZmVyID0gdGhpcy5yZW5kZXJUYXJnZXQxO1xuXHRcdHRoaXMucmVhZEJ1ZmZlciA9IHRoaXMucmVuZGVyVGFyZ2V0MjtcblxuXHRcdHRoaXMucmVuZGVyVG9TY3JlZW4gPSB0cnVlO1xuXG5cdFx0dGhpcy5wYXNzZXMgPSBbXTtcblxuXHRcdC8vIGRlcGVuZGVuY2llc1xuXG5cdFx0aWYgKCBDb3B5U2hhZGVyID09PSB1bmRlZmluZWQgKSB7XG5cblx0XHRcdGNvbnNvbGUuZXJyb3IoICdUSFJFRS5FZmZlY3RDb21wb3NlciByZWxpZXMgb24gQ29weVNoYWRlcicgKTtcblxuXHRcdH1cblxuXHRcdGlmICggU2hhZGVyUGFzcyA9PT0gdW5kZWZpbmVkICkge1xuXG5cdFx0XHRjb25zb2xlLmVycm9yKCAnVEhSRUUuRWZmZWN0Q29tcG9zZXIgcmVsaWVzIG9uIFNoYWRlclBhc3MnICk7XG5cblx0XHR9XG5cblx0XHR0aGlzLmNvcHlQYXNzID0gbmV3IFNoYWRlclBhc3MoIENvcHlTaGFkZXIgKTtcblxuXHRcdHRoaXMuY2xvY2sgPSBuZXcgQ2xvY2soKTtcblxuXHR9XG5cblx0c3dhcEJ1ZmZlcnMoKSB7XG5cblx0XHRjb25zdCB0bXAgPSB0aGlzLnJlYWRCdWZmZXI7XG5cdFx0dGhpcy5yZWFkQnVmZmVyID0gdGhpcy53cml0ZUJ1ZmZlcjtcblx0XHR0aGlzLndyaXRlQnVmZmVyID0gdG1wO1xuXG5cdH1cblxuXHRhZGRQYXNzKCBwYXNzICkge1xuXG5cdFx0dGhpcy5wYXNzZXMucHVzaCggcGFzcyApO1xuXHRcdHBhc3Muc2V0U2l6ZSggdGhpcy5fd2lkdGggKiB0aGlzLl9waXhlbFJhdGlvLCB0aGlzLl9oZWlnaHQgKiB0aGlzLl9waXhlbFJhdGlvICk7XG5cblx0fVxuXG5cdGluc2VydFBhc3MoIHBhc3MsIGluZGV4ICkge1xuXG5cdFx0dGhpcy5wYXNzZXMuc3BsaWNlKCBpbmRleCwgMCwgcGFzcyApO1xuXHRcdHBhc3Muc2V0U2l6ZSggdGhpcy5fd2lkdGggKiB0aGlzLl9waXhlbFJhdGlvLCB0aGlzLl9oZWlnaHQgKiB0aGlzLl9waXhlbFJhdGlvICk7XG5cblx0fVxuXG5cdHJlbW92ZVBhc3MoIHBhc3MgKSB7XG5cblx0XHRjb25zdCBpbmRleCA9IHRoaXMucGFzc2VzLmluZGV4T2YoIHBhc3MgKTtcblxuXHRcdGlmICggaW5kZXggIT09IC0gMSApIHtcblxuXHRcdFx0dGhpcy5wYXNzZXMuc3BsaWNlKCBpbmRleCwgMSApO1xuXG5cdFx0fVxuXG5cdH1cblxuXHRpc0xhc3RFbmFibGVkUGFzcyggcGFzc0luZGV4ICkge1xuXG5cdFx0Zm9yICggbGV0IGkgPSBwYXNzSW5kZXggKyAxOyBpIDwgdGhpcy5wYXNzZXMubGVuZ3RoOyBpICsrICkge1xuXG5cdFx0XHRpZiAoIHRoaXMucGFzc2VzWyBpIF0uZW5hYmxlZCApIHtcblxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXG5cdH1cblxuXHRyZW5kZXIoIGRlbHRhVGltZSApIHtcblxuXHRcdC8vIGRlbHRhVGltZSB2YWx1ZSBpcyBpbiBzZWNvbmRzXG5cblx0XHRpZiAoIGRlbHRhVGltZSA9PT0gdW5kZWZpbmVkICkge1xuXG5cdFx0XHRkZWx0YVRpbWUgPSB0aGlzLmNsb2NrLmdldERlbHRhKCk7XG5cblx0XHR9XG5cblx0XHRjb25zdCBjdXJyZW50UmVuZGVyVGFyZ2V0ID0gdGhpcy5yZW5kZXJlci5nZXRSZW5kZXJUYXJnZXQoKTtcblxuXHRcdGxldCBtYXNrQWN0aXZlID0gZmFsc2U7XG5cblx0XHRmb3IgKCBsZXQgaSA9IDAsIGlsID0gdGhpcy5wYXNzZXMubGVuZ3RoOyBpIDwgaWw7IGkgKysgKSB7XG5cblx0XHRcdGNvbnN0IHBhc3MgPSB0aGlzLnBhc3Nlc1sgaSBdO1xuXG5cdFx0XHRpZiAoIHBhc3MuZW5hYmxlZCA9PT0gZmFsc2UgKSBjb250aW51ZTtcblxuXHRcdFx0cGFzcy5yZW5kZXJUb1NjcmVlbiA9ICggdGhpcy5yZW5kZXJUb1NjcmVlbiAmJiB0aGlzLmlzTGFzdEVuYWJsZWRQYXNzKCBpICkgKTtcblx0XHRcdHBhc3MucmVuZGVyKCB0aGlzLnJlbmRlcmVyLCB0aGlzLndyaXRlQnVmZmVyLCB0aGlzLnJlYWRCdWZmZXIsIGRlbHRhVGltZSwgbWFza0FjdGl2ZSApO1xuXG5cdFx0XHRpZiAoIHBhc3MubmVlZHNTd2FwICkge1xuXG5cdFx0XHRcdGlmICggbWFza0FjdGl2ZSApIHtcblxuXHRcdFx0XHRcdGNvbnN0IGNvbnRleHQgPSB0aGlzLnJlbmRlcmVyLmdldENvbnRleHQoKTtcblx0XHRcdFx0XHRjb25zdCBzdGVuY2lsID0gdGhpcy5yZW5kZXJlci5zdGF0ZS5idWZmZXJzLnN0ZW5jaWw7XG5cblx0XHRcdFx0XHQvL2NvbnRleHQuc3RlbmNpbEZ1bmMoIGNvbnRleHQuTk9URVFVQUwsIDEsIDB4ZmZmZmZmZmYgKTtcblx0XHRcdFx0XHRzdGVuY2lsLnNldEZ1bmMoIGNvbnRleHQuTk9URVFVQUwsIDEsIDB4ZmZmZmZmZmYgKTtcblxuXHRcdFx0XHRcdHRoaXMuY29weVBhc3MucmVuZGVyKCB0aGlzLnJlbmRlcmVyLCB0aGlzLndyaXRlQnVmZmVyLCB0aGlzLnJlYWRCdWZmZXIsIGRlbHRhVGltZSApO1xuXG5cdFx0XHRcdFx0Ly9jb250ZXh0LnN0ZW5jaWxGdW5jKCBjb250ZXh0LkVRVUFMLCAxLCAweGZmZmZmZmZmICk7XG5cdFx0XHRcdFx0c3RlbmNpbC5zZXRGdW5jKCBjb250ZXh0LkVRVUFMLCAxLCAweGZmZmZmZmZmICk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRoaXMuc3dhcEJ1ZmZlcnMoKTtcblxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIE1hc2tQYXNzICE9PSB1bmRlZmluZWQgKSB7XG5cblx0XHRcdFx0aWYgKCBwYXNzIGluc3RhbmNlb2YgTWFza1Bhc3MgKSB7XG5cblx0XHRcdFx0XHRtYXNrQWN0aXZlID0gdHJ1ZTtcblxuXHRcdFx0XHR9IGVsc2UgaWYgKCBwYXNzIGluc3RhbmNlb2YgQ2xlYXJNYXNrUGFzcyApIHtcblxuXHRcdFx0XHRcdG1hc2tBY3RpdmUgPSBmYWxzZTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdHRoaXMucmVuZGVyZXIuc2V0UmVuZGVyVGFyZ2V0KCBjdXJyZW50UmVuZGVyVGFyZ2V0ICk7XG5cblx0fVxuXG5cdHJlc2V0KCByZW5kZXJUYXJnZXQgKSB7XG5cblx0XHRpZiAoIHJlbmRlclRhcmdldCA9PT0gdW5kZWZpbmVkICkge1xuXG5cdFx0XHRjb25zdCBzaXplID0gdGhpcy5yZW5kZXJlci5nZXRTaXplKCBuZXcgVmVjdG9yMigpICk7XG5cdFx0XHR0aGlzLl9waXhlbFJhdGlvID0gdGhpcy5yZW5kZXJlci5nZXRQaXhlbFJhdGlvKCk7XG5cdFx0XHR0aGlzLl93aWR0aCA9IHNpemUud2lkdGg7XG5cdFx0XHR0aGlzLl9oZWlnaHQgPSBzaXplLmhlaWdodDtcblxuXHRcdFx0cmVuZGVyVGFyZ2V0ID0gdGhpcy5yZW5kZXJUYXJnZXQxLmNsb25lKCk7XG5cdFx0XHRyZW5kZXJUYXJnZXQuc2V0U2l6ZSggdGhpcy5fd2lkdGggKiB0aGlzLl9waXhlbFJhdGlvLCB0aGlzLl9oZWlnaHQgKiB0aGlzLl9waXhlbFJhdGlvICk7XG5cblx0XHR9XG5cblx0XHR0aGlzLnJlbmRlclRhcmdldDEuZGlzcG9zZSgpO1xuXHRcdHRoaXMucmVuZGVyVGFyZ2V0Mi5kaXNwb3NlKCk7XG5cdFx0dGhpcy5yZW5kZXJUYXJnZXQxID0gcmVuZGVyVGFyZ2V0O1xuXHRcdHRoaXMucmVuZGVyVGFyZ2V0MiA9IHJlbmRlclRhcmdldC5jbG9uZSgpO1xuXG5cdFx0dGhpcy53cml0ZUJ1ZmZlciA9IHRoaXMucmVuZGVyVGFyZ2V0MTtcblx0XHR0aGlzLnJlYWRCdWZmZXIgPSB0aGlzLnJlbmRlclRhcmdldDI7XG5cblx0fVxuXG5cdHNldFNpemUoIHdpZHRoLCBoZWlnaHQgKSB7XG5cblx0XHR0aGlzLl93aWR0aCA9IHdpZHRoO1xuXHRcdHRoaXMuX2hlaWdodCA9IGhlaWdodDtcblxuXHRcdGNvbnN0IGVmZmVjdGl2ZVdpZHRoID0gdGhpcy5fd2lkdGggKiB0aGlzLl9waXhlbFJhdGlvO1xuXHRcdGNvbnN0IGVmZmVjdGl2ZUhlaWdodCA9IHRoaXMuX2hlaWdodCAqIHRoaXMuX3BpeGVsUmF0aW87XG5cblx0XHR0aGlzLnJlbmRlclRhcmdldDEuc2V0U2l6ZSggZWZmZWN0aXZlV2lkdGgsIGVmZmVjdGl2ZUhlaWdodCApO1xuXHRcdHRoaXMucmVuZGVyVGFyZ2V0Mi5zZXRTaXplKCBlZmZlY3RpdmVXaWR0aCwgZWZmZWN0aXZlSGVpZ2h0ICk7XG5cblx0XHRmb3IgKCBsZXQgaSA9IDA7IGkgPCB0aGlzLnBhc3Nlcy5sZW5ndGg7IGkgKysgKSB7XG5cblx0XHRcdHRoaXMucGFzc2VzWyBpIF0uc2V0U2l6ZSggZWZmZWN0aXZlV2lkdGgsIGVmZmVjdGl2ZUhlaWdodCApO1xuXG5cdFx0fVxuXG5cdH1cblxuXHRzZXRQaXhlbFJhdGlvKCBwaXhlbFJhdGlvICkge1xuXG5cdFx0dGhpcy5fcGl4ZWxSYXRpbyA9IHBpeGVsUmF0aW87XG5cblx0XHR0aGlzLnNldFNpemUoIHRoaXMuX3dpZHRoLCB0aGlzLl9oZWlnaHQgKTtcblxuXHR9XG5cbn1cblxuXG5jbGFzcyBQYXNzIHtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblxuXHRcdC8vIGlmIHNldCB0byB0cnVlLCB0aGUgcGFzcyBpcyBwcm9jZXNzZWQgYnkgdGhlIGNvbXBvc2VyXG5cdFx0dGhpcy5lbmFibGVkID0gdHJ1ZTtcblxuXHRcdC8vIGlmIHNldCB0byB0cnVlLCB0aGUgcGFzcyBpbmRpY2F0ZXMgdG8gc3dhcCByZWFkIGFuZCB3cml0ZSBidWZmZXIgYWZ0ZXIgcmVuZGVyaW5nXG5cdFx0dGhpcy5uZWVkc1N3YXAgPSB0cnVlO1xuXG5cdFx0Ly8gaWYgc2V0IHRvIHRydWUsIHRoZSBwYXNzIGNsZWFycyBpdHMgYnVmZmVyIGJlZm9yZSByZW5kZXJpbmdcblx0XHR0aGlzLmNsZWFyID0gZmFsc2U7XG5cblx0XHQvLyBpZiBzZXQgdG8gdHJ1ZSwgdGhlIHJlc3VsdCBvZiB0aGUgcGFzcyBpcyByZW5kZXJlZCB0byBzY3JlZW4uIFRoaXMgaXMgc2V0IGF1dG9tYXRpY2FsbHkgYnkgRWZmZWN0Q29tcG9zZXIuXG5cdFx0dGhpcy5yZW5kZXJUb1NjcmVlbiA9IGZhbHNlO1xuXG5cdH1cblxuXHRzZXRTaXplKCAvKiB3aWR0aCwgaGVpZ2h0ICovICkge31cblxuXHRyZW5kZXIoIC8qIHJlbmRlcmVyLCB3cml0ZUJ1ZmZlciwgcmVhZEJ1ZmZlciwgZGVsdGFUaW1lLCBtYXNrQWN0aXZlICovICkge1xuXG5cdFx0Y29uc29sZS5lcnJvciggJ1RIUkVFLlBhc3M6IC5yZW5kZXIoKSBtdXN0IGJlIGltcGxlbWVudGVkIGluIGRlcml2ZWQgcGFzcy4nICk7XG5cblx0fVxuXG59XG5cbi8vIEhlbHBlciBmb3IgcGFzc2VzIHRoYXQgbmVlZCB0byBmaWxsIHRoZSB2aWV3cG9ydCB3aXRoIGEgc2luZ2xlIHF1YWQuXG5cbmNvbnN0IF9jYW1lcmEgPSBuZXcgT3J0aG9ncmFwaGljQ2FtZXJhKCAtIDEsIDEsIDEsIC0gMSwgMCwgMSApO1xuXG4vLyBodHRwczovL2dpdGh1Yi5jb20vbXJkb29iL3RocmVlLmpzL3B1bGwvMjEzNThcblxuY29uc3QgX2dlb21ldHJ5ID0gbmV3IEJ1ZmZlckdlb21ldHJ5KCk7XG5fZ2VvbWV0cnkuc2V0QXR0cmlidXRlKCAncG9zaXRpb24nLCBuZXcgRmxvYXQzMkJ1ZmZlckF0dHJpYnV0ZSggWyAtIDEsIDMsIDAsIC0gMSwgLSAxLCAwLCAzLCAtIDEsIDAgXSwgMyApICk7XG5fZ2VvbWV0cnkuc2V0QXR0cmlidXRlKCAndXYnLCBuZXcgRmxvYXQzMkJ1ZmZlckF0dHJpYnV0ZSggWyAwLCAyLCAwLCAwLCAyLCAwIF0sIDIgKSApO1xuXG5jbGFzcyBGdWxsU2NyZWVuUXVhZCB7XG5cblx0Y29uc3RydWN0b3IoIG1hdGVyaWFsICkge1xuXG5cdFx0dGhpcy5fbWVzaCA9IG5ldyBNZXNoKCBfZ2VvbWV0cnksIG1hdGVyaWFsICk7XG5cblx0fVxuXG5cdGRpc3Bvc2UoKSB7XG5cblx0XHR0aGlzLl9tZXNoLmdlb21ldHJ5LmRpc3Bvc2UoKTtcblxuXHR9XG5cblx0cmVuZGVyKCByZW5kZXJlciApIHtcblxuXHRcdHJlbmRlcmVyLnJlbmRlciggdGhpcy5fbWVzaCwgX2NhbWVyYSApO1xuXG5cdH1cblxuXHRnZXQgbWF0ZXJpYWwoKSB7XG5cblx0XHRyZXR1cm4gdGhpcy5fbWVzaC5tYXRlcmlhbDtcblxuXHR9XG5cblx0c2V0IG1hdGVyaWFsKCB2YWx1ZSApIHtcblxuXHRcdHRoaXMuX21lc2gubWF0ZXJpYWwgPSB2YWx1ZTtcblxuXHR9XG5cbn1cblxuZXhwb3J0IHsgRWZmZWN0Q29tcG9zZXIsIFBhc3MsIEZ1bGxTY3JlZW5RdWFkIH07XG4iLCJpbXBvcnQgeyBQYXNzIH0gZnJvbSAnLi4vcG9zdHByb2Nlc3NpbmcvUGFzcy5qcyc7XG5cbmNsYXNzIE1hc2tQYXNzIGV4dGVuZHMgUGFzcyB7XG5cblx0Y29uc3RydWN0b3IoIHNjZW5lLCBjYW1lcmEgKSB7XG5cblx0XHRzdXBlcigpO1xuXG5cdFx0dGhpcy5zY2VuZSA9IHNjZW5lO1xuXHRcdHRoaXMuY2FtZXJhID0gY2FtZXJhO1xuXG5cdFx0dGhpcy5jbGVhciA9IHRydWU7XG5cdFx0dGhpcy5uZWVkc1N3YXAgPSBmYWxzZTtcblxuXHRcdHRoaXMuaW52ZXJzZSA9IGZhbHNlO1xuXG5cdH1cblxuXHRyZW5kZXIoIHJlbmRlcmVyLCB3cml0ZUJ1ZmZlciwgcmVhZEJ1ZmZlciAvKiwgZGVsdGFUaW1lLCBtYXNrQWN0aXZlICovICkge1xuXG5cdFx0Y29uc3QgY29udGV4dCA9IHJlbmRlcmVyLmdldENvbnRleHQoKTtcblx0XHRjb25zdCBzdGF0ZSA9IHJlbmRlcmVyLnN0YXRlO1xuXG5cdFx0Ly8gZG9uJ3QgdXBkYXRlIGNvbG9yIG9yIGRlcHRoXG5cblx0XHRzdGF0ZS5idWZmZXJzLmNvbG9yLnNldE1hc2soIGZhbHNlICk7XG5cdFx0c3RhdGUuYnVmZmVycy5kZXB0aC5zZXRNYXNrKCBmYWxzZSApO1xuXG5cdFx0Ly8gbG9jayBidWZmZXJzXG5cblx0XHRzdGF0ZS5idWZmZXJzLmNvbG9yLnNldExvY2tlZCggdHJ1ZSApO1xuXHRcdHN0YXRlLmJ1ZmZlcnMuZGVwdGguc2V0TG9ja2VkKCB0cnVlICk7XG5cblx0XHQvLyBzZXQgdXAgc3RlbmNpbFxuXG5cdFx0bGV0IHdyaXRlVmFsdWUsIGNsZWFyVmFsdWU7XG5cblx0XHRpZiAoIHRoaXMuaW52ZXJzZSApIHtcblxuXHRcdFx0d3JpdGVWYWx1ZSA9IDA7XG5cdFx0XHRjbGVhclZhbHVlID0gMTtcblxuXHRcdH0gZWxzZSB7XG5cblx0XHRcdHdyaXRlVmFsdWUgPSAxO1xuXHRcdFx0Y2xlYXJWYWx1ZSA9IDA7XG5cblx0XHR9XG5cblx0XHRzdGF0ZS5idWZmZXJzLnN0ZW5jaWwuc2V0VGVzdCggdHJ1ZSApO1xuXHRcdHN0YXRlLmJ1ZmZlcnMuc3RlbmNpbC5zZXRPcCggY29udGV4dC5SRVBMQUNFLCBjb250ZXh0LlJFUExBQ0UsIGNvbnRleHQuUkVQTEFDRSApO1xuXHRcdHN0YXRlLmJ1ZmZlcnMuc3RlbmNpbC5zZXRGdW5jKCBjb250ZXh0LkFMV0FZUywgd3JpdGVWYWx1ZSwgMHhmZmZmZmZmZiApO1xuXHRcdHN0YXRlLmJ1ZmZlcnMuc3RlbmNpbC5zZXRDbGVhciggY2xlYXJWYWx1ZSApO1xuXHRcdHN0YXRlLmJ1ZmZlcnMuc3RlbmNpbC5zZXRMb2NrZWQoIHRydWUgKTtcblxuXHRcdC8vIGRyYXcgaW50byB0aGUgc3RlbmNpbCBidWZmZXJcblxuXHRcdHJlbmRlcmVyLnNldFJlbmRlclRhcmdldCggcmVhZEJ1ZmZlciApO1xuXHRcdGlmICggdGhpcy5jbGVhciApIHJlbmRlcmVyLmNsZWFyKCk7XG5cdFx0cmVuZGVyZXIucmVuZGVyKCB0aGlzLnNjZW5lLCB0aGlzLmNhbWVyYSApO1xuXG5cdFx0cmVuZGVyZXIuc2V0UmVuZGVyVGFyZ2V0KCB3cml0ZUJ1ZmZlciApO1xuXHRcdGlmICggdGhpcy5jbGVhciApIHJlbmRlcmVyLmNsZWFyKCk7XG5cdFx0cmVuZGVyZXIucmVuZGVyKCB0aGlzLnNjZW5lLCB0aGlzLmNhbWVyYSApO1xuXG5cdFx0Ly8gdW5sb2NrIGNvbG9yIGFuZCBkZXB0aCBidWZmZXIgZm9yIHN1YnNlcXVlbnQgcmVuZGVyaW5nXG5cblx0XHRzdGF0ZS5idWZmZXJzLmNvbG9yLnNldExvY2tlZCggZmFsc2UgKTtcblx0XHRzdGF0ZS5idWZmZXJzLmRlcHRoLnNldExvY2tlZCggZmFsc2UgKTtcblxuXHRcdC8vIG9ubHkgcmVuZGVyIHdoZXJlIHN0ZW5jaWwgaXMgc2V0IHRvIDFcblxuXHRcdHN0YXRlLmJ1ZmZlcnMuc3RlbmNpbC5zZXRMb2NrZWQoIGZhbHNlICk7XG5cdFx0c3RhdGUuYnVmZmVycy5zdGVuY2lsLnNldEZ1bmMoIGNvbnRleHQuRVFVQUwsIDEsIDB4ZmZmZmZmZmYgKTsgLy8gZHJhdyBpZiA9PSAxXG5cdFx0c3RhdGUuYnVmZmVycy5zdGVuY2lsLnNldE9wKCBjb250ZXh0LktFRVAsIGNvbnRleHQuS0VFUCwgY29udGV4dC5LRUVQICk7XG5cdFx0c3RhdGUuYnVmZmVycy5zdGVuY2lsLnNldExvY2tlZCggdHJ1ZSApO1xuXG5cdH1cblxufVxuXG5jbGFzcyBDbGVhck1hc2tQYXNzIGV4dGVuZHMgUGFzcyB7XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cblx0XHRzdXBlcigpO1xuXG5cdFx0dGhpcy5uZWVkc1N3YXAgPSBmYWxzZTtcblxuXHR9XG5cblx0cmVuZGVyKCByZW5kZXJlciAvKiwgd3JpdGVCdWZmZXIsIHJlYWRCdWZmZXIsIGRlbHRhVGltZSwgbWFza0FjdGl2ZSAqLyApIHtcblxuXHRcdHJlbmRlcmVyLnN0YXRlLmJ1ZmZlcnMuc3RlbmNpbC5zZXRMb2NrZWQoIGZhbHNlICk7XG5cdFx0cmVuZGVyZXIuc3RhdGUuYnVmZmVycy5zdGVuY2lsLnNldFRlc3QoIGZhbHNlICk7XG5cblx0fVxuXG59XG5cbmV4cG9ydCB7IE1hc2tQYXNzLCBDbGVhck1hc2tQYXNzIH07XG4iLCJpbXBvcnQge1xuXHRCdWZmZXJHZW9tZXRyeSxcblx0RmxvYXQzMkJ1ZmZlckF0dHJpYnV0ZSxcblx0T3J0aG9ncmFwaGljQ2FtZXJhLFxuXHRNZXNoXG59IGZyb20gJ3RocmVlJztcblxuY2xhc3MgUGFzcyB7XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cblx0XHQvLyBpZiBzZXQgdG8gdHJ1ZSwgdGhlIHBhc3MgaXMgcHJvY2Vzc2VkIGJ5IHRoZSBjb21wb3NlclxuXHRcdHRoaXMuZW5hYmxlZCA9IHRydWU7XG5cblx0XHQvLyBpZiBzZXQgdG8gdHJ1ZSwgdGhlIHBhc3MgaW5kaWNhdGVzIHRvIHN3YXAgcmVhZCBhbmQgd3JpdGUgYnVmZmVyIGFmdGVyIHJlbmRlcmluZ1xuXHRcdHRoaXMubmVlZHNTd2FwID0gdHJ1ZTtcblxuXHRcdC8vIGlmIHNldCB0byB0cnVlLCB0aGUgcGFzcyBjbGVhcnMgaXRzIGJ1ZmZlciBiZWZvcmUgcmVuZGVyaW5nXG5cdFx0dGhpcy5jbGVhciA9IGZhbHNlO1xuXG5cdFx0Ly8gaWYgc2V0IHRvIHRydWUsIHRoZSByZXN1bHQgb2YgdGhlIHBhc3MgaXMgcmVuZGVyZWQgdG8gc2NyZWVuLiBUaGlzIGlzIHNldCBhdXRvbWF0aWNhbGx5IGJ5IEVmZmVjdENvbXBvc2VyLlxuXHRcdHRoaXMucmVuZGVyVG9TY3JlZW4gPSBmYWxzZTtcblxuXHR9XG5cblx0c2V0U2l6ZSggLyogd2lkdGgsIGhlaWdodCAqLyApIHt9XG5cblx0cmVuZGVyKCAvKiByZW5kZXJlciwgd3JpdGVCdWZmZXIsIHJlYWRCdWZmZXIsIGRlbHRhVGltZSwgbWFza0FjdGl2ZSAqLyApIHtcblxuXHRcdGNvbnNvbGUuZXJyb3IoICdUSFJFRS5QYXNzOiAucmVuZGVyKCkgbXVzdCBiZSBpbXBsZW1lbnRlZCBpbiBkZXJpdmVkIHBhc3MuJyApO1xuXG5cdH1cblxufVxuXG4vLyBIZWxwZXIgZm9yIHBhc3NlcyB0aGF0IG5lZWQgdG8gZmlsbCB0aGUgdmlld3BvcnQgd2l0aCBhIHNpbmdsZSBxdWFkLlxuXG5jb25zdCBfY2FtZXJhID0gbmV3IE9ydGhvZ3JhcGhpY0NhbWVyYSggLSAxLCAxLCAxLCAtIDEsIDAsIDEgKTtcblxuLy8gaHR0cHM6Ly9naXRodWIuY29tL21yZG9vYi90aHJlZS5qcy9wdWxsLzIxMzU4XG5cbmNvbnN0IF9nZW9tZXRyeSA9IG5ldyBCdWZmZXJHZW9tZXRyeSgpO1xuX2dlb21ldHJ5LnNldEF0dHJpYnV0ZSggJ3Bvc2l0aW9uJywgbmV3IEZsb2F0MzJCdWZmZXJBdHRyaWJ1dGUoIFsgLSAxLCAzLCAwLCAtIDEsIC0gMSwgMCwgMywgLSAxLCAwIF0sIDMgKSApO1xuX2dlb21ldHJ5LnNldEF0dHJpYnV0ZSggJ3V2JywgbmV3IEZsb2F0MzJCdWZmZXJBdHRyaWJ1dGUoIFsgMCwgMiwgMCwgMCwgMiwgMCBdLCAyICkgKTtcblxuY2xhc3MgRnVsbFNjcmVlblF1YWQge1xuXG5cdGNvbnN0cnVjdG9yKCBtYXRlcmlhbCApIHtcblxuXHRcdHRoaXMuX21lc2ggPSBuZXcgTWVzaCggX2dlb21ldHJ5LCBtYXRlcmlhbCApO1xuXG5cdH1cblxuXHRkaXNwb3NlKCkge1xuXG5cdFx0dGhpcy5fbWVzaC5nZW9tZXRyeS5kaXNwb3NlKCk7XG5cblx0fVxuXG5cdHJlbmRlciggcmVuZGVyZXIgKSB7XG5cblx0XHRyZW5kZXJlci5yZW5kZXIoIHRoaXMuX21lc2gsIF9jYW1lcmEgKTtcblxuXHR9XG5cblx0Z2V0IG1hdGVyaWFsKCkge1xuXG5cdFx0cmV0dXJuIHRoaXMuX21lc2gubWF0ZXJpYWw7XG5cblx0fVxuXG5cdHNldCBtYXRlcmlhbCggdmFsdWUgKSB7XG5cblx0XHR0aGlzLl9tZXNoLm1hdGVyaWFsID0gdmFsdWU7XG5cblx0fVxuXG59XG5cbmV4cG9ydCB7IFBhc3MsIEZ1bGxTY3JlZW5RdWFkIH07XG4iLCJpbXBvcnQge1xuXHRDb2xvclxufSBmcm9tICd0aHJlZSc7XG5pbXBvcnQgeyBQYXNzIH0gZnJvbSAnLi4vcG9zdHByb2Nlc3NpbmcvUGFzcy5qcyc7XG5cbmNsYXNzIFJlbmRlclBhc3MgZXh0ZW5kcyBQYXNzIHtcblxuXHRjb25zdHJ1Y3Rvciggc2NlbmUsIGNhbWVyYSwgb3ZlcnJpZGVNYXRlcmlhbCwgY2xlYXJDb2xvciwgY2xlYXJBbHBoYSApIHtcblxuXHRcdHN1cGVyKCk7XG5cblx0XHR0aGlzLnNjZW5lID0gc2NlbmU7XG5cdFx0dGhpcy5jYW1lcmEgPSBjYW1lcmE7XG5cblx0XHR0aGlzLm92ZXJyaWRlTWF0ZXJpYWwgPSBvdmVycmlkZU1hdGVyaWFsO1xuXG5cdFx0dGhpcy5jbGVhckNvbG9yID0gY2xlYXJDb2xvcjtcblx0XHR0aGlzLmNsZWFyQWxwaGEgPSAoIGNsZWFyQWxwaGEgIT09IHVuZGVmaW5lZCApID8gY2xlYXJBbHBoYSA6IDA7XG5cblx0XHR0aGlzLmNsZWFyID0gdHJ1ZTtcblx0XHR0aGlzLmNsZWFyRGVwdGggPSBmYWxzZTtcblx0XHR0aGlzLm5lZWRzU3dhcCA9IGZhbHNlO1xuXHRcdHRoaXMuX29sZENsZWFyQ29sb3IgPSBuZXcgQ29sb3IoKTtcblxuXHR9XG5cblx0cmVuZGVyKCByZW5kZXJlciwgd3JpdGVCdWZmZXIsIHJlYWRCdWZmZXIgLyosIGRlbHRhVGltZSwgbWFza0FjdGl2ZSAqLyApIHtcblxuXHRcdGNvbnN0IG9sZEF1dG9DbGVhciA9IHJlbmRlcmVyLmF1dG9DbGVhcjtcblx0XHRyZW5kZXJlci5hdXRvQ2xlYXIgPSBmYWxzZTtcblxuXHRcdGxldCBvbGRDbGVhckFscGhhLCBvbGRPdmVycmlkZU1hdGVyaWFsO1xuXG5cdFx0aWYgKCB0aGlzLm92ZXJyaWRlTWF0ZXJpYWwgIT09IHVuZGVmaW5lZCApIHtcblxuXHRcdFx0b2xkT3ZlcnJpZGVNYXRlcmlhbCA9IHRoaXMuc2NlbmUub3ZlcnJpZGVNYXRlcmlhbDtcblxuXHRcdFx0dGhpcy5zY2VuZS5vdmVycmlkZU1hdGVyaWFsID0gdGhpcy5vdmVycmlkZU1hdGVyaWFsO1xuXG5cdFx0fVxuXG5cdFx0aWYgKCB0aGlzLmNsZWFyQ29sb3IgKSB7XG5cblx0XHRcdHJlbmRlcmVyLmdldENsZWFyQ29sb3IoIHRoaXMuX29sZENsZWFyQ29sb3IgKTtcblx0XHRcdG9sZENsZWFyQWxwaGEgPSByZW5kZXJlci5nZXRDbGVhckFscGhhKCk7XG5cblx0XHRcdHJlbmRlcmVyLnNldENsZWFyQ29sb3IoIHRoaXMuY2xlYXJDb2xvciwgdGhpcy5jbGVhckFscGhhICk7XG5cblx0XHR9XG5cblx0XHRpZiAoIHRoaXMuY2xlYXJEZXB0aCApIHtcblxuXHRcdFx0cmVuZGVyZXIuY2xlYXJEZXB0aCgpO1xuXG5cdFx0fVxuXG5cdFx0cmVuZGVyZXIuc2V0UmVuZGVyVGFyZ2V0KCB0aGlzLnJlbmRlclRvU2NyZWVuID8gbnVsbCA6IHJlYWRCdWZmZXIgKTtcblxuXHRcdC8vIFRPRE86IEF2b2lkIHVzaW5nIGF1dG9DbGVhciBwcm9wZXJ0aWVzLCBzZWUgaHR0cHM6Ly9naXRodWIuY29tL21yZG9vYi90aHJlZS5qcy9wdWxsLzE1NTcxI2lzc3VlY29tbWVudC00NjU2Njk2MDBcblx0XHRpZiAoIHRoaXMuY2xlYXIgKSByZW5kZXJlci5jbGVhciggcmVuZGVyZXIuYXV0b0NsZWFyQ29sb3IsIHJlbmRlcmVyLmF1dG9DbGVhckRlcHRoLCByZW5kZXJlci5hdXRvQ2xlYXJTdGVuY2lsICk7XG5cdFx0cmVuZGVyZXIucmVuZGVyKCB0aGlzLnNjZW5lLCB0aGlzLmNhbWVyYSApO1xuXG5cdFx0aWYgKCB0aGlzLmNsZWFyQ29sb3IgKSB7XG5cblx0XHRcdHJlbmRlcmVyLnNldENsZWFyQ29sb3IoIHRoaXMuX29sZENsZWFyQ29sb3IsIG9sZENsZWFyQWxwaGEgKTtcblxuXHRcdH1cblxuXHRcdGlmICggdGhpcy5vdmVycmlkZU1hdGVyaWFsICE9PSB1bmRlZmluZWQgKSB7XG5cblx0XHRcdHRoaXMuc2NlbmUub3ZlcnJpZGVNYXRlcmlhbCA9IG9sZE92ZXJyaWRlTWF0ZXJpYWw7XG5cblx0XHR9XG5cblx0XHRyZW5kZXJlci5hdXRvQ2xlYXIgPSBvbGRBdXRvQ2xlYXI7XG5cblx0fVxuXG59XG5cbmV4cG9ydCB7IFJlbmRlclBhc3MgfTtcbiIsImltcG9ydCB7XG5cdFNoYWRlck1hdGVyaWFsLFxuXHRVbmlmb3Jtc1V0aWxzXG59IGZyb20gJ3RocmVlJztcbmltcG9ydCB7IFBhc3MsIEZ1bGxTY3JlZW5RdWFkIH0gZnJvbSAnLi4vcG9zdHByb2Nlc3NpbmcvUGFzcy5qcyc7XG5cbmNsYXNzIFNoYWRlclBhc3MgZXh0ZW5kcyBQYXNzIHtcblxuXHRjb25zdHJ1Y3Rvciggc2hhZGVyLCB0ZXh0dXJlSUQgKSB7XG5cblx0XHRzdXBlcigpO1xuXG5cdFx0dGhpcy50ZXh0dXJlSUQgPSAoIHRleHR1cmVJRCAhPT0gdW5kZWZpbmVkICkgPyB0ZXh0dXJlSUQgOiAndERpZmZ1c2UnO1xuXG5cdFx0aWYgKCBzaGFkZXIgaW5zdGFuY2VvZiBTaGFkZXJNYXRlcmlhbCApIHtcblxuXHRcdFx0dGhpcy51bmlmb3JtcyA9IHNoYWRlci51bmlmb3JtcztcblxuXHRcdFx0dGhpcy5tYXRlcmlhbCA9IHNoYWRlcjtcblxuXHRcdH0gZWxzZSBpZiAoIHNoYWRlciApIHtcblxuXHRcdFx0dGhpcy51bmlmb3JtcyA9IFVuaWZvcm1zVXRpbHMuY2xvbmUoIHNoYWRlci51bmlmb3JtcyApO1xuXG5cdFx0XHR0aGlzLm1hdGVyaWFsID0gbmV3IFNoYWRlck1hdGVyaWFsKCB7XG5cblx0XHRcdFx0ZGVmaW5lczogT2JqZWN0LmFzc2lnbigge30sIHNoYWRlci5kZWZpbmVzICksXG5cdFx0XHRcdHVuaWZvcm1zOiB0aGlzLnVuaWZvcm1zLFxuXHRcdFx0XHR2ZXJ0ZXhTaGFkZXI6IHNoYWRlci52ZXJ0ZXhTaGFkZXIsXG5cdFx0XHRcdGZyYWdtZW50U2hhZGVyOiBzaGFkZXIuZnJhZ21lbnRTaGFkZXJcblxuXHRcdFx0fSApO1xuXG5cdFx0fVxuXG5cdFx0dGhpcy5mc1F1YWQgPSBuZXcgRnVsbFNjcmVlblF1YWQoIHRoaXMubWF0ZXJpYWwgKTtcblxuXHR9XG5cblx0cmVuZGVyKCByZW5kZXJlciwgd3JpdGVCdWZmZXIsIHJlYWRCdWZmZXIgLyosIGRlbHRhVGltZSwgbWFza0FjdGl2ZSAqLyApIHtcblxuXHRcdGlmICggdGhpcy51bmlmb3Jtc1sgdGhpcy50ZXh0dXJlSUQgXSApIHtcblxuXHRcdFx0dGhpcy51bmlmb3Jtc1sgdGhpcy50ZXh0dXJlSUQgXS52YWx1ZSA9IHJlYWRCdWZmZXIudGV4dHVyZTtcblxuXHRcdH1cblxuXHRcdHRoaXMuZnNRdWFkLm1hdGVyaWFsID0gdGhpcy5tYXRlcmlhbDtcblxuXHRcdGlmICggdGhpcy5yZW5kZXJUb1NjcmVlbiApIHtcblxuXHRcdFx0cmVuZGVyZXIuc2V0UmVuZGVyVGFyZ2V0KCBudWxsICk7XG5cdFx0XHR0aGlzLmZzUXVhZC5yZW5kZXIoIHJlbmRlcmVyICk7XG5cblx0XHR9IGVsc2Uge1xuXG5cdFx0XHRyZW5kZXJlci5zZXRSZW5kZXJUYXJnZXQoIHdyaXRlQnVmZmVyICk7XG5cdFx0XHQvLyBUT0RPOiBBdm9pZCB1c2luZyBhdXRvQ2xlYXIgcHJvcGVydGllcywgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9tcmRvb2IvdGhyZWUuanMvcHVsbC8xNTU3MSNpc3N1ZWNvbW1lbnQtNDY1NjY5NjAwXG5cdFx0XHRpZiAoIHRoaXMuY2xlYXIgKSByZW5kZXJlci5jbGVhciggcmVuZGVyZXIuYXV0b0NsZWFyQ29sb3IsIHJlbmRlcmVyLmF1dG9DbGVhckRlcHRoLCByZW5kZXJlci5hdXRvQ2xlYXJTdGVuY2lsICk7XG5cdFx0XHR0aGlzLmZzUXVhZC5yZW5kZXIoIHJlbmRlcmVyICk7XG5cblx0XHR9XG5cblx0fVxuXG59XG5cbmV4cG9ydCB7IFNoYWRlclBhc3MgfTtcbiIsImltcG9ydCB7XG5cdEFkZGl0aXZlQmxlbmRpbmcsXG5cdENvbG9yLFxuXHRMaW5lYXJGaWx0ZXIsXG5cdE1lc2hCYXNpY01hdGVyaWFsLFxuXHRSR0JBRm9ybWF0LFxuXHRTaGFkZXJNYXRlcmlhbCxcblx0VW5pZm9ybXNVdGlscyxcblx0VmVjdG9yMixcblx0VmVjdG9yMyxcblx0V2ViR0xSZW5kZXJUYXJnZXRcbn0gZnJvbSAndGhyZWUnO1xuaW1wb3J0IHsgUGFzcywgRnVsbFNjcmVlblF1YWQgfSBmcm9tICcuLi9wb3N0cHJvY2Vzc2luZy9QYXNzLmpzJztcbmltcG9ydCB7IENvcHlTaGFkZXIgfSBmcm9tICcuLi9zaGFkZXJzL0NvcHlTaGFkZXIuanMnO1xuaW1wb3J0IHsgTHVtaW5vc2l0eUhpZ2hQYXNzU2hhZGVyIH0gZnJvbSAnLi4vc2hhZGVycy9MdW1pbm9zaXR5SGlnaFBhc3NTaGFkZXIuanMnO1xuXG4vKipcbiAqIFVucmVhbEJsb29tUGFzcyBpcyBpbnNwaXJlZCBieSB0aGUgYmxvb20gcGFzcyBvZiBVbnJlYWwgRW5naW5lLiBJdCBjcmVhdGVzIGFcbiAqIG1pcCBtYXAgY2hhaW4gb2YgYmxvb20gdGV4dHVyZXMgYW5kIGJsdXJzIHRoZW0gd2l0aCBkaWZmZXJlbnQgcmFkaWkuIEJlY2F1c2VcbiAqIG9mIHRoZSB3ZWlnaHRlZCBjb21iaW5hdGlvbiBvZiBtaXBzLCBhbmQgYmVjYXVzZSBsYXJnZXIgYmx1cnMgYXJlIGRvbmUgb25cbiAqIGhpZ2hlciBtaXBzLCB0aGlzIGVmZmVjdCBwcm92aWRlcyBnb29kIHF1YWxpdHkgYW5kIHBlcmZvcm1hbmNlLlxuICpcbiAqIFJlZmVyZW5jZTpcbiAqIC0gaHR0cHM6Ly9kb2NzLnVucmVhbGVuZ2luZS5jb20vbGF0ZXN0L0lOVC9FbmdpbmUvUmVuZGVyaW5nL1Bvc3RQcm9jZXNzRWZmZWN0cy9CbG9vbS9cbiAqL1xuY2xhc3MgVW5yZWFsQmxvb21QYXNzIGV4dGVuZHMgUGFzcyB7XG5cblx0Y29uc3RydWN0b3IoIHJlc29sdXRpb24sIHN0cmVuZ3RoLCByYWRpdXMsIHRocmVzaG9sZCApIHtcblxuXHRcdHN1cGVyKCk7XG5cblx0XHR0aGlzLnN0cmVuZ3RoID0gKCBzdHJlbmd0aCAhPT0gdW5kZWZpbmVkICkgPyBzdHJlbmd0aCA6IDE7XG5cdFx0dGhpcy5yYWRpdXMgPSByYWRpdXM7XG5cdFx0dGhpcy50aHJlc2hvbGQgPSB0aHJlc2hvbGQ7XG5cdFx0dGhpcy5yZXNvbHV0aW9uID0gKCByZXNvbHV0aW9uICE9PSB1bmRlZmluZWQgKSA/IG5ldyBWZWN0b3IyKCByZXNvbHV0aW9uLngsIHJlc29sdXRpb24ueSApIDogbmV3IFZlY3RvcjIoIDI1NiwgMjU2ICk7XG5cblx0XHQvLyBjcmVhdGUgY29sb3Igb25seSBvbmNlIGhlcmUsIHJldXNlIGl0IGxhdGVyIGluc2lkZSB0aGUgcmVuZGVyIGZ1bmN0aW9uXG5cdFx0dGhpcy5jbGVhckNvbG9yID0gbmV3IENvbG9yKCAwLCAwLCAwICk7XG5cblx0XHQvLyByZW5kZXIgdGFyZ2V0c1xuXHRcdGNvbnN0IHBhcnMgPSB7IG1pbkZpbHRlcjogTGluZWFyRmlsdGVyLCBtYWdGaWx0ZXI6IExpbmVhckZpbHRlciwgZm9ybWF0OiBSR0JBRm9ybWF0IH07XG5cdFx0dGhpcy5yZW5kZXJUYXJnZXRzSG9yaXpvbnRhbCA9IFtdO1xuXHRcdHRoaXMucmVuZGVyVGFyZ2V0c1ZlcnRpY2FsID0gW107XG5cdFx0dGhpcy5uTWlwcyA9IDU7XG5cdFx0bGV0IHJlc3ggPSBNYXRoLnJvdW5kKCB0aGlzLnJlc29sdXRpb24ueCAvIDIgKTtcblx0XHRsZXQgcmVzeSA9IE1hdGgucm91bmQoIHRoaXMucmVzb2x1dGlvbi55IC8gMiApO1xuXG5cdFx0dGhpcy5yZW5kZXJUYXJnZXRCcmlnaHQgPSBuZXcgV2ViR0xSZW5kZXJUYXJnZXQoIHJlc3gsIHJlc3ksIHBhcnMgKTtcblx0XHR0aGlzLnJlbmRlclRhcmdldEJyaWdodC50ZXh0dXJlLm5hbWUgPSAnVW5yZWFsQmxvb21QYXNzLmJyaWdodCc7XG5cdFx0dGhpcy5yZW5kZXJUYXJnZXRCcmlnaHQudGV4dHVyZS5nZW5lcmF0ZU1pcG1hcHMgPSBmYWxzZTtcblxuXHRcdGZvciAoIGxldCBpID0gMDsgaSA8IHRoaXMubk1pcHM7IGkgKysgKSB7XG5cblx0XHRcdGNvbnN0IHJlbmRlclRhcmdldEhvcml6b25hbCA9IG5ldyBXZWJHTFJlbmRlclRhcmdldCggcmVzeCwgcmVzeSwgcGFycyApO1xuXG5cdFx0XHRyZW5kZXJUYXJnZXRIb3Jpem9uYWwudGV4dHVyZS5uYW1lID0gJ1VucmVhbEJsb29tUGFzcy5oJyArIGk7XG5cdFx0XHRyZW5kZXJUYXJnZXRIb3Jpem9uYWwudGV4dHVyZS5nZW5lcmF0ZU1pcG1hcHMgPSBmYWxzZTtcblxuXHRcdFx0dGhpcy5yZW5kZXJUYXJnZXRzSG9yaXpvbnRhbC5wdXNoKCByZW5kZXJUYXJnZXRIb3Jpem9uYWwgKTtcblxuXHRcdFx0Y29uc3QgcmVuZGVyVGFyZ2V0VmVydGljYWwgPSBuZXcgV2ViR0xSZW5kZXJUYXJnZXQoIHJlc3gsIHJlc3ksIHBhcnMgKTtcblxuXHRcdFx0cmVuZGVyVGFyZ2V0VmVydGljYWwudGV4dHVyZS5uYW1lID0gJ1VucmVhbEJsb29tUGFzcy52JyArIGk7XG5cdFx0XHRyZW5kZXJUYXJnZXRWZXJ0aWNhbC50ZXh0dXJlLmdlbmVyYXRlTWlwbWFwcyA9IGZhbHNlO1xuXG5cdFx0XHR0aGlzLnJlbmRlclRhcmdldHNWZXJ0aWNhbC5wdXNoKCByZW5kZXJUYXJnZXRWZXJ0aWNhbCApO1xuXG5cdFx0XHRyZXN4ID0gTWF0aC5yb3VuZCggcmVzeCAvIDIgKTtcblxuXHRcdFx0cmVzeSA9IE1hdGgucm91bmQoIHJlc3kgLyAyICk7XG5cblx0XHR9XG5cblx0XHQvLyBsdW1pbm9zaXR5IGhpZ2ggcGFzcyBtYXRlcmlhbFxuXG5cdFx0aWYgKCBMdW1pbm9zaXR5SGlnaFBhc3NTaGFkZXIgPT09IHVuZGVmaW5lZCApXG5cdFx0XHRjb25zb2xlLmVycm9yKCAnVEhSRUUuVW5yZWFsQmxvb21QYXNzIHJlbGllcyBvbiBMdW1pbm9zaXR5SGlnaFBhc3NTaGFkZXInICk7XG5cblx0XHRjb25zdCBoaWdoUGFzc1NoYWRlciA9IEx1bWlub3NpdHlIaWdoUGFzc1NoYWRlcjtcblx0XHR0aGlzLmhpZ2hQYXNzVW5pZm9ybXMgPSBVbmlmb3Jtc1V0aWxzLmNsb25lKCBoaWdoUGFzc1NoYWRlci51bmlmb3JtcyApO1xuXG5cdFx0dGhpcy5oaWdoUGFzc1VuaWZvcm1zWyAnbHVtaW5vc2l0eVRocmVzaG9sZCcgXS52YWx1ZSA9IHRocmVzaG9sZDtcblx0XHR0aGlzLmhpZ2hQYXNzVW5pZm9ybXNbICdzbW9vdGhXaWR0aCcgXS52YWx1ZSA9IDAuMDE7XG5cblx0XHR0aGlzLm1hdGVyaWFsSGlnaFBhc3NGaWx0ZXIgPSBuZXcgU2hhZGVyTWF0ZXJpYWwoIHtcblx0XHRcdHVuaWZvcm1zOiB0aGlzLmhpZ2hQYXNzVW5pZm9ybXMsXG5cdFx0XHR2ZXJ0ZXhTaGFkZXI6IGhpZ2hQYXNzU2hhZGVyLnZlcnRleFNoYWRlcixcblx0XHRcdGZyYWdtZW50U2hhZGVyOiBoaWdoUGFzc1NoYWRlci5mcmFnbWVudFNoYWRlcixcblx0XHRcdGRlZmluZXM6IHt9XG5cdFx0fSApO1xuXG5cdFx0Ly8gR2F1c3NpYW4gQmx1ciBNYXRlcmlhbHNcblx0XHR0aGlzLnNlcGFyYWJsZUJsdXJNYXRlcmlhbHMgPSBbXTtcblx0XHRjb25zdCBrZXJuZWxTaXplQXJyYXkgPSBbIDMsIDUsIDcsIDksIDExIF07XG5cdFx0cmVzeCA9IE1hdGgucm91bmQoIHRoaXMucmVzb2x1dGlvbi54IC8gMiApO1xuXHRcdHJlc3kgPSBNYXRoLnJvdW5kKCB0aGlzLnJlc29sdXRpb24ueSAvIDIgKTtcblxuXHRcdGZvciAoIGxldCBpID0gMDsgaSA8IHRoaXMubk1pcHM7IGkgKysgKSB7XG5cblx0XHRcdHRoaXMuc2VwYXJhYmxlQmx1ck1hdGVyaWFscy5wdXNoKCB0aGlzLmdldFNlcGVyYWJsZUJsdXJNYXRlcmlhbCgga2VybmVsU2l6ZUFycmF5WyBpIF0gKSApO1xuXG5cdFx0XHR0aGlzLnNlcGFyYWJsZUJsdXJNYXRlcmlhbHNbIGkgXS51bmlmb3Jtc1sgJ3RleFNpemUnIF0udmFsdWUgPSBuZXcgVmVjdG9yMiggcmVzeCwgcmVzeSApO1xuXG5cdFx0XHRyZXN4ID0gTWF0aC5yb3VuZCggcmVzeCAvIDIgKTtcblxuXHRcdFx0cmVzeSA9IE1hdGgucm91bmQoIHJlc3kgLyAyICk7XG5cblx0XHR9XG5cblx0XHQvLyBDb21wb3NpdGUgbWF0ZXJpYWxcblx0XHR0aGlzLmNvbXBvc2l0ZU1hdGVyaWFsID0gdGhpcy5nZXRDb21wb3NpdGVNYXRlcmlhbCggdGhpcy5uTWlwcyApO1xuXHRcdHRoaXMuY29tcG9zaXRlTWF0ZXJpYWwudW5pZm9ybXNbICdibHVyVGV4dHVyZTEnIF0udmFsdWUgPSB0aGlzLnJlbmRlclRhcmdldHNWZXJ0aWNhbFsgMCBdLnRleHR1cmU7XG5cdFx0dGhpcy5jb21wb3NpdGVNYXRlcmlhbC51bmlmb3Jtc1sgJ2JsdXJUZXh0dXJlMicgXS52YWx1ZSA9IHRoaXMucmVuZGVyVGFyZ2V0c1ZlcnRpY2FsWyAxIF0udGV4dHVyZTtcblx0XHR0aGlzLmNvbXBvc2l0ZU1hdGVyaWFsLnVuaWZvcm1zWyAnYmx1clRleHR1cmUzJyBdLnZhbHVlID0gdGhpcy5yZW5kZXJUYXJnZXRzVmVydGljYWxbIDIgXS50ZXh0dXJlO1xuXHRcdHRoaXMuY29tcG9zaXRlTWF0ZXJpYWwudW5pZm9ybXNbICdibHVyVGV4dHVyZTQnIF0udmFsdWUgPSB0aGlzLnJlbmRlclRhcmdldHNWZXJ0aWNhbFsgMyBdLnRleHR1cmU7XG5cdFx0dGhpcy5jb21wb3NpdGVNYXRlcmlhbC51bmlmb3Jtc1sgJ2JsdXJUZXh0dXJlNScgXS52YWx1ZSA9IHRoaXMucmVuZGVyVGFyZ2V0c1ZlcnRpY2FsWyA0IF0udGV4dHVyZTtcblx0XHR0aGlzLmNvbXBvc2l0ZU1hdGVyaWFsLnVuaWZvcm1zWyAnYmxvb21TdHJlbmd0aCcgXS52YWx1ZSA9IHN0cmVuZ3RoO1xuXHRcdHRoaXMuY29tcG9zaXRlTWF0ZXJpYWwudW5pZm9ybXNbICdibG9vbVJhZGl1cycgXS52YWx1ZSA9IDAuMTtcblx0XHR0aGlzLmNvbXBvc2l0ZU1hdGVyaWFsLm5lZWRzVXBkYXRlID0gdHJ1ZTtcblxuXHRcdGNvbnN0IGJsb29tRmFjdG9ycyA9IFsgMS4wLCAwLjgsIDAuNiwgMC40LCAwLjIgXTtcblx0XHR0aGlzLmNvbXBvc2l0ZU1hdGVyaWFsLnVuaWZvcm1zWyAnYmxvb21GYWN0b3JzJyBdLnZhbHVlID0gYmxvb21GYWN0b3JzO1xuXHRcdHRoaXMuYmxvb21UaW50Q29sb3JzID0gWyBuZXcgVmVjdG9yMyggMSwgMSwgMSApLCBuZXcgVmVjdG9yMyggMSwgMSwgMSApLCBuZXcgVmVjdG9yMyggMSwgMSwgMSApLCBuZXcgVmVjdG9yMyggMSwgMSwgMSApLCBuZXcgVmVjdG9yMyggMSwgMSwgMSApIF07XG5cdFx0dGhpcy5jb21wb3NpdGVNYXRlcmlhbC51bmlmb3Jtc1sgJ2Jsb29tVGludENvbG9ycycgXS52YWx1ZSA9IHRoaXMuYmxvb21UaW50Q29sb3JzO1xuXG5cdFx0Ly8gY29weSBtYXRlcmlhbFxuXHRcdGlmICggQ29weVNoYWRlciA9PT0gdW5kZWZpbmVkICkge1xuXG5cdFx0XHRjb25zb2xlLmVycm9yKCAnVEhSRUUuVW5yZWFsQmxvb21QYXNzIHJlbGllcyBvbiBDb3B5U2hhZGVyJyApO1xuXG5cdFx0fVxuXG5cdFx0Y29uc3QgY29weVNoYWRlciA9IENvcHlTaGFkZXI7XG5cblx0XHR0aGlzLmNvcHlVbmlmb3JtcyA9IFVuaWZvcm1zVXRpbHMuY2xvbmUoIGNvcHlTaGFkZXIudW5pZm9ybXMgKTtcblx0XHR0aGlzLmNvcHlVbmlmb3Jtc1sgJ29wYWNpdHknIF0udmFsdWUgPSAxLjA7XG5cblx0XHR0aGlzLm1hdGVyaWFsQ29weSA9IG5ldyBTaGFkZXJNYXRlcmlhbCgge1xuXHRcdFx0dW5pZm9ybXM6IHRoaXMuY29weVVuaWZvcm1zLFxuXHRcdFx0dmVydGV4U2hhZGVyOiBjb3B5U2hhZGVyLnZlcnRleFNoYWRlcixcblx0XHRcdGZyYWdtZW50U2hhZGVyOiBjb3B5U2hhZGVyLmZyYWdtZW50U2hhZGVyLFxuXHRcdFx0YmxlbmRpbmc6IEFkZGl0aXZlQmxlbmRpbmcsXG5cdFx0XHRkZXB0aFRlc3Q6IGZhbHNlLFxuXHRcdFx0ZGVwdGhXcml0ZTogZmFsc2UsXG5cdFx0XHR0cmFuc3BhcmVudDogdHJ1ZVxuXHRcdH0gKTtcblxuXHRcdHRoaXMuZW5hYmxlZCA9IHRydWU7XG5cdFx0dGhpcy5uZWVkc1N3YXAgPSBmYWxzZTtcblxuXHRcdHRoaXMuX29sZENsZWFyQ29sb3IgPSBuZXcgQ29sb3IoKTtcblx0XHR0aGlzLm9sZENsZWFyQWxwaGEgPSAxO1xuXG5cdFx0dGhpcy5iYXNpYyA9IG5ldyBNZXNoQmFzaWNNYXRlcmlhbCgpO1xuXG5cdFx0dGhpcy5mc1F1YWQgPSBuZXcgRnVsbFNjcmVlblF1YWQoIG51bGwgKTtcblxuXHR9XG5cblx0ZGlzcG9zZSgpIHtcblxuXHRcdGZvciAoIGxldCBpID0gMDsgaSA8IHRoaXMucmVuZGVyVGFyZ2V0c0hvcml6b250YWwubGVuZ3RoOyBpICsrICkge1xuXG5cdFx0XHR0aGlzLnJlbmRlclRhcmdldHNIb3Jpem9udGFsWyBpIF0uZGlzcG9zZSgpO1xuXG5cdFx0fVxuXG5cdFx0Zm9yICggbGV0IGkgPSAwOyBpIDwgdGhpcy5yZW5kZXJUYXJnZXRzVmVydGljYWwubGVuZ3RoOyBpICsrICkge1xuXG5cdFx0XHR0aGlzLnJlbmRlclRhcmdldHNWZXJ0aWNhbFsgaSBdLmRpc3Bvc2UoKTtcblxuXHRcdH1cblxuXHRcdHRoaXMucmVuZGVyVGFyZ2V0QnJpZ2h0LmRpc3Bvc2UoKTtcblxuXHR9XG5cblx0c2V0U2l6ZSggd2lkdGgsIGhlaWdodCApIHtcblxuXHRcdGxldCByZXN4ID0gTWF0aC5yb3VuZCggd2lkdGggLyAyICk7XG5cdFx0bGV0IHJlc3kgPSBNYXRoLnJvdW5kKCBoZWlnaHQgLyAyICk7XG5cblx0XHR0aGlzLnJlbmRlclRhcmdldEJyaWdodC5zZXRTaXplKCByZXN4LCByZXN5ICk7XG5cblx0XHRmb3IgKCBsZXQgaSA9IDA7IGkgPCB0aGlzLm5NaXBzOyBpICsrICkge1xuXG5cdFx0XHR0aGlzLnJlbmRlclRhcmdldHNIb3Jpem9udGFsWyBpIF0uc2V0U2l6ZSggcmVzeCwgcmVzeSApO1xuXHRcdFx0dGhpcy5yZW5kZXJUYXJnZXRzVmVydGljYWxbIGkgXS5zZXRTaXplKCByZXN4LCByZXN5ICk7XG5cblx0XHRcdHRoaXMuc2VwYXJhYmxlQmx1ck1hdGVyaWFsc1sgaSBdLnVuaWZvcm1zWyAndGV4U2l6ZScgXS52YWx1ZSA9IG5ldyBWZWN0b3IyKCByZXN4LCByZXN5ICk7XG5cblx0XHRcdHJlc3ggPSBNYXRoLnJvdW5kKCByZXN4IC8gMiApO1xuXHRcdFx0cmVzeSA9IE1hdGgucm91bmQoIHJlc3kgLyAyICk7XG5cblx0XHR9XG5cblx0fVxuXG5cdHJlbmRlciggcmVuZGVyZXIsIHdyaXRlQnVmZmVyLCByZWFkQnVmZmVyLCBkZWx0YVRpbWUsIG1hc2tBY3RpdmUgKSB7XG5cblx0XHRyZW5kZXJlci5nZXRDbGVhckNvbG9yKCB0aGlzLl9vbGRDbGVhckNvbG9yICk7XG5cdFx0dGhpcy5vbGRDbGVhckFscGhhID0gcmVuZGVyZXIuZ2V0Q2xlYXJBbHBoYSgpO1xuXHRcdGNvbnN0IG9sZEF1dG9DbGVhciA9IHJlbmRlcmVyLmF1dG9DbGVhcjtcblx0XHRyZW5kZXJlci5hdXRvQ2xlYXIgPSBmYWxzZTtcblxuXHRcdHJlbmRlcmVyLnNldENsZWFyQ29sb3IoIHRoaXMuY2xlYXJDb2xvciwgMCApO1xuXG5cdFx0aWYgKCBtYXNrQWN0aXZlICkgcmVuZGVyZXIuc3RhdGUuYnVmZmVycy5zdGVuY2lsLnNldFRlc3QoIGZhbHNlICk7XG5cblx0XHQvLyBSZW5kZXIgaW5wdXQgdG8gc2NyZWVuXG5cblx0XHRpZiAoIHRoaXMucmVuZGVyVG9TY3JlZW4gKSB7XG5cblx0XHRcdHRoaXMuZnNRdWFkLm1hdGVyaWFsID0gdGhpcy5iYXNpYztcblx0XHRcdHRoaXMuYmFzaWMubWFwID0gcmVhZEJ1ZmZlci50ZXh0dXJlO1xuXG5cdFx0XHRyZW5kZXJlci5zZXRSZW5kZXJUYXJnZXQoIG51bGwgKTtcblx0XHRcdHJlbmRlcmVyLmNsZWFyKCk7XG5cdFx0XHR0aGlzLmZzUXVhZC5yZW5kZXIoIHJlbmRlcmVyICk7XG5cblx0XHR9XG5cblx0XHQvLyAxLiBFeHRyYWN0IEJyaWdodCBBcmVhc1xuXG5cdFx0dGhpcy5oaWdoUGFzc1VuaWZvcm1zWyAndERpZmZ1c2UnIF0udmFsdWUgPSByZWFkQnVmZmVyLnRleHR1cmU7XG5cdFx0dGhpcy5oaWdoUGFzc1VuaWZvcm1zWyAnbHVtaW5vc2l0eVRocmVzaG9sZCcgXS52YWx1ZSA9IHRoaXMudGhyZXNob2xkO1xuXHRcdHRoaXMuZnNRdWFkLm1hdGVyaWFsID0gdGhpcy5tYXRlcmlhbEhpZ2hQYXNzRmlsdGVyO1xuXG5cdFx0cmVuZGVyZXIuc2V0UmVuZGVyVGFyZ2V0KCB0aGlzLnJlbmRlclRhcmdldEJyaWdodCApO1xuXHRcdHJlbmRlcmVyLmNsZWFyKCk7XG5cdFx0dGhpcy5mc1F1YWQucmVuZGVyKCByZW5kZXJlciApO1xuXG5cdFx0Ly8gMi4gQmx1ciBBbGwgdGhlIG1pcHMgcHJvZ3Jlc3NpdmVseVxuXG5cdFx0bGV0IGlucHV0UmVuZGVyVGFyZ2V0ID0gdGhpcy5yZW5kZXJUYXJnZXRCcmlnaHQ7XG5cblx0XHRmb3IgKCBsZXQgaSA9IDA7IGkgPCB0aGlzLm5NaXBzOyBpICsrICkge1xuXG5cdFx0XHR0aGlzLmZzUXVhZC5tYXRlcmlhbCA9IHRoaXMuc2VwYXJhYmxlQmx1ck1hdGVyaWFsc1sgaSBdO1xuXG5cdFx0XHR0aGlzLnNlcGFyYWJsZUJsdXJNYXRlcmlhbHNbIGkgXS51bmlmb3Jtc1sgJ2NvbG9yVGV4dHVyZScgXS52YWx1ZSA9IGlucHV0UmVuZGVyVGFyZ2V0LnRleHR1cmU7XG5cdFx0XHR0aGlzLnNlcGFyYWJsZUJsdXJNYXRlcmlhbHNbIGkgXS51bmlmb3Jtc1sgJ2RpcmVjdGlvbicgXS52YWx1ZSA9IFVucmVhbEJsb29tUGFzcy5CbHVyRGlyZWN0aW9uWDtcblx0XHRcdHJlbmRlcmVyLnNldFJlbmRlclRhcmdldCggdGhpcy5yZW5kZXJUYXJnZXRzSG9yaXpvbnRhbFsgaSBdICk7XG5cdFx0XHRyZW5kZXJlci5jbGVhcigpO1xuXHRcdFx0dGhpcy5mc1F1YWQucmVuZGVyKCByZW5kZXJlciApO1xuXG5cdFx0XHR0aGlzLnNlcGFyYWJsZUJsdXJNYXRlcmlhbHNbIGkgXS51bmlmb3Jtc1sgJ2NvbG9yVGV4dHVyZScgXS52YWx1ZSA9IHRoaXMucmVuZGVyVGFyZ2V0c0hvcml6b250YWxbIGkgXS50ZXh0dXJlO1xuXHRcdFx0dGhpcy5zZXBhcmFibGVCbHVyTWF0ZXJpYWxzWyBpIF0udW5pZm9ybXNbICdkaXJlY3Rpb24nIF0udmFsdWUgPSBVbnJlYWxCbG9vbVBhc3MuQmx1ckRpcmVjdGlvblk7XG5cdFx0XHRyZW5kZXJlci5zZXRSZW5kZXJUYXJnZXQoIHRoaXMucmVuZGVyVGFyZ2V0c1ZlcnRpY2FsWyBpIF0gKTtcblx0XHRcdHJlbmRlcmVyLmNsZWFyKCk7XG5cdFx0XHR0aGlzLmZzUXVhZC5yZW5kZXIoIHJlbmRlcmVyICk7XG5cblx0XHRcdGlucHV0UmVuZGVyVGFyZ2V0ID0gdGhpcy5yZW5kZXJUYXJnZXRzVmVydGljYWxbIGkgXTtcblxuXHRcdH1cblxuXHRcdC8vIENvbXBvc2l0ZSBBbGwgdGhlIG1pcHNcblxuXHRcdHRoaXMuZnNRdWFkLm1hdGVyaWFsID0gdGhpcy5jb21wb3NpdGVNYXRlcmlhbDtcblx0XHR0aGlzLmNvbXBvc2l0ZU1hdGVyaWFsLnVuaWZvcm1zWyAnYmxvb21TdHJlbmd0aCcgXS52YWx1ZSA9IHRoaXMuc3RyZW5ndGg7XG5cdFx0dGhpcy5jb21wb3NpdGVNYXRlcmlhbC51bmlmb3Jtc1sgJ2Jsb29tUmFkaXVzJyBdLnZhbHVlID0gdGhpcy5yYWRpdXM7XG5cdFx0dGhpcy5jb21wb3NpdGVNYXRlcmlhbC51bmlmb3Jtc1sgJ2Jsb29tVGludENvbG9ycycgXS52YWx1ZSA9IHRoaXMuYmxvb21UaW50Q29sb3JzO1xuXG5cdFx0cmVuZGVyZXIuc2V0UmVuZGVyVGFyZ2V0KCB0aGlzLnJlbmRlclRhcmdldHNIb3Jpem9udGFsWyAwIF0gKTtcblx0XHRyZW5kZXJlci5jbGVhcigpO1xuXHRcdHRoaXMuZnNRdWFkLnJlbmRlciggcmVuZGVyZXIgKTtcblxuXHRcdC8vIEJsZW5kIGl0IGFkZGl0aXZlbHkgb3ZlciB0aGUgaW5wdXQgdGV4dHVyZVxuXG5cdFx0dGhpcy5mc1F1YWQubWF0ZXJpYWwgPSB0aGlzLm1hdGVyaWFsQ29weTtcblx0XHR0aGlzLmNvcHlVbmlmb3Jtc1sgJ3REaWZmdXNlJyBdLnZhbHVlID0gdGhpcy5yZW5kZXJUYXJnZXRzSG9yaXpvbnRhbFsgMCBdLnRleHR1cmU7XG5cblx0XHRpZiAoIG1hc2tBY3RpdmUgKSByZW5kZXJlci5zdGF0ZS5idWZmZXJzLnN0ZW5jaWwuc2V0VGVzdCggdHJ1ZSApO1xuXG5cdFx0aWYgKCB0aGlzLnJlbmRlclRvU2NyZWVuICkge1xuXG5cdFx0XHRyZW5kZXJlci5zZXRSZW5kZXJUYXJnZXQoIG51bGwgKTtcblx0XHRcdHRoaXMuZnNRdWFkLnJlbmRlciggcmVuZGVyZXIgKTtcblxuXHRcdH0gZWxzZSB7XG5cblx0XHRcdHJlbmRlcmVyLnNldFJlbmRlclRhcmdldCggcmVhZEJ1ZmZlciApO1xuXHRcdFx0dGhpcy5mc1F1YWQucmVuZGVyKCByZW5kZXJlciApO1xuXG5cdFx0fVxuXG5cdFx0Ly8gUmVzdG9yZSByZW5kZXJlciBzZXR0aW5nc1xuXG5cdFx0cmVuZGVyZXIuc2V0Q2xlYXJDb2xvciggdGhpcy5fb2xkQ2xlYXJDb2xvciwgdGhpcy5vbGRDbGVhckFscGhhICk7XG5cdFx0cmVuZGVyZXIuYXV0b0NsZWFyID0gb2xkQXV0b0NsZWFyO1xuXG5cdH1cblxuXHRnZXRTZXBlcmFibGVCbHVyTWF0ZXJpYWwoIGtlcm5lbFJhZGl1cyApIHtcblxuXHRcdHJldHVybiBuZXcgU2hhZGVyTWF0ZXJpYWwoIHtcblxuXHRcdFx0ZGVmaW5lczoge1xuXHRcdFx0XHQnS0VSTkVMX1JBRElVUyc6IGtlcm5lbFJhZGl1cyxcblx0XHRcdFx0J1NJR01BJzoga2VybmVsUmFkaXVzXG5cdFx0XHR9LFxuXG5cdFx0XHR1bmlmb3Jtczoge1xuXHRcdFx0XHQnY29sb3JUZXh0dXJlJzogeyB2YWx1ZTogbnVsbCB9LFxuXHRcdFx0XHQndGV4U2l6ZSc6IHsgdmFsdWU6IG5ldyBWZWN0b3IyKCAwLjUsIDAuNSApIH0sXG5cdFx0XHRcdCdkaXJlY3Rpb24nOiB7IHZhbHVlOiBuZXcgVmVjdG9yMiggMC41LCAwLjUgKSB9XG5cdFx0XHR9LFxuXG5cdFx0XHR2ZXJ0ZXhTaGFkZXI6XG5cdFx0XHRcdGB2YXJ5aW5nIHZlYzIgdlV2O1xuXHRcdFx0XHR2b2lkIG1haW4oKSB7XG5cdFx0XHRcdFx0dlV2ID0gdXY7XG5cdFx0XHRcdFx0Z2xfUG9zaXRpb24gPSBwcm9qZWN0aW9uTWF0cml4ICogbW9kZWxWaWV3TWF0cml4ICogdmVjNCggcG9zaXRpb24sIDEuMCApO1xuXHRcdFx0XHR9YCxcblxuXHRcdFx0ZnJhZ21lbnRTaGFkZXI6XG5cdFx0XHRcdGAjaW5jbHVkZSA8Y29tbW9uPlxuXHRcdFx0XHR2YXJ5aW5nIHZlYzIgdlV2O1xuXHRcdFx0XHR1bmlmb3JtIHNhbXBsZXIyRCBjb2xvclRleHR1cmU7XG5cdFx0XHRcdHVuaWZvcm0gdmVjMiB0ZXhTaXplO1xuXHRcdFx0XHR1bmlmb3JtIHZlYzIgZGlyZWN0aW9uO1xuXG5cdFx0XHRcdGZsb2F0IGdhdXNzaWFuUGRmKGluIGZsb2F0IHgsIGluIGZsb2F0IHNpZ21hKSB7XG5cdFx0XHRcdFx0cmV0dXJuIDAuMzk4OTQgKiBleHAoIC0wLjUgKiB4ICogeC8oIHNpZ21hICogc2lnbWEpKS9zaWdtYTtcblx0XHRcdFx0fVxuXHRcdFx0XHR2b2lkIG1haW4oKSB7XG5cdFx0XHRcdFx0dmVjMiBpbnZTaXplID0gMS4wIC8gdGV4U2l6ZTtcblx0XHRcdFx0XHRmbG9hdCBmU2lnbWEgPSBmbG9hdChTSUdNQSk7XG5cdFx0XHRcdFx0ZmxvYXQgd2VpZ2h0U3VtID0gZ2F1c3NpYW5QZGYoMC4wLCBmU2lnbWEpO1xuXHRcdFx0XHRcdHZlYzMgZGlmZnVzZVN1bSA9IHRleHR1cmUyRCggY29sb3JUZXh0dXJlLCB2VXYpLnJnYiAqIHdlaWdodFN1bTtcblx0XHRcdFx0XHRmb3IoIGludCBpID0gMTsgaSA8IEtFUk5FTF9SQURJVVM7IGkgKysgKSB7XG5cdFx0XHRcdFx0XHRmbG9hdCB4ID0gZmxvYXQoaSk7XG5cdFx0XHRcdFx0XHRmbG9hdCB3ID0gZ2F1c3NpYW5QZGYoeCwgZlNpZ21hKTtcblx0XHRcdFx0XHRcdHZlYzIgdXZPZmZzZXQgPSBkaXJlY3Rpb24gKiBpbnZTaXplICogeDtcblx0XHRcdFx0XHRcdHZlYzMgc2FtcGxlMSA9IHRleHR1cmUyRCggY29sb3JUZXh0dXJlLCB2VXYgKyB1dk9mZnNldCkucmdiO1xuXHRcdFx0XHRcdFx0dmVjMyBzYW1wbGUyID0gdGV4dHVyZTJEKCBjb2xvclRleHR1cmUsIHZVdiAtIHV2T2Zmc2V0KS5yZ2I7XG5cdFx0XHRcdFx0XHRkaWZmdXNlU3VtICs9IChzYW1wbGUxICsgc2FtcGxlMikgKiB3O1xuXHRcdFx0XHRcdFx0d2VpZ2h0U3VtICs9IDIuMCAqIHc7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGdsX0ZyYWdDb2xvciA9IHZlYzQoZGlmZnVzZVN1bS93ZWlnaHRTdW0sIDEuMCk7XG5cdFx0XHRcdH1gXG5cdFx0fSApO1xuXG5cdH1cblxuXHRnZXRDb21wb3NpdGVNYXRlcmlhbCggbk1pcHMgKSB7XG5cblx0XHRyZXR1cm4gbmV3IFNoYWRlck1hdGVyaWFsKCB7XG5cblx0XHRcdGRlZmluZXM6IHtcblx0XHRcdFx0J05VTV9NSVBTJzogbk1pcHNcblx0XHRcdH0sXG5cblx0XHRcdHVuaWZvcm1zOiB7XG5cdFx0XHRcdCdibHVyVGV4dHVyZTEnOiB7IHZhbHVlOiBudWxsIH0sXG5cdFx0XHRcdCdibHVyVGV4dHVyZTInOiB7IHZhbHVlOiBudWxsIH0sXG5cdFx0XHRcdCdibHVyVGV4dHVyZTMnOiB7IHZhbHVlOiBudWxsIH0sXG5cdFx0XHRcdCdibHVyVGV4dHVyZTQnOiB7IHZhbHVlOiBudWxsIH0sXG5cdFx0XHRcdCdibHVyVGV4dHVyZTUnOiB7IHZhbHVlOiBudWxsIH0sXG5cdFx0XHRcdCdkaXJ0VGV4dHVyZSc6IHsgdmFsdWU6IG51bGwgfSxcblx0XHRcdFx0J2Jsb29tU3RyZW5ndGgnOiB7IHZhbHVlOiAxLjAgfSxcblx0XHRcdFx0J2Jsb29tRmFjdG9ycyc6IHsgdmFsdWU6IG51bGwgfSxcblx0XHRcdFx0J2Jsb29tVGludENvbG9ycyc6IHsgdmFsdWU6IG51bGwgfSxcblx0XHRcdFx0J2Jsb29tUmFkaXVzJzogeyB2YWx1ZTogMC4wIH1cblx0XHRcdH0sXG5cblx0XHRcdHZlcnRleFNoYWRlcjpcblx0XHRcdFx0YHZhcnlpbmcgdmVjMiB2VXY7XG5cdFx0XHRcdHZvaWQgbWFpbigpIHtcblx0XHRcdFx0XHR2VXYgPSB1djtcblx0XHRcdFx0XHRnbF9Qb3NpdGlvbiA9IHByb2plY3Rpb25NYXRyaXggKiBtb2RlbFZpZXdNYXRyaXggKiB2ZWM0KCBwb3NpdGlvbiwgMS4wICk7XG5cdFx0XHRcdH1gLFxuXG5cdFx0XHRmcmFnbWVudFNoYWRlcjpcblx0XHRcdFx0YHZhcnlpbmcgdmVjMiB2VXY7XG5cdFx0XHRcdHVuaWZvcm0gc2FtcGxlcjJEIGJsdXJUZXh0dXJlMTtcblx0XHRcdFx0dW5pZm9ybSBzYW1wbGVyMkQgYmx1clRleHR1cmUyO1xuXHRcdFx0XHR1bmlmb3JtIHNhbXBsZXIyRCBibHVyVGV4dHVyZTM7XG5cdFx0XHRcdHVuaWZvcm0gc2FtcGxlcjJEIGJsdXJUZXh0dXJlNDtcblx0XHRcdFx0dW5pZm9ybSBzYW1wbGVyMkQgYmx1clRleHR1cmU1O1xuXHRcdFx0XHR1bmlmb3JtIHNhbXBsZXIyRCBkaXJ0VGV4dHVyZTtcblx0XHRcdFx0dW5pZm9ybSBmbG9hdCBibG9vbVN0cmVuZ3RoO1xuXHRcdFx0XHR1bmlmb3JtIGZsb2F0IGJsb29tUmFkaXVzO1xuXHRcdFx0XHR1bmlmb3JtIGZsb2F0IGJsb29tRmFjdG9yc1tOVU1fTUlQU107XG5cdFx0XHRcdHVuaWZvcm0gdmVjMyBibG9vbVRpbnRDb2xvcnNbTlVNX01JUFNdO1xuXG5cdFx0XHRcdGZsb2F0IGxlcnBCbG9vbUZhY3Rvcihjb25zdCBpbiBmbG9hdCBmYWN0b3IpIHtcblx0XHRcdFx0XHRmbG9hdCBtaXJyb3JGYWN0b3IgPSAxLjIgLSBmYWN0b3I7XG5cdFx0XHRcdFx0cmV0dXJuIG1peChmYWN0b3IsIG1pcnJvckZhY3RvciwgYmxvb21SYWRpdXMpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dm9pZCBtYWluKCkge1xuXHRcdFx0XHRcdGdsX0ZyYWdDb2xvciA9IGJsb29tU3RyZW5ndGggKiAoIGxlcnBCbG9vbUZhY3RvcihibG9vbUZhY3RvcnNbMF0pICogdmVjNChibG9vbVRpbnRDb2xvcnNbMF0sIDEuMCkgKiB0ZXh0dXJlMkQoYmx1clRleHR1cmUxLCB2VXYpICtcblx0XHRcdFx0XHRcdGxlcnBCbG9vbUZhY3RvcihibG9vbUZhY3RvcnNbMV0pICogdmVjNChibG9vbVRpbnRDb2xvcnNbMV0sIDEuMCkgKiB0ZXh0dXJlMkQoYmx1clRleHR1cmUyLCB2VXYpICtcblx0XHRcdFx0XHRcdGxlcnBCbG9vbUZhY3RvcihibG9vbUZhY3RvcnNbMl0pICogdmVjNChibG9vbVRpbnRDb2xvcnNbMl0sIDEuMCkgKiB0ZXh0dXJlMkQoYmx1clRleHR1cmUzLCB2VXYpICtcblx0XHRcdFx0XHRcdGxlcnBCbG9vbUZhY3RvcihibG9vbUZhY3RvcnNbM10pICogdmVjNChibG9vbVRpbnRDb2xvcnNbM10sIDEuMCkgKiB0ZXh0dXJlMkQoYmx1clRleHR1cmU0LCB2VXYpICtcblx0XHRcdFx0XHRcdGxlcnBCbG9vbUZhY3RvcihibG9vbUZhY3RvcnNbNF0pICogdmVjNChibG9vbVRpbnRDb2xvcnNbNF0sIDEuMCkgKiB0ZXh0dXJlMkQoYmx1clRleHR1cmU1LCB2VXYpICk7XG5cdFx0XHRcdH1gXG5cdFx0fSApO1xuXG5cdH1cblxufVxuXG5VbnJlYWxCbG9vbVBhc3MuQmx1ckRpcmVjdGlvblggPSBuZXcgVmVjdG9yMiggMS4wLCAwLjAgKTtcblVucmVhbEJsb29tUGFzcy5CbHVyRGlyZWN0aW9uWSA9IG5ldyBWZWN0b3IyKCAwLjAsIDEuMCApO1xuXG5leHBvcnQgeyBVbnJlYWxCbG9vbVBhc3MgfTtcbiIsIi8qKlxuICogRnVsbC1zY3JlZW4gdGV4dHVyZWQgcXVhZCBzaGFkZXJcbiAqL1xuXG52YXIgQ29weVNoYWRlciA9IHtcblxuXHR1bmlmb3Jtczoge1xuXG5cdFx0J3REaWZmdXNlJzogeyB2YWx1ZTogbnVsbCB9LFxuXHRcdCdvcGFjaXR5JzogeyB2YWx1ZTogMS4wIH1cblxuXHR9LFxuXG5cdHZlcnRleFNoYWRlcjogLyogZ2xzbCAqL2BcblxuXHRcdHZhcnlpbmcgdmVjMiB2VXY7XG5cblx0XHR2b2lkIG1haW4oKSB7XG5cblx0XHRcdHZVdiA9IHV2O1xuXHRcdFx0Z2xfUG9zaXRpb24gPSBwcm9qZWN0aW9uTWF0cml4ICogbW9kZWxWaWV3TWF0cml4ICogdmVjNCggcG9zaXRpb24sIDEuMCApO1xuXG5cdFx0fWAsXG5cblx0ZnJhZ21lbnRTaGFkZXI6IC8qIGdsc2wgKi9gXG5cblx0XHR1bmlmb3JtIGZsb2F0IG9wYWNpdHk7XG5cblx0XHR1bmlmb3JtIHNhbXBsZXIyRCB0RGlmZnVzZTtcblxuXHRcdHZhcnlpbmcgdmVjMiB2VXY7XG5cblx0XHR2b2lkIG1haW4oKSB7XG5cblx0XHRcdHZlYzQgdGV4ZWwgPSB0ZXh0dXJlMkQoIHREaWZmdXNlLCB2VXYgKTtcblx0XHRcdGdsX0ZyYWdDb2xvciA9IG9wYWNpdHkgKiB0ZXhlbDtcblxuXHRcdH1gXG5cbn07XG5cbmV4cG9ydCB7IENvcHlTaGFkZXIgfTtcbiIsImltcG9ydCB7XG5cdENvbG9yXG59IGZyb20gJ3RocmVlJztcblxuLyoqXG4gKiBMdW1pbm9zaXR5XG4gKiBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0x1bWlub3NpdHlcbiAqL1xuXG5jb25zdCBMdW1pbm9zaXR5SGlnaFBhc3NTaGFkZXIgPSB7XG5cblx0c2hhZGVySUQ6ICdsdW1pbm9zaXR5SGlnaFBhc3MnLFxuXG5cdHVuaWZvcm1zOiB7XG5cblx0XHQndERpZmZ1c2UnOiB7IHZhbHVlOiBudWxsIH0sXG5cdFx0J2x1bWlub3NpdHlUaHJlc2hvbGQnOiB7IHZhbHVlOiAxLjAgfSxcblx0XHQnc21vb3RoV2lkdGgnOiB7IHZhbHVlOiAxLjAgfSxcblx0XHQnZGVmYXVsdENvbG9yJzogeyB2YWx1ZTogbmV3IENvbG9yKCAweDAwMDAwMCApIH0sXG5cdFx0J2RlZmF1bHRPcGFjaXR5JzogeyB2YWx1ZTogMC4wIH1cblxuXHR9LFxuXG5cdHZlcnRleFNoYWRlcjogLyogZ2xzbCAqL2BcblxuXHRcdHZhcnlpbmcgdmVjMiB2VXY7XG5cblx0XHR2b2lkIG1haW4oKSB7XG5cblx0XHRcdHZVdiA9IHV2O1xuXG5cdFx0XHRnbF9Qb3NpdGlvbiA9IHByb2plY3Rpb25NYXRyaXggKiBtb2RlbFZpZXdNYXRyaXggKiB2ZWM0KCBwb3NpdGlvbiwgMS4wICk7XG5cblx0XHR9YCxcblxuXHRmcmFnbWVudFNoYWRlcjogLyogZ2xzbCAqL2BcblxuXHRcdHVuaWZvcm0gc2FtcGxlcjJEIHREaWZmdXNlO1xuXHRcdHVuaWZvcm0gdmVjMyBkZWZhdWx0Q29sb3I7XG5cdFx0dW5pZm9ybSBmbG9hdCBkZWZhdWx0T3BhY2l0eTtcblx0XHR1bmlmb3JtIGZsb2F0IGx1bWlub3NpdHlUaHJlc2hvbGQ7XG5cdFx0dW5pZm9ybSBmbG9hdCBzbW9vdGhXaWR0aDtcblxuXHRcdHZhcnlpbmcgdmVjMiB2VXY7XG5cblx0XHR2b2lkIG1haW4oKSB7XG5cblx0XHRcdHZlYzQgdGV4ZWwgPSB0ZXh0dXJlMkQoIHREaWZmdXNlLCB2VXYgKTtcblxuXHRcdFx0dmVjMyBsdW1hID0gdmVjMyggMC4yOTksIDAuNTg3LCAwLjExNCApO1xuXG5cdFx0XHRmbG9hdCB2ID0gZG90KCB0ZXhlbC54eXosIGx1bWEgKTtcblxuXHRcdFx0dmVjNCBvdXRwdXRDb2xvciA9IHZlYzQoIGRlZmF1bHRDb2xvci5yZ2IsIGRlZmF1bHRPcGFjaXR5ICk7XG5cblx0XHRcdGZsb2F0IGFscGhhID0gc21vb3Roc3RlcCggbHVtaW5vc2l0eVRocmVzaG9sZCwgbHVtaW5vc2l0eVRocmVzaG9sZCArIHNtb290aFdpZHRoLCB2ICk7XG5cblx0XHRcdGdsX0ZyYWdDb2xvciA9IG1peCggb3V0cHV0Q29sb3IsIHRleGVsLCBhbHBoYSApO1xuXG5cdFx0fWBcblxufTtcblxuZXhwb3J0IHsgTHVtaW5vc2l0eUhpZ2hQYXNzU2hhZGVyIH07XG4iLCJpbXBvcnQgVGhyZWVHbG9iZSBmcm9tIFwidGhyZWUtZ2xvYmVcIjtcbmltcG9ydCB7IFdlYkdMUmVuZGVyZXIsIFNjZW5lIH0gZnJvbSBcInRocmVlXCI7XG5pbXBvcnQge1xuICBQZXJzcGVjdGl2ZUNhbWVyYSxcbiAgQW1iaWVudExpZ2h0LFxuICBEaXJlY3Rpb25hbExpZ2h0LFxuICBDb2xvcixcbiAgRm9nLFxuICAvLyBBeGVzSGVscGVyLFxuICAvLyBEaXJlY3Rpb25hbExpZ2h0SGVscGVyLFxuICAvLyBDYW1lcmFIZWxwZXIsXG4gIFBvaW50TGlnaHQsXG4gIFNwaGVyZUdlb21ldHJ5LFxuICBcbn0gZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBFZmZlY3RDb21wb3NlciB9IGZyb20gJ3RocmVlL2V4YW1wbGVzL2pzbS9wb3N0cHJvY2Vzc2luZy9FZmZlY3RDb21wb3Nlci5qcyc7XG5pbXBvcnQgeyBSZW5kZXJQYXNzIH0gZnJvbSAndGhyZWUvZXhhbXBsZXMvanNtL3Bvc3Rwcm9jZXNzaW5nL1JlbmRlclBhc3MuanMnO1xuaW1wb3J0IHsgVW5yZWFsQmxvb21QYXNzIH0gZnJvbSAndGhyZWUvZXhhbXBsZXMvanNtL3Bvc3Rwcm9jZXNzaW5nL1VucmVhbEJsb29tUGFzcy5qcyc7XG5cbmltcG9ydCB7IE9yYml0Q29udHJvbHMgfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL2NvbnRyb2xzL09yYml0Q29udHJvbHMuanNcIjtcbmltcG9ydCB7IGNyZWF0ZUdsb3dNZXNoIH0gZnJvbSBcInRocmVlLWdsb3ctbWVzaFwiO1xuaW1wb3J0IGNvdW50cmllcyBmcm9tIFwiLi9maWxlcy9nbG9iZS1kYXRhLW1pbi5qc29uXCI7XG5pbXBvcnQgdHJhdmVsSGlzdG9yeSBmcm9tIFwiLi9maWxlcy9teS1mbGlnaHRzLmpzb25cIjtcbmltcG9ydCBhaXJwb3J0SGlzdG9yeSBmcm9tIFwiLi9maWxlcy9teS1haXJwb3J0cy5qc29uXCI7XG52YXIgcmVuZGVyZXIsIGNhbWVyYSwgc2NlbmUsIGNvbnRyb2xzICxjb21wb3NlcjtcbmxldCBtb3VzZVggPSAwO1xubGV0IG1vdXNlWSA9IDA7XG5sZXQgd2luZG93SGFsZlggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDI7XG5sZXQgd2luZG93SGFsZlkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyO1xudmFyIEdsb2JlO1xuXG5pbml0KCk7XG5pbml0R2xvYmUoKTtcbm9uV2luZG93UmVzaXplKCk7XG5hbmltYXRlKCk7XG5cbi8vIFNFQ1RJT04gSW5pdGlhbGl6aW5nIGNvcmUgVGhyZWVKUyBlbGVtZW50c1xuZnVuY3Rpb24gaW5pdCgpIHtcbiAgLy8gSW5pdGlhbGl6ZSByZW5kZXJlclxuICByZW5kZXJlciA9IG5ldyBXZWJHTFJlbmRlcmVyKHsgYW50aWFsaWFzOiB0cnVlIH0pO1xuICByZW5kZXJlci5zZXRQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcbiAgcmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgLy8gcmVuZGVyZXIub3V0cHV0RW5jb2RpbmcgPSBUSFJFRS5zUkdCRW5jb2Rpbmc7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocmVuZGVyZXIuZG9tRWxlbWVudCk7XG5cbiAgLy8gSW5pdGlhbGl6ZSBzY2VuZSwgbGlnaHRcbiAgc2NlbmUgPSBuZXcgU2NlbmUoKTtcbiAgc2NlbmUuYWRkKG5ldyBBbWJpZW50TGlnaHQoMHhiYmJiYmIsIDAuMykpO1xuICBzY2VuZS5iYWNrZ3JvdW5kID0gbmV3IENvbG9yKDB4MDAwMDAwKTtcblxuICAvLyBJbml0aWFsaXplIGNhbWVyYSwgbGlnaHRcbiAgY2FtZXJhID0gbmV3IFBlcnNwZWN0aXZlQ2FtZXJhKCk7XG4gIGNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcblxuICAgY29uc3QgcmVuZGVyUGFzcyA9IG5ldyBSZW5kZXJQYXNzKHNjZW5lLCBjYW1lcmEpO1xuICBjb25zdCBibG9vbVBhc3MgPSBuZXcgVW5yZWFsQmxvb21QYXNzKFxuICAgIG5ldyBUSFJFRS5WZWN0b3IyKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpLFxuICAgIDAuOCwgIC8vIHN0cmVuZ3RoXG4gICAgMC4zLCAgLy8gcmFkaXVzXG4gICAgMC4xICAgLy8gdGhyZXNob2xkXG4gICk7XG4gIGNvbXBvc2VyID0gbmV3IEVmZmVjdENvbXBvc2VyKHJlbmRlcmVyKTtcbiAgY29tcG9zZXIuYWRkUGFzcyhyZW5kZXJQYXNzKTtcbiAgY29tcG9zZXIuYWRkUGFzcyhibG9vbVBhc3MpO1xuICBcbiAgdmFyIGRMaWdodCA9IG5ldyBEaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmLCAwLjgpO1xuICBkTGlnaHQucG9zaXRpb24uc2V0KC04MDAsIDIwMDAsIDQwMCk7XG4gIGNhbWVyYS5hZGQoZExpZ2h0KTtcblxuICB2YXIgZExpZ2h0MSA9IG5ldyBEaXJlY3Rpb25hbExpZ2h0KDB4Nzk4MmY2LCAxKTtcbiAgZExpZ2h0MS5wb3NpdGlvbi5zZXQoLTIwMCwgNTAwLCAyMDApO1xuICBjYW1lcmEuYWRkKGRMaWdodDEpO1xuXG4gIHZhciBkTGlnaHQyID0gbmV3IFBvaW50TGlnaHQoMHg4NTY2Y2MsIDAuNSk7XG4gIGRMaWdodDIucG9zaXRpb24uc2V0KC0yMDAsIDUwMCwgMjAwKTtcbiAgY2FtZXJhLmFkZChkTGlnaHQyKTtcblxuICBjYW1lcmEucG9zaXRpb24ueiA9IDQwMDtcbiAgY2FtZXJhLnBvc2l0aW9uLnggPSAwO1xuICBjYW1lcmEucG9zaXRpb24ueSA9IDA7XG5cbiAgc2NlbmUuYWRkKGNhbWVyYSk7XG5cbiAgLy8gQWRkaXRpb25hbCBlZmZlY3RzXG4gIHNjZW5lLmZvZyA9IG5ldyBGb2coMHg1MzVlZjMsIDQwMCwgMjAwMCk7XG5cbiAgLy8gSGVscGVyc1xuICAvLyBjb25zdCBheGVzSGVscGVyID0gbmV3IEF4ZXNIZWxwZXIoODAwKTtcbiAgLy8gc2NlbmUuYWRkKGF4ZXNIZWxwZXIpO1xuICAvLyB2YXIgaGVscGVyID0gbmV3IERpcmVjdGlvbmFsTGlnaHRIZWxwZXIoZExpZ2h0KTtcbiAgLy8gc2NlbmUuYWRkKGhlbHBlcik7XG4gIC8vIHZhciBoZWxwZXJDYW1lcmEgPSBuZXcgQ2FtZXJhSGVscGVyKGRMaWdodC5zaGFkb3cuY2FtZXJhKTtcbiAgLy8gc2NlbmUuYWRkKGhlbHBlckNhbWVyYSk7XG5cbiAgLy8gSW5pdGlhbGl6ZSBjb250cm9sc1xuICBjb250cm9scyA9IG5ldyBPcmJpdENvbnRyb2xzKGNhbWVyYSwgcmVuZGVyZXIuZG9tRWxlbWVudCk7XG4gIGNvbnRyb2xzLmVuYWJsZURhbXBpbmcgPSB0cnVlO1xuICBjb250cm9scy5keW5hbWljRGFtcGluZ0ZhY3RvciA9IDAuMDE7XG4gIGNvbnRyb2xzLmVuYWJsZVBhbiA9IGZhbHNlO1xuICBjb250cm9scy5taW5EaXN0YW5jZSA9IDIwMDtcbiAgY29udHJvbHMubWF4RGlzdGFuY2UgPSA1MDA7XG4gIGNvbnRyb2xzLnJvdGF0ZVNwZWVkID0gMC44O1xuICBjb250cm9scy56b29tU3BlZWQgPSAxO1xuICBjb250cm9scy5hdXRvUm90YXRlID0gZmFsc2U7XG5cbiAgY29udHJvbHMubWluUG9sYXJBbmdsZSA9IE1hdGguUEkgLyAzLjU7XG4gIGNvbnRyb2xzLm1heFBvbGFyQW5nbGUgPSBNYXRoLlBJIC0gTWF0aC5QSSAvIDM7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgb25XaW5kb3dSZXNpemUsIGZhbHNlKTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBvbk1vdXNlTW92ZSk7XG59XG4vLyBTRUNUSU9OIEdsb2JlXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyAtLS0gUkVQTEFDRSBZT1VSIE9MRCBpbml0R2xvYmUgRlVOQ1RJT04gV0lUSCBUSElTIEVOVElSRSBCTE9DSyAtLS1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gaW5pdEdsb2JlKCkge1xuICAvLyAxLiAtLS0gSW5pdGlhbGl6ZSB0aGUgR2xvYmUgYW5kIHNldCB1cCB0aGUgaGV4YWdvbiBzdHlsZSAtLS1cbiAgR2xvYmUgPSBuZXcgVGhyZWVHbG9iZSh7XG4gICAgd2FpdEZvckdsb2JlUmVhZHk6IHRydWUsXG4gICAgYW5pbWF0ZUluOiB0cnVlLFxuICB9KVxuICAgIC5oZXhQb2x5Z29uc0RhdGEoY291bnRyaWVzLmZlYXR1cmVzKVxuICAgIC8vXG4gICAgLy8gLS0tIEtFWSBDSEFOR0VTIGZvciBWSVNJQkxFLCBUSUdIVCBIRVhBR09OUyAtLS1cbiAgICAuaGV4UG9seWdvblJlc29sdXRpb24oMykgLy8gTG93ZXIgbnVtYmVyID0gQklHR0VSIGhleGFnb25zXG4gICAgLmhleFBvbHlnb25NYXJnaW4oMC40KSAgIC8vIFNtYWxsIG51bWJlciA9IGhleGFnb25zIGFyZSBWRVJZIENMT1NFXG4gICAgLy9cbiAgICAuc2hvd0F0bW9zcGhlcmUodHJ1ZSlcbiAgICAuYXRtb3NwaGVyZUNvbG9yKCcjN2I4YjJmZmYnKVxuICAgIC5hdG1vc3BoZXJlQWx0aXR1ZGUoMC4yNSlcbiAgICAvLyAtLS0gU2V0IGEgc2luZ2xlLCBicmlnaHQgY29sb3IgZm9yIEFMTCBoZXhhZ29ucyAtLS1cbiAgICAuaGV4UG9seWdvbkNvbG9yKCgpID0+ICcjYzVhOTIwZmYnKTtcblxuICAvLyAyLiAtLS0gWW91ciBvcmlnaW5hbCBsYWJlbCBhbmQgcG9pbnQgY29kZSAtLS1cbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgR2xvYmUubGFiZWxzRGF0YShhaXJwb3J0SGlzdG9yeS5haXJwb3J0cylcbiAgICAgIC5sYWJlbENvbG9yKCgpID0+ICcjZmZjYjIxJylcbiAgICAgIC5sYWJlbERvdE9yaWVudGF0aW9uKChlKSA9PiAoZS50ZXh0ID09PSAnQUxBJyA/ICd0b3AnIDogJ3JpZ2h0JykpXG4gICAgICAubGFiZWxEb3RSYWRpdXMoMC4zKVxuICAgICAgLmxhYmVsU2l6ZSgoZSkgPT4gZS5zaXplKVxuICAgICAgLmxhYmVsVGV4dCgnY2l0eScpXG4gICAgICAubGFiZWxSZXNvbHV0aW9uKDYpXG4gICAgICAubGFiZWxBbHRpdHVkZSgwLjAxKVxuICAgICAgLnBvaW50c0RhdGEoYWlycG9ydEhpc3RvcnkuYWlycG9ydHMpXG4gICAgICAucG9pbnRDb2xvcigoKSA9PiAnI2ZmZmZmZicpXG4gICAgICAucG9pbnRzTWVyZ2UodHJ1ZSlcbiAgICAgIC5wb2ludEFsdGl0dWRlKDAuMDcpXG4gICAgICAucG9pbnRSYWRpdXMoMC4wNSk7XG4gIH0sIDEwMDApO1xuXG4gIC8vIDMuIC0tLSBHbG9iZSBCYXNlIE1hdGVyaWFsIChUSEUgQ1JJVElDQUwgRklYKSAtLS1cbiAgLy8gVGhlIGdsb2JlICp1bmRlcm5lYXRoKiB0aGUgaGV4YWdvbnMgbXVzdCBiZSBkYXJrIGFuZCBzb2xpZC5cbiAgY29uc3QgZ2xvYmVNYXRlcmlhbCA9IEdsb2JlLmdsb2JlTWF0ZXJpYWwoKTtcblxuLy8gLS0tIFNldHRpbmdzIGZvciBUcnVlIFRyYW5zcGFyZW5jeSAtLS1cbmdsb2JlTWF0ZXJpYWwudHJhbnNwYXJlbnQgPSB0cnVlO1xuZ2xvYmVNYXRlcmlhbC5vcGFjaXR5ID0gMC41OyAgICAgIC8vIDwtLSBBZGp1c3QgdGhpcyB2YWx1ZSAoMC4xIHRvIDAuNSBpcyBnb29kKVxuZ2xvYmVNYXRlcmlhbC5jb2xvciA9IG5ldyBDb2xvcigweDAwMDAwMCk7IFxuZ2xvYmVNYXRlcmlhbC5lbWlzc2l2ZSA9IG5ldyBDb2xvcigweDAwMDAwMCk7XG5nbG9iZU1hdGVyaWFsLnNoaW5pbmVzcyA9IDA7XG5cbiAgLy8gNC4gLS0tIEZpbmFsIEdsb2JlIG9yaWVudGF0aW9uIGFuZCBhZGRpbmcgdG8gc2NlbmUgLS0tXG4gIGNvbnN0IGxhdCA9IDI0O1xuICBjb25zdCBsbmcgPSA0NTtcbiAgY29uc3Qgcm90YXRpb25ZID0gLWxuZyAqIChNYXRoLlBJIC8gMTgwKTtcbiAgY29uc3Qgcm90YXRpb25aID0gbGF0ICogKE1hdGguUEkgLyAxODApO1xuICBHbG9iZS5yb3RhdGVZKHJvdGF0aW9uWSk7XG4gIEdsb2JlLnJvdGF0ZVoocm90YXRpb25aKTtcblxuICBzY2VuZS5hZGQoR2xvYmUpO1xuXG59XG5cbmZ1bmN0aW9uIG9uTW91c2VNb3ZlKGV2ZW50KSB7XG4gIG1vdXNlWCA9IGV2ZW50LmNsaWVudFggLSB3aW5kb3dIYWxmWDtcbiAgbW91c2VZID0gZXZlbnQuY2xpZW50WSAtIHdpbmRvd0hhbGZZO1xuICAvLyBjb25zb2xlLmxvZyhcIng6IFwiICsgbW91c2VYICsgXCIgeTogXCIgKyBtb3VzZVkpO1xufVxuXG5mdW5jdGlvbiBvbldpbmRvd1Jlc2l6ZSgpIHtcbiAgY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuICB3aW5kb3dIYWxmWCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMS41O1xuICB3aW5kb3dIYWxmWSA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDEuNTtcbiAgcmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbn1cblxuZnVuY3Rpb24gYW5pbWF0ZSgpIHtcbiAgY2FtZXJhLnBvc2l0aW9uLnggKz1cbiAgICBNYXRoLmFicyhtb3VzZVgpIDw9IHdpbmRvd0hhbGZYIC8gMlxuICAgICAgPyAobW91c2VYIC8gMiAtIGNhbWVyYS5wb3NpdGlvbi54KSAqIDAuMDA1XG4gICAgICA6IDA7XG4gIGNhbWVyYS5wb3NpdGlvbi55ICs9ICgtbW91c2VZIC8gMiAtIGNhbWVyYS5wb3NpdGlvbi55KSAqIDAuMDA1O1xuICBjYW1lcmEubG9va0F0KHNjZW5lLnBvc2l0aW9uKTtcbiAgY29udHJvbHMudXBkYXRlKCk7XG4gIHJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKTtcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xufVxuIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5oID0gKCkgPT4gXCJiNTI2NTAwMGYxMGM4MzJiMDNjNlwiIl0sInNvdXJjZVJvb3QiOiIifQ==