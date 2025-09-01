"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three";
import { lerp } from "three/src/math/MathUtils";

export const ThreeFundamentals = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene>(null);
  const rendererRef = useRef<THREE.WebGLRenderer>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const cubesRef = useRef<THREE.Mesh[]>([]);
  const gridRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);

  const setup = (canvas: HTMLCanvasElement) => {
    const scene = new THREE.Scene();
    scene.background = null;
    // (POV, Aspect Ratio, near clipping, far clipping)
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0,0,0);
    
    const renderer = new THREE.WebGLRenderer(
      { antialias: true ,
        alpha: true, // transparent
        canvas 
      }
    );
    renderer.setSize(canvas.width, canvas.height, false);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 5, 10);
    directionalLight.target.position.set(0, 0, 0);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

  }

  const createDottedDistortedSphere = (pos: THREE.Vector3, size: number) => {
    const sphereGeometry = new THREE.SphereGeometry(size, 16, 16);
    sphereGeometry.translate(pos.x, pos.y, pos.z);
    // Get positions from the sphere geometry
    const positionAttribute = sphereGeometry.attributes.position;
    const vertices = positionAttribute.array;
    
    // Create cubes at each vertex position
    let cubes = [];
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const y = vertices[i + 1];
      const z = vertices[i + 2];
      
      // Create normalized position vector
      // const vertex = new THREE.Vector3(
      //   x + Math.random() * size / 5,
      //   y + Math.random() * size / 5,
      //   z + Math.random() * size / 5
      // );
      const vertex = new THREE.Vector3(x, y, z);
      vertex.normalize().multiplyScalar(0.5 + Math.random() * 0.5);

      const distanceFromSphereCenter = vertex.distanceTo(pos);

      // Create cube at vertex position
      const cubeGeometry = new THREE.BoxGeometry(0.2, 0.2, distanceFromSphereCenter);

      const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x2233ff });
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      
      // Set cube position
      cube.position.set(vertex.x, vertex.y, vertex.z);
      cube.lookAt(pos);
    
      cubes.push(cube);
    }

    return cubes;
  }

  const animate = () => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;
    
    // Render the scene
    rendererRef.current.render(sceneRef.current, cameraRef.current);
    
    cubesRef.current.forEach(c => {
      c.scale.z = 4 * Math.sin(Date.now() * 0.0005 + c.position.x * 5 + c.position.y * 10);
    });
    groupRef.current!.rotation.y += 0.01;
    // Call animate again on the next frame
    requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current;
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    canvas.width = canvas.clientWidth * window.devicePixelRatio;
    canvas.height = canvas.clientHeight * window.devicePixelRatio;

    setup(canvas);

    const backGroundPlane = new THREE.PlaneGeometry(50, 50, 32, 32);
    const backGroundMaterial = new THREE.ShadowMaterial({ color: 0x000000, transparent: true, opacity: 0.0 });
    const backGroundMesh = new THREE.Mesh(backGroundPlane, backGroundMaterial);
    backGroundMesh.receiveShadow = true;

    backGroundMesh.position.z = -2;
    sceneRef.current.add(backGroundMesh);

    const planeGeometry = new THREE.PlaneGeometry(50, 50, 32, 32);
    const planeMaterial = new THREE.PointsMaterial({ color: 0xdddddd, size: 0.1 });
    gridRef.current = new THREE.Points(planeGeometry, planeMaterial);

    gridRef.current.position.z = -1;

    sceneRef.current.add(gridRef.current);
    
    groupRef.current = new THREE.Group();
    sceneRef.current.add( groupRef.current ); 
    
    cubesRef.current = createDottedDistortedSphere(new THREE.Vector3(0, 0, 0), 1.3);
    cubesRef.current.forEach(c => {
      groupRef.current!.add(c);
    });
    
    // camera positioning
    cameraRef.current.position.z = 8;

    animate();
    
    const handleResize = () => {
      if (rendererRef.current && cameraRef.current) {
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
      }
    };
    
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      rendererRef.current?.dispose();
    };
  }, []);

  return (
    <canvas 
      style={
        {
          zIndex: "1",
          top: "0%",
          left: "0%",
        }
      } 
      ref={canvasRef}
    ></canvas>
  )
}