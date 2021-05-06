import { BrowserRouter } from "react-router-dom";
import "./App.css";
import LayoutRouter from "./pages";
import { AuthProvider } from "./providers/AuthProvider";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LayoutRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
