$(document).ready(function() {

  $('#fetch').click(function() {
    fullClear();
    $('#events').addClass('hidden');
    handleGet('repos/' + $('#repo').val() + '/hooks', function(hooks) {
      $.each(hooks, function (i,hook){
        $('#hooks-list').append('<li class="list-group-item hook-li" data-id="'+hook.id+'">'+hook.name+'</li>');
      });
      $('#hook-link').attr('href', 'https://github.com/' + $('#repo').val() + '/settings/hooks/new');
      $('#repo-name').text($('#repo').val());
      $('#hooks').removeClass('hidden');
    });
  });

  $('#hooks-list').on('click', '.hook-li', function() {
    resetEventsList();
    $(this).addClass('active');
    handleGet('repos/' + $('#repo').val() + '/hooks/' + $(this).data('id'), function(hook) {
      $.each(hook.events, function(i,ev) {
        $('#'+ev).prop('checked', true);
      });
      $('#events').removeClass('hidden');
    });
  });

  $('#update').click(function() {
    var selected_events = $('.event-checkbox').filter(':checked').map(function() {
      return this.id;
    }).get();
    var data = { events: selected_events }
    handleRequest(
      'repos/' + $('#repo').val() + '/hooks/' + $('.active').data('id'),
      JSON.stringify(data),
      'PATCH',
      function() {
        fullClear();
        $('#success').removeClass('hidden');
      }
    );
  });
});

function handleGet(path, success) {
  handleRequest(path, '', 'GET', success);
}

function handleRequest(path, data, type, success){
  $('#error').addClass('hidden');
  $.ajax({
    url: 'https://api.github.com/'+path,
    type: type,
    dataType: 'json',
    data: data,
    success: success,
    error: function() { $('#error').removeClass('hidden'); },
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'token ' + $('#token').val());
    }
  });
}

function resetEventsList(){
  $('.event-checkbox').prop('checked', false);
  $('.active').removeClass('active');
  $('#events').addClass('hidden');
}

function resetHooksList(){
  $('#hooks').addClass('hidden');
  $('#hooks-list').empty();
  $('#hook-link').attr('href', '');
  $('#repo-name').text('');
}

function fullClear(){
  resetEventsList();
  resetHooksList();
  $('#success').addClass('hidden');
}
