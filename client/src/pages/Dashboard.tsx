import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();

    const handleClick = async () => {
        try {
            const response = await fetch("http://localhost:3310/dashboard", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                credentials: "include",
            })
            if (response.status === 401) {
                navigate("/login");
            }
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error("Erreur lors de la récupération des données:", error);
        }
    }
    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={handleClick}>Click me</button>
        </div>
    );
}

export default Dashboard;