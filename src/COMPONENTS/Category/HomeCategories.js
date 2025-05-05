import React, { useState } from 'react';
import './HomeCategories.css';

const HomeCategories = () => {
  const [address, setAddress] = useState('');

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=2572ed4a0257fa7a987ffd5229836841&lang=en`
          );
          const data = await response.json();

          if (data && data.name) {
            setAddress(data.name);
          } else {
            alert('Unable to retrieve your city');
          }
        } catch (error) {
          console.error('Location error:', error);
          alert('Error retrieving your city');
        }
      },
      (error) => {
        alert('Unable to get your location');
        console.error(error);
      }
    );
  };

  return (
    <div className='homecategories'>
      <div className='container'>
        <video
          autoPlay
          loop
          muted
          playsInline
          width="100%"
          height="100%"
          className="animated-video"
        >
          <source
            src="https://media.istockphoto.com/id/1371167585/video/tasty-steak.mp4?s=mp4-640x640-is&k=20&c=HWZrBJ0gZKZx7pHzNsD9g0A-4K30HxvEEDRUeHikuWc="
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        <div className='content'>
          <h1>Food delivered</h1>
          <p>straight to your door</p>
          <strong>Supermarkets, stores, etc.</strong>

          <div className="search-bar">
            <input
              type="text"
              placeholder="What's your city?"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <button onClick={handleUseLocation}>📍 Use my location</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeCategories;
