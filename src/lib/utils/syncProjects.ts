import { useProjectStore } from '../stores/projectStore';
import type { FileSystem } from './fileSystem';

export function syncProjectsToFileSystem(fileSystem: FileSystem): void {
  // In Next.js, we'll call this from a component or hook that can access the store
  // For now, we'll create a placeholder that can be called later
  const syncProjects = (projects: unknown[]) => {
    if (typeof fileSystem.home === 'object' && fileSystem.home !== null) {
      if (!fileSystem.home.projects || typeof fileSystem.home.projects !== 'object') {
        (fileSystem.home as Record<string, unknown>).projects = {};
      }

      projects.forEach((project: any) => {
        ((fileSystem.home as Record<string, unknown>).projects as FileSystem)[project.id] = `
Name: ${project.name}
Type: ${project.type}
Description: ${project.shortDescription}
Technologies: ${project.technologies.join(', ')}
GitHub: ${project.githubUrl}
        `.trim();
      });
    }
  };

  // This will be called from React components
  (globalThis as Record<string, unknown>).syncProjectsToFileSystem = syncProjects;
}
