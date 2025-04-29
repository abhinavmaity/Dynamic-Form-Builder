import { useState } from "react";
import Login from "./components/Login";
import DynamicForm from "./components/DynamicForm";
import { FormResponse } from "./types/form";

function App() {
  const [formData, setFormData] = useState<FormResponse | null>(null);

  const handleLoginSuccess = (data: FormResponse) => {
    setFormData(data);
  };

  return (
    <div className="container">
      {!formData ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <DynamicForm formData={formData} />
      )}
    </div>
  );
}

export default App;
