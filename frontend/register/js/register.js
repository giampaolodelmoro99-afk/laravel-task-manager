const registrationForm = document.getElementById('registration-form');

const inputFullName = document.getElementById('full-name-register');
const inputEmail = document.getElementById('email-register');
const inputPassword = document.getElementById('password-register');
const inputConfirmPassword = document.getElementById('confirm-password-register');

const errorFullNameField = document.getElementById('error-full-name-field');
const errorEmailField = document.getElementById('error-email-field');
const errorPasswordField = document.getElementById('error-password-field');
const errorConfirmPasswordField = document.getElementById('error-confirm-password-field');

const resultRegistration = document.getElementById('registration-result');


function errorFullName(){

    const nameRegex = /^[A-Za-zÀ-ÿ'\s]+$/;

    if(inputFullName.value === ""){
        errorFullNameField.style.color = "#dc3545"
        errorFullNameField.textContent = "*Campo obbligatorio";

        return false;
    }

    if(!nameRegex.test(inputFullName.value)){
        errorFullNameField.style.color = "#dc3545"
        errorFullNameField.textContent = "*Campo invalido";

        return false;
    }
    
    return true;
}

function errorEmail(){

    if(inputEmail.value === ""){
        errorEmailField.style.color = "#dc3545"
        errorEmailField.textContent = "*Campo obbligatorio";
        
        return false;
    }

    if(!inputEmail.checkValidity()){
        errorEmailField.style.color = "#dc3545"
        errorEmailField.textContent = "*Campo invalido";

        return false;
    }

    return true;

}

function errorPassword(){

    if(inputPassword.value === ""){
        errorPasswordField.style.color = "#dc3545";
        errorPasswordField.textContent = "*Campo obbligatorio";

        return false;
    }

    if(!inputPassword.checkValidity()){
        errorPasswordField.style.color = "#dc3545"
        errorPasswordField.textContent = "*Campo invalido";

        return false;
    }

    return true;

}

function errorConfirmPassword(){

    if(inputConfirmPassword.value === ""){
        errorConfirmPasswordField.style.color = "#dc3545";
        errorConfirmPasswordField.textContent = "*campo obbligatorio";
        
        return false;
    }

    if(!inputConfirmPassword.checkValidity()){
        errorConfirmPasswordField.style.color = "#dc3545"
        errorConfirmPasswordField.textContent = "*Campo invalido";

        return false;
    }

    if(inputConfirmPassword.value != inputPassword.value){
        errorConfirmPasswordField.style.color = "#dc3545";
        errorConfirmPasswordField.textContent = "*Le password non corrispondono"

        return  false;
    }

    return true;

}


registrationForm.addEventListener('submit', async (e) =>{

    e.preventDefault();

    errorFullNameField.textContent = "";
    errorEmailField.textContent = "";
    errorPasswordField.textContent = "";
    errorConfirmPasswordField.textContent = "";


    const isFullNameValid = errorFullName();
    const isEmailValid = errorEmail();
    const isPasswordValid = errorPassword();
    const isConfirmPasswordValid = errorConfirmPassword();

    if(!isFullNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid){
        return;
    }else{
        
        const body = {
            name : inputFullName.value,
            email : inputEmail.value,
            password : inputPassword.value
        };

        const options = {
            method : 'POST',
            headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
            },
            body : JSON.stringify(body)
        };

        try{
            
            const response = await fetch('http://localhost:8000/api/register', options);
            const data = await response.json();

            if(!response.ok){
                resultRegistration.style.color = "#dc3545";
                resultRegistration.textContent = "Uno o più campi invalidi";
            }else{
                window.location.href = "../login/login.html"
            }


        }catch(err){
            resultRegistration.style.color = "#dc3545";
            resultRegistration.textContent = 'impossibile connetersi al server';
        }

    }
});