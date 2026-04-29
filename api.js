const BASE_URL = "https://joe-backend-61qy.onrender.com";

async function sendData() {
  try {
    const res = await fetch(`${BASE_URL}/data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pir_motion: true,
        ir_proximity_cm: Math.floor(Math.random() * 100),
        mq135_gas_ppm: Math.floor(Math.random() * 500),
      }),
    });
    return await res.json();
  } catch (err) {
    console.error("Send error:", err);
  }
}

async function getData() {
  try {
    const res = await fetch(`${BASE_URL}/data`);
    const data = await res.json();
    return Array.isArray(data) ? data[0] : data;
  } catch (err) {
    console.error("Fetch error:", err);
  }
}