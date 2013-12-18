;(function ( $, window, document, undefined ) {

    // Create the defaults once
    var pluginName = "hotSpot",
        defaults = {
            enter:$.noop,
            enteringTop:$.noop,
            enteringBottom:$.noop,
            contained:$.noop,
            leaving:$.noop,
            leavingTop:$.noop,
            leavingBottom:$.noop,
            gone:$.noop,
            debugMode:false,        //if true shows a red line for visual feedback
            top:0,                  //todo: make this customisable in therms of screen height %
            thickness:1             //line thickness
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

        this.options = $.extend( {}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;
        this.lastFiredEvent=null;
        this.previousTop=$(window).scrollTop();

        this.init();
    }

    Plugin.prototype = {

        init: function() {
            var that=this;          

            $(window)
                .on("scroll touchmove resize",function(e){
                    that.hotSpotCheck(that.element);
                    // console.log(e.type)
                })
            

            // running the function on page load
            $(window).load(
                function(){
                    that.hotSpotCheck(that.element);
                }
            )
            
        },


        hotSpotCheck: function(element){

            var $this=$(element);
            if(!$this.is(":visible")){
                return false;
            }

            var scroll_top = $(window).scrollTop(), // our current vertical position from the top
                that    = this,
                elTop   = $this.offset().top,
                elBottom= elTop+$this.outerHeight(false),
                hsTop   = this.options.top + scroll_top,
                hsBottom= hsTop + this.options.thickness,
                isAbove = elBottom<hsTop,
                isScrollingUp=(this.previousTop<scroll_top);  //understangin the scroll direction

                if(elTop>hsTop && elBottom<hsBottom){
                    //the element is entirely underneath the HSL
                    if(this.statusIsNot(["contained"])){
                        this.options.contained.call($this);
                        this.log("contained");
                        this.setStatus("contained");
                    }

                }else{


                    if((elTop>hsBottom || elBottom<hsTop) && this.statusIs(["leavingTop","leavingBottom","gone" + !isAbove,null])){
                        //the element is not underneath the hotSpot line
                        this.options.gone.call($this,isAbove);
                        this.log("gone");
                        this.setStatus("gone"+isAbove);

                    }else{

                        if(isScrollingUp){
                            if(elTop<hsBottom && elBottom>hsBottom && this.statusIsNot(["leavingTop","contained","enteringBottom","enteringTop"])){
                                // the element just went under the HSL
                                this.options.enter.call($this);
                                this.log("enter");
                                this.options.enteringBottom.call($this);
                                this.log("enteringBottom");
                                this.setStatus("enteringBottom");
                            }

                            if(elBottom<=hsBottom && this.statusIsNot(["leavingTop","gonetrue","gonefalse"])){
                                // the element is sliding out from the top side
                                this.options.leaving.call($this);
                                this.log("leaving");
                                this.options.leavingTop.call($this);
                                this.log("leavingTop");
                                this.setStatus("leavingTop")
                            }

                            if(elBottom<hsTop && this.statusIsNot(["gonetrue","gonefalse","enteringBottom"])){
                                // the element just went out from the top side
                                this.options.gone.call($this,isAbove);
                                this.log("gone!!!");
                                this.setStatus("gone"+isAbove)
                            }


                        }else{
                            if(elBottom>hsTop && elTop<hsBottom && this.statusIsNot(["leavingBottom","contained","enteringTop","enteringBottom"])){
                                // the element just went under the HSL
                                this.options.enter.call($this);
                                this.log("enter");
                                this.options.enteringTop.call($this);
                                this.log("enteringTop");
                                this.setStatus("enteringTop");
                            }

                            if(elTop>hsTop && (this.statusIsNot(["leavingBottom","gonetrue","gonefalse"]))){
                                // the element is sliding out from the bottom side
                                this.options.leaving.call($this);
                                this.log("leaving");
                                this.options.leavingBottom.call($this);
                                this.log("leavingBottom");
                                this.setStatus("leavingBottom");
                            }

                            if(elTop>hsBottom && this.statusIsNot(["gonetrue","gonefalse"])){
                                // the element just went out from the bottom side
                                this.options.gone.call($this,isAbove);
                                this.log("gone");
                                this.setStatus("gone"+isAbove)
                            }
                        }
                    
                    }

                }


            this.previousTop=scroll_top;
        },

        log:function(msg){
            if(this.options.debugMode){
                console.log(msg)
            }
        },

        setStatus:function(status){
            this.lastFiredEvent=status;
        },

        getStatus:function(){
            return this.lastFiredEvent;
        },

        statusIsNot:function(modeArray){
            for(var mode in modeArray){
                if(this.lastFiredEvent==modeArray[mode]){
                    return false;
                }
            }
            return true;
        },

        statusIs:function(modeArray){
            for(var mode in modeArray){
                if(this.lastFiredEvent==modeArray[mode]){
                    return true;
                }
            }
            return false;
        }    

    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {

        return this.each(function () {

            var _plugin=$.data(this, "plugin_" + pluginName);

            if (!_plugin) {

                var tmpOptions = $.extend( {}, defaults, options);
                //showing the red line for visual feedback
                var HSL=$("<div/>")
                    .css({
                        display:tmpOptions.debugMode?"block":"none",
                        position:"fixed",
                        left:"0px",
                        width:"100%",
                        height:(tmpOptions.thickness||1) + "px",
                        top:tmpOptions.top,
                        "background-color":"rgba(255,0,0,0.6)",
                        "z-index":99999
                    })

                options.HSL=HSL.appendTo(document.body);                                
                $.data(this, "plugin_" + pluginName, new Plugin( this, options ));
            }else{
                var tmpOptions = $.extend( {}, _plugin.options, options);
                
                _plugin.options.HSL.css({
                    display:tmpOptions.debugMode?"block":"none",
                    height:(tmpOptions.thickness||1) + "px",
                    top:tmpOptions.top,                    
                })
                _plugin.options=$.extend({},_plugin.options,options);
            }
        });
    };

})( jQuery, window, document );