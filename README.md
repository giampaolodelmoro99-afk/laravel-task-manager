# 📋 Task & Notes Management System

Il progetto è un sistema di gestione per attività personali (To-Do List) e note correlate, sviluppato utilizzando Laravel, MySQL e un'interfaccia reattiva in Vanilla JavaScript.

## 📊 Architettura del Database

* **One-to-Many (1:N): Gestione di Users ↔ Tasks** Un utente può creare e gestire molteplici attività, mentre ogni task appartiene univocamente a un singolo utente. Questo garantisce la segregazione dei dati e la sicurezza dell'area personale. Implementato tramite la chiave esterna `user_id` nella tabella `tasks`.

* **One-to-Many (1:N): Gestione di Tasks ↔ Notes** Ogni task può contenere diverse note di approfondimento per gestire dettagli aggiuntivi. Ogni nota è collegata a un singolo task specifico. Implementato tramite la chiave esterna `task_id` nella tabella `notes` con vincolo `cascadeOnDelete` per mantenere l'integrità del database.

## 💻 Tech Stack

Il progetto è stato sviluppato utilizzando le seguenti tecnologie:

* **Backend:** Laravel (API RESTful)
* **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3
* **Database:** MySQL
* **Autenticazione:** Laravel Sanctum (Token-based)
