const rid = localStorage.getItem('refid');
const aut = localStorage.getItem('auth');
if(rid=='' || rid=='undefine' || rid=="null" || aut=='' || aut=='undefine' || aut=="null"){
	window.location.href="../login.html"
}