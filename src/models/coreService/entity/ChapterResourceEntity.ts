import { ResourceTypeEnum } from "../enum/ResourceTypeEnum";
import { ChapterQuestionEntity } from "./ChapterQuestionEntity";

export interface ChapterResourceEntity {
  chapterResourceId: string;
  no: number;
  chapterId: string;
  resourceType: ResourceTypeEnum;
  title: string;
  question: ChapterQuestionEntity;
  lessonHtml: string;
  youtubeVideoUrl: string;
  isCompleted: boolean;
}
