const btn = document.getElementById('btn');

btn.addEventListener('click', createES);

function createES() {
  const eventSource = new EventSource('/test');

  eventSource.addEventListener('message', (event) => {
    console.log(event);
  });
}

async function sendTurnasync() {
  try {
    const resoponse = await fetch('/turn');
    const data = await resoponse.json();

    return data;
  } catch (error) {
    console.error(error);
  }
}
