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
const tb = document.querySelector("#tb");
axios.post(`${backendURL}/courses`, { token: auth, refid: refid })
    .then((response) => {

            for (var i = 0; i < response.data.length; i++) {
                console.log("R:", response.data[i]);
                const tr = document.createElement("tr");
                tr.innerHTML = `<td>${i+1}</td><td>${response.data[i].course}</td><td>${response.data[i].cmateria.slice(0, 100)}</td><td>${response.data[i].uploaded==false? `<a href="upload.html" class="btn btn-primary">Upload pdf</a>`:"Material Uploaded"}</td><td style="display:flex;">
                                        <form id=${response.data[i]._id}>
                                        <input value=${response.data[i]._id} hidden>
                                        <button class="btn btn-sm btn-danger">Delete</button>
                                        </form>
                                        
                                        <a class="btn btn-sm btn-primary mx-2" href=coursedetail.html?course=${response.data[i]._id}>Details</a>
                                    </td>`
              tb.appendChild(tr);
              document.getElementById(`${response.data[i]._id}`).addEventListener('submit', (e)=>{
                    e.preventDefault();
                    console.log("CourseId: ", e.target[0].value);
                    let courseId=e.target[0].value;
                    axios.post(`${backendURL}/dcourse`, { token: auth, courseId: courseId})
                    .then((response) => {
                            console.log(response);
                            alert(response.data.msg)
                            location.reload();
                        })
                    .catch((error)=>{
                        console.log(erroe)
                    })
              });

        }
        
    })

// function to delete course
// function deleteCourse(e){
//         e.preventDefault();
//         console.log(e.target)
//     }