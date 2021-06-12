$(document).ready(async () => {
    let game = sessionStorage['game'];
    let gameInfo;
    if(game == 3){
        gameInfo = JSON.parse(sessionStorage['gameInfo']);
        //console.log(gameInfo)
    }
    else{
        location.href = "../index.html";
    }
    // Promenljive
    let korakInd = 0;
    let podaci;
    let poeniDob = [30,25,21,17,13,9,5];
    await $.get("koraci.json", function(data) {
        podaci = data[Math.floor(Math.random()*data.length)];
    });
    let poeni = 0;
    poeni = gameInfo.ukup;
    $(".poeni").text(poeni);
    let timer2;
    let vreme = 90;
    // FUnckije
    const vremeCuri = async () => {
        if(vreme > -1){
            let left = 90 - vreme;
            $("#timenum").text(vreme);
            $("#pun").css("height", (left*100/90) + "%");
            vreme--;
        }
        else{
            clearInterval(timer2);
            korakInd = 7;
            $("#unos").attr("disabled", "true");
            $("#unos").val(podaci.resenje.toUpperCase());
            for(let i=0;i<7;i++){
                $(`.korak:eq(${i}) .text`).text(podaci.koraci[i]);
            }
            $("#unos").css("color", "#ffcc4d");
            $("#next").text("СЛЕДЕЋА ИГРА");
        }
    }
    // Event Methods
    $("#send").click(function() {
        if(korakInd < 7){
            let moj = $("#unos").val();
            if(moj.toLowerCase() == podaci.resenje){
                poeni += poeniDob[korakInd];
                $(`.korak:eq(${korakInd}) .poen`).css("color", "#4deaff");
                korakInd = 7;
                //console.log(poeni);
                $(".poeni").text(poeni);
                $("#unos").attr("disabled", "true");
                $("#unos").css("color", "#4deaff");
                $("#next").text("СЛЕДЕЋА ИГРА");
                for(let i=0;i<7;i++){
                    $(`.korak:eq(${i}) .text`).text(podaci.koraci[i]);
                }
                clearInterval(timer2);
            }
            else{
                korakInd++;
                if(korakInd < 7){
                    $("#unos").val("");
                    $(`.korak:eq(${korakInd}) .text`).text(podaci.koraci[korakInd]);
                    $(`.korak:eq(${korakInd}) .poen`).text(poeniDob[korakInd]);
                }
                else{
                    $("#unos").attr("disabled", "true");
                    $("#unos").val(podaci.resenje.toUpperCase());
                    $("#unos").css("color", "#ffcc4d");
                    $("#next").text("СЛЕДЕЋА ИГРА");
                    clearInterval(timer2);
                }
            }
        }
    });
    $("#next").click(function() {
        if(korakInd < 7){
            korakInd++;
            if(korakInd < 7){
                $(`.korak:eq(${korakInd}) .text`).text(podaci.koraci[korakInd]);
                $(`.korak:eq(${korakInd}) .poen`).text(poeniDob[korakInd]);
            }
            else{
                $("#unos").attr("disabled", "true");
                $("#unos").val(podaci.resenje.toUpperCase());
                $("#unos").css("color", "#ffcc4d");
                $("#next").text("СЛЕДЕЋА ИГРА");
                clearInterval(timer2);
            }
        }
        else{
            gameInfo.kpk = poeni - gameInfo.ukup;
            gameInfo.ukup = poeni;
            //console.log(JSON.stringify(gameInfo));
            sessionStorage['gameInfo'] = JSON.stringify(gameInfo);
            sessionStorage["game"] = 4;
            location.href = "../skocko/index.html";
        }
    });
    //
    $(`.korak:eq(${korakInd}) .text`).text(podaci.koraci[korakInd]);
    $(`.korak:eq(${korakInd}) .poen`).text(poeniDob[korakInd]);
    timer2 = setInterval(vremeCuri, 1000);
});