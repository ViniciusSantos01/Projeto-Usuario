class Utils {

    static dateFormat(date){

        var d = date.getDate();
        var m = date.getMonth()+1;
        var y = date.getFullYear();
        var h = date.getHours();
        var min = date.getMinutes();

        return (d<10 ? '0'+d : d)+'/'+(m<10 ? '0'+m : m)+'/'+ y +' '+ h +':'+(min<10 ? '0'+min : min);

    }

}