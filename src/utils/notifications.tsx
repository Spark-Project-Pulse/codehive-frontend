// src/utils/notifications.ts

import { Badge } from '@/components/ui/badge'
import { type Notification } from '@/types/Notifications'

interface NotificationContent {
  message: JSX.Element | string
  link: string
}

export function generateNotificationContent(
  notification: Notification
): NotificationContent {
  let message: JSX.Element | string = 'You have a notification'
  let link = '/notifications' // default link if specific link is not available

  switch (notification.notification_type) {
    case 'question_answered':
      link = notification.question
        ? `/questions/${notification.question}`
        : link
      message = (
        <>
          Your question{' '}
          <a href={link}>
            <Badge>{notification.question_info?.title ?? 'n/a'}</Badge>
          </a>{' '}
          received an answer.
        </>
      )
      break

    case 'answer_commented':
      message = `Your answer to "${notification.question_info?.title ?? 'a question'}" received a comment.`
      link = notification.answer ? `/answers/${notification.answer}` : link
      break

    case 'question_upvoted':
      message = `Your question "${notification.question_info?.title ?? 'a question'}" was upvoted!`
      link = notification.question
        ? `/questions/${notification.question}`
        : link
      break

    case 'answer_accepted':
      message = `Your answer to "${notification.question_info?.title ?? 'a question'}" was accepted!`
      link = notification.answer ? `/answers/${notification.answer}` : link
      break

    case 'mention':
      message = `You were mentioned in a comment.`
      link = notification.comment ? `/comments/${notification.comment}` : link
      break

    case 'hive_accepted':
      link = notification.hive_info?.title
        ? `/hives/${notification.hive_info?.title}`
        : link
      message = (
        <>
          Your hive request for{' '}
          <a href={link}>
            <Badge>{notification.hive_info?.title ?? 'n/a'}</Badge>
          </a>{' '}
          was accepted!
        </>
      )
      break

    case 'hive_rejected':
      message = `Your hive request for "${notification.hive_title ?? 'a hive'}" was rejected.`
      break

    default:
      message = 'You have a new notification.'
      link = '/notifications'
  }

  return { message, link }
}
