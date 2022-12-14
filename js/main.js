// import * as Matter from "matter-js"

/*
    Matter.World > composite > boxA, boxB, ...
    Matter.World.add(engine.world, composite)
    Matter.World는 Matter.Composite으로 통합
    composite.add(engine.world, [boxA, boxB, ...])

    https://brm.io/matter-js/demo/#mixed 속성 테스트
    https://codepen.io/collection/DPRzMX codepen 예시
    https://stackoverflow.com/questions/3742479/how-to-cut-a-hole-in-an-svg-rectangle
    https://github.com/liabru/matter-js/blob/master/examples/svg.js svg
    https://colorswall.com/palette/171311 color pallete
*/

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
                Common = Matter.Common,
                Mouse = Matter.Mouse,
                MouseConstraint = Matter.MouseConstraint,
                Render = Matter.Render,
                Runner = Matter.Runner;
        
        // create an engine
        const engine = Engine.create({
                gravity : {x : 0, y : 1, scale : 0.001}
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
        engine.positionIterations = 10
        let allBodies = []
        
        
        function customShape(shapeOption) {
            let vertices = Matter.Vertices.fromPath(shapeOption.shape);
            return Matter.Bodies.fromVertices(shapeOption.pos.x, shapeOption.pos.y, vertices, {
                frictionAir : 0.1,
                friction : 0.1,
                frictionStatic : 0.3,
                isStatic: 0,
                render : {fillStyle: shapeOption.color}
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
        ground.friction = 0.1;
        ground.frictionStatic = 0.3;
        let leftWall = Bodies.rectangle((window_w - frame_w)/4, window_h / 2, (window_w - frame_w)/2,window_h, { isStatic: true, render : {fillStyle: "#000000", lineWidth: 0}});
        leftWall.friction = 0;
        let rightWall = Bodies.rectangle(window_w - (window_w - frame_w)/4, window_h / 2,(window_w - frame_w)/2,window_h,{ isStatic: true, friction : 0, render : {fillStyle: "#000000", lineWidth: 0}});        leftWall.friction = 0;
        rightWall.friction = 0;
        Composite.add(world, ground)
        Composite.add(world, leftWall)
        Composite.add(world, rightWall)
        console.log(ground)
        
        
        
        //object
        Common.setDecomp;

        let tetris = {
            I : {
                shape : `0,0 0,${unit} ${unit * 4},${unit} ${unit * 4},0`,
                color : '#9b5fe0',
                pos : {x : offset.x + unit*4, y : offset.y}
            },
            O : {
                shape : `0,0 0,${unit * 2} ${unit * 2},${unit * 2} ${unit * 2},0`,
                color : '#16a4d8',
                pos : {x : offset.x + unit * 4, y : offset.y}
            },
            T : {
                shape : `0,0 0,${unit} ${unit},${unit} ${unit},${unit * 2} ${unit * 2},${unit * 2} ${unit * 2},${unit} ${unit * 3},${unit} ${unit * 3},0`,
                color : '#60dbe8',
                pos : {x : offset.x + unit * 7/2, y : offset.y}
            },
            J : {
                shape : `${unit},0 ${unit},${unit*2} 0,${unit*2} 0,${unit*3} ${unit*2},${unit*3} ${unit*2},0`,
                color : '#8bd346',
                pos : {x : window_w/2, y : offset.y}
            },
            L : {
                shape : `0,0 0,${unit*3} ${unit*2},${unit*3} ${unit*2},${unit*2} ${unit},${unit*2} ${unit},0`,
                color : '#efdf48',
                pos : {x : window_w/2, y : offset.y}
            },
            S : {
                shape : `${unit},0 ${unit},${unit} 0,${unit} 0,${unit*2} ${unit*2},${unit*2} ${unit*2},${unit} ${unit*3},${unit} ${unit*3},0`,
                color : '#f9a52c',
                pos : {x : window_w/2, y : offset.y}
            },
            Z : {
                shape : `0,0 0,${unit} ${unit},${unit} ${unit},${unit*2} ${unit*3},${unit*2} ${unit*3},${unit} ${unit*2},${unit} ${unit*2},0`,
                color : '#d64e12',
                pos : {x : window_w/2, y : offset.y}
            }
        };

        // let turn = customShape(Object.values(tetris)[Math.floor(Math.random() * Object.keys(tetris).length)])
        // Body.setVelocity(turn, {x : 0, y : 3})
        // bodies.push(turn);
        // Composite.add(world, bodies);

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
        let forceDirection = -1;
        let forceDown = -1;
        let rotateDirection = -1;
        const Left = 0, Right = 1, Down = 2, CCL = 3, CL = 4;
        document.addEventListener('keydown', keydownEvent, false); 
        document.addEventListener('keyup', keyupEvent, false); 
        function keydownEvent(e){
            if(e.keyCode === 37){
                forceDirection = Left;
            }
            if(e.keyCode === 39){
                forceDirection = Right;
            }
            if(e.keyCode === 40){
                forceDown = Down;
            }

            if(e.keyCode === 90){
                rotateDirection = CL;
            }
            if (e.keyCode === 88){
                rotateDirection = CCL;
            }
        }
        function keyupEvent(e){
            if(e.keyCode === 37){
                if(forceDirection === Left){
                    forceDirection = -1;
                }
            }
            if(e.keyCode === 39){
                if(forceDirection === Right){
                    forceDirection = -1;
                }
            }
            if(e.keyCode === 40){
                if(forceDown === Down){
                    forceDown = -1;
                }
            }

            if(e.keyCode === 90){
                if(rotateDirection = CL){
                    rotateDirection = -1;
                }
            }
            if (e.keyCode === 88){
                if(rotateDirection = CCL){
                    rotateDirection = 1;
                }
            }
        }




        let freeBodies = [ground];
        let currBody
        let collisionFlag = 0;
        let addBodyFlag = 1;
        let tick =0;

        function isValidCollide(body){
            
            return freeBodies.some(freeBody => Matter.Collision.collides(body, freeBody));

        }

        Events.on(runner, 'afterTick', function(){
            // freeBodies.forEach(body => {Body.applyForce(body, body.position, {x : 0, y : body.mass * 0.001})})
            if (addBodyFlag){
                addBodyFlag = 0
                currBody = customShape(Object.values(tetris)[Math.floor(Math.random() * Object.keys(tetris).length)]);
                
                Body.setVelocity(currBody, {x : 0, y : 5});
                Composite.add(world, currBody);     
                          
            }
            
            if(isValidCollide(currBody)){
                freeBodies.push(currBody)
                addBodyFlag = 1;
            }
            if(forceDirection === Left){
                Body.applyForce(currBody, currBody.position, {x : -currBody.mass * 0.001, y : 0});
                
            }
            else if(forceDirection === Right){
                Body.applyForce(currBody, currBody.position, {x : currBody.mass * 0.001, y : 0});
            }

            if(forceDown === Down){
                Body.applyForce(currBody, currBody.position, {x : 0, y : currBody.mass * 0.001});
            }

            if(rotateDirection === CL){
                Body.rotate(currBody, -0.1);
            }
            else if(rotateDirection === CCL){
                Body.rotate(currBody, 0.1);
            }


            
        })
        
        // function isValidCollision(turn, pair){
        //     let bodiesInPair = [pair.bodyA, pair.bodyB]
        //     return turn.parts.some(e => bodiesInPair.includes(e) && !bodiesInPair.includes(leftWall) && !bodiesInPair.includes(rightWall))
        // }
        // Events.on(engine, 'collisionStart', function(event) {
        //     newFlag = 1;
        //     freeBodies.push(currBody)
        // });

    
}


window.onload = main