;(function(){

    // to set the breakpoints please look for #mqHelper in the css file

    // todo: improve the following
    $.fn.getDevice=function(){
        var i=mqDiv.height();
        return device[i];     
    }

    var device=["mobile","tablet","desktop"],
        mqDiv=$("<div id='mqHelper'/>").appendTo("body"),
        doCheck=new deBouncer(100),
        prevDevice=mqDiv.getDevice();

    $(window)
        .on("resize",function(e){
            doCheck.execute(function(e){
                var currentDevice=mqDiv.getDevice();
                if(currentDevice!=prevDevice){
                    mqDiv.trigger("mqChange", currentDevice);
                    prevDevice=currentDevice;
                }
            },e)
        })


})();