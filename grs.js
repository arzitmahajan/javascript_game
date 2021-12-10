/*const timeLimit = 4;
let timePassed = 0;
let timeLeft = 0;
let timerInterval = null;
//hidding timer
function visible(){
    setInterval(()=>{
     document.getElementById("numbers").style.visibility ="hidden";
    },1000);
}
//clear timer
function onTimesUp(){
    clearInterval(timerInterval);
}
//load page count down
function startTimer(){
    timerInterval = setInterval(()=>{
    timePassed +=1;
    timeLeft = timeLimit - timePassed;
    document.getElementById("numbers").innerHTML = timeLeft;
    if(timeLeft==0){
        document.getElementById("numbers").innerHTML = 'START';
        onTimesUp();
        visible();
    }
    },1000);
}
startTimer();
*/


const canvas = document.getElementById("pong");
const context = canvas.getContext('2d');

//Create User And Paddles
const user = {
    //x is horizontal position of paddle
    x : 0,
    //y is vertical posiotn of paddle 
    //here canvas half height - paddle half height to place in center
    y : (canvas.height/2 - 100)/2,
    width : 10,  //width of paddle
    height :100, //height of paddle
    color :"white",
    //score : 0
}
const com = {
    //com paddle which is on right side 
    //y is horizontal position of paddle
    x : canvas.width -10,
    //here canvas half height - paddle half height to place in center
    y : (canvas.height/2 - 100)/2,
    width : 10,
    height : 100,
    color :"white",
    //score : 0
}
const net = {
    //horizontal position of net at the center of canvas
    x : canvas.width/2 -2/2,
    y : 0,
    width : 2,
    height : 10,
    color :"white"
}
const ball = {
    x :canvas.width/2,
    y :canvas.height/2,
    radius : 10,
    //here speed is speed of ball
    speed : 5,
    // velocities along with direction of ball
    velocityX : 5,
    velocityY : 5,
    color : "white",
}
//DRAW function()
function drawRect(x,y,w,h,color){
    //alert("hi");
    context.fillStyle = color;
    //here  x is x-axis  position y is y-axis position and w is width of rect and h is height
    context.fillRect(x,y,w,h);
}
function drawArc(x,y,r,col){
    context.fillStyle = col;
    context.beginPath();
    //here y is position is center in x axis 
    //y is position of center in y axis 
    //start Angle is 0 and End angle is 360
    //false is direction (clock or anticlock)
    context.arc(x,y,r,0,Math.PI*2,true);
    context.closePath();
    context.fill();
}

canvas.addEventListener("mousemove",movePaddle);
function movePaddle(evt){
    let rect = canvas.getBoundingClientRect();
    user.y = evt.clientY - rect.top - user.height/2;
}

function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
}
function drawnet(){
    for(let i =0;i<=canvas.height;i+=15){
        drawRect(net.x,net.y+i,net.width,net.height,net.color);
    }
}



function collision(b,p){
    // dimensions of player paddle
    //p.top is top point of paddle which is equal to y axis from where paddle is placed
    p.top = p.y;
    //bottom point of paddle  which is = to  y axis from where it is placed + paddle height
    p.bottom = p.y +p.height;
    // ||ly
    p.left  = p.x;
    p.right = p.x + p.width;


    //ball dimensions
    b.top = b.y - b.radius;
    b.bottom = b.y +b.radius;
    b.left = b.x - b.radius;
    b.right = b.x +b.radius;

    return b.right > p.left && b.bottom >p.top && b.left <p.right && b.top< p.bottom;
}
function update(){
    if(ball.x - ball.radius <0 || ball.x+ ball.radius >canvas.width){
        resetBall();
    } 
    ball.x += ball.velocityX;
    ball.y +=ball.velocityY;
    //simple AI to control the com paddle
    let computerLevel = 0.1;
    com.y +=((ball.y - (com.y + com.height/2)))*computerLevel;
    
    if(ball.y+ball.radius> canvas.height || ball.y - ball.radius<0){
        ball.velocityY = -ball.velocityY;
    } 
    //player to know if player is user our computer--   
    let player = (ball.x + ball.radius<canvas.width/2)?user :com;

    if(collision(ball,player)){
        let collidePoint = (ball.y - (player.y + player.height/2));
        collidePoint = collidePoint/(player.height/2);
        let angleRad = (Math.PI/4)*collidePoint;   // It is 45 degree if collided

        let direction = (ball.x + ball.radius <canvas.width/2) ? 1:-1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad); //direction of ball;
        ball.velocityY = ball.speed * Math.sin(angleRad);

        //everytime the ball hit a paddle  we increase its speed
       ball.speed +=0.1;
    
    }

}

function render(){
    //clear canvas
    drawRect(0,0,canvas.width,canvas.height,"Black");
    //draw net
    //draw paddle
    drawRect(user.x,user.y,user.width,user.height,user.color);
   drawRect(com.x,com.y,com.width,com.height,com.color);
    //draw ball
    drawArc(ball.x,ball.y,ball.radius,ball.color);
    drawnet();

}

function game(){
    update();   
    render();
}
const framePerSecond = 50;

let loop = setInterval(game,1000/framePerSecond);
