import { type SchemaTypeDefinition } from 'sanity'
import property from './property'
import carLift from './carLift'
import user from './user'
import roommateListing from './roommateListing'
import post from './post'

export const schemaTypes = [
  property,
  carLift,
  user,
  roommateListing,
  post,
      
  // You can add your upcoming carLift or roommate schemas here later!
]
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [property, carLift, user, roommateListing, post],
}