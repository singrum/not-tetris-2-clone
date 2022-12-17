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
    const engine = Engine.create({gravity : {x : 0, y : 1, scale : 0.001}}), world = engine.world;
    const window_w = window.innerWidth;
    const window_h = window.innerHeight;
    const render = Render.create({
        element: document.body,
        engine: engine,
        options: {
        wireframes: false,
        showInternalEdges: false,
        width: window_w,
        height: window_h,
        background: "transparent"
        }
    });


    const floor_h = 200;
    const frameRatio = 3/7;
    const frame_h = window_h - floor_h;
    const frame_w = frameRatio * frame_h;
    const frame_offset = {x : (window_w - frame_w)/2, y : floor_h};
    const unit = frame_h / 21;
    const unit_h = 21, unit_w = 9;
    const offset = {x : (window_w - frame_w)/2, y : 100};
    let ground = Bodies.rectangle(window_w/2, window_h - floor_h/2 , frame_w, floor_h, { isStatic: true, render : {fillStyle: "#000000", lineWidth: 0}});
    ground.friction = 0.2;
    ground.frictionStatic = 0.3;
    let leftWall = Bodies.rectangle((window_w - frame_w)/4, window_h / 2, (window_w - frame_w)/2,window_h, { isStatic: true, render : {fillStyle: "#000000", lineWidth: 0}});
    leftWall.friction = 0;
    let rightWall = Bodies.rectangle(window_w - (window_w - frame_w)/4, window_h / 2,(window_w - frame_w)/2,window_h,{ isStatic: true, friction : 0, render : {fillStyle: "#000000", lineWidth: 0}});        leftWall.friction = 0;
    rightWall.friction = 0;

    Composite.add(world, ground)
    Composite.add(world, leftWall)
    Composite.add(world, rightWall)

    // result = Bodies.fromVertices(0, 0, shapeOption.vertices, {
    //     frictionAir : 0.1,
    //     friction : 0.2,
    //     frictionStatic : 0.3,
    //     isStatic: static,
    //     render : {fillStyle: shapeOption.color}
    // })
}

window.onload = main