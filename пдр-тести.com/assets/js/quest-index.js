$( document ).ready(function() { 
  setAllStatus();
  
  $( "#clearStorage" ).click(function() {
    localStorage.clear();
    setAllStatus();
  });

});

function setAllStatus() {
  // exam
  each(".pdd-exam_item", LANG + "_e_");

  // theme
  each(".pdd-theme_item", LANG + "_t_");
}

function each(select, typeText) {
  $( select ).each(function( index ) {
    setStatus($(this), typeText + $( this ).data( "ind" ), function(elem, storage) {
      var questCount = $(elem).find(".progress").data("count");
      var partSize = 100 / questCount,
          countCorrectAnswer = storage!=undefined?storage.countCorrectAnswer:0,
          countWrongAnswer = storage!=undefined?storage.countWrongAnswer:0;

      $(elem).find('.progress-bar-success').css('width', (partSize * countCorrectAnswer)+'%');
      $(elem).find('.progress-bar-danger').css('width', (partSize * countWrongAnswer)+'%');
      $(elem).find('.progress-value').text(countCorrectAnswer+ " / " + questCount + TRANSLATE.get(" верных"));
    });
  });
}

function setStatus(elem, testName, after) {
  var status = getTestStatus(testName);
  if (status.storage !== null) {
    $(elem).addClass(getClassNameByStatus(status));
    if (after != undefined) after(elem, status.storage);
  } else { 
    $(elem).removeClass("passed failed paused");
    if (after != undefined) after(elem);
  }
}

function getTestStatus(testName) {
  var storage = localStorage.getItem(testName), status = { };
  status.storage = null;

  if (storage !== null) {
    storage = JSON.parse(storage);  status.storage = storage;
    if (storage.countCorrectAnswer + storage.countWrongAnswer == storage.countQuest) {
      status.value = +(storage.countWrongAnswer > 2);
    } else status.value = 2;
  } else  status.value = -1;

  
  return status;
}

function getClassNameByStatus(status) {
  switch (status.value) {
    case 0: return "passed";
    case 1: return "failed";
    case 2: return "paused"
    default: return "";
  }
}
