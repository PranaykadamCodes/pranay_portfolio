import { developer } from "./devInfo";
import { syncProjectsToFileSystem } from "./syncProjects";

export const fileSystem: FileSystem = {
  home: {
    about: `
${developer.about}

Programming Languages:
${developer.code.join(", ")}

Operating Systems:
${developer.operatingSystems.join(", ")}

Tools Used:
${developer.toolsUsed.join(", ")}

IDEs:
${developer.ides.join(", ")}
    `,
    projects: {},
    interests: `
${developer.interests.join("\n")}
    `,
  },
};

syncProjectsToFileSystem(fileSystem);

export interface FileSystem {
  [key: string]: string | FileSystem;
}
