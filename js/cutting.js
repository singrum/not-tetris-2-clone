function main(){
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

    function verticesClone(ver){
        return arrToVertices(verticesToArr(ver.originVertices));
    }

    function bodySlice(body, y){
        let clone = verticesClone(body.originVertices)
        Vertices.rotate(clone, body.angle, Vertices.mean(clone), Vertices.mean(clone));
        Vertices.translate(clone, body.position.x, body.position.y);
        return verticesSlice(clone, y).map(x=>{
            return Bodies.fromVertices(Vertices.mean(x).x, Vertices.mean(x).y, x, {

            })
        })
    }

    function getConcaveVertices(body){
        let coords;
        let parts = body.parts.slice(1).map(function(part)
            {return part.vertices.map(function(v){return {x : v.x, y : v.y}})}
        );
        let points;
        if(parts.length === 0){
            return body.vertices;
        }
        if(parts.length === 2){
            points = parts[0].concat(parts[1].slice(1,length - 1))
        }
        if(parts.length === 3){
            points = parts[0].concat(parts[1])
        }
        return Vertices.create(points, Body);

    }

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
        
    const engine = Engine.create({gravity : {x : 0, y : 0, scale : 0.001}}), 
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

    const WindowProp = {width : window.innerWidth, height : window.innerHeight},
        Floor = {height : 200},
        Ceiling = {height : 100},
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

    Render.run(render);
    let runner = Runner.create();
    Runner.run(runner, engine);

    // Common.setDecomp(decomp)

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


    let floor = Bodies.rectangle(WindowProp.width / 2, WindowProp.height - Floor.height / 2, Space.width, Floor.height, 
        {
            isStatic: 1, 
            friction : 0.2, 
            frictionStatic : 0.3, 
            render : {fillStyle: "#000000", lineWidth: 0}
        }
    );

    let ceiling = Bodies.rectangle(WindowProp.width / 2, Ceiling.height / 2, Space.width, Ceiling.height, 
        {
            isStatic: 1, 
            friction : 0.2, 
            frictionStatic : 0.3, 
            render : {fillStyle: "#000000", lineWidth: 0}
        }
    );

    let leftWall = Bodies.rectangle((WindowProp.width - Space.width)/4, WindowProp.height / 2, (WindowProp.width - Space.width)/2,WindowProp.height, 
        {
            isStatic: 1, 
            friction : 0,
            render : {fillStyle: "#000000", lineWidth: 0}
        }
    );
            
    let rightWall = Bodies.rectangle(WindowProp.width - (WindowProp.width - Space.width)/4, WindowProp.height / 2,(WindowProp.width - Space.width)/2,WindowProp.height,
        {
            isStatic: 1, 
            friction : 0, 
            render : {fillStyle: "#000000", lineWidth: 0}
        }
    );        
    // Composite.add(world, [floor, ceiling, leftWall, rightWall]);

    class Tetris{
        constructor(shape){
            this.name = shape;
            switch (shape) {
                case "I":
                case "i":
                    this.path = `0,0 0,${Unit} ${Unit * 4},${Unit} ${Unit * 4},0`;
                    this.body = Bodies.fromVertices(300,300,Vertices.fromPath(this.path),
                    {
                        isStatic: 1,
                        render: {fillStyle: '#9b5fe0'}
                    });
                    break;
                case "O":
                case "o":
                    this.path = `0,0 0,${Unit * 2} ${Unit * 2},${Unit * 2} ${Unit * 2},0`;
                    this.body = Bodies.fromVertices(300,300,Vertices.fromPath(this.path),
                    {
                        isStatic: 1,
                        render: {fillStyle: '#16a4d8'}
                    });
                    break;
                case "T":
                case "t":
                    this.path = `0,0 0,${Unit} ${Unit},${Unit} ${Unit},${Unit * 2} ${Unit * 2},${Unit * 2} ${Unit * 2},${Unit} ${Unit * 3},${Unit} ${Unit * 3},0`;
                    this.body = Bodies.fromVertices(300,300,Vertices.fromPath(this.path),
                    {
                        isStatic: 1,
                        render: {fillStyle: '#60dbe8'}
                    });
                    break;
                case "J":
                case "j":
                    this.path = `${Unit},0 ${Unit},${Unit*2} 0,${Unit*2} 0,${Unit*3} ${Unit*2},${Unit*3} ${Unit*2},0`;
                    this.body = Bodies.fromVertices(300,300,Vertices.fromPath(this.path),
                    {
                        isStatic: 1,
                        render: {fillStyle: '#8bd346'}
                    });
                    break;
                case "L":
                case "l":
                    this.path = `0,0 0,${Unit*3} ${Unit*2},${Unit*3} ${Unit*2},${Unit*2} ${Unit},${Unit*2} ${Unit},0`;
                    this.body = Bodies.fromVertices(300,300,Vertices.fromPath(this.path),
                    {
                        isStatic: 1,
                        render: {fillStyle: '#efdf48'}
                    });
                    break;
                case "S":
                case "s":
                    this.path = `${Unit},${Unit} ${Unit},0 ${Unit*3},0 ${Unit*3},${Unit} ${Unit*2},${Unit} ${Unit*2},${Unit*2} 0,${Unit*2} 0,${Unit}`;
                    this.body = Bodies.fromVertices(300, 300, Vertices.fromPath(this.path),
                    {
                        isStatic: 1,
                        render: {fillStyle: '#f9a52c'}
                    });
                    // Body.setParts(this.body,[
                    //     Bodies.fromVertices(Unit*2, Unit/2, Vertices.fromPath(`${Unit},${Unit} ${Unit},0 ${Unit*3},0 ${Unit*3},${Unit} ${Unit*2},${Unit}`),
                    //     {
                    //         isStatic: 1,
                    //         render: {fillStyle: '#f9a52c'}
                    //     }),
                    //     Bodies.fromVertices(Unit, Unit * 3/2, Vertices.fromPath(`${Unit*2},${Unit} ${Unit*2},${Unit*2} 0,${Unit*2} 0,${Unit} ${Unit},${Unit}`),
                    //     {
                    //         isStatic: 1,
                    //         render: {fillStyle: '#f9a52c'}
                    //     })
                    // ]
                    // )
                    break;
                case "Z":
                case "z":
                    this.path = `0,0 0,${Unit} ${Unit},${Unit} ${Unit},${Unit*2} ${Unit*3},${Unit*2} ${Unit*3},${Unit} ${Unit*2},${Unit} ${Unit*2},0`;
                    this.body = Bodies.fromVertices(300,300,Vertices.fromPath(this.path),
                    {
                        isStatic: 1,
                        render: {fillStyle: '#d64e12'}
                    });
                    break;
                default:
                    return undefined;
            }
            
        }
    }



    function point(x, y){
        let rect = Bodies.rectangle(x,y, 5,5, {isStatic: true, render : {fillStyle : "#ff0000", strokeStyle: 0}});
        Composite.add(world, rect);
    }
    function pointVertices(ver){
        ver.forEach(v=>{
            point(v.x, v.y);
        })
    }
    // point(300,300)
    let concave = new Tetris('z').body
    
    Composite.add(world, concave)

    // Composite.remove(world, concave);
    // console.log(getConcaveVertices(concave))
    Body.setAngle(concave, 1)
    let s = verticesSlice(getConcaveVertices(concave), 280)
    console.log(s)
    // pointVertices(concave.vertices)
    s.forEach(a=>{
        let centre =Vertices.centre(a)
        let b = Bodies.fromVertices(centre.x,centre.y,a,{
            isStatic:1, render: {fillStyle: "#000000"}
        })

        Composite.add(world, b)

    })
    console.log(world)
    
    



}

window.onload = main