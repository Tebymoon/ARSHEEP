import supabase from '../database/connection.js';

// Crear una visita técnica
export const createVisitaTecnica = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('VISITA_TECNICA')
            .insert([req.body]);

        if (error) throw error;

        return res.status(201).json(data);
    } catch (error) {
        console.error('Error al crear la visita técnica:', error.message);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener todas las visitas técnicas
export const getVisitasTecnicas = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('VISITA_TECNICA')
            .select(`
                id_vt,
                desc_vt,
                desc_problema_vt,
                analisis_vt,
                recomendacion_vt,
                beneficio_vt,
                fec_creacion_vt,
                fec_programacion_vt,
                fec_realizacion_vt,
                id_establecimiento,
                ESTABLECIMIENTO(
                    id_establecimiento,
                    nombre_establecimiento
                ),
                id_empleado,
                EMPLEADO(
                    id_empleado,
                    pnombre,
                    snombre,
                    apaterno,
                    amaterno,
                    numero_contacto,
                    correo
                ),
                id_estado_vt,
                ESTADO_VISITA_TECNICA(
                    id_estado_vt,
                    desc_estado_vt
                ),
                id_tipo_mantenimiento,
                TIPO_MANTENIMIENTO(
                    id_tipo_mantenimiento,
                    desc_tipo_mantenimiento
                )
                `)
            .order('id_tipo_mantenimiento', { ascending: true })
            .order('fec_programacion_vt', { ascending: true })
            .order('fec_creacion_vt', { ascending: false })

        if (error) return res.status(400).json({ error });
        return res.json(data);
    } catch (error) {
        console.error('Error al obtener las visitas técnicas:', error.message);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener una visita técnica por ID
export const getVisitaTecnicaById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ error: 'ID de visita técnica es requerido' });

        const { data, error } = await supabase
            .from('VISITA_TECNICA')
            .select('*')
            .eq('id_vt', id)
            .single();

        if (error) return res.status(400).json({ error });
        if (!data) return res.status(404).json({ error: 'Visita técnica no encontrada' });

        return res.json(data);
    } catch (error) {
        console.error('Error al obtener la visita técnica por ID:', error.message);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Actualizar una visita técnica
export const updateVisitaTecnica = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ error: 'ID de visita técnica es requerido' });

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: 'Datos de visita técnica son requeridos' });
        }

        const { data, error } = await supabase
            .from('VISITA_TECNICA')
            .update(req.body)
            .eq('id_vt', id)
            .select(`
                id_vt,
                id_empleado,
                EMPLEADO(
                    correo,
                    pnombre
                )
            `);

        if (error) {
            console.error('Error en la consulta a la base de datos:', error);
            return res.status(400).json({ error: error.message });
        }
        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'Visita técnica no encontrada' });
        }

        return res.json(data[0]);
    } catch (error) {
        console.error('Error al actualizar la visita técnica:', error.message);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Eliminar una visita técnica
export const deleteVisitaTecnica = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ error: 'ID de visita técnica es requerido' });

        const { data, error } = await supabase
            .from('VISITA_TECNICA')
            .delete()
            .eq('id_vt', id);

        if (error) return res.status(400).json({ error });
        if (!data) return res.status(404).json({ error: 'Visita técnica no encontrada' });

        return res.status(204).send();
    } catch (error) {
        console.error('Error al eliminar la visita técnica:', error.message);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const uploadPdf = async (req, res) => {
    const { id_vt } = req.body;

    if (!req.file) {
        return res.status(400).json({ error: 'No se ha proporcionado ningún archivo PDF' });
    }
    const file = req.file;

    const fileName = `${id_vt}_presupuesto_visita_tecnica_${Date.now()}.pdf`;
    const newPdfUrl = `https://niqxbeaxtqofvrboxnzb.supabase.co/storage/v1/object/public/presupuesto_vt/${fileName}`;

    try {
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('presupuesto_vt')
            .upload(fileName, file.buffer, {
                contentType: 'application/pdf'
            });

        if (uploadError) {
            console.error('Error al subir el archivo PDF a Supabase', uploadError);
            return res.status(500).json({ error: 'Error al subir el archivo PDF a Supabase' });
        }

        const { error: insertError } = await supabase
            .from('PRESUPUESTO_VISITA_TECNICA')
            .insert({ url_presupuesto_vt: newPdfUrl, id_vt: id_vt ,desc_presupuesto_vt:fileName });

        if (insertError) {
            console.error('Error al insertar la URL del PDF en la base de datos', insertError);
            throw new Error('Error al insertar la URL del PDF en la base de datos');
        }

        return res.json({ message: 'Archivo PDF subido y URL actualizada correctamente', newPdfUrl });
    } catch (error) {
        console.error('Error en el proceso de subida de archivo PDF', error);
        return res.status(500).json({ error: error.message });
    }
};

