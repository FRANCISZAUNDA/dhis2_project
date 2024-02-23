import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MyApp from './keep'; // Import MyApp instead of FormPage
import FormPage from './FormPage';
import PatientListPage from './PatientList';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={MyApp} /> {/* Render MyApp component */}
        <Route path="/form-page" component={FormPage} /> {/* Add Route for FormPage */}
        <Route path="/patient-list/:orgUnitId/:programId" component={PatientListPage} />
      </Switch>
    </Router>
  );
};

export default App;
