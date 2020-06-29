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

let keys = [];

let running = true;

document.addEventListener("keydown", (e)=>{
    console.log(e);
    if(!keys.includes(e.key)){
        keys.push(e.key);
    }
    console.log(keys);
});

document.addEventListener("keyup", (e)=>{
    console.log(e);
    keys = keys.filter((element)=>{
        return element !== e.key;
    });
    console.log(keys);
});

const catForce = 4;
const catInitialX = mainWidth/2;
const catInitialY = mainHeight/2;
let VMaxCat = 10;

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
                if(vector.magnitude===0){
                    return this;
                }else{
                    return vector
                }
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

class Cat{
    constructor(html){
        const x = catInitialX;
        const y = catInitialY;

        this.position = {
            x: x,
            y: y
        }

        this.velocity = new Vector(0,0);

        this.resultantForce = new Vector(0,0);

        this.ratForce = new Vector(0, 0);

        this.alive = true;

        this.html = html;
        this.html.style.top = this.position.y + "px";
        this.html.style.left = this.position.x + "px";
    }

    setPosition(){


        const vectorX = this.velocity.decompose().vectorX;
        const vectorY = this.velocity.decompose().vectorY;

        const newX = this.position.x + vectorX.magnitude*vectorX.orientation().x;
        const newY = this.position.y - vectorY.magnitude*vectorY.orientation().y;

        if(newX > mainWidth - 20){
            this.ratForce.invertX();
            this.velocity.invertX();
        }else if(newX < 0){
            this.ratForce.invertX();
            this.velocity.invertX();
        }else{
            this.position.x = newX;
        }
        
        if(newY > mainHeight -20){
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


        const max = (this.velocity.magnitude/VMaxCat);

        const resistiveForce = new Vector((max*ratForce), (this.velocity.direction + pi));

        let resultant = this.ratForce.sum(resistiveForce);
        this.resultantForce = resultant;

        this.setVelocity();
    }

    setRatForce(vector){

        this.ratForce = vector;
        this.setResultantForce();
    }

    die(){
        this.alive = false;
        this.html.style.backgroundColor = "red";
    }

    passTime(){
        this.move();
    }

    move(){

        let keyVector = new Vector(0,0);

        if(keys.includes("d")){
            keyVector = keyVector.sum(new Vector(catForce, 0));
        }
        if(keys.includes("w")){
            keyVector = keyVector.sum(new Vector(catForce, pi/2))
        }
        if(keys.includes("a")){
            keyVector = keyVector.sum(new Vector(catForce, pi))
        }
        if(keys.includes("s")){
            keyVector = keyVector.sum(new Vector(catForce, 3*pi/2))
        }

        const newVector = this.ratForce.sum(keyVector);
        if(keys.length>0){
            newVector.setMagnitude(catForce);
        }else{
            newVector.setMagnitude(0);
        }
        this.setRatForce(newVector);
    }

}

const cat = new Cat(document.querySelector(".cat"));

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

        if(newX > mainWidth - 10){
            this.ratForce.invertX();
            this.velocity.invertX();
        }else if(newX < 0){
            this.ratForce.invertX();
            this.velocity.invertX();
        }else{
            this.position.x = newX;
        }
        
        if(newY > mainHeight -10){
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
        ratsLeft--;
    }

    revive(){
        this.alive = true;
        this.html.style.backgroundColor = "black";
        this.position = {
            x: Math.floor(Math.random() * mainWidth),
            y: Math.floor(Math.random() * mainHeight)
        }
    }

    passTime(){
        this.setRatForce()
        this.turn();
    }

    turn(){
        this.changeTime--;
        if(this.changeTime <= 0){
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
    rats.forEach((element)=>{
        element.revive();
    });
    lvl++;
    secondsLeft = 30;
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
    cat.passTime();
    rats.forEach((element)=>{
        if(element.alive){
            element.passTime();
            if(cat.position.x > element.position.x - 30 && cat.position.x < element.position.x + 30){
                if(cat.position.y > element.position.y - 30 && cat.position.y < element.position.y + 30){
                    element.die();
                }
            }
        }
    });
}

setInterval(()=>{
    if(secondsLeft>0){
        secondsLeft--;
        document.querySelector("header").innerHTML = "<p>Level "+lvl+"</p> <p>Time "+secondsLeft+ " </p>";
    }
    // nextLvl();
}, 1000);

setInterval(()=>{
        if(ratsLeft === 0){//win
                nextLvl();
        }else if(secondsLeft === 0){//defeat
                defeated();
        }else{//game still going
            passTime();
        }
}, 50);
