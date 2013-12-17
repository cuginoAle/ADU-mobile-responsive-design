

;(function(){

    
    var $body=$(document.body),
        topBar=$("#topBar>.content"),
        topBarCellHeight=null;

    //  topBar cells structure:
    //  ----------------------------
    //  | a | b                | c |
    //  ----------------------------
    window.topBarHandler={
        cells:{
            a:new cell("cell_a",topBar),
            b:new cell("cell_b",topBar),
            c:new cell("cell_c",topBar)
        }
    }

    // cell object class
    function cell(className,parent){
        var that=this;
        this.$el=$("<div/>")
                    .addClass("topBar__cell " + className)
                    .appendTo(parent);

        this.addItem=function(item){
            var $item=$(item)
                        .addClass("cellItem")
                        .css("transform","translate3d(0,"+ topBarCellHeight +"px,0)");
                that.$el.append($item);

            return {
                show:function(){
                    var topBarCellHeight=topBar.outerHeight(true);
                    $item
                        .css("transform","translate3d(0,0,0)")
                        .addClass("show")
                        .siblings(".cellItem")
                            .removeClass("show")
                            .css("transform","translate3d(0,"+ topBarCellHeight +"px,0)")
                },
                hide:function(){
                    var topBarCellHeight=topBar.outerHeight(true);
                    $item
                        .css("transform","translate3d(0,"+ topBarCellHeight +"px,0)")
                        .removeClass("show")
                },
                $el:$item           
            }
        }      
    }

    var properties = [
            'transform',
            'WebkitTransform',
            'msTransform',
            'MozTransform',
            'OTransform'
        ];
})()