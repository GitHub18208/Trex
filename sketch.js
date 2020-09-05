var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var gameOver_img, gameOver , restart_img, restart;
var checkPoint, jump, die;
var cloud, cloudsGroup, cloudImage;

var obstacleGroup, ob1Image, ob2Image, ob3Image, ob4Image, ob5Image, ob6Image, obstacle;

var count = 0;

var newImage;

localStorage["HighestScore"] = 0;

var PLAY = 1;
var END = 0;
var gameState = PLAY;
function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  gameOver_img = loadImage("gameOver.png");
  restart_img = loadImage("restart.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
 
  ob1Image = loadImage("obstacle1.png");
  ob2Image = loadImage("obstacle2.png");
  ob3Image = loadImage("obstacle3.png")
  ob4Image = loadImage("obstacle4.png")
  ob5Image = loadImage("obstacle5.png")
  ob6Image = loadImage("obstacle6.png")
  
  checkPoint = loadSound("checkPoint.mp3"  );
  die = loadSound("die.mp3");
  jump = loadSound("jump.mp3");
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
   trex.addAnimation("collided",trex_collided)
  trex.scale = 0.5;
  trex.setCollider("circle",0,0,50);
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 2*count/100);
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  obstacleGroup = new Group();
  cloudsGroup = new Group();
  
  restart = createSprite(300,100,10,10);
  restart.addImage(restart_img);
  restart.scale = 0.5;
  restart.visible = false;
  
  gameOver = createSprite(300,140,10,10);
  gameOver.addImage(gameOver_img);
  gameOver.scale = 0.5;
  gameOver.visible = false;
  
}

function draw() {
  background(180);
  
  text("Score: "+ count, 500, 50);
  
  if(gameState === PLAY){ 

if(keyDown("space") && trex.y>120 && trex.isTouching(ground)) {
        trex.velocityY = -10;
        jump.play();
      }

      trex.velocityY = trex.velocityY + 0.8

      if (ground.x < 0){
        ground.x = ground.width/2;
      }
      
      spawnClouds();
      spawnObstacles();


    trex.collide(invisibleGround);

      if(trex.isTouching(obstacleGroup)){
        die.play();
        gameState = END;
      }
    count = count + Math.round(World.frameRate/50); 
    
    if (count>0 && count%100 === 0){
      checkPoint.play();
    }
  }
  
  else if(gameState === END){
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstacleGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    //crowGroup.setVelocityXEach(0);
    //changing the trex y VELOCITY to 0
    obstacleGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    trex.changeAnimation("collided",trex_collided);
    gameOver.visible = true;
    restart.visible = true;
    
    if(mousePressedOver(restart)){
       reset();  
  } 
} 
  
  drawSprites();
}

function spawnClouds(){
  if(frameCount % 60 === 0){ 
  cloud = createSprite(600,60,10);
    cloud.y = Math.round(random(60,90));
  cloud.addImage("cloud" , cloudImage);
  cloud.velocityX = -2;
  cloud.scale = 0.5; 
  
  cloud.lifetime = 310;
  
  cloud.depth = trex.depth
  trex.depth = trex.depth + 1;
  cloudsGroup.add(cloud);
}
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -(6 + 2*count/100);
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1:
        obstacle.addImage(ob1Image);
        break;
      case 2: 
        obstacle.addImage(ob2Image);
        break;
      case 3: 
        obstacle.addImage(ob3Image);
        break;
      case 4:
        obstacle.addImage(ob4Image);
        break;
      case 5: 
        obstacle.addImage(ob5Image);
        break;
      case 6: 
        obstacle.addImage(ob6Image);
        break;  
     default: 
        break; 
    }
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 270;
    //add each obstacle to the group
    obstacleGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstacleGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running", trex_running );
  ground.velocityX = -(6 + 2*count/100);
  if(localStorage["HighestScore"] < count){
   localStorage["HighestScore"] = count; 
  }
  console.log(localStorage["HighestScore"]);
  count = 0;
}