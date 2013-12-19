//executes a funcion no more than every "interval" millisecs.

// var doCheck=new deBouncer(100);
// $(window)
//     .on("scroll resize touchmove",function(e){
//         doCheck.execute(function(e){
//             --do your stuff here!!!--
//         },e)
//     })



var deBouncer=function(interval){
    var timerHnd=null,
        isFirst=true,
        isFirstHnd=null;

        return {
            execute:function(fn,e){
                if(isFirst && timerHnd==null){
                    fn(e);
                    isFirst=false;
                }else{
                    if(timerHnd==null){
                        timerHnd=setTimeout(function(){
                            fn(e);  
                            timerHnd=null;   

                            clearTimeout(isFirstHnd);
                            isFirstHnd=setTimeout(function(){
                                isFirst=true;                                               
                            },interval)   
                        },interval)
                    }
                }
            }
        }
}