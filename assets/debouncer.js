//executes a funcion no more than every "interval" millisecs.

// var doCheck=new deBouncer(100);
// $(window)
//     .on("scroll resize touchmove",function(e){
//         doCheck.execute(function(e){
//             --do your stuff here!!!--
//         },e)
//     })



var deBouncer=function(interval){
    var timerHnd=null;
        return {
            execute:function(fn,e){
                if(timerHnd==null){
                    timerHnd=setTimeout(function(){

                        fn(e);  
                        timerHnd=null;                     
                    },interval)
                }
            }
        }
}