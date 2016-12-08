import fetch from 'isomorphic-fetch';
import { subscribeUrl } from 'config';

const form = document.getElementById('form');
const nameInput = document.getElementById('name');
const phoneInput = document.getElementById('phone');
const submitButton = document.getElementById('submitButton');
const spinner = document.getElementById('spinner');
const success = document.getElementById('success');
const error = document.getElementById('error');
const invalid = document.getElementById('invalid');

form.addEventListener('submit', () => {
    error.classList.add('hidden');
    const name = nameInput.value;
    const phone = phoneInput.value;
    if (!name || !phone || !phone.match(/\+[0-9]{11}/)) {
        invalid.classList.remove('hidden');
        return;
    }

    submitButton.disabled = true;
    invalid.classList.add('hidden');
    spinner.classList.remove('hidden');

    fetch(subscribeUrl, {
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
    .then(response => response.text())
    .then(response => Promise.resolve(JSON.parse(response)))
    .then((response) => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
            success.classList.remove('hidden');
            form.classList.add('hidden');
            throw new Error(response.body);
        }
        error.classList.remove('hidden');
        submitButton.disabled = false;
        spinner.classList.add('hidden');

    })
    .catch((err) => {
        console.log(err);
    });
});
