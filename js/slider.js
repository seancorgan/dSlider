var dSlider = function($container, slideDur,  fadeDur) { 

    this.$container    = $container; // slide container
    this.activeSlide   = 0;  
    this.slideDur      = slideDur;  // duration of the slider
    this.fadeDur       = fadeDur; // Fading Duration
    this.slideSelector = ".slide";  // slide elements
    this.$slides       = $($container).find(this.slideSelector); 
    this.totalSlides   = this.$slides.length; 

    this.init = function() { 
        this.$slides.eq(0).css('opacity', 1); // show first slide
        this.waitForNext(); 
    }; 
     
    this.waitForNext = function() { 
        this.slideTimer = setTimeout($.proxy(this.goToNextSlide, this),this.slideDur);
    }; 

    this.goToNextSlide = function() { 
        this.nextSlide = this.activeSlide + 1;
        // go back to beginning if we went through all the slides 
        if(this.nextSlide > this.totalSlides - 1){ 
            this.nextSlide = 0;
        }
        this.animateSlides(this.activeSlide, this.nextSlide);
    }; 

    this.animateSlides = function() { 
        this.$slides.eq(this.activeSlide).css('z-index', 3);
        this.$slides.eq(this.nextSlide).css({
            'z-index': 2,
            'opacity': 1
        });

        this.$slides.eq(this.activeSlide).animate({'opacity': 0}, this.fadeDur, function(){
           $(this).removeAttr('style');
        });

        this.activeSlide = this.nextSlide;
        this.waitForNext();
    }

    // initilize 
    this.init();
    
}

$(document).ready(function() { 
     var slider1 = new dSlider('.fader', 5000, 1000);     
}); 