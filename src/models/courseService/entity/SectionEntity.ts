import { ModuleEntity } from "./ModuleEntity";

export interface SectionEntity {
  sectionId: string;
  name: string;
  visible: number;
  moodleId: number;
  modules: ModuleEntity[];
}
