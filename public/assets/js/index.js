var $noteTitle = $(".note-title");
var $noteText = $(".note-textarea");
var $saveNoteBtn = $(".save-note");
var $newNoteBtn = $(".new-note");
var $noteList = $(".list-container .list-group");

// note-တွေကို ခြေရာခံခြင်း
// activeNote is used to keep track of the note in the textarea
var activeNote = {};

// db-ထဲက note-တွေကို ရယူခြင်း
// A function for getting all notes from the db
var getNotes = function () {
  return $.ajax({
    url: "/api/notes",
    method: "GET",
  });
};

// saving notes to db
// A function for saving a note to the db
var saveNote = function (note) {
  return $.ajax({
    url: "/api/notes",
    data: note,
    method: "POST",
  });
};

// deleting notes from db
// A function for deleting a note from the db
var deleteNote = function (id) {
  return $.ajax({
    url: "api/notes/" + id,
    method: "DELETE",
  });
};

// If activeNote, display it, otherwise render empty
// If there is an activeNote, display it, otherwise render empty inputs
var renderActiveNote = function () {
  $saveNoteBtn.hide();
  if (activeNote.id) {
    $noteTitle.attr("readonly", true);
    $noteText.attr("readonly", true);
    $noteTitle.val(activeNote.title);
    $noteText.val(activeNote.text);
  } else {
    $noteTitle.attr("readonly", false);
    $noteText.attr("readonly", false);
    $noteTitle.val("");
    $noteText.val("");
  }
};

// get notes from input, save to db
// Get the note data from the inputs, save it to the db and update the view
var handleNoteSave = function () {
  var newNote = {
    title: $noteTitle.val(),
    text: $noteText.val(),
  };

  saveNote(newNote).then(function (data) {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// delete notes
// Delete the clicked note
var handleNoteDelete = function (event) {
  // prevents the click listener for the list from being called when the button inside of it is clicked
  event.stopPropagation();

  var note = $(this).parent(".list-group-item").data();

  if (activeNote.id === note.id) {
    activeNote = {};
  }

  deleteNote(note.id).then(function () {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Set activeNote
// Sets the activeNote and displays it
var handleNoteView = function () {
  activeNote = $(this).data();
  renderActiveNote();
};

// user can enter notes
// Sets the activeNote to and empty object and allows the user to enter a new note
var handleNewNoteView = function () {
  activeNote = {};
  renderActiveNote();
};

// hide save button if no title no text
// If a note's title or text are empty, hide the save button Or else show it
var handleRenderSaveBtn = function () {
  if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
    $saveNoteBtn.hide();
  } else {
    $saveNoteBtn.show();
  }
};

// show lists of note titles
// Render's the list of note titles
var renderNoteList = function (notes) {
  $noteList.empty();

  // var noteListItems = [];
  const noteListItems = [];

  for (var i = 0; i < notes.length; i++) {
    var note = notes[i];

    var $li = $("<li class='list-group-item'>").data(note);
    var $span = $("<span>").text(note.title);
    var $delBtn = $(
      "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
    );

    $li.append($span, $delBtn);
    noteListItems.push($li);
  }

  $noteList.append(noteListItems);
};

// Gets notes from the db and renders them to the sidebar
// get notes from db and show
var getAndRenderNotes = function () {
  return getNotes().then(function (data) {
    renderNoteList(data);
  });
};

/*
// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = function () {
	return getNotes().then(renderNoteList);
};
*/

$saveNoteBtn.on("click", handleNoteSave);
$noteList.on("click", ".list-group-item", handleNoteView);
$newNoteBtn.on("click", handleNewNoteView);
$noteList.on("click", ".delete-note", handleNoteDelete);
$noteTitle.on("keyup", handleRenderSaveBtn);
$noteText.on("keyup", handleRenderSaveBtn);

//Gets and renders the initial list of notes
// calling function
getAndRenderNotes();
