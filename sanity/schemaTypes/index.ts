import { type SchemaTypeDefinition } from 'sanity'
import property from './property'
import carLift from './carLift'
import user from './user'

export const schemaTypes = [
  property,
  carLift,
  user,
      
  // You can add your upcoming carLift or roommate schemas here later!
]
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [property, carLift, user],
}