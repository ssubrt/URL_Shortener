import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Link } from '../../types';

interface LinkState {
  links: Link[];
  totalPages: number;
  currentPage: number;
  totalLinks: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: LinkState = {
  links: [],
  totalPages: 1,
  currentPage: 1,
  totalLinks: 0,
  isLoading: false,
  error: null,
};

export const fetchLinks = createAsyncThunk(
  'links/fetchLinks',
  async ({ page = 1, limit = 2, search = '' }: { page?: number; limit?: number; search?: string }, { getState }) => {
    const { auth } = getState() as { auth: { token: string } };
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/links?page=${page}&limit=${limit}&search=${search}`,
      {
        headers: { Authorization: `Bearer ${auth.token}` },
      }
    );
    return response.data;
  }
);

export const createLink = createAsyncThunk(
  'links/createLink',
  async (data: { originalUrl: string; alias?: string; expiresAt?: Date }, { getState }) => {
    const { auth } = getState() as { auth: { token: string } };
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/links`, data, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    return response.data;
  }
);

const linkSlice = createSlice({
  name: 'links',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLinks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLinks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.links = action.payload.links;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalLinks = action.payload.totalLinks;
      })
      .addCase(fetchLinks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch links';
      })
      .addCase(createLink.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createLink.fulfilled, (state, action) => {
        state.isLoading = false;
        state.links = [action.payload, ...state.links.slice(0, 9)];
        state.totalLinks += 1;
      })
      .addCase(createLink.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create link';
      });
  },
});

export default linkSlice.reducer;