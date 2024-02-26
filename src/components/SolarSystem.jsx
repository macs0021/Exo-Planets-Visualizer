import React from 'react';
import './SolarSystem.css'; // Ensure this CSS file contains only the necessary styles
import { useState, useEffect, useRef } from 'react';
import usePlanetOrbits from './usePlanetOrbits.jsx';
import Draggable from 'react-draggable';


const SolarSystem = ({ planets = [], TD, loading, setSelectedPlanet, selectedPlanet }) => {

    let previousRad = 200;
    const AUaPixeles = 0.5;

    const [planetPositions, setPlanetPositions] = useState([]);
    const [perspective, setPerspective] = useState(TD);
    const [scale, setScale] = useState(1);
    const [starPositions, setStarPositions] = useState([]);
    const [systemVisibility, setSystemVisibility] = useState(false);
    const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 0 })
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [hasAnimated, setHasAnimated] = useState(false);
    const [selectedPlanetIndex, setSelectedPlanetIndex] = useState(-1); // Nuevo estado para el índice

    useEffect(() => {
        let index = -1;
        if (selectedPlanet.length !== 0) {
            index = planets.findIndex(planet => planet.pl_name === selectedPlanet);
        }
        setSelectedPlanetIndex(index);
    }, [selectedPlanet, planets]);


    function getCurrentPosition(element) {
        const style = window.getComputedStyle(element);
        const matrix = new DOMMatrix(style.transform);
        return { x: matrix.m41, y: matrix.m42 };
    }


    /*     useEffect(() => {
            if (selectedPlanet.length !== 0) {
                const planetIndex = planets.findIndex(planet => planet.pl_name === selectedPlanet);
                const planetToFollow = planetPositions[planetIndex];
                // Calcula la nueva posición de la cámara para centrar el planeta
                // Asumiendo que `planetToFollow.posX` y `planetToFollow.posY` son las coordenadas del planeta en el "mundo"
                // y que la cámara se "mueve" ajustando su posición relativa al mundo.
                const cameraX = planetToFollow.posX;
                const cameraY = planetToFollow.posY;
                if (planetToFollow) {
                    setScale(1);
                    setCameraPosition({
                        x: cameraX,
                        y: cameraY
                    });
                }
            }
        }, [selectedPlanet, planetPositions]); */

    /* useEffect(() => {
        if (selectedPlanet.length !== 0) {
            const planetIndex = planets.findIndex(planet => planet.pl_name === selectedPlanet);
            const planetToFollow = planetPositions[planetIndex];
            if (planetToFollow) {
                const targetX = planetToFollow.posX;
                const targetY = planetToFollow.posY;
    
                const animateCamera = () => {
                    // Suponiendo que cameraPosition es tu estado actual para la posición de la cámara
                    setScale(1)
                    const { x: currentX, y: currentY } = cameraPosition;
    
                    // Calcular la diferencia
                    const diffX = targetX - currentX;
                    const diffY = targetY - currentY;
    
                    // Determinar el paso de la animación (ajusta este valor según necesites)
                    const step = 0.05; // Este es el porcentaje de la distancia que moverás la cámara en cada frame
    
                    // Calcular la nueva posición
                    const newX = currentX + diffX * step;
                    const newY = currentY + diffY * step;
    
                    // Actualizar la posición de la cámara
                    setCameraPosition({ x: newX, y: newY });
    
                    // Chequear si hemos llegado lo suficientemente cerca de la posición objetivo
                    if (Math.abs(diffX) > 1 || Math.abs(diffY) > 1) {
                        // Si no, continuar la animación
                        requestAnimationFrame(animateCamera);
                    }
                };
    
                // Iniciar la animación
                requestAnimationFrame(animateCamera);
            }
        }
    }, [selectedPlanet, planetPositions]); */



    useEffect(() => {
        const animateCameraToPosition = (targetX, targetY) => {
            // Suponiendo que cameraPosition es tu estado actual para la posición de la cámara
            const { x: currentX, y: currentY } = cameraPosition;

            // Calcular la diferencia
            const diffX = targetX - currentX;
            const diffY = targetY - currentY;

            // Determinar el paso de la animación
            const step = 0.07; // Este es el porcentaje de la distancia que moverás la cámara en cada frame

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
                setScale(1); // Asumiendo que quieres resetear el zoom cuando cambias de planeta
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

    const handleAnimationEnd = () => {
        const solarElement = document.getElementById('solar');
        setScale(1)
        // Elimina la clase zoomIn una vez que la animación termina
        solarElement.classList.remove('zoomIn');

        // Elimina el escuchador para evitar que se ejecute múltiples veces
        solarElement.removeEventListener('animationend', handleAnimationEnd);
    };

    useEffect(() => {
        const solarElement = document.getElementById('solar');

        if (loading) {
            // Asegúrate de que no hay clases de animación previas
            solarElement.classList.remove('zoomIn');
            // Aplica la animación de zoom out inmediatamente
            setScale(1)
            setSystemVisibility(true)
            solarElement.classList.add('zoomOut');
        } else {
            setSystemVisibility(false)
            setScale(0.005)
            // Elimina la clase de zoom out para prevenir la repetición de la animación
            solarElement.classList.remove('zoomOut');
            // Espera 1 segundo después de que loading sea false antes de iniciar el zoom in
            const timeoutId = setTimeout(() => {
                solarElement.classList.add('zoomIn');
                setSystemVisibility(true);
                solarElement.addEventListener('animationend', handleAnimationEnd);
            }, 1000); // Espera 1000 ms antes de aplicar la clase zoomIn

            // Limpieza para cancelar el timeout si el componente se desmonta o si loading cambia antes de que el timeout se complete
            return () => {
                clearTimeout(timeoutId)
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
        const solarElement = document.getElementById('solar');
        if (solarElement.classList.contains("zoomIn")) {
            setScale(1)
            solarElement.classList.remove('zoomIn')
        };
    };

    function removeZoomIn() {
        const solarElement = document.getElementById('solar');
        if (solarElement.classList.contains("zoomIn")) {
            solarElement.classList.remove('zoomIn')
        };
    }

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
                    <div id="solar" className={`solar`} style={{
                        width: '100%', height: '100%', transform:
                            `scale(${scale}) translate(${-cameraPosition?.x}px, ${-cameraPosition?.y}px) `,
                        display: systemVisibility ? 'block' : 'none'
                    }}>
                        {/* Sun */}
                        <div className="sun"></div>
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
                                            top: '50%',
                                            left: '50%',
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
                    </div>
                </div>
            </Draggable>
        </div>
    );
};

export default SolarSystem;