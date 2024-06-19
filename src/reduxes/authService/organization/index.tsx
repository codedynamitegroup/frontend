import { createSlice } from "@reduxjs/toolkit";
import { OrganizationEntity } from "models/authService/entity/organization";

interface InitialState {
  isLoading: boolean;
  organizations: {
    organizations: OrganizationEntity[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
  };
}

const initialState: InitialState = {
  isLoading: false,
  organizations: {
    organizations: [],
    currentPage: 0,
    totalItems: 0,
    totalPages: 0
  }
};

const organizationSlice = createSlice({
  name: "organization",
  initialState: initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload.isLoading;
    },
    setOrganizations: (state, action) => {
      state.organizations.organizations = action.payload.organizations;
      state.organizations.currentPage = action.payload.currentPage;
      state.organizations.totalItems = action.payload.totalItems;
      state.organizations.totalPages = action.payload.totalPages;
    },
    clearOrganizations: (state) => {
      state.organizations.organizations = [];
      state.organizations.currentPage = 0;
      state.organizations.totalItems = 0;
      state.organizations.totalPages = 0;
    }
  }
});

export const { setLoading, setOrganizations, clearOrganizations } = organizationSlice.actions;

export default organizationSlice.reducer;
