export const BodyTypes = {
  HTML: 'HTML',
  JSON: 'JSON',
}

export type BodyType = (typeof BodyTypes)[keyof typeof BodyTypes]
