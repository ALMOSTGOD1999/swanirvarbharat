import { Exception } from '@adonisjs/core/exceptions'
import { StatusCodes } from 'http-status-codes'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new NotImplementedException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class NotImplementedException extends Exception {
  constructor(message: string = 'The provided code path has not been implemented yet.') {
    super(message, { status: StatusCodes.INTERNAL_SERVER_ERROR, code: 'E_NOT_IMPLEMENTED' })
  }
}
