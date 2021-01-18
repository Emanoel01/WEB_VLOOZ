
function dateToString(dateToConverte){

    let convertedDate = "";

    if(dateToConverte!=null){
        try{
            let arrayDates = dateToConverte.split("-");
            convertedDate = arrayDates[2] + "/" + arrayDates[1] +"/" + arrayDates[0];
        }catch(error){
            console.log(error);
        }
    }

    return convertedDate;
}

function getYear(){
    let data = Date();

    let dataArray = data.split(" ");

    return parseInt(dataArray[3]);
}

function verifyMonth(number){
    if(number==1)
        return "Janeiro";
    else if(number==2)
        return "Fevereiro";
    else if(number==3)
        return "Março";
    else if(number==4)
        return "Abril";
    else if(number==5)
        return "Maio";
    else if(number==6)
        return "Junho";
    else if(number==7)
        return "Julho";
    else if(number==8)
        return "Agosto";
    else if(number==9)
        return "Setembro";
    else if(number==10)
        return "Outubro";
    else if(number==11)
        return "Novembro";
    else if(number==12)
        return "Dezembro";
}

export {dateToString,getYear,verifyMonth};