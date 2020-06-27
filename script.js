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

    }

    increaseSpeed(){
        this.speed = this.speed * 2;
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
}, 1000);

setInterval(()=>{
    if(ratsLeft === 0){//win
        nextLvl();
    }else if(secondsLeft === 0){//defeat
        defeated()
    }else{//game still going

    }
    
}, 10);