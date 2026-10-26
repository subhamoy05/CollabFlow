import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { organizationService } from '../services/organizationService';

const OrganizationContext = createContext();

export function OrganizationProvider({ children }) {
  const { user, organizations: authOrgs } = useAuth();
  const [organizations, setOrganizations] = useState([]);
  const [currentOrg, setCurrentOrg] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchOrganizations = useCallback(async () => {
    if (!user) {
      setOrganizations([]);
      setCurrentOrg(null);
      return;
    }

    try {
      setLoading(true);
      const res = await organizationService.getMyOrganizations();
      const orgs = res?.data || [];
      setOrganizations(orgs);

      // Select active org
      const savedOrgId = localStorage.getItem('collabflow_active_org');
      const matched = orgs.find(o => o._id === savedOrgId);
      if (matched) {
        setCurrentOrg(matched);
      } else if (orgs.length > 0) {
        setCurrentOrg(orgs[0]);
        localStorage.setItem('collabflow_active_org', orgs[0]._id);
      } else {
        setCurrentOrg(null);
      }
    } catch (err) {
      console.error('Failed to load organizations:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  const switchOrg = (orgId) => {
    const org = organizations.find(o => o._id === orgId);
    if (org) {
      setCurrentOrg(org);
      localStorage.setItem('collabflow_active_org', org._id);
    }
  };

  const createOrg = async (data) => {
    const res = await organizationService.createOrganization(data);
    const newOrg = res.data;
    setOrganizations(prev => [...prev, newOrg]);
    setCurrentOrg(newOrg);
    localStorage.setItem('collabflow_active_org', newOrg._id);
    return newOrg;
  };

  return (
    <OrganizationContext.Provider
      value={{
        organizations,
        currentOrg,
        loading,
        switchOrg,
        createOrg,
        refreshOrgs: fetchOrganizations
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
}
