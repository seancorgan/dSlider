var dSlider = function($container, slideDur,  fadeDur) { 

    this.$container    = $($container); // Slide container
    this.activeSlide   = 0;  // current slide 
    this.slideDur      = slideDur;  // Duration of the slider
    this.fadeDur       = fadeDur; // Fading Duration
    this.slideSelector = ".slide";  // Slide elements
    this.$slides       = this.$container.find(this.slideSelector); 
    this.totalSlides   = this.$slides.length;  

    /**
     * call when object is instantiated 
     */
    this.init = function() { 
        this.$slides.eq(0).css('opacity', 1); // show first slide
        
        this.buildPager(); 
        // events 
        $('.dSlider-next').on('click', $.proxy(this.goToNextSlide, this));
        $('.dSlider-prev').on('click', $.proxy(this.goToPrevSlide, this));
        $('.dSlider-page').on('click', $.proxy(this.goToSlide, this)); 

        this.waitForNext(); 
    };
    /**
     * Builds previous and next buttons
     */
    this.buildPager = function() {
        this.$pagerList = this.$container.find('.pager_list');
        for(var i = 0; i < this.totalSlides; i++){
            this.$pagerList.append('<li class="dSlider-page" data-target="'+i+'">'+i+'</li>'); 
        };
        this.$page = $(this.$pagerList).children('.dSlider-page'); 
        this.$page.eq(0).addClass('active');
    } 
    
    /**
     * Sets the timer for slides to transition. 
     */
    this.waitForNext = function() { 
        this.sliderTimer = setTimeout($.proxy(this.goToNextSlide, this),this.slideDur);
    }; 

    /**
     * Go to next slide 
     */
    this.goToNextSlide = function() { 
        this.nextSlide = this.activeSlide + 1;
        // go back to beginning if we went through all the slides 
        if(this.nextSlide > this.totalSlides - 1){ 
            this.nextSlide = 0;
        }

        clearTimeout(this.sliderTimer); 
        this.animateSlides();
    }; 

    /**
     * Go to the previous Slide
     */
    this.goToPrevSlide = function() { 
        this.nextSlide = this.activeSlide - 1;
        // go to last slide if we are on the first slide. 
        if(this.nextSlide < 0 ){ 
            this.nextSlide = this.totalSlides -1;
        }
        clearTimeout(this.sliderTimer); 
        this.animateSlides();
    };

    /**
     * Go to a specific slide
     * @param  {object} event the event object passed from the click @event
     * @todo - Should be able to pass in a int or an event 
     */
    this.goToSlide = function(event) { 
        this.nextSlide = $(event.currentTarget).data('target');
        clearTimeout(this.sliderTimer);
        this.animateSlides(); 
    } 

    /**
     * Fades slides in and out 
     */
    this.animateSlides = function() {
        if(this.fading || this.activeSlide == this.nextSlide) {
            return false; 
        }

        this.fading = true; 
        this.$slides.eq(this.activeSlide).css('z-index', 3);
        this.$slides.eq(this.nextSlide).css({
            'z-index': 2,
            'opacity': 1
        });
        
        this.$slides.eq(this.activeSlide).animate({'opacity': 0}, this.fadeDur, $.proxy(function () {
            this.activeSlide = this.nextSlide;
            this.fading = false;
            this.waitForNext();
            this.$page.removeClass('active').eq(this.nextSlide).addClass('active');
        }, this));
    }

    // initilize 
    this.init();    
}

$(document).ready(function() { 
     var slider1 = new dSlider('.fader', 5000, 1000);     
}); 