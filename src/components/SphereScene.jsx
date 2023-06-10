import React, { useState, useRef, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import DAT from 'react-dat-gui';

// update here
const { GUI, GUIController } = DAT;

// the rest of your code...


function Sphere({ id, position, color, radius, spheres, setSpheres }) {
  const mesh = useRef();
  
  // Logic for moving a sphere
  const handleSphereClick = useCallback((event) => {
    event.stopPropagation();
  }, []);

  // Logic for removing a sphere
  const handleSphereDoubleClick = useCallback((event) => {
    event.stopPropagation();
    setSpheres((spheres) => spheres.filter((sphere) => sphere.id !== id));
  }, [id, setSpheres]);

  // Check for sphere overlapping and merging
  useFrame(() => {
    const mergedSpheres = [];
    const newSpheres = spheres.filter((sphere1) => {
      for (const sphere2 of spheres) {
        if (
          sphere1.id !== sphere2.id &&
          new THREE.Vector3(...sphere1.position).distanceTo(
            new THREE.Vector3(...sphere2.position)
          ) <= sphere1.radius + sphere2.radius
        ) {
          mergedSpheres.push({
            id: sphere1.id,
            color: sphere1.color,
            radius: Math.max(sphere1.radius, sphere2.radius),
            position: [
              (sphere1.position[0] + sphere2.position[0]) / 2,
              (sphere1.position[1] + sphere2.position[1]) / 2,
              (sphere1.position[2] + sphere2.position[2]) / 2,
            ],
          });

          return false;
        }
      }

      return true;
    });

    setSpheres([...newSpheres, ...mergedSpheres]);
  });

  return (
    <mesh
      ref={mesh}
      position={position}
      onClick={handleSphereClick}
      onDoubleClick={handleSphereDoubleClick}
    >
      <sphereGeometry attach="geometry" args={[radius, 32, 32]} />
      <meshStandardMaterial attach="material" color={color} />
    </mesh>
  );
}

function SphereScene() {
  const [spheres, setSpheres] = useState([]);
  const [data, setData] = useState({
    color: '#ffffff',
    radius: 1,
    position: [0, 0, 0],
  });

  // Logic for adding a new sphere
  const handleCanvasClick = useCallback((event) => {
    event.stopPropagation();

    const newSphere = {
      id: spheres.length,
      color: data.color,
      radius: data.radius,
      position: data.position,
    };

    setSpheres((spheres) => [...spheres, newSphere]);
  }, [spheres, data]);

  return (
    <div>
      <Canvas onClick={handleCanvasClick}>
        <ambientLight />
        <OrbitControls />
        {spheres.map((sphere) => (
          <Sphere
            key={sphere.id}
            id={sphere.id}
            position={sphere.position}
            color={sphere.color}
            radius={sphere.radius}
            spheres={spheres}
            setSpheres={setSpheres}
          />
        ))}
      </Canvas>

      <GUI data={data} onUpdate={setData}>
        <GUIController path="color" label="Color" />
        <GUIController path="radius" label="Radius" min={0.1} max={2} />
        <GUIController path="position[0]" label="X" min={-5} max={5} />
        <GUIController path="position[1]" label="Y" min={-5} max={5} />
        <GUIController path="position[2]" label="Z" min={-5} max={5} />
      </GUI>
    </div>
  );
}

export default SphereScene;
