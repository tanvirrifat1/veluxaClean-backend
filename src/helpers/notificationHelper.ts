import { INotification } from '../app/modules/Notification/Notification.interface';
import { Notification } from '../app/modules/Notification/Notification.model';

export const sendNotifications = async (data: any): Promise<INotification> => {
  const result = await Notification.create(data);

  //@ts-ignore
  const socketIo = global.io;

  if (data?.type === 'ADMIN') {
    socketIo.emit(`get-notification::${data?.type}`, result);
  } else {
    socketIo.emit(`get-notification::${data?.receiver}`, result);
  }

  return result;
};
