// Function declarations
// async function checkLogin() {
//     const response = await fetch('/token', {
//         method: 'GET',
//         headers: { 'Authorization': localStorage.getItem('token') }
//     })
//     .then(res => {
//         if (res.ok) {
//             window.location.href = 'todo.html';
//         }
//     })
//     .catch(err => {
//         console.error('Error checking token:', err);
//     });
// }

// Run on site refresh
// checkLogin();

// async function getTime() {
//     try {
//         const response = await fetch('/time', { method: 'GET' });
//         const data = await response.json();
//         document.getElementById('clock').textContent = `${data.day}.${data.month}.${data.year} - ${data.hour}:${data.minute}:${data.second}`;
//     } catch (error) {
//         console.error('Fehler beim Abrufen der Zeit:', error);
//     }
// }
// getTime();