import React, { useState, useEffect, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import Controls from './Controls';
import Sphere from './Sphere';

const Scene = () => {
  const [spheres, setSpheres] = useState([]);
  const { camera, gl } = useThree();

  const addSphere = useCallback((event) => {
    event.stopPropagation();
    const rect = event.target.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width * 2 - 1;
    const y = -(event.clientY - rect.top) / rect.height * 2 + 1;
    setSpheres([...spheres, { position: [x, y, 0], args: [0.5], color: 'orange' }]);
  }, [spheres]);

  useEffect(() => {
    gl.domElement.addEventListener('click', addSphere);
    return () => {
      gl.domElement.removeEventListener('click', addSphere);
    };
  }, [gl.domElement, addSphere]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <ambientLight intensity={0.3} />
      <Controls camera={camera} />
      <mesh>
        <sphereGeometry args={[]} />
        <meshStandardMaterial color='blue' />
      </mesh>
      {spheres.map((props, i) => (
        <Sphere key={i} {...props} />
      ))}
    </>
  );
};

export default Scene;
