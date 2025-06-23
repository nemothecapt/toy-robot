import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Robot } from '../src/robot/entities/robot.entity';

describe('Robot API (e2e)', () => {
  let app: INestApplication<App>;
  let robotRepository: Repository<Robot>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Get repository and clear data before each test
    robotRepository = moduleFixture.get<Repository<Robot>>(getRepositoryToken(Robot));
    await robotRepository.clear();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/robot/current (GET) - should return empty object when no robot', () => {
    return request(app.getHttpServer())
      .get('/robot/current')
      .expect(200)
      .expect({});
  });

  it('/robot/move (POST) - should save robot state', () => {
    return request(app.getHttpServer())
      .post('/robot/move')
      .send({ x: 2, y: 3, direction: 'NORTH' })
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.x).toBe(2);
        expect(response.body.y).toBe(3);
        expect(response.body.direction).toBe('NORTH');
      });
  });

  it('/robot/current (GET) - should return robot after placement', async () => {
    // First, place a robot
    await request(app.getHttpServer())
      .post('/robot/move')
      .send({ x: 1, y: 1, direction: 'EAST' });

    // Then check current robot
    return request(app.getHttpServer())
      .get('/robot/current')
      .expect(200)
      .then((response) => {
        expect(response.body.x).toBe(1);
        expect(response.body.y).toBe(1);
        expect(response.body.direction).toBe('EAST');
      });
  });

  it('/robot/history (GET) - should return robot history', async () => {
    // Place multiple robot states
    await request(app.getHttpServer())
      .post('/robot/move')
      .send({ x: 0, y: 0, direction: 'NORTH' });

    await request(app.getHttpServer())
      .post('/robot/move')
      .send({ x: 0, y: 1, direction: 'NORTH' });

    // Check history
    return request(app.getHttpServer())
      .get('/robot/history')
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        // History should be ordered by ID descending (newest first)
        expect(response.body[0].y).toBe(1); // Latest move
      });
  });

  it('/robot/move (POST) - should validate input', () => {
    return request(app.getHttpServer())
      .post('/robot/move')
      .send({ x: 10, y: 10, direction: 'INVALID' }) // Invalid position and direction
      .expect(400); // Should return validation error
  });
});
