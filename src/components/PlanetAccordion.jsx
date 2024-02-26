import React from 'react';
import { styled } from '@mui/material/styles';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';

// Estilos personalizados para el Accordion
const CustomAccordion = styled(Accordion)({
    background: 'transparent',
    color: 'white',
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
});

const CustomAccordionSummary = styled(AccordionSummary)({
    flexDirection: 'row-reverse', // Invierte el orden de los elementos para centrar el título
    justifyContent: 'center', // Centra el contenido
    '.MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '.MuiAccordionSummary-expandIconWrapper': {
        color: 'white', // Color del icono
    },
    '& .MuiTypography-root': { // Asegura que el texto esté centrado
        flex: 1,
        textAlign: 'center',
    }
});

const CustomAccordionDetails = styled(AccordionDetails)({
    flexDirection: 'column',
});

// Componente PlanetAccordion
const PlanetAccordion = ({ planets, setSelectedPlanet }) => {

    const [expanded, setExpanded] = useState(false); // Estado para manejar el panel expandido

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
        setSelectedPlanet(isExpanded ? panel : "");
    };

    return (
        <div>
            {planets?.map((planet, index) => (
                <CustomAccordion
                    key={planet.pl_name}
                    expanded={expanded === planet.pl_name}
                    onChange={handleChange(planet.pl_name)}>
                    <CustomAccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel${index}a-content`}
                        id={`panel${index}a-header`}
                    >
                        <Typography>{planet.pl_name}</Typography>
                    </CustomAccordionSummary>
                    <CustomAccordionDetails>
                        <Typography>
                            Masa: {planet.pl_mass || '???'} masas terrestres<br />
                            Radio: {planet.pl_rade || '???'} radios terrestres<br />
                            Periodo orbital: {planet.pl_orbper || '???'} días<br />
                            Excentricidad: {planet.pl_orbeccen || '???'}<br />
                            Ángulo: {planet.pl_orbincl || '???'} grados<br />
                            Radio máximo de órbita: {planet.pl_orbsmax || '???'} AU
                        </Typography>
                    </CustomAccordionDetails>
                </CustomAccordion>
            ))}
        </div>
    );
};

export default PlanetAccordion;
