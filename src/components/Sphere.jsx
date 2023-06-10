import React, { useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { useDrag } from 'react-use-gesture';

const Sphere = ({ position, args, color, setHovered }) => {
  const { viewport } = useThree();
  const ref = useRef();
  
  const bind = useDrag(({ offset: [x, y], down }) => {
    if (ref.current) {
      ref.current.position.set(x / viewport.factor, -y / viewport.factor, 0);
    }
  });

  return (
    <mesh ref={ref} {...bind()} onPointerOver={() => setHovered(ref)} onPointerOut={() => setHovered(null)} castShadow position={position}>
      <sphereBufferGeometry attach="geometry" args={args} />
      <meshStandardMaterial attach="material" color={color} />
    </mesh>
  );
};

export default Sphere;
