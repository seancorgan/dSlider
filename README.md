# Dslider

This is a super simple Slider that I needed to use on some projects, where I needed some extra control. 

## How to use. 
1. Include Needed files 
```
<link rel="stylesheet" href="css/dSlider.css">
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<script src="js/dSlider.js"></script>
```

2. Build Markup
```
<div class="slider">
    <img class="slide" src="img/slide1bg.jpg" alt="">
    <img class="slide" src="img/slide5bg.jpg" alt="">

    <div class="dSlider_controls">
        <div class="dSlider-prev" data-target="prev" >Previous</div>
        <div class="dSlider-next" data-target="next" >Next</div>
        <ul class="pager_list"></ul>
    </div>
</div>
```

3. Call Slider 
```
$('.slider').dSlider();

```


## Options 
slideDur: 5000 - duration of the slider 
fadeDur: 800 - fading duration 
slideSelector - the slide element 

