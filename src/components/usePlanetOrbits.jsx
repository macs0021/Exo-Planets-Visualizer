import { useEffect, useRef } from 'react';

const usePlanetOrbits = (planets, AUaPixeles, setPosition, planetas) => {
  let centro = { posX: 0, posY: 0 };
  const requestRef = useRef();

  useEffect(() => {

    let previousRad = 200;

    const initialPlanets = planets.map((planet, index) => {

      // Usa los valores de órbita máxima y excentricidad si están presentes, de lo contrario, usa valores por defecto
      const semiejeMayor1 = planet.pl_orbsmax ? planet.pl_orbsmax * AUaPixeles : previousRad; // Valor por defecto para esfera perfecta
      const excentricidad = planet.pl_orbeccen ?? 0; // 0 para esfera perfecta
      const semiejeMenor1 = semiejeMayor1 * Math.sqrt(1 - Math.pow(excentricidad, 2)); // Calcula el semieje menor
      const proporcion = semiejeMayor1 / semiejeMenor1;
      const semiejeMayor = previousRad * proporcion;
      const semiejeMenor = previousRad;
      const maxSpeed = 0.008; // Define la velocidad máxima
      const minSpeed = 0.001; // Define la velocidad mínima
      const decrementPerIndex = 0.0001; // Define cuánto se reduce la velocidad con cada incremento de index
      const randomSign = Math.random() < 0.8 ? -1 : 1;
      // Calcula la velocidad en función del index
      const speed = randomSign * Math.max(minSpeed, maxSpeed - index * decrementPerIndex);
      const angle = Math.random() * 2 * Math.PI; // Ángulo inicial aleatorio
      const offset = Math.sqrt(semiejeMayor ** 2 - semiejeMenor ** 2);
      const posX = offset + centro.posX + semiejeMayor * Math.cos(angle);
      const posY = centro.posY + semiejeMenor * Math.sin(angle);
      const orbitAngle = Math.random() * 360;


      previousRad = previousRad + 200;

      return { ...planet, semiejeMayor, semiejeMenor, posX, posY, speed, angle, offset, orbitAngle };
    });

    setPosition(initialPlanets);
  }, [planets, AUaPixeles, setPosition]);
  // Actualiza la posición de los planetas en cada frame
  useEffect(() => {
    const updatePositions = () => {
      setPosition(currentPositions => currentPositions.map(planet => {
        let newAngle = (planet.angle + planet.speed) % (2 * Math.PI);
        const posX = centro.posX + planet.semiejeMayor * AUaPixeles * Math.cos(newAngle);
        const posY = centro.posY + planet.semiejeMenor * AUaPixeles * Math.sin(newAngle);
        return { ...planet, posX, posY, angle: newAngle };
      }));
      requestRef.current = requestAnimationFrame(updatePositions);
    };

    requestRef.current = requestAnimationFrame(updatePositions);
    return () => cancelAnimationFrame(requestRef.current);
  }, [AUaPixeles, setPosition]);
};

export default usePlanetOrbits;
