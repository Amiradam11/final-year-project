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
    })

// fetch user courses
const tb=document.querySelector("#tb");
axios.post(`${backendURL}/courses`, { token: auth, refid: refid })
    .then((response) => { 
        
        for(var i=0; i<response.data.length; i++){
            console.log("R:", response.data[i]);
          const tr =document.createElement("tr"); 
          tr.innerHTML=`<td>${i+1}</td><td>${response.data[i].course}</td><td>${response.data[i].cmateria}</td><td>${response.data[i].uploaded==false? `<a href="">Upload pdf</a>`:"Material Uploaded"}</td><td>
                                        <a class="btn btn-sm btn-danger" href="">Delete</a>
                                        <a class="btn btn-sm btn-primary" href="">View Details</a>
                                    </td>`
          tb.appendChild(tr);
        }
        
    })