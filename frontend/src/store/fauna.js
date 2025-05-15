import { create } from "zustand";
import axios from "axios";

export const useFaunaStore = create((set) => ({
    fauna: [],
    singleFauna: null,
    loadingSingleFauna: false,
    loading: false,
    error: null,

    setFauna: (fauna) => set({ fauna }),

    createFauna: async (faunaData) => {
        set({ loading: true, error: null });
        try {
            // AXIOS akan secara otomatis menaruh header jika token di set via setAuthToken(token) atau loadAuthToken()
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/data/fauna`, faunaData);

            if (!response.data.success) {
                set({ loading: false });
                return { success: false, message: response.data.message || "Failed to create fauna." };
            }

            set((state) => ({
                fauna: [...state.fauna, response.data.data],
                loading: false
            }));
            return { success: true, message: "Fauna created successfully." };
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Failed to create fauna."
            });
            console.error("Error creating fauna:", error.response?.data || error.message);
            return { success: false, message: error.response?.data?.message || "Failed to create fauna." };
        }
    },

    deleteFauna: async (id) => {
        set({ loading: true, error: null });
        try {
             // AXIOS akan secara otomatis menaruh header jika token di set via setAuthToken(token) atau loadAuthToken()
            const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/data/fauna/${id}`);
            if (!response.data.success) {
                set({ loading: false });
                return { success: false, message: response.data.message };
            }
            set((state) => ({
                fauna: state.fauna.filter((fauna) => fauna._id !== id),
                loading: false
            }));
            return { success: true, message: "Fauna deleted successfully." };
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Failed to delete fauna."
            });
            console.error("Error deleting fauna:", error.response?.data || error.message);
            return { success: false, message: error.response?.data?.message || "Failed to delete fauna." };
        }
    },

    updateFauna: async (id, updatedFauna) => {
        set({ loading: true, error: null });
        try {
          // AXIOS akan secara otomatis menaruh header jika token di set via setAuthToken(token) atau loadAuthToken()
            const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/data/fauna/${id}`, updatedFauna);
            if (!response.data.success) {
                set({ loading: false });
                return { success: false, message: response.data.message || "Failed to update fauna." };
            }
            set((state) => ({
                fauna: state.fauna.map((fauna) =>
                    fauna._id === id ? response.data.data : fauna
                ),
                singleFauna: state.singleFauna && state.singleFauna._id === id
                    ? response.data.data
                    : state.singleFauna,
                loading: false
            }));
            return { success: true, message: "Fauna updated successfully." };
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Failed to update fauna."
            });
            console.error("Error updating fauna:", error.response?.data || error.message);
            return { success: false, message: error.response?.data?.message || "Failed to update fauna." };
        }
    },


    fetchFauna: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/data/fauna`);
            set({ fauna: response.data.data || [], loading: false });
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Failed to fetch fauna."
            });
            console.error("Error fetching fauna:", error.response?.data || error.message);
        }
    },

    fetchFaunaById: async (id) => {
        set({ loadingSingleFauna: true, singleFauna: null, error: null });
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/data/fauna/${id}`);
            if (response.data.success) {
                set({ singleFauna: response.data.data, loadingSingleFauna: false });
            } else {
                set({
                    singleFauna: null,
                    loadingSingleFauna: false,
                    error: response.data.message
                });
                console.error("Error fetching fauna by ID:", response.data.message);
            }
        } catch (error) {
            set({
                singleFauna: null,
                loadingSingleFauna: false,
                error: error.response?.data?.message || "Failed to fetch fauna by ID."
            });
            console.error("Error fetching fauna by ID:", error.response?.data || error.message);
            return { success: false, message: error.response?.data?.message || "Failed to fetch fauna by ID." };
        }
    }
}));