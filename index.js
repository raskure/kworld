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

  putGrid(scene);
  const cubes = putWheelOfBoxes(scene);
  cubes2 = putWheelOfBoxes(scene, num = 100, size = 0.1, radius = 5, color = 0x0000ff);

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
    let wd = camera.getWorldDirection(new THREE.Vector3);
    let wu = (new THREE.Vector3()).copy(camera.up);
    for (let key in keystate) {
      let tmp = new THREE.Vector3();
      switch (key) {
        case "w":
          tmp.copy(wd).multiplyScalar(dt);
          camera.position.add(tmp);
          break;
        case "s":
          tmp.copy(wd).negate().multiplyScalar(dt);
          camera.position.add(tmp);
          break;
        case "a":
          tmp.crossVectors(wd, wu).negate().multiplyScalar(dt);
          camera.position.add(tmp);
          break;
        case "d":
          tmp.crossVectors(wd, wu).multiplyScalar(dt);
          camera.position.add(tmp);
          break;
        case "ArrowUp":
          tmp.copy(wu).multiplyScalar(dt).add(wd).add(camera.position);
          camera.lookAt(tmp);
          break;
        case "ArrowDown":
          tmp.copy(wu).negate().multiplyScalar(dt).add(wd).add(camera.position);
          camera.lookAt(tmp);
          break;
        case "ArrowLeft":
          tmp.crossVectors(wd, wu).negate().multiplyScalar(dt).add(wd).add(camera.position);
          camera.lookAt(tmp);
          break;
        case "ArrowRight":
          tmp.crossVectors(wd, wu).multiplyScalar(dt).add(wd).add(camera.position);
          camera.lookAt(tmp);
          break;
        case "mousemove.x":
          camera.rotation.y += keystate[key] * dt / 30;
          break;
        case "mousemove.y":
          camera.rotation.x += keystate[key] * dt / 30;
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


function putGrid(scene) {
  let num = 10;
  let color = 0xcccccc;
  for (let i = -num; i <= num; i++) {
    for (let j = -num; j <= num; j++) {
      let line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(i, j, num),
          new THREE.Vector3(i, j, -num)
        ]),
        new THREE.LineBasicMaterial({ color: color })
      );
      scene.add(line);
      line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(i, num, j),
          new THREE.Vector3(i, -num, j)
        ]),
        new THREE.LineBasicMaterial({ color: color })
      );
      scene.add(line);
      line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(num, i, j),
          new THREE.Vector3(-num, i, j)
        ]),
        new THREE.LineBasicMaterial({ color: color })
      );
      scene.add(line);
    }
  }
}

function putWheelOfBoxes(scene, num = 50, size = 0.1, radius = 2, color = 0x00ff00) {
  let cubes = new Array();
  for (let i = 0; i < num; i++) {
    let cube = new THREE.Mesh(new THREE.BoxGeometry(size, size, size), new THREE.MeshStandardMaterial({ color: color }));
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