
function handleIndexRendering(req, res) {
    res.status(200).sendFile("index.html");
}

module.exports = {
    handleIndexRendering,
};

