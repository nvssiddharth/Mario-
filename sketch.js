var PLAY = 1;
var END = 0;
var Over=2;
var gameState = PLAY;

var mario, mario_running, mario_collided;
var invisibleGround,bg,castle,castleImg;

var Rpipe,RBottompipe,Gpipe,GBottompipe;
var shell,spiny,plant;
var score;
var gameOverImg,restartImg,endImage,end,flag,flagImage;
var jumpSound , checkPointSound, dieSound,winSound;

function preload(){
  //loading images

  mario_running = loadAnimation("m1.png","m2.png","m3.png","m4.png","m5.png","m6.png","m7.png","m8.png","m9.png","m10.png","m11.png","m12.png",);
  
  shell= loadImage("shell.png");
  spiny=loadImage("spiny.png");
  plant=loadImage("plant.png");
  Gpipe=loadImage("greenpipe.png");
  Rpipe=loadImage("redpipe.png");
  GBottompipe=loadImage("greenBottompipe.png");
  RBottompipe=loadImage("redBottompipe.png");
  
  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameover.png");
  endImage=loadImage("youwin.png");
  castleImage = loadImage("castle.png")
  
  jumpSound = loadSound("jump.wav");
  dieSound = loadSound("gameover.mp3");
  checkPointSound = loadSound("upgrade.wav");
  winSound=loadSound("win.wav");

  bg=loadImage("bg.jpg");

}

function setup() {
  createCanvas(600,200);

  //creating mario
  mario = createSprite(0,160,20,50);
  mario.addAnimation("running",  mario_running);
  mario.scale = 0.6;
  mario.setCollider("rectangle",0,0,mario.width,mario.height);
  
  //ccreating the gameover sprite
  gameOver = createSprite(200,80);
  gameOver.addImage(gameOverImg);
  gameOver.scale=0.2;
  
  //creating the restart button
  restart = createSprite(200,140);
  restart.addImage(restartImg);
  restart.scale=0.2;
  
  //creating the end sprite
  end = createSprite(300,100);
  end.addImage(endImage);
  end.scale=0.4;

  //creating the castle
  castle = createSprite(7000,160);
  castle.addImage(castleImage);
  castle.scale=0.8;
  
  //creating an invisible ground
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  
  //create Obstacle and Top obstacles Groups
  obstaclesGroup = createGroup();
  TobstaclesGroup = createGroup();

  //assigning initaial value for score
  score = 0;

 
}

function draw() {

  //adding background  
  background(bg);  
  
  //positioning the camera
  camera.position.x = mario.x;
  invisibleGround.x=camera.position.x;
  end.x=camera.position.x;
  restart.x=camera.position.x+150;
  gameOver.x=camera.position.x+150;

  //displaying score
  fill("black")
  text("Score: "+ score,camera.position.x+100,15);

  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    end.visible=false;

    //scoring system
    if(score>0 && score%150 === 0){
       checkPointSound.play() 
    }
    

    //mario jumps when the space key is pressed
    if(keyDown("space")&& mario.y >= 100) {
      mario.velocityY = -12;
        jumpSound.play();
    }

    //mario moves forward when right arrow key is pressed
    if(keyDown(RIGHT_ARROW)){
      mario.x= mario.x+12;
      score++
    }
    
    //adding gravity
    mario.velocityY =mario.velocityY + 0.8
  
    //spawn the Top obstacles
    spawnTobstacles();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(mario)){
        jumpSound.play();
        gameState = END;
        dieSound.play();
    }

    if(TobstaclesGroup.isTouching(mario)){
      jumpSound.play();
      gameState = END;
      dieSound.play();
  }

    if(mario.x>7000){
      gameState=Over;
    }

  }
   else if (gameState === END) {
     
     gameOver.visible = true;
     restart.visible = true;
     mario.velocityY = 0
     mario.velocityX=0;
     invisibleGround.velocityX=0;
     
     //setting lifetime to the game objects so that they are never destroyed
     obstaclesGroup.setLifetimeEach(-1);
     TobstaclesGroup.setLifetimeEach(-1);

     //setting velocity to zero
     obstaclesGroup.setVelocityXEach(0);
     TobstaclesGroup.setVelocityXEach(0); 

   }else if(gameState===Over){
    
    winSound.play(); 
    obstaclesGroup.destroyEach();
    TobstaclesGroup.destroyEach();
    mario.destroy();
    castle.destroy();
    end.visible=true;

   }
 
  //to stop mario from falling down
  mario.collide(invisibleGround);
  
  if(mousePressedOver(restart)) {
      reset();
    }


    drawSprites();    
}

//function to reset the game
function reset(){
  gameState=PLAY;
  obstaclesGroup.destroyEach();
  TobstaclesGroup.destroyEach();
  mario.addAnimation("running",mario_running);
  score=0;
  mario.x=0;

}


function spawnObstacles(){

 //code to spwan obstacles
 if (frameCount % 50 === 0){
   var obstacle = createSprite(camera.position.x +400,165,10,40);
   obstacle.velocityX =0;
   
    //generating random obstacles
    var rand = Math.round(random(1,5));
    switch(rand) {
      case 1: obstacle.addImage(plant);
              break;
      case 2: obstacle.addImage(spiny);
              break;
      case 3: obstacle.addImage(shell);
              break;
      case 4: obstacle.addImage(Rpipe);
              break;       
      case 5: obstacle.addImage(Gpipe);
              break;
      default: break;
    }
   
    //assigning scale to the obstacle           
    obstacle.scale = 0.5;
   
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnTobstacles() {

  // code to spawn  top obstacles
  if (frameCount % 60 === 0) {
    var Tobstacle = createSprite(camera.position.x+Math.round(random(550,800)),-75,40,10);
    Tobstacle.velocityX = 0;

    //setting collider radius
    Tobstacle.setCollider("rectangle",0,0,100,400);

    //adding image the top obstacles
    var rand1 = Math.round(random(1,2));
    switch(rand1) {
      case 1: Tobstacle.addImage(RBottompipe);
              break;
      case 2: Tobstacle.addImage(GBottompipe);
              break;
      default: break;
     }

     //scalling
     Tobstacle.scale = 0.5;
    
    //adjust the depth
    Tobstacle.depth =mario.depth;
    mario.depth = mario.depth + 1;
    
    //add each Top obstacle to their group
    TobstaclesGroup.add(Tobstacle);
  }
}
