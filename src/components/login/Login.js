import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { obtenerUsuario } from '../../services/supa';

export const Login = () => {

    const [data, setData] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    let iniciarSesion = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const usuarios = await obtenerUsuario();
            setData(usuarios);
        };
        fetchData();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Busca en data si existe un usuario con el username y password ingresados
        const userExists = data.some(usuario => usuario.nombre_usuario === username && usuario.contrasenha === password);
        if (userExists) {
            iniciarSesion('/Clientes'); // Si el usuario es válido, navega a '/Clientes'
        } else {
            alert('Usuario o contraseña incorrectos'); // O opcionalmente manejar este caso de otra manera
        }

    };

    return (
        <form onSubmit={handleSubmit}>

            <div>
                <label htmlFor="username">Usuario:</label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
            </div>

            <div>
                <label htmlFor="password">Contraseña:</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>

            <button type="submit">Iniciar sesión</button>
        </form>
    );

}