export interface Developer {
  // name: string;
  // role: string;
  // company: string;
  about: string;
  code: string[];
  interests: string[];
  operatingSystems: string[];
  toolsUsed: string[];
  ides: string[];
}

export const developer: Developer = {
  // name: "Your Name",
  // role: "Your Role",
  // company: "Your Company",
  about: "Hey, I'm a passionate Software Developer with expertise in building modern web applications. \nI love creating innovative solutions and exploring cutting-edge technologies.",
  code: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "SvelteKit", "Next.js"],
  interests: [
    "Full-Stack Development",
    "UI/UX Design",
    "Machine Learning",
    "Open Source",
    "Mobile Development",
  ],
  operatingSystems: ["macOS", "Linux", "Windows"],
  toolsUsed: ["Docker", "Git", "VS Code", "Figma", "Postman", "AWS"],
  ides: ["VS Code", "Cursor", "WebStorm", "Sublime Text"],
};
