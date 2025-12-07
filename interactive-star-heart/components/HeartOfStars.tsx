import React, { useRef, useEffect, useMemo } from 'react';

declare global {
    interface Window { THREE: any; }
}

const HeartOfStars: React.FC<{ scale: number }> = ({ scale }) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const targetScale = useRef(1);

    const heartPoints = useMemo(() => {
        const points = [];
        const numPoints = 5000;
        const scale = 0.5; // Adjusted scale for the new parametric equation

        while (points.length < numPoints) {
            // Step 1: Generate a point on the surface of the revolved heart.
            // First, get a random point on the classic 2D parametric heart curve.
            const t = Math.random() * 2 * Math.PI;
            const r_2d_surface = 16 * Math.pow(Math.sin(t), 3);
            const y_2d_surface = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

            // Now, revolve that 2D point around the Y-axis by a random angle 'phi' to get a 3D surface point.
            const phi = Math.random() * 2 * Math.PI;
            const x_3d_surface = r_2d_surface * Math.cos(phi);
            const z_3d_surface = r_2d_surface * Math.sin(phi);
            const y_3d_surface = y_2d_surface;

            // Step 2: Scale this surface point towards the origin to fill the volume.
            // Using Math.cbrt(Math.random()) gives a more uniform volumetric distribution
            // than a linear scale, preventing points from clustering at the center.
            const radius_scale = Math.cbrt(Math.random());

            const x = x_3d_surface * radius_scale;
            const y = y_3d_surface * radius_scale;
            const z = z_3d_surface * radius_scale;
            
            points.push(new window.THREE.Vector3(x * scale, y * scale, z * scale));
        }
        return points;
    }, []);

    useEffect(() => {
       targetScale.current = scale;
    }, [scale]);

    useEffect(() => {
        if (!mountRef.current || !window.THREE) return;

        const { THREE } = window;
        const currentMount = mountRef.current;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
        camera.position.z = 25;

        const renderer = new THREE.WebGLRenderer({ antalias: true, alpha: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        currentMount.appendChild(renderer.domElement);

        // Heart particles
        const geometry = new THREE.BufferGeometry().setFromPoints(heartPoints);
        const material = new THREE.PointsMaterial({
            color: 0xff4d6d,
            size: 0.25,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.9,
        });
        const heart = new THREE.Points(geometry, material);
        scene.add(heart);

        // Background stars
        const starGeometry = new THREE.BufferGeometry();
        const starVertices = [];
        for (let i = 0; i < 10000; i++) {
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = (Math.random() - 0.5) * 2000;
            if (x*x+y*y+z*z < 100 * 100) continue; // create a hollow sphere
            starVertices.push(x, y, z);
        }
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.7,
            transparent: true,
            opacity: 0.5
        });
        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        // --- Mouse Drag Logic ---
        let isDragging = false;
        const previousMousePosition = { x: 0, y: 0 };

        const onMouseDown = (e: MouseEvent) => {
            isDragging = true;
            currentMount.style.cursor = 'grabbing';
            previousMousePosition.x = e.clientX;
            previousMousePosition.y = e.clientY;
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;

            heart.rotation.y += deltaX * 0.005;
            heart.rotation.x += deltaY * 0.005;

            previousMousePosition.x = e.clientX;
            previousMousePosition.y = e.clientY;
        };

        const onMouseUpOrLeave = () => {
            isDragging = false;
            currentMount.style.cursor = 'grab';
        };

        currentMount.style.cursor = 'grab';
        currentMount.addEventListener('mousedown', onMouseDown);
        currentMount.addEventListener('mousemove', onMouseMove);
        currentMount.addEventListener('mouseup', onMouseUpOrLeave);
        currentMount.addEventListener('mouseleave', onMouseUpOrLeave);

        const handleResize = () => {
            if (!currentMount) return;
            camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        let animationFrameId: number;
        const animate = () => {
            // User controls rotation now, so we remove the automatic spin
            // heart.rotation.y += 0.002;
            stars.rotation.y += 0.0001;

            const currentScale = heart.scale.x;
            const newScale = currentScale + (targetScale.current - currentScale) * 0.05;
            heart.scale.set(newScale, newScale, newScale);

            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            currentMount.removeEventListener('mousedown', onMouseDown);
            currentMount.removeEventListener('mousemove', onMouseMove);
            currentMount.removeEventListener('mouseup', onMouseUpOrLeave);
            currentMount.removeEventListener('mouseleave', onMouseUpOrLeave);
            cancelAnimationFrame(animationFrameId);
            if (currentMount && renderer.domElement) {
                currentMount.removeChild(renderer.domElement);
            }
            geometry.dispose();
            material.dispose();
            starGeometry.dispose();
            starMaterial.dispose();
        };
    }, [heartPoints]);

    return <div ref={mountRef} className="absolute inset-0 z-0" />;
};

export default HeartOfStars;