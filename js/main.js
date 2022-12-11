// import * as Matter from "matter-js"

// Matter.World > composite > boxA, boxB, ...
// Matter.World.add(engine.world, composite)
// Matter.World는 Matter.Composite으로 통합
// composite.add(engine.world, [boxA, boxB, ...])

// https://brm.io/matter-js/demo/#mixed 속성 테스트
// https://codepen.io/collection/DPRzMX codepen 예시


function main(){
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
        
        
        
        
        let shape = customShape(400,400, '550,450 455,519 491,631 609,631 645,519', "#ff0000"); 
        let boxA = Bodies.rectangle(400, 200, 80, 80); 
        let boxB = Bodies.rectangle(450, 50, 80, 80); 
        
        
        
        bodies.push(shape);
        bodies.push(boxA);
        bodies.push(boxB);
        console.log(boxA)
        
        Composite.add(world, bodies);

        Render.run(render);
        

        let runner = Runner.create();
        
        
        Runner.run(runner, engine);

        let mouse = Mouse.create(render.canvas),
            mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                visible: false
                }
            }
            });
        Composite.add(world, mouseConstraint);
        document.querySelector(".force").addEventListener("mousedown", function () {
            Body.applyForce( boxA, {x: boxA.position.x, y: boxA.position.y}, {x: 0.05, y: 0});
        })
        render.mouse = mouse;
    
}

window.onload = main