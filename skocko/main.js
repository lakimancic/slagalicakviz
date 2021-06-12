String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

$(document).ready(() => {
    let game = sessionStorage['game'];
    let gameInfo;
    if(game == 4){
        gameInfo = JSON.parse(sessionStorage['gameInfo']);
        //console.log(gameInfo)
    }
    else{
        location.href = "../index.html";
    }
    //Promenljive
    let ind = 0;
    let slova = ['A','B','C','D','E','F'];
    let komb = slova[Math.floor(Math.random()*6)] + slova[Math.floor(Math.random()*6)] + slova[Math.floor(Math.random()*6)] + slova[Math.floor(Math.random()*6)];
    let poeni = 0;
    poeni = gameInfo.ukup;
    $("#poeni").text(poeni);
    let curkob = '0000';
    let timer2;
    let vreme = 120;
    // FUnckije
    const vremeCuri = async () => {
        if(vreme > -1){
            let left = 120 - vreme;
            $("#timenum").text(vreme);
            $("#pun").css("height", (left*100/120) + "%");
            vreme--;
        }
        else{
            for(let i=0;i<4;i++){
                $(`.resenje div:eq(${i})`).html("");
                let newimg = $("<img>").attr("src","symbols/" + pom2[i] + ".png");
                $(`.resenje div:eq(${i})`).append(newimg);
            }
            $("#send").text("СЛЕДЕЋА ИГРА");
            clearInterval(timer2);
            ind = 6;
        }
    }
    // Event Methods
    $(".opcije img").click(function() {
        let isd = $(this).index();
        curkob = curkob.split("");
        for(let i=0;i<4;i++){
            if(curkob[i] == '0'){
                curkob[i] = slova[isd];
                break;
            }
        }
        for(let i=0;i<4;i++){
            $(`.komb:eq(${ind}) div:eq(${i})`).html("");
            if(curkob[i] != '0'){
                let newimg = $("<img>").attr("src","symbols/" + curkob[i] + ".png");
                $(`.komb:eq(${ind}) div:eq(${i})`).append(newimg);
            }
        }
        curkob = curkob.join("");
        //console.log(curkob);
    });
    $(".komb div").click(function() {
        let pari = $(this).parent().index();
        if(pari == ind){
            let deli = $(this).index();
            curkob = curkob.split("");
            curkob[deli] = '0';
            for(let i=0;i<4;i++){
                $(`.komb:eq(${ind}) div:eq(${i})`).html("");
                if(curkob[i] != '0'){
                    let newimg = $("<img>").attr("src","symbols/" + curkob[i] + ".png");
                    $(`.komb:eq(${ind}) div:eq(${i})`).append(newimg);
                }
            }
            curkob = curkob.join("");
        }
    });
    $("#send").click(function() {
        if(ind < 6){
            curkob = curkob.split("");
            for(let i=0;i<4;i++) if(curkob[i] == '0') return;
            curkob = curkob.join("");
            let pom = curkob.split("");
            let pom2 = komb.split("");
            let namestu = 0;
            for(let i=0;i<4;i++) if(pom[i] == pom2[i]) namestu++;
            let pomarr = [0,0,0,0,0,0];
            let pomarr2 = [0,0,0,0,0,0];
            for(let i=0;i<4;i++){
                pomarr[pom[i].charCodeAt(0) - 'A'.charCodeAt(0)]++;
                pomarr2[pom2[i].charCodeAt(0) - 'A'.charCodeAt(0)]++;
            }
            let imaih = 0;
            for(let i=0;i<6;i++){
                imaih += Math.min(pomarr[i], pomarr2[i]);
            }
            //console.log(imaih);
            for(let i=0;i<imaih;i++){
                if(i < namestu){
                    $(`.pogod:eq(${ind}) .krug:eq(${i})`).css("background", "red");
                }
                else{
                    $(`.pogod:eq(${ind}) .krug:eq(${i})`).css("background", "yellow");
                }
            }
            if(namestu == 4){
                if(ind == 0 || ind == 1) poeni += 20;
                else if(ind == 2 || ind == 3) poeni += 15;
                else poeni += 10;
                ind = 6;
                for(let i=0;i<4;i++){
                    $(`.resenje div:eq(${i})`).html("");
                    if(curkob[i] != '0'){
                        let newimg = $("<img>").attr("src","symbols/" + curkob[i] + ".png");
                        $(`.resenje div:eq(${i})`).append(newimg);
                    }
                }
                $("#send").text("СЛЕДЕЋА ИГРА");
                $("#poeni").text(poeni);
                clearInterval(timer2);
            }
            else{
                curkob = '0000';
                ind++;
                if(ind == 6){
                    for(let i=0;i<4;i++){
                        $(`.resenje div:eq(${i})`).html("");
                        let newimg = $("<img>").attr("src","symbols/" + pom2[i] + ".png");
                        $(`.resenje div:eq(${i})`).append(newimg);
                    }
                    $("#send").text("СЛЕДЕЋА ИГРА");
                    clearInterval(timer2);
                }
            }
        }
        else{
            gameInfo.skocko = poeni - gameInfo.ukup;
            gameInfo.ukup = poeni;
            //console.log(JSON.stringify(gameInfo));
            sessionStorage['gameInfo'] = JSON.stringify(gameInfo);
            sessionStorage["game"] = 5;
            location.href = "../spojnice/index.html";
        }
    });
    timer2 = setInterval(vremeCuri, 1000);
});