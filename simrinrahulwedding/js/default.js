$(document).ready(function() {

    /*
     * jQuery Timer Plugin
     * http://www.evanbot.com/article/jquery-timer-plugin/23
     *
     * @version      1.0
     * @copyright    2009 Evan Byrne (http://www.evanbot.com)
     */

    jQuery.timer = function(time, func, callback) {
        var a = {
            timer: setTimeout(func, time),
            callback: null
        }
        if (typeof(callback) == 'function') {
            a.callback = callback;
        }
        return a;
    };

    jQuery.clearTimer = function(a) {
        clearTimeout(a.timer);
        if (typeof(a.callback) == 'function') {
            a.callback();
        };
        return this;
    };

    /*
      //Lazy Load images
      $("img").lazyload({
        threshold : 200,
        container: $(".slideshow")
      });
    */

    var myDataRef = new Firebase('https://srwedding.firebaseio.com/');



    $("#guest-message").keypress(function(e) {
        if (e.keyCode == 13) {
            var name = $('#guest-name').val();
            var location = $('#guest-location').val();
            var text = $('#guest-message').val();
            myDataRef.push({
                name: name,
                location: location,
                text: text,
                date: (new Date()).toLocaleString()
            });
            $('#guest-name,#guest-location,#guest-message').val('');
        }
    });
    // GuestBook form Form Submit
    $('#guestBookForm').submit(function() {
        var name = $('#guest-name').val();
        var location = $('#guest-location').val();
        var text = $('#guest-message').val();
        var date = new Date();
        var stringDate = date.format('M j, Y H:i')
        myDataRef.push({
            name: name,
            location: location,
            text: text,
            date: stringDate
        });
        $('#guest-name,#guest-location,#guest-message').val('');
        $('#close_x').click();
        alert("Thanks for your Wishes.");


    });
    myDataRef.on('child_added', function(snapshot) {
        var message = snapshot.val();
        displayChatMessage(message.name, message.location, message.text, message.date);
    });

    function displayChatMessage(name, location, text, date) {
        console.log("name:" + name + ",location:" + location + ",text" + text + "date:" + date);
        $('<li/>').html('<div class="comment-hdr"><span class="float-right date">' + date + '</span><h3 class="name">' + name + '</h3><span class="location">' + location + '</span></div><div class="comment-body">' + text + '</div><div class="center-align"><img src="img/heart_with_lines.png" /></div>').appendTo($('#comments'))
    };

    $('ul.nav a').bind('click', function(event) {
        var $anchor = $(this);

        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        /*
        if you don't want to use the easing effects:
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1000);
        */
        event.preventDefault();
    });


    $('#nav-rsvp a').unbind();
    $('#nav-rsvp a, .rsvp-link').click(function() {
        $('#sign_up').lightbox_me();
        //$('#rsvp').slideToggle('slow');
        return false;
    });



    // Photos Slideshot
    $('#section-3 .slideshow').jcarousel({
        scroll: 1,
        animation: 500,
        easing: 'easeInOutSine',
        wrap: 'last',
        initCallback: photos_initCallback,
        itemVisibleInCallback: photos_activeSlide,
    });

    function photos_initCallback(carousel) {
        $('#section-3 .slideshow-control li').bind('click', function() {
            $('#section-3 .slideshow-control li').removeClass('active');
            $(this).addClass('active');
            carousel.scroll($.jcarousel.intval($(this).text()));

            return false;
        });
    };

    function photos_activeSlide(carousel, object, intval, state) {
        intval--;
        $('#section-3 .slideshow-control li').removeClass('active');
        $('#section-3 .slideshow-control li:eq(' + intval + ')').addClass('active');

    }

    $('#section-3 .slideshow-control').width(($('#section-3 .slideshow-control li').length * 30) + 'px');


    // Groomsmen Slideshow
    $('#section-4 .slideshow').jcarousel({
        scroll: 1,
        animation: 500,
        easing: 'easeInOutSine',
        wrap: 'last',
        initCallback: grooms_initCallback,
        itemVisibleInCallback: grooms_activeSlide,
    });

    function grooms_initCallback(carousel) {
        $('#section-4 .slideshow-control li').bind('click', function() {
            $('#section-4 .slideshow-control li').removeClass('active');
            $(this).addClass('active');
            carousel.scroll($.jcarousel.intval($(this).text()));

            return false;
        });
    };

    function grooms_activeSlide(carousel, object, intval, state) {
        intval--;
        $('#section-4 .slideshow-control li').removeClass('active');
        $('#section-4 .slideshow-control li:eq(' + intval + ')').addClass('active');

    }


    // Bridesmaids Slideshow
    $('#section-5 .slideshow').jcarousel({
        scroll: 1,
        animation: 500,
        easing: 'easeInOutSine',
        wrap: 'last',
        initCallback: brides_initCallback,
        itemVisibleInCallback: brides_activeSlide,
    });

    function brides_initCallback(carousel) {
        $('#section-5 .slideshow-control li').bind('click', function() {
            $('#section-5 .slideshow-control li').removeClass('active');
            $(this).addClass('active');
            carousel.scroll($.jcarousel.intval($(this).text()));

            return false;
        });
    };

    function brides_activeSlide(carousel, object, intval, state) {
        intval--;
        $('#section-5 .slideshow-control li').removeClass('active');
        $('#section-5 .slideshow-control li:eq(' + intval + ')').addClass('active');

    }

    $('#section-5 .slideshow-control').width(($('#section-5 .slideshow-control li').length * 30) + 'px');

    //When/Where/How Slideshow

    $('#section-8 .slideshow').jcarousel({
        scroll: 1,
        animation: 500,
        easing: 'easeInOutSine',
        wrap: 'last',
        initCallback: brides_initCallback,
        itemVisibleInCallback: brides_activeSlide,
    });

    function brides_initCallback(carousel) {
        $('#section-8 .slideshow-control li').bind('click', function() {
            $('#section-8 .slideshow-control li').removeClass('active');
            $(this).addClass('active');
            carousel.scroll($.jcarousel.intval($(this).text()));

            return false;
        });
    };

    function brides_activeSlide(carousel, object, intval, state) {
        intval--;
        $('#section-8 .slideshow-control li').removeClass('active');
        $('#section-8 .slideshow-control li:eq(' + intval + ')').addClass('active');

    }

    $('#section-8 .slideshow-control').width(($('#section-8 .slideshow-control li').length * 30) + 'px');


    var lastScroll = $(document).scrollTop();
    $(window).scroll(function(e) {
        var newScroll = $(document).scrollTop();
        $("#header").css("top", newScroll)
    });


});