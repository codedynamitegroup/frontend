import { ModuleEntity } from "./ModuleEntity";

export interface SectionEntity {
  sectionId: string;
  name: string;
  visible: number;
  modules: ModuleEntity[];
}
