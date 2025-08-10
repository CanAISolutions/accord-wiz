import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function House() {
  return (
    <mesh>
      <boxGeometry args={[2, 1, 2]} />
      <meshStandardMaterial color="#4ade80" />
    </mesh>
  );
}

export default function House3D() {
  return (
    <Canvas style={{ height: 300 }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <House />
      <OrbitControls />
    </Canvas>
  );
}


