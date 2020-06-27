let lvl = 0;
let ratsPerLvl = 0;
let ratsBaseSpeed = 10;
let rats = [];
let ratsLeft = ratsPerLvl;
let secondsLeft = 30;

const catSpeed = 10;
const catInitialX = 300;
const catInitialY = 300;
const cat = {
    speed: catSpeed,
    x: catInitialX,
    y: catInitialY,
    direction: [],
    html: document.querySelector(".cat")
}

class Rat {
    constructor(speed, html){
        this.speed = speed;

        let position = window.getComputedStyle( document.querySelector("main") , null).getPropertyValue("width");
        this.x = Math.floor(Math.random() * Number(position.slice(0, position.length-2)));

        position = window.getComputedStyle( document.querySelector("main") , null).getPropertyValue("height");
        this.y = Math.floor(Math.random() * Number(position.slice(0, position.length-2)));

        this.direction = [];

        this.html = html;

        this.alive = true;

        this.changeTime = Math.random() * 10;

        this.html.style.top = this.y + "px";
        this.html.style.left = this.x + "px";

    }

    setX(way){
        if(way === "right"){
            this.x = this.x + this.speed;
            this.html.style.left = this.x + "px";
        }else{
            this.x = this.x - this.speed;
            this.html.style.left = this.x + "px";
        }
    }

    setY(way){
        if(way === "up"){
            this.y = this.y - this.speed;
            this.html.style.top = this.y + "px";
        }else{
            this.y = this.y + this.speed;
            this.html.style.top = this.y + "px";
        }
    }

    increaseSpeed(){
        this.speed = this.speed * 1.2;
    }

    die(){
        this.alive = false;
        this.html.style.backgroundColor = "red";
    }

    move(){
        if(this.direction.includes("w")){
            this.setY("up");
        }
        if(this.direction.includes("d")){
            this.setX("right");
        }
        if(this.direction.includes("s")){
            this.setY("down");
        }
        if(this.direction.includes("a")){
            this.setX("left");
        }
    }

    changeDirection(){
        const dirNum = Math.floor(Math.random()*8);
        switch(dirNum){
            case 0:
                this.direction = ["w"];
            break;
            case 1:
                this.direction = ["w","d"];
            break;
            case 2:
                this.direction = ["d"];
            break;
            case 3:
                this.direction = ["d","s"];
            break;
            case 4:
                this.direction = ["s"];
            break;
            case 5:
                this.direction = ["s","a"];
            break;
            case 6:
                this.direction = ["a"];
            break;
            case 7:
                this.direction = ["a","w"];
            break;
        }
    }
}

const addRat = ()=>{
    ratsPerLvl++;
    const div = document.createElement("div");
    div.className = "rat";
    div.id = "rat" + ratsPerLvl;
    document.querySelector("main").appendChild(div);
    if(rats.length===0){
        rats.push(new Rat(ratsBaseSpeed, document.querySelector("#rat"+ratsPerLvl)));
    }else{
        rats.push(new Rat(rats[0].speed, document.querySelector("#rat"+ratsPerLvl)));
    }
}

const nextLvl = ()=>{
    ratsLeft = ratsPerLvl;
    lvl++;
    if(lvl%2!==0){//if it is odd add a rat
        addRat();
    }else{//if it is even increase rat speed
        rats.forEach((element)=>{
            element.increaseSpeed();
        });
    }
}

const defeated = ()=>{
    lvl = 0;
    ratsPerLvl = 0;
    rats = [];
    secondsLeft = 30;
    document.querySelectorAll(".rat").forEach((element)=>{
        element.remove();
    });
    nextLvl();
}

setInterval(()=>{
    if(secondsLeft>0){
        secondsLeft--;
    }
    rats.forEach((element)=>{
        if(element.alive){
            element.changeDirection();
        }
    });
}, 1000);

setInterval(()=>{
    if(ratsLeft === 0){//win
        nextLvl();
        nextLvl();
        nextLvl();
        nextLvl();
        nextLvl();
        nextLvl();
        nextLvl();
        nextLvl();
        nextLvl();
        nextLvl();
        nextLvl();
    }else if(secondsLeft === 0){//defeat
        defeated()
    }else{//game still going
        rats.forEach((element)=>{
            if(element.alive){
                element.move();
            }
        });
    }
    
}, 50);