// import * as Matter from "matter-js"

// module aliases
let Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

// create an engine
let engine = Engine.create();

// create a renderer
let render = Render.create({
    element: document.body,
    engine: engine
});


const width = 800, height = 600;
// create two boxes and a ground
let boxA = Bodies.rectangle(400, 200, 80, 80);
let boxB = Bodies.rectangle(450, 50, 80, 80);
let ground = Bodies.rectangle(400, 600, 810, 60, { isStatic: true });
let wall = [Bodies.rectangle(5, 285, 10, 570, {isStatic : true}), Bodies.rectangle(800 - 5, 285, 10, 570, {isStatic : true})]

// add all of the bodies to the world
Composite.add(engine.world, [boxA, boxB, ground, ...wall]);

// run the renderer
Render.run(render);

// create runner
let runner = Runner.create();

// run the engine
Runner.run(runner, engine);