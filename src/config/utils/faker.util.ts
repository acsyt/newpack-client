import { Faker, es, es_MX, en } from '@faker-js/faker';

export const customFaker = new Faker({ locale: [es, es_MX, en] });
