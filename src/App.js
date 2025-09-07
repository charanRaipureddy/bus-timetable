import React, { useState, useEffect, useCallback } from "react";
import {
  Star,
  Wifi,
  WifiOff,
  RefreshCw,
  AlertCircle,
  MapPin,
  LogIn,
  LogOut,
} from "lucide-react";
import "./App.css";

const formatTime = (date) =>
  date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

const parseFreqToMinutes = (freq) => {
  if (!freq) return 15;
  const m = String(freq).match(/(\\d+)\\s*(min|hr|hour|minute|minutes)/i);
  if (m) {
    let n = parseInt(m[1], 10);
    const unit = (m[2] || "").toLowerCase();
    if (unit.startsWith("hr") || unit.startsWith("hour")) n *= 60;
    return n;
  }
  return 15;
};

const parseTimeStringToToday = (timeStr) => {
  if (!timeStr) return null;
  const m = String(timeStr).match(/(\\d{1,2}):?(\\d{2})?\\s*(AM|PM)/i);
  if (!m) return null;
  let hh = parseInt(m[1], 10);
  const mm = m[2] ? parseInt(m[2], 10) : 0;
  const ampm = m[3].toUpperCase();
  if (ampm === "PM" && hh !== 12) hh += 12;
  if (ampm === "AM" && hh === 12) hh = 0;
  const d = new Date();
  d.setHours(hh, mm, 0, 0);
  return d;
};

const App = () => {
  const [busData, setBusData] = useState({});
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedBus, setSelectedBus] = useState("");
  const [selectedStop, setSelectedStop] = useState("");
  const [destinationStop, setDestinationStop] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [issueDescription, setIssueDescription] = useState("");

  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isGovernmentUser, setIsGovernmentUser] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Favorites load/save
  useEffect(() => {
    const raw = localStorage.getItem("bus-favorites");
    if (raw) setFavorites(JSON.parse(raw));
  }, []);
  useEffect(() => {
    localStorage.setItem("bus-favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Clock update
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  // Online/offline listener
  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  // Fetch data from server
  const fetchTimetables = useCallback(() => {
    setLoading(true);
    fetch("http://localhost:7000/api/bus-timetables")
      .then((res) => (res.ok ? res.json() : Promise.reject("Server error")))
      .then((data) => {
        setBusData(data || {});
        setCities(Object.keys(data || {}));
        setLoading(false);
        setLastUpdated(new Date());
        setError(null);
      })
      .catch(() => {
        setBusData({});
        setCities([]);
        setLoading(false);
        setLastUpdated(new Date());
        setError("Server not available");
      });
  }, []);
  useEffect(() => {
    fetchTimetables();
  }, [fetchTimetables]);

  const handleStopSelection = (stop) => {
    setSelectedStop(stop);
    setDestinationStop("");
  };

  const toggleFavorite = () => {
    if (!selectedCity || !selectedBus || !selectedStop) return;
    const key = `${selectedCity}||${selectedBus}||${selectedStop}`;
    setFavorites((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };
  const isFavorite = () => {
    if (!selectedCity || !selectedBus || !selectedStop) return false;
    return favorites.includes(`${selectedCity}||${selectedBus}||${selectedStop}`);
  };

  const computeArrival = useCallback(() => {
    if (!selectedCity || !selectedBus || !selectedStop) return null;
    const busObj = busData[selectedCity]?.[selectedBus];
    if (!busObj) return null;
    const freqParsed = parseFreqToMinutes(busObj.freq);
    const now = new Date();
    const start =
      parseTimeStringToToday(busObj.firstBus) ||
      new Date(new Date().setHours(6, 0, 0, 0));
    const end =
      parseTimeStringToToday(busObj.lastBus) ||
      new Date(new Date().setHours(23, 0, 0, 0));
    if (now < start) {
      const mins = Math.ceil((start - now) / 60000);
      return {
        time: formatTime(start),
        status: `Service starts in ${mins} min`,
        minutes: mins,
        isActive: false,
      };
    }
    if (now > end)
      return {
        time: "--:--",
        status: "Service ended for today",
        minutes: 0,
        isActive: false,
      };
    const minsSince = Math.floor((now - start) / 60000);
    const nextOffset =
      Math.ceil((minsSince + 0.00001) / freqParsed) * freqParsed;
    const nextTime = new Date(start.getTime() + nextOffset * 60000);
    const diff = Math.max(0, Math.ceil((nextTime - now) / 60000));
    return {
      time: formatTime(nextTime),
      status:
        diff === 0
          ? "Arriving now!"
          : diff === 1
          ? "Arriving in 1 minute"
          : `Arriving in ${diff} minutes`,
      minutes: diff,
      isActive: true,
    };
  }, [selectedCity, selectedBus, selectedStop, busData]);
  const arrival = computeArrival();

  const stopsArray = busData[selectedCity]?.[selectedBus]?.stops || [];
  const fromIndex = selectedStop ? stopsArray.indexOf(selectedStop) : -1;
  const toIndex = destinationStop ? stopsArray.indexOf(destinationStop) : -1;
  const distance =
    fromIndex !== -1 && toIndex !== -1
      ? Math.abs(toIndex - fromIndex) * 2
      : 0;

  const refresh = () => {
    setLastUpdated(new Date());
    fetchTimetables();
  };

  const handleIssueSubmit = (e) => {
    e.preventDefault();
    setIssueDescription("");
  };

  const handleMapRedirect = () => {
    if (selectedStop && destinationStop) {
      const encodedFrom = encodeURIComponent(selectedStop);
      const encodedTo = encodeURIComponent(destinationStop);
      const mapsUrl = `https://www.google.com/maps/dir/${encodedFrom}/${encodedTo}`;
      window.open(mapsUrl, "_blank");
    }
  };

  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationError(null);
        },
        (error) => {
          setLocationError(error.message);
          setUserLocation(null);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "charangit" && password === "charangit") {
      setIsGovernmentUser(true);
      setLoginError("");
    } else {
      setLoginError("Invalid credentials. Please try again.");
    }
  };

  const handleLogout = () => {
    setIsGovernmentUser(false);
    setUsername("");
    setPassword("");
    setUserLocation(null);
  };

  return (
    <div className="app-root">
      <div className="container">
        <header className="header-card">
          <div className="header-left">
            <h1 className="title">🚌 Smart Bus Timetable</h1>
            <p className="subtitle">
              Real-time information from local transport
            </p>
          </div>
          <div className="header-right">
            <div className="time-block">
              <div className="time-now">
                <span className={`status-pill ${isOnline ? "online" : "offline"}`}>
                  {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}{" "}
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>
              <span className="last-updated">
                Last updated:{" "}
                {lastUpdated ? lastUpdated.toLocaleString() : "Never"}
              </span>
            </div>
          </div>
        </header>

        <main>
          {loading ? (
            <div className="card">Loading timetable...</div>
          ) : error ? (
            <div className="card">
              <AlertCircle /> {error}
              <button onClick={refresh}>
                <RefreshCw /> Retry
              </button>
            </div>
          ) : (
            <>
              {favorites.length > 0 && (
                <section className="card">
                  <h3>★ Favorite Routes</h3>
                  <div className="row">
                    {favorites.map((fav) => {
                      const [city, bus, stop] = fav.split("||");
                      return (
                        <div
                          className="list-item"
                          key={fav}
                          onClick={() => {
                            setSelectedCity(city);
                            setSelectedBus(bus);
                            setSelectedStop(stop);
                          }}
                        >
                          <div>
                            <span className="bus-no">{bus}</span>
                            <div className="bus-route">
                              {city} - {busData[city]?.[bus]?.route}
                            </div>
                          </div>
                          <div className="list-right">
                            <span className="freq">From {stop}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* City Selection Pills */}
              <section className="card selection-card">
                <h3>Select City</h3>
                <div className="grid">
                  {cities.map((c) => (
                    <div
                      key={c}
                      className={`pill ${selectedCity === c ? "active" : ""}`}
                      onClick={() => {
                        setSelectedCity(c);
                        setSelectedBus("");
                        setSelectedStop("");
                        setDestinationStop("");
                      }}
                    >
                      {c}
                    </div>
                  ))}
                </div>
              </section>

              {/* Bus Selection Pills */}
              {selectedCity && (
                <section className="card selection-card">
                  <h3>Select Bus</h3>
                  <div className="grid">
                    {Object.keys(busData[selectedCity] || {}).map((b) => (
                      <div
                        key={b}
                        className={`pill ${selectedBus === b ? "active" : ""}`}
                        onClick={() => {
                          setSelectedBus(b);
                          setSelectedStop("");
                          setDestinationStop("");
                        }}
                      >
                        <strong>{b}</strong>
                        <p>{busData[selectedCity][b].route}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Stop Selection Pills */}
              {selectedBus && (
                <section className="card selection-card">
                  <h3>Select Stops</h3>
                  <div className="stop-selection">
                    <div>
                      <h4>From Stop</h4>
                      <div className="grid">
                        {stopsArray.map((s) => (
                          <div
                            key={s}
                            className={`pill ${
                              selectedStop === s ? "active" : ""
                            }`}
                            onClick={() => handleStopSelection(s)}
                          >
                            {s}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4>To Stop</h4>
                      <div className="grid">
                        {stopsArray
                          .filter((s) => s !== selectedStop)
                          .map((s) => (
                            <div
                              key={s}
                              className={`pill ${
                                destinationStop === s ? "active" : ""
                              }`}
                              onClick={() => setDestinationStop(s)}
                            >
                              {s}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Arrival Info */}
              {selectedStop && arrival && (
                <section className="arrival-card">
                  <div className="arrival-header">
                    <h2 className="arrival-title">Next Arrival</h2>
                    <button
                      onClick={toggleFavorite}
                      className={`fav ${isFavorite() ? "active" : ""}`}
                    >
                      <Star size={32} fill="currentColor" />
                    </button>
                  </div>
                  <div className="arrival-body">
                    <span className="arrival-time-large">{arrival.time}</span>
                    <p className="arrival-status">{arrival.status}</p>
                    <div className="progress-wrap">
                      <div
                        className="progress-bar"
                        style={{
                          width: `${Math.max(10, 100 - arrival.minutes * 10)}%`,
                        }}
                      ></div>
                    </div>
                    <p className="route-fare">
                      Approx. Distance: {distance}km
                    </p>
                  </div>
                </section>
              )}

              {/* Map Section */}
              <section className="card map-card">
                <h3>Map & Directions</h3>
                <div
                  className="route-map-container"
                  onClick={handleMapRedirect}
                >
                  <div className="map-placeholder">
                    <span className="map-icon">🗺️</span>
                    <h4>View Route on Map</h4>
                    <p>Click to get directions between selected stops.</p>
                  </div>
                </div>
              </section>

              {/* Report Issue */}
              <section className="card report-card">
                <h3>Report an Issue</h3>
                <form onSubmit={handleIssueSubmit}>
                  <textarea
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    placeholder="Describe the issue (e.g., bus missing, delay, etc.)."
                    required
                  />
                  <button type="submit" className="btn primary">
                    Report Issue
                  </button>
                </form>
              </section>

              {/* Government Login */}
              {!isGovernmentUser ? (
                <section className="login-card card">
                  <h1>
                    <LogIn size={28} /> Government Portal
                  </h1>
                  <p>Login to access the GPS tracker.</p>
                  <form onSubmit={handleLogin}>
                    <div className="input-group">
                      <label htmlFor="username">Username</label>
                      <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="charangit"
                        required
                      />
                    </div>
                    <div className="input-group">
                      <label htmlFor="password">Password</label>
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    {loginError && <p className="login-error">{loginError}</p>}
                    <button type="submit" className="btn primary">
                      Login
                    </button>
                  </form>
                </section>
              ) : (
                <section className="gps-card card">
                  <h3>
                    <MapPin size={24} /> GPS Tracker
                  </h3>
                  <p className="subtitle">Real-time location of the bus.</p>
                  <button onClick={getUserLocation} className="btn primary">
                    Get My Location
                  </button>
                  {userLocation && (
                    <div className="location-info">
                      <p>
                        Latitude:{" "}
                        <strong>{userLocation.latitude.toFixed(6)}</strong>
                      </p>
                      <p>
                        Longitude:{" "}
                        <strong>{userLocation.longitude.toFixed(6)}</strong>
                      </p>
                    </div>
                  )}
                  {locationError && (
                    <p className="location-error">
                      <AlertCircle size={18} /> {locationError}
                    </p>
                  )}
                  <button
                    onClick={handleLogout}
                    className="btn secondary logout-button"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </section>
              )}
            </>
          )}
        </main>

       <footer className="footer-note">
          Demo — Data served from backend. Make sure server (port 5001) is running.
        </footer>
      </div>
    </div>
  );
};

export default App;
