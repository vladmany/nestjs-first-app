import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { User } from '../src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../src/users/users.service';
import exp from 'constants';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let userService: UsersService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TypeOrmModule.forFeature([User])],
      providers: [UsersService],
    }).compile();

    userService = moduleFixture.get<UsersService>(UsersService);
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  /* Auth */
  let user_id;
  it('/auth/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'e2etestname',
        email: 'e2etest@gmail.com',
        password: 'e2e12313',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            name: 'e2etestname',
            email: 'e2etest@gmail.com',
            password: expect.any(String),
            id: expect.any(Number),
          }),
        );
        user_id = res.body.id;
      });
  });

  let access_token;
  it('/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'e2etest@gmail.com',
        password: 'e2e12313',
      })
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            access_token: expect.any(String),
          }),
        );
        access_token = res.body.access_token;
      });
  });

  /* Genres */
  it('/genres (GET)', () => {
    return request(app.getHttpServer())
      .get('/genres')
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(expect.any(Array));
        if (res.body.length > 0) {
          expect(res.body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(Number),
                name: expect.any(String),
              }),
            ]),
          );
        }
      });
  });

  let genre_id;
  it('/genres (POST)', () => {
    return request(app.getHttpServer())
      .post('/genres')
      .send({ name: 'e2etestgenre' })
      .set('Authorization', `Bearer ${access_token}`)
      .expect(201)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            name: 'e2etestgenre',
            id: expect.any(Number),
          }),
        );
        genre_id = res.body.id;
      });
  });

  it('/genres/:id (GET)', () => {
    return request(app.getHttpServer())
      .get(`/genres/${genre_id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            name: 'e2etestgenre',
            id: genre_id,
          }),
        );
      });
  });

  it('/genres/:id (PATCH)', () => {
    return request(app.getHttpServer())
      .patch(`/genres/${genre_id}`)
      .send({ name: 'e2etestgenre322' })
      .set('Authorization', 'Bearer ' + access_token)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            name: 'e2etestgenre322',
            id: genre_id,
          }),
        );
      });
  });

  /* Books */
  it('/books (GET)', () => {
    return request(app.getHttpServer())
      .get('/books')
      .expect((res) => {
        expect(res.body).toEqual(expect.any(Array));
        if (res.body.length > 0) {
          expect(res.body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(Number),
                title: expect.any(String),
                description: expect.any(String),
                user_id: expect.any(Number),
              }),
            ]),
          );
        }
      });
  });

  let book_id;
  it('/books (POST)', () => {
    return request(app.getHttpServer())
      .post('/books')
      .send({
        title: 'e2etesttitle',
        description: 'e2etestdesc',
        genres: [genre_id],
      })
      .set('Authorization', `Bearer ${access_token}`)
      .expect(201)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            title: 'e2etesttitle',
            description: 'e2etestdesc',
            genres: [{ id: genre_id }],
            user_id,
            id: expect.any(Number),
          }),
        );
        book_id = res.body.id;
      });
  });

  it('/books/:id (GET)', () => {
    return request(app.getHttpServer())
      .get(`/books/${book_id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            id: book_id,
            title: 'e2etesttitle',
            description: 'e2etestdesc',
            user_id,
          }),
        );
      });
  });

  it('/books (PATCH)', () => {
    return request(app.getHttpServer())
      .patch(`/books/${book_id}`)
      .send({
        title: 'e2etesttitle322',
        description: 'e2etestdesc223',
        genres: [genre_id],
      })
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            title: 'e2etesttitle322',
            description: 'e2etestdesc223',
            genres: [{ id: genre_id }],
            id: expect.any(Number),
          }),
        );
      });
  });

  it('/books/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/books/${book_id}`)
      .set('Authorization', 'Bearer ' + access_token)
      .expect(200)
      .expect('');
  });

  it('/genres/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/genres/${genre_id}`)
      .set('Authorization', 'Bearer ' + access_token)
      .expect(200)
      .expect('')
      .then(async () => {
        const users = await userService.find({
          where: { email: 'e2etest@gmail.com' },
        });
        await userService.remove(users);
      });
  });

  afterAll((done) => {
    app.close();
    done();
  });
});
