import React, { useState, useEffect, useCallback } from 'react';
import { 
  MapPin, 
  Clock, 
  Bus, 
  Navigation, 
  Star, 
  AlertCircle,
  Wifi,
  WifiOff,
  RefreshCw
} from 'lucide-react';
import './App.css';

const cityData = {
  "Visakhapatnam": {
    "6": { 
      stops: ["Simhachalam", "Gajuwaka", "Gopalapatnam", "NAD Junction", "Kancharapalem", "Convent Junction", "Town Kotharoad"], 
      freq: 10,
      route: "Simhachalam - Town Kotharoad",
      fare: "₹15-25"
    },
    "6A": { 
      stops: ["RTC Complex", "Railway Station", "Kancharapalem", "NAD Junction", "Gopalapatnam", "Simhachalam Hill"], 
      freq: 10,
      route: "RTC Complex - Simhachalam Hill",
      fare: "₹12-22"
    },
    "10A": { 
      stops: ["Airport", "NAD Junction", "Gurudwara", "RTC Complex", "RK Beach"], 
      freq: 15,
      route: "Airport - RK Beach",
      fare: "₹20-35"
    },
    "5D": { 
      stops: ["Town Kotharoad", "Convent", "Kancharapalem", "NAD Junction", "Gopalapatnam", "Pendurthi"], 
      freq: 12,
      route: "Town Kotharoad - Pendurthi",
      fare: "₹18-28"
    },
    "10K": { 
      stops: ["RTC Complex", "Jagadamba", "RK Beach", "VUDA Park", "Tenneti Park", "Kailasagiri"], 
      freq: 12,
      route: "RTC Complex - Kailasagiri",
      fare: "₹15-30"
    },
    "28": { 
      stops: ["RK Beach", "Jagadamba Centre", "RTC Complex", "NAD Junction", "Gopalapatnam", "Simhachalam"], 
      freq: 10,
      route: "RK Beach - Simhachalam",
      fare: "₹12-25"
    }
  },
  "Vijayawada": {
    "1": { 
      stops: ["PNBS", "Benz Circle", "Governorpet", "Madhurawada"], 
      freq: 12,
      route: "PNBS - Madhurawada",
      fare: "₹10-18"
    },
    "2K": { 
      stops: ["PNBS", "Auto Nagar", "Poranki", "Gollapudi"], 
      freq: 15,
      route: "PNBS - Gollapudi",
      fare: "₹15-25"
    },
    "5G": { 
      stops: ["PNBS", "Governorpet", "Gunadala", "Enikepadu"], 
      freq: 15,
      route: "PNBS - Enikepadu",
      fare: "₹12-22"
    },
    "10": { 
      stops: ["PNBS", "Auto Nagar", "Gannavaram Airport"], 
      freq: 20,
      route: "PNBS - Airport",
      fare: "₹25-40"
    }
  },
  "Guntur": {
    "21": { 
      stops: ["Guntur Bus Stand", "Brodipet", "Arundelpet", "Nallapadu"], 
      freq: 15,
      route: "Bus Stand - Nallapadu",
      fare: "₹8-15"
    },
    "22": { 
      stops: ["Guntur Bus Stand", "Sangadigunta", "Chowdavaram", "Sattenapalli"], 
      freq: 20,
      route: "Bus Stand - Sattenapalli",
      fare: "₹12-25"
    },
    "23": { 
      stops: ["Guntur Bus Stand", "Railway Station", "Pedakakani", "Tenali"], 
      freq: 25,
      route: "Bus Stand - Tenali",
      fare: "₹15-30"
    },
    "24": { 
      stops: ["Guntur Bus Stand", "Market", "Bhimavaram Junction", "Narasaraopet"], 
      freq: 25,
      route: "Bus Stand - Narasaraopet",
      fare: "₹18-35"
    }
  },
  "Tirupati": {
    "101": { 
      stops: ["Tirupati Bus Stand", "Leela Mahal Circle", "Alipiri", "Tirumala"], 
      freq: 15,
      route: "Bus Stand - Tirumala",
      fare: "₹20-35"
    },
    "102": { 
      stops: ["Tirupati Bus Stand", "Renigunta", "Airport", "Karvetinagaram"], 
      freq: 25,
      route: "Bus Stand - Karvetinagaram",
      fare: "₹25-45"
    },
    "103": { 
      stops: ["Tirupati Bus Stand", "Kapila Theertham", "Zoo Park", "Chandragiri"], 
      freq: 20,
      route: "Bus Stand - Chandragiri",
      fare: "₹15-28"
    },
    "104": { 
      stops: ["Tirupati Bus Stand", "Dareddy Palem", "Kovur", "Sholinghur"], 
      freq: 22,
      route: "Bus Stand - Sholinghur",
      fare: "₹20-40"
    }
  }
};

function App() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedStop, setSelectedStop] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [favorites, setFavorites] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const computeArrival = useCallback(() => {
    if (!selectedCity || !selectedBus || !selectedStop) return null;

    const now = new Date();
    const start = new Date(now);
    start.setHours(6, 0, 0, 0); // Earlier start time
    const end = new Date(now);
    end.setHours(23, 0, 0, 0); // Later end time

    const busObj = cityData[selectedCity][selectedBus];
    const freq = busObj.freq;

    if (now < start) {
      return {
        time: formatTime(start),
        status: 'Service starts at 6:00 AM',
        minutes: Math.ceil((start - now) / 60000),
        isActive: false
      };
    }

    if (now > end) {
      return {
        time: '--:--',
        status: 'Service ended for today',
        minutes: 0,
        isActive: false
      };
    }

    const minsSince = Math.floor((now - start) / 60000);
    const nextOffset = Math.ceil(minsSince / freq) * freq;
    const nextTime = new Date(start.getTime() + nextOffset * 60000);
    const diff = Math.max(0, Math.ceil((nextTime - now) / 60000));

    return {
      time: formatTime(nextTime),
      status: diff === 0 ? 'Arriving now!' : diff === 1 ? 'Arriving in 1 minute' : `Arriving in ${diff} minutes`,
      minutes: diff,
      isActive: true
    };
  }, [selectedCity, selectedBus, selectedStop]);

  const toggleFavorite = () => {
    if (!selectedCity || !selectedBus || !selectedStop) return;
    
    const favoriteKey = `${selectedCity}-${selectedBus}-${selectedStop}`;
    setFavorites(prev => 
      prev.includes(favoriteKey) 
        ? prev.filter(f => f !== favoriteKey)
        : [...prev, favoriteKey]
    );
  };

  const isFavorite = () => {
    if (!selectedCity || !selectedBus || !selectedStop) return false;
    const favoriteKey = `${selectedCity}-${selectedBus}-${selectedStop}`;
    return favorites.includes(favoriteKey);
  };

  const refresh = () => {
    setLastUpdated(new Date());
    setCurrentTime(new Date());
  };

  const arrival = computeArrival();

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <header className="header">
          <div className="header-content">
            <div className="title-section">
              <Bus className="title-icon" />
              <div>
                <h1>APSRTC Live Tracker</h1>
                <p className="subtitle">Real-time bus tracking for Andhra Pradesh</p>
              </div>
            </div>
            <div className="header-actions">
              <div className="status-indicator">
                {isOnline ? (
                  <Wifi className="status-icon online" />
                ) : (
                  <WifiOff className="status-icon offline" />
                )}
                <span className={`status-text ${isOnline ? 'online' : 'offline'}`}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              <button className="refresh-btn" onClick={refresh}>
                <RefreshCw className="refresh-icon" />
              </button>
            </div>
          </div>
          <div className="current-time">
            <Clock className="time-icon" />
            <span>Current Time: {formatTime(currentTime)}</span>
            <span className="last-updated">Updated: {formatTime(lastUpdated)}</span>
          </div>
        </header>

        {/* City Selection */}
        <section className="selection-card">
          <div className="card-header">
            <MapPin className="card-icon" />
            <h2>Select City</h2>
          </div>
          <div className="button-grid">
            {Object.keys(cityData).map(city => (
              <button
                key={city}
                className={`selection-btn city-btn ${selectedCity === city ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCity(city);
                  setSelectedBus(null);
                  setSelectedStop(null);
                }}
              >
                <span className="btn-text">{city}</span>
                <span className="btn-count">{Object.keys(cityData[city]).length} routes</span>
              </button>
            ))}
          </div>
        </section>

        {/* Bus and Stop Selection */}
        <div className="selection-grid">
          {/* Bus Selection */}
          <section className="selection-card">
            <div className="card-header">
              <Bus className="card-icon" />
              <h2>Select Bus Route</h2>
            </div>
            <div className="selection-content">
              {!selectedCity ? (
                <div className="empty-state">
                  <AlertCircle className="empty-icon" />
                  <p>Please select a city first</p>
                </div>
              ) : (
                <div className="button-list">
                  {Object.entries(cityData[selectedCity]).map(([busNo, busData]) => (
                    <button
                      key={busNo}
                      className={`selection-btn bus-btn ${selectedBus === busNo ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedBus(busNo);
                        setSelectedStop(null);
                      }}
                    >
                      <div className="bus-info">
                        <span className="bus-number">Bus {busNo}</span>
                        <span className="bus-route">{busData.route}</span>
                        <div className="bus-details">
                          <span className="bus-freq">Every {busData.freq} min</span>
                          <span className="bus-fare">{busData.fare}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Stop Selection */}
          <section className="selection-card">
            <div className="card-header">
              <Navigation className="card-icon" />
              <h2>Select Bus Stop</h2>
            </div>
            <div className="selection-content">
              {!selectedBus ? (
                <div className="empty-state">
                  <AlertCircle className="empty-icon" />
                  <p>Please select a bus route first</p>
                </div>
              ) : (
                <div className="button-list">
                  {cityData[selectedCity][selectedBus].stops.map((stop, index) => (
                    <button
                      key={stop}
                      className={`selection-btn stop-btn ${selectedStop === stop ? 'selected' : ''}`}
                      onClick={() => setSelectedStop(stop)}
                    >
                      <div className="stop-info">
                        <span className="stop-number">{index + 1}</span>
                        <span className="stop-name">{stop}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Arrival Information */}
        {arrival && selectedCity && selectedBus && selectedStop && (
          <section className="arrival-card">
            <div className="arrival-header">
              <div className="arrival-title">
                <h3>Next Bus {selectedBus} at {selectedStop}</h3>
                <p className="arrival-subtitle">{selectedCity}</p>
              </div>
              <button 
                className={`favorite-btn ${isFavorite() ? 'active' : ''}`}
                onClick={toggleFavorite}
              >
                <Star className="favorite-icon" />
              </button>
            </div>
            
            <div className="arrival-info">
              <div className="arrival-time">
                <Clock className="arrival-clock" />
                <span className="time-display">{arrival.time}</span>
              </div>
              <div className={`arrival-status ${arrival.isActive ? 'active' : 'inactive'}`}>
                {arrival.status}
              </div>
            </div>

            {arrival.isActive && arrival.minutes > 0 && (
              <div className="progress-container">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${Math.max(10, 100 - (arrival.minutes / cityData[selectedCity][selectedBus].freq * 100))}%` 
                    }}
                  ></div>
                </div>
                <span className="progress-text">
                  {arrival.minutes} min remaining
                </span>
              </div>
            )}

            <div className="route-info">
              <span className="route-text">Route: {cityData[selectedCity][selectedBus].route}</span>
              <span className="fare-text">Fare: {cityData[selectedCity][selectedBus].fare}</span>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="footer">
          <p>
            <strong>Demo Application</strong> - Static timetable data (6:00 AM - 11:00 PM service)
          </p>
          <p>Real-time GPS tracking and live updates coming soon</p>
        </footer>
      </div>
    </div>
  );
}

export default App; 