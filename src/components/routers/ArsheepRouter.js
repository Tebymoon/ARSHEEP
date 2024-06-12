import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PageCliente } from '../pages/PageCliente';
import { Login } from '../login/Login';
import { Layout } from '../Layout/Layout';
import { PageOT } from '../OT/PageOT';
import { FormularioOT } from '../OT/FormularioOT';
import Calendario from '../OT/OTCalendario';
import { UserData } from '../pages/config_profile/UserData';
import UploadImage from '../OT/UploadImage';
import { Pconfiguracion } from '../pages/principal_pages/Pconfiguracion';
import GestionUsuarios from '../pages/gestiones/users/GestionUsuarios';
import'./ArsheepRouter.css'



export const ArsheepRouter = () => {
  return (
    <div className="content-browser">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Layout" element={<Layout />}>
            <Route path="PerfilUsuario" element={<UserData />} />
            <Route path="Clientes" element={<PageCliente />} />
            <Route path="OT" element={<PageOT />} />
            <Route path="Calendario" element={<Calendario />} />
            <Route path="Formulario" element={<FormularioOT />} />
            <Route path="gestiones" element={<Pconfiguracion />} />
            <Route path="gestiones/usuarios" element={<GestionUsuarios/> }/>
            <Route path="UploadImage" element={<UploadImage />} />
          </Route>
          <Route path="*" element={<><h1>Error 404</h1><strong>Esta Pagina no existe</strong></>} />
        </Routes>
    
      </BrowserRouter>
    </div>
  );
};