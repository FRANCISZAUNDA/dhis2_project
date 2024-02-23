import React, { useState, useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

const FormPage = () => {
    const [expandedUnits, setExpandedUnits] = useState([]);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [programs, setPrograms] = useState([]);
    const { loading, error, data } = useDataQuery({
        organisationUnits: {
            resource: 'organisationUnits',
            params: {
                paging: false,
                fields: 'id,displayName,children[id,displayName,children[id,displayName,children[id,displayName]]],programs[id,displayName]',
            },
        },
    });

    useEffect(() => {
        if (selectedUnit && !selectedProgram) {
            fetchPrograms(selectedUnit);
        }
    }, [selectedUnit, selectedProgram]);

    const fetchPrograms = async (unitId) => {
        try {
            const programsResponse = await fetch(`https://debug.dhis2.org/api/programs.json?fields=id,displayName&filter=organisationUnits.id:eq:${unitId}`);
            const { programs } = await programsResponse.json();
            setPrograms(programs);
        } catch (error) {
            console.error('Error fetching programs:', error);
        }
    };

    const handleUnitClick = async (unitId) => {
        if (!expandedUnits.includes(unitId)) {
            setExpandedUnits([...expandedUnits, unitId]);
        } else {
            setExpandedUnits(expandedUnits.filter((id) => id !== unitId));
        }

        const unit = data.organisationUnits.organisationUnits.find((unit) => unit.id === unitId);

        if (unit && unit.children && unit.children.length === 0) {
            setSelectedUnit(unitId);
            setSelectedProgram(null); // Reset selected program when unit changes
            fetchPrograms(unitId); // Fetch programs for the selected unit
        } else {
            setSelectedUnit(unitId);
            setSelectedProgram(null); // Reset selected program when unit changes
        }
    };

    const renderUnits = (units, depth = 0) => {
        return (
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {units.map((unit) => (
                    <li key={unit.id}>
                        {unit.children && unit.children.length > 0 ? (
                            <span onClick={() => handleUnitClick(unit.id)} style={{ cursor: 'pointer' }}>
                                {expandedUnits.includes(unit.id) ? '▼ ' : '► '}
                                {unit.displayName}
                            </span>
                        ) : (
                            <button onClick={() => handleUnitClick(unit.id)}>{unit.displayName}</button> // Change to button
                        )}
                        {expandedUnits.includes(unit.id) && unit.children && (
                            <ul style={{ listStyle: 'none', paddingLeft: `${depth + 1}rem` }}>
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

    return (
        <div>
            <h2>Organization Units:</h2>
            {renderUnits(data.organisationUnits.organisationUnits)}
            {selectedUnit && !selectedProgram && (
                <div>
                    <h3>Programs in {selectedUnit}:</h3>
                    <ul>
                        {programs.map((program) => (
                            <li key={program.id}>{program.displayName}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default FormPage;
