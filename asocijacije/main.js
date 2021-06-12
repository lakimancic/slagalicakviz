$(document).ready(async () => {
    let game = sessionStorage['game'];
    let gameInfo;
    if(game == 7){
        gameInfo = JSON.parse(sessionStorage['gameInfo']);
        //console.log(gameInfo)
    }
    else{
        location.href = "../index.html";
    }
    //Promenljive
    let asoc;
    await $.get("asocijacije.json", function(data) {
        asoc = data[Math.floor(Math.random()*data.length)];
    });
    let poeni = 0;
    poeni = gameInfo.ukup;
    $("#poeni").text(poeni);
    let opened = {
        "A": [false, false, false, false, false],
        "B": [false, false, false, false, false],
        "C": [false, false, false, false, false],
        "D": [false, false, false, false, false],
        "K": false
    }
    let curr = -1;
    //console.log(asoc);
    let timer2;
    let vreme = 150;
    // Funkcije
    const vremeCuri = async () => {
        if(vreme > -1){
            let left = 150 - vreme;
            $("#timenum").text(vreme);
            $("#pun").css("height", (left*100/150) + "%");
            vreme--;
        }
        else{
            clearInterval(timer2);
            if(!opened.A[0]){
                for(let i=1;i<5;i++){
                    $("#resA").parent().parent().children(`.red:eq(${i-1})`).text(asoc['A'].kolone[i-1]);
                }
                opened["A"][0] = true;
                $("#resA").val(asoc['A'].resenje);
                $("#resA").attr("disabled", "");
                //$("#resA").parent().css("background","#1555bd");
            }
            if(!opened.B[0]){
                for(let i=1;i<5;i++){
                    $("#resB").parent().parent().children(`.red:eq(${i-1})`).text(asoc['B'].kolone[i-1]);
                }
                opened["B"][0] = true;
                $("#resB").val(asoc['B'].resenje);
                $("#resB").attr("disabled", "");
                //$("#resB").parent().css("background","#1555bd");
            }
            if(!opened.C[0]){
                for(let i=1;i<5;i++){
                    $("#resC").parent().parent().children(`.red:eq(${i-1})`).text(asoc['C'].kolone[i-1]);
                }
                opened["C"][0] = true;
                $("#resC").val(asoc['C'].resenje);
                $("#resC").attr("disabled", "");
            }
            if(!opened.D[0]){
                for(let i=1;i<5;i++){
                    $("#resD").parent().parent().children(`.red:eq(${i-1})`).text(asoc['D'].kolone[i-1]);
                }
                opened["D"][0] = true;
                $("#resD").val(asoc['D'].resenje);
                $("#resD").attr("disabled", "");
            }
            $("#resK").val(asoc.resenje[0]);
            //$("#resK").parent().css("background","#1555bd");
            $("#resK").attr("disabled", "");
            opened.K = true;
            $("#send").text("КРАЈ");
            curr = -1;
        }
    }
    // Event Methods
    $(".red").click(function(){
        let clind = $(this).index();
        let slovo = $(this).parent().attr("id").split("")[0];
        if(slovo == 'C' || slovo == 'D') clind--;
        if(!opened["K"] && !opened[slovo][0] && !opened[slovo][clind+1]){
            $(this).text(asoc[slovo].kolone[clind]);
            opened[slovo][clind+1] = true;
            $(this).parent().children(".resred").children("input").removeAttr("disabled");
        }
    });
    $(".resred input").on("focus", function(){
        let val = $(this).val();
        if(!opened.A[0]) $("#resA").val("");
        if(!opened.B[0]) $("#resB").val("");
        if(!opened.C[0]) $("#resC").val("");
        if(!opened.D[0]) $("#resD").val("");
        if(!opened.K) $("#resK").val("");
        $(this).val(val);
        curr = $(this).attr("id");
    });
    $("#resK").on("focus", function(){
        let val = $(this).val();
        if(!opened.A[0]) $("#resA").val("");
        if(!opened.B[0]) $("#resB").val("");
        if(!opened.C[0]) $("#resC").val("");
        if(!opened.D[0]) $("#resD").val("");
        if(!opened.K) $("#resK").val("");
        $(this).val(val);
        curr = $(this).attr("id");
    });
    $("#send").click(function(){
        if(curr != -1){
            let val = $("#" + curr).val();
            let slovo = curr.split("")[3];
            if(slovo == 'A' || slovo == 'B' || slovo == 'C' || slovo == 'D'){
                if(asoc[slovo].resenje.toUpperCase() == val.toUpperCase()){
                    poeni += 5;
                    $("#resK").removeAttr("disabled");
                    for(let i=1;i<5;i++){
                        if(!opened[slovo][i]) poeni++;
                        $("#" + curr).parent().parent().children(`.red:eq(${i-1})`).text(asoc[slovo].kolone[i-1]);
                        $("#" + curr).parent().parent().children(`.red:eq(${i-1})`).css("background","#1555bd");
                    }
                    opened[slovo][0] = true;
                    $("#" + curr).attr("disabled", "");
                    $("#" + curr).parent().css("background","#1555bd");
                    $("#poeni").text(poeni)
                }
                if(!opened.A[0]) $("#resA").val("");
                if(!opened.B[0]) $("#resB").val("");
                if(!opened.C[0]) $("#resC").val("");
                if(!opened.D[0]) $("#resD").val("");
                if(!opened.K) $("#resK").val("");
            }
            else{
                for(let i=0;i<asoc.resenje.length;i++){
                    if(asoc.resenje[i].toUpperCase() == val.toUpperCase()){
                        poeni += 10;
                        if(!opened.A[0]){
                            poeni += 5;
                            for(let i=1;i<5;i++){
                                if(!opened['A'][i]) poeni++;
                                $("#resA").parent().parent().children(`.red:eq(${i-1})`).text(asoc['A'].kolone[i-1]);
                                $("#resA").parent().parent().children(`.red:eq(${i-1})`).css("background","#1555bd");
                            }
                            opened["A"][0] = true;
                            $("#resA").val(asoc['A'].resenje);
                            $("#resA").attr("disabled", "");
                            $("#resA").parent().css("background","#1555bd");
                        }
                        if(!opened.B[0]){
                            poeni += 5;
                            for(let i=1;i<5;i++){
                                if(!opened['B'][i]) poeni++;
                                $("#resB").parent().parent().children(`.red:eq(${i-1})`).text(asoc['B'].kolone[i-1]);
                                $("#resB").parent().parent().children(`.red:eq(${i-1})`).css("background","#1555bd");
                            }
                            opened["B"][0] = true;
                            $("#resB").val(asoc['B'].resenje);
                            $("#resB").attr("disabled", "");
                            $("#resB").parent().css("background","#1555bd");
                        }
                        if(!opened.C[0]){
                            poeni += 5;
                            for(let i=1;i<5;i++){
                                if(!opened['C'][i]) poeni++;
                                $("#resC").parent().parent().children(`.red:eq(${i-1})`).text(asoc['C'].kolone[i-1]);
                                $("#resC").parent().parent().children(`.red:eq(${i-1})`).css("background","#1555bd");
                            }
                            opened["C"][0] = true;
                            $("#resC").val(asoc['C'].resenje);
                            $("#resC").attr("disabled", "");
                            $("#resC").parent().css("background","#1555bd");
                        }
                        if(!opened.D[0]){
                            poeni += 5;
                            for(let i=1;i<5;i++){
                                if(!opened['D'][i]) poeni++;
                                $("#resD").parent().parent().children(`.red:eq(${i-1})`).text(asoc['D'].kolone[i-1]);
                                $("#resD").parent().parent().children(`.red:eq(${i-1})`).css("background","#1555bd");
                            }
                            opened["D"][0] = true;
                            $("#resD").val(asoc['D'].resenje);
                            $("#resD").attr("disabled", "");
                            $("#resD").parent().css("background","#1555bd");
                        }
                        $("#poeni").text(poeni);
                        $("#resK").val(asoc.resenje[0]);
                        $("#resK").parent().css("background","#1555bd");
                        $("#resK").attr("disabled", "");
                        $("#send").text("КРАЈ");
                        opened.K = true;
                        curr = -1;
                        clearInterval(timer2);
                        return;
                    }
                }
            }
        }
        else{
            if(opened.K){
                gameInfo.asoc = poeni - gameInfo.ukup;
                gameInfo.ukup = poeni;
                //console.log(JSON.stringify(gameInfo));
                sessionStorage['gameInfo'] = JSON.stringify(gameInfo);
                sessionStorage["game"] = 8;
                location.href = "../theend.html";
            }
        }
    })
    timer2 = setInterval(vremeCuri, 1000);
});