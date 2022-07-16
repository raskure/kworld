window.addEventListener("load", function () {
  document.body.style.margin = 0;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0x00ff00 }));
  scene.add(cube);

  camera.position.z = 5;

  scene.background = new THREE.Color(0xffffff);

  const cubes = putWheelOfBoxes(scene);

  const alight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(alight);
  const dlight = new THREE.DirectionalLight(0xffffff, 0.5);
  scene.add(dlight);

  keystate = new Object();

  let last = performance.now();
  function animate(ts) {
    requestAnimationFrame(animate);
    let dt = (ts - last) / 1000;
    last = ts;
    cube.rotation.x += 0.1 * dt;
    cube.rotation.y += 0.1 * dt;
    rotateWheelOfBoxes(cubes, dt);
    for (let key in keystate) {
      switch (key) {
        case "w":
          camera.position.z += -keystate[key] * dt;
          break;
        case "s":
          camera.position.z += keystate[key] * dt;
          break;
        case "a":
          camera.position.x += -keystate[key] * dt;
          break;
        case "d":
          camera.position.x += keystate[key] * dt;
          break;
        case "ArrowUp":
          camera.rotation.x += keystate[key] * dt;
          break;
        case "ArrowDown":
          camera.rotation.x += -keystate[key] * dt;
          break;
        case "ArrowLeft":
          camera.rotation.y += keystate[key] * dt;
          break;
        case "ArrowRight":
          camera.rotation.y += -keystate[key] * dt;
          break;
        case "mousemove.x":
          camera.rotation.y += keystate[key] * dt;
          break;
        case "mousemove.y":
          camera.rotation.x += keystate[key] * dt;
          break;
      }
    }
    renderer.render(scene, camera);
  }
  animate(last);

  window.addEventListener("keydown", function (e) {
    keystate[e.key] = 1;
  });
  window.addEventListener("keyup", function (e) {
    delete keystate[e.key];
  });
  window.addEventListener("blur", function () {
    for (let key in keystate) {
      delete keystate[key];
    }
  })
  let id = -1;
  window.addEventListener("mousemove", function (e) {
    let d = Math.sqrt(e.movementX * e.movementX + e.movementY * e.movementY);
    e.preventDefault();
    console.log(d);
    if (!isNaN(d) && d != 0) {
      keystate["mousemove.x"] = e.movementX;
      keystate["mousemove.y"] = e.movementY;
      if (id >= 0) {
        clearTimeout(id);
      }
      id = setTimeout(function () {
        delete keystate["mousemove.x"];
        delete keystate["mousemove.y"];
        id = -1;
      }, 1);
    }
  });

  console.log("The initialization is finished.")
});





function putWheelOfBoxes(scene, num = 50, size = 0.1, radius = 2) {
  let cubes = new Array();
  for (let i = 0; i < num; i++) {
    let cube = new THREE.Mesh(new THREE.BoxGeometry(size, size, size), new THREE.MeshStandardMaterial({ color: 0x00ff00 }));
    cube.position.x = radius * Math.cos(2 * Math.PI * i / num);
    cube.position.y = radius * Math.sin(2 * Math.PI * i / num);
    cube.rotation.z = 2 * Math.PI * i / num;
    cubes.push(cube);
    scene.add(cube);
  }
  return cubes;
}

function rotateWheelOfBoxes(cubes, dt) {
  cubes.forEach(function (cube) {
    x = cube.position.x;
    y = cube.position.y;
    cube.position.x = Math.cos(0.1 * dt) * x - Math.sin(0.1 * dt) * y;
    cube.position.y = Math.sin(0.1 * dt) * x + Math.cos(0.1 * dt) * y;
    cube.rotation.z += 0.1 * dt;
  });
}