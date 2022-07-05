const regForm = document.querySelector('.regForm');
const regStatus = document.querySelector('.regStatus');
// Запрос
regForm.addEventListener('submit', (event)=>{
    event.preventDefault();
    regStatus.classList.remove('warning');
    const data = Object.fromEntries(new FormData(event.target).entries());
    const req = new XMLHttpRequest();
    req.open('POST', 'http://localhost:3000/regform');
    req.responseType = "json";
    req.setRequestHeader('Content-Type', 'application/json');
    req.onreadystatechange = function() {
        if (this.readyState != 4) return;
        console.log(typeof this.response)
        if(this.response.error){
            regStatus.classList.add('warning');
        }
        regStatus.innerText = this.response.message;
    }
    req.send(JSON.stringify(data));		
})