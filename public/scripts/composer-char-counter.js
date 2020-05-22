$(document).ready(function() {
  $('textarea').on('keyup', function() {
    const $TextArea = $(this);
    const remainChar = 140 - $TextArea.val().length;
    $TextArea
      .closest('form')
      .find('.counter')
      .text(remainChar)
      .toggleClass('over-limit', remainChar <= 0);
  });
});
