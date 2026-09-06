import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Bounds } from '@react-three/drei'
import * as THREE from 'three'
import { DoubleSide } from 'three'
import { generateDoilyMeshGeometry } from '../../utils/doilyMath'

/**
 * Remount tick forces fresh geometry under React StrictMode (double mount).
 */
function DoilyMesh({ multiplier, maxRows, baseStitches }) {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    setTick((t) => t + 1)
  }, [])

  const prevSurface = useRef(null)
  const prevLace = useRef(null)

  const { surface, lace } = useMemo(() => {
    prevSurface.current?.dispose()
    prevLace.current?.dispose()

    const { positions, indices, colors, lacePositions, laceColors } =
      generateDoilyMeshGeometry({
        maxRows,
        multiplier,
        baseStitches,
      })

    const surfaceGeo = new THREE.BufferGeometry()
    surfaceGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    surfaceGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    surfaceGeo.setIndex(Array.from(indices))
    surfaceGeo.computeVertexNormals()

    const laceGeo = new THREE.BufferGeometry()
    laceGeo.setAttribute('position', new THREE.Float32BufferAttribute(lacePositions, 3))
    laceGeo.setAttribute('color', new THREE.Float32BufferAttribute(laceColors, 3))

    prevSurface.current = surfaceGeo
    prevLace.current = laceGeo
    return { surface: surfaceGeo, lace: laceGeo }
  }, [multiplier, maxRows, baseStitches, tick])

  useEffect(
    () => () => {
      prevSurface.current?.dispose()
      prevLace.current?.dispose()
    },
    []
  )

  return (
    <Bounds fit clip observe margin={1.2}>
      <group>
        <mesh geometry={surface}>
          <meshStandardMaterial
            vertexColors
            roughness={0.55}
            metalness={0.02}
            transparent
            opacity={0.38}
            side={DoubleSide}
            depthWrite={false}
          />
        </mesh>
        <lineSegments geometry={lace}>
          <lineBasicMaterial vertexColors transparent opacity={0.95} />
        </lineSegments>
      </group>
    </Bounds>
  )
}

function Scene({ multiplier, maxRows, baseStitches, autoRotate, onInteractionStart }) {
  return (
    <>
      <color attach="background" args={['#eef2f6']} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 4]} intensity={1.05} />
      <directionalLight position={[-4, 3, -3]} intensity={0.4} />
      <DoilyMesh multiplier={multiplier} maxRows={maxRows} baseStitches={baseStitches} />
      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={1}
        maxDistance={10}
        minPolarAngle={0.15}
        maxPolarAngle={Math.PI / 2 + 0.45}
        autoRotate={autoRotate}
        autoRotateSpeed={0.9}
        onStart={onInteractionStart}
      />
    </>
  )
}

export default function Doily3D({
  multiplier = 1.0,
  displayMultiplier,
  maxRows = 16,
  baseStitches = 6,
  className = '',
}) {
  const labelMultiplier = displayMultiplier ?? multiplier
  const [autoRotate, setAutoRotate] = useState(true)

  return (
    <div
      className={`relative z-0 isolate rounded-xl border border-charcoal/10 overflow-hidden bg-[#eef2f6] ${className}`}
      role="img"
      aria-label={`3D lace doily at growth multiplier ${labelMultiplier.toFixed(2)}. Auto-rotating; drag to take control. Blue rings stay flatter; green outer rings show ruffle from excess stitches.`}
    >
      <div className="relative z-0 w-full h-[220px] sm:h-[260px] md:h-[min(320px,36vh)] max-h-[360px]">
        <Canvas
          className="!relative touch-none"
          camera={{ position: [2.4, 1.9, 2.9], fov: 42, near: 0.1, far: 100 }}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          dpr={[1, 2]}
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <Scene
            multiplier={multiplier}
            maxRows={maxRows}
            baseStitches={baseStitches}
            autoRotate={autoRotate}
            onInteractionStart={() => setAutoRotate(false)}
          />
        </Canvas>
      </div>
      <p className="px-3 py-2 text-center text-[11px] text-charcoal/55 font-mono border-t border-charcoal/10 bg-white/50">
        {autoRotate ? 'Auto-spinning' : 'Drag to rotate'} · lace rings · blue→green · ×
        {labelMultiplier.toFixed(2)}
      </p>
    </div>
  )
}
