import React from 'react';
import './SolarSystem.css'; // Ensure this CSS file contains only the necessary styles
import { useState, useEffect, useRef } from 'react';
import usePlanetOrbits from './usePlanetOrbits.jsx';
import Draggable from 'react-draggable';


const SolarSystem = ({ planets = [], TD, loading, selectedPlanet, setShowSystem, topPos, leftPos, setLoadingSymbol }) => {

    let previousRad = 200;
    const AUaPixeles = 0.5;

    const [planetPositions, setPlanetPositions] = useState([]);
    const [perspective, setPerspective] = useState(TD);
    const [scale, setScale] = useState(1);
    const [starPositions, setStarPositions] = useState([]);
    const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 0 })
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [hasAnimated, setHasAnimated] = useState(false);
    const [selectedPlanetIndex, setSelectedPlanetIndex] = useState(-1); // Nuevo estado para el índice
    const [keepInvisible, setKeepInvisible] = useState(true);

    useEffect(() => {
        let index = -1;
        if (selectedPlanet.length !== 0) {
            index = planets.findIndex(planet => planet.pl_name === selectedPlanet);
        }
        setSelectedPlanetIndex(index);
    }, [selectedPlanet, planets]);


    useEffect(() => {
        const animateCameraToPosition = (targetX, targetY) => {
            // Suponiendo que cameraPosition es tu estado actual para la posición de la cámara
            const { x: currentX, y: currentY } = cameraPosition;

            // Calcular la diferencia
            const diffX = targetX - currentX;
            const diffY = targetY - currentY;

            // Determinar el paso de la animación
            const step = 0.09; // Este es el porcentaje de la distancia que moverás la cámara en cada frame

            // Calcular la nueva posición
            const newX = currentX + diffX * step;
            const newY = currentY + diffY * step;

            // Actualizar la posición de la cámara
            setCameraPosition({ x: newX, y: newY });

            // Chequear si hemos llegado lo suficientemente cerca de la posición objetivo
            if (Math.abs(diffX) > 1 || Math.abs(diffY) > 1) {
                // Si no, continuar la animación
                requestAnimationFrame(() => animateCameraToPosition(targetX, targetY));
            }
        };

        if (selectedPlanet.length !== 0) {
            if (selectedPlanetIndex !== -1) {
                const planetToFollow = planetPositions[selectedPlanetIndex];
                //setScale(1); // Asumiendo que quieres resetear el zoom cuando cambias de planeta
                animateCameraToPosition(planetToFollow.posX, planetToFollow.posY);
            }
        } else {
            // Cuando no hay un planeta seleccionado, mover la cámara de vuelta a 0,0
            animateCameraToPosition(0, 0);
        }
    }, [selectedPlanet, planetPositions]);




    const generateRandomPositions = () => {
        const maxRadius = 800000 / 2; // Radio máximo para la generación de estrellas
        const minRadius = maxRadius / 100; // Define un radio mínimo para evitar estrellas demasiado cerca del centro
        const positions = Array.from({ length: 3000 }, () => {
            const angle = Math.random() * 2 * Math.PI; // Ángulo aleatorio en radianes

            // Asegura que el radio esté entre minRadius y maxRadius
            const radius = Math.sqrt(Math.random() * (maxRadius ** 2 - minRadius ** 2) + minRadius ** 2);

            // Convierte de coordenadas polares a cartesianas
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);

            return {
                top: `${y}px`, // Convertido a cadena para CSS
                left: `${x}px`, // Convertido a cadena para CSS
                opacity: Math.random() * 0.5 + 0.5, // Opacidad entre 0.5 y 1
                size: Math.random() * 2 + 1, // Tamaño entre 1px y 3px para simular distancia
            };
        });
        return positions;
    };

    useEffect(() => {
        const positions = generateRandomPositions();
        setStarPositions(positions);
    }, []);

    const handleAnimationEnd = (event) => {
        if (event.animationName === 'zoomOut') { // Asegúrate de que el nombre de la animación coincida
            setLoadingSymbol(true); // Cambia el estado después de que la animación de zoomOut finalice
            // Puedes realizar más acciones aquí si es necesario
        } else {
            const solarElement = document.getElementById('solar');
            setScale(1)
            // Elimina la clase zoomIn una vez que la animación termina
            solarElement.classList.remove('zoomIn');
            // Elimina el escuchador para evitar que se ejecute múltiples veces
            solarElement.removeEventListener('animationend', handleAnimationEnd);
        }
    };

    useEffect(() => {
        const solarElement = document.getElementById('solar');
        solarElement.style.display = 'hidden';
    }, [])

    useEffect(() => {
        const solarElement = document.getElementById('solar');

        if (loading) {
            setShowSystem(false);
            solarElement.classList.remove('zoomIn');
            setScale(1);
            if (!keepInvisible) {
                solarElement.style.display = 'block';
            } else {
                setKeepInvisible(false);
            }
            solarElement.classList.add('zoomOut');
            solarElement.addEventListener('animationend', handleAnimationEnd); // Registra el listener aquí
        } else {
            setScale(0.005);
            solarElement.style.display = 'none';
            solarElement.classList.remove('zoomOut');
            solarElement.removeEventListener('animationend', handleAnimationEnd); // Asegúrate de remover el listener aquí

            const timeoutId = setTimeout(() => {
                setLoadingSymbol(false);
                solarElement.classList.add('zoomIn');
                solarElement.style.display = 'block';
                setShowSystem(true);
            }, 1000);

            return () => {
                clearTimeout(timeoutId);
                setLoadingSymbol(false);
                solarElement.removeEventListener('animationend', handleAnimationEnd);
            };
        }
    }, [loading]);


    useEffect(() => {
        setPerspective(TD);
    }, [TD])

    const handleWheel = (e) => {
        let newScale = e.deltaY < 0 ? scale * 1.1 : scale * 0.9; // Aumenta o disminuye la escala
        /*   if (newScale > 3) {
              newScale = 3;
          } else if (newScale < 0.2) {
              newScale = 0.2;
          } */
        setScale(newScale); // Actualiza el estado de la escala
    };

    function calcularDimensionesOrbita(semiejeMayor, excentricidad) {
        // Calcular el semieje menor
        const semiejeMenor = semiejeMayor * Math.sqrt(1 - excentricidad ** 2);

        // Calcular el largo y el ancho de la órbita
        const largo = 2 * semiejeMayor; // Diámetro a lo largo del semieje mayor
        const ancho = 2 * semiejeMenor; // Diámetro a lo largo del semieje menor

        return { largo, ancho };
    }

    const [planetas, setPlanetas] = useState([]);

    usePlanetOrbits(planets, AUaPixeles, setPlanetPositions, planetas);


    const generarPlanetas = (numeroPlanetas) => {
        let previousRad = 200; // Inicializar el radio anterior
        const nuevosPlanetas = [];

        for (let i = 0; i < numeroPlanetas; i++) {
            const size = 10 + Math.random() * 20; // Tamaño entre 10 y 30
            const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`; // Color RGB aleatorio
            const radius = previousRad + size + Math.random() * 400; // Calcula el nuevo radio
            const direccion = Math.random() > 0.5 ? 'horario' : 'antihorario'; // Asigna aleatoriamente la dirección

            // Añade el nuevo planeta al array
            nuevosPlanetas.push({
                radius,
                color,
                size,
                direccion, // Añade aquí la dirección
            });

            // Actualiza previousRad para el siguiente planeta
            previousRad = radius;
        }

        setPlanetas(nuevosPlanetas);
    };


    function calcularDimensionesOrbita(semiejeMayor, excentricidad) {
        // Calcular el semieje menor
        const semiejeMenor = semiejeMayor * Math.sqrt(1 - excentricidad ** 2);

        // Calcular el largo y el ancho de la órbita
        const largo = 2 * semiejeMayor; // Diámetro a lo largo del semieje mayor
        const ancho = 2 * semiejeMenor; // Diámetro a lo largo del semieje menor

        return { largo, ancho };
    }

    useEffect(() => {
        generarPlanetas(planets.length);
    }, [planets]); // Dependencias del efecto // Dependencias del efecto


    return (

        <div className="universe" onWheel={handleWheel}>
            <Draggable
                position={selectedPlanet.length !== 0 && position}
                disabled={selectedPlanet.length !== 0}
            >
                <div>
                    {<div id="solar" className={`solar`} style={{
                        width: '100%', height: '100%', display: 'none', transform:
                            `scale(${scale}) translate(${-cameraPosition.x}px, ${-cameraPosition.y}px) `,
                    }}>
                        {/* Sun */}
                        {planets.length !== 0 && <div className="sun"></div>}
                        {planets.map((planet, index) => {
                            // Generar valores aleatorios para cada iteración
                            // Radio entre 100 y 300
                            const { largo, ancho } = calcularDimensionesOrbita(planet.pl_orbsmax, planet.pl_orbeccen);
                            const size = planetas[index]?.size; // Tamaño del planeta entre 10px y 30px
                            const radio = planetas[index]?.radius;
                            const color = planetas[index]?.color; // Color del planeta
                            const animationDuration = 5 + Math.random() * 15;

                            const colorRGB = planetas[index]?.color; // "rgb(255, 255, 255)"

                            // Si necesitas convertirlo a RGBA con opacidad, primero debes extraer los números
                            const matches = colorRGB?.match(/\d+/g); // Encuentra todos los números en la cadena
                            let boxShadowColor = `rgba(${0}, ${0}, ${0}, 0.6)`
                            // Asegúrate de que matches no sea null para evitar errores
                            if (matches) {
                                const [r, g, b] = matches;
                                boxShadowColor = `rgba(${r}, ${g}, ${b}, 0.6)`; // Construye la cadena rgba con opacidad
                                // Ahora boxShadowColor es "rgba(255, 255, 255, 0.6)" y se puede usar para CSS
                            }

                            const proporcion = largo / ancho;

                            let width, height;

                            if (!largo || !ancho) {
                                width = radio;
                                height = radio;

                            } else {

                                if (largo > ancho) {
                                    width = radio; // El largo es mayor, así que se ajusta al radio
                                    height = width / proporcion; // Ajustar el ancho para mantener la proporción
                                } else {
                                    height = radio; // El ancho es mayor, así que se ajusta al radio
                                    width = height * proporcion; // Ajustar el largo para mantener la proporción
                                }
                            }

                            return (
                                <div key={'div ' + index}>
                                    <div className={perspective ? "elemento3D" : ""}
                                        key={"orbit " + index}
                                        style={{
                                            position: 'absolute',
                                            top: topPos,
                                            left: leftPos,
                                            border: '1px solid #112B3D',
                                            borderRadius: '50%',
                                            width: `${planetPositions[index]?.semiejeMayor}px`,
                                            height: `${planetPositions[index]?.semiejeMenor}px`,
                                            marginTop: `${-planetPositions[index]?.semiejeMenor / 2}px`, // Centrar verticalmente
                                            marginLeft: `${-planetPositions[index]?.semiejeMayor / 2 - planetPositions[index]?.offset / 3}px`,
                                            transformOrigin: `${planetPositions[index]?.semiejeMayor - planetPositions[index]?.offset / 3}px` // Centrar horizontalmente
                                        }}
                                    >
                                        <div key={"planet " + index} style={{
                                            position: 'absolute',
                                            width: `${size}px`,
                                            height: `${size}px`,
                                            backgroundColor: color,
                                            borderRadius: '50%',
                                            boxShadow: `0 0 8px 4px ${boxShadowColor}`,
                                            top: '50%',
                                            left: '50%',
                                            marginLeft: `-${size / 2}px`,
                                            marginTop: `-${size / 2}px`,
                                            transform: `translate(${planetPositions[index]?.posX}px, ${planetPositions[index]?.posY}px)` + (perspective ? " rotateX(-60deg)" : ""),
                                            zIndex: '10',
                                            border: selectedPlanet === planet.pl_name ? '2px solid white' : 'none', // Condicional para el borde
                                        }} />
                                    </div>
                                </div>
                            );
                        })}

                    </div>}
                </div>
            </Draggable>
        </div>
    );
};

export default SolarSystem;