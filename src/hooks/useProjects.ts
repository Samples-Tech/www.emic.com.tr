import { useState, useEffect } from 'react';
import { projectService, jobService, subscriptions, Project, Job } from '../lib/supabase';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await projectService.getProjects();
        if (error) {
          setError(error.message);
        } else {
          setProjects(data || []);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();

    // Subscribe to real-time changes
    const subscription = subscriptions.subscribeToProjects((payload) => {
      console.log('Projects change:', payload);
      fetchProjects(); // Refetch data on changes
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const createProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await projectService.createProject(project);
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      
      // Refresh the list
      const { data: updatedData } = await projectService.getProjects();
      setProjects(updatedData || []);
      
      return { success: true, data };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const { data, error } = await projectService.updateProject(id, updates);
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      
      // Update local state
      setProjects(prev => 
        prev.map(project => project.id === id ? { ...project, ...updates } : project)
      );
      
      return { success: true, data };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await projectService.deleteProject(id);
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      
      // Remove from local state
      setProjects(prev => prev.filter(project => project.id !== id));
      
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    refetch: async () => {
      setLoading(true);
      const { data, error } = await projectService.getProjects();
      if (error) {
        setError(error.message);
      } else {
        setProjects(data || []);
        setError(null);
      }
      setLoading(false);
    }
  };
}

export function useJobs(projectId?: string) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data, error } = projectId 
          ? await jobService.getJobsByProject(projectId)
          : await jobService.getJobs();
          
        if (error) {
          setError(error.message);
        } else {
          setJobs(data || []);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();

    // Subscribe to real-time changes
    const subscription = subscriptions.subscribeToJobs((payload) => {
      console.log('Jobs change:', payload);
      fetchJobs(); // Refetch data on changes
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [projectId]);

  const createJob = async (job: Omit<Job, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await jobService.createJob(job);
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      
      // Refresh the list
      const { data: updatedData } = projectId 
        ? await jobService.getJobsByProject(projectId)
        : await jobService.getJobs();
      setJobs(updatedData || []);
      
      return { success: true, data };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const updateJob = async (id: string, updates: Partial<Job>) => {
    try {
      const { data, error } = await jobService.updateJob(id, updates);
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      
      // Update local state
      setJobs(prev => 
        prev.map(job => job.id === id ? { ...job, ...updates } : job)
      );
      
      return { success: true, data };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const deleteJob = async (id: string) => {
    try {
      const { error } = await jobService.deleteJob(id);
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      
      // Remove from local state
      setJobs(prev => prev.filter(job => job.id !== id));
      
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  return {
    jobs,
    loading,
    error,
    createJob,
    updateJob,
    deleteJob,
    refetch: async () => {
      setLoading(true);
      const { data, error } = projectId 
        ? await jobService.getJobsByProject(projectId)
        : await jobService.getJobs();
      if (error) {
        setError(error.message);
      } else {
        setJobs(data || []);
        setError(null);
      }
      setLoading(false);
    }
  };
}