function getGamesList() {
    $.get("/getList", {}, updateGames)
}