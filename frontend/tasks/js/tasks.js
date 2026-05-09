const PORT = 8000;
const API_HOST = `http://localhost:${PORT}/api`;

const taskResult = document.getElementById('result-task');
const formTodo = document.getElementById('form-todolist');
const logoutBtn = document.getElementById('logout-button');

// GET PER TUTTE LE TASK
async function getAllTask() {
    const container = document.getElementById('container-tabel');
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = '../login/login.html';
        return;
    }

    const dataTask = await apiRequest(`${API_HOST}/tasks`, "GET", null, token);

    if (dataTask) {
        container.innerHTML = '';
        const table = document.createElement('table');
        const trHeader = document.createElement('tr');
        
        const thName = ['Task', 'Stato', 'Data', 'Ora', 'Note', 'Modifica', 'Elimina'];
        thName.forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            trHeader.appendChild(th);
        });
        table.append(trHeader);

        for (const task of dataTask) {
            const tr = document.createElement('tr');
            tr.style.backgroundColor = task.is_completed ? "#f0fff4" : "#ffffff";

            const tdTitle = document.createElement('td');
            const tdIsCompleted = document.createElement('td');
            const tdDate = document.createElement('td');
            const tdTime = document.createElement('td');
            const tdNote = document.createElement('td');
            const tdModifica = document.createElement('td');
            const tdElimina = document.createElement('td');

            tdTitle.textContent = task.title;
            tdTitle.style.fontWeight = "600";
            
            tdIsCompleted.textContent = task.is_completed ? '● fatta' : '○ non fatta';
            tdIsCompleted.style.color = task.is_completed ? "#27ae60" : "#e74c3c";
            tdIsCompleted.style.fontWeight = "bold";

            tdDate.textContent = task.date;
            tdTime.textContent = task.time;

            // --- TABELLA DELLE NOTE ---
            const tableNote = document.createElement('table');
            tableNote.className = "inner-note-table";
            
            if (task.notes) {
                for (const note of task.notes) {
                    const trNote = document.createElement('tr');
                    trNote.style.backgroundColor = note.is_completed ? "#c6f6d5" : "#feebc8";

                    const tdContentNote = document.createElement('td');
                    const tdStatusNote = document.createElement('td');
                    const tdActionNote = document.createElement('td');

                    tdContentNote.textContent = note.description;
                    tdStatusNote.textContent = note.is_completed ? 'fatta' : 'non fatta';
                    tdStatusNote.style.color = note.is_completed ? "#38a169" : "#e53e3e";
                    tdStatusNote.style.fontSize = "0.85em";

                    // Container Flex per allineare i bottoni orizzontalmente
                    const actionContainer = document.createElement('div');
                    actionContainer.className = "note-actions-container";

                    const btnEditNote = document.createElement('button');
                    btnEditNote.textContent = 'modifica';
                    btnEditNote.className = "btn btn-edit btn-note"; // Classe piccola
                    btnEditNote.onclick = async () => {
                        if (btnEditNote.textContent === 'modifica') {
                            const inp = document.createElement('input');
                            inp.value = note.description;
                            const chk = document.createElement('input');
                            chk.type = 'checkbox';
                            chk.checked = note.is_completed;
                            tdContentNote.innerHTML = ''; tdContentNote.appendChild(inp);
                            tdStatusNote.innerHTML = ''; tdStatusNote.appendChild(chk);
                            btnEditNote.textContent = 'salva';
                        } else {
                            const newDesc = tdContentNote.querySelector('input').value;
                            const newStatus = tdStatusNote.querySelector('input').checked;
                            await apiRequest(`${API_HOST}/notes/${note.id}`, "PUT", { 
                                description: newDesc,
                                is_completed: newStatus
                            }, token);
                            await getAllTask();
                        }
                    };

                    const btnDelNote = document.createElement('button');
                    btnDelNote.textContent = 'elimina';
                    btnDelNote.className = "btn btn-delete btn-note"; // Classe piccola
                    btnDelNote.onclick = async () => {
                        await apiRequest(`${API_HOST}/notes/${note.id}`, "DELETE", null, token);
                        await getAllTask();
                    };

                    actionContainer.append(btnEditNote, btnDelNote);
                    tdActionNote.appendChild(actionContainer);
                    trNote.append(tdContentNote, tdStatusNote, tdActionNote);
                    tableNote.append(trNote);
                }
            }
            
            // Riga aggiunta nota
            const trAddNote = document.createElement('tr');
            const inputNewNote = document.createElement('input');
            inputNewNote.placeholder = "+ nota";
            const btnSaveNote = document.createElement('button');
            btnSaveNote.textContent = 'ok';
            btnSaveNote.className = "btn btn-note-add btn-note";
            
            btnSaveNote.onclick = async () => {
                if (inputNewNote.value.trim() !== "") {
                    await apiRequest(`${API_HOST}/tasks/${task.id}/notes`, "POST", { 
                        description: inputNewNote.value, 
                        is_completed: false 
                    }, token);
                    await getAllTask();
                }
            };
            const tdInp = document.createElement('td'); tdInp.appendChild(inputNewNote);
            const tdBt = document.createElement('td'); tdBt.appendChild(btnSaveNote);
            trAddNote.append(tdInp, document.createElement('td'), tdBt);
            tableNote.append(trAddNote);
            tdNote.appendChild(tableNote);

            // --- BOTTONI TASK (MODIFICA TITOLO, STATO, DATA E ORA) ---
            const btnEdit = document.createElement('button');
            btnEdit.textContent = 'modifica';
            btnEdit.className = "btn btn-edit";
            btnEdit.onclick = async () => {
                if(btnEdit.textContent === 'modifica') {
                    const inputTitle = document.createElement('input'); 
                    inputTitle.value = tdTitle.textContent;
                    
                    const inputIsCompleted = document.createElement('input'); 
                    inputIsCompleted.type = 'checkbox'; 
                    inputIsCompleted.checked = task.is_completed;
                    
                    const inputDate = document.createElement('input');
                    inputDate.type = 'date';
                    inputDate.value = task.date;

                    const inputTime = document.createElement('input');
                    inputTime.type = 'time';
                    inputTime.value = task.time;

                    tdTitle.innerHTML = ""; tdTitle.appendChild(inputTitle);
                    tdIsCompleted.innerHTML = ""; tdIsCompleted.appendChild(inputIsCompleted);
                    tdDate.innerHTML = ""; tdDate.appendChild(inputDate);
                    tdTime.innerHTML = ""; tdTime.appendChild(inputTime);
                    
                    btnEdit.textContent = "salva";
                } else {
                    const body = {
                        title: tdTitle.querySelector('input').value,
                        is_completed: tdIsCompleted.querySelector('input').checked,
                        date: tdDate.querySelector('input').value,
                        time: tdTime.querySelector('input').value
                    };
                    
                    await apiRequest(`${API_HOST}/tasks/${task.id}`, "PUT", body, token);
                    await getAllTask();
                }
            };

            const btnDelete = document.createElement('button');
            btnDelete.textContent = 'elimina';
            btnDelete.className = "btn btn-delete";
            btnDelete.onclick = async () => {
                const success = await apiRequest(`${API_HOST}/tasks/${task.id}`, "DELETE", null, token);
                if (success) {
                    await getAllTask();
                }
            };

            tdModifica.appendChild(btnEdit);
            tdElimina.appendChild(btnDelete);

            tr.append(tdTitle, tdIsCompleted, tdDate, tdTime, tdNote, tdModifica, tdElimina);
            table.append(tr);
        }
        container.appendChild(table);
    }
}

getAllTask();

// LOGOUT
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        const token = localStorage.getItem('token');
        if (token) await apiRequest(`${API_HOST}/logout`, 'POST', null, token);
        localStorage.removeItem('token');
        window.location.href = '../login/login.html';
    });
}

// INVIO TASK
if (formTodo) {
    formTodo.addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const body = {
            title: document.getElementById('title').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value
        };
        const res = await apiRequest(`${API_HOST}/tasks`, 'POST', body, token);
        if (res) { 
            getAllTask();
            formTodo.reset();
        }
    });
}


async function apiRequest(url, method, data = null, token = null) {
    const options = {
        method,
        headers : { "Content-Type" : "application/json", "Accept" : "application/json" }
    };
    if (token) options.headers["Authorization"] = `Bearer ${token}`;
    if (method !== 'GET' && data) options.body = JSON.stringify(data);

    try {
        const response = await fetch(url, options);
        if (response.status === 204) return true;
        
        const json = await response.json();

        if (!response.ok) {
            if (taskResult) taskResult.textContent = json.message || "Errore";
            return null;
        } else {
            
            if (taskResult && method !== 'GET' && json.message) {
                taskResult.textContent = json.message;
                taskResult.style.color = "#27ae60"; 
            }
        }
        return json;
    } catch (err) {
        console.error("Errore connessione:", err);
        if (taskResult) taskResult.textContent = "Errore di connessione al server";
        return null;
    }
}

