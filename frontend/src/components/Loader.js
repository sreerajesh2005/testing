import React from "react";
import '../styles/Loader.css';

function Loader() {
  return (
    <div className="loader-overlay d-flex justify-content-center align-items-center">
      <div className="loader-spinner"></div>
    </div>
  );
}

export default Loader;
