import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { styled } from '@mui/material/styles';

const Container = styled('div')({
  position: 'absolute',
  bottom: '10%', // Ajusta según necesites
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: 'transparent',
  color: 'white',
  width: '90%', // Ajusta según el ancho deseado
  maxWidth: '600px', // Ajusta según el ancho máximo deseado
  padding: '10px',
  boxSizing: 'border-box',
});

const TextContainer = styled('div')({
  cursor: 'pointer',
  textAlign: 'center',
  flex: 1,
});

// Componente para mostrar la información detallada de cada planeta
const PlanetInfo = ({ planet }) => (
  <>
    Masa: {planet?.pl_mass || '???'} masas terrestres<br />
    Radio: {planet?.pl_rade || '???'} radios terrestres<br />
    Periodo orbital: {planet?.pl_orbper || '???'} días<br />
    Excentricidad: {planet?.pl_orbeccen || '???'}<br />
    Ángulo: {planet?.pl_orbincl || '???'} grados<br />
    Radio máximo de órbita: {planet?.pl_orbsmax || '???'} AU
  </>
);

// Componente principal que maneja la navegación entre planetas y la visualización de su información
const SwipeablePlanetComponent = ({ planets, setSelectedPlanet }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const handleSwipe = (direction) => {
    setExpanded(false); // Colapsar la información detallada al cambiar de planeta
    setSelectedPlanet("")
    const newIndex = direction === 'left'
      ? Math.min(currentIndex + 1, planets.length - 1)
      : Math.max(currentIndex - 1, 0);
    setCurrentIndex(newIndex);
  };

  const toggleExpand = () => setExpanded(!expanded);

  const onClick = (planet) => {
    if (!expanded) {
      setSelectedPlanet(planet);
    } else {
      setSelectedPlanet("");
    }
    toggleExpand();
  }

  return (
    <Container>
      <IconButton disableRipple disableFocusRipple style={{ color: 'white', opacity: currentIndex === 0 ? '0.2' : '1' }} onClick={() => handleSwipe('right')}><ArrowBackIosNewIcon /></IconButton>
      <TextContainer onClick={() => onClick(planets[currentIndex]?.pl_name)}>
        <Typography variant="h6" style={{ fontFamily: 'Nasalization, Arial', fontSize: '1.5rem' }}>
          {planets[currentIndex]?.pl_name}
        </Typography>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Typography style={{ fontFamily: 'Nasalization, Arial', fontSize: '1.2rem' }}>
            <PlanetInfo planet={planets[currentIndex]} />
          </Typography>
        </Collapse>
      </TextContainer>
      <IconButton disableRipple disableFocusRipple style={{ color: 'white', opacity: currentIndex === planets.length - 1 ? '0.2' : '1' }} onClick={() => handleSwipe('left')}><ArrowForwardIosIcon /></IconButton>
    </Container>
  );
};

export default SwipeablePlanetComponent;
