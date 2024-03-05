import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './App.css';
import PlanetAccordion from './components/PlanetAccordion';
import System from './components/SolarSystem';
import { Hidden } from '@mui/material';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import ReducedSystem from './components/ReducedSystem.jsx';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ThreeDRotationIcon from '@mui/icons-material/ThreeDRotation';
import Loading from './components/loading.jsx';
import SwipeablePlanetComponent from './components/SwipeablePlanetComponent.jsx';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const App = () => {
  const [planets, setPlanets] = useState([]);
  const [firstLoading, setFirstLoading] = useState(false);
  const [selectedStar, setSelectedStar] = useState('');
  const [loading, setLoading] = useState(true);
  const [TD, setTD] = useState(false);
  const [stars, setStars] = useState([]);
  const [selectedPlanet, setSelectedPlanet] = useState("")
  const [showSystem, setShowSystem] = useState(false);
  const [onMainView, setOnMainView] = useState(true);
  const [visibility, setVisibility] = useState(true);
  const [loadingSymbol, setLoadingSymbol] = useState(true);
  const [starLoading, setStarLoading] = useState(true);
  const theme = useTheme();
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down('md'));


  useState(() => {
    setShowSystem(true);
  }, [])

  useState(() => {
    if (!loading && !firstLoading) {
      setFirstLoading(true);
    }
  }, [loading])


  const fetchStars = async () => {
    try {
      setLoading(true);
      setStarLoading(true);
      const response = await axios.get('/api/sync?query=' + encodeURIComponent("select distinct hostname from ps") + '&format=json');
      if (response.data && response.data.length > 0) {
        const sortedStars = response.data.map(star => star.hostname).sort((a, b) => a.localeCompare(b));
        setStars(sortedStars);
        setStarLoading(false);
      }
    } catch (error) {
      console.error('Error fetching stars data:', error);
    }
  };

  const changeVisibility = () => {
    if (!onMainView)
      setVisibility(!visibility);
  }

  /*   useEffect(() => {
      if (onMainView && !loading) {
        const timer = setTimeout(() => {
          setFirstLoading(true);
        }, 1000);
  
        return () => clearTimeout(timer);
      }
    }, [onMainView]); */

  useEffect(() => {
    if (!onMainView && !loading) {
      setFirstLoading(true);
    }
  }, [loading]);

  const selectRandomStar = () => {
    if (stars.length > 0) {
      const randomIndex = Math.floor(Math.random() * stars.length);
      setSelectedStar(stars[randomIndex]);
    }
  };

  const selectRandomWithButton = () => {
    setLoading(true);
    setOnMainView(false);
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
    if (newValue) {
      setLoading(true);
      setOnMainView(false);
      setSelectedStar(newValue)
    }
  }

  const StyledPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: 'rgba(0, 0, 0, 0.5) !important', // Fondo semitransparente negro
    color: 'white', // Texto en blanco
    '.MuiAutocomplete-option': {
      color: 'white !important', // Opciones en blanco
      fontFamily: 'Nasalization, Arial, sans-serif',
    },
  }));

  const planetasEjemplo = [{}, {}, {}, {}, {}, {}];

  return (
    <>
      {<Loading loading={loadingSymbol} starLoading={starLoading} mainMenu={onMainView}></Loading>}
      {!starLoading && <div className='fadeInLoading'>
        {<ReducedSystem planets={planetasEjemplo} topPos={0} leftPos={0} mainView={onMainView} />}
        {!onMainView && <System planets={planets} onMobile={isMobileOrTablet} setLoadingSymbol={setLoadingSymbol} TD={TD} loading={loading} selectedPlanet={selectedPlanet} setSelectedPlanet={setSelectedPlanet} setShowSystem={setShowSystem} showSystem={showSystem}></System>}
        {<Box className={`search-bar-container ${!onMainView ? 'moveFromCenter' : ''}`}
          style={{ visibility: visibility ? 'visible' : 'hidden' }}>
          <h1 className={!onMainView ? 'fadeOut' : ''}
            style={{
              zIndex: 100,
              fontSize: 'clamp(25px, 2vw, 40px)',
            }}>
            Exo-Planets Visualizer
          </h1>

          <Autocomplete
            options={stars} // Asegúrate de que 'stars' esté definido
            onChange={onChangeStar} // Asegúrate de que 'onChangeStar' esté definido
            PaperComponent={StyledPaper} // Usa el componente Paper estilizado para el menú
            className='font'
            renderInput={(params) => <TextField {...params} label="Search..." />}
            sx={{
              width: '100%',
              fontFamily: 'Nasalization, Arial, sans-serif',
              '.MuiInputLabel-root': { color: 'white', fontFamily: 'Nasalization, Arial' },
              '.MuiOutlinedInput-input': { fontFamily: 'Nasalization, Arial' }, // Aplica la fuente al texto ingresado
              '.MuiAutocomplete-inputRoot': { fontFamily: 'Nasalization, Arial' }, // Aplica la fuente al input
              '.MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: 'white' },
                '&.Mui-focused fieldset': { borderColor: 'white' },
                '.MuiSvgIcon-root': { color: 'white' },
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
              padding: '5px 10px',
              cursor: 'pointer',
            }} onClick={() => selectRandomWithButton()}>
              Random System
            </button>
          </div>
        </Box>}

        {!onMainView && firstLoading && visibility && (
          isMobileOrTablet
            ? <SwipeablePlanetComponent showSystem={showSystem} setSelectedPlanet={setSelectedPlanet} planets={planets}></SwipeablePlanetComponent>
            : <div className='system-info'><PlanetAccordion planets={planets} setSelectedPlanet={setSelectedPlanet} showSystem={showSystem} /></div>
        )}
        {!onMainView && (
          <div onClick={changeVisibility} className="visibilityIcon">
            {visibility ? (
              <VisibilityIcon className="visibilityIcon" />
            ) : (
              <VisibilityOffIcon className="visibilityIcon" />
            )}
          </div>
        )}
        {!onMainView && visibility && (
          <ThreeDRotationIcon
            className="threeDRotationIcon"
            onClick={() => setTD(!TD)}
          >
            {TD ? "2D" : "3D"}
          </ThreeDRotationIcon>
        )}
      </div>}
    </>
  );
};

export default App;
