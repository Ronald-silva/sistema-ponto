"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectsRoutes = void 0;
const express_1 = require("express");
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = 'https://eyevyovjlxycqixkvxoz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5ZXZ5b3ZqbHh5Y3FpeGt2eG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3MDUxOTgsImV4cCI6MjA1NDI4MTE5OH0.TK0CCZ0f6QxiS8TPsowqI4p7GhdTn6hObN86XYqDt94';
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
exports.projectsRoutes = (0, express_1.Router)();
exports.projectsRoutes.get('/active', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('id, name')
            .eq('active', true)
            .order('name');
        if (error) {
            throw error;
        }
        return res.json(data);
    }
    catch (error) {
        console.error('Erro ao listar projetos:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
