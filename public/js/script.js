$(document).ready(function(){

  // Show modal once app is ready. First thing to do and mantadory
  $('#usernameModal').modal('show');

  // Join event, triggered once the user writes a username
  $('#join').click(function(){
    var name = $('#usernameInput').val();
    if(name != ""){
      var socket = io();
      socket.emit("join", name);
      ready = true;
      $('#usernameModal').modal('hide');
    }

    // Emit an event when typing...
    $('#m').keypress(function(){
      console.log('pressing keys...');
      socket.emit('typing');
    })

    // Send a new message
    $('#msgForm').submit(function(){
      $('#messages').append($('<li class="col-md-7 pull-right">').html('<b>You say</b>:<p style="word-wrap:break-word;">' + $('#m').val() + '</p>'));
      socket.emit('chat message', $('#m').val());
      $('#m').val('');
      $("#msgBoard").scrollTop(document.getElementById('msgBoard').scrollHeight);
      return false;

    });

    // Receive a new chat message
    socket.on('chat message', function(msg, auth){
      //console.log('auth is '+auth+ ' and last is ' + lastAuth);
      /*if(auth = lastAuth){
        $('#messages ll').last().append($('<p>')).text(msg);
      } else {*/

        $('#messages').append($('<li class="col-md-7 pull-left">').html('<b>'+ auth +' says: </b><p style="word-wrap:break-word;">' + msg + '</p>'));
        $("#msgBoard").scrollTop(document.getElementById('msgBoard').scrollHeight);


    });

    // Receive updates from the server
    socket.on('update', function(msg){
      $('#messages').append($('<li class="pull-left alert alert-info text-center">').html(msg));
      $("#msgBoard").scrollTop(document.getElementById('msgBoard').scrollHeight);
    });

    // Receive broadcast of other users typing
    socket.on('typing', function(auth){
      $('#typing-area').fadeIn(50).html(auth + ' is typing...').delay(350).fadeOut(50);
    });

    socket.on('update-users', function(clients){
      $('#onlineUsers').html('');
      console.log(clients);

      for(client in clients){

        $('#onlineUsers').append($('<li class="list-group-item">').html(clients[client]))
      }
    });

  });

})
