const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let nums = new Array(5);

let step = {
    now: 5,
    all: 5
};
let setStep = function(){
    let s = document.getElementsByClassName("stepnum")[0];
    s.innerHTML = step.now;
    console.log("seted");
}
setStep();
let handler = {
    set: function(obj, prop, val){
        console.log("set val",val)
        if(prop == "now"){
            if(val <= obj.all){
                obj[prop] = val;
                console.log("set");
                setStep();
            }
        }
    },
    get: function(obj, prop){
        return prop in obj? obj[prop]:null;
    }
}
const p = new Proxy(step, handler);

let offsetLeft = 0;
let offsetTop = 0;
let Max = 5;

setTimeout(()=>{
    offsetLeft = canvas.offsetLeft;
    offsetTop = canvas.offsetTop;
},0)
canvas.addEventListener("click",async (ev)=>{
    if(p.now == 0) {
        alert("game over");
        return;
    }
    p.now--;
    let insideX = ev.pageX - offsetLeft;
    let insideY = ev.pageY - offsetTop;
    let x = (insideY - 52.5)/80;
    x = Math.floor(x);
    let y = (insideX - 152.5)/80;
    y = Math.floor(y);
    nums[x][y]++;
    drawCell(ctx,x,y,nums[x][y]);
    let pos = checkCell(nums[x][y],x,y);
    if(pos.length > 2){
        await addCell(pos, x, y);
        await sleep(500);
        p.now++;
        if(Max < nums[x][y]) Max = nums[x][y];
        await reDrawCell(Max);
    }
    let allPos = allCellCheck();
    while(allPos){
        await addCell(allPos.pos,allPos.x,allPos.y);
        await sleep(500);
        p.now++;
        if(Max < nums[allPos.x][allPos.y]) Max = nums[allPos.x][allPos.y];
        await reDrawCell(Max);
        allPos = allCellCheck();
        await sleep(500);
    }
    console.log(ev);
})

const BackgroundColor = [
    "rgb(250, 222, 129)",
    "rgb(250, 173, 96)",
    "rgb(251, 147, 79)",
    "rgb(253, 109, 47)",
    "rgb(254, 80, 37)",
    "rgb(252, 71, 46)",
    "rgb(232, 52, 27)",
    "rgb(214, 32, 7)",
    "rgb(227, 2, 2)",
    "rgb(188, 2, 2)",
    "rgb(198, 8, 100)",
    "rgb(229, 4, 147)",
    "rgb(191, 2, 137)",
    "rgb(199, 2, 199)",
]

ctx.font = "40px serif";
let setNum = function(ctx, max){
    for(let i = 0; i < 5; i++){
        nums[i] = new Array(5);
        for(let j = 0; j < 5; j++){
            let t = Math.random() * max;
            t = Math.ceil(t);
            let temp = t;
            let res = checkCell(t,i,j);
            if(res.length>2){
                while(t==temp){
                    t = Math.random() * max;
                    t = Math.ceil(t);
                }
            }
            drawCell(ctx, i, j, t);
            nums[i][j] = t;
        }
    }
}
let drawCell = function(ctx, x, y, num){
    if(num == null){
        // ctx.fillStyle = "rgb(100,100,100)";
        ctx.clearRect(152.5 + 75 * y + y*5, 52.5 + 75 * x + x * 5, 75, 75);
        return;
    }
    ctx.fillStyle = BackgroundColor[num-1];
    ctx.fillRect(152.5 + 75 * y + y*5, 52.5 + 75 * x + x * 5, 75, 75);
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillText(num, 150 + 80 * y + 30, 50 + 80 * x + 50);
}

let drawGraph = function(ctx){
    ctx.lineWidth = 5;
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(148.5, 50);
    ctx.lineTo(552.5,50);
    ctx.moveTo(148.5, 130);
    ctx.lineTo(552.5,130);
    ctx.moveTo(148.5, 210);
    ctx.lineTo(552.5,210);
    ctx.moveTo(148.5, 290);
    ctx.lineTo(552.5,290);
    ctx.moveTo(148.5, 370);
    ctx.lineTo(552.5,370);
    ctx.moveTo(148.5, 450);
    ctx.lineTo(552.5,450);


    ctx.moveTo(150, 50);
    ctx.lineTo(150,450);
    ctx.moveTo(230, 50);
    ctx.lineTo(230,450);
    ctx.moveTo(310, 50);
    ctx.lineTo(310,450);
    ctx.moveTo(390, 50);
    ctx.lineTo(390,450);
    ctx.moveTo(470, 50);
    ctx.lineTo(470,450);
    ctx.moveTo(550, 50);
    ctx.lineTo(550,450);

    ctx.strokeStyle = "#c7d5db"
    ctx.stroke();
}

let checkCell = function(num,i,j){
    let pos = [];
    let sign = new Set();
    let rear = [];
    rear.push([i,j]);
    sign.add(`${i}-${j}`);
    while(rear.length != 0){
        let temp = rear.shift();
        pos.push(temp);
        if(nums[temp[0]+1] && nums[temp[0]+1][temp[1]] && nums[temp[0]+1][temp[1]] == num && !sign.has(`${temp[0]+1}-${temp[1]}`)){
            rear.push([temp[0]+1,temp[1]]);
            sign.add(`${temp[0]+1}-${temp[1]}`);
        }
        if(nums[temp[0]-1] && nums[temp[0]-1][temp[1]] && nums[temp[0]-1][temp[1]] == num && !sign.has(`${temp[0]-1}-${temp[1]}`)){
            rear.push([temp[0]-1,temp[1]]);
            sign.add(`${temp[0]-1}-${temp[1]}`);
        }
        if(nums[temp[0]][temp[1]+1] && nums[temp[0]][temp[1]+1] == num && !sign.has(`${temp[0]}-${temp[1]+1}`)){
            rear.push([temp[0],temp[1]+1]);
            sign.add(`${temp[0]}-${temp[1]+1}`);
        }
        if(nums[temp[0]][temp[1]-1] && nums[temp[0]][temp[1]-1] == num && !sign.has(`${temp[0]}-${temp[1]-1}`)){
            rear.push([temp[0],temp[1]-1]);
            sign.add(`${temp[0]}-${temp[1]-1}`);
        }
    }
    return pos;
}

let addCell = function(pos, x, y){
    return new Promise((resolve)=>{
        for(let p of pos){
            if(p[0] == x && p[1] == y){
                nums[x][y]++;
                drawCell(ctx, x, y, nums[x][y]);
            } else {
                nums[p[0]][p[1]] = null;
                drawCell(ctx, p[0], p[1], null);
            }
        }
        resolve("done")
    })
}

let reDrawCell = async function(max){
    let rowChange = false;
    for(let i = 4; i> -1; i--){
        for(let j = 4; j > -1; j--){
            if(nums[i][j] == null){
                let temp = searchUp(i,j)
                if(temp){
                    nums[i][j] = nums[temp[0]][temp[1]];
                    drawCell(ctx, i,j,nums[i][j]);
                    nums[temp[0]][temp[1]] = null;
                    drawCell(ctx, temp[0],temp[1],nums[temp[0]][temp[1]]);
                } else {
                    let t = Math.random() * max;
                    t = Math.ceil(t);
                    drawCell(ctx, i, j, t);
                    nums[i][j] = t;
                }
                rowChange = true;
            }
        }
        if(rowChange){
            await sleep(500);
            rowChange = false;
        }
    }
}
drawGraph(ctx);
setNum(ctx, Max);

let allCellCheck = function(){
    for(let i = 0; i < 5; i++){
        for(let j = 0; j < 5; j++){
            let t = checkCell(nums[i][j],i,j);
            if(t.length > 2){
                return {pos:t,x:i,y:j};
            }
        }
    }
    return null;
}

let sleep = function(time){
    return new Promise((resolve)=>{
        setTimeout(()=>{
            resolve("done")
        },time)
    })
}

let searchUp = function(i,j){
    for(;i>=0;i--){
        if(nums[i] && nums[i][j]) return [i,j];
    }
    return null;
}



