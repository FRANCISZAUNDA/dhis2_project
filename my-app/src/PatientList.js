import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const PatientListPage = () => {
  const { orgUnitId, programId } = useParams();
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const apiUrl = `https://debug.dhis2.org/analytics-dev/api/trackedEntityInstances.json?ou=${orgUnitId}&program=${programId}`;
        console.log("API URL:", apiUrl); // Log the API URL
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Authorization': 'Basic YWRtaW46ZGlzdHJpY3Q=',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data); // Log the received data

        // Extracting trackedEntityInstances from the data object
        const trackedEntityInstances = data?.trackedEntityInstances || [];
        setPatients(trackedEntityInstances);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, [orgUnitId, programId]);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Enrolled Patients</h1>
      <ul style={styles.patientList}>
        <li style={styles.subheading}>
          <div style={styles.subheadingText}>First Name</div>
          <div style={styles.subheadingText}>Last Name</div>
        </li>
        {patients.map((patient, index) => (
          <li key={index} style={styles.patientItem}>
            <div style={styles.patientName}>
              {patient.attributes.find(attr => attr.displayName === 'First name').value}
            </div>
            <div style={styles.patientName}>
              {patient.attributes.find(attr => attr.displayName === 'Last name').value}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  },
  patientList: {
    listStyle: 'none',
    padding: '0',
  },
  subheading: {
    marginBottom: '10px',
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '4px',
    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    justifyContent: 'space-between', // Updated
  },
  subheadingText: {
    fontSize: '18px',
    color: '#555',
    fontWeight: 'bold',
    flexBasis: 'calc(50% - 5px)', // Updated
    textAlign: 'left', // Updated
  },
  patientItem: {
    marginBottom: '10px',
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '4px',
    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    justifyContent: 'space-between',
  },
  patientName: {
    fontSize: '18px',
    color: '#333',
    flexBasis: 'calc(50% - 5px)', // Updated
    textAlign: 'left', // Updated
  },
};

export default PatientListPage;
