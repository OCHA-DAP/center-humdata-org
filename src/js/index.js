$(document).ready(function(){   
  var controller = new ScrollMagic.Controller();   
  var scroll_start = 0;
  var stickyPos = 50;

  init();

  function init(){
    setNavPos($(this).scrollTop());
    setCounter();
    setGallery();



    //intro tween
    var introTween = new TimelineMax()
      .add(TweenMax.from($('#intro h1'), 0.5, {opacity:0, ease: Power1.easeOut}), 1)
      .add(TweenMax.from($('#intro .subtitle'), 1, {opacity:0, ease: Power1.easeOut}), 2)
      .add(TweenMax.from($('#intro p'), 1, {opacity:0, ease: Power1.easeOut}), 3)
      .add(TweenMax.from($('#intro #counter'), 1, {opacity:0, ease: Power1.easeOut}), 3);

    var introScene = new ScrollMagic.Scene({
      triggerHook: 'onEnter',
      triggerElement: '#intro'
    })
    .setTween(introTween)
    .addTo(controller);

    //focusareas parallax tween
    var focusTween = new TimelineMax()
      .add(TweenMax.from($('#focusareas #area-container1 .area'), 1, {marginTop:'+100px', ease: Power1.easeOut}), 0)
      .add(TweenMax.from($('#focusareas #area-container1 .area'), 1, {opacity:0, ease: Power1.easeOut}), 0);

    var focusScene = new ScrollMagic.Scene({
      triggerHook: 'onEnter',
      triggerElement: '#focusareas #area-container1'
    })
    .setTween(focusTween)
    .addTo(controller);

    var focusTween2 = new TimelineMax()
      .add(TweenMax.from($('#focusareas #area-container2 .area'), 1, {marginTop:'+100px', ease: Power1.easeNone}), 0)
      .add(TweenMax.from($('#focusareas #area-container2 .area'), 1, {opacity:0, ease: Power1.easeOut}), 0);

    var focusScene2 = new ScrollMagic.Scene({
      triggerHook: 'onEnter',
      triggerElement: '#focusareas #area-container2'
    })
    .setTween(focusTween2)
    .addTo(controller);



    // var timelineTween = new TimelineMax()
    //   .add(TweenMax.from($('.timeline-item .box'), 2, {opacity:0, ease: Power1.easeOut}), 0);

    // var timelineScene = new ScrollMagic.Scene({
    //   triggerHook: 'onEnter',
    //   triggerElement: '.timeline-item'
    // })
    // .setTween(timelineTween)
    // .addTo(controller);

  }

  //change nav display based on scroll position 
  function setNavPos(scroll_start){
    if(scroll_start > stickyPos) {
      $(".navbar-default").addClass('sticky');
    } else {
      $('.navbar-default').removeClass('sticky');
    }
  }

/////////////////////////
//
//  EVENT HANDLERS
//
/////////////////////////

  $(document).scroll(function() { 
    setNavPos($(this).scrollTop());
  });

  //page down
  $('#intro .fa-chevron-circle-down').on('click', function(){
    $('html, body').animate({
        scrollTop: $("#focusareas").offset().top+1
    }, 500);
  });



/////////////////////////
//
//  SECTION FUNCTIONS
//
/////////////////////////

  //set counter
  function setCounter(){
    var daysLeft = counter.countdown().toString().split('');
    for (var i=daysLeft.length-1; i>=0; i--){
      $('#counter').prepend('<span>'+daysLeft[i]+'</span>');
    }
  }

  function setGallery(){
    //set gallery content heights
    $('.quote-module').height($('.quote-module').width());
    $('.twitter-module').height($('.twitter-module').width());
  }

});


