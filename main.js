/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/loop.ts":
/*!*********************!*\
  !*** ./src/loop.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   RenderLoop: () => (/* binding */ RenderLoop)\n/* harmony export */ });\nconst DEFAULT_OPTIONS = {\n    deltaTimeLimit: 1,\n    // requestAnimationFrame is usually 60 fps; in seconds\n    fps: 60,\n};\nvar State;\n(function (State) {\n    State[State[\"Idle\"] = 0] = \"Idle\";\n    State[State[\"Working\"] = 1] = \"Working\";\n    State[State[\"StopRequested\"] = 2] = \"StopRequested\";\n})(State || (State = {}));\nclass RenderLoop {\n    constructor(options = {}) {\n        this.lastTimestamp = null;\n        this.state = State.Idle;\n        this.loop = (timestamp = null) => {\n            var _a, _b;\n            if (this.state === State.Idle) {\n                return;\n            }\n            if (this.state === State.StopRequested) {\n                this.state = State.Idle;\n                return;\n            }\n            const idealDeltaTime = this.getIdealDeltaTime();\n            // For the very first run loop() is called from the code and timestamp is\n            // not known. On the second call loop() is called by requestAnimationFrame,\n            // which also provides a timestamp.\n            // Use ideal fixed delta value for the first run.\n            let deltaTime = idealDeltaTime;\n            if (timestamp !== null) {\n                // Timestamp is originally in milliseconds, convert to seconds\n                const deltaTimestamp = timestamp - this.lastTimestamp;\n                if (Math.round(this.getFpsInterval()) - Math.round(deltaTimestamp) > 2) {\n                    window.requestAnimationFrame(this.loop);\n                    return;\n                }\n                deltaTime = deltaTimestamp / 1000;\n                // If delta is too large, we must have resumed from stop() or breakpoint.\n                // Use ideal default delta only for this frame.\n                if (deltaTime > this.options.deltaTimeLimit) {\n                    deltaTime = idealDeltaTime;\n                }\n            }\n            this.lastTimestamp = timestamp;\n            const time = timestamp / 1000;\n            (_b = (_a = this.options).onTick) === null || _b === void 0 ? void 0 : _b.call(_a, { deltaTime, time });\n            window.requestAnimationFrame(this.loop);\n        };\n        this.options = Object.assign({}, DEFAULT_OPTIONS, options);\n    }\n    start() {\n        if (this.state !== State.Idle) {\n            return;\n        }\n        this.state = State.Working;\n        this.loop();\n    }\n    // WARNING: a couple of already queued callbacks might still fire after stop\n    stop() {\n        if (this.state !== State.Working) {\n            return;\n        }\n        this.state = State.StopRequested;\n    }\n    // For manual stepping over frames when loop is paused\n    next(ticks = 1) {\n        var _a, _b;\n        for (let i = 0; i < ticks; i += 1) {\n            (_b = (_a = this.options).onTick) === null || _b === void 0 ? void 0 : _b.call(_a, {\n                deltaTime: this.getIdealDeltaTime(),\n                time: 0,\n            });\n        }\n    }\n    getFpsInterval() {\n        return 1000 / this.options.fps;\n    }\n    getIdealDeltaTime() {\n        return 1 / this.options.fps;\n    }\n}\n\n\n//# sourceURL=webpack:///./src/loop.ts?");

/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _loop__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./loop */ \"./src/loop.ts\");\n/* harmony import */ var _tempo__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tempo */ \"./src/tempo.ts\");\n/* harmony import */ var _renderer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./renderer */ \"./src/renderer.ts\");\n/* harmony import */ var _nodes_rect_pulse__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./nodes/rect_pulse */ \"./src/nodes/rect_pulse.ts\");\n/* harmony import */ var _shader__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./shader */ \"./src/shader.ts\");\n/* harmony import */ var _program__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./program */ \"./src/program.ts\");\n/* harmony import */ var _nodes_circle_pulse__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./nodes/circle_pulse */ \"./src/nodes/circle_pulse.ts\");\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\n\n\n\n\n\n\n\nconst WIDTH = 800;\nconst HEIGHT = 600;\nconst canvas = document.createElement('canvas');\ncanvas.width = WIDTH;\ncanvas.height = HEIGHT;\ndocument.body.appendChild(canvas);\nconst gl = canvas.getContext('webgl');\nconst fullscreenButton = document.getElementById('fullscreen-btn');\nfullscreenButton.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {\n    yield canvas.requestFullscreen();\n}));\nconst bpmInput = document.getElementById('bpm-input');\nbpmInput.addEventListener('change', () => { });\nfunction update({ time, deltaTime }) {\n    const bpm = Number(bpmInput.value);\n    tempoTracker.setBpm(bpm);\n    tempoTracker.update({ deltaTime });\n    const beatProgress = tempoTracker.getBeatProgress();\n    renderer.update({ nodes, time, beatProgress });\n}\nfunction draw() {\n    renderer.draw({ nodes });\n}\nfunction tick({ time, deltaTime }) {\n    update({ time, deltaTime });\n    draw();\n}\nconst nodes = [\n    new _nodes_circle_pulse__WEBPACK_IMPORTED_MODULE_6__.CirclePulse(0, 0, 50, [1, 1, 0, 1], 'beat16th'),\n    new _nodes_circle_pulse__WEBPACK_IMPORTED_MODULE_6__.CirclePulse(0, 0, 50, [1, 1, 0, 1], 'beat8th'),\n    new _nodes_circle_pulse__WEBPACK_IMPORTED_MODULE_6__.CirclePulse(50, 0, 50, [1, 1, 0, 1], 'beat4th'),\n    new _nodes_circle_pulse__WEBPACK_IMPORTED_MODULE_6__.CirclePulse(100, 0, 50, [1, 1, 0, 1], 'beat2th'),\n    new _nodes_circle_pulse__WEBPACK_IMPORTED_MODULE_6__.CirclePulse(150, 0, 50, [1, 1, 0, 1], 'beat'),\n    new _nodes_circle_pulse__WEBPACK_IMPORTED_MODULE_6__.CirclePulse(200, 0, 50, [1, 1, 0, 1], 'beat2x'),\n    new _nodes_circle_pulse__WEBPACK_IMPORTED_MODULE_6__.CirclePulse(250, 0, 50, [1, 1, 0, 1], 'beat4x'),\n    new _nodes_circle_pulse__WEBPACK_IMPORTED_MODULE_6__.CirclePulse(300, 0, 50, [1, 1, 0, 1], 'beat8x'),\n    new _nodes_circle_pulse__WEBPACK_IMPORTED_MODULE_6__.CirclePulse(350, 0, 50, [1, 1, 0, 1], 'beat16x'),\n    new _nodes_circle_pulse__WEBPACK_IMPORTED_MODULE_6__.CirclePulse(400, 0, 50, [1, 1, 0, 1], 'beat32x'),\n    new _nodes_circle_pulse__WEBPACK_IMPORTED_MODULE_6__.CirclePulse(450, 150, 30, [1, 0, 1, 1]),\n    new _nodes_rect_pulse__WEBPACK_IMPORTED_MODULE_3__.RectPulse(200, 150, 100, 30, [0, 1, 0, 1]),\n    new _nodes_rect_pulse__WEBPACK_IMPORTED_MODULE_3__.RectPulse(250, 350, 70, 230, [0, 0, 1, 1]),\n];\nconst shaderLoader = new _shader__WEBPACK_IMPORTED_MODULE_4__.ShaderLoader(gl);\nconst programFactory = new _program__WEBPACK_IMPORTED_MODULE_5__.ProgramFactory(gl, shaderLoader);\nconst renderLoop = new _loop__WEBPACK_IMPORTED_MODULE_0__.RenderLoop({\n    onTick: tick,\n});\nconst tempoTracker = new _tempo__WEBPACK_IMPORTED_MODULE_1__.TempoTracker();\nconst renderer = new _renderer__WEBPACK_IMPORTED_MODULE_2__.Renderer(gl);\nfunction main() {\n    return __awaiter(this, void 0, void 0, function* () {\n        for (const node of nodes) {\n            yield node.load({ gl, programFactory });\n        }\n        // renderLoop.next();\n        renderLoop.start();\n    });\n}\nvoid main();\n\n\n//# sourceURL=webpack:///./src/main.ts?");

/***/ }),

/***/ "./src/nodes/circle_pulse.ts":
/*!***********************************!*\
  !*** ./src/nodes/circle_pulse.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   CirclePulse: () => (/* binding */ CirclePulse)\n/* harmony export */ });\n/* harmony import */ var _node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node */ \"./src/nodes/node.ts\");\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\n\nclass CirclePulse extends _node__WEBPACK_IMPORTED_MODULE_0__.Node {\n    constructor(x, y, size, color = [0, 0, 1, 1], beatKey = 'beat') {\n        super();\n        this.x = x;\n        this.y = y;\n        this.size = size;\n        this.color = color;\n        this.beatKey = beatKey;\n        const x1 = x;\n        const x2 = x + size;\n        const y1 = y;\n        const y2 = y + size;\n        this.vertices = [x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2];\n    }\n    load(_a) {\n        return __awaiter(this, arguments, void 0, function* ({ gl, programFactory }) {\n            const program = yield programFactory.create({\n                vertexShaderPath: 'nodes/circle_pulse.vert',\n                fragmentShaderPath: 'nodes/circle_pulse.frag',\n            });\n            this.program = program;\n            gl.useProgram(program);\n            this.vertexBuffer = gl.createBuffer();\n            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);\n            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);\n            this.vertexLocation = gl.getAttribLocation(program, 'aPosition');\n            gl.vertexAttribPointer(this.vertexLocation, 2, gl.FLOAT, false, 0, 0);\n            gl.enableVertexAttribArray(this.vertexLocation);\n            const resolutionLocation = gl.getUniformLocation(program, 'uResolution');\n            gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);\n            const dimensionsLocation = gl.getUniformLocation(program, 'uDimensions');\n            gl.uniform2f(dimensionsLocation, this.size, this.size);\n            const positionLocation = gl.getUniformLocation(program, 'uPosition');\n            gl.uniform2f(positionLocation, this.x, this.y);\n            const colorLocation = gl.getUniformLocation(program, 'uColor');\n            gl.uniform4f(colorLocation, ...this.color);\n            this.progressLocation = gl.getUniformLocation(program, 'uProgress');\n        });\n    }\n    update({ gl, time, beatProgress }) {\n        gl.useProgram(this.program);\n        gl.uniform1f(this.timeLocation, time);\n        gl.uniform1f(this.progressLocation, beatProgress[this.beatKey]);\n    }\n    draw({ gl }) {\n        gl.useProgram(this.program);\n        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);\n        gl.vertexAttribPointer(this.vertexLocation, 2, gl.FLOAT, false, 0, 0);\n        gl.drawArrays(gl.TRIANGLES, 0, 6);\n    }\n}\n\n\n//# sourceURL=webpack:///./src/nodes/circle_pulse.ts?");

/***/ }),

/***/ "./src/nodes/node.ts":
/*!***************************!*\
  !*** ./src/nodes/node.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Node: () => (/* binding */ Node)\n/* harmony export */ });\nclass Node {\n}\n\n\n//# sourceURL=webpack:///./src/nodes/node.ts?");

/***/ }),

/***/ "./src/nodes/rect_pulse.ts":
/*!*********************************!*\
  !*** ./src/nodes/rect_pulse.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   RectPulse: () => (/* binding */ RectPulse)\n/* harmony export */ });\n/* harmony import */ var _node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node */ \"./src/nodes/node.ts\");\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\n\nclass RectPulse extends _node__WEBPACK_IMPORTED_MODULE_0__.Node {\n    constructor(x, y, width, height, color = [0, 0, 1, 1]) {\n        super();\n        this.x = x;\n        this.y = y;\n        this.width = width;\n        this.height = height;\n        this.color = color;\n        const x1 = x;\n        const x2 = x + width;\n        const y1 = y;\n        const y2 = y + height;\n        this.vertices = [x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2];\n    }\n    load(_a) {\n        return __awaiter(this, arguments, void 0, function* ({ gl, programFactory }) {\n            const program = yield programFactory.create({\n                vertexShaderPath: 'nodes/rect_pulse.vert',\n                fragmentShaderPath: 'nodes/rect_pulse.frag',\n            });\n            this.program = program;\n            gl.useProgram(program);\n            this.vertexBuffer = gl.createBuffer();\n            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);\n            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);\n            this.vertexLocation = gl.getAttribLocation(program, 'aPosition');\n            gl.vertexAttribPointer(this.vertexLocation, 2, gl.FLOAT, false, 0, 0);\n            gl.enableVertexAttribArray(this.vertexLocation);\n            this.resolutionLocation = gl.getUniformLocation(program, 'uResolution');\n            gl.uniform2f(this.resolutionLocation, gl.canvas.width, gl.canvas.height);\n            this.dimensionsLocation = gl.getUniformLocation(program, 'uDimensions');\n            gl.uniform2f(this.dimensionsLocation, this.width, this.height);\n            this.positionLocation = gl.getUniformLocation(program, 'uPosition');\n            gl.uniform2f(this.positionLocation, this.x, this.y);\n            this.colorLocation = gl.getUniformLocation(program, 'uColor');\n            gl.uniform4f(this.colorLocation, ...this.color);\n            this.progressLocation = gl.getUniformLocation(program, 'uProgress');\n        });\n    }\n    update({ gl, beatProgress }) {\n        gl.useProgram(this.program);\n        gl.uniform1f(this.progressLocation, beatProgress.beat);\n    }\n    draw({ gl }) {\n        gl.useProgram(this.program);\n        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);\n        gl.vertexAttribPointer(this.vertexLocation, 2, gl.FLOAT, false, 0, 0);\n        gl.drawArrays(gl.TRIANGLES, 0, 6);\n    }\n}\n\n\n//# sourceURL=webpack:///./src/nodes/rect_pulse.ts?");

/***/ }),

/***/ "./src/program.ts":
/*!************************!*\
  !*** ./src/program.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ProgramFactory: () => (/* binding */ ProgramFactory)\n/* harmony export */ });\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nclass ProgramFactory {\n    constructor(gl, shaderLoader) {\n        this.gl = gl;\n        this.shaderLoader = shaderLoader;\n    }\n    create(_a) {\n        return __awaiter(this, arguments, void 0, function* ({ vertexShaderPath, fragmentShaderPath, }) {\n            const { gl } = this;\n            const shaders = yield this.shaderLoader.load([\n                vertexShaderPath,\n                fragmentShaderPath,\n            ]);\n            const program = gl.createProgram();\n            for (const shader of shaders) {\n                gl.attachShader(program, shader);\n            }\n            gl.linkProgram(program);\n            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {\n                const error = gl.getProgramInfoLog(program);\n                gl.deleteProgram(program);\n                throw new Error(`Program error: ${error}`);\n            }\n            return program;\n        });\n    }\n}\n\n\n//# sourceURL=webpack:///./src/program.ts?");

/***/ }),

/***/ "./src/renderer.ts":
/*!*************************!*\
  !*** ./src/renderer.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Renderer: () => (/* binding */ Renderer)\n/* harmony export */ });\nclass Renderer {\n    constructor(gl) {\n        this.gl = gl;\n    }\n    update({ nodes, beatProgress, time, }) {\n        const { gl } = this;\n        for (const node of nodes) {\n            node.update({ gl, beatProgress, time });\n        }\n    }\n    draw({ nodes }) {\n        const { gl } = this;\n        gl.useProgram(null);\n        gl.clearColor(0, 0, 0, 1);\n        gl.clear(gl.COLOR_BUFFER_BIT);\n        for (const node of nodes) {\n            node.draw({ gl });\n        }\n    }\n}\n\n\n//# sourceURL=webpack:///./src/renderer.ts?");

/***/ }),

/***/ "./src/shader.ts":
/*!***********************!*\
  !*** ./src/shader.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ShaderLoader: () => (/* binding */ ShaderLoader)\n/* harmony export */ });\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nclass ShaderLoader {\n    constructor(gl) {\n        this.gl = gl;\n        this.cache = new Map();\n    }\n    load(paths) {\n        return __awaiter(this, void 0, void 0, function* () {\n            return Promise.all(paths.map((path) => this.loadOne(path)));\n        });\n    }\n    loadOne(path) {\n        return __awaiter(this, void 0, void 0, function* () {\n            if (this.cache.has(path)) {\n                return this.cache.get(path);\n            }\n            const response = yield fetch(path);\n            const source = yield response.text();\n            const { gl } = this;\n            const type = this.getShaderType(path);\n            const shader = gl.createShader(type);\n            gl.shaderSource(shader, source);\n            gl.compileShader(shader);\n            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {\n                const errorText = gl.getShaderInfoLog(shader);\n                gl.deleteShader(shader);\n                throw new Error(`Shader error: ${errorText}`);\n            }\n            this.cache.set(path, shader);\n            return shader;\n        });\n    }\n    getShaderType(path) {\n        const ext = path.slice(path.lastIndexOf('.'));\n        switch (ext) {\n            case '.frag':\n                return this.gl.FRAGMENT_SHADER;\n            case '.vert':\n                return this.gl.VERTEX_SHADER;\n            default:\n                throw new Error(`Unknown shader extension: \"${ext}\"`);\n        }\n    }\n}\n\n\n//# sourceURL=webpack:///./src/shader.ts?");

/***/ }),

/***/ "./src/tempo.ts":
/*!**********************!*\
  !*** ./src/tempo.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   TempoTracker: () => (/* binding */ TempoTracker)\n/* harmony export */ });\nclass TempoTracker {\n    constructor() {\n        // must be equal to the max number of beats multiplier \"x\"\n        this.scale = 32;\n        this.bpm = 0;\n        this.beatInterval = 0;\n        this.scaledInterval = 0;\n        this.lastBeatOverflow = 0;\n    }\n    setBpm(bpm) {\n        this.bpm = bpm;\n        this.beatInterval = 60 / bpm;\n        this.scaledInterval = this.beatInterval * this.scale;\n    }\n    update({ deltaTime }) {\n        if (this.beatInterval === 0) {\n            throw new Error('Beat interval cannot be 0');\n        }\n        const accumulated = this.lastBeatOverflow + deltaTime;\n        if (accumulated < this.scaledInterval) {\n            this.lastBeatOverflow += deltaTime;\n            return;\n        }\n        this.lastBeatOverflow = accumulated % this.scaledInterval;\n    }\n    getBeatProgress() {\n        return {\n            beat: this.calcX(1),\n            beat2x: this.calcX(2),\n            beat4x: this.calcX(4),\n            beat8x: this.calcX(8),\n            beat16x: this.calcX(16),\n            beat32x: this.calcX(32),\n            beat2th: this.calcTh(2),\n            beat4th: this.calcTh(4),\n            beat8th: this.calcTh(8),\n            beat16th: this.calcTh(16),\n        };\n    }\n    calcX(bars) {\n        const scaledBeat = this.lastBeatOverflow / this.scaledInterval;\n        return ((scaledBeat * this.scale) / bars) % 1;\n    }\n    calcTh(th) {\n        const beat = this.calcX(1);\n        return (beat * th) % 1;\n    }\n}\n\n\n//# sourceURL=webpack:///./src/tempo.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main.ts");
/******/ 	
/******/ })()
;