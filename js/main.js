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

///////////////////////////////// fucntions /////////////////////////////
        function arrToVertices(arr){
            let result = ``;
            for(let i = 0; i < arr.length; i += 2){
                result = result.concat(`${arr[i]},${arr[i+1]} `);
            }
            result = result.substring(0, result.length - 1);

            result = Vertices.fromPath(result);
            
            return result;
        }

        function verticesToArr(ver){
            let result = [];
            ver.forEach(v=>
                {
                    result.push(v.x);
                    result.push(v.y);
                })
            return result;
        }

        function verticesSlice(ver, y){
            return PolyK.Slice(verticesToArr(ver), 0,y, WindowProp.width, y).map(piece=>arrToVertices(piece));
        }
        
        function customShape(shapeOption, static = false) {
            let centre = Vertices.centre(shapeOption.vertices);
            let result;
            if(! shapeOption.pos) {
                result = Bodies.fromVertices(centre.x, centre.y, shapeOption.vertices, {
                    frictionAir : 0.1,
                    friction : 0.2,
                    frictionStatic : 0.5,
                    isStatic: static,
                    render : {fillStyle: shapeOption.color}
                })
            }
            else {
                result = Bodies.fromVertices(shapeOption.pos.x, shapeOption.pos.y, shapeOption.vertices, {
                    frictionAir : 0.1,
                    friction : 0.2,
                    frictionStatic : 0.5,
                    isStatic: static,
                    render : {fillStyle: shapeOption.color}
                })
                

            }            
            result.raw_vertices = shapeOption.vertices;
            return result;
        }
        function setFriction(body, f, fs){
            body.friction = f;
            body.frictionStatic = fs;
        }
        function maxY(vertices){
            var max = vertices.reduce( function (previous, current) { 
                return previous.y > current.y ? previous:current;
            });
            return max.y
        }
        function minY(vertices){
            var min = vertices.reduce( function (previous, current) { 
                return previous.y < current.y ? previous:current;
            });
            return min.y;
        }
        
        function getVerticesOutRange(body, bottom, top){
            let min = minY(body.vertices);
            let max = maxY(body.vertices);

            if(max <= top || min >= bottom){
                return [body.vertices];
                
            }

            //bottom, top 사이에 들어가 있는 경우
            if(max <= bottom && min >= top){
                return [];
            }

            //top에 걸쳐있는 경우
            if(max > top && min < top){
                return [verticesSlice(body.vertices, top)[0]];
            }

            //bottom에 걸쳐있는 경우
            if(min < bottom && max > bottom){
                return [verticesSlice(body.vertices, bottom)[1]]
            }

            //둘다 걸쳐있는 경우
            let s = verticesSlice(body.vertices, bottom)
            let downwardPart = s[1]
            let upwardPart = verticesSlice(s[0], top)[0]
            return [upwardPart,downwardPart]

        }

        function getAreaInRange(body, bottom, top){
            let min = minY(body.vertices);
            let max = maxY(body.vertices);

            if(max <= top || min >= bottom){
                return 0;
                
            }

            //bottom, top 사이에 들어가 있는 경우
            if(max <= bottom && min >= top){
                return Vertices.area(body.vertices);
            }

            //top에 걸쳐있는 경우
            if(max > top && max < bottom){
                return Vertices.area(verticesSlice(body.vertices, top)[1]);
            }

            //bottom에 걸쳐있는 경우
            if(min > top && min < bottom){
                return Vertices.area(verticesSlice(body.vertices, bottom)[0]);
            }

            //둘다 걸쳐있는 경우
            let s = verticesSlice(body.vertices, bottom);
            return Vertices.area(verticesSlice(s[0], top)[1]);


        }

        function getVerticesOutLine(body, lineIndex){
            return getVerticesOutRange(body, line(lineIndex).bottom, line(lineIndex).top);
        }
        function getAreaInLine(body, lineIndex){
            return getAreaInRange(body, line(lineIndex).bottom, line(lineIndex).top);
        }

        function getTotalAreaInLine(bodies, lineIndex){
            let result = 0;
            for(let body of bodies){
                result += getAreaInLine(body, lineIndex);
            }
            return result
        }
//////////////////////////////////////////////////////////////////////////////////////////////////



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
        const engine = Engine.create({gravity : {x : 0, y : 1, scale : 0.001}}), 
            world = engine.world;

        const render = Render.create({
            element: document.body,
            engine: engine,
            options: {
                wireframes: false,
                showInternalEdges: false,
                width: window.innerWidth,
                height: window.innerHeight,
                background: "transparent"
            }
        });
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

        

        const WindowProp = {width : window.innerWidth, height : window.innerHeight},
        Floor = {height : 200},
        Ceiling = {height : 50},
        Space = {
            ratio : 3/7, 
            height : WindowProp.height - Floor.height - Ceiling.height,
            y : Ceiling.height,
            row : 21,
        },
        Unit = Space.height / Space.row;
        Space.width = Space.height * Space.ratio;
        Space.x = (WindowProp.width - Space.width) / 2;
        Space.y = Ceiling.height;
        Space.column = Space.row * Space.ratio;


        let floor = Bodies.rectangle(WindowProp.width / 2, WindowProp.height - Floor.height / 2, Space.width, Floor.height, 
            {
                isStatic: 1, 
                render : {fillStyle: "#000000", lineWidth: 0}
            }
        );
        setFriction(floor, 0.2, 0.5);
        console.log(floor)

        let ceiling = Bodies.rectangle(WindowProp.width / 2, Ceiling.height / 2, Space.width, Ceiling.height, 
            {
                isStatic: 1, 
                render : {fillStyle: "#000000", lineWidth: 0}
            }
        );

        let leftWall = Bodies.rectangle((WindowProp.width - Space.width)/4, WindowProp.height / 2, (WindowProp.width - Space.width)/2,WindowProp.height, 
            {                
                isStatic: 1, 
                render : {fillStyle: "#000000", lineWidth: 0}
            }
        );
        setFriction(leftWall, 0, 0);
                
        let rightWall = Bodies.rectangle(WindowProp.width - (WindowProp.width - Space.width)/4, WindowProp.height / 2,(WindowProp.width - Space.width)/2,WindowProp.height,
            {
                isStatic: 1, 
                render : {fillStyle: "#000000", lineWidth: 0}
            }
        );        
        setFriction(rightWall, 0, 0);
        Composite.add(world, [floor, ceiling, leftWall, rightWall])
        
        
        //object
        Common.setDecomp(decomp)
        class Tetris{
            static length = 3;
            constructor(shape){
                this.name = shape;
                switch(shape){
                    case 0:
                        this.path = `${Unit},0 0,${Unit * Math.sqrt(3)} ${Unit * 2},${Unit * Math.sqrt(3)}`;
                        this.color = '#9b5fe0';
                        break;
                    case 1:
                        this.path = `0,0 0,${Unit} ${Unit * 4},${Unit} ${Unit * 4},0`;
                        this.color = '#16a4d8';
                        break;
                    case 2:
                        this.path = `0,0 0,${Unit * 2} ${Unit * 2},${Unit * 2} ${Unit * 2},0`;
                        this.color = '#60dbe8'
                        break;
                    case 3:
                    case 4:

                }

                switch(shape){
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                        this.body = Bodies.fromVertices(Space.x + Space.width / 2 , Space.y + Unit ,Vertices.fromPath(this.path),
                        {   frictionAir : 0.1,
                            friction : 0.2,
                            frictionStatic : 0.5,
                            isStatic: 0,
                            render: {fillStyle: this.color}
                        });
                        break;
                }
            }
        }









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

            if(e.keyCode === 88){
                rotateDirection = CL;
            }
            if (e.keyCode === 90){
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

            if(e.keyCode === 88){
                if(rotateDirection = CL){
                    rotateDirection = -1;
                }
            }
            if (e.keyCode === 90){
                if(rotateDirection = CCL){
                    rotateDirection = 1;
                }
            }
        }

        
        function line(index){
            return {
                bottom : Ceiling.height + Unit * (21 - index),
                top : Ceiling.height + Unit * (20 - index)
            }
        }


        let freeBodies = [floor];
        let currBody
        let checkLineFlag = 0;
        let addBodyFlag = 1;
        let areaArray = [];
        let newArr;
        let threshold = Unit * Unit * 3;
        let fullLines = [];
        let tick =0;
        


        function isValidCollide(body){
            
            return freeBodies.some(freeBody => Matter.Collision.collides(body, freeBody));

        }


        function point(x, y){
            let rect = Bodies.rectangle(x,y, 5,5, {isStatic: true, render : {fillStyle : "#ff0000", strokeStyle: 0}});
            Composite.add(world, rect);
        }

        Events.on(runner, 'afterTick', function(){

            if (addBodyFlag){
                addBodyFlag = 0
                currBody = new Tetris(Math.floor(Math.random() * Tetris.length)).body;
                
                // currBody.vertices.forEach(v=>{point(v.x, v.y)})
                Body.setVelocity(currBody, {x : 0, y : 5});
                Composite.add(world, currBody);     
            }
            

            if(forceDirection === Left){
                Body.applyForce(currBody, currBody.position, {x : -currBody.mass * 0.002, y : 0});
                
            }
            else if(forceDirection === Right){
                Body.applyForce(currBody, currBody.position, {x : currBody.mass * 0.002, y : 0});
            }

            if(forceDown === Down){
                Body.applyForce(currBody, currBody.position, {x : 0, y : currBody.mass * 0.002});
            }

            if(rotateDirection === CL){
                Body.applyForce(currBody, currBody.position, {x : currBody.mass * 0.002, y : 0});
                Body.applyForce(currBody, {x : currBody.position.x, y : currBody.position.y + Unit}, {x : -currBody.mass * 0.002, y : 0});
            }
            else if(rotateDirection === CCL){
                Body.applyForce(currBody, currBody.position, {x : -currBody.mass * 0.002, y : 0});
                Body.applyForce(currBody, {x : currBody.position.x, y : currBody.position.y + Unit}, {x : currBody.mass * 0.002, y : 0});
            }

            if(checkLineFlag){
                checkLineFlag = 0;
                
                // lineIndex = 0,1,2,3,4,...,19,20
                for(let i = 0; i<20; i++){
                    areaArray[i] = getTotalAreaInLine(freeBodies.slice(1), i);
                    console.log(i, "번째 줄 : ", areaArray[i])
                    if(areaArray[i] >= threshold){
                        fullLines.push(i)
                    }
                }
                console.log(threshold)
                
                



                newArr = [floor];
                for(let fullLine of fullLines){
                    for(let freeBody of freeBodies.slice(1)){

                        let slices = getVerticesOutLine(freeBody, fullLine)
                        

                        if (slices[0] === freeBody.vertices){
                            newArr.push(freeBody);
                        }
                        else{
                            Composite.remove(world, freeBody);
                            for(let slice of slices){
                                if (slice === undefined){
                                    break;
                                }
                                let piece = customShape(
                                    {
                                        vertices : slice,
                                        color : freeBody.render.fillStyle
                                    }
                                )
                                newArr.push(piece)
                                Composite.add(world, piece);    
                            }

                        }

                                
                    }
                    freeBodies = newArr.slice(0);
                    newArr = [];
                            
                }

                fullLines = [];

            }
            if(isValidCollide(currBody)){
                checkLineFlag = 1;
                freeBodies.push(currBody)
                addBodyFlag = 1;
            }

            
        })

    
}


window.onload = main