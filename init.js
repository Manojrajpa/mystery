let db;
initSqlJs({ locateFile: file => `sql-wasm.wasm` }).then(SQL => {
    fetch("cropin_mystery_game_database.db")
        .then(res => res.arrayBuffer())
        .then(buffer => {
            db = new SQL.Database(new Uint8Array(buffer));
            document.getElementById("output").textContent = "🔍 Database loaded. Start querying!";
        });
});

function executeSQL() {
    const sql = document.getElementById("sql").value;
    let output = "";
    try {
        const results = db.exec(sql);
        results.forEach(result => {
            output += result.columns.join(" | ") + "\n";
            result.values.forEach(row => {
                output += row.join(" | ") + "\n";
            });
            output += "\n";
        });
        if (results.length === 0) output = "No results.";
    } catch (err) {
        output = "❌ Error: " + err.message;
    }
    document.getElementById("output").textContent = output;
}
