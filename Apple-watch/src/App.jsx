import React, { useRef, useLayoutEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, ContactShadows, SpotLight, Sparkles, Float } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Model } from './Watch'


gsap.registerPlugin(ScrollTrigger)

function Scene() {
  const watchRef = useRef()
  const tl = useRef()

  useLayoutEffect(() => {
    tl.current = gsap.timeline({
      scrollTrigger: {
        trigger: ".main-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
      }
    })

    if (watchRef.current) {
      // Animation Logic (Same as before)
      tl.current.to(watchRef.current.position, { x: 0, y: 0, duration: 2 }, 0)
      tl.current.to(watchRef.current.rotation, { y: Math.PI * 2, duration: 2 }, 0)
      tl.current.to(watchRef.current.scale, { x: 0.25, y: 0.25, z: 0.25, duration: 2 }, 0)
      tl.current.to(watchRef.current.rotation, { x: 0.4, z: 0.1, duration: 1 }, 2)
      tl.current.to(watchRef.current.position, { y: 10, duration: 1 }, 3)
    }
  }, [])

  return (
    <>
      {/* 1. LIGHTING */}
      <ambientLight intensity={0.5} />
      <SpotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1000} castShadow />
      <Environment preset="city" />
      
      {/* 2. ATMOSPHERE (New Addition) */}
      {/* Subtle floating dust particles for cinematic depth */}
      <Sparkles count={100} scale={10} size={2} speed={0.4} opacity={0.5} color="white" />

      {/* 3. THE WATCH (Wrapped in Float for "Alive" feel) */}
      {/* floatIntensity controls how much it bobs up/down */}
      <Float 
        speed={2} 
        rotationIntensity={0} // We turn off rotation because GSAP controls that
        floatIntensity={1} 
        floatingRange={[-0.1, 0.1]} // Small range so it doesn't drift too far
      >
        <Model ref={watchRef} position={[3, 0, 0]} scale={0.18} /> 
      </Float>
      
      {/* 4. SHADOWS */}
      <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} color="black" />
    </>
  )
}

function App() {
  const addToRefs = (el) => {
    if (el && !el.classList.contains('animated')) {
      el.classList.add('animated');
      gsap.fromTo(el, 
        { opacity: 0, y: 50 }, 
        { 
          opacity: 1, y: 0, duration: 1, 
          scrollTrigger: { trigger: el, start: "top 80%" }
        }
      );
    }
  }

  return (
    <div className="main-container" style={{ width: '100%', position: 'relative' }}>
      
      {/* FIXED NAVBAR - Using left/right 0 ensures it fits perfectly */}
      <nav className="glass-nav" style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, /* Stretches to edges without overflow */
        height: '70px',
        padding: '0 5%', /* Responsive padding */
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        zIndex: 100 
      }}>
        <div style={{ fontWeight: '700', fontSize: '1.4rem' }}> WATCH</div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', fontSize: '0.9rem', color: '#e5e5e5' }}>
          <span style={{ cursor: 'pointer' }}>Overview</span>
          <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '14px' }}>Buy</button>
        </div>
      </nav>

      {/* 3D BACKGROUND */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 1 }}>
        <Canvas camera={{ position: [0, 0, 8], fov: 40 }} shadows>
          <Scene />
        </Canvas>
      </div>

      {/* CONTENT LAYER */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        
        {/* Section 1 */}
        <section style={{ height: '100vh', display: 'flex', alignItems: 'center', paddingLeft: '10%' }}>
          <div ref={addToRefs} style={{ maxWidth: '80%' }}>
            <h3 style={{ fontSize: '1.5rem', color: '#F56300', fontWeight: '600' }}>New</h3>
            {/* Clamp makes font responsive: min 3rem, preferred 8vw, max 6rem */}
            <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: '800', lineHeight: '1' }}>Series 9</h1>
            <p style={{ fontSize: 'clamp(1.2rem, 2vw, 2rem)', color: '#a1a1a6', marginTop: '10px' }}>Smarter. Brighter. Mightier.</p>
          </div>
        </section>

        {/* Section 2 */}
        <section style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '10%' }}>
          <div ref={addToRefs} style={{ textAlign: 'right', maxWidth: '500px' }}>
            <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: '700', lineHeight: '1.1' }}>Double Tap.</h2>
            <p style={{ fontSize: '1.2rem', color: '#a1a1a6', marginTop: '20px' }}>
              A magical new way to use your Apple Watch without touching the screen.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 20px' }}>
          <div ref={addToRefs}>
            <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: '800', marginBottom: '10px' }}>Carbon Neutral.</h2>
            <p style={{ fontSize: '1.2rem', color: '#a1a1a6', marginBottom: '30px' }}>A first for Apple. A huge milestone for 2030.</p>
            <button className="btn-primary">Order Now</button>
          </div>
        </section>

      </div>
      <div style={{ height: '20vh' }}></div>
    </div>
  )
}

export default App