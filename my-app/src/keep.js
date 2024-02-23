import React, { useState, useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import { useHistory } from 'react-router-dom';

const MyApp = () => {
    const [expandedUnits, setExpandedUnits] = useState([]);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [patients, setPatients] = useState([]);
    const { loading, error, data } = useDataQuery({
        organisationUnits: {
            resource: 'organisationUnits',
            params: {
                paging: false,
                fields: 'id,displayName,children[id,displayName,children[id,displayName,children[id,displayName]]],programs[id,displayName]',
            },
        },
    });
    const history = useHistory();

    useEffect(() => {
        if (selectedUnit && selectedProgram) {
            fetchPatients();
        }
    }, [selectedUnit, selectedProgram]);

    const fetchPatients = async () => {
        console.log('Fetching patients...');
        try {
            const url = `https://debug.dhis2.org/analytics-dev/api/trackedEntityInstances.json?ou=${selectedUnit}&program=${selectedProgram}`;

            console.log('Fetching patients from URL:', url);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Error fetching patients: ${response.status} - ${response.statusText}`);
            }

            const { events } = await response.json();
            console.log('Fetched patients:', events);
            setPatients(events);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    const handleUnitClick = (unitId) => {
        if (!expandedUnits.includes(unitId)) {
            setExpandedUnits([...expandedUnits, unitId]);
        } else {
            setExpandedUnits(expandedUnits.filter((id) => id !== unitId));
        }
        setSelectedUnit(unitId);
        setSelectedProgram(null);
    };

    const handleProgramClick = (programId) => {
        setSelectedProgram(programId);
        history.push(`/patient-list/${selectedUnit}/${programId}`);
    };

    const renderUnits = (units, depth = 0) => {
        return (
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {units.map((unit) => (
                    <li key={unit.id} style={{ marginBottom: '10px' }}>
                        {unit.children && unit.children.length > 0 ? (
                            <div onClick={() => handleUnitClick(unit.id)} style={{ cursor: 'pointer', fontSize: '18px', color: '#333' }}>
                                {expandedUnits.includes(unit.id) ? '▼ ' : '► '}
                                {unit.displayName}
                            </div>
                        ) : (
                            <button onClick={() => setSelectedUnit(unit.id)} style={{ fontSize: '18px', color: '#333', backgroundColor: '#f0f0f0', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}>{unit.displayName}</button>
                        )}
                        {expandedUnits.includes(unit.id) && unit.children && (
                            <ul style={{ listStyle: 'none', paddingLeft: `${depth + 1}rem`, marginBottom: '10px' }}>
                                {renderUnits(unit.children, depth + 1)}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        );
    };

    if (error) return <span>Error: {error.message}</span>;
    if (loading) return <span>Loading...</span>;

    const selectedUnitData = data.organisationUnits.organisationUnits.find(unit => unit.id === selectedUnit);

    return (
        <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
            <div style={{ flex: '1', marginRight: '20px', maxHeight: '500px', overflowY: 'auto' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>Organization Units:</h2>
                {renderUnits(data.organisationUnits.organisationUnits)}
            </div>
            <div style={{ flex: '1' }}>
                {selectedUnitData && (
                    <div>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>Programs in {selectedUnitData.displayName}:</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {selectedUnitData.programs.map((program) => (
                                <button key={program.id} onClick={() => handleProgramClick(program.id)} style={{ fontSize: '16px', color: '#fff', backgroundColor: '#007bff', border: 'none', padding: '10px', borderRadius: '5px', marginRight: '10px', marginBottom: '10px', cursor: 'pointer' }}>{program.displayName}</button>
                            ))}
                        </div>
                    </div>
                )}
                {selectedProgram && (
                    <div>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>Patients Enrolled in {selectedProgram} for {selectedUnitData.displayName}:</h3>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {patients.map((patient, index) => (
                                <li key={index} style={{ fontSize: '16px', marginBottom: '10px' }}>
                                    {/* Display patient information here */}
                                    First Name: {patient.attributes.find(attr => attr.displayName === 'First name').value}, 
                                    Last Name: {patient.attributes.find(attr => attr.displayName === 'Last name').value}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyApp;
