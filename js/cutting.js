function main(){


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
    console.log(render)

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
    console.log(floor, leftWall, rightWall)
    Composite.add(world, [floor, ceiling, leftWall, rightWall]);




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
}

window.onload = main