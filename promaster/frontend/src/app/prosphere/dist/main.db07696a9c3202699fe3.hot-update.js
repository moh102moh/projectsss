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
/******/ 		__webpack_require__.h = () => "c31eff8b2698653a0662"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL25vZGVfbW9kdWxlcy90aHJlZS9leGFtcGxlcy9qc20vcG9zdHByb2Nlc3NpbmcvRWZmZWN0Q29tcG9zZXIuanMiLCJ3ZWJwYWNrOi8vcGFuZGVtaWMtZ2xvYmUvLi9ub2RlX21vZHVsZXMvdGhyZWUvZXhhbXBsZXMvanNtL3Bvc3Rwcm9jZXNzaW5nL01hc2tQYXNzLmpzIiwid2VicGFjazovL3BhbmRlbWljLWdsb2JlLy4vbm9kZV9tb2R1bGVzL3RocmVlL2V4YW1wbGVzL2pzbS9wb3N0cHJvY2Vzc2luZy9QYXNzLmpzIiwid2VicGFjazovL3BhbmRlbWljLWdsb2JlLy4vbm9kZV9tb2R1bGVzL3RocmVlL2V4YW1wbGVzL2pzbS9wb3N0cHJvY2Vzc2luZy9SZW5kZXJQYXNzLmpzIiwid2VicGFjazovL3BhbmRlbWljLWdsb2JlLy4vbm9kZV9tb2R1bGVzL3RocmVlL2V4YW1wbGVzL2pzbS9wb3N0cHJvY2Vzc2luZy9TaGFkZXJQYXNzLmpzIiwid2VicGFjazovL3BhbmRlbWljLWdsb2JlLy4vbm9kZV9tb2R1bGVzL3RocmVlL2V4YW1wbGVzL2pzbS9wb3N0cHJvY2Vzc2luZy9VbnJlYWxCbG9vbVBhc3MuanMiLCJ3ZWJwYWNrOi8vcGFuZGVtaWMtZ2xvYmUvLi9ub2RlX21vZHVsZXMvdGhyZWUvZXhhbXBsZXMvanNtL3NoYWRlcnMvQ29weVNoYWRlci5qcyIsIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL25vZGVfbW9kdWxlcy90aHJlZS9leGFtcGxlcy9qc20vc2hhZGVycy9MdW1pbm9zaXR5SGlnaFBhc3NTaGFkZXIuanMiLCJ3ZWJwYWNrOi8vcGFuZGVtaWMtZ2xvYmUvLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vcGFuZGVtaWMtZ2xvYmUvd2VicGFjay9ydW50aW1lL2dldEZ1bGxIYXNoIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFVZTtBQUN1QztBQUNP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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQXFCLDZEQUF1QjtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQiw2REFBdUI7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNEJBQTRCO0FBQzVCLDBCQUEwQix3Q0FBSyxXO0FBQy9CLDZCQUE2Qix3Q0FBSztBQUNsQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O1dDdE1BLG9EIiwiZmlsZSI6Im1haW4uZGIwNzY5NmE5YzMyMDI2OTlmZTMuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG5cdEJ1ZmZlckdlb21ldHJ5LFxuXHRDbG9jayxcblx0RmxvYXQzMkJ1ZmZlckF0dHJpYnV0ZSxcblx0TGluZWFyRmlsdGVyLFxuXHRNZXNoLFxuXHRPcnRob2dyYXBoaWNDYW1lcmEsXG5cdFJHQkFGb3JtYXQsXG5cdFZlY3RvcjIsXG5cdFdlYkdMUmVuZGVyVGFyZ2V0XG59IGZyb20gJ3RocmVlJztcbmltcG9ydCB7IENvcHlTaGFkZXIgfSBmcm9tICcuLi9zaGFkZXJzL0NvcHlTaGFkZXIuanMnO1xuaW1wb3J0IHsgU2hhZGVyUGFzcyB9IGZyb20gJy4uL3Bvc3Rwcm9jZXNzaW5nL1NoYWRlclBhc3MuanMnO1xuaW1wb3J0IHsgTWFza1Bhc3MgfSBmcm9tICcuLi9wb3N0cHJvY2Vzc2luZy9NYXNrUGFzcy5qcyc7XG5pbXBvcnQgeyBDbGVhck1hc2tQYXNzIH0gZnJvbSAnLi4vcG9zdHByb2Nlc3NpbmcvTWFza1Bhc3MuanMnO1xuXG5jbGFzcyBFZmZlY3RDb21wb3NlciB7XG5cblx0Y29uc3RydWN0b3IoIHJlbmRlcmVyLCByZW5kZXJUYXJnZXQgKSB7XG5cblx0XHR0aGlzLnJlbmRlcmVyID0gcmVuZGVyZXI7XG5cblx0XHRpZiAoIHJlbmRlclRhcmdldCA9PT0gdW5kZWZpbmVkICkge1xuXG5cdFx0XHRjb25zdCBwYXJhbWV0ZXJzID0ge1xuXHRcdFx0XHRtaW5GaWx0ZXI6IExpbmVhckZpbHRlcixcblx0XHRcdFx0bWFnRmlsdGVyOiBMaW5lYXJGaWx0ZXIsXG5cdFx0XHRcdGZvcm1hdDogUkdCQUZvcm1hdFxuXHRcdFx0fTtcblxuXHRcdFx0Y29uc3Qgc2l6ZSA9IHJlbmRlcmVyLmdldFNpemUoIG5ldyBWZWN0b3IyKCkgKTtcblx0XHRcdHRoaXMuX3BpeGVsUmF0aW8gPSByZW5kZXJlci5nZXRQaXhlbFJhdGlvKCk7XG5cdFx0XHR0aGlzLl93aWR0aCA9IHNpemUud2lkdGg7XG5cdFx0XHR0aGlzLl9oZWlnaHQgPSBzaXplLmhlaWdodDtcblxuXHRcdFx0cmVuZGVyVGFyZ2V0ID0gbmV3IFdlYkdMUmVuZGVyVGFyZ2V0KCB0aGlzLl93aWR0aCAqIHRoaXMuX3BpeGVsUmF0aW8sIHRoaXMuX2hlaWdodCAqIHRoaXMuX3BpeGVsUmF0aW8sIHBhcmFtZXRlcnMgKTtcblx0XHRcdHJlbmRlclRhcmdldC50ZXh0dXJlLm5hbWUgPSAnRWZmZWN0Q29tcG9zZXIucnQxJztcblxuXHRcdH0gZWxzZSB7XG5cblx0XHRcdHRoaXMuX3BpeGVsUmF0aW8gPSAxO1xuXHRcdFx0dGhpcy5fd2lkdGggPSByZW5kZXJUYXJnZXQud2lkdGg7XG5cdFx0XHR0aGlzLl9oZWlnaHQgPSByZW5kZXJUYXJnZXQuaGVpZ2h0O1xuXG5cdFx0fVxuXG5cdFx0dGhpcy5yZW5kZXJUYXJnZXQxID0gcmVuZGVyVGFyZ2V0O1xuXHRcdHRoaXMucmVuZGVyVGFyZ2V0MiA9IHJlbmRlclRhcmdldC5jbG9uZSgpO1xuXHRcdHRoaXMucmVuZGVyVGFyZ2V0Mi50ZXh0dXJlLm5hbWUgPSAnRWZmZWN0Q29tcG9zZXIucnQyJztcblxuXHRcdHRoaXMud3JpdGVCdWZmZXIgPSB0aGlzLnJlbmRlclRhcmdldDE7XG5cdFx0dGhpcy5yZWFkQnVmZmVyID0gdGhpcy5yZW5kZXJUYXJnZXQyO1xuXG5cdFx0dGhpcy5yZW5kZXJUb1NjcmVlbiA9IHRydWU7XG5cblx0XHR0aGlzLnBhc3NlcyA9IFtdO1xuXG5cdFx0Ly8gZGVwZW5kZW5jaWVzXG5cblx0XHRpZiAoIENvcHlTaGFkZXIgPT09IHVuZGVmaW5lZCApIHtcblxuXHRcdFx0Y29uc29sZS5lcnJvciggJ1RIUkVFLkVmZmVjdENvbXBvc2VyIHJlbGllcyBvbiBDb3B5U2hhZGVyJyApO1xuXG5cdFx0fVxuXG5cdFx0aWYgKCBTaGFkZXJQYXNzID09PSB1bmRlZmluZWQgKSB7XG5cblx0XHRcdGNvbnNvbGUuZXJyb3IoICdUSFJFRS5FZmZlY3RDb21wb3NlciByZWxpZXMgb24gU2hhZGVyUGFzcycgKTtcblxuXHRcdH1cblxuXHRcdHRoaXMuY29weVBhc3MgPSBuZXcgU2hhZGVyUGFzcyggQ29weVNoYWRlciApO1xuXG5cdFx0dGhpcy5jbG9jayA9IG5ldyBDbG9jaygpO1xuXG5cdH1cblxuXHRzd2FwQnVmZmVycygpIHtcblxuXHRcdGNvbnN0IHRtcCA9IHRoaXMucmVhZEJ1ZmZlcjtcblx0XHR0aGlzLnJlYWRCdWZmZXIgPSB0aGlzLndyaXRlQnVmZmVyO1xuXHRcdHRoaXMud3JpdGVCdWZmZXIgPSB0bXA7XG5cblx0fVxuXG5cdGFkZFBhc3MoIHBhc3MgKSB7XG5cblx0XHR0aGlzLnBhc3Nlcy5wdXNoKCBwYXNzICk7XG5cdFx0cGFzcy5zZXRTaXplKCB0aGlzLl93aWR0aCAqIHRoaXMuX3BpeGVsUmF0aW8sIHRoaXMuX2hlaWdodCAqIHRoaXMuX3BpeGVsUmF0aW8gKTtcblxuXHR9XG5cblx0aW5zZXJ0UGFzcyggcGFzcywgaW5kZXggKSB7XG5cblx0XHR0aGlzLnBhc3Nlcy5zcGxpY2UoIGluZGV4LCAwLCBwYXNzICk7XG5cdFx0cGFzcy5zZXRTaXplKCB0aGlzLl93aWR0aCAqIHRoaXMuX3BpeGVsUmF0aW8sIHRoaXMuX2hlaWdodCAqIHRoaXMuX3BpeGVsUmF0aW8gKTtcblxuXHR9XG5cblx0cmVtb3ZlUGFzcyggcGFzcyApIHtcblxuXHRcdGNvbnN0IGluZGV4ID0gdGhpcy5wYXNzZXMuaW5kZXhPZiggcGFzcyApO1xuXG5cdFx0aWYgKCBpbmRleCAhPT0gLSAxICkge1xuXG5cdFx0XHR0aGlzLnBhc3Nlcy5zcGxpY2UoIGluZGV4LCAxICk7XG5cblx0XHR9XG5cblx0fVxuXG5cdGlzTGFzdEVuYWJsZWRQYXNzKCBwYXNzSW5kZXggKSB7XG5cblx0XHRmb3IgKCBsZXQgaSA9IHBhc3NJbmRleCArIDE7IGkgPCB0aGlzLnBhc3Nlcy5sZW5ndGg7IGkgKysgKSB7XG5cblx0XHRcdGlmICggdGhpcy5wYXNzZXNbIGkgXS5lbmFibGVkICkge1xuXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cblx0fVxuXG5cdHJlbmRlciggZGVsdGFUaW1lICkge1xuXG5cdFx0Ly8gZGVsdGFUaW1lIHZhbHVlIGlzIGluIHNlY29uZHNcblxuXHRcdGlmICggZGVsdGFUaW1lID09PSB1bmRlZmluZWQgKSB7XG5cblx0XHRcdGRlbHRhVGltZSA9IHRoaXMuY2xvY2suZ2V0RGVsdGEoKTtcblxuXHRcdH1cblxuXHRcdGNvbnN0IGN1cnJlbnRSZW5kZXJUYXJnZXQgPSB0aGlzLnJlbmRlcmVyLmdldFJlbmRlclRhcmdldCgpO1xuXG5cdFx0bGV0IG1hc2tBY3RpdmUgPSBmYWxzZTtcblxuXHRcdGZvciAoIGxldCBpID0gMCwgaWwgPSB0aGlzLnBhc3Nlcy5sZW5ndGg7IGkgPCBpbDsgaSArKyApIHtcblxuXHRcdFx0Y29uc3QgcGFzcyA9IHRoaXMucGFzc2VzWyBpIF07XG5cblx0XHRcdGlmICggcGFzcy5lbmFibGVkID09PSBmYWxzZSApIGNvbnRpbnVlO1xuXG5cdFx0XHRwYXNzLnJlbmRlclRvU2NyZWVuID0gKCB0aGlzLnJlbmRlclRvU2NyZWVuICYmIHRoaXMuaXNMYXN0RW5hYmxlZFBhc3MoIGkgKSApO1xuXHRcdFx0cGFzcy5yZW5kZXIoIHRoaXMucmVuZGVyZXIsIHRoaXMud3JpdGVCdWZmZXIsIHRoaXMucmVhZEJ1ZmZlciwgZGVsdGFUaW1lLCBtYXNrQWN0aXZlICk7XG5cblx0XHRcdGlmICggcGFzcy5uZWVkc1N3YXAgKSB7XG5cblx0XHRcdFx0aWYgKCBtYXNrQWN0aXZlICkge1xuXG5cdFx0XHRcdFx0Y29uc3QgY29udGV4dCA9IHRoaXMucmVuZGVyZXIuZ2V0Q29udGV4dCgpO1xuXHRcdFx0XHRcdGNvbnN0IHN0ZW5jaWwgPSB0aGlzLnJlbmRlcmVyLnN0YXRlLmJ1ZmZlcnMuc3RlbmNpbDtcblxuXHRcdFx0XHRcdC8vY29udGV4dC5zdGVuY2lsRnVuYyggY29udGV4dC5OT1RFUVVBTCwgMSwgMHhmZmZmZmZmZiApO1xuXHRcdFx0XHRcdHN0ZW5jaWwuc2V0RnVuYyggY29udGV4dC5OT1RFUVVBTCwgMSwgMHhmZmZmZmZmZiApO1xuXG5cdFx0XHRcdFx0dGhpcy5jb3B5UGFzcy5yZW5kZXIoIHRoaXMucmVuZGVyZXIsIHRoaXMud3JpdGVCdWZmZXIsIHRoaXMucmVhZEJ1ZmZlciwgZGVsdGFUaW1lICk7XG5cblx0XHRcdFx0XHQvL2NvbnRleHQuc3RlbmNpbEZ1bmMoIGNvbnRleHQuRVFVQUwsIDEsIDB4ZmZmZmZmZmYgKTtcblx0XHRcdFx0XHRzdGVuY2lsLnNldEZ1bmMoIGNvbnRleHQuRVFVQUwsIDEsIDB4ZmZmZmZmZmYgKTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpcy5zd2FwQnVmZmVycygpO1xuXG5cdFx0XHR9XG5cblx0XHRcdGlmICggTWFza1Bhc3MgIT09IHVuZGVmaW5lZCApIHtcblxuXHRcdFx0XHRpZiAoIHBhc3MgaW5zdGFuY2VvZiBNYXNrUGFzcyApIHtcblxuXHRcdFx0XHRcdG1hc2tBY3RpdmUgPSB0cnVlO1xuXG5cdFx0XHRcdH0gZWxzZSBpZiAoIHBhc3MgaW5zdGFuY2VvZiBDbGVhck1hc2tQYXNzICkge1xuXG5cdFx0XHRcdFx0bWFza0FjdGl2ZSA9IGZhbHNlO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0dGhpcy5yZW5kZXJlci5zZXRSZW5kZXJUYXJnZXQoIGN1cnJlbnRSZW5kZXJUYXJnZXQgKTtcblxuXHR9XG5cblx0cmVzZXQoIHJlbmRlclRhcmdldCApIHtcblxuXHRcdGlmICggcmVuZGVyVGFyZ2V0ID09PSB1bmRlZmluZWQgKSB7XG5cblx0XHRcdGNvbnN0IHNpemUgPSB0aGlzLnJlbmRlcmVyLmdldFNpemUoIG5ldyBWZWN0b3IyKCkgKTtcblx0XHRcdHRoaXMuX3BpeGVsUmF0aW8gPSB0aGlzLnJlbmRlcmVyLmdldFBpeGVsUmF0aW8oKTtcblx0XHRcdHRoaXMuX3dpZHRoID0gc2l6ZS53aWR0aDtcblx0XHRcdHRoaXMuX2hlaWdodCA9IHNpemUuaGVpZ2h0O1xuXG5cdFx0XHRyZW5kZXJUYXJnZXQgPSB0aGlzLnJlbmRlclRhcmdldDEuY2xvbmUoKTtcblx0XHRcdHJlbmRlclRhcmdldC5zZXRTaXplKCB0aGlzLl93aWR0aCAqIHRoaXMuX3BpeGVsUmF0aW8sIHRoaXMuX2hlaWdodCAqIHRoaXMuX3BpeGVsUmF0aW8gKTtcblxuXHRcdH1cblxuXHRcdHRoaXMucmVuZGVyVGFyZ2V0MS5kaXNwb3NlKCk7XG5cdFx0dGhpcy5yZW5kZXJUYXJnZXQyLmRpc3Bvc2UoKTtcblx0XHR0aGlzLnJlbmRlclRhcmdldDEgPSByZW5kZXJUYXJnZXQ7XG5cdFx0dGhpcy5yZW5kZXJUYXJnZXQyID0gcmVuZGVyVGFyZ2V0LmNsb25lKCk7XG5cblx0XHR0aGlzLndyaXRlQnVmZmVyID0gdGhpcy5yZW5kZXJUYXJnZXQxO1xuXHRcdHRoaXMucmVhZEJ1ZmZlciA9IHRoaXMucmVuZGVyVGFyZ2V0MjtcblxuXHR9XG5cblx0c2V0U2l6ZSggd2lkdGgsIGhlaWdodCApIHtcblxuXHRcdHRoaXMuX3dpZHRoID0gd2lkdGg7XG5cdFx0dGhpcy5faGVpZ2h0ID0gaGVpZ2h0O1xuXG5cdFx0Y29uc3QgZWZmZWN0aXZlV2lkdGggPSB0aGlzLl93aWR0aCAqIHRoaXMuX3BpeGVsUmF0aW87XG5cdFx0Y29uc3QgZWZmZWN0aXZlSGVpZ2h0ID0gdGhpcy5faGVpZ2h0ICogdGhpcy5fcGl4ZWxSYXRpbztcblxuXHRcdHRoaXMucmVuZGVyVGFyZ2V0MS5zZXRTaXplKCBlZmZlY3RpdmVXaWR0aCwgZWZmZWN0aXZlSGVpZ2h0ICk7XG5cdFx0dGhpcy5yZW5kZXJUYXJnZXQyLnNldFNpemUoIGVmZmVjdGl2ZVdpZHRoLCBlZmZlY3RpdmVIZWlnaHQgKTtcblxuXHRcdGZvciAoIGxldCBpID0gMDsgaSA8IHRoaXMucGFzc2VzLmxlbmd0aDsgaSArKyApIHtcblxuXHRcdFx0dGhpcy5wYXNzZXNbIGkgXS5zZXRTaXplKCBlZmZlY3RpdmVXaWR0aCwgZWZmZWN0aXZlSGVpZ2h0ICk7XG5cblx0XHR9XG5cblx0fVxuXG5cdHNldFBpeGVsUmF0aW8oIHBpeGVsUmF0aW8gKSB7XG5cblx0XHR0aGlzLl9waXhlbFJhdGlvID0gcGl4ZWxSYXRpbztcblxuXHRcdHRoaXMuc2V0U2l6ZSggdGhpcy5fd2lkdGgsIHRoaXMuX2hlaWdodCApO1xuXG5cdH1cblxufVxuXG5cbmNsYXNzIFBhc3Mge1xuXG5cdGNvbnN0cnVjdG9yKCkge1xuXG5cdFx0Ly8gaWYgc2V0IHRvIHRydWUsIHRoZSBwYXNzIGlzIHByb2Nlc3NlZCBieSB0aGUgY29tcG9zZXJcblx0XHR0aGlzLmVuYWJsZWQgPSB0cnVlO1xuXG5cdFx0Ly8gaWYgc2V0IHRvIHRydWUsIHRoZSBwYXNzIGluZGljYXRlcyB0byBzd2FwIHJlYWQgYW5kIHdyaXRlIGJ1ZmZlciBhZnRlciByZW5kZXJpbmdcblx0XHR0aGlzLm5lZWRzU3dhcCA9IHRydWU7XG5cblx0XHQvLyBpZiBzZXQgdG8gdHJ1ZSwgdGhlIHBhc3MgY2xlYXJzIGl0cyBidWZmZXIgYmVmb3JlIHJlbmRlcmluZ1xuXHRcdHRoaXMuY2xlYXIgPSBmYWxzZTtcblxuXHRcdC8vIGlmIHNldCB0byB0cnVlLCB0aGUgcmVzdWx0IG9mIHRoZSBwYXNzIGlzIHJlbmRlcmVkIHRvIHNjcmVlbi4gVGhpcyBpcyBzZXQgYXV0b21hdGljYWxseSBieSBFZmZlY3RDb21wb3Nlci5cblx0XHR0aGlzLnJlbmRlclRvU2NyZWVuID0gZmFsc2U7XG5cblx0fVxuXG5cdHNldFNpemUoIC8qIHdpZHRoLCBoZWlnaHQgKi8gKSB7fVxuXG5cdHJlbmRlciggLyogcmVuZGVyZXIsIHdyaXRlQnVmZmVyLCByZWFkQnVmZmVyLCBkZWx0YVRpbWUsIG1hc2tBY3RpdmUgKi8gKSB7XG5cblx0XHRjb25zb2xlLmVycm9yKCAnVEhSRUUuUGFzczogLnJlbmRlcigpIG11c3QgYmUgaW1wbGVtZW50ZWQgaW4gZGVyaXZlZCBwYXNzLicgKTtcblxuXHR9XG5cbn1cblxuLy8gSGVscGVyIGZvciBwYXNzZXMgdGhhdCBuZWVkIHRvIGZpbGwgdGhlIHZpZXdwb3J0IHdpdGggYSBzaW5nbGUgcXVhZC5cblxuY29uc3QgX2NhbWVyYSA9IG5ldyBPcnRob2dyYXBoaWNDYW1lcmEoIC0gMSwgMSwgMSwgLSAxLCAwLCAxICk7XG5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tcmRvb2IvdGhyZWUuanMvcHVsbC8yMTM1OFxuXG5jb25zdCBfZ2VvbWV0cnkgPSBuZXcgQnVmZmVyR2VvbWV0cnkoKTtcbl9nZW9tZXRyeS5zZXRBdHRyaWJ1dGUoICdwb3NpdGlvbicsIG5ldyBGbG9hdDMyQnVmZmVyQXR0cmlidXRlKCBbIC0gMSwgMywgMCwgLSAxLCAtIDEsIDAsIDMsIC0gMSwgMCBdLCAzICkgKTtcbl9nZW9tZXRyeS5zZXRBdHRyaWJ1dGUoICd1dicsIG5ldyBGbG9hdDMyQnVmZmVyQXR0cmlidXRlKCBbIDAsIDIsIDAsIDAsIDIsIDAgXSwgMiApICk7XG5cbmNsYXNzIEZ1bGxTY3JlZW5RdWFkIHtcblxuXHRjb25zdHJ1Y3RvciggbWF0ZXJpYWwgKSB7XG5cblx0XHR0aGlzLl9tZXNoID0gbmV3IE1lc2goIF9nZW9tZXRyeSwgbWF0ZXJpYWwgKTtcblxuXHR9XG5cblx0ZGlzcG9zZSgpIHtcblxuXHRcdHRoaXMuX21lc2guZ2VvbWV0cnkuZGlzcG9zZSgpO1xuXG5cdH1cblxuXHRyZW5kZXIoIHJlbmRlcmVyICkge1xuXG5cdFx0cmVuZGVyZXIucmVuZGVyKCB0aGlzLl9tZXNoLCBfY2FtZXJhICk7XG5cblx0fVxuXG5cdGdldCBtYXRlcmlhbCgpIHtcblxuXHRcdHJldHVybiB0aGlzLl9tZXNoLm1hdGVyaWFsO1xuXG5cdH1cblxuXHRzZXQgbWF0ZXJpYWwoIHZhbHVlICkge1xuXG5cdFx0dGhpcy5fbWVzaC5tYXRlcmlhbCA9IHZhbHVlO1xuXG5cdH1cblxufVxuXG5leHBvcnQgeyBFZmZlY3RDb21wb3NlciwgUGFzcywgRnVsbFNjcmVlblF1YWQgfTtcbiIsImltcG9ydCB7IFBhc3MgfSBmcm9tICcuLi9wb3N0cHJvY2Vzc2luZy9QYXNzLmpzJztcblxuY2xhc3MgTWFza1Bhc3MgZXh0ZW5kcyBQYXNzIHtcblxuXHRjb25zdHJ1Y3Rvciggc2NlbmUsIGNhbWVyYSApIHtcblxuXHRcdHN1cGVyKCk7XG5cblx0XHR0aGlzLnNjZW5lID0gc2NlbmU7XG5cdFx0dGhpcy5jYW1lcmEgPSBjYW1lcmE7XG5cblx0XHR0aGlzLmNsZWFyID0gdHJ1ZTtcblx0XHR0aGlzLm5lZWRzU3dhcCA9IGZhbHNlO1xuXG5cdFx0dGhpcy5pbnZlcnNlID0gZmFsc2U7XG5cblx0fVxuXG5cdHJlbmRlciggcmVuZGVyZXIsIHdyaXRlQnVmZmVyLCByZWFkQnVmZmVyIC8qLCBkZWx0YVRpbWUsIG1hc2tBY3RpdmUgKi8gKSB7XG5cblx0XHRjb25zdCBjb250ZXh0ID0gcmVuZGVyZXIuZ2V0Q29udGV4dCgpO1xuXHRcdGNvbnN0IHN0YXRlID0gcmVuZGVyZXIuc3RhdGU7XG5cblx0XHQvLyBkb24ndCB1cGRhdGUgY29sb3Igb3IgZGVwdGhcblxuXHRcdHN0YXRlLmJ1ZmZlcnMuY29sb3Iuc2V0TWFzayggZmFsc2UgKTtcblx0XHRzdGF0ZS5idWZmZXJzLmRlcHRoLnNldE1hc2soIGZhbHNlICk7XG5cblx0XHQvLyBsb2NrIGJ1ZmZlcnNcblxuXHRcdHN0YXRlLmJ1ZmZlcnMuY29sb3Iuc2V0TG9ja2VkKCB0cnVlICk7XG5cdFx0c3RhdGUuYnVmZmVycy5kZXB0aC5zZXRMb2NrZWQoIHRydWUgKTtcblxuXHRcdC8vIHNldCB1cCBzdGVuY2lsXG5cblx0XHRsZXQgd3JpdGVWYWx1ZSwgY2xlYXJWYWx1ZTtcblxuXHRcdGlmICggdGhpcy5pbnZlcnNlICkge1xuXG5cdFx0XHR3cml0ZVZhbHVlID0gMDtcblx0XHRcdGNsZWFyVmFsdWUgPSAxO1xuXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0d3JpdGVWYWx1ZSA9IDE7XG5cdFx0XHRjbGVhclZhbHVlID0gMDtcblxuXHRcdH1cblxuXHRcdHN0YXRlLmJ1ZmZlcnMuc3RlbmNpbC5zZXRUZXN0KCB0cnVlICk7XG5cdFx0c3RhdGUuYnVmZmVycy5zdGVuY2lsLnNldE9wKCBjb250ZXh0LlJFUExBQ0UsIGNvbnRleHQuUkVQTEFDRSwgY29udGV4dC5SRVBMQUNFICk7XG5cdFx0c3RhdGUuYnVmZmVycy5zdGVuY2lsLnNldEZ1bmMoIGNvbnRleHQuQUxXQVlTLCB3cml0ZVZhbHVlLCAweGZmZmZmZmZmICk7XG5cdFx0c3RhdGUuYnVmZmVycy5zdGVuY2lsLnNldENsZWFyKCBjbGVhclZhbHVlICk7XG5cdFx0c3RhdGUuYnVmZmVycy5zdGVuY2lsLnNldExvY2tlZCggdHJ1ZSApO1xuXG5cdFx0Ly8gZHJhdyBpbnRvIHRoZSBzdGVuY2lsIGJ1ZmZlclxuXG5cdFx0cmVuZGVyZXIuc2V0UmVuZGVyVGFyZ2V0KCByZWFkQnVmZmVyICk7XG5cdFx0aWYgKCB0aGlzLmNsZWFyICkgcmVuZGVyZXIuY2xlYXIoKTtcblx0XHRyZW5kZXJlci5yZW5kZXIoIHRoaXMuc2NlbmUsIHRoaXMuY2FtZXJhICk7XG5cblx0XHRyZW5kZXJlci5zZXRSZW5kZXJUYXJnZXQoIHdyaXRlQnVmZmVyICk7XG5cdFx0aWYgKCB0aGlzLmNsZWFyICkgcmVuZGVyZXIuY2xlYXIoKTtcblx0XHRyZW5kZXJlci5yZW5kZXIoIHRoaXMuc2NlbmUsIHRoaXMuY2FtZXJhICk7XG5cblx0XHQvLyB1bmxvY2sgY29sb3IgYW5kIGRlcHRoIGJ1ZmZlciBmb3Igc3Vic2VxdWVudCByZW5kZXJpbmdcblxuXHRcdHN0YXRlLmJ1ZmZlcnMuY29sb3Iuc2V0TG9ja2VkKCBmYWxzZSApO1xuXHRcdHN0YXRlLmJ1ZmZlcnMuZGVwdGguc2V0TG9ja2VkKCBmYWxzZSApO1xuXG5cdFx0Ly8gb25seSByZW5kZXIgd2hlcmUgc3RlbmNpbCBpcyBzZXQgdG8gMVxuXG5cdFx0c3RhdGUuYnVmZmVycy5zdGVuY2lsLnNldExvY2tlZCggZmFsc2UgKTtcblx0XHRzdGF0ZS5idWZmZXJzLnN0ZW5jaWwuc2V0RnVuYyggY29udGV4dC5FUVVBTCwgMSwgMHhmZmZmZmZmZiApOyAvLyBkcmF3IGlmID09IDFcblx0XHRzdGF0ZS5idWZmZXJzLnN0ZW5jaWwuc2V0T3AoIGNvbnRleHQuS0VFUCwgY29udGV4dC5LRUVQLCBjb250ZXh0LktFRVAgKTtcblx0XHRzdGF0ZS5idWZmZXJzLnN0ZW5jaWwuc2V0TG9ja2VkKCB0cnVlICk7XG5cblx0fVxuXG59XG5cbmNsYXNzIENsZWFyTWFza1Bhc3MgZXh0ZW5kcyBQYXNzIHtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblxuXHRcdHN1cGVyKCk7XG5cblx0XHR0aGlzLm5lZWRzU3dhcCA9IGZhbHNlO1xuXG5cdH1cblxuXHRyZW5kZXIoIHJlbmRlcmVyIC8qLCB3cml0ZUJ1ZmZlciwgcmVhZEJ1ZmZlciwgZGVsdGFUaW1lLCBtYXNrQWN0aXZlICovICkge1xuXG5cdFx0cmVuZGVyZXIuc3RhdGUuYnVmZmVycy5zdGVuY2lsLnNldExvY2tlZCggZmFsc2UgKTtcblx0XHRyZW5kZXJlci5zdGF0ZS5idWZmZXJzLnN0ZW5jaWwuc2V0VGVzdCggZmFsc2UgKTtcblxuXHR9XG5cbn1cblxuZXhwb3J0IHsgTWFza1Bhc3MsIENsZWFyTWFza1Bhc3MgfTtcbiIsImltcG9ydCB7XG5cdEJ1ZmZlckdlb21ldHJ5LFxuXHRGbG9hdDMyQnVmZmVyQXR0cmlidXRlLFxuXHRPcnRob2dyYXBoaWNDYW1lcmEsXG5cdE1lc2hcbn0gZnJvbSAndGhyZWUnO1xuXG5jbGFzcyBQYXNzIHtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblxuXHRcdC8vIGlmIHNldCB0byB0cnVlLCB0aGUgcGFzcyBpcyBwcm9jZXNzZWQgYnkgdGhlIGNvbXBvc2VyXG5cdFx0dGhpcy5lbmFibGVkID0gdHJ1ZTtcblxuXHRcdC8vIGlmIHNldCB0byB0cnVlLCB0aGUgcGFzcyBpbmRpY2F0ZXMgdG8gc3dhcCByZWFkIGFuZCB3cml0ZSBidWZmZXIgYWZ0ZXIgcmVuZGVyaW5nXG5cdFx0dGhpcy5uZWVkc1N3YXAgPSB0cnVlO1xuXG5cdFx0Ly8gaWYgc2V0IHRvIHRydWUsIHRoZSBwYXNzIGNsZWFycyBpdHMgYnVmZmVyIGJlZm9yZSByZW5kZXJpbmdcblx0XHR0aGlzLmNsZWFyID0gZmFsc2U7XG5cblx0XHQvLyBpZiBzZXQgdG8gdHJ1ZSwgdGhlIHJlc3VsdCBvZiB0aGUgcGFzcyBpcyByZW5kZXJlZCB0byBzY3JlZW4uIFRoaXMgaXMgc2V0IGF1dG9tYXRpY2FsbHkgYnkgRWZmZWN0Q29tcG9zZXIuXG5cdFx0dGhpcy5yZW5kZXJUb1NjcmVlbiA9IGZhbHNlO1xuXG5cdH1cblxuXHRzZXRTaXplKCAvKiB3aWR0aCwgaGVpZ2h0ICovICkge31cblxuXHRyZW5kZXIoIC8qIHJlbmRlcmVyLCB3cml0ZUJ1ZmZlciwgcmVhZEJ1ZmZlciwgZGVsdGFUaW1lLCBtYXNrQWN0aXZlICovICkge1xuXG5cdFx0Y29uc29sZS5lcnJvciggJ1RIUkVFLlBhc3M6IC5yZW5kZXIoKSBtdXN0IGJlIGltcGxlbWVudGVkIGluIGRlcml2ZWQgcGFzcy4nICk7XG5cblx0fVxuXG59XG5cbi8vIEhlbHBlciBmb3IgcGFzc2VzIHRoYXQgbmVlZCB0byBmaWxsIHRoZSB2aWV3cG9ydCB3aXRoIGEgc2luZ2xlIHF1YWQuXG5cbmNvbnN0IF9jYW1lcmEgPSBuZXcgT3J0aG9ncmFwaGljQ2FtZXJhKCAtIDEsIDEsIDEsIC0gMSwgMCwgMSApO1xuXG4vLyBodHRwczovL2dpdGh1Yi5jb20vbXJkb29iL3RocmVlLmpzL3B1bGwvMjEzNThcblxuY29uc3QgX2dlb21ldHJ5ID0gbmV3IEJ1ZmZlckdlb21ldHJ5KCk7XG5fZ2VvbWV0cnkuc2V0QXR0cmlidXRlKCAncG9zaXRpb24nLCBuZXcgRmxvYXQzMkJ1ZmZlckF0dHJpYnV0ZSggWyAtIDEsIDMsIDAsIC0gMSwgLSAxLCAwLCAzLCAtIDEsIDAgXSwgMyApICk7XG5fZ2VvbWV0cnkuc2V0QXR0cmlidXRlKCAndXYnLCBuZXcgRmxvYXQzMkJ1ZmZlckF0dHJpYnV0ZSggWyAwLCAyLCAwLCAwLCAyLCAwIF0sIDIgKSApO1xuXG5jbGFzcyBGdWxsU2NyZWVuUXVhZCB7XG5cblx0Y29uc3RydWN0b3IoIG1hdGVyaWFsICkge1xuXG5cdFx0dGhpcy5fbWVzaCA9IG5ldyBNZXNoKCBfZ2VvbWV0cnksIG1hdGVyaWFsICk7XG5cblx0fVxuXG5cdGRpc3Bvc2UoKSB7XG5cblx0XHR0aGlzLl9tZXNoLmdlb21ldHJ5LmRpc3Bvc2UoKTtcblxuXHR9XG5cblx0cmVuZGVyKCByZW5kZXJlciApIHtcblxuXHRcdHJlbmRlcmVyLnJlbmRlciggdGhpcy5fbWVzaCwgX2NhbWVyYSApO1xuXG5cdH1cblxuXHRnZXQgbWF0ZXJpYWwoKSB7XG5cblx0XHRyZXR1cm4gdGhpcy5fbWVzaC5tYXRlcmlhbDtcblxuXHR9XG5cblx0c2V0IG1hdGVyaWFsKCB2YWx1ZSApIHtcblxuXHRcdHRoaXMuX21lc2gubWF0ZXJpYWwgPSB2YWx1ZTtcblxuXHR9XG5cbn1cblxuZXhwb3J0IHsgUGFzcywgRnVsbFNjcmVlblF1YWQgfTtcbiIsImltcG9ydCB7XG5cdENvbG9yXG59IGZyb20gJ3RocmVlJztcbmltcG9ydCB7IFBhc3MgfSBmcm9tICcuLi9wb3N0cHJvY2Vzc2luZy9QYXNzLmpzJztcblxuY2xhc3MgUmVuZGVyUGFzcyBleHRlbmRzIFBhc3Mge1xuXG5cdGNvbnN0cnVjdG9yKCBzY2VuZSwgY2FtZXJhLCBvdmVycmlkZU1hdGVyaWFsLCBjbGVhckNvbG9yLCBjbGVhckFscGhhICkge1xuXG5cdFx0c3VwZXIoKTtcblxuXHRcdHRoaXMuc2NlbmUgPSBzY2VuZTtcblx0XHR0aGlzLmNhbWVyYSA9IGNhbWVyYTtcblxuXHRcdHRoaXMub3ZlcnJpZGVNYXRlcmlhbCA9IG92ZXJyaWRlTWF0ZXJpYWw7XG5cblx0XHR0aGlzLmNsZWFyQ29sb3IgPSBjbGVhckNvbG9yO1xuXHRcdHRoaXMuY2xlYXJBbHBoYSA9ICggY2xlYXJBbHBoYSAhPT0gdW5kZWZpbmVkICkgPyBjbGVhckFscGhhIDogMDtcblxuXHRcdHRoaXMuY2xlYXIgPSB0cnVlO1xuXHRcdHRoaXMuY2xlYXJEZXB0aCA9IGZhbHNlO1xuXHRcdHRoaXMubmVlZHNTd2FwID0gZmFsc2U7XG5cdFx0dGhpcy5fb2xkQ2xlYXJDb2xvciA9IG5ldyBDb2xvcigpO1xuXG5cdH1cblxuXHRyZW5kZXIoIHJlbmRlcmVyLCB3cml0ZUJ1ZmZlciwgcmVhZEJ1ZmZlciAvKiwgZGVsdGFUaW1lLCBtYXNrQWN0aXZlICovICkge1xuXG5cdFx0Y29uc3Qgb2xkQXV0b0NsZWFyID0gcmVuZGVyZXIuYXV0b0NsZWFyO1xuXHRcdHJlbmRlcmVyLmF1dG9DbGVhciA9IGZhbHNlO1xuXG5cdFx0bGV0IG9sZENsZWFyQWxwaGEsIG9sZE92ZXJyaWRlTWF0ZXJpYWw7XG5cblx0XHRpZiAoIHRoaXMub3ZlcnJpZGVNYXRlcmlhbCAhPT0gdW5kZWZpbmVkICkge1xuXG5cdFx0XHRvbGRPdmVycmlkZU1hdGVyaWFsID0gdGhpcy5zY2VuZS5vdmVycmlkZU1hdGVyaWFsO1xuXG5cdFx0XHR0aGlzLnNjZW5lLm92ZXJyaWRlTWF0ZXJpYWwgPSB0aGlzLm92ZXJyaWRlTWF0ZXJpYWw7XG5cblx0XHR9XG5cblx0XHRpZiAoIHRoaXMuY2xlYXJDb2xvciApIHtcblxuXHRcdFx0cmVuZGVyZXIuZ2V0Q2xlYXJDb2xvciggdGhpcy5fb2xkQ2xlYXJDb2xvciApO1xuXHRcdFx0b2xkQ2xlYXJBbHBoYSA9IHJlbmRlcmVyLmdldENsZWFyQWxwaGEoKTtcblxuXHRcdFx0cmVuZGVyZXIuc2V0Q2xlYXJDb2xvciggdGhpcy5jbGVhckNvbG9yLCB0aGlzLmNsZWFyQWxwaGEgKTtcblxuXHRcdH1cblxuXHRcdGlmICggdGhpcy5jbGVhckRlcHRoICkge1xuXG5cdFx0XHRyZW5kZXJlci5jbGVhckRlcHRoKCk7XG5cblx0XHR9XG5cblx0XHRyZW5kZXJlci5zZXRSZW5kZXJUYXJnZXQoIHRoaXMucmVuZGVyVG9TY3JlZW4gPyBudWxsIDogcmVhZEJ1ZmZlciApO1xuXG5cdFx0Ly8gVE9ETzogQXZvaWQgdXNpbmcgYXV0b0NsZWFyIHByb3BlcnRpZXMsIHNlZSBodHRwczovL2dpdGh1Yi5jb20vbXJkb29iL3RocmVlLmpzL3B1bGwvMTU1NzEjaXNzdWVjb21tZW50LTQ2NTY2OTYwMFxuXHRcdGlmICggdGhpcy5jbGVhciApIHJlbmRlcmVyLmNsZWFyKCByZW5kZXJlci5hdXRvQ2xlYXJDb2xvciwgcmVuZGVyZXIuYXV0b0NsZWFyRGVwdGgsIHJlbmRlcmVyLmF1dG9DbGVhclN0ZW5jaWwgKTtcblx0XHRyZW5kZXJlci5yZW5kZXIoIHRoaXMuc2NlbmUsIHRoaXMuY2FtZXJhICk7XG5cblx0XHRpZiAoIHRoaXMuY2xlYXJDb2xvciApIHtcblxuXHRcdFx0cmVuZGVyZXIuc2V0Q2xlYXJDb2xvciggdGhpcy5fb2xkQ2xlYXJDb2xvciwgb2xkQ2xlYXJBbHBoYSApO1xuXG5cdFx0fVxuXG5cdFx0aWYgKCB0aGlzLm92ZXJyaWRlTWF0ZXJpYWwgIT09IHVuZGVmaW5lZCApIHtcblxuXHRcdFx0dGhpcy5zY2VuZS5vdmVycmlkZU1hdGVyaWFsID0gb2xkT3ZlcnJpZGVNYXRlcmlhbDtcblxuXHRcdH1cblxuXHRcdHJlbmRlcmVyLmF1dG9DbGVhciA9IG9sZEF1dG9DbGVhcjtcblxuXHR9XG5cbn1cblxuZXhwb3J0IHsgUmVuZGVyUGFzcyB9O1xuIiwiaW1wb3J0IHtcblx0U2hhZGVyTWF0ZXJpYWwsXG5cdFVuaWZvcm1zVXRpbHNcbn0gZnJvbSAndGhyZWUnO1xuaW1wb3J0IHsgUGFzcywgRnVsbFNjcmVlblF1YWQgfSBmcm9tICcuLi9wb3N0cHJvY2Vzc2luZy9QYXNzLmpzJztcblxuY2xhc3MgU2hhZGVyUGFzcyBleHRlbmRzIFBhc3Mge1xuXG5cdGNvbnN0cnVjdG9yKCBzaGFkZXIsIHRleHR1cmVJRCApIHtcblxuXHRcdHN1cGVyKCk7XG5cblx0XHR0aGlzLnRleHR1cmVJRCA9ICggdGV4dHVyZUlEICE9PSB1bmRlZmluZWQgKSA/IHRleHR1cmVJRCA6ICd0RGlmZnVzZSc7XG5cblx0XHRpZiAoIHNoYWRlciBpbnN0YW5jZW9mIFNoYWRlck1hdGVyaWFsICkge1xuXG5cdFx0XHR0aGlzLnVuaWZvcm1zID0gc2hhZGVyLnVuaWZvcm1zO1xuXG5cdFx0XHR0aGlzLm1hdGVyaWFsID0gc2hhZGVyO1xuXG5cdFx0fSBlbHNlIGlmICggc2hhZGVyICkge1xuXG5cdFx0XHR0aGlzLnVuaWZvcm1zID0gVW5pZm9ybXNVdGlscy5jbG9uZSggc2hhZGVyLnVuaWZvcm1zICk7XG5cblx0XHRcdHRoaXMubWF0ZXJpYWwgPSBuZXcgU2hhZGVyTWF0ZXJpYWwoIHtcblxuXHRcdFx0XHRkZWZpbmVzOiBPYmplY3QuYXNzaWduKCB7fSwgc2hhZGVyLmRlZmluZXMgKSxcblx0XHRcdFx0dW5pZm9ybXM6IHRoaXMudW5pZm9ybXMsXG5cdFx0XHRcdHZlcnRleFNoYWRlcjogc2hhZGVyLnZlcnRleFNoYWRlcixcblx0XHRcdFx0ZnJhZ21lbnRTaGFkZXI6IHNoYWRlci5mcmFnbWVudFNoYWRlclxuXG5cdFx0XHR9ICk7XG5cblx0XHR9XG5cblx0XHR0aGlzLmZzUXVhZCA9IG5ldyBGdWxsU2NyZWVuUXVhZCggdGhpcy5tYXRlcmlhbCApO1xuXG5cdH1cblxuXHRyZW5kZXIoIHJlbmRlcmVyLCB3cml0ZUJ1ZmZlciwgcmVhZEJ1ZmZlciAvKiwgZGVsdGFUaW1lLCBtYXNrQWN0aXZlICovICkge1xuXG5cdFx0aWYgKCB0aGlzLnVuaWZvcm1zWyB0aGlzLnRleHR1cmVJRCBdICkge1xuXG5cdFx0XHR0aGlzLnVuaWZvcm1zWyB0aGlzLnRleHR1cmVJRCBdLnZhbHVlID0gcmVhZEJ1ZmZlci50ZXh0dXJlO1xuXG5cdFx0fVxuXG5cdFx0dGhpcy5mc1F1YWQubWF0ZXJpYWwgPSB0aGlzLm1hdGVyaWFsO1xuXG5cdFx0aWYgKCB0aGlzLnJlbmRlclRvU2NyZWVuICkge1xuXG5cdFx0XHRyZW5kZXJlci5zZXRSZW5kZXJUYXJnZXQoIG51bGwgKTtcblx0XHRcdHRoaXMuZnNRdWFkLnJlbmRlciggcmVuZGVyZXIgKTtcblxuXHRcdH0gZWxzZSB7XG5cblx0XHRcdHJlbmRlcmVyLnNldFJlbmRlclRhcmdldCggd3JpdGVCdWZmZXIgKTtcblx0XHRcdC8vIFRPRE86IEF2b2lkIHVzaW5nIGF1dG9DbGVhciBwcm9wZXJ0aWVzLCBzZWUgaHR0cHM6Ly9naXRodWIuY29tL21yZG9vYi90aHJlZS5qcy9wdWxsLzE1NTcxI2lzc3VlY29tbWVudC00NjU2Njk2MDBcblx0XHRcdGlmICggdGhpcy5jbGVhciApIHJlbmRlcmVyLmNsZWFyKCByZW5kZXJlci5hdXRvQ2xlYXJDb2xvciwgcmVuZGVyZXIuYXV0b0NsZWFyRGVwdGgsIHJlbmRlcmVyLmF1dG9DbGVhclN0ZW5jaWwgKTtcblx0XHRcdHRoaXMuZnNRdWFkLnJlbmRlciggcmVuZGVyZXIgKTtcblxuXHRcdH1cblxuXHR9XG5cbn1cblxuZXhwb3J0IHsgU2hhZGVyUGFzcyB9O1xuIiwiaW1wb3J0IHtcblx0QWRkaXRpdmVCbGVuZGluZyxcblx0Q29sb3IsXG5cdExpbmVhckZpbHRlcixcblx0TWVzaEJhc2ljTWF0ZXJpYWwsXG5cdFJHQkFGb3JtYXQsXG5cdFNoYWRlck1hdGVyaWFsLFxuXHRVbmlmb3Jtc1V0aWxzLFxuXHRWZWN0b3IyLFxuXHRWZWN0b3IzLFxuXHRXZWJHTFJlbmRlclRhcmdldFxufSBmcm9tICd0aHJlZSc7XG5pbXBvcnQgeyBQYXNzLCBGdWxsU2NyZWVuUXVhZCB9IGZyb20gJy4uL3Bvc3Rwcm9jZXNzaW5nL1Bhc3MuanMnO1xuaW1wb3J0IHsgQ29weVNoYWRlciB9IGZyb20gJy4uL3NoYWRlcnMvQ29weVNoYWRlci5qcyc7XG5pbXBvcnQgeyBMdW1pbm9zaXR5SGlnaFBhc3NTaGFkZXIgfSBmcm9tICcuLi9zaGFkZXJzL0x1bWlub3NpdHlIaWdoUGFzc1NoYWRlci5qcyc7XG5cbi8qKlxuICogVW5yZWFsQmxvb21QYXNzIGlzIGluc3BpcmVkIGJ5IHRoZSBibG9vbSBwYXNzIG9mIFVucmVhbCBFbmdpbmUuIEl0IGNyZWF0ZXMgYVxuICogbWlwIG1hcCBjaGFpbiBvZiBibG9vbSB0ZXh0dXJlcyBhbmQgYmx1cnMgdGhlbSB3aXRoIGRpZmZlcmVudCByYWRpaS4gQmVjYXVzZVxuICogb2YgdGhlIHdlaWdodGVkIGNvbWJpbmF0aW9uIG9mIG1pcHMsIGFuZCBiZWNhdXNlIGxhcmdlciBibHVycyBhcmUgZG9uZSBvblxuICogaGlnaGVyIG1pcHMsIHRoaXMgZWZmZWN0IHByb3ZpZGVzIGdvb2QgcXVhbGl0eSBhbmQgcGVyZm9ybWFuY2UuXG4gKlxuICogUmVmZXJlbmNlOlxuICogLSBodHRwczovL2RvY3MudW5yZWFsZW5naW5lLmNvbS9sYXRlc3QvSU5UL0VuZ2luZS9SZW5kZXJpbmcvUG9zdFByb2Nlc3NFZmZlY3RzL0Jsb29tL1xuICovXG5jbGFzcyBVbnJlYWxCbG9vbVBhc3MgZXh0ZW5kcyBQYXNzIHtcblxuXHRjb25zdHJ1Y3RvciggcmVzb2x1dGlvbiwgc3RyZW5ndGgsIHJhZGl1cywgdGhyZXNob2xkICkge1xuXG5cdFx0c3VwZXIoKTtcblxuXHRcdHRoaXMuc3RyZW5ndGggPSAoIHN0cmVuZ3RoICE9PSB1bmRlZmluZWQgKSA/IHN0cmVuZ3RoIDogMTtcblx0XHR0aGlzLnJhZGl1cyA9IHJhZGl1cztcblx0XHR0aGlzLnRocmVzaG9sZCA9IHRocmVzaG9sZDtcblx0XHR0aGlzLnJlc29sdXRpb24gPSAoIHJlc29sdXRpb24gIT09IHVuZGVmaW5lZCApID8gbmV3IFZlY3RvcjIoIHJlc29sdXRpb24ueCwgcmVzb2x1dGlvbi55ICkgOiBuZXcgVmVjdG9yMiggMjU2LCAyNTYgKTtcblxuXHRcdC8vIGNyZWF0ZSBjb2xvciBvbmx5IG9uY2UgaGVyZSwgcmV1c2UgaXQgbGF0ZXIgaW5zaWRlIHRoZSByZW5kZXIgZnVuY3Rpb25cblx0XHR0aGlzLmNsZWFyQ29sb3IgPSBuZXcgQ29sb3IoIDAsIDAsIDAgKTtcblxuXHRcdC8vIHJlbmRlciB0YXJnZXRzXG5cdFx0Y29uc3QgcGFycyA9IHsgbWluRmlsdGVyOiBMaW5lYXJGaWx0ZXIsIG1hZ0ZpbHRlcjogTGluZWFyRmlsdGVyLCBmb3JtYXQ6IFJHQkFGb3JtYXQgfTtcblx0XHR0aGlzLnJlbmRlclRhcmdldHNIb3Jpem9udGFsID0gW107XG5cdFx0dGhpcy5yZW5kZXJUYXJnZXRzVmVydGljYWwgPSBbXTtcblx0XHR0aGlzLm5NaXBzID0gNTtcblx0XHRsZXQgcmVzeCA9IE1hdGgucm91bmQoIHRoaXMucmVzb2x1dGlvbi54IC8gMiApO1xuXHRcdGxldCByZXN5ID0gTWF0aC5yb3VuZCggdGhpcy5yZXNvbHV0aW9uLnkgLyAyICk7XG5cblx0XHR0aGlzLnJlbmRlclRhcmdldEJyaWdodCA9IG5ldyBXZWJHTFJlbmRlclRhcmdldCggcmVzeCwgcmVzeSwgcGFycyApO1xuXHRcdHRoaXMucmVuZGVyVGFyZ2V0QnJpZ2h0LnRleHR1cmUubmFtZSA9ICdVbnJlYWxCbG9vbVBhc3MuYnJpZ2h0Jztcblx0XHR0aGlzLnJlbmRlclRhcmdldEJyaWdodC50ZXh0dXJlLmdlbmVyYXRlTWlwbWFwcyA9IGZhbHNlO1xuXG5cdFx0Zm9yICggbGV0IGkgPSAwOyBpIDwgdGhpcy5uTWlwczsgaSArKyApIHtcblxuXHRcdFx0Y29uc3QgcmVuZGVyVGFyZ2V0SG9yaXpvbmFsID0gbmV3IFdlYkdMUmVuZGVyVGFyZ2V0KCByZXN4LCByZXN5LCBwYXJzICk7XG5cblx0XHRcdHJlbmRlclRhcmdldEhvcml6b25hbC50ZXh0dXJlLm5hbWUgPSAnVW5yZWFsQmxvb21QYXNzLmgnICsgaTtcblx0XHRcdHJlbmRlclRhcmdldEhvcml6b25hbC50ZXh0dXJlLmdlbmVyYXRlTWlwbWFwcyA9IGZhbHNlO1xuXG5cdFx0XHR0aGlzLnJlbmRlclRhcmdldHNIb3Jpem9udGFsLnB1c2goIHJlbmRlclRhcmdldEhvcml6b25hbCApO1xuXG5cdFx0XHRjb25zdCByZW5kZXJUYXJnZXRWZXJ0aWNhbCA9IG5ldyBXZWJHTFJlbmRlclRhcmdldCggcmVzeCwgcmVzeSwgcGFycyApO1xuXG5cdFx0XHRyZW5kZXJUYXJnZXRWZXJ0aWNhbC50ZXh0dXJlLm5hbWUgPSAnVW5yZWFsQmxvb21QYXNzLnYnICsgaTtcblx0XHRcdHJlbmRlclRhcmdldFZlcnRpY2FsLnRleHR1cmUuZ2VuZXJhdGVNaXBtYXBzID0gZmFsc2U7XG5cblx0XHRcdHRoaXMucmVuZGVyVGFyZ2V0c1ZlcnRpY2FsLnB1c2goIHJlbmRlclRhcmdldFZlcnRpY2FsICk7XG5cblx0XHRcdHJlc3ggPSBNYXRoLnJvdW5kKCByZXN4IC8gMiApO1xuXG5cdFx0XHRyZXN5ID0gTWF0aC5yb3VuZCggcmVzeSAvIDIgKTtcblxuXHRcdH1cblxuXHRcdC8vIGx1bWlub3NpdHkgaGlnaCBwYXNzIG1hdGVyaWFsXG5cblx0XHRpZiAoIEx1bWlub3NpdHlIaWdoUGFzc1NoYWRlciA9PT0gdW5kZWZpbmVkIClcblx0XHRcdGNvbnNvbGUuZXJyb3IoICdUSFJFRS5VbnJlYWxCbG9vbVBhc3MgcmVsaWVzIG9uIEx1bWlub3NpdHlIaWdoUGFzc1NoYWRlcicgKTtcblxuXHRcdGNvbnN0IGhpZ2hQYXNzU2hhZGVyID0gTHVtaW5vc2l0eUhpZ2hQYXNzU2hhZGVyO1xuXHRcdHRoaXMuaGlnaFBhc3NVbmlmb3JtcyA9IFVuaWZvcm1zVXRpbHMuY2xvbmUoIGhpZ2hQYXNzU2hhZGVyLnVuaWZvcm1zICk7XG5cblx0XHR0aGlzLmhpZ2hQYXNzVW5pZm9ybXNbICdsdW1pbm9zaXR5VGhyZXNob2xkJyBdLnZhbHVlID0gdGhyZXNob2xkO1xuXHRcdHRoaXMuaGlnaFBhc3NVbmlmb3Jtc1sgJ3Ntb290aFdpZHRoJyBdLnZhbHVlID0gMC4wMTtcblxuXHRcdHRoaXMubWF0ZXJpYWxIaWdoUGFzc0ZpbHRlciA9IG5ldyBTaGFkZXJNYXRlcmlhbCgge1xuXHRcdFx0dW5pZm9ybXM6IHRoaXMuaGlnaFBhc3NVbmlmb3Jtcyxcblx0XHRcdHZlcnRleFNoYWRlcjogaGlnaFBhc3NTaGFkZXIudmVydGV4U2hhZGVyLFxuXHRcdFx0ZnJhZ21lbnRTaGFkZXI6IGhpZ2hQYXNzU2hhZGVyLmZyYWdtZW50U2hhZGVyLFxuXHRcdFx0ZGVmaW5lczoge31cblx0XHR9ICk7XG5cblx0XHQvLyBHYXVzc2lhbiBCbHVyIE1hdGVyaWFsc1xuXHRcdHRoaXMuc2VwYXJhYmxlQmx1ck1hdGVyaWFscyA9IFtdO1xuXHRcdGNvbnN0IGtlcm5lbFNpemVBcnJheSA9IFsgMywgNSwgNywgOSwgMTEgXTtcblx0XHRyZXN4ID0gTWF0aC5yb3VuZCggdGhpcy5yZXNvbHV0aW9uLnggLyAyICk7XG5cdFx0cmVzeSA9IE1hdGgucm91bmQoIHRoaXMucmVzb2x1dGlvbi55IC8gMiApO1xuXG5cdFx0Zm9yICggbGV0IGkgPSAwOyBpIDwgdGhpcy5uTWlwczsgaSArKyApIHtcblxuXHRcdFx0dGhpcy5zZXBhcmFibGVCbHVyTWF0ZXJpYWxzLnB1c2goIHRoaXMuZ2V0U2VwZXJhYmxlQmx1ck1hdGVyaWFsKCBrZXJuZWxTaXplQXJyYXlbIGkgXSApICk7XG5cblx0XHRcdHRoaXMuc2VwYXJhYmxlQmx1ck1hdGVyaWFsc1sgaSBdLnVuaWZvcm1zWyAndGV4U2l6ZScgXS52YWx1ZSA9IG5ldyBWZWN0b3IyKCByZXN4LCByZXN5ICk7XG5cblx0XHRcdHJlc3ggPSBNYXRoLnJvdW5kKCByZXN4IC8gMiApO1xuXG5cdFx0XHRyZXN5ID0gTWF0aC5yb3VuZCggcmVzeSAvIDIgKTtcblxuXHRcdH1cblxuXHRcdC8vIENvbXBvc2l0ZSBtYXRlcmlhbFxuXHRcdHRoaXMuY29tcG9zaXRlTWF0ZXJpYWwgPSB0aGlzLmdldENvbXBvc2l0ZU1hdGVyaWFsKCB0aGlzLm5NaXBzICk7XG5cdFx0dGhpcy5jb21wb3NpdGVNYXRlcmlhbC51bmlmb3Jtc1sgJ2JsdXJUZXh0dXJlMScgXS52YWx1ZSA9IHRoaXMucmVuZGVyVGFyZ2V0c1ZlcnRpY2FsWyAwIF0udGV4dHVyZTtcblx0XHR0aGlzLmNvbXBvc2l0ZU1hdGVyaWFsLnVuaWZvcm1zWyAnYmx1clRleHR1cmUyJyBdLnZhbHVlID0gdGhpcy5yZW5kZXJUYXJnZXRzVmVydGljYWxbIDEgXS50ZXh0dXJlO1xuXHRcdHRoaXMuY29tcG9zaXRlTWF0ZXJpYWwudW5pZm9ybXNbICdibHVyVGV4dHVyZTMnIF0udmFsdWUgPSB0aGlzLnJlbmRlclRhcmdldHNWZXJ0aWNhbFsgMiBdLnRleHR1cmU7XG5cdFx0dGhpcy5jb21wb3NpdGVNYXRlcmlhbC51bmlmb3Jtc1sgJ2JsdXJUZXh0dXJlNCcgXS52YWx1ZSA9IHRoaXMucmVuZGVyVGFyZ2V0c1ZlcnRpY2FsWyAzIF0udGV4dHVyZTtcblx0XHR0aGlzLmNvbXBvc2l0ZU1hdGVyaWFsLnVuaWZvcm1zWyAnYmx1clRleHR1cmU1JyBdLnZhbHVlID0gdGhpcy5yZW5kZXJUYXJnZXRzVmVydGljYWxbIDQgXS50ZXh0dXJlO1xuXHRcdHRoaXMuY29tcG9zaXRlTWF0ZXJpYWwudW5pZm9ybXNbICdibG9vbVN0cmVuZ3RoJyBdLnZhbHVlID0gc3RyZW5ndGg7XG5cdFx0dGhpcy5jb21wb3NpdGVNYXRlcmlhbC51bmlmb3Jtc1sgJ2Jsb29tUmFkaXVzJyBdLnZhbHVlID0gMC4xO1xuXHRcdHRoaXMuY29tcG9zaXRlTWF0ZXJpYWwubmVlZHNVcGRhdGUgPSB0cnVlO1xuXG5cdFx0Y29uc3QgYmxvb21GYWN0b3JzID0gWyAxLjAsIDAuOCwgMC42LCAwLjQsIDAuMiBdO1xuXHRcdHRoaXMuY29tcG9zaXRlTWF0ZXJpYWwudW5pZm9ybXNbICdibG9vbUZhY3RvcnMnIF0udmFsdWUgPSBibG9vbUZhY3RvcnM7XG5cdFx0dGhpcy5ibG9vbVRpbnRDb2xvcnMgPSBbIG5ldyBWZWN0b3IzKCAxLCAxLCAxICksIG5ldyBWZWN0b3IzKCAxLCAxLCAxICksIG5ldyBWZWN0b3IzKCAxLCAxLCAxICksIG5ldyBWZWN0b3IzKCAxLCAxLCAxICksIG5ldyBWZWN0b3IzKCAxLCAxLCAxICkgXTtcblx0XHR0aGlzLmNvbXBvc2l0ZU1hdGVyaWFsLnVuaWZvcm1zWyAnYmxvb21UaW50Q29sb3JzJyBdLnZhbHVlID0gdGhpcy5ibG9vbVRpbnRDb2xvcnM7XG5cblx0XHQvLyBjb3B5IG1hdGVyaWFsXG5cdFx0aWYgKCBDb3B5U2hhZGVyID09PSB1bmRlZmluZWQgKSB7XG5cblx0XHRcdGNvbnNvbGUuZXJyb3IoICdUSFJFRS5VbnJlYWxCbG9vbVBhc3MgcmVsaWVzIG9uIENvcHlTaGFkZXInICk7XG5cblx0XHR9XG5cblx0XHRjb25zdCBjb3B5U2hhZGVyID0gQ29weVNoYWRlcjtcblxuXHRcdHRoaXMuY29weVVuaWZvcm1zID0gVW5pZm9ybXNVdGlscy5jbG9uZSggY29weVNoYWRlci51bmlmb3JtcyApO1xuXHRcdHRoaXMuY29weVVuaWZvcm1zWyAnb3BhY2l0eScgXS52YWx1ZSA9IDEuMDtcblxuXHRcdHRoaXMubWF0ZXJpYWxDb3B5ID0gbmV3IFNoYWRlck1hdGVyaWFsKCB7XG5cdFx0XHR1bmlmb3JtczogdGhpcy5jb3B5VW5pZm9ybXMsXG5cdFx0XHR2ZXJ0ZXhTaGFkZXI6IGNvcHlTaGFkZXIudmVydGV4U2hhZGVyLFxuXHRcdFx0ZnJhZ21lbnRTaGFkZXI6IGNvcHlTaGFkZXIuZnJhZ21lbnRTaGFkZXIsXG5cdFx0XHRibGVuZGluZzogQWRkaXRpdmVCbGVuZGluZyxcblx0XHRcdGRlcHRoVGVzdDogZmFsc2UsXG5cdFx0XHRkZXB0aFdyaXRlOiBmYWxzZSxcblx0XHRcdHRyYW5zcGFyZW50OiB0cnVlXG5cdFx0fSApO1xuXG5cdFx0dGhpcy5lbmFibGVkID0gdHJ1ZTtcblx0XHR0aGlzLm5lZWRzU3dhcCA9IGZhbHNlO1xuXG5cdFx0dGhpcy5fb2xkQ2xlYXJDb2xvciA9IG5ldyBDb2xvcigpO1xuXHRcdHRoaXMub2xkQ2xlYXJBbHBoYSA9IDE7XG5cblx0XHR0aGlzLmJhc2ljID0gbmV3IE1lc2hCYXNpY01hdGVyaWFsKCk7XG5cblx0XHR0aGlzLmZzUXVhZCA9IG5ldyBGdWxsU2NyZWVuUXVhZCggbnVsbCApO1xuXG5cdH1cblxuXHRkaXNwb3NlKCkge1xuXG5cdFx0Zm9yICggbGV0IGkgPSAwOyBpIDwgdGhpcy5yZW5kZXJUYXJnZXRzSG9yaXpvbnRhbC5sZW5ndGg7IGkgKysgKSB7XG5cblx0XHRcdHRoaXMucmVuZGVyVGFyZ2V0c0hvcml6b250YWxbIGkgXS5kaXNwb3NlKCk7XG5cblx0XHR9XG5cblx0XHRmb3IgKCBsZXQgaSA9IDA7IGkgPCB0aGlzLnJlbmRlclRhcmdldHNWZXJ0aWNhbC5sZW5ndGg7IGkgKysgKSB7XG5cblx0XHRcdHRoaXMucmVuZGVyVGFyZ2V0c1ZlcnRpY2FsWyBpIF0uZGlzcG9zZSgpO1xuXG5cdFx0fVxuXG5cdFx0dGhpcy5yZW5kZXJUYXJnZXRCcmlnaHQuZGlzcG9zZSgpO1xuXG5cdH1cblxuXHRzZXRTaXplKCB3aWR0aCwgaGVpZ2h0ICkge1xuXG5cdFx0bGV0IHJlc3ggPSBNYXRoLnJvdW5kKCB3aWR0aCAvIDIgKTtcblx0XHRsZXQgcmVzeSA9IE1hdGgucm91bmQoIGhlaWdodCAvIDIgKTtcblxuXHRcdHRoaXMucmVuZGVyVGFyZ2V0QnJpZ2h0LnNldFNpemUoIHJlc3gsIHJlc3kgKTtcblxuXHRcdGZvciAoIGxldCBpID0gMDsgaSA8IHRoaXMubk1pcHM7IGkgKysgKSB7XG5cblx0XHRcdHRoaXMucmVuZGVyVGFyZ2V0c0hvcml6b250YWxbIGkgXS5zZXRTaXplKCByZXN4LCByZXN5ICk7XG5cdFx0XHR0aGlzLnJlbmRlclRhcmdldHNWZXJ0aWNhbFsgaSBdLnNldFNpemUoIHJlc3gsIHJlc3kgKTtcblxuXHRcdFx0dGhpcy5zZXBhcmFibGVCbHVyTWF0ZXJpYWxzWyBpIF0udW5pZm9ybXNbICd0ZXhTaXplJyBdLnZhbHVlID0gbmV3IFZlY3RvcjIoIHJlc3gsIHJlc3kgKTtcblxuXHRcdFx0cmVzeCA9IE1hdGgucm91bmQoIHJlc3ggLyAyICk7XG5cdFx0XHRyZXN5ID0gTWF0aC5yb3VuZCggcmVzeSAvIDIgKTtcblxuXHRcdH1cblxuXHR9XG5cblx0cmVuZGVyKCByZW5kZXJlciwgd3JpdGVCdWZmZXIsIHJlYWRCdWZmZXIsIGRlbHRhVGltZSwgbWFza0FjdGl2ZSApIHtcblxuXHRcdHJlbmRlcmVyLmdldENsZWFyQ29sb3IoIHRoaXMuX29sZENsZWFyQ29sb3IgKTtcblx0XHR0aGlzLm9sZENsZWFyQWxwaGEgPSByZW5kZXJlci5nZXRDbGVhckFscGhhKCk7XG5cdFx0Y29uc3Qgb2xkQXV0b0NsZWFyID0gcmVuZGVyZXIuYXV0b0NsZWFyO1xuXHRcdHJlbmRlcmVyLmF1dG9DbGVhciA9IGZhbHNlO1xuXG5cdFx0cmVuZGVyZXIuc2V0Q2xlYXJDb2xvciggdGhpcy5jbGVhckNvbG9yLCAwICk7XG5cblx0XHRpZiAoIG1hc2tBY3RpdmUgKSByZW5kZXJlci5zdGF0ZS5idWZmZXJzLnN0ZW5jaWwuc2V0VGVzdCggZmFsc2UgKTtcblxuXHRcdC8vIFJlbmRlciBpbnB1dCB0byBzY3JlZW5cblxuXHRcdGlmICggdGhpcy5yZW5kZXJUb1NjcmVlbiApIHtcblxuXHRcdFx0dGhpcy5mc1F1YWQubWF0ZXJpYWwgPSB0aGlzLmJhc2ljO1xuXHRcdFx0dGhpcy5iYXNpYy5tYXAgPSByZWFkQnVmZmVyLnRleHR1cmU7XG5cblx0XHRcdHJlbmRlcmVyLnNldFJlbmRlclRhcmdldCggbnVsbCApO1xuXHRcdFx0cmVuZGVyZXIuY2xlYXIoKTtcblx0XHRcdHRoaXMuZnNRdWFkLnJlbmRlciggcmVuZGVyZXIgKTtcblxuXHRcdH1cblxuXHRcdC8vIDEuIEV4dHJhY3QgQnJpZ2h0IEFyZWFzXG5cblx0XHR0aGlzLmhpZ2hQYXNzVW5pZm9ybXNbICd0RGlmZnVzZScgXS52YWx1ZSA9IHJlYWRCdWZmZXIudGV4dHVyZTtcblx0XHR0aGlzLmhpZ2hQYXNzVW5pZm9ybXNbICdsdW1pbm9zaXR5VGhyZXNob2xkJyBdLnZhbHVlID0gdGhpcy50aHJlc2hvbGQ7XG5cdFx0dGhpcy5mc1F1YWQubWF0ZXJpYWwgPSB0aGlzLm1hdGVyaWFsSGlnaFBhc3NGaWx0ZXI7XG5cblx0XHRyZW5kZXJlci5zZXRSZW5kZXJUYXJnZXQoIHRoaXMucmVuZGVyVGFyZ2V0QnJpZ2h0ICk7XG5cdFx0cmVuZGVyZXIuY2xlYXIoKTtcblx0XHR0aGlzLmZzUXVhZC5yZW5kZXIoIHJlbmRlcmVyICk7XG5cblx0XHQvLyAyLiBCbHVyIEFsbCB0aGUgbWlwcyBwcm9ncmVzc2l2ZWx5XG5cblx0XHRsZXQgaW5wdXRSZW5kZXJUYXJnZXQgPSB0aGlzLnJlbmRlclRhcmdldEJyaWdodDtcblxuXHRcdGZvciAoIGxldCBpID0gMDsgaSA8IHRoaXMubk1pcHM7IGkgKysgKSB7XG5cblx0XHRcdHRoaXMuZnNRdWFkLm1hdGVyaWFsID0gdGhpcy5zZXBhcmFibGVCbHVyTWF0ZXJpYWxzWyBpIF07XG5cblx0XHRcdHRoaXMuc2VwYXJhYmxlQmx1ck1hdGVyaWFsc1sgaSBdLnVuaWZvcm1zWyAnY29sb3JUZXh0dXJlJyBdLnZhbHVlID0gaW5wdXRSZW5kZXJUYXJnZXQudGV4dHVyZTtcblx0XHRcdHRoaXMuc2VwYXJhYmxlQmx1ck1hdGVyaWFsc1sgaSBdLnVuaWZvcm1zWyAnZGlyZWN0aW9uJyBdLnZhbHVlID0gVW5yZWFsQmxvb21QYXNzLkJsdXJEaXJlY3Rpb25YO1xuXHRcdFx0cmVuZGVyZXIuc2V0UmVuZGVyVGFyZ2V0KCB0aGlzLnJlbmRlclRhcmdldHNIb3Jpem9udGFsWyBpIF0gKTtcblx0XHRcdHJlbmRlcmVyLmNsZWFyKCk7XG5cdFx0XHR0aGlzLmZzUXVhZC5yZW5kZXIoIHJlbmRlcmVyICk7XG5cblx0XHRcdHRoaXMuc2VwYXJhYmxlQmx1ck1hdGVyaWFsc1sgaSBdLnVuaWZvcm1zWyAnY29sb3JUZXh0dXJlJyBdLnZhbHVlID0gdGhpcy5yZW5kZXJUYXJnZXRzSG9yaXpvbnRhbFsgaSBdLnRleHR1cmU7XG5cdFx0XHR0aGlzLnNlcGFyYWJsZUJsdXJNYXRlcmlhbHNbIGkgXS51bmlmb3Jtc1sgJ2RpcmVjdGlvbicgXS52YWx1ZSA9IFVucmVhbEJsb29tUGFzcy5CbHVyRGlyZWN0aW9uWTtcblx0XHRcdHJlbmRlcmVyLnNldFJlbmRlclRhcmdldCggdGhpcy5yZW5kZXJUYXJnZXRzVmVydGljYWxbIGkgXSApO1xuXHRcdFx0cmVuZGVyZXIuY2xlYXIoKTtcblx0XHRcdHRoaXMuZnNRdWFkLnJlbmRlciggcmVuZGVyZXIgKTtcblxuXHRcdFx0aW5wdXRSZW5kZXJUYXJnZXQgPSB0aGlzLnJlbmRlclRhcmdldHNWZXJ0aWNhbFsgaSBdO1xuXG5cdFx0fVxuXG5cdFx0Ly8gQ29tcG9zaXRlIEFsbCB0aGUgbWlwc1xuXG5cdFx0dGhpcy5mc1F1YWQubWF0ZXJpYWwgPSB0aGlzLmNvbXBvc2l0ZU1hdGVyaWFsO1xuXHRcdHRoaXMuY29tcG9zaXRlTWF0ZXJpYWwudW5pZm9ybXNbICdibG9vbVN0cmVuZ3RoJyBdLnZhbHVlID0gdGhpcy5zdHJlbmd0aDtcblx0XHR0aGlzLmNvbXBvc2l0ZU1hdGVyaWFsLnVuaWZvcm1zWyAnYmxvb21SYWRpdXMnIF0udmFsdWUgPSB0aGlzLnJhZGl1cztcblx0XHR0aGlzLmNvbXBvc2l0ZU1hdGVyaWFsLnVuaWZvcm1zWyAnYmxvb21UaW50Q29sb3JzJyBdLnZhbHVlID0gdGhpcy5ibG9vbVRpbnRDb2xvcnM7XG5cblx0XHRyZW5kZXJlci5zZXRSZW5kZXJUYXJnZXQoIHRoaXMucmVuZGVyVGFyZ2V0c0hvcml6b250YWxbIDAgXSApO1xuXHRcdHJlbmRlcmVyLmNsZWFyKCk7XG5cdFx0dGhpcy5mc1F1YWQucmVuZGVyKCByZW5kZXJlciApO1xuXG5cdFx0Ly8gQmxlbmQgaXQgYWRkaXRpdmVseSBvdmVyIHRoZSBpbnB1dCB0ZXh0dXJlXG5cblx0XHR0aGlzLmZzUXVhZC5tYXRlcmlhbCA9IHRoaXMubWF0ZXJpYWxDb3B5O1xuXHRcdHRoaXMuY29weVVuaWZvcm1zWyAndERpZmZ1c2UnIF0udmFsdWUgPSB0aGlzLnJlbmRlclRhcmdldHNIb3Jpem9udGFsWyAwIF0udGV4dHVyZTtcblxuXHRcdGlmICggbWFza0FjdGl2ZSApIHJlbmRlcmVyLnN0YXRlLmJ1ZmZlcnMuc3RlbmNpbC5zZXRUZXN0KCB0cnVlICk7XG5cblx0XHRpZiAoIHRoaXMucmVuZGVyVG9TY3JlZW4gKSB7XG5cblx0XHRcdHJlbmRlcmVyLnNldFJlbmRlclRhcmdldCggbnVsbCApO1xuXHRcdFx0dGhpcy5mc1F1YWQucmVuZGVyKCByZW5kZXJlciApO1xuXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0cmVuZGVyZXIuc2V0UmVuZGVyVGFyZ2V0KCByZWFkQnVmZmVyICk7XG5cdFx0XHR0aGlzLmZzUXVhZC5yZW5kZXIoIHJlbmRlcmVyICk7XG5cblx0XHR9XG5cblx0XHQvLyBSZXN0b3JlIHJlbmRlcmVyIHNldHRpbmdzXG5cblx0XHRyZW5kZXJlci5zZXRDbGVhckNvbG9yKCB0aGlzLl9vbGRDbGVhckNvbG9yLCB0aGlzLm9sZENsZWFyQWxwaGEgKTtcblx0XHRyZW5kZXJlci5hdXRvQ2xlYXIgPSBvbGRBdXRvQ2xlYXI7XG5cblx0fVxuXG5cdGdldFNlcGVyYWJsZUJsdXJNYXRlcmlhbCgga2VybmVsUmFkaXVzICkge1xuXG5cdFx0cmV0dXJuIG5ldyBTaGFkZXJNYXRlcmlhbCgge1xuXG5cdFx0XHRkZWZpbmVzOiB7XG5cdFx0XHRcdCdLRVJORUxfUkFESVVTJzoga2VybmVsUmFkaXVzLFxuXHRcdFx0XHQnU0lHTUEnOiBrZXJuZWxSYWRpdXNcblx0XHRcdH0sXG5cblx0XHRcdHVuaWZvcm1zOiB7XG5cdFx0XHRcdCdjb2xvclRleHR1cmUnOiB7IHZhbHVlOiBudWxsIH0sXG5cdFx0XHRcdCd0ZXhTaXplJzogeyB2YWx1ZTogbmV3IFZlY3RvcjIoIDAuNSwgMC41ICkgfSxcblx0XHRcdFx0J2RpcmVjdGlvbic6IHsgdmFsdWU6IG5ldyBWZWN0b3IyKCAwLjUsIDAuNSApIH1cblx0XHRcdH0sXG5cblx0XHRcdHZlcnRleFNoYWRlcjpcblx0XHRcdFx0YHZhcnlpbmcgdmVjMiB2VXY7XG5cdFx0XHRcdHZvaWQgbWFpbigpIHtcblx0XHRcdFx0XHR2VXYgPSB1djtcblx0XHRcdFx0XHRnbF9Qb3NpdGlvbiA9IHByb2plY3Rpb25NYXRyaXggKiBtb2RlbFZpZXdNYXRyaXggKiB2ZWM0KCBwb3NpdGlvbiwgMS4wICk7XG5cdFx0XHRcdH1gLFxuXG5cdFx0XHRmcmFnbWVudFNoYWRlcjpcblx0XHRcdFx0YCNpbmNsdWRlIDxjb21tb24+XG5cdFx0XHRcdHZhcnlpbmcgdmVjMiB2VXY7XG5cdFx0XHRcdHVuaWZvcm0gc2FtcGxlcjJEIGNvbG9yVGV4dHVyZTtcblx0XHRcdFx0dW5pZm9ybSB2ZWMyIHRleFNpemU7XG5cdFx0XHRcdHVuaWZvcm0gdmVjMiBkaXJlY3Rpb247XG5cblx0XHRcdFx0ZmxvYXQgZ2F1c3NpYW5QZGYoaW4gZmxvYXQgeCwgaW4gZmxvYXQgc2lnbWEpIHtcblx0XHRcdFx0XHRyZXR1cm4gMC4zOTg5NCAqIGV4cCggLTAuNSAqIHggKiB4Lyggc2lnbWEgKiBzaWdtYSkpL3NpZ21hO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHZvaWQgbWFpbigpIHtcblx0XHRcdFx0XHR2ZWMyIGludlNpemUgPSAxLjAgLyB0ZXhTaXplO1xuXHRcdFx0XHRcdGZsb2F0IGZTaWdtYSA9IGZsb2F0KFNJR01BKTtcblx0XHRcdFx0XHRmbG9hdCB3ZWlnaHRTdW0gPSBnYXVzc2lhblBkZigwLjAsIGZTaWdtYSk7XG5cdFx0XHRcdFx0dmVjMyBkaWZmdXNlU3VtID0gdGV4dHVyZTJEKCBjb2xvclRleHR1cmUsIHZVdikucmdiICogd2VpZ2h0U3VtO1xuXHRcdFx0XHRcdGZvciggaW50IGkgPSAxOyBpIDwgS0VSTkVMX1JBRElVUzsgaSArKyApIHtcblx0XHRcdFx0XHRcdGZsb2F0IHggPSBmbG9hdChpKTtcblx0XHRcdFx0XHRcdGZsb2F0IHcgPSBnYXVzc2lhblBkZih4LCBmU2lnbWEpO1xuXHRcdFx0XHRcdFx0dmVjMiB1dk9mZnNldCA9IGRpcmVjdGlvbiAqIGludlNpemUgKiB4O1xuXHRcdFx0XHRcdFx0dmVjMyBzYW1wbGUxID0gdGV4dHVyZTJEKCBjb2xvclRleHR1cmUsIHZVdiArIHV2T2Zmc2V0KS5yZ2I7XG5cdFx0XHRcdFx0XHR2ZWMzIHNhbXBsZTIgPSB0ZXh0dXJlMkQoIGNvbG9yVGV4dHVyZSwgdlV2IC0gdXZPZmZzZXQpLnJnYjtcblx0XHRcdFx0XHRcdGRpZmZ1c2VTdW0gKz0gKHNhbXBsZTEgKyBzYW1wbGUyKSAqIHc7XG5cdFx0XHRcdFx0XHR3ZWlnaHRTdW0gKz0gMi4wICogdztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Z2xfRnJhZ0NvbG9yID0gdmVjNChkaWZmdXNlU3VtL3dlaWdodFN1bSwgMS4wKTtcblx0XHRcdFx0fWBcblx0XHR9ICk7XG5cblx0fVxuXG5cdGdldENvbXBvc2l0ZU1hdGVyaWFsKCBuTWlwcyApIHtcblxuXHRcdHJldHVybiBuZXcgU2hhZGVyTWF0ZXJpYWwoIHtcblxuXHRcdFx0ZGVmaW5lczoge1xuXHRcdFx0XHQnTlVNX01JUFMnOiBuTWlwc1xuXHRcdFx0fSxcblxuXHRcdFx0dW5pZm9ybXM6IHtcblx0XHRcdFx0J2JsdXJUZXh0dXJlMSc6IHsgdmFsdWU6IG51bGwgfSxcblx0XHRcdFx0J2JsdXJUZXh0dXJlMic6IHsgdmFsdWU6IG51bGwgfSxcblx0XHRcdFx0J2JsdXJUZXh0dXJlMyc6IHsgdmFsdWU6IG51bGwgfSxcblx0XHRcdFx0J2JsdXJUZXh0dXJlNCc6IHsgdmFsdWU6IG51bGwgfSxcblx0XHRcdFx0J2JsdXJUZXh0dXJlNSc6IHsgdmFsdWU6IG51bGwgfSxcblx0XHRcdFx0J2RpcnRUZXh0dXJlJzogeyB2YWx1ZTogbnVsbCB9LFxuXHRcdFx0XHQnYmxvb21TdHJlbmd0aCc6IHsgdmFsdWU6IDEuMCB9LFxuXHRcdFx0XHQnYmxvb21GYWN0b3JzJzogeyB2YWx1ZTogbnVsbCB9LFxuXHRcdFx0XHQnYmxvb21UaW50Q29sb3JzJzogeyB2YWx1ZTogbnVsbCB9LFxuXHRcdFx0XHQnYmxvb21SYWRpdXMnOiB7IHZhbHVlOiAwLjAgfVxuXHRcdFx0fSxcblxuXHRcdFx0dmVydGV4U2hhZGVyOlxuXHRcdFx0XHRgdmFyeWluZyB2ZWMyIHZVdjtcblx0XHRcdFx0dm9pZCBtYWluKCkge1xuXHRcdFx0XHRcdHZVdiA9IHV2O1xuXHRcdFx0XHRcdGdsX1Bvc2l0aW9uID0gcHJvamVjdGlvbk1hdHJpeCAqIG1vZGVsVmlld01hdHJpeCAqIHZlYzQoIHBvc2l0aW9uLCAxLjAgKTtcblx0XHRcdFx0fWAsXG5cblx0XHRcdGZyYWdtZW50U2hhZGVyOlxuXHRcdFx0XHRgdmFyeWluZyB2ZWMyIHZVdjtcblx0XHRcdFx0dW5pZm9ybSBzYW1wbGVyMkQgYmx1clRleHR1cmUxO1xuXHRcdFx0XHR1bmlmb3JtIHNhbXBsZXIyRCBibHVyVGV4dHVyZTI7XG5cdFx0XHRcdHVuaWZvcm0gc2FtcGxlcjJEIGJsdXJUZXh0dXJlMztcblx0XHRcdFx0dW5pZm9ybSBzYW1wbGVyMkQgYmx1clRleHR1cmU0O1xuXHRcdFx0XHR1bmlmb3JtIHNhbXBsZXIyRCBibHVyVGV4dHVyZTU7XG5cdFx0XHRcdHVuaWZvcm0gc2FtcGxlcjJEIGRpcnRUZXh0dXJlO1xuXHRcdFx0XHR1bmlmb3JtIGZsb2F0IGJsb29tU3RyZW5ndGg7XG5cdFx0XHRcdHVuaWZvcm0gZmxvYXQgYmxvb21SYWRpdXM7XG5cdFx0XHRcdHVuaWZvcm0gZmxvYXQgYmxvb21GYWN0b3JzW05VTV9NSVBTXTtcblx0XHRcdFx0dW5pZm9ybSB2ZWMzIGJsb29tVGludENvbG9yc1tOVU1fTUlQU107XG5cblx0XHRcdFx0ZmxvYXQgbGVycEJsb29tRmFjdG9yKGNvbnN0IGluIGZsb2F0IGZhY3Rvcikge1xuXHRcdFx0XHRcdGZsb2F0IG1pcnJvckZhY3RvciA9IDEuMiAtIGZhY3Rvcjtcblx0XHRcdFx0XHRyZXR1cm4gbWl4KGZhY3RvciwgbWlycm9yRmFjdG9yLCBibG9vbVJhZGl1cyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR2b2lkIG1haW4oKSB7XG5cdFx0XHRcdFx0Z2xfRnJhZ0NvbG9yID0gYmxvb21TdHJlbmd0aCAqICggbGVycEJsb29tRmFjdG9yKGJsb29tRmFjdG9yc1swXSkgKiB2ZWM0KGJsb29tVGludENvbG9yc1swXSwgMS4wKSAqIHRleHR1cmUyRChibHVyVGV4dHVyZTEsIHZVdikgK1xuXHRcdFx0XHRcdFx0bGVycEJsb29tRmFjdG9yKGJsb29tRmFjdG9yc1sxXSkgKiB2ZWM0KGJsb29tVGludENvbG9yc1sxXSwgMS4wKSAqIHRleHR1cmUyRChibHVyVGV4dHVyZTIsIHZVdikgK1xuXHRcdFx0XHRcdFx0bGVycEJsb29tRmFjdG9yKGJsb29tRmFjdG9yc1syXSkgKiB2ZWM0KGJsb29tVGludENvbG9yc1syXSwgMS4wKSAqIHRleHR1cmUyRChibHVyVGV4dHVyZTMsIHZVdikgK1xuXHRcdFx0XHRcdFx0bGVycEJsb29tRmFjdG9yKGJsb29tRmFjdG9yc1szXSkgKiB2ZWM0KGJsb29tVGludENvbG9yc1szXSwgMS4wKSAqIHRleHR1cmUyRChibHVyVGV4dHVyZTQsIHZVdikgK1xuXHRcdFx0XHRcdFx0bGVycEJsb29tRmFjdG9yKGJsb29tRmFjdG9yc1s0XSkgKiB2ZWM0KGJsb29tVGludENvbG9yc1s0XSwgMS4wKSAqIHRleHR1cmUyRChibHVyVGV4dHVyZTUsIHZVdikgKTtcblx0XHRcdFx0fWBcblx0XHR9ICk7XG5cblx0fVxuXG59XG5cblVucmVhbEJsb29tUGFzcy5CbHVyRGlyZWN0aW9uWCA9IG5ldyBWZWN0b3IyKCAxLjAsIDAuMCApO1xuVW5yZWFsQmxvb21QYXNzLkJsdXJEaXJlY3Rpb25ZID0gbmV3IFZlY3RvcjIoIDAuMCwgMS4wICk7XG5cbmV4cG9ydCB7IFVucmVhbEJsb29tUGFzcyB9O1xuIiwiLyoqXG4gKiBGdWxsLXNjcmVlbiB0ZXh0dXJlZCBxdWFkIHNoYWRlclxuICovXG5cbnZhciBDb3B5U2hhZGVyID0ge1xuXG5cdHVuaWZvcm1zOiB7XG5cblx0XHQndERpZmZ1c2UnOiB7IHZhbHVlOiBudWxsIH0sXG5cdFx0J29wYWNpdHknOiB7IHZhbHVlOiAxLjAgfVxuXG5cdH0sXG5cblx0dmVydGV4U2hhZGVyOiAvKiBnbHNsICovYFxuXG5cdFx0dmFyeWluZyB2ZWMyIHZVdjtcblxuXHRcdHZvaWQgbWFpbigpIHtcblxuXHRcdFx0dlV2ID0gdXY7XG5cdFx0XHRnbF9Qb3NpdGlvbiA9IHByb2plY3Rpb25NYXRyaXggKiBtb2RlbFZpZXdNYXRyaXggKiB2ZWM0KCBwb3NpdGlvbiwgMS4wICk7XG5cblx0XHR9YCxcblxuXHRmcmFnbWVudFNoYWRlcjogLyogZ2xzbCAqL2BcblxuXHRcdHVuaWZvcm0gZmxvYXQgb3BhY2l0eTtcblxuXHRcdHVuaWZvcm0gc2FtcGxlcjJEIHREaWZmdXNlO1xuXG5cdFx0dmFyeWluZyB2ZWMyIHZVdjtcblxuXHRcdHZvaWQgbWFpbigpIHtcblxuXHRcdFx0dmVjNCB0ZXhlbCA9IHRleHR1cmUyRCggdERpZmZ1c2UsIHZVdiApO1xuXHRcdFx0Z2xfRnJhZ0NvbG9yID0gb3BhY2l0eSAqIHRleGVsO1xuXG5cdFx0fWBcblxufTtcblxuZXhwb3J0IHsgQ29weVNoYWRlciB9O1xuIiwiaW1wb3J0IHtcblx0Q29sb3Jcbn0gZnJvbSAndGhyZWUnO1xuXG4vKipcbiAqIEx1bWlub3NpdHlcbiAqIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTHVtaW5vc2l0eVxuICovXG5cbmNvbnN0IEx1bWlub3NpdHlIaWdoUGFzc1NoYWRlciA9IHtcblxuXHRzaGFkZXJJRDogJ2x1bWlub3NpdHlIaWdoUGFzcycsXG5cblx0dW5pZm9ybXM6IHtcblxuXHRcdCd0RGlmZnVzZSc6IHsgdmFsdWU6IG51bGwgfSxcblx0XHQnbHVtaW5vc2l0eVRocmVzaG9sZCc6IHsgdmFsdWU6IDEuMCB9LFxuXHRcdCdzbW9vdGhXaWR0aCc6IHsgdmFsdWU6IDEuMCB9LFxuXHRcdCdkZWZhdWx0Q29sb3InOiB7IHZhbHVlOiBuZXcgQ29sb3IoIDB4MDAwMDAwICkgfSxcblx0XHQnZGVmYXVsdE9wYWNpdHknOiB7IHZhbHVlOiAwLjAgfVxuXG5cdH0sXG5cblx0dmVydGV4U2hhZGVyOiAvKiBnbHNsICovYFxuXG5cdFx0dmFyeWluZyB2ZWMyIHZVdjtcblxuXHRcdHZvaWQgbWFpbigpIHtcblxuXHRcdFx0dlV2ID0gdXY7XG5cblx0XHRcdGdsX1Bvc2l0aW9uID0gcHJvamVjdGlvbk1hdHJpeCAqIG1vZGVsVmlld01hdHJpeCAqIHZlYzQoIHBvc2l0aW9uLCAxLjAgKTtcblxuXHRcdH1gLFxuXG5cdGZyYWdtZW50U2hhZGVyOiAvKiBnbHNsICovYFxuXG5cdFx0dW5pZm9ybSBzYW1wbGVyMkQgdERpZmZ1c2U7XG5cdFx0dW5pZm9ybSB2ZWMzIGRlZmF1bHRDb2xvcjtcblx0XHR1bmlmb3JtIGZsb2F0IGRlZmF1bHRPcGFjaXR5O1xuXHRcdHVuaWZvcm0gZmxvYXQgbHVtaW5vc2l0eVRocmVzaG9sZDtcblx0XHR1bmlmb3JtIGZsb2F0IHNtb290aFdpZHRoO1xuXG5cdFx0dmFyeWluZyB2ZWMyIHZVdjtcblxuXHRcdHZvaWQgbWFpbigpIHtcblxuXHRcdFx0dmVjNCB0ZXhlbCA9IHRleHR1cmUyRCggdERpZmZ1c2UsIHZVdiApO1xuXG5cdFx0XHR2ZWMzIGx1bWEgPSB2ZWMzKCAwLjI5OSwgMC41ODcsIDAuMTE0ICk7XG5cblx0XHRcdGZsb2F0IHYgPSBkb3QoIHRleGVsLnh5eiwgbHVtYSApO1xuXG5cdFx0XHR2ZWM0IG91dHB1dENvbG9yID0gdmVjNCggZGVmYXVsdENvbG9yLnJnYiwgZGVmYXVsdE9wYWNpdHkgKTtcblxuXHRcdFx0ZmxvYXQgYWxwaGEgPSBzbW9vdGhzdGVwKCBsdW1pbm9zaXR5VGhyZXNob2xkLCBsdW1pbm9zaXR5VGhyZXNob2xkICsgc21vb3RoV2lkdGgsIHYgKTtcblxuXHRcdFx0Z2xfRnJhZ0NvbG9yID0gbWl4KCBvdXRwdXRDb2xvciwgdGV4ZWwsIGFscGhhICk7XG5cblx0XHR9YFxuXG59O1xuXG5leHBvcnQgeyBMdW1pbm9zaXR5SGlnaFBhc3NTaGFkZXIgfTtcbiIsImltcG9ydCBUaHJlZUdsb2JlIGZyb20gXCJ0aHJlZS1nbG9iZVwiO1xuaW1wb3J0IHsgV2ViR0xSZW5kZXJlciwgU2NlbmUgfSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7XG4gIFBlcnNwZWN0aXZlQ2FtZXJhLFxuICBBbWJpZW50TGlnaHQsXG4gIERpcmVjdGlvbmFsTGlnaHQsXG4gIENvbG9yLFxuICBGb2csXG4gIC8vIEF4ZXNIZWxwZXIsXG4gIC8vIERpcmVjdGlvbmFsTGlnaHRIZWxwZXIsXG4gIC8vIENhbWVyYUhlbHBlcixcbiAgUG9pbnRMaWdodCxcbiAgU3BoZXJlR2VvbWV0cnksXG4gIFxufSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IEVmZmVjdENvbXBvc2VyIH0gZnJvbSAndGhyZWUvZXhhbXBsZXMvanNtL3Bvc3Rwcm9jZXNzaW5nL0VmZmVjdENvbXBvc2VyLmpzJztcbmltcG9ydCB7IFJlbmRlclBhc3MgfSBmcm9tICd0aHJlZS9leGFtcGxlcy9qc20vcG9zdHByb2Nlc3NpbmcvUmVuZGVyUGFzcy5qcyc7XG5pbXBvcnQgeyBVbnJlYWxCbG9vbVBhc3MgfSBmcm9tICd0aHJlZS9leGFtcGxlcy9qc20vcG9zdHByb2Nlc3NpbmcvVW5yZWFsQmxvb21QYXNzLmpzJztcblxuaW1wb3J0IHsgT3JiaXRDb250cm9scyB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vY29udHJvbHMvT3JiaXRDb250cm9scy5qc1wiO1xuaW1wb3J0IHsgY3JlYXRlR2xvd01lc2ggfSBmcm9tIFwidGhyZWUtZ2xvdy1tZXNoXCI7XG5pbXBvcnQgY291bnRyaWVzIGZyb20gXCIuL2ZpbGVzL2dsb2JlLWRhdGEtbWluLmpzb25cIjtcbmltcG9ydCB0cmF2ZWxIaXN0b3J5IGZyb20gXCIuL2ZpbGVzL215LWZsaWdodHMuanNvblwiO1xuaW1wb3J0IGFpcnBvcnRIaXN0b3J5IGZyb20gXCIuL2ZpbGVzL215LWFpcnBvcnRzLmpzb25cIjtcbnZhciByZW5kZXJlciwgY2FtZXJhLCBzY2VuZSwgY29udHJvbHMgLGNvbXBvc2VyO1xubGV0IG1vdXNlWCA9IDA7XG5sZXQgbW91c2VZID0gMDtcbmxldCB3aW5kb3dIYWxmWCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMjtcbmxldCB3aW5kb3dIYWxmWSA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDI7XG52YXIgR2xvYmU7XG5cbmluaXQoKTtcbmluaXRHbG9iZSgpO1xub25XaW5kb3dSZXNpemUoKTtcbmFuaW1hdGUoKTtcblxuLy8gU0VDVElPTiBJbml0aWFsaXppbmcgY29yZSBUaHJlZUpTIGVsZW1lbnRzXG5mdW5jdGlvbiBpbml0KCkge1xuICAvLyBJbml0aWFsaXplIHJlbmRlcmVyXG4gIHJlbmRlcmVyID0gbmV3IFdlYkdMUmVuZGVyZXIoeyBhbnRpYWxpYXM6IHRydWUgfSk7XG4gIHJlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAvLyByZW5kZXJlci5vdXRwdXRFbmNvZGluZyA9IFRIUkVFLnNSR0JFbmNvZGluZztcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChyZW5kZXJlci5kb21FbGVtZW50KTtcblxuICAvLyBJbml0aWFsaXplIHNjZW5lLCBsaWdodFxuICBzY2VuZSA9IG5ldyBTY2VuZSgpO1xuICBzY2VuZS5hZGQobmV3IEFtYmllbnRMaWdodCgweGJiYmJiYiwgMC4zKSk7XG4gIHNjZW5lLmJhY2tncm91bmQgPSBuZXcgQ29sb3IoMHgwMDAwMDApO1xuXG4gIC8vIEluaXRpYWxpemUgY2FtZXJhLCBsaWdodFxuICBjYW1lcmEgPSBuZXcgUGVyc3BlY3RpdmVDYW1lcmEoKTtcbiAgY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuXG4gICBjb25zdCByZW5kZXJQYXNzID0gbmV3IFJlbmRlclBhc3Moc2NlbmUsIGNhbWVyYSk7XG4gIGNvbnN0IGJsb29tUGFzcyA9IG5ldyBVbnJlYWxCbG9vbVBhc3MoXG4gICAgbmV3IFRIUkVFLlZlY3RvcjIod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCksXG4gICAgMC44LCAgLy8gc3RyZW5ndGhcbiAgICAwLjMsICAvLyByYWRpdXNcbiAgICAwLjEgICAvLyB0aHJlc2hvbGRcbiAgKTtcbiAgY29tcG9zZXIgPSBuZXcgRWZmZWN0Q29tcG9zZXIocmVuZGVyZXIpO1xuICBjb21wb3Nlci5hZGRQYXNzKHJlbmRlclBhc3MpO1xuICBjb21wb3Nlci5hZGRQYXNzKGJsb29tUGFzcyk7XG4gIHZhciBkTGlnaHQgPSBuZXcgRGlyZWN0aW9uYWxMaWdodCgweGZmZmZmZiwgMC44KTtcbiAgZExpZ2h0LnBvc2l0aW9uLnNldCgtODAwLCAyMDAwLCA0MDApO1xuICBjYW1lcmEuYWRkKGRMaWdodCk7XG5cbiAgdmFyIGRMaWdodDEgPSBuZXcgRGlyZWN0aW9uYWxMaWdodCgweDc5ODJmNiwgMSk7XG4gIGRMaWdodDEucG9zaXRpb24uc2V0KC0yMDAsIDUwMCwgMjAwKTtcbiAgY2FtZXJhLmFkZChkTGlnaHQxKTtcblxuICB2YXIgZExpZ2h0MiA9IG5ldyBQb2ludExpZ2h0KDB4ODU2NmNjLCAwLjUpO1xuICBkTGlnaHQyLnBvc2l0aW9uLnNldCgtMjAwLCA1MDAsIDIwMCk7XG4gIGNhbWVyYS5hZGQoZExpZ2h0Mik7XG5cbiAgY2FtZXJhLnBvc2l0aW9uLnogPSA0MDA7XG4gIGNhbWVyYS5wb3NpdGlvbi54ID0gMDtcbiAgY2FtZXJhLnBvc2l0aW9uLnkgPSAwO1xuXG4gIHNjZW5lLmFkZChjYW1lcmEpO1xuXG4gIC8vIEFkZGl0aW9uYWwgZWZmZWN0c1xuICBzY2VuZS5mb2cgPSBuZXcgRm9nKDB4NTM1ZWYzLCA0MDAsIDIwMDApO1xuXG4gIC8vIEhlbHBlcnNcbiAgLy8gY29uc3QgYXhlc0hlbHBlciA9IG5ldyBBeGVzSGVscGVyKDgwMCk7XG4gIC8vIHNjZW5lLmFkZChheGVzSGVscGVyKTtcbiAgLy8gdmFyIGhlbHBlciA9IG5ldyBEaXJlY3Rpb25hbExpZ2h0SGVscGVyKGRMaWdodCk7XG4gIC8vIHNjZW5lLmFkZChoZWxwZXIpO1xuICAvLyB2YXIgaGVscGVyQ2FtZXJhID0gbmV3IENhbWVyYUhlbHBlcihkTGlnaHQuc2hhZG93LmNhbWVyYSk7XG4gIC8vIHNjZW5lLmFkZChoZWxwZXJDYW1lcmEpO1xuXG4gIC8vIEluaXRpYWxpemUgY29udHJvbHNcbiAgY29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyhjYW1lcmEsIHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuICBjb250cm9scy5lbmFibGVEYW1waW5nID0gdHJ1ZTtcbiAgY29udHJvbHMuZHluYW1pY0RhbXBpbmdGYWN0b3IgPSAwLjAxO1xuICBjb250cm9scy5lbmFibGVQYW4gPSBmYWxzZTtcbiAgY29udHJvbHMubWluRGlzdGFuY2UgPSAyMDA7XG4gIGNvbnRyb2xzLm1heERpc3RhbmNlID0gNTAwO1xuICBjb250cm9scy5yb3RhdGVTcGVlZCA9IDAuODtcbiAgY29udHJvbHMuem9vbVNwZWVkID0gMTtcbiAgY29udHJvbHMuYXV0b1JvdGF0ZSA9IGZhbHNlO1xuXG4gIGNvbnRyb2xzLm1pblBvbGFyQW5nbGUgPSBNYXRoLlBJIC8gMy41O1xuICBjb250cm9scy5tYXhQb2xhckFuZ2xlID0gTWF0aC5QSSAtIE1hdGguUEkgLyAzO1xuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIG9uV2luZG93UmVzaXplLCBmYWxzZSk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgb25Nb3VzZU1vdmUpO1xufVxuLy8gU0VDVElPTiBHbG9iZVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gLS0tIFJFUExBQ0UgWU9VUiBPTEQgaW5pdEdsb2JlIEZVTkNUSU9OIFdJVEggVEhJUyBFTlRJUkUgQkxPQ0sgLS0tXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIGluaXRHbG9iZSgpIHtcbiAgLy8gMS4gLS0tIEluaXRpYWxpemUgdGhlIEdsb2JlIGFuZCBzZXQgdXAgdGhlIGhleGFnb24gc3R5bGUgLS0tXG4gIEdsb2JlID0gbmV3IFRocmVlR2xvYmUoe1xuICAgIHdhaXRGb3JHbG9iZVJlYWR5OiB0cnVlLFxuICAgIGFuaW1hdGVJbjogdHJ1ZSxcbiAgfSlcbiAgICAuaGV4UG9seWdvbnNEYXRhKGNvdW50cmllcy5mZWF0dXJlcylcbiAgICAvL1xuICAgIC8vIC0tLSBLRVkgQ0hBTkdFUyBmb3IgVklTSUJMRSwgVElHSFQgSEVYQUdPTlMgLS0tXG4gICAgLmhleFBvbHlnb25SZXNvbHV0aW9uKDMpIC8vIExvd2VyIG51bWJlciA9IEJJR0dFUiBoZXhhZ29uc1xuICAgIC5oZXhQb2x5Z29uTWFyZ2luKDAuNCkgICAvLyBTbWFsbCBudW1iZXIgPSBoZXhhZ29ucyBhcmUgVkVSWSBDTE9TRVxuICAgIC8vXG4gICAgLnNob3dBdG1vc3BoZXJlKHRydWUpXG4gICAgLmF0bW9zcGhlcmVDb2xvcignIzdiOGIyZmZmJylcbiAgICAuYXRtb3NwaGVyZUFsdGl0dWRlKDAuMjUpXG4gICAgLy8gLS0tIFNldCBhIHNpbmdsZSwgYnJpZ2h0IGNvbG9yIGZvciBBTEwgaGV4YWdvbnMgLS0tXG4gICAgLmhleFBvbHlnb25Db2xvcigoKSA9PiAnI2M1YTkyMGZmJyk7XG5cbiAgLy8gMi4gLS0tIFlvdXIgb3JpZ2luYWwgbGFiZWwgYW5kIHBvaW50IGNvZGUgLS0tXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIEdsb2JlLmxhYmVsc0RhdGEoYWlycG9ydEhpc3RvcnkuYWlycG9ydHMpXG4gICAgICAubGFiZWxDb2xvcigoKSA9PiAnI2ZmY2IyMScpXG4gICAgICAubGFiZWxEb3RPcmllbnRhdGlvbigoZSkgPT4gKGUudGV4dCA9PT0gJ0FMQScgPyAndG9wJyA6ICdyaWdodCcpKVxuICAgICAgLmxhYmVsRG90UmFkaXVzKDAuMylcbiAgICAgIC5sYWJlbFNpemUoKGUpID0+IGUuc2l6ZSlcbiAgICAgIC5sYWJlbFRleHQoJ2NpdHknKVxuICAgICAgLmxhYmVsUmVzb2x1dGlvbig2KVxuICAgICAgLmxhYmVsQWx0aXR1ZGUoMC4wMSlcbiAgICAgIC5wb2ludHNEYXRhKGFpcnBvcnRIaXN0b3J5LmFpcnBvcnRzKVxuICAgICAgLnBvaW50Q29sb3IoKCkgPT4gJyNmZmZmZmYnKVxuICAgICAgLnBvaW50c01lcmdlKHRydWUpXG4gICAgICAucG9pbnRBbHRpdHVkZSgwLjA3KVxuICAgICAgLnBvaW50UmFkaXVzKDAuMDUpO1xuICB9LCAxMDAwKTtcblxuICAvLyAzLiAtLS0gR2xvYmUgQmFzZSBNYXRlcmlhbCAoVEhFIENSSVRJQ0FMIEZJWCkgLS0tXG4gIC8vIFRoZSBnbG9iZSAqdW5kZXJuZWF0aCogdGhlIGhleGFnb25zIG11c3QgYmUgZGFyayBhbmQgc29saWQuXG4gIGNvbnN0IGdsb2JlTWF0ZXJpYWwgPSBHbG9iZS5nbG9iZU1hdGVyaWFsKCk7XG5cbi8vIC0tLSBTZXR0aW5ncyBmb3IgVHJ1ZSBUcmFuc3BhcmVuY3kgLS0tXG5nbG9iZU1hdGVyaWFsLnRyYW5zcGFyZW50ID0gdHJ1ZTtcbmdsb2JlTWF0ZXJpYWwub3BhY2l0eSA9IDAuNTsgICAgICAvLyA8LS0gQWRqdXN0IHRoaXMgdmFsdWUgKDAuMSB0byAwLjUgaXMgZ29vZClcbmdsb2JlTWF0ZXJpYWwuY29sb3IgPSBuZXcgQ29sb3IoMHgwMDAwMDApOyBcbmdsb2JlTWF0ZXJpYWwuZW1pc3NpdmUgPSBuZXcgQ29sb3IoMHgwMDAwMDApO1xuZ2xvYmVNYXRlcmlhbC5zaGluaW5lc3MgPSAwO1xuXG4gIC8vIDQuIC0tLSBGaW5hbCBHbG9iZSBvcmllbnRhdGlvbiBhbmQgYWRkaW5nIHRvIHNjZW5lIC0tLVxuICBjb25zdCBsYXQgPSAyNDtcbiAgY29uc3QgbG5nID0gNDU7XG4gIGNvbnN0IHJvdGF0aW9uWSA9IC1sbmcgKiAoTWF0aC5QSSAvIDE4MCk7XG4gIGNvbnN0IHJvdGF0aW9uWiA9IGxhdCAqIChNYXRoLlBJIC8gMTgwKTtcbiAgR2xvYmUucm90YXRlWShyb3RhdGlvblkpO1xuICBHbG9iZS5yb3RhdGVaKHJvdGF0aW9uWik7XG5cbiAgc2NlbmUuYWRkKEdsb2JlKTtcblxufVxuXG5mdW5jdGlvbiBvbk1vdXNlTW92ZShldmVudCkge1xuICBtb3VzZVggPSBldmVudC5jbGllbnRYIC0gd2luZG93SGFsZlg7XG4gIG1vdXNlWSA9IGV2ZW50LmNsaWVudFkgLSB3aW5kb3dIYWxmWTtcbiAgLy8gY29uc29sZS5sb2coXCJ4OiBcIiArIG1vdXNlWCArIFwiIHk6IFwiICsgbW91c2VZKTtcbn1cblxuZnVuY3Rpb24gb25XaW5kb3dSZXNpemUoKSB7XG4gIGNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcbiAgd2luZG93SGFsZlggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDEuNTtcbiAgd2luZG93SGFsZlkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAxLjU7XG4gIHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG59XG5cbmZ1bmN0aW9uIGFuaW1hdGUoKSB7XG4gIGNhbWVyYS5wb3NpdGlvbi54ICs9XG4gICAgTWF0aC5hYnMobW91c2VYKSA8PSB3aW5kb3dIYWxmWCAvIDJcbiAgICAgID8gKG1vdXNlWCAvIDIgLSBjYW1lcmEucG9zaXRpb24ueCkgKiAwLjAwNVxuICAgICAgOiAwO1xuICBjYW1lcmEucG9zaXRpb24ueSArPSAoLW1vdXNlWSAvIDIgLSBjYW1lcmEucG9zaXRpb24ueSkgKiAwLjAwNTtcbiAgY2FtZXJhLmxvb2tBdChzY2VuZS5wb3NpdGlvbik7XG4gIGNvbnRyb2xzLnVwZGF0ZSgpO1xuICByZW5kZXJlci5yZW5kZXIoc2NlbmUsIGNhbWVyYSk7XG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcbn1cbiIsIl9fd2VicGFja19yZXF1aXJlX18uaCA9ICgpID0+IFwiYzMxZWZmOGIyNjk4NjUzYTA2NjJcIiJdLCJzb3VyY2VSb290IjoiIn0=