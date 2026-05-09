const loginForm = document.getElementById('login-form');

const email = document.getElementById('email-login');
const password = document.getElementById('password-login');

const resultLogin = document.getElementById('login-result');

loginForm.addEventListener('submit', async (e) =>{
    e.preventDefault();

    const body = {
        email : email.value,
        password : password.value
    };

    const options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(body)
    };

    try {
        const response = await fetch('http://localhost:8000/api/login', options);
        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            window.location.href = '../tasks/tasks.html';
        } else {
            resultLogin.style.color = "#dc3545";
            resultLogin.textContent = data.message;
        }
    } catch (error) {
        resultLogin.textContent = 'Errore di connessione al server';
    }

});