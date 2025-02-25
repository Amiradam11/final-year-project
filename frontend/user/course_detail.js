let curURL = window.location.href;
console.log(curURL)
const cId = curURL.split("=").pop();
const refid = localStorage.getItem('refid');
const auth = localStorage.getItem('auth');
const lsUsername = localStorage.getItem('username');
const backendURL = 'http://localhost:6300/user';
const username = document.querySelectorAll('#username');
username[0].textContent = lsUsername;
axios.post(`${backendURL}/user`, { token: auth, refid: refid })
    .then(function(response) {
        console.log(response.data);
        username[0].textContent = response.data.fname;
        username[1].textContent = response.data.fname;
    })

// fetch user course details
document.querySelector("#eng").addEventListener("click", showEng);
document.querySelector("#ha").addEventListener("click", showHausa);
const engv = document.querySelector("#engv");
const hausav = document.querySelector("#hausav");
engv.style.display = "none";
engv.style['text-align'] = "justify";
hausav.style.display = "none";
hausav.style['text-align'] = "justify";

const cname = document.querySelector("#cname");
const cceng = document.querySelector(".cceng");
const ccha = document.querySelector(".ccha");
document.querySelector("#summarize").addEventListener("click", summarizeText)
console.log("ID: ", cId);

axios.post(`${backendURL}/coursedetails`, { token: auth, refid: refid, courseId: cId })
    .then((response) => {
        console.log(response.data)
        cname.textContent = response.data.course;
        cceng.textContent = response.data.cmateria;
        ccha.textContent = response.data.transcontent;

    })

function showEng() {
    engv.style.display = "block";
    engv.style['text-align'] = "justify";
    engv.style['over-flow'] = "auto"
    engv.style.height = "80hv"
    hausav.style.display = "none"
}

function showHausa() {
    engv.style.display = "none";
    hausav.style.display = "block";
    hausav.style['text-align'] = "justify";
    hausav.style['over-flow'] = "auto"
    hausav.style.height = "80hv"
}

function summarizeText() {
    let courseNote = cceng.textContent;
    // alert(courseNote)
    axios.post(`${backendURL}/summarize`, { token: auth, refid: refid, courseNote: courseNote })
        .then((response) => {
            console.log(response.data)
                // cname.textContent=response.data.course;
                // cceng.textContent=response.data.cmateria;
                // ccha.textContent=response.data.transcontent;

        })
}