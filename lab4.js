const $area = document.querySelector('.area');
const $addNoteBtn = document.querySelector('.add-note');
const $clearNotesBtn = document.querySelector('.clear-notes');

let notes = [];
let isAction = false;
let selectedBoxIndex = null;
let $selectedBox = null;
let areaSize = {
    width: $area.offsetWidth,
    height: $area.offsetHeight,
};
let boxSize = { width: 0, height: 0 };

let startCoords   = { x: 0, y: 0 };
let currentCoords = { x: 0, y: 0 };

function notesRenderer(notesList) {
    let template = '';
    notesList.forEach(function (note, index) {
        template += `<div class="box" style="left: ${note.coords.x}px; top: ${note.coords.y}px;" data-index="${index}">
                        <textarea class="note-text">${note.text}</textarea>
                     </div>`;
    });
    $area.innerHTML = template;

    document.querySelectorAll('.note-text').forEach(function (textarea, index) {
        textarea.addEventListener('input', function () {
            notes[index].text = textarea.value;
            saveNotesToLocalStorage(); 
        });
    });
}

function move(coords) {
    $selectedBox.style.left = coords.x + 'px';
    $selectedBox.style.top = coords.y + 'px';
}

$addNoteBtn.addEventListener('click', function () {
    notes.push({
        coords: {
            x: 0,
            y: 0
        },
        text: ''
    });
    notesRenderer(notes);
    saveNotesToLocalStorage();
});

$area.addEventListener('mousedown', function (event) {
    if (event.target.classList.contains('box')) {
        isAction = true;
        selectedBoxIndex = event.target.getAttribute('data-index');
        $selectedBox = document.querySelector('.box[data-index="' + selectedBoxIndex + '"');
        startCoords.x = event.pageX;
        startCoords.y = event.pageY;
        boxSize.width = $selectedBox.offsetWidth;
        boxSize.height = $selectedBox.offsetHeight;
    }
});

$area.addEventListener('mouseup', function (event) {
    isAction = false;
    notes[selectedBoxIndex].coords.x = currentCoords.x;
    notes[selectedBoxIndex].coords.y = currentCoords.y;
    saveNotesToLocalStorage();
});

$area.addEventListener('mousemove', function (event) {
    if (isAction) {
        currentCoords.x = notes[selectedBoxIndex].coords.x + (event.pageX - startCoords.x);
        currentCoords.y = notes[selectedBoxIndex].coords.y + (event.pageY - startCoords.y);

        if (currentCoords.x <= 0) currentCoords.x = 0;
        if (currentCoords.y <= 0) currentCoords.y = 0;

        if (currentCoords.x >= (areaSize.width - boxSize.width))   currentCoords.x = areaSize.width - boxSize.width;
        if (currentCoords.y >= (areaSize.height - boxSize.height)) currentCoords.y = areaSize.height - boxSize.height;

        move(currentCoords);
    }
});

$clearNotesBtn.addEventListener('click', function () {
    clearNotes();
});

function loadNotesFromLocalStorage() {
    const storedNotes = localStorage.getItem('myNotes');
    if (storedNotes) {
        notes = JSON.parse(storedNotes);
    }
}

function saveNotesToLocalStorage() {
    localStorage.setItem('myNotes', JSON.stringify(notes));
}

function clearNotes() {
    notes = [];
    saveNotesToLocalStorage();
    notesRenderer(notes);
}

loadNotesFromLocalStorage();
notesRenderer(notes);
