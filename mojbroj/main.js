//console.log(GetAllPermutations([1, 2, 3, 4]));

$(document).ready(function() {
    let game = sessionStorage['game'];
    let gameInfo;
    if(game == 2){
        gameInfo = JSON.parse(sessionStorage['gameInfo']);
        //console.log(gameInfo)
    }
    else{
        location.href = "../index.html";
    }
    // Promenljive
    let ind = 0;
    let prva = [ 10, 15, 20, 10, 15, 20, 10, 15, 20 ];
    let druga = [ 25, 50, 75, 100, 25, 50, 75, 100 ];
    let timer = null;
    let timer2 = null;
    let vreme = 90;
    let used = [];
    let gameReady = false;
    let trazen;
    let poeni = 0;
    poeni = gameInfo.ukup;
    $("#poeni").text(poeni);
    // Funkcije
    const promeni = () => {
        if(ind < 3) $(`.br${ind}`).text(Math.floor(Math.random()*10));
        else if(ind < 7) $(`.br${ind}`).text(Math.floor(Math.random()*9) + 1);
        else if(ind == 7) $(`.br${ind}`).text(prva[Math.floor(Math.random()*9)]);
        else if(ind == 8) $(`.br${ind}`).text(druga[Math.floor(Math.random()*8)]);
    };
    const vremeCuri = async () => {
        if(vreme > -1){
            let left = 90 - vreme;
            $("#timenum").text(vreme);
            $("#pun").css("height", (left*100/90) + "%");
            vreme--;
        }
        else{
            clearInterval(timer2);
            gameReady = false;
            let res;
            try {
                res = eval($("#mojizraz p").text());
            } catch (error) {
                res = 0;
            }
            $("#mojizraz p").text($("#mojizraz p").text() + " = " + res);
            if(res - trazen == 0) poeni += 30;
            else if(Math.abs(res - trazen) == 1) poeni += 20;
            else if(Math.abs(res - trazen) <= 5) poeni += 10;
            else if(Math.abs(res - trazen) <= 10) poeni += 5;
            else poeni += 0;
            let numbers = [];
            for(let i=3;i<=8;i++) numbers.push(parseInt($(`.br${i}`).text(),10));
            numbers.sort((l,r) => l - r);
            //console.log(numbers);
            let worker = new Worker("worker.js");
            let found = false;
            worker.addEventListener("message", function(event){
                let expr = event.data;
                if(expr){
                    //exprs.push(expr);
                    if(!found) {
                        $("#resenje").text(expr);
                        found = true;
                    }
                }
                else{
                    worker = null;
                }
            }, false); 
            worker.postMessage({ target: trazen, numbers: numbers });
            $("#nextgame").css("display", "block");
            $("#del").css("display", "none");
            $("#poeni").text(poeni);
        }
    }
    // Event metode
    $("#stop").click(() => {
        if(ind < 9){
            clearInterval(timer);
            ind++;
            if(ind < 9) timer = setInterval(promeni, 100);
            else{
                $("#stop").css("display", "none");
                $("#send").css("display", "block");
                gameReady = true;
                timer2 = setInterval(vremeCuri, 1000);

                trazen = Number($(".br0").text())*100 + Number($(".br1").text())*10 + Number($(".br2").text());
            }
        }
    });
    $(".brojevi .br").click(function() {
        let i = $(this).index();
        if(gameReady && !$(this).hasClass("disabled")){
            let txt = $("#mojizraz p").text();
            txt += $(this).text() + " ";
            //console.log($(this).text());
            $("#mojizraz p").text(txt);
            $("#del").css("display", "block");
            $(this).addClass("disabled");
            used.push({ind:i, size: $(this).text().length});
        }
    });
    $(".operacije div").click(function() {
        let i = $(this).index();
        if(gameReady){
            let txt = $("#mojizraz p").text();
            txt += $(this).text() + " ";
            //console.log($(this).text());
            $("#mojizraz p").text(txt);
            $("#del").css("display", "block");
            used.push(-1);
        }
    });
    $("#del").click(function() {
        let last = used[used.length-1];
        if(last != -1) $(`.br${last.ind+3}`).removeClass("disabled");
        let txt = $("#mojizraz p").text();
        if(last == -1) $("#mojizraz p").text(txt.slice(0,-2));
        else $("#mojizraz p").text(txt.slice(0,-(last.size + 1)));
        used.pop();
        //console.log(used);
        if(used.length == 0) $("#del").css("display", "none");
    });
    $("#send").click(function () {
        if(gameReady){
            clearInterval(timer2);
            gameReady = false;
            let res;
            try {
                res = eval($("#mojizraz p").text());
            } catch (error) {
                res = 0;
            }
            $("#mojizraz p").text($("#mojizraz p").text() + " = " + res);
            if(res - trazen == 0) poeni += 30;
            else if(Math.abs(res - trazen) == 1) poeni += 20;
            else if(Math.abs(res - trazen) <= 5) poeni += 10;
            else if(Math.abs(res - trazen) <= 10) poeni += 5;
            else poeni += 0;
            let numbers = [];
            for(let i=3;i<=8;i++) numbers.push(parseInt($(`.br${i}`).text(),10));
            numbers.sort((l,r) => l - r);
            //console.log(numbers);
            let worker = new Worker("worker.js");
            let found = false;
            worker.addEventListener("message", function(event){
                let expr = event.data;
                if(expr){
                    //exprs.push(expr);
                    if(!found) {
                        $("#resenje").text(expr);
                        found = true;
                    }
                }
                else{
                    worker = null;
                }
            }, false); 
            worker.postMessage({ target: trazen, numbers: numbers });
            $("#nextgame").css("display", "block");
            $("#del").css("display", "none");
            $("#poeni").text(poeni);
        }
    });
    $("#nextgame").click(function() {
        //console.log(poeni);
        gameInfo.broj = poeni - gameInfo.ukup;
        gameInfo.ukup = poeni;
        //console.log(JSON.stringify(gameInfo));
        sessionStorage['gameInfo'] = JSON.stringify(gameInfo);
        sessionStorage["game"] = 3;
        location.href = "../korakpokorak/index.html";
    });
    //
    timer = setInterval(promeni, 100);
});