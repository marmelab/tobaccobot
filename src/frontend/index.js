import fetch from 'isomorphic-fetch';

const submit = document.getElementById('form');
const nameInput = document.getElementById('name');
const telInput = document.getElementById('tel');

submit.addEventListener('submit', () => {
    fetch('http://localhost:8000/subscribe', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: nameInput.value,
            tel: telInput.value,
        }),
    });
});
