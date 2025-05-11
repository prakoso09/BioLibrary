// store/flora.js
import { create } from "zustand";
import axios from "axios";
// No need to import getToken() or setAuthToken() here anymore

export const useFloraStore = create((set) => ({
    flora: [],
    singleFlora: null,
    loadingSingleFlora: false,
    loading: false,
    error: null,

    setFlora: (flora) => set({ flora }),

    createFlora: async (floraData) => {
        set({ loading: true, error: null });
        try {
            // AXIOS WILL AUTOMATICALLY ATTACH THE AUTHORIZATION HEADER
            // if a token is set via setAuthToken(token) or loaded via loadAuthToken()
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/data/flora`, floraData);

            if (!response.data.success) {
                set({ loading: false });
                return { success: false, message: response.data.message || "Failed to create flora." };
            }

            set((state) => ({
                flora: [...state.flora, response.data.data],
                loading: false
            }));
            return { success: true, message: "Flora created successfully." };
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Failed to create flora."
            });
            console.error("Error creating flora:", error.response?.data || error.message);
            return { success: false, message: error.response?.data?.message || "Failed to create flora." };
        }
    },

    deleteFlora: async (id) => {
        set({ loading: true, error: null });
        try {
            // AXIOS WILL AUTOMATICALLY ATTACH THE AUTHORIZATION HEADER
            const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/data/flora/${id}`);
            if (!response.data.success) {
                set({ loading: false });
                return { success: false, message: response.data.message };
            }
            set((state) => ({
                flora: state.flora.filter((flora) => flora._id !== id),
                loading: false
            }));
            return { success: true, message: "Flora deleted successfully." };
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Failed to delete flora."
            });
            console.error("Error deleting flora:", error.response?.data || error.message);
            return { success: false, message: error.response?.data?.message || "Failed to delete flora." };
        }
    },

    updateFlora: async (id, updatedFlora) => {
        set({ loading: true, error: null });
        try {
            // AXIOS WILL AUTOMATICALLY ATTACH THE AUTHORIZATION HEADER
            const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/data/flora/${id}`, updatedFlora);
            if (!response.data.success) {
                set({ loading: false });
                return { success: false, message: response.data.message || "Failed to update flora."  };
            }
            set((state) => ({
                flora: state.flora.map((flora) =>
                    flora._id === id ? response.data.data : flora
                ),
                singleFlora: state.singleFlora && state.singleFlora._id === id
                    ? response.data.data
                    : state.singleFlora,
                loading: false
            }));
            return { success: true, message: "Flora updated successfully." };
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Failed to update flora."
            });
            console.error("Error updating flora:", error.response?.data || error.message);
            return { success: false, message: error.response?.data?.message || "Failed to update flora." };
        }
    },

    // fetchFlora and fetchFloraById typically do NOT require a token if they are public read operations.
    fetchFlora: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/data/flora`);
            set({ flora: response.data.data || [], loading: false });
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Failed to fetch flora."
            });
            console.error("Error fetching flora:", error.response?.data || error.message);
        }
    },

    fetchFloraById: async (id) => {
        set({ loadingSingleFlora: true, singleFlora: null, error: null });
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/data/flora/${id}`);
            if (response.data.success) {
                set({ singleFlora: response.data.data, loadingSingleFlora: false });
            } else {
                set({
                    singleFlora: null,
                    loadingSingleFlora: false,
                    error: response.data.message
                });
                console.error("Error fetching flora by ID:", response.data.message);
            }
        } catch (error) {
            set({
                singleFlora: null,
                loadingSingleFlora: false,
                error: error.response?.data?.message || "Failed to fetch flora by ID."
            });
            console.error("Error fetching flora by ID:", error.response?.data || error.message);
            return { success: false, message: error.response?.data?.message || "Failed to fetch flora by ID." };
        }
    }
}));