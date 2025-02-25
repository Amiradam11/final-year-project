let logoutBtn = document.querySelector("#logout");
logoutBtn.addEventListener("click", logout);

function logout() {
    axios.get(`${backendURL}/logout`)
        .then((response) => {

            console.log(response.data);
            localStorage.clear();
            alert(`${response.data.msg}`)
            window.location.href = "../login.html";
            // window.location.href = "../login.html";

        })

}