import fetch from 'isomorphic-fetch';

const submit = document.getElementById('form');
const nameInput = document.getElementById('name');
const phoneInput = document.getElementById('phone');

submit.addEventListener('submit', () => {
    fetch('http://localhost:8000/subscribe', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({
            name: nameInput.value,
            phone: phoneInput.value,
        }),
    })
    .then((result) => {
        console.log(result);
    })
    .catch((error) => {
        console.log(error);
    });
});
