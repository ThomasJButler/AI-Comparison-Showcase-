"use client";

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

export default function ModelEvolution() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Neural network structure
    const layers = [4, 6, 8, 6, 4];
    const neurons: THREE.Mesh[] = [];
    const connections: THREE.Line[] = [];
    const signals: { line: THREE.Line; progress: number; speed: number; }[] = [];

    // Create neurons
    layers.forEach((count, layerIndex) => {
      const layerX = (layerIndex - (layers.length - 1) / 2) * 20;
      
      for (let i = 0; i < count; i++) {
        const y = (i - (count - 1) / 2) * 10;
        
        // Neuron geometry with glow effect
        const neuronGeometry = new THREE.SphereGeometry(1, 32, 32);
        const neuronMaterial = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            color: { value: new THREE.Color(0x00ff00) }
          },
          vertexShader: `
            varying vec3 vNormal;
            varying vec3 vPosition;
            
            void main() {
              vNormal = normal;
              vPosition = position;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform float time;
            uniform vec3 color;
            varying vec3 vNormal;
            varying vec3 vPosition;
            
            void main() {
              float pulse = sin(time * 2.0) * 0.5 + 0.5;
              float glow = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
              vec3 finalColor = mix(color, vec3(1.0), glow * pulse);
              gl_FragColor = vec4(finalColor, 1.0);
            }
          `
        });

        const neuron = new THREE.Mesh(neuronGeometry, neuronMaterial);
        neuron.position.set(layerX, y, 0);
        scene.add(neuron);
        neurons.push(neuron);

        // Connect to previous layer
        if (layerIndex > 0) {
          const prevLayer = neurons.slice(-count - layers[layerIndex - 1]);
          prevLayer.forEach(prevNeuron => {
            const connectionGeometry = new THREE.BufferGeometry().setFromPoints([
              prevNeuron.position,
              neuron.position
            ]);
            const connectionMaterial = new THREE.LineBasicMaterial({
              color: 0x00ff00,
              transparent: true,
              opacity: 0.3
            });
            const connection = new THREE.Line(connectionGeometry, connectionMaterial);
            scene.add(connection);
            connections.push(connection);

            // Create signal
            if (Math.random() < 0.3) {
              const signalGeometry = new THREE.BufferGeometry().setFromPoints([
                prevNeuron.position,
                prevNeuron.position
              ]);
              const signalMaterial = new THREE.LineBasicMaterial({
                color: 0x00ffff,
                transparent: true,
                opacity: 0.8
              });
              const signal = new THREE.Line(signalGeometry, signalMaterial);
              scene.add(signal);
              signals.push({
                line: signal,
                progress: 0,
                speed: 0.01 + Math.random() * 0.02
              });
            }
          });
        }
      }
    });

    camera.position.z = 100;

    // Animation
    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const time = performance.now() * 0.001;

      // Update neuron shaders
      neurons.forEach(neuron => {
        (neuron.material as THREE.ShaderMaterial).uniforms.time.value = time;
      });

      // Update signals
      signals.forEach(signal => {
        signal.progress += signal.speed;
        if (signal.progress > 1) {
          signal.progress = 0;
          // Randomly select new start and end points
          const startNeuron = neurons[Math.floor(Math.random() * neurons.length)];
          const endNeuron = neurons[Math.floor(Math.random() * neurons.length)];
          signal.line.geometry.setFromPoints([
            startNeuron.position,
            startNeuron.position
          ]);
        }

        const points = signal.line.geometry.attributes.position;
        const start = new THREE.Vector3(
          points.getX(0),
          points.getY(0),
          points.getZ(0)
        );
        const end = new THREE.Vector3(
          points.getX(1),
          points.getY(1),
          points.getZ(1)
        );
        const current = new THREE.Vector3().lerpVectors(start, end, signal.progress);
        signal.line.geometry.setFromPoints([start, current]);
      });

      // Rotate network
      scene.rotation.y = Math.sin(time * 0.2) * 0.3;
      scene.rotation.x = Math.cos(time * 0.2) * 0.2;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-[600px] w-full bg-gradient-to-b from-background to-background/50"
    />
  );
}