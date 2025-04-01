import * as Mixpanel from 'mixpanel';
import { PostHog } from 'posthog-node';

const mixpanel = Mixpanel.init(process.env.MIXPANEL_TOKEN || '');

// const client = new PostHog(
//     process.env.POSTHOG_TOKEN,
//     { host: 'https://app.posthog.com' } 
// )

/**
 * Utility for tracking analytics events
 */
export const analyticsUtil = {
  /**
   * Track user events
   * @param userId User ID
   * @param eventName Name of the event
   * @param properties Additional properties for the event
   * @param postHogProperties PostHog specific properties
   */
  trackEvents: ({ userId, eventName, properties, postHogProperties }: { 
    userId: string, 
    eventName: string, 
    properties: any,
    postHogProperties?: any
  }) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(eventName);
      console.log(properties);
    } else {
      // Mixpanel
      properties.distinct_id = userId;
      mixpanel.track(eventName, properties);

      // PostHog
      // client.capture({
      //     distinctId: userId,
      //     event: eventName,
      //     properties: postHogProperties || properties,
      // });
    }
  },

  /**
   * Track user profile information
   * @param userId User ID
   * @param name User's name
   * @param emailId User's email
   * @param isSignUp Whether this is a sign-up event
   * @param avatar User's avatar URL
   */
  trackUser: ({ userId, name, emailId, isSignUp, avatar }: {
    userId: string,
    name: string,
    emailId: string,
    isSignUp: boolean,
    avatar?: string
  }) => {
    if (process.env.NODE_ENV !== 'production') {
      // Do nothing in non-production environments
    } else {
      if (isSignUp) {
        mixpanel.people.set(userId, {
          $created: (new Date()).toISOString(),
          $name: name,
          $email: emailId,
          $avatar: avatar
        });
      } else {
        mixpanel.people.set(userId, {
          $name: name,
          $email: emailId,
        });
      }
    }
  }
};

export default analyticsUtil; 