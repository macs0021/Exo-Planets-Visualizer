import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './App.css';
import PlanetAccordion from './components/PlanetAccordion';
import System from './components/SolarSystem';

const App = () => {
  const [planets, setPlanets] = useState([]);
  const [selectedStar, setSelectedStar] = useState('');
  const [loading, setLoading] = useState(true);
  const [TD, setTD] = useState(false);
  const [stars, setStars] = useState([]);
  const [selectedPlanet, setSelectedPlanet] = useState("")

  const fetchStars = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/sync?query=' + encodeURIComponent("select distinct hostname from ps") + '&format=json');
      if (response.data && response.data.length > 0) {
        const sortedStars = response.data.map(star => star.hostname).sort((a, b) => a.localeCompare(b));
        setStars(sortedStars);
      }
    } catch (error) {
      console.error('Error fetching stars data:', error);
    }
  };

  const selectRandomStar = () => {
    if (stars.length > 0) {
      const randomIndex = Math.floor(Math.random() * stars.length);
      setSelectedStar(stars[randomIndex]);
    }
  };

  const selectRandomWithButton = () => {
    setLoading(true);
    selectRandomStar();
  }

  // Primero, obtenemos una lista de estrellas y seleccionamos una aleatoriamente
  useEffect(() => {
    fetchStars();
  }, []);

  useEffect(() => {
    selectRandomStar();
  }, [stars]);


  const fetchPlanets = async () => {
    try {
      //"HD 28254"
      console.log("pidiendo planeta")
      const response = await axios.get('/api/sync?query=' + encodeURIComponent(`SELECT * FROM ps WHERE hostname='${selectedStar}'`) + '&format=json');
      const uniquePlanets = Array.from(new Map(response.data.map(planet => [planet.pl_name, planet])).values());
      setPlanets(uniquePlanets);
    } catch (error) {
      console.error(`Error fetching planets for star ${selectedStar}:`, error);
    }
  };
  // Luego, basándonos en la estrella seleccionada, obtenemos todos los planetas que orbitan esa estrella
  useEffect(() => {
    if (selectedStar) {
      fetchPlanets();
    }
  }, [selectedStar]);// Este useEffect depende de selectedStar, por lo que se ejecutará cada vez que selectedStar cambie

  useEffect(() => {
    if (planets && planets.length > 0)
      setLoading(false)
  }, [planets])

  const onChangeStar = (event, newValue) => {
    console.log(newValue)
    if (newValue) {
      setLoading(true);
      setSelectedStar(newValue)
    }
  }

  return (
    <>
      <System planets={planets} TD={TD} loading={loading} selectedPlanet={selectedPlanet} setSelectedPlanet={setSelectedPlanet}></System>

      <Box sx={{
        position: 'fixed',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '500px',
        p: 2,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <Autocomplete
          options={stars}
          onChange={onChangeStar}
          renderInput={(params) => <TextField {...params} label="Search..." />}
          sx={{
            width: '100%',
            '.MuiInputLabel-root': { color: 'white' },
            '.MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': { borderColor: 'white' },
              '&:hover fieldset': { borderColor: 'white' },
              '&.Mui-focused fieldset': { borderColor: 'white' },
            },
            '.MuiAutocomplete-option': {
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
            },
          }}
        />
        <div style={{
          display: 'flex',
          justifyContent: 'center', // Centra los botones
          gap: '10px', // Espacio entre botones
          marginTop: '10px', // Espacio entre la barra de autocompletado y los botones
        }}>
          <button style={{
            color: 'white',
            backgroundColor: 'transparent',
            border: '1px solid white',
            padding: '10px 10px',
            cursor: 'pointer',
          }} onClick={() => setTD(!TD)}>
            {TD ? "2D" : "3D"}
          </button>
          <button style={{
            color: 'white',
            backgroundColor: 'transparent',
            border: '1px solid white',
            padding: '5px 10px',
            cursor: 'pointer',
          }} onClick={() => selectRandomWithButton()}>
            Random System
          </button>
        </div>
      </Box>

      <div className='system-info'>
        <PlanetAccordion planets={planets} setSelectedPlanet={setSelectedPlanet} />
      </div>
    </>
  );
};

export default App;
