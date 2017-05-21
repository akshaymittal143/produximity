window.conversationContext = {};

var addDialog = function(sender, message) {
  $("#dialog").append("<div class='row response'><div class='two columns sender'>" + sender + "</div><div class='ten columns message'>" + message + "</div></div>");
};

var converse = function(message) {
  $.post( "/api/conversation/message/",  {
    message: message,
    conversationContext: window.conversationContext
  }).done(function( response ) {
    addDialog("produximity", response.response);
    window.conversationContext = response.conversationContext;
  });
};


$(document).ready(function(){
  $("#user-message").keypress(function(e) {
    if(e.which == 13) {
      converse($("#user-message").val());
      $("#user-message").val("");
    }
  });
  converse();
});