const perfectFrameTime = 1000 / 60;
let deltaTime = 0;
let lastTimestamp = 0;

//board
let board;
let boardWidth = 800;
let boardHeight = 800;
let context;

//Frieren
let frierenWidth = 34;
let frierenHeight = 50;
let frierenX = boardWidth / 2;
let frierenY = boardHeight - 750;
let frierenImg;

let frieren = {
  x: frierenX,
  y: frierenY,
  width: frierenWidth,
  height: frierenHeight,
  startX: null,
  startY: null,
  targetX: null,
  targetY: null,
  startTime: null,
};

//Fern
let fernWidth = 27;
let fernHeight = 50;
let fernX = boardWidth / 2;
let fernY = boardHeight - fernHeight - 50;
let fernImg;

let fern = {
  x: fernX,
  y: fernY,
  width: fernWidth,
  height: fernHeight,
};

let keysPressed = {};
const speed = 500;

//Zoltraak
let zoltraakWidth = 128;
let zoltraakHeight = 24;
let zoltraakSpeed = 30000;
let zoltraakArray = [];
const zoltraakImg = new Image();
zoltraakImg.src = 'assets/Zoltraak.png';
const zoltraakSpriteWidth = 256;
const zoltraakSpriteHeight = 24;
const zoltraakFrameSpeed = 1000 / 12;
let zoltraakFrameTime = 0;
let zoltraakFX = false;

const zoltraakEndImg = new Image();
zoltraakEndImg.src = 'assets/zoltraakEnd.png';
const zoltraakEndSpriteWidth = 256;
const zoltraakEndSpriteHeight = 256;
const zoltraakEndFrameSpeed = 1000 / 16;

//Judradjim
let judradjimArray = [];
let judradjimRadius = 50;
let judradjimCount = 10;
let judradjimSpacing = 20;
let judradjimDistance = 2 * judradjimRadius + judradjimSpacing;
const judradjimImg = new Image();
judradjimImg.src = 'assets/Judradjim.png';
const judradjimSpriteWidth = 256;
const judradjimSpriteHeight = 256;
const judradjimSpeed = 1000 / 6;
let judradjimFX = false;

//Vollzanbel
let vollzanbelArray = [];
let vollzanbelRadius = 400;
let vollzanbelArc = 0.6;
const vollzanbelImg = new Image();
vollzanbelImg.src = 'assets/Vollzanbel.png';
const vollzanbelSpriteWidth = 400;
const vollzanbelSpriteHeight = 400;
const vollzanbelSpeed = 1000 / 8;
let vollzanbelFX = false;

//Magic Circle
const magicImg = new Image();
magicImg.src = 'assets/magic.png';
const magicSpriteWidth = 512;
const magicSpriteHeight = 512;
const magicSpeed = 1000 / 36;
let magicArray = [];

let gameOver = false;
let startTime;
let gameOverImg = new Image();
gameOverImg.src = "assets/gameover.jpg";
let fullScreen = false;
let score;
let highScore = 0;

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  video = document.createElement("video");
  video.src = "assets/menu.mp4";
  video.autoplay = true;
  video.loop = true;
  video.muted = true;

  video.addEventListener("loadeddata", () => {
    board.width = video.videoWidth;
    board.height = video.videoHeight;
  });

  video.addEventListener("play", drawVideoToCanvas);
  video.play();

  const incantation = document.getElementById("incantation");
  incantation.muted = true;
  const spellFX = document.getElementById("spellFX");
  spellFX.muted = true;
  const audio = document.getElementById("audio");
  audio.muted = true;
  audio.loop = true;

  function onSpacebarPress(event) {
    if (event.key === " ") {
      document.removeEventListener("keydown", onSpacebarPress);
      start();
    }
  }
  document.addEventListener("keydown", onSpacebarPress);

  document.addEventListener("keydown", (event) => {
    if (event.key === "m" || event.key === "M") { // Press "M" to toggle mute
      if (audio.muted == true) { audio.play(); audio.muted = false; incantation.muted = false; spellFX.muted = false }
      else { audio.muted = true; incantation.muted = true; spellFX.muted = true }
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "f" || event.key === "F") { // Press "F" to toggle fullscreen
      toggleFullScreen();
    }
  });

  // Listen for fullscreen changes to update the fullScreen variable
  document.addEventListener("fullscreenchange", () => {
    fullScreen = !!document.fullscreenElement;
  });
  document.addEventListener("webkitfullscreenchange", () => { // Safari
    fullScreen = !!document.webkitFullscreenElement;
  });
  document.addEventListener("mozfullscreenchange", () => { // Firefox
    fullScreen = !!document.mozFullScreenElement;
  });
  document.addEventListener("msfullscreenchange", () => { // IE/Edge
    fullScreen = !!document.msFullscreenElement;
  });
};

function drawVideoToCanvas() {
  if (!video.paused && !video.ended) {
    context.drawImage(video, 0, 0, board.width, board.height);
    requestAnimationFrame(drawVideoToCanvas);
  }
}

function toggleFullScreen() {
  if (!fullScreen) {
    // Enter fullscreen
    if (board.requestFullscreen) {
      board.requestFullscreen();
    } else if (board.webkitRequestFullscreen) { // Safari
      board.webkitRequestFullscreen();
    } else if (board.mozRequestFullScreen) { // Firefox
      board.mozRequestFullScreen();
    } else if (board.msRequestFullscreen) { // IE/Edge
      board.msRequestFullscreen();
    }
  } else {
    // Exit fullscreen
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { // Safari
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) { // Firefox
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) { // IE/Edge
      document.msExitFullscreen();
    }
  }
}

function start() {
  gameOver = false;
  fern.x = boardWidth / 2;
  fern.y = boardHeight - fernHeight - 50;
  frieren.x = boardWidth / 2;
  frieren.y = boardHeight - 750;
  keysPressed = {};
  deltaTime = 0;
  lastTimestamp = 0;
  audio.src = '';
  gameOverMenuDisplayed = false;
  video.pause();
  video.remove();

  audio.src = "assets/Evan Call - Dragon Smasher.mp3";
  audio.play();

  //load images
  frierenImg = new Image();
  frierenImg.src = "assets/frieren.png";
  frierenImg.onload = function () {
    context.drawImage(
      frierenImg,
      frieren.x,
      frieren.y,
      frieren.width,
      frieren.height
    );
  };

  fernImg = new Image();
  fernImg.src = "assets/fern.png";
  fernImg.onload = function () {
    context.drawImage(fernImg, fern.x, fern.y, fern.width, fern.height);
  };

  startMoveFrieren();
  update(lastTimestamp);
  document.addEventListener("keydown", (e) => (keysPressed[e.code] = true));
  document.addEventListener("keyup", (e) => (keysPressed[e.code] = false));
  startTime = Date.now();
}

function update(timestamp) {
  deltaTime = (timestamp - lastTimestamp) / perfectFrameTime;
  lastTimestamp = timestamp;

  if (gameOver) {
    zoltraakArray = [];
    judradjimArray = [];
    vollzanbelArray = [];
    magicArray = [];
    // Do not call the game over menu repeatedly, only once
    if (!gameOverMenuDisplayed) {
      audio.pause();
      dispGameOverMenu(0); // Call your game over menu
      gameOverMenuDisplayed = true;  // Prevent multiple calls
    }
    return; // Skip the rest of the update cycle if game over
  }

  requestAnimationFrame(update);

  context.clearRect(0, 0, boardWidth, boardHeight);

  bgImg = new Image();
  bgImg.src = "assets/background.jpg";
  context.drawImage(bgImg, 0, 0, board.width, board.height);

  moveFern(deltaTime);
  requestAnimationFrame(moveFrieren);

  // Update and render vollzanbel elements
  vollzanbelArray = vollzanbelArray.filter(vollzanbel => {
    vollzanbel.duration += deltaTime * perfectFrameTime;

    context.beginPath();
    context.moveTo(vollzanbel.center.x, vollzanbel.center.y);
    context.arc(vollzanbel.center.x, vollzanbel.center.y, vollzanbel.radius - 50, vollzanbel.startAngle, vollzanbel.endAngle);
    context.closePath();
    context.fillStyle = "rgba(255, 0, 0, 0.25)";
    context.fill();

    if (vollzanbel.duration >= 1000) {
      if (vollzanbel.frame == 2 && vollzanbelFX == false) {
        spellFX.src = "assets/VollzanbelFX.mp3";
        spellFX.play();
        vollzanbelFX = true;
      }

      let startX = vollzanbel.center.x + vollzanbel.radius * Math.cos(vollzanbel.startAngle);
      let startY = vollzanbel.center.y + vollzanbel.radius * Math.sin(vollzanbel.startAngle);

      let endX = vollzanbel.center.x + vollzanbel.radius * Math.cos(vollzanbel.endAngle);
      let endY = vollzanbel.center.y + vollzanbel.radius * Math.sin(vollzanbel.endAngle);

      let vollzanbel_area = { p1: { x: vollzanbel.center.x, y: vollzanbel.center.y }, p2: { x: startX, y: startY }, p3: { x: endX, y: endY } };
      let fern_area = { x: fern.x, y: fern.y, width: fern.width, height: fern.height };

      if (triangleRectangleCollision(vollzanbel_area, fern_area) && vollzanbel.frame >= 2) {
        gameOver = true;
      }

      context.save();
      context.translate(vollzanbel.center.x, vollzanbel.center.y);
      context.rotate(vollzanbel.angle - 0.95);
      context.drawImage(
        vollzanbelImg,
        vollzanbel.frame * vollzanbelSpriteWidth,
        0,
        vollzanbelSpriteWidth,
        vollzanbelSpriteHeight,
        0, 0,
        vollzanbelSpriteWidth, vollzanbelSpriteHeight
      );
      context.restore();

      vollzanbel.frameTime += deltaTime * perfectFrameTime;

      // Update frame if enough time has passed
      if (vollzanbel.frameTime >= vollzanbelSpeed) {
        vollzanbel.frame = (vollzanbel.frame + 1) % 14;
        vollzanbel.frameTime -= vollzanbelSpeed;
      }

      // Remove the vollzanbel if it completes its animation
      if (vollzanbel.frame === 13) {
        return false; // Remove vollzanbel after finishing the last frame
      }
    }

    return true; // Keep active vollzanbel
  });

  // Update and render judradjim elements
  judradjimArray = judradjimArray.filter(judradjim => {
    judradjim.duration += deltaTime * perfectFrameTime;

    context.beginPath();
    context.arc(judradjim.x, judradjim.y, judradjimRadius, 0, Math.PI * 2);
    context.fillStyle = "rgba(255, 0, 0, 0.25)";
    context.fill();

    if (judradjim.duration >= 1250) {
      if (judradjim.frame == 3 && judradjimFX == false) {
        spellFX.src = "assets/JudradjimFX.mp3";
        spellFX.play();
        judradjimFX = true;
      }

      if (detectCircleCollision(judradjim, judradjimRadius, fern) && judradjim.frame >= 3) {
        gameOver = true;
      }

      context.drawImage(
        judradjimImg,
        judradjim.frame * judradjimSpriteWidth,
        0,
        judradjim.width,
        judradjim.height,
        judradjim.x - 110, judradjim.y - judradjim.height + 40,
        judradjim.width,
        judradjim.height
      );

      judradjim.frameTime += deltaTime * perfectFrameTime;

      // Update frame if enough time has passed
      if (judradjim.frameTime >= judradjimSpeed) {
        judradjim.frame = (judradjim.frame + 1) % 9;
        judradjim.frameTime -= judradjimSpeed;
      }

      if (judradjim.frame === 8) {
        return false;
      }
    }

    return true; // Keep active judradjim
  });

  zoltraakArray = zoltraakArray.filter(zoltraak => {
    if (!zoltraak.ended) {
      // Check for canvas boundary collisions
      if (zoltraak.x <= 0 || zoltraak.x + zoltraak.width >= boardWidth ||
        zoltraak.y <= 0 || zoltraak.y + zoltraak.height >= boardHeight) {
        zoltraak.ended = true;
      }
      // Update position using the global deltaTime
      zoltraak.x += zoltraak.velocityX * (deltaTime / 1000);
      zoltraak.y += zoltraak.velocityY * (deltaTime / 1000);

      context.save();
      context.translate(zoltraak.x + zoltraak.width / 2, zoltraak.y + zoltraak.height / 2);
      context.rotate(zoltraak.angle);
      context.translate(-30, -12);
      context.drawImage(
        zoltraakImg,
        zoltraak.frame * zoltraakSpriteWidth,
        0,
        zoltraakSpriteWidth,
        zoltraakSpriteHeight,
        0, 0,
        zoltraak.width,
        zoltraak.height
      );
      context.restore();

      zoltraak.frameTime += deltaTime * perfectFrameTime;
      if (zoltraak.frameTime >= zoltraakFrameTime) {
        zoltraak.frame = (zoltraak.frame + 1) % 14;
        zoltraak.frameTime -= zoltraakFrameSpeed;
      }

      if (zoltraak.frame === 9) {
        zoltraak.frame = 0;
      }
    }

    // Drawing zoltraak at its end position (on the border after collision)
    if (zoltraak.ended) {
      context.drawImage(
        zoltraakEndImg,
        zoltraak.endFrame * zoltraakEndSpriteWidth,
        0,
        zoltraakEndSpriteWidth,
        zoltraakEndSpriteHeight,
        zoltraak.x - 32, zoltraak.y - 32, // New position after collision
        zoltraakEndSpriteWidth / 2,
        zoltraakEndSpriteHeight / 2
      );

      zoltraak.endFrameTime += deltaTime * perfectFrameTime;
      if (zoltraak.endFrameTime >= zoltraakEndFrameSpeed) {
        zoltraak.endFrame = (zoltraak.endFrame + 1) % 10;
        zoltraak.endFrameTime -= zoltraakEndFrameSpeed;
      }

      // Stop the animation when the last frame is reached
      if (zoltraak.endFrame === 9) {
        return false; // Exit once the animation is done
      }
    }

    // Collision check
    if (detectRectCollision(zoltraak, fern)) {
      gameOver = true;
    }

    return true;
  });

  //Draw Freiren shadow 
  context.beginPath();
  context.ellipse(frieren.x + 17, frieren.y + 70, 20, 10, 0, 0, 2 * Math.PI);
  context.fillStyle = "rgba(0, 0, 0, 0.25)";
  context.fill();

  //Draw Fern shadow
  context.beginPath();
  context.ellipse(fern.x + 14, fern.y + 50, 20, 10, 0, 0, 2 * Math.PI);
  context.fillStyle = "rgba(0, 0, 0, 0.25)";
  context.fill();

  context.drawImage(
    frierenImg,
    frieren.x,
    frieren.y,
    frieren.width,
    frieren.height
  );
  context.drawImage(fernImg, fern.x, fern.y, fern.width, fern.height);

  //Draw magic circle
  magicArray = magicArray.filter(magic => {
    context.drawImage(
      magicImg,
      magic.frame * magicSpriteWidth,
      0,
      magicSpriteWidth,
      magicSpriteHeight,
      frieren.x, frieren.y,
      80,
      80
    );

    magic.frameTime += deltaTime * perfectFrameTime;
    if (magic.frameTime >= magicSpeed) {
      magic.frame = (magic.frame + 1) % 37;
      magic.frameTime -= magicSpeed;
    }

    if (magic.frame === 36) {
      return false;
    }

    return true;
  });

  context.font = "20px 'Press Start 2P'";
  context.fillStyle = "white";
  score = Math.floor((Date.now() - startTime) / 1000);
  context.fillText(score, 50, 50);

  if (fullScreen == false) {
    context.font = "50px 'Press Start 2P'";
    context.fillText("⛶", board.width - 60, 60);
    context.font = "20px 'Press Start 2P'";
    context.fillText("F", board.width - 48, 90);
  } else {
    context.font = "50px 'Press Start 2P'";
    context.fillText("▭", board.width - 80, 60);
    context.font = "20px 'Press Start 2P'";
    context.fillText("F", board.width - 65, 90);
  }

  context.font = "50px 'Press Start 2P'";
  context.fillText("♪", board.width - 120, 60);
  context.font = "20px 'Press Start 2P'";
  context.fillText("M", board.width - 118, 90);

  if (audio.muted == false) {
    context.font = "30px 'Press Start 2P'";
    context.fillText("\\", board.width - 118, 65);
  }
}

function dispGameOverMenu(menuOpacity) {
  function onGameOverKeyPress(event) {
    if (event.code === "Space") {
      // Remove the event listener after it's been triggered to prevent multiple calls
      document.removeEventListener("keydown", onGameOverKeyPress);
      start();
    }
  }

  if (score > highScore) highScore = score;

  // Ensure the event listener is added at the beginning, before the fading process
  if (menuOpacity === 0) {
    document.addEventListener("keydown", onGameOverKeyPress);
  }

  context.globalAlpha = menuOpacity;
  context.fillStyle = "white";
  context.fillRect(0, 0, boardWidth, boardHeight);

  if (menuOpacity < 1) {
    menuOpacity += 0.01; // Adjust for desired fade-in speed
    requestAnimationFrame(function () {
      dispGameOverMenu(menuOpacity);
    });
  } else {
    // Reset opacity for the image and render it
    context.globalAlpha = 1;
    context.drawImage(gameOverImg, 0, 0, boardWidth, boardHeight);
    context.font = "50px 'Press Start 2P'";
    context.fillText("GAME OVER", 180, 250);
    context.font = "20px 'Press Start 2P'";
    context.fillText("Score: " + score, 50, 50);
    context.fillText("High Score: " + highScore, 50, 100);
    context.fillText("Press SPACE to restart", 180, 700);
  }
}

function moveFern(deltaTime) {
  let dx = 0;
  let dy = 0;

  // Check keys to set direction
  if (keysPressed["KeyW"] || keysPressed["ArrowUp"]) dy = -1;
  if (keysPressed["KeyS"] || keysPressed["ArrowDown"]) dy = 1;
  if (keysPressed["KeyA"] || keysPressed["ArrowLeft"]) dx = -1;
  if (keysPressed["KeyD"] || keysPressed["ArrowRight"]) dx = 1;

  // Normalize diagonal movement
  if (dx !== 0 && dy !== 0) {
    dx *= Math.SQRT1_2;
    dy *= Math.SQRT1_2;
  }

  // Adjust movement by deltaTime for consistent speed
  const frameSpeed = speed * deltaTime * (perfectFrameTime / 1000);

  // Update fern position, keeping it within bounds
  fern.x = Math.max(0, Math.min(board.width - fern.width, fern.x + dx * frameSpeed));
  fern.y = Math.max(0, Math.min(board.height - fern.height, fern.y + dy * frameSpeed));
}

function startMoveFrieren() {
  frieren.startX = frieren.x;
  frieren.startY = frieren.y;
  frieren.targetX = Math.floor(Math.random() * (750 - frieren.width - 75) + 75);
  frieren.targetY = Math.floor(Math.random() * (750 - frieren.height - 75) + 75);
  frieren.startTime = performance.now();
}

function moveFrieren(timestamp) {
  if (gameOver) {
    return;
  }

  if (!frieren.startTime) frieren.startTime = timestamp; // Initialize start time if not set

  // Calculate how much time has passed
  const elapsed = timestamp - frieren.startTime;
  const duration = 1500;
  const t = Math.min(elapsed / duration, 1); // Normalize time (0 to 1)

  // Ease-in-out interpolation
  const easedT = t < 0.5 ? 2 * t * t : - 1 + (4 - 2 * t) * t;

  // Calculate the exact position along the path from start to target
  frieren.x = frieren.startX + (frieren.targetX - frieren.startX) * easedT;
  frieren.y = frieren.startY + (frieren.targetY - frieren.startY) * easedT;

  // If movement is complete, set up the next move
  if (elapsed >= duration) {
    castSpell();
    startMoveFrieren(); // Set a new target for the next move
  }
}

function castSpell() {
  magicArray.push({ frame: 0, frameTime: 0 });

  let spells = { castZoltraak, castJudradjim, castVollzanbel };
  const spellKeys = Object.keys(spells);

  let dx = frieren.x - fern.x;
  let dy = frieren.y - fern.y;

  if (Math.sqrt(dx * dx + dy * dy) <= vollzanbelRadius) {
    if (Math.random() <= 0.5) {
      spells['castVollzanbel']();
    } else {
      const randomIndex = Math.floor(Math.random() * (spellKeys.length - 1));
      spells[spellKeys[randomIndex]]();
    }
  }
  else {
    const randomIndex = Math.floor(Math.random() * (spellKeys.length - 1));
    spells[spellKeys[randomIndex]]();
  }
}

function calculateAngle(x1, y1, x2, y2) {
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;

  // atan2 gives the angle in radians between the x-axis and the line to the point
  const angle = Math.atan2(deltaY, deltaX);

  return angle;
}

function castZoltraak() {
  incantation.src = "assets/Zoltraak.mp3";
  incantation.play();

  setTimeout(function () {
    let fern_x = fern.x;
    let fern_y = fern.y;

    setTimeout(function () {
      angle = calculateAngle(frieren.x, frieren.y, fern_x, fern_y);
      x = frieren.x;
      y = frieren.y;

      width = zoltraakWidth;
      height = zoltraakHeight;

      const velocityX = zoltraakSpeed * Math.cos(angle);
      const velocityY = zoltraakSpeed * Math.sin(angle);

      zoltraakArray.push({ x, y, width, height, angle, velocityX, velocityY, frame: 0, frameTime: 0, endFrame: 0, endFrameTime: 0, ended: false });

      if (zoltraakFX == false) {
        spellFX.src = "assets/ZoltraakFX.mp3";
        spellFX.play();
        zoltraakFX = true;
      }
    }, 250);
  }, 750);

  zoltraakFX = false;
}

function castJudradjim() {
  incantation.src = "assets/Judradjim.mp3";
  incantation.play();

  let x, y, duration = 0;

  // Keep generating new (x, y) until it's far enough from all others
  for (i = 0; i < judradjimCount; i++) {
    do {
      x = Math.floor(Math.random() * (800 - 2 * judradjimRadius)) + judradjimRadius;
      y = Math.floor(Math.random() * (800 - 2 * judradjimRadius)) + judradjimRadius;
    } while (!judradjimSpaced(x, y));
    judradjimArray.push({ x, y, duration, width: judradjimSpriteWidth, height: judradjimSpriteHeight, frame: 0, frameTime: 0 });
  }

  judradjimFX = false;
}

function judradjimSpaced(x, y) {
  // Check if (x, y) is far enough from all other judradjim in the array
  for (let judradjim of judradjimArray) {
    let distance = Math.sqrt(Math.pow(judradjim.x - x, 2) + Math.pow(judradjim.y - y, 2));
    if (distance < judradjimDistance) {
      return false; // Not far enough
    }
  }
  return true; // Far enough from all others
}

function castVollzanbel() {
  incantation.src = "assets/Vollzanbel.mp3";
  incantation.play();

  let x = frieren.x;
  let y = frieren.y;

  let angle = calculateAngle(frieren.x, frieren.y, fern.x, fern.y);

  vollzanbelArray.push({
    center: { x, y },
    width: vollzanbelSpriteWidth,
    height: vollzanbelSpriteHeight,
    frame: 0,
    frameTime: 0,
    angle: angle,
    duration: 0,
    radius: vollzanbelRadius,
    startAngle: angle - vollzanbelArc,
    endAngle: angle + vollzanbelArc
  })

  vollzanbelFX = false;
}

function detectRectCollision(a, b) {
  return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
    a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
    a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
    a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}

function detectCircleCollision(circle, radius, rect) {
  // Find the closest point on the rectangle to the circle's center
  let closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
  let closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));

  // Calculate the distance between the circle's center and the closest point
  let dx = circle.x - closestX;
  let dy = circle.y - closestY;

  // Check if the distance is less than or equal to the circle's radius
  return Math.sqrt(dx * dx + dy * dy) <= radius;
}

function triangleRectangleCollision(triangle, rectangle) {
  function boundingBoxCollision(triangle, rectangle) {
    // Get the bounding box of the triangle
    let minX = Math.min(triangle.p1.x, triangle.p2.x, triangle.p3.x);
    let maxX = Math.max(triangle.p1.x, triangle.p2.x, triangle.p3.x);
    let minY = Math.min(triangle.p1.y, triangle.p2.y, triangle.p3.y);
    let maxY = Math.max(triangle.p1.y, triangle.p2.y, triangle.p3.y);

    // Get the bounding box of the rectangle
    let rectMinX = rectangle.x;
    let rectMaxX = rectangle.x + rectangle.width;
    let rectMinY = rectangle.y;
    let rectMaxY = rectangle.y + rectangle.height;

    // Check if the bounding boxes overlap
    return !(maxX < rectMinX || minX > rectMaxX || maxY < rectMinY || minY > rectMaxY);
  }

  function onSegment(p, q, r) {
    return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
  }

  function orientation(p, q, r) {
    let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    if (val === 0) return 0; // collinear
    return (val > 0) ? 1 : 2; // 1 -> clockwise, 2 -> counterclockwise
  }

  function doIntersect(p1, q1, p2, q2) {
    let o1 = orientation(p1, q1, p2);
    let o2 = orientation(p1, q1, q2);
    let o3 = orientation(p2, q2, p1);
    let o4 = orientation(p2, q2, q1);

    if (o1 !== o2 && o3 !== o4) return true; // general case

    if (o1 === 0 && onSegment(p1, p2, q1)) return true; // p1, q1 and p2 are collinear
    if (o2 === 0 && onSegment(p1, q2, q1)) return true;
    if (o3 === 0 && onSegment(p2, p1, q2)) return true;
    if (o4 === 0 && onSegment(p2, q1, q2)) return true;

    return false; // no intersection
  }

  function checkEdgesIntersect(triangle, rectangle) {
    let edgesTriangle = [
      { p1: triangle.p1, p2: triangle.p2 },
      { p1: triangle.p2, p2: triangle.p3 },
      { p1: triangle.p3, p2: triangle.p1 }
    ];

    let edgesRectangle = [
      { p1: { x: rectangle.x, y: rectangle.y }, p2: { x: rectangle.x + rectangle.width, y: rectangle.y } },
      { p1: { x: rectangle.x + rectangle.width, y: rectangle.y }, p2: { x: rectangle.x + rectangle.width, y: rectangle.y + rectangle.height } },
      { p1: { x: rectangle.x + rectangle.width, y: rectangle.y + rectangle.height }, p2: { x: rectangle.x, y: rectangle.y + rectangle.height } },
      { p1: { x: rectangle.x, y: rectangle.y + rectangle.height }, p2: { x: rectangle.x, y: rectangle.y } }
    ];

    // Check if any edge of the triangle intersects with any edge of the rectangle
    for (let tEdge of edgesTriangle) {
      for (let rEdge of edgesRectangle) {
        if (doIntersect(tEdge.p1, tEdge.p2, rEdge.p1, rEdge.p2)) {
          return true;
        }
      }
    }
    return false;
  }

  function isPointInTriangle(p, triangle) {
    let v0 = { x: triangle.p3.x - triangle.p1.x, y: triangle.p3.y - triangle.p1.y };
    let v1 = { x: triangle.p2.x - triangle.p1.x, y: triangle.p2.y - triangle.p1.y };
    let v2 = { x: p.x - triangle.p1.x, y: p.y - triangle.p1.y };

    let dot00 = v0.x * v0.x + v0.y * v0.y;
    let dot01 = v0.x * v1.x + v0.y * v1.y;
    let dot02 = v0.x * v2.x + v0.y * v2.y;
    let dot11 = v1.x * v1.x + v1.y * v1.y;
    let dot12 = v1.x * v2.x + v1.y * v2.y;

    let invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
    let u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    let v = (dot00 * dot12 - dot01 * dot02) * invDenom;

    return (u >= 0) && (v >= 0) && (u + v <= 1);
  }

  function checkRectangleCornersInTriangle(rectangle, triangle) {
    let rectangleCorners = [
      { x: rectangle.x, y: rectangle.y },
      { x: rectangle.x + rectangle.width, y: rectangle.y },
      { x: rectangle.x, y: rectangle.y + rectangle.height },
      { x: rectangle.x + rectangle.width, y: rectangle.y + rectangle.height }
    ];

    for (let corner of rectangleCorners) {
      if (isPointInTriangle(corner, triangle)) {
        return true;
      }
    }
    return false;
  }

  // Step 1: Bounding Box Collision (Quick check)
  if (!boundingBoxCollision(triangle, rectangle)) {
    return false;
  }

  // Step 2: Check if any edges of the triangle intersect with the rectangle
  if (checkEdgesIntersect(triangle, rectangle)) {
    return true;
  }

  // Step 3: Check if any corner of the rectangle is inside the triangle
  if (checkRectangleCornersInTriangle(rectangle, triangle)) {
    return true;
  }

  // Step 4: No collision
  return false;
}