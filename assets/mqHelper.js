;(function(){


  // to set the breakpoints please set the following in your css

  /*media query helper (used to make JS aware of the current MQ)*/
  // #mqHelper{                                 //mobile  
  //   position: absolute;
  //   left:-9999px;
  //   height: 0px;
  //   width: 0px;
  // }
  // @media screen and (min-width: 600px) {     //tablet
  //   #mqHelper{
  //     height: 1px;
  //   }
  // }

  // @media screen and (min-width: 1025px) {    //desktop
  //   #mqHelper{
  //     height: 2px;
  //   }
  // }


    var devices=["mobile","tablet","desktop"],
        mqDiv=$("<div id='mqHelper'/>").appendTo("body");

    // todo: improve the following
    $.fn.getDevice=function(){
        var i=mqDiv.height();
        return devices[i];     
    }

})();