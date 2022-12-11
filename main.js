// import * as Matter from "matter-js"
function percentX(percent) {
  return Math.round((percent / 100) * window.innerWidth);
}
function percentY(percent) {
  return Math.round((percent / 100) * window.innerHeight);
}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// module aliases
const Engine = Matter.Engine,
      Bodies = Matter.Bodies,
      Body = Matter.Body,
      Svg = Matter.Svg,
      Vertices = Matter.Vertices,
      Constraint = Matter.Constraint,
      Composite = Matter.Composite,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint,
      Render = Matter.Render,
      Runner = Matter.Runner;

// create an engine
const engine = Engine.create(),
      world = engine.world;

// create a renderer
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: false,
    showInternalEdges: false,
    width: percentX(100),
    height: percentY(100),
    background: "transparent"
  }
});

let bodies = []

const width = 800, height = 600;

function customShape(x, y, shape, color) {
    let vertices = Matter.Vertices.fromPath(shape);
    return Matter.Bodies.fromVertices(x, y, vertices, {
        
      isStatic: 0,
      mass: 0,
      render: { 
        fillStyle: color,
        lineWidth: 0
      }
    });
}

//frame
let ground = Bodies.rectangle(percentX(100) / 2, percentY(100) + 10, percentX(100), 20, { isStatic: true });
let ceiling = Bodies.rectangle(percentX(100) / 2, percentY(0) - 10, percentX(100), 20, { isStatic: true }); 
let rightWall = Bodies.rectangle(percentX(100) + 10, percentY(100) / 2, 20, percentY(100), { isStatic: true });
let leftWall = Bodies.rectangle(percentX(0) - 10, percentY(100) / 2, 20, percentY(100), { isStatic: true });
bodies.push(ground);
bodies.push(ceiling);
bodies.push(rightWall);
bodies.push(leftWall);

for (var i = 0; i < 20; i++) {
  let X = getRandomInt(percentX(00), percentX(100));
  let Y = getRandomInt(percentY(00), percentY(100));
  let width = getRandomInt(30, 200);
  let height = getRandomInt(30, 200);
  let randomColor = Math.floor(Math.random()*16777215).toString(16);
  let newRect = Bodies.rectangle(X, Y, width, height);
  newRect.render.fillStyle = "#" + randomColor;
  bodies.push(newRect);
}



let shape = customShape(400,400, '550,450 455,519 491,631 609,631 645,519', "#ff0000"); 
let boxA = Bodies.rectangle(400, 200, 80, 80); 
let boxB = Bodies.rectangle(450, 50, 80, 80); 



bodies.push(shape);
bodies.push(boxA);
bodies.push(boxB);

Composite.add(engine.world, bodies);


Render.run(render);


let runner = Runner.create();


Runner.run(runner, engine);