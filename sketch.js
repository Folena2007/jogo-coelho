//importação de módulos
const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

//variáveis

let engine;
let world;

var rope, fruit, ground;
var fruit_con;


var bgImg, fruitImg, bunnyImg;

//coelho sprite e suas imagens
var bunny;
var blinkImg, eatImg, sadImg;

//sons
var bkSound, cutSound, sadSound, eatingSound, airSound;

//botões (cortar, ar e mutarSom)
var CutBtn;
var airBlower;
var muteBtn;

function preload() {
  //imagens
  bgImg = loadImage('background.jpeg');
  fruitImg = loadImage('melon.png');
  bunnyImg = loadImage('Rabbit-01.png');

  //sons
  bkSound = loadSound('sound1.mp3');
  sadSound = loadSound('sad.wav');
  cutSound = loadSound('rope_cut.mp3');
  eatingSound = loadSound('eating_sound.mp3');
  airSound = loadSound('air.wav');


  //animações
  blinkImg = loadAnimation("blink_1.png", "blink_2.png", "blink_3.png");
  eatImg = loadAnimation("eat_0.png", "eat_1.png", "eat_2.png", "eat_3.png", "eat_4.png");
  sadImg = loadAnimation("sad_1.png", "sad_2.png", "sad_3.png");

  //ligar e desligar animações
  blinkImg.playing = true;
  eatImg.playing = true;
  sadImg.playing = true;
  sadImg.looping = false;
  eatImg.looping = false;
}

function setup() {
  createCanvas(700, 700);

  frameRate(80);

  //Tocar o som do fundo
 bkSound.play();
 bkSound.setVolume(0.5);

  engine = Engine.create();
  world = engine.world;

  //botão de cortar
  CutBtn = createImg('cut_btn.png');
  CutBtn.position(320, 30);
  CutBtn.size(50, 50);
  CutBtn.mouseClicked(drop);

  //criar botão de ar (balão)
  airBlower = createImg('balloon.png');
  airBlower.position(10,250);
  airBlower.size(150,100);
  airBlower.mouseClicked(airBlow);
  //criar botão de mutarSom
  muteBtn = createImg('mute.png');
  muteBtn.position(620,20);
  muteBtn.size(50,50);
  muteBtn.mouseClicked(mute);

  rope = new Rope(7, { x: 345, y: 30 });
  ground = new Ground(200, 690, 600, 20);


  blinkImg.frameDelay = 20;
  eatImg.frameDelay = 20;


  bunny = createSprite(450, 620, 100, 100);
  bunny.scale = 0.2;
  bunny.addAnimation('blinking', blinkImg);
  bunny.addAnimation('eating', eatImg);
  bunny.addAnimation('crying', sadImg);
  bunny.changeAnimation('blinking');


  fruit = Bodies.circle(300, 300, 20);
  Matter.Composite.add(rope.body, fruit);


  fruit_con = new Link(rope, fruit);

  rectMode(CENTER);
  ellipseMode(RADIUS);

}

function draw() {
  background(51);

  image(bgImg, 0, 0, 700, 700);

  //exibição da fruta
  push();
  imageMode(CENTER);
  if (fruit != null) {
    image(fruitImg, fruit.position.x, fruit.position.y, 70, 70);
  }
  pop();


  rope.show();
  ground.show();

  Engine.update(engine);

  drawSprites();

  //verificação de colisão da fruta com o coelho
  if (collide(fruit, bunny) == true) {
    bunny.changeAnimation('eating');
    //colocar algum som
    eatingSound.play();
  }

  //verificação de colisão da fruta com o chão
  if (fruit != null && fruit.position.y >= 650) {
    bunny.changeAnimation('crying');
    //parar o som do fundo
    bkSound.stop();
    //colocar o som de triste
    sadSound.play();
    //anular a fruta
    fruit = null
  }

}

function drop() {
  //colocar algum som 
  cutSound.play();
  rope.break();
  fruit_con.detach();
  fruit_con = null;
}

function collide(body, sprite) {
  if (body != null) {
    var d = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y);
    if (d <= 80) {
      World.remove(engine.world, fruit);
      fruit = null;
      return true;
    } else {
      return false;
    }
  }
}

//função para aplicar força em um corpo, nome: airblow
//dentro da função, tocar o som de ar
function airBlow(){
Matter.Body.applyForce(fruit,{x:0, y:0}, {x:0.01, y:0})
airSound.play()
}




//função para mutar som 
function mute() {
 if (bkSound.isPlaying()) {
 bkSound.stop();
 }
 else {
  bkSound.play();
 }


}


