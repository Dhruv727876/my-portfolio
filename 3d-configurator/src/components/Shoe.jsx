import { useGLTF } from '@react-three/drei'
import { useStore } from '../store/useStore'

// 1. IMPORT THE FILE DIRECTLY
// Adding '?url' tells Vite to treat this as a link to a file
import shoeUrl from '../shoe-draco.glb?url'

export default function Shoe() {
  // 2. USE THE VARIABLE INSTEAD OF A STRING
  const { nodes, materials } = useGLTF(shoeUrl)
  const colors = useStore((state) => state.colors)

  return (
    <group dispose={null} scale={3} position={[0, -1, 0]}>
      {/* ... keep the rest of your mesh code exactly the same ... */}
      {/* 1. Laces */}
      <mesh 
        geometry={nodes.shoe.geometry} 
        material={materials.laces} 
        material-color={colors.laces} 
      />
      {/* 2. Main Mesh */}
      <mesh 
        geometry={nodes.shoe_1.geometry} 
        material={materials.mesh} 
        material-color={colors.mesh} 
      />
      {/* 3. Toe Cap (Part of Sole group) */}
      <mesh 
        geometry={nodes.shoe_2.geometry} 
        material={materials.caps} 
        material-color={colors.sole} 
      />
      {/* 4. Inner Sole */}
      <mesh 
        geometry={nodes.shoe_3.geometry} 
        material={materials.inner} 
        material-color={colors.inner}
      />
      
      {/* --- THE MISSING PARTS --- */}
      
      {/* 5. THE MAIN SOLE */}
      <mesh 
        geometry={nodes.shoe_4.geometry} 
        material={materials.sole} 
        material-color={colors.sole} 
      />
      {/* 6. Stripes */}
      <mesh 
        geometry={nodes.shoe_5.geometry} 
        material={materials.stripes} 
        material-color={colors.laces} 
      />
      {/* 7. Band */}
      <mesh 
        geometry={nodes.shoe_6.geometry} 
        material={materials.band} 
        material-color={colors.sole} 
      />
      {/* 8. Patch */}
      <mesh 
        geometry={nodes.shoe_7.geometry} 
        material={materials.patch} 
        material-color={colors.sole} 
      />
    </group>
  )
}