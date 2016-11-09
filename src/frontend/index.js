import fetch from 'isomorphic-fetch';

const submit = document.getElementById('form');
submit.addEventListener('submit', (e) => {
    fetch('http://localhost:8000/subscribe', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: 'name',
            tel: 'tel',
        }),
    });
});
