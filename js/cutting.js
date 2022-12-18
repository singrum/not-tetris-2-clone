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
    point(300,300)
    let ver = Vertices.fromPath(`${Unit*4},0 ${Unit*4},${Unit*4} 0,${Unit*4} 0,${Unit*5} ${Unit*5},${Unit*5} ${Unit*5},0`);
    let concave = Bodies.fromVertices(300,300, ver,
        {
            isStatic: 1,
            render: {fillStyle: "#000000"}
        }
    )
    Composite.add(world, concave)
    // Composite.remove(world, concave);

    let s = verticesSlice(concave.vertices, 300)
    console.log(s[0], s[1])
    
    s.forEach(x=>{
        let centre =Vertices.mean(x)
        let b = Bodies.fromVertices(centre.x,centre.y,x,{
            isStatic:1, render: {fillStyle: "#000000"}
        })
        Composite.add(world, b)
    })

    console.log(world.bodies[1].vertices, world.bodies[2].vertices)
    // verticesSlice(concave.vertices, 300).forEach(x=>
    //     {
    //         Composite.add(world, Bodies.fromVertices(Vertices.mean(x),Vertices.mean(x),x, 
    //             {
    //                 isStatic: 0,
    //                 render: {fillStyle: "#000000"}
    //             })
    //             )
    //     }
    // )
    
    // console.log(world)
    
    


    // console.log(concave)



}

window.onload = main