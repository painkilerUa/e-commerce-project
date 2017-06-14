$(document).ready(function(){
  $('.slider').slick({
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    autoplay : true,
    autoplaySpeed : 3000,
    arrows : false
  });
});

$(document).ready(function(){
  $('.slider-popular-products').slick({
    slidesToShow: 5,
    autoplay : true,
    autoplaySpeed : 3000,
    responsive: [{
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
      }
    }, {
      breakpoint: 769,
      settings: {
        slidesToShow: 3,
      }
    }, {
      breakpoint: 481,
      settings: {
        slidesToShow: 2
      }
    }, {
      breakpoint: 381,
      settings: {
        slidesToShow: 1
      }
    }]
  });
});