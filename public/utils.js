/*jslint browser: true*/

var utils = {
  scrollToBottom : function () {
    if ($(window).scrollTop() + $(window).height() + 2 * $('#messages li').last().outerHeight() >= $(document).height()) {
      $('html, body').animate({ scrollTop: $(document).height() }, 0);
    }
  }
};