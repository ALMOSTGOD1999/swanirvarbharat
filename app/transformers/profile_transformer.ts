import { BaseTransformer } from '@adonisjs/core/transformers'
import type Profile from '#models/profile'

export default class ProfileTransformer extends BaseTransformer<Profile> {
  toObject() {
    return {
      ...this.pick(this.resource, [
        'id',
        'name',
        'biography',
        'location',
        'website',
        'company',
        'twitterUrl',
        'facebookUrl',
        'instagramUrl',
        'twitterUrl',
        'linkedinUrl',
        'youtubeUrl',
        'githubUrl',
        'blueskyUrl',
        'threadsUrl',
        'emailOnComment',
        'emailOnCommentReply',
        'emailOnAchievement',
        'emailOnNewDeviceLogin',
        'emailOnWatchlist',
        'emailOnMention',
      ]),
    }
  }
}
