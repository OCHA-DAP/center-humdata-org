$(document).ready(function(){   
  var controller = new ScrollMagic.Controller();   
  var scroll_start = 0;
  var stickyPos = 50;
  var quoteArray = [];
  var quoteID = 0;
  var quoteIntervalDelay = 5000;
  var tweetArray = [];
  var tweetID = 0;
  var tweetIntervalDelay = 5000;
  var photoReferenceArray = [];
  var photoIDArray = [];
  var photoIntervalDelay = 5000;

  init();

  function init(){
    data.getData('data/timeline.json', 'timelineReady');
    data.getData('data/quotes.json', 'quoteReady');
    data.getData('data/tweets.json', 'tweetReady');
    
    setNavPos($(this).scrollTop());
    setCounter();
    setGallery();

    setHandlers();
    setTweens();
  }

  //change nav display based on scroll position 
  function setNavPos(scroll_start){
    if(scroll_start > stickyPos) {
      $('.navbar-default').addClass('sticky');
    } else {
      $('.navbar-default').removeClass('sticky');
    }
  }

  function setTweens(){
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

    //focusareas tween
    $('#focusareas .area').each(function(){
      var elem = '#'+$(this).attr('id');
      var focusScene = new ScrollMagic.Scene({
        triggerHook: 'onEnter',
        triggerElement: elem
      })
      .setTween( TweenMax.from($(elem), 1, {top:'+100px', opacity: 0, ease: Power1.easeOut}) )
      .addTo(controller);
    });
  }

  function goToByScroll(element){
    $('html, body').animate({scrollTop: element.offset().top}, 800);
  }


/////////////////////////
//
//  DATA READY HANDLERS
//
/////////////////////////

  //build timeline display
  $(document).on( 'timelineReady', function(e, data) {
    var count = 0;
    $.each( data.timeline.years, function( key, val ) {
      $('.timeline-chart').append('<div class="date-flag">'+val.year+'</div>');
      var now = new Date();
      var isFuture = (val.year > now.getFullYear()) ? true : false;
      var events = val.events;
      for (var i=0; i < events.length; i++){
        var trackType = (isFuture) ? 'dashed' : '';
        var position = (i==events.length-1 && isFuture) ? 'last' : '';
        var timelineItem = 'timelineItem'+count;
        count++;
        $('.timeline-chart').append('<div id="'+timelineItem+'" class="timeline-item '+position+'"><div class="track '+trackType+'"></div><div class="box"><h6>'+events[i].date+'</h6><h4>'+events[i].header+'</h4>'+events[i].copy+'</div></div>');

        //timeline item parallax tween
        var timelineItemScene = new ScrollMagic.Scene({
            triggerHook: 'onEnter',
            triggerElement: '#'+timelineItem
          })
          .on('start', function(e){
            $(this.triggerElement()).find('.box').removeClass('dot');
          })
          .setTween( TweenMax.from($('#'+timelineItem).find('.box'), 0.5, {opacity:0, marginLeft:'+50px', ease: Power1.easeOut, onCompleteParams: [$('#'+timelineItem)], onComplete:function(item){
            $(item).find('.box').addClass('dot');
          }}) )
          .addTo(controller);
      }
    });
  });

  //build quote display
  $(document).on( 'quoteReady', function(e, data) {
    quoteArray = data.quotes;
    quoteID = util.getRandomID(0, quoteArray.length-1);
    getQuote();
    var quoteInterval = setInterval(function(){ 
      $.when($('.quote > *').animate({
        'opacity': '0'
      }, 750)).done(function(){
        getQuote(); 
        $('.quote > *').animate({
          'opacity': '1'
        }, 750)
      });
    }, quoteIntervalDelay);
  });

  //build tweet display
  $(document).on( 'tweetReady', function(e, data) {
    tweetArray = data.tweets;
    tweetID = util.getRandomID(0, tweetArray.length-1);
    getTweet();
    var tweetInterval = setInterval(function(){ 
      $.when($('.twitter > *').animate({
        'opacity': '0',
        'marginTop': '+40px'
      }, 750)).done(function(){
        getTweet(); 
        $('.twitter > *').css('marginTop', '-40px');
        $('.twitter > *').animate({
          'opacity': '1',
          'marginTop': '0'
        }, 600)
      });
    }, tweetIntervalDelay);
  });

  function getQuote(){
    var val = quoteArray[quoteID];
    quoteID = (quoteID==quoteArray.length-1) ? 0 : quoteID+1;
    $('.quote .organization').text(val.organization);
    $('.quote .quote-text').text(val.quote);
    $('.quote .author').text('- '+val.author);
  }

  function getTweet(){
    var val = tweetArray[tweetID];
    tweetID = (tweetID==tweetArray.length-1) ? 0 : tweetID+1;
    $('.twitter .tweet').html('<a href=\"'+val.url+'\" target=\"_blank\">'+val.tweet+'</a>');
    $('.twitter .signature span').html('<a href=\"http://twitter.com/'+val.handle+'\" target=\"_blank\">'+val.handle+'</a>');
  }

// $(document).on( 'faqReady', function(e, data) {
//   console.log('faqReady');
//   var faqData = data.faq;
//   console.log(faqData);
//   //Get the HTML from the template   in the script tag​
//   var theTemplateScript = $("#faq-template").html(); 

//  //Compile the template​
//   var theTemplate = Handlebars.compile (theTemplateScript); 
//   $(".faqList").append (theTemplate(faqData)); 
// });

/////////////////////////
//
//  EVENT HANDLERS
//
/////////////////////////

  $(document).scroll(function(){ 
    setNavPos($(this).scrollTop());
  });

  $(document).resize(function(){
    setGalleryHeight();
  });

  function setHandlers(){
    //nav items
    $('.nav a').on('click', function(e){
      var section = $(this).attr('data-section');
      goToByScroll($('#'+section));
    });

    $('.navbar-toggle').on('click', function(){
      $(this).toggleClass('expanded');
    });

    //page down
    $('#intro .fa-chevron-circle-down').on('click', function(){
      $('html, body').animate({
          scrollTop: $("#focusareas").offset().top+1
      }, 500);
    });

    //gallery video playpause btn
    $('#gallery .playpause-btn').on('click', function(e){
      var vid = $(this).parent().find('video')["0"];

      //video autplays on mute, first time pressing play unmutes and plays the video from the beginning
      if (vid.muted){ 
        if (!vid.paused){
          vid.muted = false;
          vid.currentTime = 0;
          vid.play(); 
          $(this).addClass('pause');
        }
      }
      else{
        if (vid.paused){
          vid.play(); 
          $(this).addClass('pause');
        }
        else{
          vid.pause(); 
          $(this).removeClass('pause');
        }
      }
    });
  }



/////////////////////////
//
//  SECTION FUNCTIONS
//
/////////////////////////

  //set days left counter
  function setCounter(){
    var daysLeft = counter.countdown().toString().split('');
    for (var i=daysLeft.length-1; i>=0; i--){
      $('#counter').prepend('<div>'+daysLeft[i]+'</div>');
    }
  }

  function setGallery(){
    //reset video if on mobile
    if (util.isMobile()){
      var video = $('#gallery video')['0'];
      video.muted = false;
      video.autoplay = false;
      video.loop = false;
    }

    setGalleryPhotos();
    setGalleryHeight();
  }

  //set gallery content heights
  function setGalleryHeight(){
    $('.quote').height(Math.round($('.quote').width()));
    $('.twitter').height(Math.round($('.twitter').width()));
    $('.video').height(Math.round($('.video').width()));
  }

  //select gallery photos randomly
  function setGalleryPhotos(){
    //create array of all available photo ids
    photoIDArray = createPhotoIDArray();

    //set gallery photos
    $('#gallery .photo').each(function(e){
      var id = util.getRandomVal(photoIDArray);
      photoIDArray = util.removeFromArray(id, photoIDArray);
      $(this).find('img').attr('src','assets/img/gallery/'+id+'.png').attr('id',id).fadeIn('slow');
    });

    //refresh gallery photos on an interval
    var photoInterval = setInterval(function(){ 
      //keep record of which photos have been updated, restore references once all photos have been cycled through 
      if (photoReferenceArray.length==0) photoReferenceArray = $('#gallery .photo');
      var newPhoto = util.getRandomVal(photoReferenceArray);
      photoReferenceArray = util.removeFromArray(newPhoto, photoReferenceArray);

      //get record of all current photo ids and add them to a restricted array
      var currPhotos = $('#gallery .photo img');
      var restricted = [];
      for (var i=0;i<currPhotos.length;i++){
        restricted.push(Number($(currPhotos[i]).attr('id')));
      }

      //get new random photo that is not currently displayed
      function getRand() {
        var rand;
        do { 
            rand = Number(util.getRandomVal(photoIDArray));
        } while ($.inArray(rand, restricted) > -1);
        return rand;
      }
      var newID = getRand();

      //switch photo
      $.when($(newPhoto).find('img').animate({
        'opacity': '0'
      }, 500)).done(function(){
        $(newPhoto).find('img').attr('src','assets/img/gallery/'+newID+'.png').attr('id',newID);
        $(newPhoto).find('img').animate({
          'opacity': '1'
        }, 500)
      });
    }, photoIntervalDelay);
  }

  function createPhotoIDArray(){
    var numPhotos = 30;
    var array = [];
    for (var i=1;i<=numPhotos;i++){
      array.push(i);
    }
    return array;
  }


});


