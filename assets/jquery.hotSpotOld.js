;(function ( $, window, document, undefined ) {

    // Create the defaults once
    var pluginName = "hotSpot",
        defaults = {
            enter:$.noop,
            leave:$.noop,
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

        this.init();
    }

    Plugin.prototype = {

        init: function() {
            var that=this;


            //showing the red line for visual feedback
            if(this.options.debugMode){
                $("<div/>")
                    .css({
                        position:"fixed",
                        left:"0px",
                        width:"100%",
                        height:(this.options.thickness||1) + "px",
                        top:this.options.top,
                        "background-color":"rgba(255,0,0,0.6)",
                        "z-index":99999
                    })
                    .appendTo(document.body)
            }             

            $(window).scroll(function(){
                that.hotSpotCheck(that.element);
            });

            // running the function on windows load
            $(window).load(
                function(){
                    that.hotSpotCheck(that.element);
                }
            )
            
        },


        hotSpotCheck: function(element){
            var scroll_top = $(window).scrollTop() // our current vertical position from the top

            var $this=$(element),
                that=this,
                offset_top = $this.offset().top,
                height=$this.height();
            if(offset_top<(scroll_top + this.options.top + this.options.thickness) && (offset_top+height)>(scroll_top + this.options.top) ){
                if(this.lastFiredEvent!="enter"){
                    // adding a little delay to avoid "leave" beaing called after "enter"
                    setTimeout(function(){
                        that.options.enter.call($this);
                    },20)
                    this.lastFiredEvent="enter";    
                }
            }else{

                var isAbove=offset_top<(scroll_top + this.options.top + this.options.thickness);
                if(this.lastFiredEvent!="leave_" + isAbove?"above":"below"){
                    this.options.leave.call($this,isAbove);
                    this.lastFiredEvent="leave_"+ isAbove?"above":"below";   
                }                
            }

        }

    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
     
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );