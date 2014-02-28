/** Author: Sean Corgan @seancorgan
/** 
 * A light weight Plugin to man handle sliders
 * @todo - ie8 does not support opacity, we need to do a show hide instead. 
 **/ 

(function( $ ) {
    $.fn.dSlider = function(options) {
 
        var settings = $.extend({
            slideDur: 5000, // duration of the slider 
            fadeDur: 800, // fading duration 
            animateHalfsDur: 2000,  
            slideSelector: ".slide"
        }, options );


        var dSlider = function(settings, $context) { 

            this.$container    = $($context); // Slide container
            this.activeSlide   = 0;  // current slide 
            this.$slides       = this.$container.find(settings.slideSelector); 
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

                this.css3check(); 
                this.transitionHalfsIn();
                this.waitForNext(); 
            };

            /**
             * Checks browser support for css3 transitions 
             * @return {string} if returns false there is no support.
             * Otherwise it will return the needed prefix, else a empty string if no prefix is needed. 
             */
            this.css3check = function() { 
                var prefixes = ["Webkit", "Moz", "O", "ms"];
                var el = this.$container[0];

                for (var i = 0; i < prefixes.length; i++){
                    if (prefixes[i] + "Transition" in el.style){
                            this.prefix = '-'+prefixes[i].toLowerCase()+'-';
                    };
                };
                this.prefix = "transition" in el.style ? "" : false;
            }

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
                this.sliderTimer = setTimeout($.proxy(this.goToNextSlide, this),settings.slideDur);
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

            this.setInitHalf = function() { 
                var $leftHalf = this.$slides.eq(this.nextSlide).find('.left-half img');
                var $rightHalf = this.$slides.eq(this.nextSlide).find('.right-half img');

                var animateLength = $leftHalf.width();; 

                $leftHalf.css({
                    'left': '-'+animateLength+'px'
                }); 

                $rightHalf.css({
                    'right': '-'+animateLength+'px'
                });
            };  

            /**
             * Fades slides in and out 
             */
            this.animateSlides = function() {
                // prevents changing slide while slider is fading. 
                if(this.fading || this.activeSlide == this.nextSlide) {
                    return false; 
                }

                this.setInitHalf(); 

                if(this.prefix || this.prefix === "") { 
                    this.css3animate(); 
                } else { 
                    
                    this.$slides.eq(this.nextSlide).css({
                            'z-index': 2,
                            'opacity': 1
                    }); 
                    this.fading = true; 
                    this.$slides.eq(this.activeSlide).css('z-index', 3);

                    $slides.eq(this.nextSlide).css({
                            'z-index': 2,
                            'opacity': 1
                        });

                    this.$slides.eq(this.activeSlide).animate({'opacity': 0}, settings.fadeDur, $.proxy(this.finishTransition, this));
                }
            }

            this.transitionHalfsIn = function() { 

                var $leftHalf = this.$slides.eq(this.activeSlide).find('.left-half img');
                var $rightHalf = this.$slides.eq(this.activeSlide).find('.right-half img');

                var animateLength = $leftHalf.width(); 
             
                if(this.prefix || this.prefix === "") { 

                    var leftStyles = {};
                    leftStyles[this.prefix+'transition'] = 'all '+settings.animateHalfsDur+'ms ease-in-out';
                    leftStyles[this.prefix+'transform'] = 'translate('+animateLength+'px,0)';

                    var rightStyles = {};
                    rightStyles[this.prefix+'transition'] = 'all '+settings.animateHalfsDur+'ms ease-in-out';
                    rightStyles[this.prefix+'transform'] = 'translate(-'+animateLength+'px,0)';

                    $leftHalf.css(leftStyles);
                    $rightHalf.css(rightStyles);

                } else { 

                    $leftHalf.animate({
                        left: 0 
                    }, 
                    {
                        duration : settings.animateHalfsDur, 
                        easing : 'swing'
                    });


                    $rightHalf.animate({
                        right: 0 
                    }, 
                    {
                        duration : settings.animateHalfsDur, 
                        easing : 'swing', 
                        done: function() { 
                            console.log('complete');
                        } 
                    });
                }                 
            }; 


            /**
             * Execute after the slide has complted its transition. 
             */
            this.finishTransition = function() {
                this.$slides.eq(this.activeSlide).removeAttr('style');

                this.$slides.eq(this.activeSlide).find('.left-half img').removeAttr('style');
                this.$slides.eq(this.activeSlide).find('.right-half img').removeAttr('style');

                this.activeSlide = this.nextSlide;
                this.transitionHalfsIn();
                this.fading = false;
                this.$page.removeClass('active').eq(this.nextSlide).addClass('active');
                this.waitForNext();
            }; 

            /**
             * css3 specific animation
             */
            this.css3animate = function() { 
                this.$slides.eq(this.activeSlide).css('z-index', 3);
                this.$slides.eq(this.nextSlide).css({
                                'z-index': 2,
                                'opacity': 1
                            });

                var styles = {};
                styles[this.prefix+'transition'] = 'opacity '+settings.fadeDur+'ms ease-in-out';
                styles.opacity = 0;
                
                this.$slides.eq(this.activeSlide).css(styles);
                this.fading = true;

                // now wait for animation to end
                var fadeTimer = setTimeout($.proxy(this.finishTransition, this),settings.fadeDur);
            }

            // initilize 
            this.init();    
        }

        return this.each(function() {
            new dSlider(settings, this);  
        });
 
    };
 
}( jQuery ));