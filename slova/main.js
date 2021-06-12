$(document).ready(async () => {
    // Promenljive
    let slova = ['а','б','в','г','д','ђ','е','ж','з','и','ј','к','л','љ','м','н','њ','о','п','р','с','т','ћ','у','ф','х','ц','ч','џ','ш'];
    let ind = 0;
    let pomind = 0;
    let timer = null;
    let resenje;
    let birana;
    let gameReady = false;
    let used = [];
    let timer2 = null;
    let poeni = 0;
    let vreme = 90;
    await $.get("reci.txt", function(data) {
        let arr = data.split('\n');
        let inds = [];
        arr.forEach((el, i) => {
            if(el.length >= 11) inds.push(i);
        });
        resenje = arr[inds[Math.floor(Math.random()*inds.length)]];
    });
    // Funkcije
    const promeni = () => {
        pomind = (pomind + 3)%30;
        $(`.slovo:eq(${ind})`).text(slova[pomind].toUpperCase());
    };
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    const vremeCuri = async () => {
        if(vreme > -1){
            let left = 90 - vreme;
            $("#timenum").text(vreme);
            $("#pun").css("height", (left*100/90) + "%");
            vreme--;
        }
        else{
            clearInterval(timer2);
            $("#correct").css("display", "none");
            $("#incorrect").css("display", "none");
            let rec = $("#mojarec").text();
            if(rec.length == 0) return;
            await $.get("reci.txt", function(data) {
                let arr = data.split('\n');
                let found = false;
                arr.forEach((el, i) => {
                    if(el.slice(0,-1) == rec.toLowerCase()){
                        found = true;
                    }
                });
                let poeni = 0;
                if(found){
                    poeni = rec.length;
                    if(rec == resenje.toUpperCase()) poeni += 5;
                    else{
                        if(rec.length >= resenje.length) poeni += 10;
                    }
                } 
                gameReady = false;
                $("#poeni").text(poeni);
            });
            $(".resenje").text(resenje.toUpperCase());
            $("#nextgame").css("display", "block");
            $("#del").css("display", "none");
        }
    }
    //
    timer = setInterval(promeni, 100);
    birana = resenje.split('');
    birana.pop();
    if(birana.length == 10){
        birana.push(slova[Math.floor(Math.random()*30)]);
        birana.push(slova[Math.floor(Math.random()*30)]);
    }
    else if(birana.length == 11){
        birana.push(slova[Math.floor(Math.random()*30)]);
    }
    shuffleArray(birana);
    // Event metode
    $("#stop").click(() => {
        if(ind < 12){
            clearInterval(timer);
            $(`.slovo:eq(${ind})`).text(birana[ind].toUpperCase());
            ind++;
            if(ind < 12) timer = setInterval(promeni, 100);
            else{
                $("#stop").css("display", "none");
                $("#send").css("display", "block");
                $("#check").css("display", "block");
                gameReady = true;
                timer2 = setInterval(vremeCuri, 1000);
            }
        }
    });
    $(".slovo").click(function() {
        if(gameReady && !$(this).hasClass("disabled")){
            let txt = $("#mojarec").text();
            txt += $(this).text();
            //console.log($(this).text());
            $("#mojarec").text(txt);
            $("#del").css("display", "block");
            let i = $(this).index();
            $(this).addClass("disabled");
            used.push(i);

            $("#correct").css("display", "none");
            $("#incorrect").css("display", "none");
        }
    });
    $("#del").click(function() {
        let last = used[used.length-1];
        $(`.slovo:eq(${last})`).removeClass("disabled");
        let txt = $("#mojarec").text();
        $("#mojarec").text(txt.slice(0,-1));
        used.pop();
        //console.log(used);
        if(used.length == 0) $("#del").css("display", "none");
        $("#correct").css("display", "none");
        $("#incorrect").css("display", "none");
    });
    $("#check").click(async function() {
        if(gameReady){
            $("#correct").css("display", "none");
            $("#incorrect").css("display", "none");
            let rec = $("#mojarec").text();
            if(rec.length == 0) return;
            await $.get("reci.txt", function(data) {
                let arr = data.split('\n');
                let found = false;
                arr.forEach((el, i) => {
                    if(el.slice(0,-1) == rec.toLowerCase()){
                        $("#correct").css("display", "block");
                        found = true;
                    }
                });
                if(!found) $("#incorrect").css("display", "block");
            });
        }
    });
    $("#send").click(async function() {
        if(gameReady){
            clearInterval(timer2);
            $("#correct").css("display", "none");
            $("#incorrect").css("display", "none");
            let rec = $("#mojarec").text();
            if(rec.length == 0) return;
            await $.get("reci.txt", function(data) {
                let arr = data.split('\n');
                let found = false;
                arr.forEach((el, i) => {
                    if(el.slice(0,-1) == rec.toLowerCase()){
                        found = true;
                    }
                });
                if(found){
                    poeni = rec.length;
                    if(rec == resenje.toUpperCase()) poeni += 5;
                    else{
                        if(rec.length >= resenje.length) poeni += 10;
                    }
                } 
                gameReady = false;
                $("#poeni").text(poeni);
            });
            $(".resenje").text(resenje.toUpperCase());
            $("#nextgame").css("display", "block");
            $("#del").css("display", "none");
        }
    });
    $("#nextgame").click(function() {
        let gameInfo = {
            reci: poeni,
            broj: 0,
            kpk: 0,
            skocko: 0,
            spoj: 0,
            kzz: 0,
            asoc: 0,
            ukup: poeni
        };
        console.log(JSON.stringify(gameInfo));
        sessionStorage['gameInfo'] = JSON.stringify(gameInfo);
        sessionStorage["game"] = 2;
        location.href = "../mojbroj/index.html";
    });
});