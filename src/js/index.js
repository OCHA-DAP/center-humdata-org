$(document).ready(function(){      
  //change nav display based on scroll position 
  var scroll_start = 0;
  var section = $('#partners');
  var offset = section.offset();
  if (section.length){
    $(document).scroll(function() { 
      scroll_start = $(this).scrollTop();
      if(scroll_start > offset.top) {
        $(".navbar-default").addClass('sticky');
      } else {
        $('.navbar-default').removeClass('sticky');
      }
    });
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

  // init Masonry
  var $grid = $('.grid').masonry({
    itemSelector: '.grid-item',
    percentPosition: true,
    columnWidth: '.grid-sizer'
  });
  // layout Isotope after each image loads
  $grid.imagesLoaded().progress( function() {
    $grid.masonry();
  });  

  // $('.grid').packery({
  //   // options
  //   itemSelector: '.grid-item',
  //   gutter: 0
  // });

});


