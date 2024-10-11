import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSpring, animated } from 'react-spring';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { generateMotivationalMessage } from '../services/huggingFaceService';
import {getKanyeQuote} from "../services/kanyeRest.js";

const personalities = [
  { id: 1, name: "Optimistic Ollie", theme: "positivity and hope" },
  { id: 2, name: "Resilient Rita", theme: "overcoming challenges" },
  { id: 3, name: "Mindful Max", theme: "present-moment awareness" },
  { id: 4, name: "Energetic Ellie", theme: "enthusiasm and action" },
  { id: 5, name: "Kanye West", theme: ""}
];

export default function Dashboard() {
  const [selectedPersonality, setSelectedPersonality] = useState(null);
  const [motivationalMessage, setMotivationalMessage] = useState("");
  const { currentUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("Dashboard component mounted");
    if (currentUser) {
      console.log("Current user exists, fetching user data");
      fetchUserData();
    }
  }, [currentUser]);

  const fetchUserData = async () => {
    try {
      console.log("Fetching user data...");
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("User data fetched:", userData);
        if (userData.selectedPersonality) {
          setSelectedPersonality(personalities.find(p => p.id === userData.selectedPersonality));
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to fetch user data. Please try again.");
    }
  };

  const handleSelectPersonality = async (personality) => {
    console.log("Selecting personality:", personality);
    setSelectedPersonality(personality);
    setMotivationalMessage("");
    try {
      await setDoc(doc(db, "users", currentUser.uid), {
        selectedPersonality: personality.id
      }, { merge: true });
      console.log("Personality saved to database");
    } catch (error) {
      console.error("Error saving selected personality:", error);
      setError("Failed to save selected personality. Please try again.");
    }
  };

  const handleGetMotivation = async () => {
    if (selectedPersonality.id === 5) {
      const message = await getKanyeQuote();
      setMotivationalMessage(message)
      setLoading(false)
    }

    if (selectedPersonality.id !== 5) {
      setLoading(true);
      try {
        console.log("Getting motivation for:", selectedPersonality);
        const message = await generateMotivationalMessage(selectedPersonality.name, selectedPersonality.theme);
        setMotivationalMessage(message);
      } catch (error) {
        console.error("Error getting motivation:", error);
        setError("Failed to get motivation. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      setError("Failed to log out");
    }
  };

  const fadeIn = useSpring({
    opacity: motivationalMessage ? 1 : 0,
    transform: motivationalMessage ? "translateY(0)" : "translateY(20px)"
  });

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  console.log("Rendering Dashboard component");

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">AI Motivational Support</h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Choose your motivational AI personality:</h2>
        <div className="grid grid-cols-2 gap-2">
          {personalities.map((personality) => (
            <button
              key={personality.id}
              onClick={() => handleSelectPersonality(personality)}
              className={`p-2 rounded ${
                selectedPersonality?.id === personality.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {personality.name}
            </button>
          ))}
        </div>
      </div>
      {selectedPersonality && (
        <div className="mb-4">
          <p className="text-lg">Selected: {selectedPersonality.name}</p>
          <button
            onClick={handleGetMotivation}
            disabled={loading}
            className="mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            {loading ? 'Getting Motivation...' : 'Get Motivation'}
          </button>
        </div>
      )}
      {motivationalMessage && (
        <animated.div style={fadeIn} className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          <p className="text-lg">{motivationalMessage}</p>
        </animated.div>
      )}
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
      >
        Log Out
      </button>
    </div>
  );
}