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

  const prevGeo = useRef(null)

  const geometry = useMemo(() => {
    prevGeo.current?.dispose()
    const { positions, indices } = generateDoilyMeshGeometry({
      maxRows,
      multiplier,
      baseStitches,
    })
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geo.setIndex(Array.from(indices))
    geo.computeVertexNormals()
    prevGeo.current = geo
    return geo
  }, [multiplier, maxRows, baseStitches, tick])

  useEffect(() => () => prevGeo.current?.dispose(), [])

  return (
    <Bounds fit clip observe margin={1.15}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color="#4A90E2"
          roughness={0.4}
          metalness={0.05}
          flatShading
          side={DoubleSide}
        />
      </mesh>
    </Bounds>
  )
}

function Scene({ multiplier, maxRows, baseStitches }) {
  return (
    <>
      <color attach="background" args={['#eef2f6']} />
      <ambientLight intensity={0.65} />
      <directionalLight position={[5, 8, 4]} intensity={1} />
      <directionalLight position={[-4, 3, -3]} intensity={0.35} />
      <DoilyMesh multiplier={multiplier} maxRows={maxRows} baseStitches={baseStitches} />
      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={1}
        maxDistance={10}
        minPolarAngle={0.1}
        maxPolarAngle={Math.PI / 2 + 0.4}
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

  return (
    <div
      className={`relative z-0 isolate rounded-xl border border-charcoal/10 overflow-hidden bg-[#eef2f6] ${className}`}
      role="img"
      aria-label={`3D doily surface at growth multiplier ${labelMultiplier.toFixed(2)}. Drag to rotate.`}
    >
      <div className="relative z-0 w-full h-[220px] sm:h-[260px] md:h-[min(320px,36vh)] max-h-[360px]">
        <Canvas
          className="!relative touch-none"
          camera={{ position: [0, 2.5, 3.5], fov: 45, near: 0.1, far: 100 }}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          dpr={[1, 2]}
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <Scene
            multiplier={multiplier}
            maxRows={maxRows}
            baseStitches={baseStitches}
          />
        </Canvas>
      </div>
      <p className="px-3 py-2 text-center text-[11px] text-charcoal/55 font-mono border-t border-charcoal/10 bg-white/50">
        Drag to rotate · multiplier {labelMultiplier.toFixed(2)}
      </p>
    </div>
  )
}
