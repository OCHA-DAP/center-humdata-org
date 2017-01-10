(function() {
	var counter = window.counter = {
		TARGETDATE: new Date('March 29, 2017'),

		countdown: function(){
			var today = new Date();
			var oneDay = 24*60*60*1000;
			var daysLeft = Math.round(Math.abs((counter.TARGETDATE.getTime() - today.getTime())/(oneDay)));
			return daysLeft;
		}
	}
})();
(function() {
	var data = window.data = {

		getData: function(url, callback){
			$.getJSON( url, function( d ) {
				$(document).trigger(callback ,d);
			});
		}
	};
})();
$(document).ready(function(){   
  var controller = new ScrollMagic.Controller();   
  var scroll_start = 0;
  var stickyPos = 50;
  var quoteArray = [];
  var quoteID = 0;
  var tweetArray = [];
  var tweetID = 0;
  var textIntervalDelay = 5000;
  var photoReferenceArray = [];
  var photoIDArray = [];
  var photoIntervalDelay = 5000;
  var refreshMode = 'quote';

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

    pJS.particles.nb = 0;
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
      .add(TweenMax.to($('#intro h1'), 0.5, {opacity:1, ease: Power1.easeOut}), 1)
      .add(TweenMax.to($('#intro .subtitle'), 1, {opacity:1, ease: Power1.easeOut}), 2)
      .add(TweenMax.to($('#intro p'), 1, {opacity:1, ease: Power1.easeOut}), 3)
      .add(TweenMax.to($('#intro #counter'), 1, {opacity:1, ease: Power1.easeOut}), 3);

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
      var events = val.events;
      for (var i=0; i < events.length; i++){
        var eventDate = new Date(events[i].date);
        var trackType = (eventDate.getTime()>now.getTime()) ? 'dashed' : '';
        var position = (i==events.length-1 && isCurrent) ? 'last' : '';
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
  });

  //build tweet display
  $(document).on( 'tweetReady', function(e, data) {
    tweetArray = data.tweets;
    tweetID = util.getRandomID(0, tweetArray.length-1);
    getTweet();
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


/////////////////////////
//
//  EVENT HANDLERS
//
/////////////////////////

  $(document).scroll(function(){ 
    setNavPos($(this).scrollTop());
  });

  $(window).resize(function(){
    setGalleryHeight();
  });

  function setHandlers(){
    //nav items
    $('.nav a').on('click', function(e){
      var section = $(this).attr('data-section');
      goToByScroll($('#'+section));

      if (util.isMobile()){
        $('.navbar-toggle').click();
      }
    });

    //mobile navbar toggle 
    $('.navbar-toggle').on('click', function(){
      $(this).toggleClass('expanded');
      $('.navbar-default').toggleClass('expanded');
    });

    //page down
    $('#intro .arrow-down').on('click', function(){
      $('html, body').animate({
          scrollTop: $("#focusareas").offset().top+1
      }, 500);
    });

    //mailing list
    $('#mailing-list').on('click', function(e){
      var section = $(this).attr('data-section');
      goToByScroll($('#'+section));
    });

    //gallery video playpause btn
    $('#gallery .playpause-btn').on('click', function(e){
      var vid = $(this).parent().find('video')["0"];

      //video autplays on mute, first time pressing play unmutes and plays the video from the beginning
      if (vid.muted && $(this).parent().hasClass('preview')){ 
        $(this).parent().removeClass('preview');
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
      video.controls = true;
      $('#gallery .video').removeClass('preview');
    }

    //start text refresh interval
    var textInterval = setInterval(function(){ 
      if (refreshMode=='quote'){
        $.when($('.quote > *').animate({
          'opacity': '0'
        }, 750)).done(function(){
          getQuote(); 
          $('.quote > *').animate({
            'opacity': '1'
          }, 750)
        });
      }
      else{
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
      }
      refreshMode = (refreshMode=='quote') ? 'tweet' : 'quote';
    }, textIntervalDelay);


    setGalleryPhotos();
    setGalleryHeight();
  }

  //set gallery content heights
  function setGalleryHeight(){
    $('.quote').height(Math.floor($('.quote').width()));
    $('.twitter').height(Math.floor($('.twitter').width()));
    $('.video').height(Math.floor($('.video').width()));
  }

  function preloadImages() {
    var img;
    var remaining = photoIDArray.length;
    for (var i=0; i<photoIDArray.length; i++) {
      img = new Image();
      img.onload = function() {
          --remaining;
          if (remaining <= 0) {
              galleryLoaded();
          }
      };
      img.src = 'assets/img/gallery/'+photoIDArray[i]+'.png';
    }
  }

  function galleryLoaded(){
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

  //select gallery photos randomly
  function setGalleryPhotos(){
    //create array of all available photo ids
    photoIDArray = createPhotoIDArray();
    preloadImages();

    //set gallery photos
    $('#gallery .photo').each(function(e){
      var id = util.getRandomVal(photoIDArray);
      photoIDArray = util.removeFromArray(id, photoIDArray);
      $(this).find('img').attr('src','assets/img/gallery/'+id+'.png').attr('id',id).fadeIn('slow');
    });

  }

  function createPhotoIDArray(){
    var numPhotos = 31;
    var array = [];
    for (var i=1;i<numPhotos;i++){
      array.push(i);
    }
    return array;
  }


});



/* -----------------------------------------------
/* Author : Vincent Garreau  - vincentgarreau.com
/* MIT license: http://opensource.org/licenses/MIT
/* GitHub : https://github.com/VincentGarreau/particles.js
/* How to use? : Check the GitHub README
/* v1.0.3
/* ----------------------------------------------- */
function launchParticlesJS(a,e){var i=document.querySelector("#"+a+" > canvas");pJS={canvas:{el:i,w:i.offsetWidth,h:i.offsetHeight},particles:{color:"#fff",shape:"circle",opacity:1,size:2.5,size_random:true,nb:200,line_linked:{enable_auto:true,distance:100,color:"#fff",opacity:1,width:1,condensed_mode:{enable:true,rotateX:65000,rotateY:65000}},anim:{enable:true,speed:1},array:[]},interactivity:{enable:true,mouse:{distance:100},detect_on:"canvas",mode:"grab",line_linked:{opacity:1},events:{onclick:{enable:true,mode:"push",nb:4}}},retina_detect:false,fn:{vendors:{interactivity:{}}}};if(e){if(e.particles){var b=e.particles;if(b.color){pJS.particles.color=b.color}if(b.shape){pJS.particles.shape=b.shape}if(b.opacity){pJS.particles.opacity=b.opacity}if(b.size){pJS.particles.size=b.size}if(b.size_random==false){pJS.particles.size_random=b.size_random}if(b.nb){pJS.particles.nb=b.nb}if(b.line_linked){var j=b.line_linked;if(j.enable_auto==false){pJS.particles.line_linked.enable_auto=j.enable_auto}if(j.distance){pJS.particles.line_linked.distance=j.distance}if(j.color){pJS.particles.line_linked.color=j.color}if(j.opacity){pJS.particles.line_linked.opacity=j.opacity}if(j.width){pJS.particles.line_linked.width=j.width}if(j.condensed_mode){var g=j.condensed_mode;if(g.enable==false){pJS.particles.line_linked.condensed_mode.enable=g.enable}if(g.rotateX){pJS.particles.line_linked.condensed_mode.rotateX=g.rotateX}if(g.rotateY){pJS.particles.line_linked.condensed_mode.rotateY=g.rotateY}}}if(b.anim){var k=b.anim;if(k.enable==false){pJS.particles.anim.enable=k.enable}if(k.speed){pJS.particles.anim.speed=k.speed}}}if(e.interactivity){var c=e.interactivity;if(c.enable==false){pJS.interactivity.enable=c.enable}if(c.mouse){if(c.mouse.distance){pJS.interactivity.mouse.distance=c.mouse.distance}}if(c.detect_on){pJS.interactivity.detect_on=c.detect_on}if(c.mode){pJS.interactivity.mode=c.mode}if(c.line_linked){if(c.line_linked.opacity){pJS.interactivity.line_linked.opacity=c.line_linked.opacity}}if(c.events){var d=c.events;if(d.onclick){var h=d.onclick;if(h.enable==false){pJS.interactivity.events.onclick.enable=false}if(h.mode!="push"){pJS.interactivity.events.onclick.mode=h.mode}if(h.nb){pJS.interactivity.events.onclick.nb=h.nb}}}}pJS.retina_detect=e.retina_detect}pJS.particles.color_rgb=hexToRgb(pJS.particles.color);pJS.particles.line_linked.color_rgb_line=hexToRgb(pJS.particles.line_linked.color);if(pJS.retina_detect&&window.devicePixelRatio>1){pJS.retina=true;pJS.canvas.pxratio=window.devicePixelRatio;pJS.canvas.w=pJS.canvas.el.offsetWidth*pJS.canvas.pxratio;pJS.canvas.h=pJS.canvas.el.offsetHeight*pJS.canvas.pxratio;pJS.particles.anim.speed=pJS.particles.anim.speed*pJS.canvas.pxratio;pJS.particles.line_linked.distance=pJS.particles.line_linked.distance*pJS.canvas.pxratio;pJS.particles.line_linked.width=pJS.particles.line_linked.width*pJS.canvas.pxratio;pJS.interactivity.mouse.distance=pJS.interactivity.mouse.distance*pJS.canvas.pxratio}pJS.fn.canvasInit=function(){pJS.canvas.ctx=pJS.canvas.el.getContext("2d")};pJS.fn.canvasSize=function(){pJS.canvas.el.width=pJS.canvas.w;pJS.canvas.el.height=pJS.canvas.h;window.onresize=function(){if(pJS){pJS.canvas.w=pJS.canvas.el.offsetWidth;pJS.canvas.h=pJS.canvas.el.offsetHeight;if(pJS.retina){pJS.canvas.w*=pJS.canvas.pxratio;pJS.canvas.h*=pJS.canvas.pxratio}pJS.canvas.el.width=pJS.canvas.w;pJS.canvas.el.height=pJS.canvas.h;pJS.fn.canvasPaint();if(!pJS.particles.anim.enable){pJS.fn.particlesRemove();pJS.fn.canvasRemove();f()}}}};pJS.fn.canvasPaint=function(){pJS.canvas.ctx.fillRect(0,0,pJS.canvas.w,pJS.canvas.h)};pJS.fn.canvasRemove=function(){pJS.canvas.ctx.clearRect(0,0,pJS.canvas.w,pJS.canvas.h)};pJS.fn.particle=function(n,o,m){this.x=m?m.x:Math.random()*pJS.canvas.w;this.y=m?m.y:Math.random()*pJS.canvas.h;this.radius=(pJS.particles.size_random?Math.random():1)*pJS.particles.size;if(pJS.retina){this.radius*=pJS.canvas.pxratio}this.color=n;this.opacity=o;this.vx=-0.5+Math.random();this.vy=-0.5+Math.random();this.draw=function(){pJS.canvas.ctx.fillStyle="rgba("+this.color.r+","+this.color.g+","+this.color.b+","+this.opacity+")";pJS.canvas.ctx.beginPath();switch(pJS.particles.shape){case"circle":pJS.canvas.ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);break;case"edge":pJS.canvas.ctx.rect(this.x,this.y,this.radius*2,this.radius*2);break;case"triangle":pJS.canvas.ctx.moveTo(this.x,this.y-this.radius);pJS.canvas.ctx.lineTo(this.x+this.radius,this.y+this.radius);pJS.canvas.ctx.lineTo(this.x-this.radius,this.y+this.radius);pJS.canvas.ctx.closePath();break}pJS.canvas.ctx.fill()}};pJS.fn.particlesCreate=function(){for(var m=0;m<pJS.particles.nb;m++){pJS.particles.array.push(new pJS.fn.particle(pJS.particles.color_rgb,pJS.particles.opacity))}};pJS.fn.particlesAnimate=function(){for(var n=0;n<pJS.particles.array.length;n++){var q=pJS.particles.array[n];q.x+=q.vx*(pJS.particles.anim.speed/2);q.y+=q.vy*(pJS.particles.anim.speed/2);if(q.x-q.radius>pJS.canvas.w){q.x=q.radius}else{if(q.x+q.radius<0){q.x=pJS.canvas.w+q.radius}}if(q.y-q.radius>pJS.canvas.h){q.y=q.radius}else{if(q.y+q.radius<0){q.y=pJS.canvas.h+q.radius}}for(var m=n+1;m<pJS.particles.array.length;m++){var o=pJS.particles.array[m];if(pJS.particles.line_linked.enable_auto){pJS.fn.vendors.distanceParticles(q,o)}if(pJS.interactivity.enable){switch(pJS.interactivity.mode){case"grab":pJS.fn.vendors.interactivity.grabParticles(q,o);break}}}}};pJS.fn.particlesDraw=function(){pJS.canvas.ctx.clearRect(0,0,pJS.canvas.w,pJS.canvas.h);pJS.fn.particlesAnimate();for(var m=0;m<pJS.particles.array.length;m++){var n=pJS.particles.array[m];n.draw("rgba("+n.color.r+","+n.color.g+","+n.color.b+","+n.opacity+")")}};pJS.fn.particlesRemove=function(){pJS.particles.array=[]};pJS.fn.vendors.distanceParticles=function(t,r){var o=t.x-r.x,n=t.y-r.y,s=Math.sqrt(o*o+n*n);if(s<=pJS.particles.line_linked.distance){var m=pJS.particles.line_linked.color_rgb_line;pJS.canvas.ctx.beginPath();pJS.canvas.ctx.strokeStyle="rgba("+m.r+","+m.g+","+m.b+","+(pJS.particles.line_linked.opacity-s/pJS.particles.line_linked.distance)+")";pJS.canvas.ctx.moveTo(t.x,t.y);pJS.canvas.ctx.lineTo(r.x,r.y);pJS.canvas.ctx.lineWidth=pJS.particles.line_linked.width;pJS.canvas.ctx.stroke();pJS.canvas.ctx.closePath();if(pJS.particles.line_linked.condensed_mode.enable){var o=t.x-r.x,n=t.y-r.y,q=o/(pJS.particles.line_linked.condensed_mode.rotateX*1000),p=n/(pJS.particles.line_linked.condensed_mode.rotateY*1000);r.vx+=q;r.vy+=p}}};pJS.fn.vendors.interactivity.listeners=function(){if(pJS.interactivity.detect_on=="window"){var m=window}else{var m=pJS.canvas.el}m.onmousemove=function(p){if(m==window){var o=p.clientX,n=p.clientY}else{var o=p.offsetX||p.clientX,n=p.offsetY||p.clientY}if(pJS){pJS.interactivity.mouse.pos_x=o;pJS.interactivity.mouse.pos_y=n;if(pJS.retina){pJS.interactivity.mouse.pos_x*=pJS.canvas.pxratio;pJS.interactivity.mouse.pos_y*=pJS.canvas.pxratio}pJS.interactivity.status="mousemove"}};m.onmouseleave=function(n){if(pJS){pJS.interactivity.mouse.pos_x=0;pJS.interactivity.mouse.pos_y=0;pJS.interactivity.status="mouseleave"}};if(pJS.interactivity.events.onclick.enable){switch(pJS.interactivity.events.onclick.mode){case"push":m.onclick=function(o){if(pJS){for(var n=0;n<pJS.interactivity.events.onclick.nb;n++){pJS.particles.array.push(new pJS.fn.particle(pJS.particles.color_rgb,pJS.particles.opacity,{x:pJS.interactivity.mouse.pos_x,y:pJS.interactivity.mouse.pos_y}))}}};break;case"remove":m.onclick=function(n){pJS.particles.array.splice(0,pJS.interactivity.events.onclick.nb)};break}}};pJS.fn.vendors.interactivity.grabParticles=function(r,q){var u=r.x-q.x,s=r.y-q.y,p=Math.sqrt(u*u+s*s);var t=r.x-pJS.interactivity.mouse.pos_x,n=r.y-pJS.interactivity.mouse.pos_y,o=Math.sqrt(t*t+n*n);if(p<=pJS.particles.line_linked.distance&&o<=pJS.interactivity.mouse.distance&&pJS.interactivity.status=="mousemove"){var m=pJS.particles.line_linked.color_rgb_line;pJS.canvas.ctx.beginPath();pJS.canvas.ctx.strokeStyle="rgba("+m.r+","+m.g+","+m.b+","+(pJS.interactivity.line_linked.opacity-o/pJS.interactivity.mouse.distance)+")";pJS.canvas.ctx.moveTo(r.x,r.y);pJS.canvas.ctx.lineTo(pJS.interactivity.mouse.pos_x,pJS.interactivity.mouse.pos_y);pJS.canvas.ctx.lineWidth=pJS.particles.line_linked.width;pJS.canvas.ctx.stroke();pJS.canvas.ctx.closePath()}};pJS.fn.vendors.destroy=function(){cancelAnimationFrame(pJS.fn.requestAnimFrame);i.remove();delete pJS};function f(){pJS.fn.canvasInit();pJS.fn.canvasSize();pJS.fn.canvasPaint();pJS.fn.particlesCreate();pJS.fn.particlesDraw()}function l(){pJS.fn.particlesDraw();pJS.fn.requestAnimFrame=requestAnimFrame(l)}f();if(pJS.particles.anim.enable){l()}if(pJS.interactivity.enable){pJS.fn.vendors.interactivity.listeners()}}window.requestAnimFrame=(function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(a){window.setTimeout(a,1000/60)}})();window.cancelRequestAnimFrame=(function(){return window.cancelAnimationFrame||window.webkitCancelRequestAnimationFrame||window.mozCancelRequestAnimationFrame||window.oCancelRequestAnimationFrame||window.msCancelRequestAnimationFrame||clearTimeout})();function hexToRgb(c){var b=/^#?([a-f\d])([a-f\d])([a-f\d])$/i;c=c.replace(b,function(e,h,f,d){return h+h+f+f+d+d});var a=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(c);return a?{r:parseInt(a[1],16),g:parseInt(a[2],16),b:parseInt(a[3],16)}:null}window.particlesJS=function(d,c){if(typeof(d)!="string"){c=d;d="particles-js"}if(!d){d="particles-js"}var b=document.createElement("canvas");b.style.width="100%";b.style.height="100%";var a=document.getElementById(d).appendChild(b);if(a!=null){launchParticlesJS(d,c)}};

/* particlesJS('dom-id', params);
/* @dom-id : set the html tag id [string, optional, default value : particles-js]
/* @params: set the params [object, optional, default values : check particles.js] */

/* config dom id (optional) + config particles params */
var numParticles = (window.innerWidth<768) ? 50 : 150;
particlesJS('particles-js', {
  particles: {
    color: '#fff',
    shape: 'circle', // "circle", "edge" or "triangle"
    opacity: .4,
    size: 3,
    size_random: true,
    nb: numParticles,
    line_linked: {
      enable_auto: true,
      distance: 100,
      color: '#fff',
      opacity: .7,
      width: 1,
      condensed_mode: {
        enable: false,
        rotateX: 600,
        rotateY: 600
      }
    },
    anim: {
      enable: true,
      speed: .7
    }
  },
  interactivity: {
    enable: true,
    mouse: {
      distance: 250
    },
    detect_on: 'canvas', // "canvas" or "window"
    mode: 'grab',
    line_linked: {
      opacity: .5
    },
    events: {
      onclick: {
        enable: true,
        mode: 'push', // "push" or "remove" (particles)
        nb: 8
      }
    } 
  },
  /* Retina Display Support */
  retina_detect: true
});
(function() {
	var util = window.util = {

		getRandomID: function(min, max){
			var rand = Math.floor((Math.random() * max) + min);
			return rand;
		},

		getRandomVal: function(arr){
			var rand = arr[Math.floor(Math.random() * arr.length)];
			return rand;
		},

		removeFromArray: function(id, arr){
			var tempArray = arr;
			var pos = jQuery.inArray( id, tempArray );
			if (pos > -1) {
				tempArray.splice(pos, 1);
			}
			return tempArray;
		},

		isMobile: function(){
			var isMob = false; 
			// device detection
			if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMob = true;
			return isMob;
		}
	};
})();