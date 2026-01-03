---
title: "GPS"
date: 2026-01-01
slug: gps
draft: false
tags: ["rust", "software", "learning", "writing"]
params:
  math: true
scripts:
  - gps.js
---

Inspiration: https://ciechanow.ski/gps/

Here’s a **receiver-level, engineering-friendly explanation** of how GPS works—from what satellites transmit, to what your device actually computes.

<div class="gps-constellation-demo" style="position: relative; height: 28rem; background-color: #222;">
  <canvas id="glcanvas" style="width: 100%; height: 100%; display: block;"></canvas>
  <div class="overlay" style="position: absolute; top: 0.75rem; left: 1rem; font-size: 0.85rem; letter-spacing: 0.05em; color: #ddd;">
    Scale: 1 unit = 1000 km &mdash; Time sped up &times;120 for clarity
  </div>
  <div class="gps-controls" style="position: absolute; bottom: 0.75rem; left: 1rem; right: 1rem; color: #ddd; font-size: 0.85rem;">
    <label for="orbit-scale" style="display: block; margin-bottom: 0.25rem;">Satellite height scale</label>
    <div style="display: flex; align-items: center; gap: 0.75rem;">
      <input id="orbit-scale" type="range" min="0.01" max="1" step="0.01" value="1" style="flex: 1;">
      <span id="orbit-scale-value" style="min-width: 3rem; text-align: right;">100%</span>
    </div>
    <div style="margin-top: 0.5rem;">
      <span style="display: block; margin-bottom: 0.25rem;">Constellations</span>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <label style="display: flex; align-items: center; gap: 0.35rem;">
          <input id="toggle-gps" type="checkbox" checked>
          GPS
        </label>
        <label style="display: flex; align-items: center; gap: 0.35rem;">
          <input id="toggle-galileo" type="checkbox">
          Galileo
        </label>
        <label style="display: flex; align-items: center; gap: 0.35rem;">
          <input id="toggle-glonass" type="checkbox">
          GLONASS
        </label>
        <label style="display: flex; align-items: center; gap: 0.35rem;">
          <input id="toggle-beidou" type="checkbox">
          BeiDou
        </label>
      </div>
    </div>
  </div>
</div>

## The GPS Constellation

![Image](https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Comparison_satellite_navigation_orbits.svg/1200px-Comparison_satellite_navigation_orbits.svg.png)

![Image](https://eos-gnss.com/wp-content/uploads/2023/04/GNSS-Infographic-1.png)

The **Global Positioning System (GPS)** is operated by the **United States Space Force** and consists of:

* ~31 **active satellites**
* **Medium Earth Orbit (MEO)** at ~20,200 km
* 6 orbital planes, inclined ~55°

Each satellite carries:

* **Atomic clocks** (cesium/rubidium)
* A precisely known orbit (ephemeris)
* A radio transmitter

Satellites continuously **broadcast**, they never listen.

The GNSS/RNSS landscape is bigger than GPS. Here are the constellations and augmentation systems that are either fully operational or offering initial services today:

| System | Operator | Coverage | Highlights |
| ------ | -------- | -------- | ---------- |
| [GPS](https://en.wikipedia.org/wiki/Global_Positioning_System) | United States Space Force | Global | ~31 MEO sats at 20,200 km; backbone for civil/military navigation worldwide |
| [GLONASS](https://en.wikipedia.org/wiki/GLONASS) | Roscosmos / Russian Aerospace Forces | Global | 24+ MEO sats at 19,100 km; FDMA/CDMA signals and strong high-latitude geometry |
| [Galileo](https://en.wikipedia.org/wiki/Galileo_(satellite_navigation)) | European Union / ESA | Global | 24 operational + 6 spares; open high-accuracy service with encrypted PRS channel |
| [BeiDou](https://en.wikipedia.org/wiki/BeiDou) | China Satellite Navigation Office | Global | 35-satellite hybrid (MEO, IGSO, GEO) constellation with two-way messaging |
| [QZSS](https://en.wikipedia.org/wiki/Quasi-Zenith_Satellite_System) | Japanese Cabinet Office / JAXA | Regional (East Asia + Pacific) | 7 satellites in Tundra-style orbits to improve availability in urban Japan |
| [NavIC](https://en.wikipedia.org/wiki/NavIC) | Indian Space Research Organisation | Regional (India + 1,500 km) | 7 IGSO/GEO sats; L1/L5/S-band civilian signals and encrypted military channel |
| [SBAS family](https://en.wikipedia.org/wiki/Satellite-based_augmentation_system) | WAAS (US), EGNOS (EU), MSAS (JP), GAGAN (IN), SDCM (RU) | Regional overlays | GEO relays broadcasting ionospheric/clock corrections and integrity for aviation |

*Notes:* QZSS and NavIC are often called **regional navigation satellite systems (RNSS)** rather than full GNSS because they focus on specific areas. SBAS constellations are not standalone navigation systems, but they significantly tighten accuracy by overlaying corrections on top of GPS/GNSS signals.

## What a GPS Satellite Actually Transmits

Each satellite transmits a **navigation signal** on multiple frequencies (e.g. L1 = 1575.42 MHz):

### PRN Code (Pseudo-Random Noise)

* A unique, satellite-specific binary sequence
* Allows the receiver to **identify** the satellite
* Enables **code correlation** (key to ranging)

### Navigation Message (50 BPS)

Contains:

* **Time of transmission** (per satellite atomic clock)
* **Ephemeris** (precise orbit for *this* satellite)
* **Clock correction parameters**
* **Almanac** (coarse orbits of all satellites)

This data repeats slowly (~12.5 min for full almanac).

## How Distance Is Measured (Pseudo-Range)

![Image](https://www.e-education.psu.edu/geog862/sites/www.e-education.psu.edu.geog862/files/images/Lesson01/TimeDifferences.png)

![Image](https://www.researchgate.net/publication/294886016/figure/fig12/AS%3A960358239977482%401605978655141/Representation-of-the-satellite-to-receiver-pseudorange-as-the-true-range-plus-the.gif)

![Image](https://www.e-education.psu.edu/geog862/sites/www.e-education.psu.edu.geog862/files/images/Lesson01/slide%2024.png)

The receiver:

1. Locally generates the same PRN code
2. Slides it in time until it **correlates** with the received signal
3. Measures the **time offset Δt**

Distance estimate:

$$
\text{range} \approx c \times \Delta t
$$

where the constant c denotes the speed of light

⚠️ This is called a **pseudo-range** because:

* Receiver clock is *not* atomic
* Atmospheric delays distort timing

## Why at least 4 Satellites Are Needed

![Image](https://gisgeography.com/wp-content/uploads/2018/04/GPS-Trilateration-Feature.jpg)

![Image](https://www.researchgate.net/publication/365959087/figure/fig2/AS%3A11431281104293393%401669991430951/D-Trilateration-and-3D-Triangulation.ppm)

![Image](https://www.researchgate.net/publication/286762446/figure/fig4/AS%3A668709005848582%401536444059625/The-Concept-of-GPS-point-positioning-4.png)

Unknowns:

* x, y, z (receiver position)
* δt (receiver clock error)

Each satellite gives **one equation**:

$$
\lVert \text{receiver\_position} - \text{satellite\_position} \rVert + \text{clock\_error}
$$

So:

* 3 satellites → position *if* clock were perfect
* **4 satellites → solve position + clock bias**

This is **trilateration**, not triangulation.

## Corrections Applied by the Receiver

To turn pseudo-ranges into meters:

### Clock Corrections

* Satellite clock drift (broadcast)
* Receiver clock bias (solved)

### Relativity

* Satellite clocks tick faster (weaker gravity)
* Slower due to orbital velocity
* Net correction ≈ **+38 µs/day**
* Pre-compensated in satellite clocks

### Atmospheric Delay

* **Ionosphere** (frequency-dependent)

  * Dual-frequency receivers cancel most of it
* **Troposphere**

  * Modeled from elevation angle, pressure

### Earth Effects

* Earth rotation during signal flight (**Sagnac effect**)

## Position Computation in Practice

Inside the receiver (or GNSS firmware):

1. Track signals (DLL / PLL / FLL loops)
2. Decode navigation messages
3. Compute satellite positions at transmit time
4. Solve a **least-squares problem** (or Kalman filter)
5. Output:

   * Latitude, longitude, altitude
   * Velocity (from Doppler)
   * Time (UTC)

This happens continuously (e.g. 1–10 Hz).

## From Radio Burst to Bits on Paper

We now know how satellites work and send signal, so let’s zoom into the payload they broadcast. The baseline signal layout is standardized in the official [IS‑GPS‑200](https://www.gps.gov/technical/icwg/IS-GPS-200N.pdf) document:

* A navigation **frame** lasts 30 s and carries 1,500 bits. It is split into 5 subframes (300 bits each) modulated by the satellite’s PRN sequence on L1.
* Subframes 1–3 contain **clock** parameters (bias, drift, relativistic term), health, and the satellite’s **ephemeris** valid for ~4 hours.
* Subframes 4–5 cycle through 25 “pages” over 12.5 minutes to deliver the full **almanac**, UTC(USNO) offsets, ionospheric Klobuchar coefficients, and assorted alerts such as URA accuracy codes.

An [ephemeris](https://en.wikipedia.org/wiki/Ephemeris) is the precise orbital description for a single satellite, including Keplerian elements and clock corrections that let receivers propagate its position to the exact transmit time. The data is valid for only a few hours but yields meter-level accuracy.

The [almanac](https://en.wikipedia.org/wiki/GNSS_almanac) is a coarse catalog covering the entire constellation: each entry specifies approximate orbit parameters, health, and clock terms for every satellite. Receivers use it to predict visibility, quickly acquire PRN codes after cold starts, and seed their search before downloading current ephemerides.

Each 30-bit word follows a strict layout: 8-bit preamble (`10001011`), 16 data bits, and 6 parity bits derived from a shortened Hamming (32,26) code. Receivers continuously despread the PRN code, align on this preamble, and reject words that fail parity. The Time Of Week (TOW) field increments every 6 s, so firmware double-checks frame alignment by comparing the decoded TOW with its internal counter.

Modern signals such as L5 (IS‑GPS‑705), L2C, or Galileo’s I/NAV adopt **CNAV** / **CNAV-2** structures with Reed–Solomon FEC, pilot/data channel separation, and explicit integrity fields. That extra redundancy enables advanced services like [SBAS](https://www.navcen.uscg.gov/publications) or [ARAIM](https://gssc.esa.int/navipedia/index.php/Advanced_RAIM_(ARAIM)) where receivers need quantified protection levels.

## Turning RF Energy into Numbers

The hardware path bridges the radio wave and the packets above:

1. **Antenna + LNA** filters the ~2 MHz GNSS band and boosts a ~−160 dBW signal without saturating nearby LTE emitters.
2. **Downconversion** mixes the RF waveform with a local oscillator and yields baseband components:

   $$
   I(t) = r(t)\cos\left(2\pi f_{\text{LO}} t\right), \qquad Q(t) = r(t)\sin\left(2\pi f_{\text{LO}} t\right)
   $$

3. **Sampling** digitizes the I/Q stream. The sampling rate must satisfy:

   $$
   f_s \ge 1.023 \text{ MHz}
   $$

   ensuring C/A-code chips are resolved without aliasing. Quantization noise shows up later as tracking jitter.
4. **Correlation** slides a locally generated code replica across the sampled stream:

   $$
   R_s(\tau) = \sum_{k=0}^{N-1} \left[I_k + jQ_k\right] \, C_s^*(kT_c - \tau),
   $$

   highlighting the delay τ where the signal peaks. Delay-lock loops (DLL) and phase-lock loops (PLL) continually adjust τ and Doppler so that the prompt, early, and late taps stay symmetric.
5. **Bit extraction** integrates the prompt correlator output over 20 ms (one navigation bit), performs parity checks, and pushes validated frames into the navigation engine.

## From Pseudo-Ranges to a Fix

Armed with clean packets and accurate code-phase timestamps, a receiver solves for its pose. Each satellite provides a measurement equation:

$$
\rho_s = \left\| \mathbf{r}_u - \mathbf{r}_s(t_s) \right\| + c \, \delta t_u + c \, \Delta t_s + I_s + T_s + \varepsilon_s
$$

Unknowns and corrections:

* User position in ECEF:

  $$
  \mathbf{r}_u = (x, y, z)
  $$

* Satellite position at transmit time derived from the ephemeris:

  $$
  \mathbf{r}_s(t_s)
  $$

* Clock terms broadcast in the nav message:

  $$
  \delta t_u \quad \text{and} \quad \Delta t_s
  $$

* Atmospheric delays modeled via Klobuchar/Saastamoinen:

  $$
  I_s \quad \text{and} \quad T_s
  $$

Stack the observations from ≥4 satellites, linearize with respect to the unknown state, and solve the normal equations:

$$
\min_{\mathbf{r}_u,\delta t_u} \left\| \mathbf{A} \begin{bmatrix} x \\ y \\ z \\ c\,\delta t_u \end{bmatrix} - \mathbf{b} \right\|_2^2
$$

Kalman filters extend this to include velocity, acceleration, and even IMU biases. Doppler shift measurements feed the velocity update via

$$
v_{\parallel,s} = -\frac{c \, f_{D,s}}{f_{\text{carrier}}}
$$

and Differenced GNSS (RTK/PPP) simply injects carrier-phase constraints on top. Once the receiver position vector is known, firmware projects it onto the [WGS 84](https://earth-info.nga.mil/) ellipsoid, applies UTC corrections from the message, and hands the final latitude/longitude/height to higher-level software. We now know how we use that to figure out our position.

## Accuracy Levels

| Technique                            | Typical accuracy |
| ------------------------------------ | ---------------- |
| Standalone GPS                       | 3–10 m           |
| SBAS (EGNOS/WAAS)                    | 1–3 m            |
| Multi-GNSS (GPS + Galileo + GLONASS) | ~1–2 m           |
| RTK / PPK                            | cm-level         |
| Carrier-phase PPP                    | cm–dm            |

## Important Practical Detail: GPS ≠ GNSS

Modern receivers almost never use GPS alone:

* **Galileo** (EU)
* **GLONASS**
* **BeiDou**

Using multiple constellations improves:

* Time-to-first-fix
* Urban canyon performance
* Geometry (DOP)

---

## Mental Model

> GPS works because satellites shout *“this code left me at exactly this time from exactly this orbit”*, and your receiver measures how late the shout arrived from at least four satellites to solve **where you are and what time it is**.

If you want, I can:

* Zoom in on **signal tracking loops (DLL/PLL)**
* Explain **carrier-phase / RTK**
* Or relate this directly to **embedded GNSS firmware** (e.g. what your LTE-GNSS tracker is actually doing internally)
