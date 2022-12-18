function main(){
    function arrToVertices(arr){
        let result = ``;
        for(let i = 0; i < arr.length; i += 2){
            result = result.concat(`${arr[i]},${arr[i+1]} `);
        }
        result = Vertices.fromPath(result);
        console.log(result)
        return result;
    }

    function verticesToArr(ver){
        let result = [];
        for(let i = 0; i < ver.length; i++){
            result.push(ver[i].x);
            result.push(ver[i].y);
        }
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

    function point(x, y){
        let rect = Bodies.rectangle(x,y, 5,5, {isStatic: true, render : {fillStyle : "#ff0000", strokeStyle: 0}});
        Composite.add(world, rect);
    }
    point(500,500)
    let ver = Vertices.fromPath(`${Unit*4},0 ${Unit*4},${Unit*4} 0,${Unit*4} 0,${Unit*5} ${Unit*5},${Unit*5} ${Unit*5},0`);
    let concave = Bodies.fromVertices(500,500, ver,
        {
            isStatic: 1,
            render: {fillStyle: "#000000"}
        }
    )
    concave.originVertices = ver;


    verticesSlice(concave.vertices).forEach(x=>
        {
            
        }
    )
    
    


    console.log(concave)
    Composite.add(world, concave)


}

window.onload = main