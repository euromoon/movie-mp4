import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompactDisc } from '@fortawesome/free-solid-svg-icons';
import './MovieMP4Logo.css';

function MovieMP4Logo() {
  return (
    <h1 className='logo' >movie-mp4 <FontAwesomeIcon icon={faCompactDisc} color='#BE4BDB' /> </h1>
  );
}

export { MovieMP4Logo };