/* eslint-disable import/no-extraneous-dependencies */
import { setupServer } from 'msw/node';
import handlers from './handlers';

export default setupServer(...handlers);
