$(document).ready(async function(){
    let game = sessionStorage['game'];
    let gameInfo;
    if(game == 6){
        gameInfo = JSON.parse(sessionStorage['gameInfo']);
        //console.log(gameInfo)
    }
    else{
        location.href = "../index.html";
    }
    //
    let pitind = -1;
    let pitanja = [];
    let poeni = 0;
    poeni = gameInfo.ukup;
    $("#poeni").text(poeni);
    let osvojeno = 0;
    let gameReady = false;
    let timer2;
    let vreme = 10;
    let vreme2 = 5;
    await $.get("pitanja.json", function(data){
        let used = [];
        for(let i=0;i<10;i++){
            let found = false;
            let ri;
            do{
                ri = Math.floor(Math.random()*data.length);
                found = false;
                for(let i=0;i<used.length;i++){
                    if(used[i] == ri){
                        found = true;
                        break;
                    }
                }
            }while(found);
            used.push(ri);
            pitanja.push(data[ri]);
        }
    });
    
    //Funkcije
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    const vremeCuri = async () => {
        if(vreme > -1){
            let left = 10 - vreme;
            $("#timenum").text(vreme);
            $("#pun").css("height", (left*100/10) + "%");
            vreme--;
        }
        else{
            gameReady = false;
            clearInterval(timer2);
            let find = -1;
            for(let i=0;i<4;i++){
                if(pitanja[pitind].odgovori[i].toUpperCase() == pitanja[pitind].tacan.toUpperCase()){
                    find = i;
                    break;
                }
            }
            $(`.odgovor:eq(${find})`).css("background-color", "#026e1b");
            $("#pun").css("height","0");
            vreme2 = 5;
            nextQuest();
            timer2 = setInterval(nextQuest, 1000);
        }
    }
    const nextQuest = () => {
        if(vreme2 > -1){
            $("#timenum").text(vreme2);
            vreme2--;
        }
        else{
            clearInterval(timer2);
            pitind++;
            if(pitind < 10){
                $(".odgovor").removeAttr("style");
                $(".pitanje p").text(pitanja[pitind].text);
                shuffleArray(pitanja[pitind].odgovori);
                for(let i=0;i<4;i++){
                    $(`.odgovor:eq(${i})`).text(pitanja[pitind].odgovori[i]);
                }
                gameReady = true;
                vreme = 10;
                vremeCuri();
                timer2 = setInterval(vremeCuri, 1000);
            }
            else{
                $(".fr").hide();
                $(".dr").css("display", "flex");
                $(".dr p").text(`Освојили сте ${osvojeno} поена и тренутно имате ${poeni} поена!`);
                $("#next").text("СЛЕДЕЋА ИГРА");
            }
        }
    }
    // Event Methods
    $("#next").click(function(){
        if(pitind == -1){
            $(".dr").hide();
            $(".fr").css("display", "flex");
            pitind++;
            $(".pitanje p").text(pitanja[pitind].text);
            shuffleArray(pitanja[pitind].odgovori);
            for(let i=0;i<4;i++){
                $(`.odgovor:eq(${i})`).text(pitanja[pitind].odgovori[i]);
            }
            gameReady = true;
            vremeCuri();
            timer2 = setInterval(vremeCuri, 1000);
        }
        else{
            gameInfo.kzz = poeni - gameInfo.ukup;
            gameInfo.ukup = poeni;
            //console.log(JSON.stringify(gameInfo));
            sessionStorage['gameInfo'] = JSON.stringify(gameInfo);
            sessionStorage["game"] = 7;
            location.href = "../asocijacije/index.html";
        }
    });
    $(".odgovor").click(function() {
        if(pitind >= 0 && pitind < 10 && gameReady){
            let mojodg = $(this).text();
            if(mojodg.toUpperCase() == pitanja[pitind].tacan.toUpperCase()){
                poeni+=10;
                osvojeno+=10;
                $(this).css("background-color", "#026e1b");
            }
            else{
                poeni-=5;
                osvojeno-=5;
                let find = -1;
                for(let i=0;i<4;i++){
                    if(pitanja[pitind].odgovori[i].toUpperCase() == pitanja[pitind].tacan.toUpperCase()){
                        find = i;
                        break;
                    }
                }
                $(this).css("background-color", "#6e0202");
                $(`.odgovor:eq(${find})`).css("background-color", "#026e1b");
            }
            gameReady = false;
            $("#poeni").text(poeni);
            $("#pun").css("height","0");
            clearInterval(timer2);
            vreme2 = 5;
            nextQuest();
            timer2 = setInterval(nextQuest, 1000);
        }
    });
    //
    //console.log(pitanja);
});