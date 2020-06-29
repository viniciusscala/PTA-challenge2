const pi = Number(Math.PI.toFixed(2));

const mainWidth = Number(window.getComputedStyle( document.querySelector("main") , null).getPropertyValue("width").slice(0, window.getComputedStyle( document.querySelector("main") , null).getPropertyValue("width").length-2));

const mainHeight = Number(window.getComputedStyle( document.querySelector("main") , null).getPropertyValue("height").slice(0, window.getComputedStyle( document.querySelector("main") , null).getPropertyValue("height").length-2));

let lvl = 0;
let ratForce = 1;
let Vmax = 10;
let ratsPerLvl = 0;
let rats = [];
let ratsLeft = ratsPerLvl;
let secondsLeft = 30;

const catForce = 10;
const catInitialX = mainWidth/2;
const catInitialY = mainHeight/2;

const toDegree = (value)=>{
    return (value/pi)*180;
}


class Vector{
    constructor(magnitude, direction){
        if(magnitude<0){
            magnitude = magnitude*-1;
        }
        this.magnitude = Number((Math.round(magnitude * 100) / 100).toFixed(2));

        if(direction>=2*pi){
            direction = direction%(2*pi);
        }else if(direction<0){
            while(direction<0){
                direction = direction + (2*pi);
            }
        }
        this.direction = Number((Math.round(direction * 100) / 100).toFixed(2));
    }

    setMagnitude(magnitude){
        if(magnitude<0){
            magnitude = magnitude*-1;
        }
        this.magnitude = Number((Math.round(magnitude * 100) / 100).toFixed(2));
    }

    setDirection(direction){
        if(direction>=2*pi){
            direction = direction%(2*pi);
        }else if(direction<0){
            while(direction<0){
                direction = direction + (2*pi);
            }
        }

        this.direction = Number((Math.round(direction * 100) / 100).toFixed(2));
    }

    quadrant(){
        if(this.direction >= 3*pi/2){
            return 4;
        }else if(this.direction >= pi){
            return 3;
        }else if(this.direction >= pi/2){
            return 2;
        }else if(this.direction >= 0){
            return 1;
        }else{
            console.log("something is wrong");
            console.log(this.direction);
            return 1;
        }
    }

    orientation(){
        switch(this.quadrant()){
            case 1:
                return {
                    x: 1,
                    y: 1,
                }
            break;
            case 2:
                return {
                    x: -1,
                    y: 1,
                }
            break;
            case 3:
                return {
                    x: -1,
                    y: -1,
                }
            break;
            case 4:
                return {
                    x: 1,
                    y: -1,
                }
            break;
        }
    }

    decompose(){
        const magnitudeX = Math.cos(this.direction)*this.magnitude;
        let directionX = 0;
        const magnitudeY = Math.sin(this.direction)*this.magnitude;
        let directionY = pi/2;

        switch(this.quadrant()){
            case 2:
                directionX = pi;
            break;
            case 3:
                directionX = pi;
                directionY = 3*pi/2;
            break;
            case 4:
                directionY = 3*pi/2;
            break;
        }

        const decomposedVector = {
            vectorX: new Vector(magnitudeX, directionX),
            vectorY: new Vector(magnitudeY, directionY)
        }
        
        return decomposedVector;
    }
    
    sum(vector){
        if(this.magnitude===0 || vector.magnitude===0){
            if(this.magnitude===0){
                return vector
            }else{
                return this;
            }
        }else{
            const decomposed1 = this.decompose();
            const decomposed2 = vector.decompose();
    
            const magnitudeX = ((decomposed1.vectorX.magnitude)*(decomposed1.vectorX.orientation().x)) + ((decomposed2.vectorX.magnitude)*(decomposed2.vectorX.orientation().x));
            const magnitudeY = ((decomposed1.vectorY.magnitude)*(decomposed1.vectorY.orientation().y)) + ((decomposed2.vectorY.magnitude)*(decomposed2.vectorY.orientation().y));
    
            const resultantMagnitude = Math.sqrt(Math.pow(magnitudeX,2)+Math.pow(magnitudeY,2));
    
            const tan = magnitudeY/magnitudeX;
    
            let resultantDirection = Math.atan(tan);
    
            let orientationX = decomposed1.vectorX.magnitude - decomposed2.vectorX.magnitude;
    
            if(orientationX>=0){
                orientationX = this.orientation().x;
            }else{
                orientationX = vector.orientation().x;
            }
    
            if(orientationX<0){
                resultantDirection = resultantDirection + pi;
            }
    
            return new Vector(resultantMagnitude, resultantDirection);
        } 
    }

    invertX(){
        const vectorX = this.decompose().vectorX;
        const vectorY = this.decompose().vectorY;
        vectorX.invert()
        
        const newVector = vectorX.sum(vectorY);

        this.setMagnitude(newVector.magnitude);
        this.setDirection(newVector.direction);
    }

    invertY(){
        const vectorX = this.decompose().vectorX;
        const vectorY = this.decompose().vectorY;
        vectorY.invert()
        
        const newVector = vectorX.sum(vectorY);

        this.setMagnitude(newVector.magnitude);
        this.setDirection(newVector.direction);
    }

    invert(){
        const newDirection = this.direction + pi;
        this.setDirection(newDirection);
    }
}

const cat = {
    position: {
        x: catInitialX,
        y: catInitialY
    },

    velocity: new Vector(0,0),

    resultantForce: new Vector(0,0),

    catForce: new Vector(catForce, 0),

    alive: true,

    html: document.querySelector(".cat")
}

class Rat{
    constructor(html){
        const x = Math.floor(Math.random() * mainWidth);
        const y = Math.floor(Math.random() * mainHeight);

        this.position = {
            x: x,
            y: y
        }

        this.velocity = new Vector(0,0);

        this.resultantForce = new Vector(0,0);

        this.ratForce = new Vector(ratForce, 0);

        this.alive = true;

        this.changeTime = Math.random() * 20;

        this.html = html;
        this.html.style.top = this.position.y + "px";
        this.html.style.left = this.position.x + "px";
    }

    setPosition(){
        const vectorX = this.velocity.decompose().vectorX;
        const vectorY = this.velocity.decompose().vectorY;

        const newX = this.position.x + vectorX.magnitude*vectorX.orientation().x;
        const newY = this.position.y - vectorY.magnitude*vectorY.orientation().y;

        if(newX > mainWidth){
            this.ratForce.invertX();
            this.velocity.invertX();
        }else if(newX < 0){
            this.ratForce.invertX();
            this.velocity.invertX();
        }else{
            this.position.x = newX;
        }
        
        if(newY > mainHeight){
            this.ratForce.invertY();
            this.velocity.invertY();
        }else if(newY <0){
            this.ratForce.invertY();
            this.velocity.invertY();
        }else{
            this.position.y = newY;
        }

        this.html.style.top = this.position.y + "px";
        this.html.style.left = this.position.x + "px";
    }

    setVelocity(){

        const velocity = this.velocity.sum(this.resultantForce);

        this.velocity = velocity;

        let d = toDegree(this.velocity.direction);

        d = 360 - d;

        this.html.style.transform = "rotate("+ d +"deg)";

        this.setPosition();
    }

    setResultantForce(){


        const max = (this.velocity.magnitude/Vmax);

        const resistiveForce = new Vector((max*ratForce), (this.velocity.direction + pi));

        let resultant = this.ratForce.sum(resistiveForce);
        this.resultantForce = resultant;

        this.setVelocity();
    }

    setRatForce(){
        this.setResultantForce();
    }

    die(){
        this.alive = false;
        this.html.style.backgroundColor = "red";
    }

    passTime(){
        this.setRatForce()
        this.turn();
    }

    turn(){
        this.changeTime--;
        if(this.changeTime <= 0){
            console.log("muda");
            const dirNum = Math.floor(Math.random()*8);
            switch(dirNum){
                case 0:
                    this.ratForce.setDirection(2*pi/4);
                    this.setResultantForce();
                break;
                case 1:
                    this.ratForce.setDirection(1*pi/4);
                    this.setResultantForce();
                break;
                case 2:
                    this.ratForce.setDirection(0);
                    this.setResultantForce();
                break;
                case 3:
                    this.ratForce.setDirection(7*pi/4);
                    this.setResultantForce();
                break;
                case 4:
                    this.ratForce.setDirection(6*pi/4);
                    this.setResultantForce();
                break;
                case 5:
                    this.ratForce.setDirection(5*pi/4);
                    this.setResultantForce();
                break;
                case 6:
                    this.ratForce.setDirection(4*pi/4);
                    this.setResultantForce();
                break;
                case 7:
                    this.ratForce.setDirection(3*pi/4);
                    this.setResultantForce();
                break;
            }
            
            this.changeTime = Math.random() * 20;
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
        rats.push(new Rat(document.querySelector("#rat"+ratsPerLvl)));
    }else{
        rats.push(new Rat(document.querySelector("#rat"+ratsPerLvl)));
    }
}

const nextLvl = ()=>{
    lvl++;
    document.querySelector("p").innerHTML = "Level " + lvl;
    if(lvl%2!==0){//if it is odd add a rat
        addRat();
    }else{//if it is even increase rat speed
        // ratForce = ratForce * 1.1;
        Vmax = Vmax * 1.1;
        rats.forEach((element)=>{
            element.ratForce.setMagnitude(ratForce);
        });
    }
    ratsLeft = ratsPerLvl;
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

const passTime = ()=>{
    rats.forEach((element)=>{
        element.passTime();
    });
}

setInterval(()=>{
    if(secondsLeft>0){
        secondsLeft--;
    }
    nextLvl();
    console.log(lvl);
}, 1000);

setInterval(()=>{
    if(ratsLeft === 0){//win
        nextLvl();
    }else if(secondsLeft === 0){//defeat
        defeated()
    }else{//game still going
        passTime();
    }
}, 50);
