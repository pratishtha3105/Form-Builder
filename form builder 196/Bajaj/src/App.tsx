import { useState } from "react";
import Login from "./components/Login";
import DynamicForm from "./components/DynamicForm";
import { User } from "./types";

function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {!user ? (
          <Login onLoginSuccess={handleLoginSuccess} />
        ) : (
          <DynamicForm user={user} onLogout={handleLogout} />
        )}
      </div>
    </div>
  );
}

export default App;