$(document).ready(function(){      
  //change nav display based on scroll position 
  var scroll_start = 0;
  var stickyPos = 100;

  setNavPos($(this).scrollTop());
  
  $(document).scroll(function() { 
    setNavPos($(this).scrollTop());
  });

  function setNavPos(scroll_start){
    if(scroll_start > stickyPos) {
      $(".navbar-default").addClass('sticky');
    } else {
      $('.navbar-default').removeClass('sticky');
    }
  }


  var daysLeft = counter.countdown().toString().split('');
  for (var i=daysLeft.length-1; i>=0; i--){
    $('#counter').prepend('<span>'+daysLeft[i]+'</span>');
  }


  //page down
  $('#intro .fa-chevron-circle-down').on('click', function(){
    $('html, body').animate({
        scrollTop: $("#partners").offset().top+1
    }, 500);
  });


  $('.quote-module').height($('.quote-module').width());
  $('.twitter-module').height($('.twitter-module').width());

});


