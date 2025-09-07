const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 7000;
app.use(cors({ origin: "*" }));
app.use(express.json());


const busData = {
  "Visakhapatnam": {
    "6": {
      route: "Simhachalam (Hill Top) to Old Post Office (Town)",
      fare: "Varies",
      freq: "~15-30 min",
      stops: [
        "Simhachalam (Hill Top)",
        "Gopalapatnam",
        "NAD Junction",
        "Kancharapalem Convent Jn",
        "Town Kotharoad",
        "Railway Station",
        "Old Post Office (Town)"
      ],
      firstBus: "~5:00 AM",
      lastBus: "~10:00 PM"
    },
    "6A_H": {
      route: "RTC Complex (D.B.S. Comp.) to Simhachalam",
      fare: "Varies",
      freq: "Varies",
      stops: [
        "RTC Complex (D.B.S. Comp.)",
        "Simhachalam"
      ],
      firstBus: "Varies",
      lastBus: "Varies"
    },
    "12": {
      route: "Arilova Colony to Gajuwaka",
      fare: "Varies",
      freq: "~30 min",
      stops: [
        "Arilova Colony",
        "Venkojipalem",
        "MVP Colony",
        "AU Outgate",
        "Jagadamba",
        "Town Kotharoad",
        "Convent",
        "Scindia",
        "Gajuwaka"
      ],
      firstBus: "~6:00 AM",
      lastBus: "~10:00 PM"
    },
    "14A": {
      route: "Arilova Colony to Old Post Office",
      fare: "Varies",
      freq: "~30 min",
      stops: [
        "Arilova Colony",
        "Venkojipalem",
        "MVP Colony",
        "AU Outgate",
        "Jagadamba",
        "Town Kotharoad",
        "Old Post Office"
      ],
      firstBus: "~6:00 AM",
      lastBus: "~10:00 PM"
    },
    "28": {
      route: "Jagadamba to Simhachalam",
      fare: "Varies",
      freq: "~15-30 min",
      stops: [
        "Jagadamba",
        "Gopalapatnam",
        "NAD Junction",
        "Kanakamahalakshmi",
        "Simhachalam"
      ],
      firstBus: "~5:00 AM",
      lastBus: "~10:00 PM"
    },
    "38": {
      route: "Gajuwaka to RTC Complex",
      fare: "Varies",
      freq: "~5-10 min",
      stops: [
        "Gajuwaka",
        "Airport",
        "NAD Junction",
        "Convent Jn",
        "Town Kotharoad",
        "Railway Station",
        "RTC Complex"
      ],
      firstBus: "~5:00 AM",
      lastBus: "~11:00 PM"
    },
    "55": {
      route: "Railway Station to Madhavadhara",
      fare: "Varies",
      freq: "~15-30 min",
      stops: [
        "Railway Station",
        "Gopalapatnam",
        "NAD Junction",
        "Kancharapalem",
        "Madhavadhara"
      ],
      firstBus: "~5:00 AM",
      lastBus: "~10:00 PM"
    },
    "55K": {
      route: "Kanakamahalakshmi to Simhachalam",
      fare: "Varies",
      freq: "~15-30 min",
      stops: [
        "Kanakamahalakshmi",
        "Gopalapatnam",
        "NAD Junction",
        "Kancharapalem",
        "Simhachalam"
      ],
      firstBus: "~5:00 AM",
      lastBus: "~10:00 PM"
    },
    "83": {
      route: "Anakapalle to Visakhapatnam",
      fare: "Varies",
      freq: "~30 min",
      stops: [
        "Anakapalle",
        "Pendurthy",
        "Sontyam",
        "Anandapuram",
        "Visakhapatnam"
      ],
      firstBus: "~6:00 AM",
      lastBus: "~10:00 PM"
    },
    "99": {
      route: "Steel Plant to RTC Complex",
      fare: "Varies",
      freq: "~5-10 min",
      stops: [
        "Steel Plant",
        "Gajuwaka",
        "NAD Junction",
        "Convent Jn",
        "Town Kotharoad",
        "Railway Station",
        "RTC Complex"
      ],
      firstBus: "~5:00 AM",
      lastBus: "~11:00 PM"
    },
    "400": {
      route: "Bhimili to RTC Complex",
      fare: "Varies",
      freq: "~5-10 min",
      stops: [
        "Bhimili",
        "Vizag Steel Plant",
        "Gajuwaka",
        "NAD Junction",
        "Convent Jn",
        "Town Kotharoad",
        "Railway Station",
        "RTC Complex"
      ],
      firstBus: "~5:00 AM",
      lastBus: "~11:00 PM"
    },
    "744": {
      route: "Collector Office to Dosuru",
      fare: "Varies",
      freq: "~1 hr",
      stops: [
        "Collector Office",
        "Jagadamba",
        "Town Kotharoad",
        "Convent",
        "Scindia",
        "Gajuwaka",
        "Kurmannapalem",
        "Parawada",
        "Kapulatunglam",
        "Dibbapalem",
        "Tagarapuvalasa",
        "Dosuru"
      ],
      firstBus: "~6:00 AM",
      lastBus: "~10:00 PM"
    },
    "844": {
      route: "Collector Office to Kollivanipalem",
      fare: "Varies",
      freq: "~30 min",
      stops: [
        "Collector Office",
        "Jagadamba",
        "Town Kotharoad",
        "Convent",
        "Scindia",
        "Gajuwaka",
        "Kurmannapalem",
        "Parawada",
        "Kollivanipalem"
      ],
      firstBus: "~6:00 AM",
      lastBus: "~10:00 PM"
    },
    "888": {
      route: "Anakapalle to Sabbavaram",
      fare: "Varies",
      freq: "~30 min",
      stops: [
        "Anakapalle",
        "Pendurthy",
        "Sontyam",
        "Anandapuram",
        "Sabbavaram"
      ],
      firstBus: "~6:00 AM",
      lastBus: "~10:00 PM"
    }
  },

  "Vijayawada": {
    "3C": {
      "route": "Bus Stand to Gannavaram Airport",
      "fare": "₹50",
      "freq": "20 min",
      "stops": [
        "Bus Stand",
        "Benz Circle",
        "NTR Circle",
        "Gannavaram Airport"
      ],
      "firstBus": "5:00 AM",
      "lastBus": "11:00 PM"
    },
    "5": {
      "route": "Bus Stand to Ibrahimpatnam",
      "fare": "₹20",
      "freq": "10 min",
      "stops": [
        "Bus Stand",
        "Benz Circle",
        "Enikepadu",
        "Ibrahimpatnam"
      ],
      "firstBus": "4:30 AM",
      "lastBus": "10:30 PM"
    },
    "23": {
      "route": "Bus Stand to Penamaluru",
      "fare": "₹15",
      "freq": "12 min",
      "stops": [
        "Bus Stand",
        "Governorpet",
        "Benz Circle",
        "Penamaluru"
      ],
      "firstBus": "5:00 AM",
      "lastBus": "10:00 PM"
    },
    "28": {
      "route": "Bus Stand to Poranki",
      "fare": "₹15",
      "freq": "12 min",
      "stops": [
        "Bus Stand",
        "Benz Circle",
        "Ramavarappadu",
        "Poranki"
      ],
      "firstBus": "5:15 AM",
      "lastBus": "9:45 PM"
    }
  },

  "Guntur": {
    "101": {
      "route": "Guntur to Tenali",
      "fare": "₹20",
      "freq": "10-15 min",
      "stops": [
        "Guntur Bus Stand",
        "Nallapadu",
        "Ponnur Road",
        "Tenali"
      ],
      "firstBus": "4:30 AM",
      "lastBus": "11:00 PM"
    },
    "102": {
      "route": "Guntur to Amaravathi",
      "fare": "₹25",
      "freq": "30 min",
      "stops": [
        "Guntur Bus Stand",
        "Pedakakani",
        "Velagapudi",
        "Amaravathi"
      ],
      "firstBus": "5:00 AM",
      "lastBus": "9:00 PM"
    },
    "103": {
      "route": "Guntur to Perecherla",
      "fare": "₹15",
      "freq": "20 min",
      "stops": [
        "Guntur Bus Stand",
        "Brindavan Gardens",
        "Perecherla"
      ],
      "firstBus": "5:30 AM",
      "lastBus": "10:00 PM"
    },
    "104": {
      "route": "Guntur to Prathipadu",
      "fare": "₹20",
      "freq": "25 min",
      "stops": [
        "Guntur Bus Stand",
        "Phirangipuram Road",
        "Prathipadu"
      ],
      "firstBus": "6:00 AM",
      "lastBus": "9:30 PM"
    },
    "Undavalli Caves Shuttle": {
      "route": "Guntur to Undavalli Caves (via Vijayawada)",
      "fare": "₹11",
      "freq": "Every 10 min",
      "stops": ["Guntur", "Vijayawada", "Undavalli Caves"],
      "firstBus": "4:30 AM",
      "lastBus": "10:30 PM"
    },
    "Amaravati Buddha Stupa Shuttle": {
      "route": "Guntur to Amaravati (Buddha Stupa)",
      "fare": "₹14",
      "freq": "Every 20 min",
      "stops": ["Guntur", "Amaravati"],
      "firstBus": "4:30 AM",
      "lastBus": "10:00 PM"
    },
    "Mangalagiri Temple Shuttle": {
      "route": "Guntur to Mangalagiri (Sri Lakshmi Narasimhaswamy)",
      "fare": "₹13",
      "freq": "Every 5 min",
      "stops": ["Guntur", "Mangalagiri"],
      "firstBus": "4:30 AM",
      "lastBus": "10:30 PM"
    },
    "Kotappakonda Temple Shuttle": {
      "route": "Narasaraopet to Kotappakonda (Sri Trikoteswara Swamy)",
      "fare": "₹6",
      "freq": "Every 20 min",
      "stops": ["Narasaraopet", "Kotappakonda"],
      "firstBus": "5:00 AM",
      "lastBus": "8:00 PM"
    },
    "Ponnur Temple Shuttle": {
      "route": "Guntur to Ponnur (Sri Anjaneya & Bhavannarayana Swamy)",
      "fare": "₹11",
      "freq": "Every 10 min",
      "stops": ["Guntur", "Ponnur"],
      "firstBus": "5:00 AM",
      "lastBus": "10:00 PM"
    }
  }
};

app.use(cors());
app.use(express.json()); // replaces body-parser

// Endpoint to get full bus timetable
app.get("/api/bus-timetables", (req, res) => {
  res.json(busData);
});

// Optional: Endpoint to get list of cities
app.get("/api/cities", (req, res) => {
  res.json(Object.keys(busData));
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Optional: distance/fare calculation endpoint (for 2 stops)
app.post("/api/calc-distance-fare", (req, res) => {
  const { city, bus, fromStop, toStop } = req.body;
  if (!city || !bus || !fromStop || !toStop)
    return res.status(400).json({ error: "Missing parameters" });

  const stops = busData[city]?.[bus]?.stops;
  if (!stops) return res.status(404).json({ error: "Bus not found" });

  const fromIndex = stops.indexOf(fromStop);
  const toIndex = stops.indexOf(toStop);
  if (fromIndex === -1 || toIndex === -1)
    return res.status(404).json({ error: "Stops not found" });

  const stopDiff = Math.abs(toIndex - fromIndex);
  const distance = stopDiff * 2; // 2 km per stop
  const fare = stopDiff * 10; // ₹10 per stop

  res.json({ distance, fare, stopsCovered: stopDiff });
});

// Start server
app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Backend running at http://localhost:${port}`);
});

module.exports = app;