/*=============== THREE.JS ANIMATED BACKGROUND (PREMIUM) ===============*/
(function() {
   'use strict';

   const canvas = document.getElementById('three-canvas');
   if (!canvas || typeof THREE === 'undefined') {
      console.warn('Three.js canvas atau library tidak ditemukan. Background 3D di-skip.');
      return;
   }

   // === SETUP SCENE ===
   const scene = new THREE.Scene();
   const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
   );
   camera.position.z = 30;

   const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
   });
   renderer.setSize(window.innerWidth, window.innerHeight);
   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

   // === WARNA TEMA ===
   const isDarkMode = () => document.documentElement.classList.contains('dark');
   
   const COLORS = {
      dark: {
         primary: 0x7C3AED,   // Ungu terang
         secondary: 0xA78BFA, // Ungu muda
         accent: 0xC4B5FD     // Ungu sangat muda
      },
      light: {
         primary: 0x6D28D9,   // Ungu gelap
         secondary: 0x8B5CF6, // Ungu medium
         accent: 0xA78BFA     // Ungu terang
      }
   };

   const palette = isDarkMode() ? COLORS.dark : COLORS.light;
   const isMobile = window.innerWidth <= 768;

   // === 1. PARTICLE FIELD (Bintang-bintang 3D) ===
   const particlesGeometry = new THREE.BufferGeometry();
   const particlesCount = isMobile ? 800 : 1800; // Diperbanyak agar lebih megah
   
   const posArray = new Float32Array(particlesCount * 3);
   const colorArray = new Float32Array(particlesCount * 3);

   const color1 = new THREE.Color(palette.primary);
   const color2 = new THREE.Color(palette.secondary);
   const color3 = new THREE.Color(palette.accent);

   for (let i = 0; i < particlesCount * 3; i += 3) {
      // Sebar partikel lebih luas (100x100x100)
      posArray[i] = (Math.random() - 0.5) * 100;
      posArray[i + 1] = (Math.random() - 0.5) * 100;
      posArray[i + 2] = (Math.random() - 0.5) * 100;

      const rand = Math.random();
      const mixed = rand < 0.4 ? color1.clone()
                   : rand < 0.8 ? color2.clone()
                   : color3.clone();
      colorArray[i] = mixed.r;
      colorArray[i + 1] = mixed.g;
      colorArray[i + 2] = mixed.b;
   }

   particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
   particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

   const particlesMaterial = new THREE.PointsMaterial({
      size: isMobile ? 0.2 : 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      depthWrite: false
   });

   const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
   scene.add(particlesMesh);

   // === 2. 3D OBJECT INTERAKTIF (Lebih Futuristik) ===
   const interactables = []; // Array untuk objek yang bisa di-hover
   
   const shapeGeometries = [
      new THREE.TorusKnotGeometry(1.8, 0.4, 120, 16), // Bentuk simpul lebih detail
      new THREE.IcosahedronGeometry(1.8, 0),          // Bola 20 sisi
      new THREE.OctahedronGeometry(1.8, 0),           // Oktahedron
      new THREE.TorusGeometry(1.6, 0.4, 20, 80),      // Donat
      new THREE.DodecahedronGeometry(1.5, 0)          // Bola 12 sisi
   ];

   const shapeCount = isMobile ? 4 : 8;

   for (let i = 0; i < shapeCount; i++) {
      const geo = shapeGeometries[i % shapeGeometries.length];
      
      // Buat material dasar
      const mat = new THREE.MeshBasicMaterial({
         color: i % 2 === 0 ? palette.primary : palette.secondary,
         wireframe: true, // Tampilan kerangka
         transparent: true,
         opacity: 0.25, // Sedikit transparan
         blending: THREE.AdditiveBlending // Efek glow saat bertumpuk
      });
      
      const mesh = new THREE.Mesh(geo, mat);
      
      // Posisi acak yang tersebar
      mesh.position.set(
         (Math.random() - 0.5) * 60,
         (Math.random() - 0.5) * 50,
         (Math.random() - 0.5) * 40 - 10
      );
      
      mesh.rotation.set(
         Math.random() * Math.PI,
         Math.random() * Math.PI,
         0
      );
      
      // Simpan data untuk animasi
      mesh.userData = {
         speedX: (Math.random() - 0.5) * 0.015,
         speedY: (Math.random() - 0.5) * 0.015,
         floatSpeed: 0.3 + Math.random() * 0.6,
         floatOffset: Math.random() * Math.PI * 2,
         baseY: mesh.position.y,
         baseZ: mesh.position.z,
         baseScale: 1,
         hoverScale: 1.5, // Membesar 1.5x saat di-hover
         currentScale: 1,
         isHovered: false
      };
      
      scene.add(mesh);
      interactables.push(mesh);
   }

   // === 3. INTERACTIVE CURSOR 3D (Bola Bercahaya) ===
   const cursorGeo = new THREE.SphereGeometry(0.5, 32, 32);
   const cursorMat = new THREE.MeshBasicMaterial({
      color: palette.accent,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
   });
   const cursorMesh = new THREE.Mesh(cursorGeo, cursorMat);
   
   // Titik cahaya di dalam bola
   const lightGeo = new THREE.SphereGeometry(1.5, 16, 16);
   const lightMat = new THREE.MeshBasicMaterial({
      color: palette.primary,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending
   });
   const lightMesh = new THREE.Mesh(lightGeo, lightMat);
   cursorMesh.add(lightMesh); // Jadikan anak dari cursorMesh
   
   scene.add(cursorMesh);

   // === MOUSE & RAYCASTER (Untuk Deteksi Hover) ===
   const mouse = new THREE.Vector2();
   const raycaster = new THREE.Raycaster();
   let targetX = 0, targetY = 0;
   let mouseX = 0, mouseY = 0;

   document.addEventListener('mousemove', (e) => {
      // Normalisasi koordinat mouse (-1 sampai 1)
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

      // Simpan untuk raycaster (posisi 2D)
      mouse.x = mouseX;
      mouse.y = mouseY;

      // Efek Parallax untuk kamera
      targetX = mouseX * 0.5;
      targetY = mouseY * 0.5;
   });

   // === SCROLL EFFECT ===
   let scrollY = 0;
   window.addEventListener('scroll', () => {
      scrollY = window.scrollY;
   }, { passive: true });

   // === ANIMATION LOOP ===
   const clock = new THREE.Clock();
   let animationFrameId;
   let hoveredObject = null;

   function animate() {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // 1. UPDATE CURSOR 3D MENGIKUTI MOUSE
      // Konversi koordinat mouse (-1 sd 1) ke koordinat 3D
      const vector = new THREE.Vector3(mouseX, mouseY, 0.5);
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      const pos = camera.position.clone().add(dir.multiplyScalar(distance));
      
      // Smooth follow untuk kursor
      cursorMesh.position.lerp(pos, 0.15);
      
      // Animasi ukuran kursor
      cursorMesh.scale.setScalar(1 + Math.sin(elapsed * 5) * 0.1);

      // 2. UPDATE PARTIKEL
      particlesMesh.rotation.y = elapsed * 0.03 + targetX * 0.2;
      particlesMesh.rotation.x = targetY * 0.1;

      // 3. RAYCASTER (Deteksi Hover Objek 3D)
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactables);

      // Reset hover sebelumnya
      if (hoveredObject && (!intersects.length || intersects[0].object !== hoveredObject)) {
         hoveredObject.userData.isHovered = false;
         hoveredObject = null;
      }

      // Set hover baru
      if (intersects.length > 0) {
         const obj = intersects[0].object;
         if (obj !== hoveredObject) {
            obj.userData.isHovered = true;
            hoveredObject = obj;
         }
      }

      // 4. ANIMASI OBJEK 3D
      interactables.forEach((obj) => {
         // Rotasi kontinu
         obj.rotation.x += obj.userData.speedX;
         obj.rotation.y += obj.userData.speedY;
         
         // Gerakan melayang
         obj.position.y = obj.userData.baseY
            + Math.sin(elapsed * obj.userData.floatSpeed + obj.userData.floatOffset) * 2;
         
         // Scroll Parallax
         obj.position.z = obj.userData.baseZ - (scrollY * 0.01);

         // Efek Hover (Membesar & Berubah Warna)
         if (obj.userData.isHovered) {
            obj.userData.currentScale += (obj.userData.hoverScale - obj.userData.currentScale) * 0.1;
            obj.material.opacity = 0.8; // Lebih terang
            obj.material.color.setHex(0xffffff); // Jadi putih
         } else {
            obj.userData.currentScale += (obj.userData.baseScale - obj.userData.currentScale) * 0.1;
            obj.material.opacity = 0.25; // Kembali transparan
            // Kembalikan warna asli (cek index)
            const index = interactables.indexOf(obj);
            const baseColor = index % 2 === 0 ? palette.primary : palette.secondary;
            obj.material.color.setHex(baseColor);
         }
         
         // Terapkan skala
         obj.scale.setScalar(obj.userData.currentScale);
      });

      // 5. KAMERA PARALLAX (Bergerak Halus)
      camera.position.x += (targetX * 3 - camera.position.x) * 0.05;
      camera.position.y += (targetY * 3 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
   }

   animate();

   // === RESIZE HANDLER ===
   let resizeTimeout;
   window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
         camera.aspect = window.innerWidth / window.innerHeight;
         camera.updateProjectionMatrix();
         renderer.setSize(window.innerWidth, window.innerHeight);
         renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      }, 150);
   });

   // === THEME CHANGE HANDLER ===
   document.addEventListener('themeChanged', (e) => {
      const theme = e.detail.theme;
      const newPalette = theme === 'dark' ? COLORS.dark : COLORS.light;
      
      // Update warna kursor
      cursorMesh.material.color.setHex(newPalette.accent);
      lightMesh.material.color.setHex(newPalette.primary);

      // Update warna objek 3D
      interactables.forEach((obj, i) => {
         const baseColor = i % 2 === 0 ? newPalette.primary : newPalette.secondary;
         if (!obj.userData.isHovered) {
            obj.material.color.setHex(baseColor);
         }
      });
   });

   // === PAUSE SAAT TAB TIDAK AKTIF ===
   document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
         cancelAnimationFrame(animationFrameId);
      } else {
         clock.start();
         animate();
      }
   });

})();