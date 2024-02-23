import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const FormPage = () => {
  const [orgUnitId, setOrgUnitId] = useState('');
  const [programId, setProgramId] = useState('');
  const history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission here
    console.log('Submitted:', orgUnitId, programId);
    // Navigate to PatientListPage with orgUnitId and programId as parameters
    history.push(`/patient-list/${orgUnitId}/${programId}`);
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
  };

  const inputStyle = {
    margin: '0.5rem',
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    width: '300px',
  };

  const buttonStyle = {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    width: '300px',
    marginTop: '1rem',
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: '1rem' }}>Enter Org Unit ID and Program ID</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input
          type="text"
          value={orgUnitId}
          onChange={(e) => setOrgUnitId(e.target.value)}
          placeholder="Org Unit ID"
          style={inputStyle}
        />
        <input
          type="text"
          value={programId}
          onChange={(e) => setProgramId(e.target.value)}
          placeholder="Program ID"
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>Submit</button>
      </form>
    </div>
  );
};

export default FormPage;
