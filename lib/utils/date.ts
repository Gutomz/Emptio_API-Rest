import * as moment from 'moment';

export function formatDate(date: moment.Moment): string {
  return date.toISOString(true);
}
