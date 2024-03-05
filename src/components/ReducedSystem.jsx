import React from 'react';
import './SolarSystem.css';
import './reducedSystem.css' // Ensure this CSS file contains only the necessary styles
import { useState, useEffect, useRef } from 'react';
import usePlanetOrbits from './usePlanetOrbits.jsx';


const ReducedSystem = ({ planets, topPos, leftPos, mainView }) => {

    const AUaPixeles = 0.5;

    const [planetPositions, setPlanetPositions] = useState([]);
    const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        if (!mainView) {
            const solarElement = document.getElementById('solar-reduced');
            solarElement.classList.add('fadeOut');
        }

    }, [mainView])



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

        // Valores estáticos para demostración. Estos deberían ser ajustados según tus necesidades.
        const tamañosEstáticos = [5, 4, 7, 10, 3]; // Ejemplo de tamaños predefinidos
        const coloresEstáticos = [
            'rgb(233, 30, 99)',
            , // Azulito (Azul bebé)
            'rgb(255, 160, 122)', // Rojizo: Un tono rosado rojizo
            'rgb(64, 224, 208)', // Azul verdoso (Turquesa)
            'rgb(199, 21, 133)', // Morado clarito (Medio)
            'rgb(173, 216, 230)', // Azulito (Azul bebé)
            'rgb(255, 160, 122)' // Naranja suave, cambiado a algo más suave que el naranja básico
        ];
        const radiosEstáticos = [150, 270, 450, 550, 650, 880, 950, 1000]; // Ejemplo de radios predefinidos
        const direccionesEstáticas = ['horario', 'antihorario']; // Ejemplo de direcciones predefinidas

        for (let i = 0; i < numeroPlanetas; i++) {
            // Asigna valores estáticos basados en el índice. Usa el operador módulo (%) para ciclar los valores si hay más planetas que valores predefinidos.
            const size = tamañosEstáticos[i % tamañosEstáticos.length];
            const color = coloresEstáticos[i % coloresEstáticos.length];
            const radius = radiosEstáticos[i % radiosEstáticos.length];
            const direccion = direccionesEstáticas[i % direccionesEstáticas.length];

            // Añade el nuevo planeta al array
            nuevosPlanetas.push({
                radius,
                color,
                size,
                direccion,
            });

            // No necesitas actualizar previousRad aquí ya que estás usando valores estáticos para 'radius'
        }

        setPlanetPositions(nuevosPlanetas);
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

        <div className="universe">
            <div>
                <div
                    id="solar-reduced"
                    className="solar system-container"
                >
                    {/* Sun */}
                    {planets.length !== 0 && <div className="sun" style={{
                        '--top': `${topPos}%`,
                        '--left': `${leftPos}%`,
                    }}></div>}
                    {planets.map((planet, index) => {
                        // Generar valores aleatorios para cada iteración
                        // Radio entre 100 y 300
                        const { largo, ancho } = calcularDimensionesOrbita(planet.pl_orbsmax, planet.pl_orbeccen);
                        const size = planetPositions[index]?.size; // Tamaño del planeta entre 10px y 30px
                        const radio = planetPositions[index]?.radius;
                        const color = planetPositions[index]?.color; // Color del planeta
                        const animationDuration = 5 + Math.random() * 15;
                        const porcentaje = topPos; // Ejemplo: convertir 50% a píxeles
                        const altoDelViewport = window.innerHeight;
                        const anchoDelViewport = window.innerWidth;
                        const ajusteMarginTop = (porcentaje / 100) * altoDelViewport;
                        const ajusteMarginLeft = (leftPos / 100) * anchoDelViewport;

                        // Usa window.innerWidth para el ancho del viewport o usa un contenedor específico como se muestra abajo
                        const colorRGB = planetPositions[index]?.color; // "rgb(255, 255, 255)"

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
                            <div key={'div ' + index} style={{
                                position: 'absolute',
                                border: '0.03px solid #112B3D',
                                borderRadius: '50%',
                                width: `${planetPositions[index]?.radius}px`,
                                height: `${planetPositions[index]?.radius}px`,
                                marginTop: `${-planetPositions[index]?.radius / 2}px`, // Ajusta el marginTop aquí
                                marginLeft: `${-planetPositions[index]?.radius / 2}px`,
                                transformOrigin: 'center',
                            }}>
                                <div className='rotar-orbita' key={"planet " + index} style={{
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
                                    zIndex: '10',
                                    '--radius': `${planetPositions[index]?.radius / 2}px`,
                                    animationDuration: `${index + 1 * 5}s`,
                                }} />
                            </div>
                        );
                    })}

                </div>
            </div>
        </div>
    );
};

export default ReducedSystem;