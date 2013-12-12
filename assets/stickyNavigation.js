
(function(){
    var $body=$(document.body),
        supportsSticky=featureTest( 'position', 'sticky' ),
        topBar=$("#topBar"),
        topBarHeight=topBar.outerHeight(true),
        documentTitle=topBar.find(".documentTitle"),
        documentTitleSpan=documentTitle.find("span"),
        sectionTitle=topBar.find(".sectionTitle"),
        navigationTree=topBar.find(".navigationTree"),
        navigationTreeTitle=$(".jump-to-section__nav-title"),
        navTreeClone=$("<div id='navTreeClone' />")
            .css("top",topBarHeight)
            .appendTo(topBar);

        //setting the navigation-treeview click event handler
        navigationTree
            .find("button").click(toggleTOC);

        // $(".main-content").on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",function(e){
        //     $(this).
        // })


        fixNavHeight();
        // due to a known browser bug, resize event can fire more than once
        var resizeHnd=null;
        $(window).on("resize",function(){
            // fixing the navigation height on window resise
            if(resizeHnd){
                clearTimeout(resizeHnd);
            }
            resizeHnd=setTimeout(fixNavHeight,100);
        });




        //scroll-top button
        documentTitle.find("a").click(function(e){
            e.preventDefault();
            $("html,body").animate({"scrollTop":0},800);
        })

        // animating the scroll on menu click
        $("#sideNavigation").children("ul")
            .on("click","a",function(e){
                e.preventDefault();
                var $this=this,
                    targetTop=$(this.hash).offset().top-topBar.outerHeight(true);
                    //fixing the scroll-top issue (when sticky elements are employed in the page)
                
                $("html,body").animate({"scrollTop":targetTop},500);

            })
            .clone(true)
            .appendTo(navTreeClone);




    // toggling the document title
    var docTitleText=$(".document__title")
            .hotSpot({
                leave:function(isAbove){
                    documentTitle.toggleClass("show",isAbove)
                },
                enter:function(){
                    documentTitle.removeClass("show")
                },
                top:topBarHeight+13
            })
            .text();
    documentTitleSpan.text(docTitleText);





    var stickySection=$(".documentSection"),
        stickyHeader=stickySection.find("h2");

    if(!supportsSticky){
        //fixing the position:sticky
        stickyHeader.each(function(){
            var $this=$(this)
            // creating a clone as placeholder
            $this.clone().addClass("clone").insertAfter($this);
            $this.addClass("_fixed")
        })

        $(window).on("resize",function(){setFixedHeaderWidth()})

        function setFixedHeaderWidth(){
            stickySection.each(function(){
                var $this=$(this),
                    header=$this.find("._fixed");
                header.css("width",header.next(".clone").width())
            })
        }
        //calling it on page load
        setFixedHeaderWidth();
    }


    // adding border-bottom and grey shade to sections when they get sticky (also fixing position:sticky)
    stickySection.hotSpot({
        enter:function(){
            var h2=this.find("h2:first")
                .addClass("isSticky")

            if(!supportsSticky){
                h2.show()
            }
            // highlighting the current section on the nav menu
            navTreeClone.find("a[href='#" + this.attr("id") + "']").addClass("current")
        },
        leave:function(){
            var h2=this.find("h2:first")
                .removeClass("isSticky")

            if(!supportsSticky){
                h2.hide()
            }
            navTreeClone.find("a[href='#" + this.attr("id") + "']").removeClass("current")
        },
        top:topBarHeight+2,
        thickness:0
    })



    // showing the TOC button on the top bar
    $("#sideNavigation").hotSpot({
        enter:function(){
            navigationTree.removeClass("show");
            navigationTree.addClass("closed")
            $body.removeClass("showNavigation");
        },

        leave:function(isAbove){
            if(isAbove){
                navigationTree.addClass("show");
            }else{
                navigationTree.removeClass("show");
                navigationTree.addClass("closed")
                $body.removeClass("showNavigation");                
            }
        },
        top:topBarHeight+10
    })


    // helpers func.
    function toggleTOC(){
        navigationTree.toggleClass("closed");
        $body.toggleClass("showNavigation");
    }

    function fixNavHeight(){
        if(navTreeClone.outerHeight()>document.documentElement.clientHeight-topBarHeight){
            navTreeClone.height(document.documentElement.clientHeight-topBarHeight)        
        }else{
            navTreeClone.height("auto")
        }
    }

})();



  function featureTest( property, value, noPrefixes ) {
    // Thanks Modernizr! https://github.com/phistuck/Modernizr/commit/3fb7217f5f8274e2f11fe6cfeda7cfaf9948a1f5
    var prop = property + ':',
      el = document.createElement( 'test' ),
      mStyle = el.style;

    if( !noPrefixes ) {
      mStyle.cssText = prop + [ '-webkit-', '-moz-', '-ms-', '-o-', '' ].join( value + ';' + prop ) + value + ';';
    } else {
      mStyle.cssText = prop + value;
    }
    return mStyle[ property ].indexOf( value ) !== -1;
  }

