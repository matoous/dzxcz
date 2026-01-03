(() => {
  const canvas = document.getElementById("glcanvas");
  const gl = canvas.getContext("webgl", {antialias: true, alpha: true});
  if (!gl) {
    document.body.innerHTML =
      "WebGL is not available in this browser. Try Chrome or Firefox.";
    return;
  }

  const SCALE = 3000; // 1 unit = 3000 km (smaller geometry for wider view)
  const EARTH_RADIUS_KM = 6371;
  const GPS_ORBITAL_HEIGHT = 20180;
  const GALILEO_ORBITAL_HEIGHT = 23222;
  const GLONASS_ORBITAL_HEIGHT = 19100;
  const BEIDOU_ORBITAL_HEIGHT = 21500;
  const EARTH_RADIUS = EARTH_RADIUS_KM / SCALE;
  const GPS_ORBITAL_HEIGHT_UNITS = GPS_ORBITAL_HEIGHT / SCALE;
  const GALILEO_ORBITAL_HEIGHT_UNITS = GALILEO_ORBITAL_HEIGHT / SCALE;
  const GLONASS_ORBITAL_HEIGHT_UNITS = GLONASS_ORBITAL_HEIGHT / SCALE;
  const BEIDOU_ORBITAL_HEIGHT_UNITS = BEIDOU_ORBITAL_HEIGHT / SCALE;
  const orbitScaleSlider = document.getElementById("orbit-scale");
  const orbitScaleValue = document.getElementById("orbit-scale-value");
  const DEFAULT_ORBIT_SCALE =
    orbitScaleSlider && !Number.isNaN(parseFloat(orbitScaleSlider.value))
      ? parseFloat(orbitScaleSlider.value)
      : 1;
  const computeOrbitRadius = (heightUnits, scale) =>
    EARTH_RADIUS + heightUnits * scale;
  const SAT_SPEED_KM_S = 7.8;
  const TIME_SCALE = 120; // shared scaling for orbit period
  const SIGNAL_BASE_REAL_RATE = 50; // desired spawn attempts per real second
  const SIGNAL_RATE_DIVIDER = 100; // tweakable slowdown factor
  const SIGNAL_REAL_RATE = SIGNAL_BASE_REAL_RATE / SIGNAL_RATE_DIVIDER;
  const SIGNAL_REAL_INTERVAL = 1 / SIGNAL_REAL_RATE;
  const SIGNAL_SPEED_SLOWDOWN = 10;
  const SIGNAL_BASE_SPEED = 0.3; // units per second (~300 km/s)
  const SIGNAL_SPEED = SIGNAL_BASE_SPEED / SIGNAL_SPEED_SLOWDOWN;
  const SIGNAL_MAX_RADIUS = 1000; // units before fading
  const SIGNAL_OUTLINE_SEGMENTS = 64;
  const EARTH_CENTER = new Float32Array([0, 0, 0]);
  const ORBIT_LINE_SEGMENTS = 128;
  const GPS_ORBIT_COLORS = [
    [0.95, 0.45, 0.45, 1.0],
    [0.45, 0.75, 0.95, 1.0],
    [0.5, 0.95, 0.65, 1.0],
    [0.95, 0.8, 0.45, 1.0],
    [0.75, 0.6, 0.95, 1.0],
  ];
  const GALILEO_ORBIT_COLORS = [
    [0.9, 0.95, 0.5, 1.0],
    [0.95, 0.6, 0.8, 1.0],
    [0.55, 0.9, 0.95, 1.0],
  ];
  const GLONASS_ORBIT_COLORS = [
    [0.95, 0.75, 0.5, 1.0],
    [0.65, 0.85, 0.95, 1.0],
    [0.85, 0.55, 0.85, 1.0],
  ];
  const BEIDOU_ORBIT_COLORS = [
    [0.55, 0.8, 0.95, 1.0],
    [0.65, 0.95, 0.7, 1.0],
    [0.95, 0.85, 0.65, 1.0],
  ];
  const CONSTELLATION_CONFIGS = [
    {
      id: "gps",
      label: "GPS",
      toggleId: "toggle-gps",
      orbitHeightKm: GPS_ORBITAL_HEIGHT,
      orbitHeightUnits: GPS_ORBITAL_HEIGHT_UNITS,
      inclinationDeg: 55,
      planes: 5,
      satsPerPlane: 6,
      colorPalette: GPS_ORBIT_COLORS,
    },
    {
      id: "galileo",
      label: "Galileo",
      toggleId: "toggle-galileo",
      orbitHeightKm: GALILEO_ORBITAL_HEIGHT,
      orbitHeightUnits: GALILEO_ORBITAL_HEIGHT_UNITS,
      inclinationDeg: 56,
      planes: 3,
      satsPerPlane: 8,
      colorPalette: GALILEO_ORBIT_COLORS,
    },
    {
      id: "glonass",
      label: "GLONASS",
      toggleId: "toggle-glonass",
      orbitHeightKm: GLONASS_ORBITAL_HEIGHT,
      orbitHeightUnits: GLONASS_ORBITAL_HEIGHT_UNITS,
      inclinationDeg: 64.8,
      planes: 3,
      satsPerPlane: 8,
      colorPalette: GLONASS_ORBIT_COLORS,
    },
    {
      id: "beidou",
      label: "BeiDou",
      toggleId: "toggle-beidou",
      orbitHeightKm: BEIDOU_ORBITAL_HEIGHT,
      orbitHeightUnits: BEIDOU_ORBITAL_HEIGHT_UNITS,
      inclinationDeg: 55,
      planes: 3,
      satsPerPlane: 8,
      colorPalette: BEIDOU_ORBIT_COLORS,
    },
  ];

  const Mat4 = {
    create() {
      const out = new Float32Array(16);
      out[0] = out[5] = out[10] = out[15] = 1;
      return out;
    },
    perspective(out, fovy, aspect, near, far) {
      const f = 1.0 / Math.tan(fovy / 2);
      out[0] = f / aspect;
      out[1] = out[2] = out[3] = 0;
      out[5] = f;
      out[4] = out[6] = out[7] = 0;
      out[8] = out[9] = 0;
      out[10] = (far + near) / (near - far);
      out[11] = -1;
      out[12] = out[13] = 0;
      out[14] = (2 * far * near) / (near - far);
      out[15] = 0;
      return out;
    },
    lookAt(out, eye, center, up) {
      const x0 = eye[0],
        x1 = eye[1],
        x2 = eye[2];
      let zx = x0 - center[0];
      let zy = x1 - center[1];
      let zz = x2 - center[2];
      let len = Math.hypot(zx, zy, zz);
      if (!len) {
        zx = 0;
        zy = 0;
        zz = 1;
      } else {
        zx /= len;
        zy /= len;
        zz /= len;
      }
      let xx = up[1] * zz - up[2] * zy;
      let xy = up[2] * zx - up[0] * zz;
      let xz = up[0] * zy - up[1] * zx;
      len = Math.hypot(xx, xy, xz);
      if (!len) {
        xx = 0;
        xy = 0;
        xz = 0;
      } else {
        xx /= len;
        xy /= len;
        xz /= len;
      }
      let yx = zy * xz - zz * xy;
      let yy = zz * xx - zx * xz;
      let yz = zx * xy - zy * xx;
      len = Math.hypot(yx, yy, yz);
      if (len) {
        yx /= len;
        yy /= len;
        yz /= len;
      }
      out[0] = xx;
      out[1] = yx;
      out[2] = zx;
      out[3] = 0;
      out[4] = xy;
      out[5] = yy;
      out[6] = zy;
      out[7] = 0;
      out[8] = xz;
      out[9] = yz;
      out[10] = zz;
      out[11] = 0;
      out[12] = -(xx * x0 + xy * x1 + xz * x2);
      out[13] = -(yx * x0 + yy * x1 + yz * x2);
      out[14] = -(zx * x0 + zy * x1 + zz * x2);
      out[15] = 1;
      return out;
    },
  };

  function sphereSphereIntersection(centerA, radiusA, centerB, radiusB) {
    const dx = centerB[0] - centerA[0];
    const dy = centerB[1] - centerA[1];
    const dz = centerB[2] - centerA[2];
    const distance = Math.hypot(dx, dy, dz);
    if (
      distance > radiusA + radiusB ||
      distance < Math.abs(radiusA - radiusB) ||
      distance === 0
    ) {
      return null;
    }
    const invDist = 1 / distance;
    const normal = [dx * invDist, dy * invDist, dz * invDist];
    const a =
      (radiusA * radiusA - radiusB * radiusB + distance * distance) /
      (2 * distance);
    const circleCenter = [
      centerA[0] + normal[0] * a,
      centerA[1] + normal[1] * a,
      centerA[2] + normal[2] * a,
    ];
    const circleRadius = Math.sqrt(Math.max(radiusA * radiusA - a * a, 0));
    if (!isFinite(circleRadius) || circleRadius <= 0) {
      return null;
    }
    return {center: circleCenter, normal, radius: circleRadius};
  }

  function orthonormalBasis(normal) {
    let tangent = [normal[1], -normal[0], 0];
    let len = Math.hypot(tangent[0], tangent[1], tangent[2]);
    if (len < 1e-5) {
      tangent = [0, normal[2], -normal[1]];
      len = Math.hypot(tangent[0], tangent[1], tangent[2]);
    }
    tangent = tangent.map((v) => v / len);
    let bitangent = [
      normal[1] * tangent[2] - normal[2] * tangent[1],
      normal[2] * tangent[0] - normal[0] * tangent[2],
      normal[0] * tangent[1] - normal[1] * tangent[0],
    ];
    const bitLen = Math.hypot(bitangent[0], bitangent[1], bitangent[2]);
    if (bitLen > 0) {
      bitangent = bitangent.map((v) => v / bitLen);
    }
    return {tangent, bitangent};
  }

  function tangentDistance(point, sphereCenter, sphereRadius) {
    const dx = point[0] - sphereCenter[0];
    const dy = point[1] - sphereCenter[1];
    const dz = point[2] - sphereCenter[2];
    const d = Math.hypot(dx, dy, dz);
    if (d <= sphereRadius) {
      return sphereRadius;
    }
    return Math.sqrt(Math.max(d * d - sphereRadius * sphereRadius, 0));
  }

  function cross(a, b) {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0],
    ];
  }

  function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  function normalizeVector(vec) {
    const len = Math.hypot(vec[0], vec[1], vec[2]);
    if (len < 1e-5) {
      return [0, 0, 0];
    }
    return [vec[0] / len, vec[1] / len, vec[2] / len];
  }

  function computeAngularVelocity(orbitalHeightKm) {
    return SAT_SPEED_KM_S / (EARTH_RADIUS_KM + orbitalHeightKm);
  }

  function rotateVectorAroundAxis(vector, axis, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const dotAV = dot(axis, vector);
    const crossAV = cross(axis, vector);
    return [
      vector[0] * cos + crossAV[0] * sin + axis[0] * dotAV * (1 - cos),
      vector[1] * cos + crossAV[1] * sin + axis[1] * dotAV * (1 - cos),
      vector[2] * cos + crossAV[2] * sin + axis[2] * dotAV * (1 - cos),
    ];
  }

  class Satellite {
    constructor(
      gl,
      orbitRadius,
      angularVelocity,
      {axis, initialDirection, speedSign = 1, orbitSegments = ORBIT_LINE_SEGMENTS} = {}
    ) {
      this.gl = gl;
      this.orbitRadius = orbitRadius;
      this.angularVelocity = angularVelocity;
      this.axis = axis;
      this.speedSign = speedSign;
      this.initialDirection = new Float32Array(initialDirection);
      this.orbitSegments = orbitSegments;
      this.positionBuffer = gl.createBuffer();
      this.orbitBuffer = gl.createBuffer();
      this.orbitVertexCount = orbitSegments;
      this.setOrbitRadius(orbitRadius);
    }

    setOrbitRadius(orbitRadius) {
      this.orbitRadius = orbitRadius;
      this.initial = new Float32Array([
        this.initialDirection[0] * orbitRadius,
        this.initialDirection[1] * orbitRadius,
        this.initialDirection[2] * orbitRadius,
      ]);
      this.axisDotInitial = dot(this.axis, this.initial);
      this.axisCrossInitial = cross(this.axis, this.initial);
      this.position = new Float32Array(this.initial);
      this._buildOrbitPath();
    }

    update(elapsedSeconds) {
      const angle = this.angularVelocity * this.speedSign * elapsedSeconds;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const dotTerm = this.axisDotInitial * (1 - cos);
      for (let i = 0; i < 3; i++) {
        this.position[i] =
          this.initial[i] * cos +
          this.axisCrossInitial[i] * sin +
          this.axis[i] * dotTerm;
      }
      this._refreshBuffers();
    }

    _refreshBuffers() {
      const gl = this.gl;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.position, gl.DYNAMIC_DRAW);
    }

    _buildOrbitPath() {
      const gl = this.gl;
      const positions = new Float32Array(this.orbitSegments * 3);
      const baseVector = this.initial;
      const axis = this.axis;
      let offset = 0;
      for (let i = 0; i < this.orbitSegments; i++) {
        const angle = (i / this.orbitSegments) * 2 * Math.PI;
        const rotated = rotateVectorAroundAxis(baseVector, axis, angle);
        positions[offset++] = rotated[0];
        positions[offset++] = rotated[1];
        positions[offset++] = rotated[2];
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, this.orbitBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
      this.orbitVertexCount = this.orbitSegments;
    }

    drawOrbit(attribLocation, uniforms, viewMatrix, color) {
      const gl = this.gl;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.orbitBuffer);
      gl.vertexAttribPointer(attribLocation, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(attribLocation);
      gl.uniformMatrix4fv(uniforms.modelView, false, viewMatrix);
      gl.uniform4fv(uniforms.color, color);
      gl.uniform1f(uniforms.shaded, 0.0);
      gl.drawArrays(gl.LINE_LOOP, 0, this.orbitVertexCount);
    }

    draw(attribLocation, uniforms, viewMatrix, color) {
      const gl = this.gl;

      gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
      gl.vertexAttribPointer(attribLocation, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(attribLocation);
      gl.uniformMatrix4fv(uniforms.modelView, false, viewMatrix);
      gl.uniform4fv(uniforms.color, color);
      gl.uniform1f(uniforms.shaded, 0.0);
      gl.drawArrays(gl.POINTS, 0, 1);
    }
  }

  class Signal {
    constructor(gl, origin, startTime) {
      this.gl = gl;
      this.origin = new Float32Array(origin);
      this.startTime = startTime;
      this.radius = 0;
      this.active = true;
      this.segments = SIGNAL_OUTLINE_SEGMENTS;
      this.intersectionPositions = new Float32Array(this.segments * 3);
      this.intersectionBuffer = gl.createBuffer();
      this.hasIntersection = false;
      this.tangentLimit = tangentDistance(this.origin, EARTH_CENTER, EARTH_RADIUS);
    }

    update(currentTime) {
      if (!this.active) {
        return;
      }
      const age = currentTime - this.startTime;
      this.radius = Math.max(age * SIGNAL_SPEED, 0);
      if (
        this.radius > SIGNAL_MAX_RADIUS ||
        this.radius > this.tangentLimit
      ) {
        this.active = false;
        return;
      }
      this._updateIntersection();
    }

    _updateIntersection() {
      const intersection = sphereSphereIntersection(
        this.origin,
        this.radius,
        EARTH_CENTER,
        EARTH_RADIUS
      );
      this.hasIntersection = !!intersection;
      if (!intersection) {
        return;
      }
      const {tangent, bitangent} = orthonormalBasis(intersection.normal);
      const step = (2 * Math.PI) / this.segments;
      let offset = 0;
      for (let i = 0; i < this.segments; i++) {
        const angle = i * step;
        const cos = Math.cos(angle) * intersection.radius;
        const sin = Math.sin(angle) * intersection.radius;
        const x =
          intersection.center[0] +
          tangent[0] * cos +
          bitangent[0] * sin;
        const y =
          intersection.center[1] +
          tangent[1] * cos +
          bitangent[1] * sin;
        const z =
          intersection.center[2] +
          tangent[2] * cos +
          bitangent[2] * sin;
        this.intersectionPositions[offset++] = x;
        this.intersectionPositions[offset++] = y;
        this.intersectionPositions[offset++] = z;
      }
      const gl = this.gl;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.intersectionBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        this.intersectionPositions,
        gl.DYNAMIC_DRAW
      );
    }

    draw(attribLocation, uniforms, viewMatrix, color) {
      if (!this.active || !this.hasIntersection) {
        return;
      }
      const gl = this.gl;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.intersectionBuffer);
      gl.vertexAttribPointer(attribLocation, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(attribLocation);
      gl.uniformMatrix4fv(uniforms.modelView, false, viewMatrix);
      gl.uniform4fv(uniforms.color, color);
      gl.uniform1f(uniforms.shaded, 0.0);
      gl.drawArrays(gl.LINE_LOOP, 0, this.segments);
    }
  }

  class Constellation {
    constructor(gl, config, orbitScale, toggleElement) {
      this.gl = gl;
      this.config = config;
      this.toggleElement = toggleElement;
      this.entries = [];
      this.visible = true;
      this.setOrbitScale(orbitScale);
      this._setupToggle();
    }

    setOrbitScale(scale) {
      this.lastOrbitScale = scale;
      const orbitRadius = computeOrbitRadius(
        this.config.orbitHeightUnits,
        scale
      );
      if (this.entries.length === 0) {
        this.entries = this._createEntries(orbitRadius);
        return;
      }
      this.entries.forEach((entry) => {
        entry.satellite.setOrbitRadius(orbitRadius);
        entry.signals = [];
        entry.lastSignalRealTime = -SIGNAL_REAL_INTERVAL;
      });
    }

    update(realElapsed, simElapsed) {
      if (!this.visible) {
        return;
      }
      this.entries.forEach((entry) => {
        entry.satellite.update(simElapsed);
        if (realElapsed - entry.lastSignalRealTime >= SIGNAL_REAL_INTERVAL) {
          entry.signals.push(
            new Signal(this.gl, entry.satellite.position, simElapsed)
          );
          entry.lastSignalRealTime = realElapsed;
        }
        entry.signals.forEach((signal) => signal.update(simElapsed));
        for (let i = entry.signals.length - 1; i >= 0; i--) {
          if (!entry.signals[i].active) {
            entry.signals.splice(i, 1);
          }
        }
      });
    }

    drawOrbits(attribLocation, uniforms, viewMatrix) {
      if (!this.visible) {
        return;
      }
      this.entries.forEach((entry) =>
        entry.satellite.drawOrbit(
          attribLocation,
          uniforms,
          viewMatrix,
          entry.colors.orbit
        )
      );
    }

    drawSignals(attribLocation, uniforms, viewMatrix) {
      if (!this.visible) {
        return;
      }
      this.entries.forEach((entry) =>
        entry.signals.forEach((signal) =>
          signal.draw(attribLocation, uniforms, viewMatrix, entry.colors.point)
        )
      );
    }

    drawSatellites(attribLocation, uniforms, viewMatrix) {
      if (!this.visible) {
        return;
      }
      this.entries.forEach((entry) =>
        entry.satellite.draw(
          attribLocation,
          uniforms,
          viewMatrix,
          entry.colors.point
        )
      );
    }

    clearSignals() {
      this.entries.forEach((entry) => (entry.signals = []));
    }

    _createEntries(orbitRadius) {
      const entries = [];
      const planeSpacing = (2 * Math.PI) / this.config.planes;
      const inclinationRad = (this.config.inclinationDeg * Math.PI) / 180;
      const angularVelocity = computeAngularVelocity(this.config.orbitHeightKm);
      for (let plane = 0; plane < this.config.planes; plane++) {
        const raan = plane * planeSpacing;
        const axis = new Float32Array(
          normalizeVector([
            Math.sin(inclinationRad) * Math.sin(raan),
            Math.cos(inclinationRad),
            -Math.sin(inclinationRad) * Math.cos(raan),
          ])
        );
        const nodeDirection = new Float32Array(
          normalizeVector([Math.cos(raan), 0, Math.sin(raan)])
        );
        const perpendicular = new Float32Array(
          normalizeVector(cross(axis, nodeDirection))
        );
        const color =
          this.config.colorPalette[plane % this.config.colorPalette.length];
        for (let sat = 0; sat < this.config.satsPerPlane; sat++) {
          const phase = (2 * Math.PI * sat) / this.config.satsPerPlane;
          const cosPhase = Math.cos(phase);
          const sinPhase = Math.sin(phase);
          const initialDirection = new Float32Array([
            nodeDirection[0] * cosPhase + perpendicular[0] * sinPhase,
            nodeDirection[1] * cosPhase + perpendicular[1] * sinPhase,
            nodeDirection[2] * cosPhase + perpendicular[2] * sinPhase,
          ]);
          entries.push({
            satellite: new Satellite(this.gl, orbitRadius, angularVelocity, {
              axis,
              initialDirection,
              speedSign: 1,
            }),
            colors: {
              point: new Float32Array(color),
              orbit: new Float32Array([color[0], color[1], color[2], 0.4]),
            },
            signals: [],
            lastSignalRealTime: -SIGNAL_REAL_INTERVAL,
          });
        }
      }
      return entries;
    }

    _setupToggle() {
      if (!this.toggleElement || typeof this.toggleElement.checked !== "boolean") {
        this.visible = true;
        return;
      }
      this.visible = this.toggleElement.checked;
      this.toggleElement.addEventListener("change", () => {
        this.visible = this.toggleElement.checked;
        if (!this.visible) {
          this.clearSignals();
        }
      });
    }
  }

  function buildSphere(radius, latBands, lonBands) {
    const positions = [];
    const indices = [];
    for (let lat = 0; lat <= latBands; lat++) {
      const theta = (lat * Math.PI) / latBands;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let lon = 0; lon <= lonBands; lon++) {
        const phi = (lon * 2 * Math.PI) / lonBands;
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);
        const x = cosPhi * sinTheta;
        const y = cosTheta;
        const z = sinPhi * sinTheta;
        positions.push(radius * x, radius * y, radius * z);
      }
    }
    for (let lat = 0; lat < latBands; lat++) {
      for (let lon = 0; lon < lonBands; lon++) {
        const first = lat * (lonBands + 1) + lon;
        const second = first + lonBands + 1;
        indices.push(first, second, first + 1);
        indices.push(second, second + 1, first + 1);
      }
    }
    return {
      positions: new Float32Array(positions),
      indices: new Uint16Array(indices),
    };
  }

  function createShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vertexSrc = `
        attribute vec3 aPosition;
        uniform mat4 uProjection;
        uniform mat4 uModelView;
        uniform vec3 uLightDirection;
        uniform float uShaded;
        varying float vLighting;
        void main() {
          vec3 normal = normalize(aPosition);
          float lambert = max(dot(normal, normalize(uLightDirection)), 0.0);
          vLighting = mix(1.0, 0.3 + 0.7 * lambert, uShaded);
          gl_Position = uProjection * uModelView * vec4(aPosition, 1.0);
          gl_PointSize = 8.0;
        }
      `;

  const fragmentSrc = `
        precision mediump float;
        uniform vec4 uColor;
        varying float vLighting;
        void main() {
          gl_FragColor = vec4(uColor.rgb * vLighting, uColor.a);
        }
      `;

  const vertexShader = createShader(gl.VERTEX_SHADER, vertexSrc);
  const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentSrc);
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    return;
  }
  gl.useProgram(program);

  const attribPosition = gl.getAttribLocation(program, "aPosition");
  const uProjection = gl.getUniformLocation(program, "uProjection");
  const uModelView = gl.getUniformLocation(program, "uModelView");
  const uColor = gl.getUniformLocation(program, "uColor");
  const uLightDirection = gl.getUniformLocation(program, "uLightDirection");
  const uShaded = gl.getUniformLocation(program, "uShaded");

  const sphereData = buildSphere(EARTH_RADIUS, 48, 64);
  const sphereBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, sphereBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, sphereData.positions, gl.STATIC_DRAW);
  const sphereIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereIndexBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    sphereData.indices,
    gl.STATIC_DRAW
  );

  const constellations = CONSTELLATION_CONFIGS.map((config) => {
    const toggleElement = config.toggleId
      ? document.getElementById(config.toggleId)
      : null;
    return new Constellation(gl, config, DEFAULT_ORBIT_SCALE, toggleElement);
  });
  const uniforms = {
    modelView: uModelView,
    color: uColor,
    shaded: uShaded,
  };

  function updateOrbitScaleDisplay(scale) {
    if (orbitScaleValue) {
      orbitScaleValue.textContent = `${Math.round(scale * 100)}%`;
    }
  }

  function applyOrbitScale(scale) {
    constellations.forEach((constellation) =>
      constellation.setOrbitScale(scale)
    );
  }

  if (orbitScaleSlider) {
    orbitScaleSlider.addEventListener("input", (event) => {
      const scale = parseFloat(event.target.value);
      if (Number.isNaN(scale)) {
        return;
      }
      updateOrbitScaleDisplay(scale);
      applyOrbitScale(scale);
    });
  }
  updateOrbitScaleDisplay(DEFAULT_ORBIT_SCALE);

  function resizeCanvas() {
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const projectionMatrix = Mat4.create();
  const viewMatrix = Mat4.create();
  const lightDirection = new Float32Array([0.4, 0.6, 1.0]);
  const startTime = performance.now();

  function render(now) {
    resizeCanvas();
    const realElapsed = (now - startTime) / 1000;
    const simElapsed = realElapsed * TIME_SCALE;
    constellations.forEach((constellation) =>
      constellation.update(realElapsed, simElapsed)
    );

    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    Mat4.perspective(
      projectionMatrix,
      (45 * Math.PI) / 180,
      canvas.width / canvas.height,
      0.1,
      200
    );
    Mat4.lookAt(viewMatrix, [0, 3, 24], [0, 0, 0], [0, 1, 0]);

    gl.uniformMatrix4fv(uProjection, false, projectionMatrix);
    gl.uniform3fv(uLightDirection, lightDirection);

    // Earth
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereBuffer);
    gl.vertexAttribPointer(attribPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attribPosition);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereIndexBuffer);
    gl.uniformMatrix4fv(uModelView, false, viewMatrix);
    gl.uniform4f(uColor, 0.1, 0.6, 0.9, 0.6);
    gl.uniform1f(uShaded, 1.0);
    gl.drawElements(gl.TRIANGLES, sphereData.indices.length, gl.UNSIGNED_SHORT, 0);

    // Orbits
    constellations.forEach((constellation) =>
      constellation.drawOrbits(attribPosition, uniforms, viewMatrix)
    );

    // Signals
    constellations.forEach((constellation) =>
      constellation.drawSignals(attribPosition, uniforms, viewMatrix)
    );

    // Satellites
    constellations.forEach((constellation) =>
      constellation.drawSatellites(attribPosition, uniforms, viewMatrix)
    );

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
})();
