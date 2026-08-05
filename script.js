const N8N_WEBHOOK_URL = 'https://m4ylttz.app.n8n.cloud/webhook-test/dulce-cumple/nuevo-cliente';

const form = document.querySelector('#client-form');
const submitButton = form.querySelector('button[type="submit"]');
const message = document.querySelector('#form-message');

async function sendClientToWebhook(clientData) {
  const body = new URLSearchParams(clientData);

  const response = await fetch(N8N_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Webhook respondió ${response.status}: ${text}`);
  }

  return response.text();
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  message.textContent = '';
  submitButton.disabled = true;
  submitButton.textContent = 'Enviando...';

  const data = new FormData(form);
  const clientData = {
    id: crypto.randomUUID(),
    name: data.get('name').trim(),
    email: data.get('email').trim(),
    birthday: data.get('birthday')
  };

  try {
    await sendClientToWebhook(clientData);
    form.reset();
    message.textContent = '¡Cliente enviado con éxito a n8n!';
  } catch (error) {
    console.error('No se pudo enviar el cliente al webhook de n8n:', error);
    if (error.message.includes('404')) {
      message.textContent = 'Webhook no encontrado (404). Revisa la URL en n8n.';
    } else {
      message.textContent = 'Error enviando el cliente. Revisa la URL del webhook o configura CORS en n8n.';
    }
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Guardar cliente →';
  }

  setTimeout(() => { message.textContent = ''; }, 4500);
});
