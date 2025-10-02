import { create } from 'zustand';
import type { ProjectData } from '../types/projectType';

const initialProjects: ProjectData[] = [
  {
    id: 'Clave',
    name: 'Clave',
    icon: 'wails',
    shortDescription: 'A lightweight cross-platform desktop authenticator app',
    githubUrl: 'https://github.com/developer/clave',
    readmeUrl: 'https://raw.githubusercontent.com/developer/clave/main/README.md',
    technologies: ['Go','Wails','Svelte', 'TypeScript', 'TailwindCSS'],
    type: 'application'
  },
  {
    id: 'macOS-Themed-Portfolio',
    name: 'macOS Themed Portfolio',
    icon: 'svelte',
    shortDescription: 'An interactive portfolio website inspired by the macOS interface, built with SvelteKit, TailwindCSS, and TypeScript.',
    githubUrl: 'https://github.com/developer/macOS-Themed-Portfolio',
    readmeUrl: 'https://raw.githubusercontent.com/developer/macOS-Themed-Portfolio/main/README.md',
    technologies: ['Svelte', 'TypeScript', 'TailwindCSS'],
    type: 'application'
  },
  {
    id: 'go-service',
    name: 'Go Service',
    icon: 'go',
    shortDescription: 'A minimal boilerplate for building cross-platform system services in Go',
    githubUrl: 'https://github.com/developer/go-service',
    readmeUrl: 'https://raw.githubusercontent.com/developer/go-service/main/README.md',
    technologies: ['Go'],
    type: 'library'
  },
  {
    id: 'go-touchid',
    name: 'Go TouchID',
    icon: 'go',
    shortDescription: 'A simple Go Library for Touch ID authentication on darwin.',
    githubUrl: 'https://github.com/developer/go-touchid',
    readmeUrl: 'https://raw.githubusercontent.com/developer/go-touchid/main/README.md',
    technologies: ['Go', 'macOS', 'TouchID'],
    type: 'library'
  },
  {
    id: 'go-version-compare',
    name: 'Go Version Compare',
    icon: 'go',
    shortDescription: 'Go Library for Version Comparison',
    githubUrl: 'https://github.com/developer/versioncompare',
    readmeUrl: 'https://raw.githubusercontent.com/developer/versioncompare/main/README.md',
    technologies: ['Go'],
    type: 'library'
  },
];

interface ProjectState {
  projects: ProjectData[];
  setProjects: (projects: ProjectData[]) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: initialProjects,
  setProjects: (projects) => set({ projects }),
}));
