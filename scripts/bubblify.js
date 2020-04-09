var bubbles = []
let capture
let img
function preload(){
    var link = prompt("input imgur link(images shouldnt be too large)","https://media4.s-nbcnews.com/j/newscms/2019_23/2885811/190606-border-collie-mc-1318_5b1706791f4ae9ddb3029540a98f7e08.fit-2000w.JPG" )
    img = loadImage(link, ()=>{
        console.log("got image");
    }, ()=>{
        console.log("oof");
        document.getElementById("downloadButton").innerHTML = "Error, image may be too large";
    }
    );
    document.getElementById("ogimg").src = link;
}

var b = 20
let canv;
var canvw;
var canvh;
var button ;

function setup(){   
    image(img,0,0,width,height);
    img.loadPixels();
    canvw = document.getElementById("ogimg").offsetWidth;
    canvh = document.getElementById("ogimg").offsetHeight;
    var step = img.width/75
    for(var x = 0;x<img.width;x+=step){
        for(var y = 0;y<img.height;y+=step){
            var pix = img.get(x,y)
            var avgcolor = (pix[0]+pix[1]+pix[2])/3

            if(avgcolor<200 ){
                bubbles.push(new Bubble(x,y,(230-avgcolor).map(0,255,0,canvw/14), Math.random()-0.5, Math.random()-0.5, x, y));
            }
        }
    }
    console.log(document.getElementById("img-div").offsetWidth);
    
    console.log("w:"+canvw+" h:"+canvh);
    canv= createCanvas(canvw,canvh);
    canv.parent('sketch-holder');
    var w = document.getElementById("sketch-holder").style.width;
    
}

Number.prototype.map = function (in_min, in_max, out_min, out_max) {
    return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }

function windowResized(){
    canvw = document.getElementById("ogimg").offsetWidth;
    canvh = document.getElementById("ogimg").offsetHeight;
    for(var i = 0;i<bubbles.length;i++){
        bubbles[i].intendedsize = canvw/30;
    }
    console.log("w:"+canvw+" h:"+canvh);
    resizeCanvas(canvw, canvh);
}
function downloadCanv(){
    saveCanvas(canv, "bubblify_image.jpg")
}

function draw(){
    render();
    tick();
}

function tick(){
    for(var i = 0;i<bubbles.length;i++){
        if(bubbles[i].size<bubbles[i].intendedsize){
            bubbles[i].size+=0.5;
        }
        shakeamount = (1 - bubbles[i].size/bubbles[i].intendedsize)*4


        bubbles[i].x+=(Math.random()*shakeamount-shakeamount/2);
        bubbles[i].y+=(Math.random()*shakeamount-shakeamount/2);
    }
    //print(b)
}


function render(){

    
    background(255);
    fill(0);
    noStroke();
    for(var i = 0;i<bubbles.length; i++){
        fill(0,0,0,bubbles[i].intendedsize*5);
        ellipse(bubbles[i].x.map(0,img.width, 0,canvw),bubbles[i].y.map(0,img.height, 0, canvh), bubbles[i].size/2, bubbles[i].size/2);
    }
}

function mousePressed(){
    bubbles.push(new Bubble(mouseX,mouseY, Math.random()*50, Math.random()-0.5, Math.random()-0.5, mouseX, mouseY));
}

function Bubble(x, y, size, xdir, ydir, ogx, ogy){
    this.growing = true
    this.x = x;
    this.y = y;
    this.intendedsize = size
    this.size = this.intendedsize/20
    this.xdir = xdir
    this.ydir = ydir
    this.ogx = ogx
    this.ogy = ogy
}