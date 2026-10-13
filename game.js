const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint } = Matter;

const app = document.getElementById('app');
const engine = Engine.create();
engine.gravity.y = 1.1;

const render = Render.create({
  element: app,
  engine: engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: false,
    background: '#0f172a',
    pixelRatio: window.devicePixelRatio || 1,
  },
});

Render.run(render);
Runner.run(Runner.create(), engine);

const wallColor = '#334155';
const wallThickness = 40;

const floor = Bodies.rectangle(
  window.innerWidth / 2,
  window.innerHeight - 20,
  window.innerWidth,
  wallThickness,
  {
    isStatic: true,
    render: { fillStyle: wallColor },
  }
);

const leftWall = Bodies.rectangle(
  0,
  window.innerHeight / 2,
  wallThickness,
  window.innerHeight,
  {
    isStatic: true,
    render: { fillStyle: wallColor },
  }
);

const rightWall = Bodies.rectangle(
  window.innerWidth,
  window.innerHeight / 2,
  wallThickness,
  window.innerHeight,
  {
    isStatic: true,
    render: { fillStyle: wallColor },
  }
);

const ceiling = Bodies.rectangle(
  window.innerWidth / 2,
  0,
  window.innerWidth,
  wallThickness,
  {
    isStatic: true,
    render: { fillStyle: wallColor },
  }
);

Composite.add(engine.world, [floor, leftWall, rightWall, ceiling]);

function createBox(x, y, width, height, color) {
  const box = Bodies.rectangle(x, y, width, height, {
    restitution: 0.7,
    friction: 0.2,
    density: 0.002,
    render: { fillStyle: color },
  });

  Composite.add(engine.world, box);
  return box;
}

function createBall(x, y, radius, color) {
  const ball = Bodies.circle(x, y, radius, {
    restitution: 0.9,
    density: 0.001,
    friction: 0.01,
    render: { fillStyle: color },
  });

  Composite.add(engine.world, ball);
  return ball;
}

for (let row = 0; row < 5; row++) {
  for (let col = 0; col < 7; col++) {
    const spacing = 60;
    const x = 220 + col * spacing + (row % 2) * 30;
    const y = 120 + row * 52;
    createBox(x, y, 42, 42, `hsl(${(row * 30 + col * 15) % 360} 70% 60%)`);
  }
}

const pillarLeft = Bodies.rectangle(140, window.innerHeight - 140, 20, 180, {
  isStatic: true,
  render: { fillStyle: '#475569' },
});

const pillarRight = Bodies.rectangle(window.innerWidth - 140, window.innerHeight - 140, 20, 180, {
  isStatic: true,
  render: { fillStyle: '#475569' },
});

Composite.add(engine.world, [pillarLeft, pillarRight]);

const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse,
  constraint: {
    stiffness: 0.2,
    render: { visible: false },
  },
});

Composite.add(engine.world, mouseConstraint);

window.addEventListener('resize', () => {
  render.canvas.width = window.innerWidth;
  render.canvas.height = window.innerHeight;
  render.options.width = window.innerWidth;
  render.options.height = window.innerHeight;
});

window.addEventListener('click', (event) => {
  const x = event.clientX;
  const y = event.clientY;
  const radius = 16 + Math.random() * 12;
  const hue = Math.floor(Math.random() * 360);
  createBall(x, y, radius, `hsl(${hue} 80% 65%)`);
});

window.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    const bodies = Composite.allBodies(engine.world);
    bodies.forEach((body) => {
      if (!body.isStatic && body !== mouseConstraint.body) {
        Composite.remove(engine.world, body);
      }
    });
  }
});

window.addEventListener('contextmenu', (event) => {
  event.preventDefault();
});

Render.lookAt(render, {
  min: { x: 0, y: 0 },
  max: { x: window.innerWidth, y: window.innerHeight },
});
