import React from 'react';
import logo from './NOTaGrapes_berries512.png';
import './LogoPulse.css';

class LogoPulse extends React.Component {
  render() {
    return (
        <img src={logo} className="LogoPulse-logo" alt="LogoPulse" />
    );
  }
}

export default LogoPulse;
