function loadAllTrips() {
    $.get("/getList", setList)
    $(".star").click(sendRating)
}

function getTrip(idx) {
    $.get("/getTrip", {idx: idx}, setTrip);
}

    

function setList(data) {
    console.log('data: ', data)
    
    // for (let i = 0; i < data.length; i++)
    $.each(data, function(key, val) {
        var item = $('<button></button>').text(val.title)
        item.addClass('btn btn-primary mx-2')
        // item.click todo
        item.click(function(){getTrip(val.idx)});
        $('#leftNav').append(item)
    })
    // todo load an initial trip
    setTrip(data[0])
}

function setTrip(data) {
    $('#idx').html(data.idx)
    $('#title').html(data.title)
    $('#photo').attr('src', './images/' + data.image)
    $('#date').html(data.date)
    $('label:first').html(data.days)
    $('label:last').html(data.location)
    $(".star:gt(" + (parseInt(data.rating) -1) + ")")
        .attr("src", "images/empty.png")
    $(".star:lt(" + (parseInt(data.rating)) + ")")
        .attr("src", "images/star.png")
}

function sendRating() {
    var idx = $("#idx").html()
    var rating = $(".star").index($(this)) + 1
    $.post("/setRating", {idx: idx, rating: rating}, setTrip)
}