import { supabase } from './supabase';

export const getHistorialPagos = async (email) => {
    const { data, error } = await supabase
        .from('historial_pagos')
        .select('*')
        .eq('usuario_email', email);
    if (error) throw error;
    return data;
};

export const agendarCita = async (cita) => {
    const { data, error } = await supabase
        .from('citas')
        .insert([cita]);
    if (error) throw error;
    return data;
};