import React from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './components/Scene';

const App = () => {
  return (
    <Canvas style={{ border: '1px solid red', width: '100vw', height: '100vh' }}>
      <Scene />
    </Canvas>
  );
}

export default App;
