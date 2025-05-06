import axios from 'axios';

export const scanBarcode = async (barcode) => {
  try {
    const response = await axios.get(`/barcode/scan/${barcode}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erreur de scan');
  }
};

export const initScanner = (onDetected) => {
  Quagga.init({
    inputStream: {
      name: "Live",
      type: "LiveStream",
      target: document.querySelector('#scanner-container'),
      constraints: { facingMode: "environment" }
    },
    decoder: { readers: ["ean_reader", "ean_8_reader"] }
  }, (err) => {
    if (err) throw err;
    Quagga.start();
    Quagga.onDetected(onDetected);
  });
};