let db = null;
let results = [];
let currentPage = 0;
const rowsPerPage = 50;

initSqlJs({ locateFile: file => `sql-wasm.wasm` }).then(SQL => {
    fetch("mrpa4634xsw.sqlite.db").then(res => res.arrayBuffer()).then(data => {
        db = new SQL.Database(new Uint8Array(data));
    });
});

document.getElementById("run-sql").addEventListener("click", () => {
    const sql = document.getElementById("editor").value;
    try {
        results = db.exec(sql);
        currentPage = 0;
        renderPage();
    } catch (err) {
        document.getElementById("results").textContent = "❌ Error: " + err.message;
    }
});

function renderPage() {
    const resultArea = document.getElementById("results");
    const pagination = document.getElementById("pagination");
    resultArea.innerHTML = "";
    pagination.innerHTML = "";

    if (results.length === 0) {
        resultArea.textContent = "✅ Query executed successfully. No results to display.";
        return;
    }

    const columns = results[0].columns;
    const values = results[0].values;

    const start = currentPage * rowsPerPage;
    const end = Math.min(start + rowsPerPage, values.length);
    const pageRows = values.slice(start, end);

    const table = document.createElement("table");
    const header = document.createElement("tr");

    columns.forEach(col => {
        const th = document.createElement("th");
        th.textContent = col;
        header.appendChild(th);
    });
    table.appendChild(header);

    pageRows.forEach(row => {
        const tr = document.createElement("tr");
        row.forEach(cell => {
            const td = document.createElement("td");
            td.textContent = cell;
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });

    resultArea.appendChild(table);

    for (let i = 0; i < Math.ceil(values.length / rowsPerPage); i++) {
        const btn = document.createElement("button");
        btn.textContent = i + 1;
        btn.onclick = () => {
            currentPage = i;
            renderPage();
        };
        if (i === currentPage) {
            btn.style.fontWeight = "bold";
        }
        pagination.appendChild(btn);
    }
}