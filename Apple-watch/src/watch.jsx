/*
Updated for Portfolio Project 6
*/

import React, { forwardRef } from 'react'
import { useGLTF } from '@react-three/drei'

// We use forwardRef so the parent component (App.jsx) can control the rotation
export const Model = forwardRef((props, ref) => {
  // IMPORTANT: We changed the path to match your renamed file
  const { nodes, materials } = useGLTF('./watch.glb')
  
  return (
    <group {...props} dispose={null} ref={ref}>
      <mesh 
        geometry={nodes.Object_4.geometry} 
        material={materials.Image} 
        scale={1} 
      />
    </group>
  )
})

useGLTF.preload('/watch.glb')