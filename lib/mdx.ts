import fs from "fs";
import path from "path";

/**
 * MDX Content Loading Utilities
 * Placeholder for future MDX file loading logic
 */

const CONTENT_DIR = path.join(process.cwd(), "content");
const PROJECTS_DIR = path.join(CONTENT_DIR, "projects");

export interface ProjectFrontmatter {
  title: string;
  description: string;
  date: string;
  tags: string[];
  featured?: boolean;
  image?: string;
  slug: string;
}

export interface Project {
  frontmatter: ProjectFrontmatter;
  content: string;
}

/**
 * Get all project slugs from the content/projects directory
 */
export async function getProjectSlugs(): Promise<string[]> {
  if (!fs.existsSync(PROJECTS_DIR)) {
    return [];
  }
  
  const files = fs.readdirSync(PROJECTS_DIR);
  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

/**
 * Get project data by slug
 * TODO: Implement full MDX parsing with frontmatter
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const filePath = path.join(PROJECTS_DIR, `${slug}.mdx`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const fileContents = fs.readFileSync(filePath, "utf8");
  
  // Placeholder: In production, use gray-matter or similar for frontmatter parsing
  return {
    frontmatter: {
      title: slug,
      description: "",
      date: new Date().toISOString(),
      tags: [],
      slug,
    },
    content: fileContents,
  };
}

/**
 * Get all projects with frontmatter
 */
export async function getAllProjects(): Promise<Project[]> {
  const slugs = await getProjectSlugs();
  const projects = await Promise.all(
    slugs.map((slug) => getProjectBySlug(slug))
  );
  
  return projects.filter((project): project is Project => project !== null);
}

/**
 * Get featured projects
 */
export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getAllProjects();
  return projects.filter((project) => project.frontmatter.featured);
}
