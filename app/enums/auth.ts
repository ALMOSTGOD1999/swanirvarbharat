export const AuthAttemptPurposes = {
  LOGIN: 'login',
  CHANGE_EMAIL: 'change_email',
}

export type AuthAttemptPurpose = (typeof AuthAttemptPurposes)[keyof typeof AuthAttemptPurposes]
