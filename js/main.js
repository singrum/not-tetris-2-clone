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
    document.querySelector("#btn0").addEventListener("click", ()=>{startGame(0)});
    document.querySelector("#btn1").addEventListener("click", ()=>{startGame(1)});
    document.querySelector("#btn2").addEventListener("click", ()=>{startGame(2)});
    document.querySelector("#btn3").addEventListener("click", ()=>{startGame(3)});

    function startGame(btnnum){
        document.querySelector('.btn-set').remove();
        document.querySelector('body').insertAdjacentHTML('beforeend', 
        `<div id = "ceiling"></div>

        <span id="score-board">score : 0</span>

        <span class="controller material-symbols-outlined" style="display:flex;justify-content:center;align-items:center;font-size:40px;" id="up-button">keyboard_arrow_up</span>
        <span class="controller material-symbols-outlined" style="display:flex;justify-content:center;align-items:center;font-size:40px;" id="down-button">keyboard_arrow_down</span>
        <span class="controller material-symbols-outlined" style="display:flex;justify-content:center;align-items:center;font-size:40px;" id="left-button">keyboard_arrow_left</span>
        <span class="controller material-symbols-outlined" style="display:flex;justify-content:center;align-items:center;font-size:40px;" id="right-button">keyboard_arrow_right</span>

        <span class="controller material-symbols-outlined" style="display:flex;justify-content:center;align-items:center;font-size:40px;transform: scaleX(-1);" id="z-button">refresh</span>
        <span class="controller material-symbols-outlined" style="display:flex;justify-content:center;align-items:center;font-size:40px;" id="x-button">refresh</span>
        
        <div class = "bars">
        <div class = "bar" id = "bar0"></div>
        <div class = "bar" id = "bar1"></div>
        <div class = "bar" id = "bar2"></div>
        <div class = "bar" id = "bar3"></div>
        <div class = "bar" id = "bar4"></div>
        <div class = "bar" id = "bar5"></div>
        <div class = "bar" id = "bar6"></div>
        <div class = "bar" id = "bar7"></div>
        <div class = "bar" id = "bar8"></div>
        <div class = "bar" id = "bar9"></div>
        <div class = "bar" id = "bar10"></div>
        <div class = "bar" id = "bar11"></div>
        <div class = "bar" id = "bar12"></div>
        <div class = "bar" id = "bar13"></div>
        <div class = "bar" id = "bar14"></div>
        <div class = "bar" id = "bar15"></div>
        <div class = "bar" id = "bar16"></div>
        <div class = "bar" id = "bar17"></div>
        <div class = "bar" id = "bar18"></div>
        <div class = "bar" id = "bar19"></div>
        <div class = "bar" id = "bar20"></div>
    </div>
        `
        )
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
                    friction : 0.4,
                    frictionStatic : 0.5,
                    isStatic: static,
                    render : {fillStyle: shapeOption.color}
                })
            }
            else {
                result = Bodies.fromVertices(shapeOption.pos.x, shapeOption.pos.y, shapeOption.vertices, {
                    frictionAir : 0.1,
                    friction : 0.4,
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

            //둘다 걸쳐있음
            if(max > bottom && min < top){
                let s = verticesSlice(body.vertices, bottom)
                let downwardPart = s[1]
                let upwardPart = verticesSlice(s[0], top)[0]
                return [upwardPart,downwardPart]
            }

            //top에 걸쳐있는 경우
            if(max > top && min < top){
                return [verticesSlice(body.vertices, top)[0]];
            }

            //bottom에 걸쳐있는 경우
            if(min < bottom && max > bottom){
                return [verticesSlice(body.vertices, bottom)[1]]
            }


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
            return getVerticesOutRange(body, line(lineIndex).bottom + 0.1, line(lineIndex).top - 0.1);
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

        

        let floor = Bodies.rectangle(WindowProp.width/2, WindowProp.height - Floor.height / 2, WindowProp.width, Floor.height, 
            {
                isStatic: 1, 
                render : {fillStyle: "#000000", lineWidth: 0}
            }
        );
        setFriction(floor, 0.4, 0.5);

//        let ceiling = Bodies.rectangle(WindowProp.width / 2, Ceiling.height / 2, Space.width, Ceiling.height, 
//            {
//                isStatic: 1, 
//                render : {fillStyle: "#000000", lineWidth: 0}
//            }
//        );
        const ceiling = document.querySelector("#ceiling");
        ceiling.style.width = "100%";
        ceiling.style.height = `${Ceiling.height}px`;

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
        Composite.add(world, [floor, leftWall, rightWall])
        
        const bars = document.querySelector(".bars");
        bars.style.bottom = `${Floor.height}px`;
        bars.style.left = `${Space.x + Space.width + 10}px`;
        
        const barArr = document.querySelectorAll(".bar");
        barArr.forEach((bar,i,arr) => {
            bar.style.bottom = `${i * Unit}px`
            bar.style.width = `${Unit}px`
        })
        
        //object
        class Tetris{
            static colors = ['#9b5fe0', '#16a4d8','#60dbe8','#8bd346','#efdf48','#f9a52c', '#808080'];
            static length = 4;
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
                        //random ractangle
                        this.area = Unit * Unit * 4;
                        this.height = Math.random() * (Unit * 5 - this.area/(Unit * 5)) + this.area / (Unit * 5);
                        this.width = this.area / this.height;
                        this.path = `0,0 0,${this.height} ${this.width},${this.height} ${this.width},0`
                        this.color = Tetris.colors[Math.floor(Math.random() * Tetris.colors.length)];
                        break;
                    case 4:
                        //random squere
                        this.ran = num=>Math.random() * num * Unit;
                        this.path = `${this.ran(3)},${this.ran(3)} ${this.ran(3)},${this.ran(3)} ${this.ran(3)},${this.ran(3)} ${this.ran(3)},${this.ran(3)} ${this.ran(3)},${this.ran(3)} ${this.ran(3)},${this.ran(3)} ${this.ran(3)},${this.ran(3)} ${this.ran(3)},${this.ran(3)}`;
                        this.color = Tetris.colors[Math.floor(Math.random() * Tetris.colors.length)];
                        break;
                    case 5:
                        this.ran = num=>Math.random() * num * Unit;
                        this.path = `${this.ran(3)},${this.ran(3)} ${this.ran(3)},${this.ran(3)} ${this.ran(3)},${this.ran(3)}`;
                        this.color = Tetris.colors[Math.floor(Math.random() * Tetris.colors.length)];
                        break;
                    case 6:
                        
                        this.arr = [`0,0 ${4 * Unit},0 ${2 * Unit},${2 * Unit}`,
                            `0,0 ${2 * Unit},${2 * Unit} 0,${4 * Unit}`,
                            `${Unit},0 ${2 * Unit},${Unit} 0,${Unit}`,
                            `${Unit},0 ${Unit},${2*Unit} 0,${Unit}`,
                            `${Unit},0 ${2*Unit},${Unit} ${Unit},${2*Unit} 0,${Unit}`,
                            `${Unit},0 ${Unit},${2*Unit} 0,${3*Unit} 0,${Unit}`,
                            `${2*Unit},0 ${2*Unit},${2*Unit} 0,${2*Unit}`];
                        this.index = Math.floor(Math.random() * this.arr.length)
                        this.path = this.arr[this.index];
                        this.color = Tetris.colors[this.index];
                        break;

                        

                }

                switch(shape){
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 6:
                        this.vertices =Vertices.fromPath(this.path);
                        Vertices.rotate(this.vertices, Math.floor(Math.random() * 2) * Math.PI / 2, Vertices.centre(this.vertices));
                        this.body = Bodies.fromVertices(Space.x + Space.width / 2 , Space.y - Unit * 2 ,this.vertices,
                        {   frictionAir : 0.1,
                            friction : 0.4,
                            frictionStatic : 0.5,
                            isStatic: 0,
                            render: {fillStyle: this.color}
                        });
                        break;
                    case 4:
                    case 5:
                        this.vertices = Vertices.clockwiseSort(Vertices.fromPath(this.path));
                        Vertices.rotate(this.vertices, Math.random() * Math.PI * 2, Vertices.centre(this.vertices));
                        
                        this.body = Bodies.fromVertices(Space.x + Space.width / 2 , Space.y - Unit * 2 , this.vertices,
                        {   frictionAir : 0.1,
                            friction : 0.4,
                            frictionStatic : 0.5,
                            isStatic: 0,
                            render: {fillStyle: this.color}
                        });

                        break;

                }
            }
        }

        const upButton = document.querySelector("#up-button");
        const downButton = document.querySelector("#down-button");
        const leftButton = document.querySelector("#left-button");
        const rightButton = document.querySelector("#right-button");
        const zButton = document.querySelector("#z-button");
        const xButton = document.querySelector("#x-button");
        const buttonRadius = 30;
        const buttonDistance = 10;
        const buttonDistance2 = (2 * buttonRadius + buttonDistance) / Math.SQRT2

        const controllerCenter = {x : WindowProp.width / 2 + WindowProp.width / 4 - buttonRadius, y : Space.y + Space.height + Floor.height / 2 - buttonRadius }
        const zxCenter = {x : WindowProp.width / 2 - WindowProp.width / 4 - buttonRadius, y : Space.y + Space.height + Floor.height / 2 - buttonRadius}

        upButton.style.left = `${controllerCenter.x}px`;
        upButton.style.top = `${controllerCenter.y - buttonDistance2}px`;

        downButton.style.left = `${controllerCenter.x}px`
        downButton.style.top = `${controllerCenter.y + buttonDistance2}px`

        leftButton.style.left = `${controllerCenter.x - buttonDistance2}px`;
        leftButton.style.top = `${controllerCenter.y}px`;

        rightButton.style.left = `${controllerCenter.x + buttonDistance2}px`;
        rightButton.style.top = `${controllerCenter.y}px`;

        zButton.style.left = `${zxCenter.x - (buttonRadius + buttonDistance / 2)}px`
        zButton.style.top = `${zxCenter.y}px`

        xButton.style.left = `${zxCenter.x + (buttonRadius + buttonDistance / 2)}px`
        xButton.style.top = `${zxCenter.y}px`

/////////////////////////////////////////////////// events //////////////////////////////////////////////////
        let forceDirection = -1;
        let forceDown = -1;
        let forceUp = -1;
        let rotateDirection = -1;
        const Left = 0, Right = 1, Down = 2, Up = 3, CCL = 4, CL = 5;
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
            if(e.keyCode === 38){
                forceUp = Up;
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
        leftButton.addEventListener("touchstart", function(e){
            forceDirection = Left;
        })
        leftButton.addEventListener("touchend", function(e){
            forceDirection = -1;
        })

        rightButton.addEventListener("touchstart", function(e){
            forceDirection = Right;
        })
        rightButton.addEventListener("touchend", function(e){
            forceDirection = -1;
        })
        upButton.addEventListener("touchstart", function(e){
            forceUp = Up;
        })
        upButton.addEventListener("touchend", function(e){
            forceUp = -1;
        })
        downButton.addEventListener("touchstart", function(e){
            forceDown = Down;
        })
        downButton.addEventListener("touchend", function(e){
            forceDown = -1;
        })


        zButton.addEventListener("touchstart", function(e){
            rotateDirection = CCL;
        })
        zButton.addEventListener("touchend", function(e){
            rotateDirection = -1;
        })

        xButton.addEventListener("touchstart", function(e){
            rotateDirection = CL;
        })
        xButton.addEventListener("touchend", function(e){
            rotateDirection = -1;
        })
        
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
        let fullLines = [];
        let tick =0;
        let score = 0;
        let threshold;
        const scoreBoard = document.querySelector("#score-board");
        if(btnnum === 0){
            threshold = Unit * Unit * 8.2;
        }
        else if(btnnum === 1){
            threshold = Unit * Unit * 8.2;
        }
        else if(btnnum === 2){
            threshold = Unit * Unit * 8.2;
        }
        else if(btnnum === 3){
            threshold = Unit * Unit * 8.2;
        }
        


        function isValidCollide(body){

            return freeBodies.some(freeBody => Matter.Collision.collides(body, freeBody));

        }


        function point(x, y){
            let rect = Bodies.rectangle(x,y, 5,5, {isStatic: true, render : {fillStyle : "#ff0000", strokeStyle: 0}});
            Composite.add(world, rect);
        }
        function gameOver(){
            Engine.clear(engine);
            Render.stop(render);
            Runner.stop(runner);
        }

        Events.on(runner, 'afterTick', function(){
            if (addBodyFlag){
                addBodyFlag = 0;
                if (btnnum === 0){
                    currBody = new Tetris(3).body;
                }
                else if(btnnum === 1){
                    currBody = new Tetris(4).body;
                }
                else if(btnnum === 2){
                    currBody = new Tetris(5).body;
                }
                else if(btnnum === 3){
                    currBody = new Tetris(6).body;
                }
                Composite.add(world, currBody);     
            }
            for(let i = 0; i<20; i++){
                areaArray[i] = getTotalAreaInLine(freeBodies.slice(1), i);
                if(areaArray[i] >= threshold){
                }
            }
            barArr.forEach((bar, i, arr) => {
                let h = areaArray[i] / threshold * Unit;
                if(h > Unit){
                    h = Unit;
                }
                bar.style.height = `${h}px`    
            })
            
            if(forceDirection === Left){
                Body.applyForce(currBody, currBody.position, {x : -currBody.mass * 0.002, y : 0});
                
            }
            else if(forceDirection === Right){
                Body.applyForce(currBody, currBody.position, {x : currBody.mass * 0.002, y : 0});
            }

            if(forceDown === Down){
                Body.applyForce(currBody, currBody.position, {x : 0, y : currBody.mass * 0.002});
            }
            else if (forceUp === Up){
                Body.applyForce(currBody, currBody.position, {x : 0, y : -currBody.mass * 0.0005});
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
                    // areaArray[i] = getTotalAreaInLine(freeBodies.slice(1), i);                   
                    // console.log(i, "번째 줄 : ", areaArray[i]);
                    if(areaArray[i] >= threshold){
                        fullLines.push(i)
                    }
                }

                for(let fullLine of fullLines){
                    newArr = [floor];
                    for(let freeBody of freeBodies.slice(1)){
                        let slices = getVerticesOutLine(freeBody, fullLine)
                        if (slices[0] === freeBody.vertices){
                            newArr.push(freeBody);
                        }
                        else{
                            Composite.remove(world, freeBody);
                            for(let slice of slices){
                                if (slice === undefined){
                                    console.log("!")
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
                }
                score += fullLines.length;
                scoreBoard.innerHTML = `score : ${score}`
                fullLines = [];
            }
            if(isValidCollide(currBody)){
                freeBodies.push(currBody)
                if(maxY(currBody.vertices) < Ceiling.height){

                    gameOver();
                }
                else{
                    checkLineFlag = 1;
                    addBodyFlag = 1;
                }
            }


            
        })
    }


    
}



window.onload = main
