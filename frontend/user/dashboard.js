
const school = document.querySelector('#school');
const course = document.querySelector('#course');
const tsubj = document.querySelector('#tsubject');
const refid = localStorage.getItem('refid');
const auth = localStorage.getItem('auth');
const lsUsername = localStorage.getItem('username');
const backendURL = 'http://localhost:6300/user';
const username = document.querySelectorAll('#username');
username[0].textContent = lsUsername;
axios.post(`${backendURL}/user`, { token: auth })
    .then(function(response) {
        console.log(response.data);
        username[0].textContent = response.data.fname;
        username[1].textContent = response.data.fname;
        school.textContent = response.data.school;
        course.textContent = response.data.course;
        tsubj.textContent = response.data.courses.length
    })

// add new course
let cname = document.querySelector('#exampleInputEmail1');
let addform = document.querySelector('#addcourse');
addform.addEventListener('submit', (e) => {
    e.preventDefault();
    let cmsg=document.querySelector('.msg')
    axios.post(`${backendURL}/course`, { token: auth, refid: refid, course: cname.value })
        .then(function(response) {
            console.log(response.data);
            cmsg.textContent=`${response.data.status} : ${response.data.message}`;
            
            cmsg.style.textAlign="center";
            cmsg.style.border="1px green solid";
            cmsg.style.padding="5px";
            setTimeout(()=>{
                cmsg.style.display='none';
            }, 10000)

            if(response.data.status==="success"){
                cmsg.style.color="green";
                cmsg.style.border="1px green solid";
            }else{
                cmsg.style.color="red";
                cmsg.style.border="1px red solid";
            }
        })

})

// fetch user courses
axios.post(`${backendURL}/courses`, { token: auth, refid: refid })
    .then((response) => { console.log("R:", response) })