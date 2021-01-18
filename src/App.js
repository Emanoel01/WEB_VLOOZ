import {React} from "react";
import { Router } from "react-router-dom";
import history from "./history";
import Routes from "./routes";

import {AuthProvider} from "./Context/AuthContext";


function App() {

  return (
      <AuthProvider>
        <Router history={history}>
          <Routes/>
        </Router>
      </AuthProvider>
  );
}

export default App;
