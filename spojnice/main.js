$(document).ready(async function() {
    let game = sessionStorage['game'];
    let gameInfo;
    if(game == 5){
        gameInfo = JSON.parse(sessionStorage['gameInfo']);
        //console.log(gameInfo)
    }
    else{
        location.href = "../index.html";
    }
    // Promenljive
    let ind = 0;
    let spojnica;
    let poeni = 0;
    poeni = gameInfo.ukup;
    $("#poeni").text(poeni);
    await $.get("spojnice.json", function(data){
        spojnica = data[Math.floor(Math.random()*2)];
    });
    let arr2 = spojnica.desne;
    let timer2;
    let vreme = 120;
    // Funkcije
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    const vremeCuri = async () => {
        if(vreme > -1){
            let left = 120 - vreme;
            $("#timenum").text(vreme);
            $("#pun").css("height", (left*100/120) + "%");
            vreme--;
        }
        else{
            for(let i=0;i<10;i++){
                let d = $(`.leve .spoj:eq(${arr2[i].ind})`).offset().top - $(`.desne .spoj:eq(${i})`).offset().top;
                $(`.desne .spoj:eq(${i})`).animate({
                    top: `${d}px`
                }, 1000);
            }
            $("#next").css("display", "block");
            ind = 10;
            clearInterval(timer2);
        }
    }
    // Event Methods
    $(".desne .spoj").click(function() {
        if(ind < 10){
            let clind = $(this).index();
            if(arr2[clind].ind == ind){
                $(`.desne .spoj:eq(${clind})`).css("background", "#27a2d3");
                poeni += 2;
                $("#poeni").text(poeni);
            }
            else{
                $(`.leve .spoj:eq(${ind})`).removeAttr("style");
            }
            ind++;
            if(ind < 10){
                $(`.leve .spoj:eq(${ind})`).css("background", "#27a2d3");
            }
            else{
                for(let i=0;i<10;i++){
                    let d = $(`.leve .spoj:eq(${arr2[i].ind})`).offset().top - $(`.desne .spoj:eq(${i})`).offset().top;
                    $(`.desne .spoj:eq(${i})`).animate({
                        top: `${d}px`
                    }, 1000);
                }
                $("#next").css("display", "block");
                clearInterval(timer2);
            }
        }
    });
    $("#next").click(function() {
        if(ind == 10){
            gameInfo.spoj = poeni - gameInfo.ukup;
            gameInfo.ukup = poeni;
            //console.log(JSON.stringify(gameInfo));
            sessionStorage['gameInfo'] = JSON.stringify(gameInfo);
            sessionStorage["game"] = 6;
            location.href = "../koznazna/index.html";
        }
    });
    // Popuni spojnicu
    timer2 = setInterval(vremeCuri, 1000);
    shuffleArray(arr2);
    $(".zadatak p").text(spojnica.naziv);
    for(let i=0;i<10;i++){
        $(`.leve .spoj:eq(${i})`).text(spojnica.leve[i]);
        $(`.desne .spoj:eq(${i})`).text(arr2[i].ime);
    }
    $(`.leve .spoj:eq(${ind})`).css("background", "#27a2d3");
});