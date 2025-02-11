const backendURL = 'http://localhost:6300/user';
// Getting form fields
const loginForm = document.querySelector("#signin");
const email = document.querySelector("#validationCustomUsername");
const password = document.querySelector("#validationCustom02");
loginForm.addEventListener("submit", processLogin);
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
                        window.location.href = "user/"
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