// import * as Matter from "matter-js"

// Matter.World > composite > boxA, boxB, ...
// Matter.World.add(engine.world, composite)
// Matter.World는 Matter.Composite으로 통합
// composite.add(engine.world, [boxA, boxB, ...])

// https://brm.io/matter-js/demo/#mixed 속성 테스트
// https://codepen.io/collection/DPRzMX codepen 예시
// https://stackoverflow.com/questions/3742479/how-to-cut-a-hole-in-an-svg-rectangle
// https://github.com/liabru/matter-js/blob/master/examples/svg.js svg

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
                Events = Matter.Events,
                Svg = Matter.Svg,
                Vertices = Matter.Vertices,
                Constraint = Matter.Constraint,
                Composite = Matter.Composite,
                Mouse = Matter.Mouse,
                MouseConstraint = Matter.MouseConstraint,
                Render = Matter.Render,
                Runner = Matter.Runner;
        
        // create an engine
        const engine = Engine.create({
                gravity : {x : 0, y : 0, scale : 1}
            }
        ),
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
        
        const bodyOption = {
            isStatic : true,
            frictionAir : 0
            
        }
        
        function customShape(x, y, shape, color) {
            let vertices = Matter.Vertices.fromPath(shape);
            return Matter.Bodies.fromVertices(x, y, vertices, {
                frictionAir : 0,
                isStatic: 0
            });
        }
        
        //frame 7 : 3
        const floor_h = 200;
        const frameRatio = 3/7;
        const window_w = window.innerWidth;
        const window_h = window.innerHeight;
        const frame_h = window_h - floor_h;
        const frame_w = frameRatio * frame_h;
        const unit = frame_h / 21;
        
        const offset = {x : (window_w - frame_w)/2, y : -100};
        let ground = Bodies.rectangle(window_w/2, window_h , frame_w, floor_h, { isStatic: true, render : {fillStyle: "#000000", lineWidth: 0}});
        let leftWall = Bodies.rectangle((window_w - frame_w)/4, window_h / 2, (window_w - frame_w)/2,window_h, { isStatic: true, render : {fillStyle: "#000000", lineWidth: 0}});
        let rightWall = Bodies.rectangle(window_w - (window_w - frame_w)/4, window_h / 2,(window_w - frame_w)/2,window_h,{ isStatic: true, render : {fillStyle: "#000000", lineWidth: 0}});
        
        bodies.push(ground);
        bodies.push(leftWall);
        bodies.push(rightWall);
        
        
        
        //object
        let shape_I = customShape(offset.x + unit * 5/3,offset.y + unit * 2, `0,0 0,${unit} ${unit * 4},${unit} ${unit * 4},0`, "#ff0000"); 
        
        Body.setVelocity(shape_I, {x : 0, y : 3})
        
        bodies.push(shape_I);
        
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
        render.mouse = mouse;



/////////////////////////////////////////////////// events ///////////////////////////////////////////////////
        let i = 0;
        let collisionFlag = 0;
        Events.on(runner, 'afterTick', function(){
            if (collisionFlag){
                Body.applyForce(shape_I, shape_I.position, {x : 0, y : shape_I.mass * 0.001})
                
            }
        })
        
        Events.on(engine, 'collisionStart', function(event) {
            for (p of event.pairs){
                if(p.bodyA === shape_I || p.bodyB === shape_I){
                    collisionFlag = 1;
                }
            }
        });

    
}


window.onload = main