$.fn.preload = function() {
    this.each(function(){
        $('<img/>')[0].src = this;
    });
}


$.fn.makeWindowed = function ()
{
    var html =
    "<iframe style=\"position: absolute; display: block; " +
    "z-index: -1; width: 100%; height: 100%; top: 0; left: 0;" +
    "filter: mask(); background-color: #ffffff; \"></iframe>";
    if (this) $(this)[0].innerHTML += html;
    // force refresh of div
    var olddisplay = $(this)[0].style.display;
    $(this)[0].style.display = 'none';
    $(this)[0].style.display = olddisplay;
}


function rebindSliderEvents(calendars, pixels, onecal) {
    calendars.find('div > ul > li.prev > a').unbind('click').click(function(e) {
        e.preventDefault();
        $(this).parents('div.calendars').animate({left: '+=' + pixels.toString()}, 500, 'linear', function(e) {
            if(!onecal) $('div.calendars > div > ul > li.prev:last').attr('class', 'next');
            rebindSliderEvents(calendars, pixels, onecal);
        });
    })

    calendars.find('div > ul > li.next > a').unbind('click').click(function(e) {
        e.preventDefault();
        $(this).parents('div.calendars').animate({left: '-=' + pixels.toString()}, 500, 'linear', function(e) {
            if(!onecal) $('div.calendars > div > ul > li.next:first').attr('class', 'prev');
            rebindSliderEvents(calendars, pixels, onecal);
        });
    })
}

$(document).ready(function() {
    
    var middle_slide_stop = false;
    $(['submenu-left.png', 'submenu-right.png']).preload();
    
    $('#menubar > li').mouseenter(function(e) {
        $(this).addClass('selected');
        if($(this).hasClass('left')) {
            $(this).addClass('selected-left');
        }
        if($(this).hasClass('right')) {
            $(this).addClass('selected-right');
        }
    }).mouseleave(function(e) {
        $(this).removeClass('selected');
        $(this).removeClass('selected-left');
        $(this).removeClass('selected-right');
    });
    
    $('#middlebar li').mouseenter(function(e) {
        $(this).children('img').animate({
            marginTop: '-5px',
            marginRight: '-5px',
            marginBottom: '-5px',
            marginLeft: '-5px',
            width: '232px',
            height: '182px'
        }, 300);
        $(this).children('a').animate({
            marginTop: '-5px',
            marginRight: '-5px',
            marginBottom: '-5px',
            marginLeft: '-5px',
            paddingLeft: '19px',
            paddingBottom: '9px',
            width: '199px',
            height: '51px',
            lineHeight: '52px'
        }, 300, function() {
            middle_slide_stop = true;
        });
    }).mouseleave(function(e) {
        $(this).children('img').animate({
            marginTop: '0',
            marginRight: '0',
            marginBottom: '0',
            marginLeft: '0',
            width: (($.browser.msie && $.browser.version.substr(0,1)<7) ? '232px' : '222px'),
            height: (($.browser.msie && $.browser.version.substr(0,1)<7) ? '182px' : '172px')
        }, 300, function() {
            middle_slide_stop = false;
        });
        $(this).children('a').animate({
            marginTop: '0',
            marginRight: '0',
            marginBottom: '0',
            marginLeft: '0',
            paddingLeft: '14px',
            paddingBottom: '0',
            width: '194px',
            height: '41px',
            lineHeight: '41px'
        }, 300);
    }).click(function(e) {
        window.location.href = $(this).children('a').attr('href');
    });
    
    setInterval(function() {
        if(!middle_slide_stop) {
            $('#middlebar').animate({marginLeft: '-=240'}, 500, function() {
                $('#middlebar').append($('#middlebar li:first'));
                $('#middlebar').css('margin-left', '0px');
            });
        }
    }, 5000);
    
    var sum = 50;
    $.map($('#middlebar li'), function(i) { sum += $(i).outerWidth(true); });
    $('#middlebar').width(sum);
    
    $('div.select > select').change(function() {
        $(this).parent().children('span').text($(this).children('option[value="' + $(this).val() + '"]').text());
    });
    $('div.select > select').change();
    
    $('dl.horizontal > dt:not(.free) + dd > input[class^="text"], dl.horizontal > dt:not(.free) + dd > textarea').blur(function(e) {
        if($(this).val() == '' || ($(this).attr('id').match(/^.?email$/) && !$(this).val().match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/i))) {
            $(this).parent().addClass('invalid' + ($(this).is('textarea') ? '-textarea' : ''));
        } else {
            $(this).parent().removeClass('invalid').removeClass('invalid-textarea');
        }
    });
    
    $('form').submit(function(e) {
        var valid = true;
        $(this).find('dl.horizontal > dt:not(.free) + dd > input[class^="text"], dl.horizontal > dt:not(.free) + dd > textarea').each(function(i) {
            if($(this).val() == '' || ($(this).attr('id').match(/^.?email$/) && !$(this).val().match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/i))) {
                valid = false;
            $(this).parent().addClass('invalid' + ($(this).is('textarea') ? '-textarea' : ''));
        } else {
            $(this).parent().removeClass('invalid').removeClass('invalid-textarea');
            }
        });
        if(!valid) {
            e.preventDefault();
        }
    });
    
    $('dl.horizontal > dd > input.short, #birthday, #pbirthday').attr('readonly', 'readonly');
    
    if($.datepicker) {
        $.datepicker.setDefaults($.datepicker.regional['pl']);
    
        $('#birthday, #pbirthday, #from-from, #from-to, #period-from, #period-to').datepicker({
            dateFormat: 'yy-mm-dd',
            maxDate: (new Date().getYear() + 1900).toString() + '-12-31',
            changeMonth: true,
            changeYear: true,
            onSelect: function(e) {
                if($(this).parent().children('input[value=""]').length == 0) $(this).parent().removeClass('invalid');
            }
        });
        $('#birthday + a.calendar, #pbirthday + a.calendar, #from-from + span + #from-to + a.calendar, #period-from + span + #period-to + a.calendar').click(function(e) {
            if($(this).parent().children('input[value=]').is('input')) {
                $(this).parent().children('input[value=]:first').focus();
            } else {
                $(this).parent().children('input:first').focus();
            }
        });
    }
    
    rebindSliderEvents($('div.article-wide div.calendars'), 242, true);
    rebindSliderEvents($('div.article-right div.calendars'), 227, false);
    
    $('#mask').height($('#wrapper').outerHeight() + $('#footer').outerHeight() + 10);
    
    if ($.browser.msie && $.browser.version.substr(0,1)<7) {
        var min_height = $(window).height() - $('#footer').outerHeight(true) - 10;
        if(min_height > $('#wrapper').height()) {
            $('#wrapper').css('height', min_height.toString() + 'px');
        }
        $('img[src$=".png"]').not('img[src$="avatar.png"]').each(function() { $(this).width($(this).width()); $(this).height($(this).height()); $(this).css('filter', 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + $(this).attr('src') + '",sizingMethod="crop");'); $(this).attr('src', 'img/pix.gif'); });
        $('#popup').makeWindowed();
        setInterval(function() {
            if($('#ui-datepicker-div > div:first').is('div') && !$('#ui-datepicker-div > iframe:first').is('iframe')) {
                $('#ui-datepicker-div').makeWindowed();
            }
        }, 300);
    } else {
        $('#wrapper').css('min-height', ($(window).height() - $('#footer').outerHeight(true) - 10).toString() + 'px');
    }
    
    
    $('#fillprofile').click(function(e) {
        e.preventDefault();
        $('#mask').show();
        $('#popup').fadeIn();
    });
    $('#popup > a.close').click(function(e) {
        e.preventDefault();
        $('#popup').fadeOut(function() {
            $('#mask').hide();
        });
    });
    
    if($('div.more-expand').is('div')) {
        $('div.more-expand').each(function(i) {
            $(this).show().height($(this).height()).hide();
        });
    }
    
    $('a.more-expand').click(function(e) {
        e.preventDefault();
        $(this).prevAll('div.more-expand').slideDown();
        $(this).hide();
    });
    
    $('#content ul.article-boxes li div').mouseover(function(e) {
        $(this).addClass('hover');
    }).mouseout(function(e) {
        $(this).removeClass('hover');
    }).click(function(e) {
        window.location.href = $(this).children('a').attr('href');
    });
    
});