const refid = localStorage.getItem('refid');
const auth = localStorage.getItem('auth');
const lsUsername = localStorage.getItem('username');
const backendURL = 'http://localhost:6300/user';
const username = document.querySelectorAll('#username');
username[0].textContent = lsUsername;
axios.post(`${backendURL}/user`, { token: auth, refid: refid })
    .then(function(response) {
        console.log(response.data);
        username[0].textContent = response.data.fullname;
        username[1].textContent = response.data.fullname;
    })

// fetch user courses
const courses = document.querySelector("#coursename");
axios.post(`${backendURL}/courses`, { token: auth, refid: refid })
    .then((response) => {

        for (var i = 0; i < response.data.length; i++) {
            console.log("R:", response.data[i]);
            const option = document.createElement("option");
            option.innerHTML = `${response.data[i].course}`
            courses.appendChild(option);
        }

    })
const uploadF = document.querySelector("#uploadForm");
uploadF.addEventListener("submit", uploadMaterial)
const pdfM = document.querySelector("#exampleInputEmail1");
document.querySelector("#uploadbtn").style.display = "none";
let msg = document.querySelector(".msg");
pdfM.addEventListener("change", function() {
    console.log(this.files[0]);
    let ext = this.files[0].name.split('.').pop();
    if (ext != "pdf") {
        document.querySelector("#uploadbtn").style.display = "none";
        msg.textContent = "Only pdf files are allowed"
        msg.style.color = "red";
        msg.style.padding = "5px";
        msg.style.border = "2px solid red";
        msg.style.width = "100%";
        msg.style['text-align'] = "center";

        // alert("Only pdf files are allowed");
    } else {
        document.querySelector("#uploadbtn").style.display = "block";
        msg.textContent = "Attached file looks good!"
        msg.style.color = "green";
        msg.style.padding = "5px";
        msg.style.border = "2px solid green";
        msg.style.width = "100%";
        msg.style['text-align'] = "center";
    }
})

function uploadMaterial(e) {
    e.preventDefault();
    const course = document.querySelector("#coursename").value;
    let attachedpdf = pdfM.files[0];
    const formData = new FormData();
    formData.append('file', attachedpdf);
    formData.append('course', course);
    formData.append('token', auth);
    console.log(attachedpdf);
    axios.post(`${backendURL}/upload`, { token: auth, refid: refid, course: course, file: attachedpdf }, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'x-access-token': auth
            }
        })
        .then((response) => {

            console.log("Res: ", response.data);
            msg.textContent = response.data;
            msg.style.color = "green";
            msg.style.padding = "8px";
            msg.style.border = "2px solid green";
            msg.style.width = "100%";
            msg.style['text-align'] = "center";
            alert(response.data)

        }).catch((error) => {
            console.log("Error: ", error.message)
        })
}