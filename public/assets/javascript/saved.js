$(document).ready(function () {

    var articleContainer = $(".article-container");
    $(document).on("click", ".btn.save", handleNoteSave);
    $(document).on("click", ".btn.delete", handleAarticleDelete);
    $(document).on("click", ".btn.notes", handleArticleNotes);
    $(document).on("click", ".btn.note-delete", handleNoteDelete);



    initPage();

    function initPage() {
        articleContainer.empty();
        $.get("/api/headlines?saved=true")
            .then(function (data) {
                if (data && data.length) {
                    renderArticles(data);
                }
                else {
                    renderEmpty();
                }
            });
    }

    function renderArticles(articles) {
        var articlePanels = [];

        for (var i = 0; i < articles.length; i++) {
            articles.Panels.push(createPanel(articles[i]));
        }

        articleContainer.append(articlePanels);
    }

    function createPanel(article) {
        var panel =
            $(["<div class='panel panel-default'>",
                "<div class='panel-heading'>",
                "<h3>",
                article.headline,
                "<a class='btn btn-success save'>",
                "Save Article",
                "</a>",
                "</h3>",
                "</div>",
                "<div class='panel-body'>",
                article.summary,
                "</div>",
                "</div>"
            ].join(""));

        panel.data("_id", article._id);

        return panel;
    }

    function renderEmpty() {
        var emptyAlert =
            $(["<div class='alert alert-warning text-center'>",
                "<h4>No saved articles</h4>",
                "</div>",
                "<div class='panel panel-default'>",
                "<div class='panel-headling text-center'>",
                "<h3>What would you like to do?</h3>",
                "</div>",
                "<div class='panel-body text-center'>",
                "<h4><a href='/'>View Articles</a></h4>",
                "</div>",
                "</div>"
            ].join(""));

        articleContainer.append(emptyAlert);
    }

    function handleArticleDelete() {

        var articleToDelete = $(this).parents(".panel").data();

        $.ajax({
            method: "DELETE",
            url: "/api/headlines/" + articleToDelete._id
        }).then(function (data) {
            if (data.ok) {
                initPage();
            }
        });
    }

    function handleArticleNotes() {

        var currentArticle = $(this).parents(".panel").data();

        $.get("/api/notes/" + currentArticle._id).then(function (data) {

            var modalText = [
                "<div class='container-fluid text-center'>",
                "<h4>Notes for Article: ",
                currentArticle._id,
                "</h4>",
                "<hr />",
                "<ul class='list-group note-container'>",
                "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
                "<button class='btn btn-success save'>Save Note</button>",
                "</div>"
             ].join("");

             var noteData = {
                 _id: currentArticle._id,
                 notes: data || []
             };

             $(".btn-save").data("article", noteData);

             renderNotesList(notedata);
        });
     }

function renderNotesList(data) {

    var notesToRender = [];
    var currentNote;

    if (!data.notes.length) {
        currentNote = [
            "<li class='list-group-item'>",
            "No notes for this article.",
            "</li>"
        ].join("");
        notesToRender.push(currentNote);
    }
    else {

        for (var i = 0; i < data.notes.length; i++) {
            currentNote = $([
                "<li class= 'list-group-item note'>",
                data.notes[i].noteText,
                "<button class='btn btn-danger note-delete'>x</button>",
                "</li>"
            ].join(""));

            currentNote.children("button").data("_id", data.notes[i]._id);

            notesToRender.push(currentNote);
        }
    }
    $(".note-container").append(notesToRender);
}

function handleNoteSave() {

    var noteData;
    var newNote = $(".bootbox-body-textarea").val().trim();

    if (newNote) {
        noteData = {
            _id: $(this).data("article")._id,
            noteText: newNote
        };
        $.post("/api/notes", noteData).then(function(){
            bootbox.hideAll();
        });
    }
}

function handleNoteDelete() {
    var noteToDelete = $(this).data("_id");

    $.ajax({
        url: "/api/notes" + noteToDelete,
        method: "DELETE"
    }).then(function() {
        bootbox.hideAll();
    });
}
    
});