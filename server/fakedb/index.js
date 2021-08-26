const fs = require("fs");

const text = fs.readFileSync("db.json");
const db = JSON.parse(text);

function set(key, value) {
    db[key] = value;

    const txt = JSON.stringify(db, null, 4);
    fs.writeFileSync("db.json", txt);
}

function get(key) {
    return db[key];
}

module.exports = {
    set,
    get,
}

