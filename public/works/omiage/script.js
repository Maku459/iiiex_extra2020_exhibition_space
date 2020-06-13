var cnv;

function centerCanvas() {
    var x = (windowWidth - width) / 2;
    var y = (windowHeight - height) / 2;
    cnv.position(x, y);
}


function setup() {//最初に1回だけ実行
    cnv = createCanvas(500, 500);
    //canvas.parent('sketch-holder');
    centerCanvas();
    background(0); 
  }

var count_1 = 0;
function counting_1() {
    count_1++;
    document.getElementById("count_1").innerHTML = count_1;
    background(0);
}
var count_2=0;
function counting_2() {
    count_2++;
    document.getElementById("count_2").innerHTML = count_2;
    background(0);
}
var count_3 = 0;
function counting_3() {
    count_3++;
    document.getElementById("count_3").innerHTML = count_3;
    backgroud(0);
}
//noprotect
//スピログラフ（内トロコイド）のパラメータ
//定円半径 c、動円半径 m、描画点半径 d、m,d 共に負なら外トロコイド
var c=26, m=20, d=18; 

var t=0;
var input_message = "";


function draw() {
    //点や線の太さと色
    strokeWeight(2); stroke(count_1*50,count_2*50,count_3*50);
    //描画準備
    var maxt=5000, speed=20;//点の数と描画速度
    var w2=width/2, h2=height/2;
    var r=abs(c-m)+abs(d), cyc=360*abs(m);//画像の外接半径と周回数
    //描画 radians()は度→ラジアン変換
    for (var i=0; i<speed; i++,t+=cyc/maxt) 
        point(w2*(1+(c-m)*cos(radians(t))/r+d*cos((c-m)/m*radians(t))/r),
                    h2*(1-(c-m)*sin(radians(t))/r+d*sin((c-m)/m*radians(t))/r));
    //if(t>=cyc) noLoop();

}


function keyTyped(){
    //c = Math.random() * 50;
    m = Math.random() * 30;
    //d = Math.random() * 50;
    background(0);
}

function windowResized() {
    centerCanvas();
  }

function save() {
    save(test.png);
}