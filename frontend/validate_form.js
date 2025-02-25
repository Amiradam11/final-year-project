// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
})()
const backendURL = 'http://localhost:6300/user';
// Getting form fields
const signupForm = document.querySelector("#signup");
const email = document.querySelector("#validationCustomUsername");
const password = document.querySelector("#validationCustom02");
const username = document.querySelector("#validationCustom01");
const rpassword = document.querySelector("#validationCustom03");
const btn = document.querySelector("#btn");
const cp = document.querySelector(".cp");
const em = document.querySelector(".em");
const un = document.querySelector(".un");
btn.style.display = "none";
cp.style.display = "none";
em.style.display = "none";
un.style.display = "none";
rpassword.addEventListener("input", comparePassword);
username.addEventListener("input", valUsername);
password.addEventListener("input", comparePassword);
email.addEventListener("input", valEmail);
signupForm.addEventListener("submit", createAccount);
// validate username
function valUsername() {
    console.log(username.value)
    if (username.value.length >= 5) {
        un.style.display = "block";
        un.textContent = "Looks good!";
        un.style.color = "green";
        username.style.border = "1px solid green"
    } else {
        un.style.display = "block";
        un.style.color = "red";
        un.textContent = "Name must not be lesser than 5 characters!";
        username.style.border = "1px solid red"
    }
}

function valEmail() {
    console.log(email.value)
    if (email.value.includes("@")) {
        em.style.display = "block";
        em.textContent = "Looks better, just make sure it is valid!";
        em.style.color = "green";
        email.style.border = "1px solid green"
    } else {
        em.style.display = "block";
        em.style.color = "red";
        em.textContent = "Enter correct email ID!";
        email.style.border = "1px solid red"
    }
}

function comparePassword() {
    console.log(rpassword.value, password.value)
    if ((password.value.length > 5) && (rpassword.value === password.value)) {
        btn.style.display = "block"
        cp.style.display = "none";
        rpassword.style.border = "none"
    } else {
        btn.style.display = "none"
        cp.style.display = "block";
        cp.style.color = "red";
        rpassword.style.border = "1px solid red"
    }
}

function createAccount(e) {
    e.preventDefault();
    console.log(username.value, email.value, password.value)
    let newUser = {
            email: email.value,
            password: password.value,
            fullname: username.value
        }
        // log new user detail on console
    console.log(newUser);
    // send data to api
    axios.post(`${backendURL}/register`, newUser)
        .then(function(response) {

            // console.log('refid',response.data.refid);
            // document.cookie = `user={email}; expires={expires.toUTCString()}; path=/`;
            // https://cdnjs.cloudflare.com/ajax/libs/sweetalert/2.1.0/sweetalert.min.js
            swal(response.data.status, response.data.message, response.data.status)
                // .then(() => {
                //     if (response.data.status === 'success') {
                //         // Handle the successful response
                //         console.log(response.data);
                //         let expires = new Date(Date.now() + 1 * 86400000);
                //         localStorage.setItem('refid', response.data.refid);
                //         localStorage.setItem('username', response.data.fullname);
                //         localStorage.setItem('auth', response.data.xAuthToken);
                //         window.location.href = "http://localhost:3000/dashboard"
                //     }
                // });
                // Swal.fire({
                //     title: response.data.status,
                //     text: response.data.message,
                //     icon: response.data.status
                // }).then(() => {
                //     if (response.data.status === 'success') {
                //         // Handle the successful response
                //         console.log(response.data);
                //         let expires = new Date(Date.now() + 1 * 86400000);
                //         localStorage.setItem('refid', response.data.refid);
                //         localStorage.setItem('username', response.data.fullname);
                //         localStorage.setItem('auth', response.data.xAuthToken);
                //         window.location.href = "http://localhost:3000/dashboard"
                //     }
                // });
        })
        .catch(function(error) {
            // Handle the error
            console.log(error);
            swal('Unsuccessful', 'Something went wrong. Try again!', 'error')
                // Swal.fire({
                //     title: 'Unsuccessful',
                //     text: 'Something went wrong!',
                //     icon: 'error'
                // });
        });

}

// process login
function processLogin(e) {
    e.preventDefault();
    console.log(email.value, password.value)
    let newUser = {
            email: email.value,
            password: password.value
        }
        // log new user detail on console
    console.log(newUser);
    // send data to api
    axios.post(`${backendURL}/login`, newUser)
        .then(function(response) {

            // console.log('refid',response.data.refid);
            // document.cookie = `user={email}; expires={expires.toUTCString()}; path=/`;
            // https://cdnjs.cloudflare.com/ajax/libs/sweetalert/2.1.0/sweetalert.min.js
            swal(response.data.status, response.data.message, response.data.status)
                .then(() => {
                    if (response.data.status === 'success') {
                        // Handle the successful response
                        console.log(response.data);
                        let expires = new Date(Date.now() + 1 * 86400000);
                        localStorage.setItem('refid', response.data.refid);
                        localStorage.setItem('username', response.data.fullname);
                        localStorage.setItem('auth', response.data.xAuthToken);
                        window.location.href = "http://localhost:3000/dashboard"
                    }
                });
            // Swal.fire({
            //     title: response.data.status,
            //     text: response.data.message,
            //     icon: response.data.status
            // }).then(() => {
            //     if (response.data.status === 'success') {
            //         // Handle the successful response
            //         console.log(response.data);
            //         let expires = new Date(Date.now() + 1 * 86400000);
            //         localStorage.setItem('refid', response.data.refid);
            //         localStorage.setItem('username', response.data.fullname);
            //         localStorage.setItem('auth', response.data.xAuthToken);
            //         window.location.href = "http://localhost:3000/dashboard"
            //     }
            // });
        })
        .catch(function(error) {
            // Handle the error
            console.log(error);
            swal('Unsuccessful', 'Something went wrong. Try again!', 'error')
                // Swal.fire({
                //     title: 'Unsuccessful',
                //     text: 'Something went wrong!',
                //     icon: 'error'
                // });
        });

}