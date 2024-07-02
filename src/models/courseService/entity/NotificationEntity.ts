import { NotificationComponentTypeEnum } from "../enum/NotificationComponentTypeEnum";
import { NotificationEventTypeEnum } from "../enum/NotificationEventTypeEnum";

export interface NotificationEntity {
  notificationId: string;
  userFrom: {
    userId: string;
    roleMoodle: {
      id: {
        value: number;
      };
      name: string;
    };
    fullName: string;
    email: string;
  };
  userTo: {
    userId: string;
    roleMoodle: {
      id: {
        value: number;
      };
      name: string;
    };
    fullName: string;
    email: string;
  };
  subject: string;
  fullMessage: string;
  smallMessage: string;
  component: NotificationComponentTypeEnum;
  eventType: NotificationEventTypeEnum;
  contextUrl: string;
  contextUrlName: string;
  isRead: boolean;
  timeRead: string;
  createdAt: string;
  updatedAt: string;
}
