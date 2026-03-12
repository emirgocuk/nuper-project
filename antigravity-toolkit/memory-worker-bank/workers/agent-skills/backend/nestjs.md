# nestjs
Source: https://antigravity.codes/agent-skills/backend/nestjs

## AI Worker Instructions
When the user requests functionality related to nestjs, follow these guidelines and utilize this context.

## Scraped Content

# nestjs
```
import { Module } from '@nestjs/common';@Module({  imports: [/* other modules */],  controllers: [/* controllers */],  providers: [/* providers */],  exports: [/* exported providers */],})export class FeatureModule {}
```
```
import { Module } from '@nestjs/common';@Module({  imports: [/* other modules */],  controllers: [/* controllers */],  providers: [/* providers */],  exports: [/* exported providers */],})export class FeatureModule {}
```
```
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';@Controller('users')export class UsersController {  @Get()  findAll(@Query() query: any) {    return 'This returns all users';  }  @Get(':id')  findOne(@Param('id') id: string) {    return This returns user #${id};  }  @Post()  create(@Body() createUserDto: any) {    return 'This creates a user';  }}
```
```
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';@Controller('users')export class UsersController {  @Get()  findAll(@Query() query: any) {    return 'This returns all users';  }  @Get(':id')  findOne(@Param('id') id: string) {    return This returns user #${id};  }  @Post()  create(@Body() createUserDto: any) {    return 'This creates a user';  }}
```
```
This returns user #${id}
```
```
import { Injectable } from '@nestjs/common';@Injectable()export class UsersService {  constructor(/* inject dependencies */) {}  findAll() {    return 'Users service logic';  }}
```
```
import { Injectable } from '@nestjs/common';@Injectable()export class UsersService {  constructor(/* inject dependencies */) {}  findAll() {    return 'Users service logic';  }}
```
```
# Using npmnpm install drizzle-orm pgnpm install -D drizzle-kit tsx @types/pg# Using yarnyarn add drizzle-orm pgyarn add -D drizzle-kit tsx @types/pg
```
```
# Using npmnpm install drizzle-orm pgnpm install -D drizzle-kit tsx @types/pg# Using yarnyarn add drizzle-orm pgyarn add -D drizzle-kit tsx @types/pg
```
```
// drizzle.config.tsimport 'dotenv/config';import { defineConfig } from 'drizzle-kit';export default defineConfig({  out: './drizzle',  schema: './src/db/schema.ts',  dialect: 'postgresql',  dbCredentials: {    url: process.env.DATABASE_URL!,  },});
```
```
// drizzle.config.tsimport 'dotenv/config';import { defineConfig } from 'drizzle-kit';export default defineConfig({  out: './drizzle',  schema: './src/db/schema.ts',  dialect: 'postgresql',  dbCredentials: {    url: process.env.DATABASE_URL!,  },});
```
```
// src/db/schema.tsimport { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';export const users = pgTable('users', {  id: serial('id').primaryKey(),  name: text('name').notNull(),  email: text('email').notNull().unique(),  createdAt: timestamp('created_at').defaultNow(),});
```
```
// src/db/schema.tsimport { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';export const users = pgTable('users', {  id: serial('id').primaryKey(),  name: text('name').notNull(),  email: text('email').notNull().unique(),  createdAt: timestamp('created_at').defaultNow(),});
```
```
// src/db/database.service.tsimport { Injectable } from '@nestjs/common';import { drizzle } from 'drizzle-orm/node-postgres';import { Pool } from 'pg';import * as schema from './schema';@Injectable()export class DatabaseService {  private db: ReturnType<typeof drizzle>;  constructor() {    const pool = new Pool({      connectionString: process.env.DATABASE_URL,    });    this.db = drizzle(pool, { schema });  }  get database() {    return this.db;  }}
```
```
// src/db/database.service.tsimport { Injectable } from '@nestjs/common';import { drizzle } from 'drizzle-orm/node-postgres';import { Pool } from 'pg';import * as schema from './schema';@Injectable()export class DatabaseService {  private db: ReturnType<typeof drizzle>;  constructor() {    const pool = new Pool({      connectionString: process.env.DATABASE_URL,    });    this.db = drizzle(pool, { schema });  }  get database() {    return this.db;  }}
```
```
// src/users/user.repository.tsimport { Injectable } from '@nestjs/common';import { DatabaseService } from '../db/database.service';import { users } from '../db/schema';import { eq } from 'drizzle-orm';@Injectable()export class UserRepository {  constructor(private db: DatabaseService) {}  async findAll() {    return this.db.database.select().from(users);  }  async findOne(id: number) {    const result = await this.db.database      .select()      .from(users)      .where(eq(users.id, id))      .limit(1);    return result[0];  }  async create(data: typeof users.$inferInsert) {    const result = await this.db.database      .insert(users)      .values(data)      .returning();    return result[0];  }  async update(id: number, data: Partial<typeof users.$inferInsert>) {    const result = await this.db.database      .update(users)      .set(data)      .where(eq(users.id, id))      .returning();    return result[0];  }  async remove(id: number) {    const result = await this.db.database      .delete(users)      .where(eq(users.id, id))      .returning();    return result[0];  }}
```
```
// src/users/user.repository.tsimport { Injectable } from '@nestjs/common';import { DatabaseService } from '../db/database.service';import { users } from '../db/schema';import { eq } from 'drizzle-orm';@Injectable()export class UserRepository {  constructor(private db: DatabaseService) {}  async findAll() {    return this.db.database.select().from(users);  }  async findOne(id: number) {    const result = await this.db.database      .select()      .from(users)      .where(eq(users.id, id))      .limit(1);    return result[0];  }  async create(data: typeof users.$inferInsert) {    const result = await this.db.database      .insert(users)      .values(data)      .returning();    return result[0];  }  async update(id: number, data: Partial<typeof users.$inferInsert>) {    const result = await this.db.database      .update(users)      .set(data)      .where(eq(users.id, id))      .returning();    return result[0];  }  async remove(id: number) {    const result = await this.db.database      .delete(users)      .where(eq(users.id, id))      .returning();    return result[0];  }}
```
```
// src/users/users.module.tsimport { Module } from '@nestjs/common';import { UsersController } from './users.controller';import { UsersService } from './users.service';import { UserRepository } from './user.repository';import { DatabaseService } from '../db/database.service';@Module({  controllers: [UsersController],  providers: [UsersService, UserRepository, DatabaseService],  exports: [UsersService],})export class UsersModule {}
```
```
// src/users/users.module.tsimport { Module } from '@nestjs/common';import { UsersController } from './users.controller';import { UsersService } from './users.service';import { UserRepository } from './user.repository';import { DatabaseService } from '../db/database.service';@Module({  controllers: [UsersController],  providers: [UsersService, UserRepository, DatabaseService],  exports: [UsersService],})export class UsersModule {}
```
```
// src/users/users.service.tsimport { Injectable } from '@nestjs/common';import { UserRepository } from './user.repository';import { User } from './interfaces/user.interface';@Injectable()export class UsersService {  constructor(private userRepository: UserRepository) {}  async findAll(): Promise<User[]> {    return this.userRepository.findAll();  }  async findOne(id: number): Promise<User> {    const user = await this.userRepository.findOne(id);    if (!user) {      throw new Error('User not found');    }    return user;  }  async create(userData: Partial<User>): Promise<User> {    return this.userRepository.create(userData);  }  async update(id: number, userData: Partial<User>): Promise<User> {    await this.findOne(id); // Verify user exists    return this.userRepository.update(id, userData);  }  async remove(id: number): Promise<User> {    await this.findOne(id); // Verify user exists    return this.userRepository.remove(id);  }}
```
```
// src/users/users.service.tsimport { Injectable } from '@nestjs/common';import { UserRepository } from './user.repository';import { User } from './interfaces/user.interface';@Injectable()export class UsersService {  constructor(private userRepository: UserRepository) {}  async findAll(): Promise<User[]> {    return this.userRepository.findAll();  }  async findOne(id: number): Promise<User> {    const user = await this.userRepository.findOne(id);    if (!user) {      throw new Error('User not found');    }    return user;  }  async create(userData: Partial<User>): Promise<User> {    return this.userRepository.create(userData);  }  async update(id: number, userData: Partial<User>): Promise<User> {    await this.findOne(id); // Verify user exists    return this.userRepository.update(id, userData);  }  async remove(id: number): Promise<User> {    await this.findOne(id); // Verify user exists    return this.userRepository.remove(id);  }}
```
```
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';import { JwtService } from '@nestjs/jwt';@Injectable()export class JwtAuthGuard implements CanActivate {  constructor(private jwtService: JwtService) {}  canActivate(context: ExecutionContext) {    const request = context.switchToHttp().getRequest();    const token = request.headers.authorization?.split(' ')[1];    if (!token) {      return false;    }    try {      const decoded = this.jwtService.verify(token);      request.user = decoded;      return true;    } catch {      return false;    }  }}
```
```
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';import { JwtService } from '@nestjs/jwt';@Injectable()export class JwtAuthGuard implements CanActivate {  constructor(private jwtService: JwtService) {}  canActivate(context: ExecutionContext) {    const request = context.switchToHttp().getRequest();    const token = request.headers.authorization?.split(' ')[1];    if (!token) {      return false;    }    try {      const decoded = this.jwtService.verify(token);      request.user = decoded;      return true;    } catch {      return false;    }  }}
```
```
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';import { Reflector } from '@nestjs/core';@Injectable()export class RolesGuard implements CanActivate {  constructor(private reflector: Reflector) {}  canActivate(context: ExecutionContext): boolean {    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());    if (!requiredRoles) {      return true;    }    const { user } = context.switchToHttp().getRequest();    return requiredRoles.some((role) => user.roles?.includes(role));  }}
```
```
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';import { Reflector } from '@nestjs/core';@Injectable()export class RolesGuard implements CanActivate {  constructor(private reflector: Reflector) {}  canActivate(context: ExecutionContext): boolean {    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());    if (!requiredRoles) {      return true;    }    const { user } = context.switchToHttp().getRequest();    return requiredRoles.some((role) => user.roles?.includes(role));  }}
```
```
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';import { validate } from 'class-validator';import { plainToClass } from 'class-transformer';@Injectable()export class ValidationPipe implements PipeTransform {  async transform(value: any, { metatype }: ArgumentMetadata) {    if (!metatype || !this.toValidate(metatype)) {      return value;    }    const object = plainToClass(metatype, value);    const errors = await validate(object);    if (errors.length > 0) {      throw new BadRequestException(errors);    }    return value;  }  private toValidate(metatype: Function): boolean {    const types: Function[] = [String, Boolean, Number, Array, Object];    return !types.includes(metatype);  }}
```
```
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';import { validate } from 'class-validator';import { plainToClass } from 'class-transformer';@Injectable()export class ValidationPipe implements PipeTransform {  async transform(value: any, { metatype }: ArgumentMetadata) {    if (!metatype || !this.toValidate(metatype)) {      return value;    }    const object = plainToClass(metatype, value);    const errors = await validate(object);    if (errors.length > 0) {      throw new BadRequestException(errors);    }    return value;  }  private toValidate(metatype: Function): boolean {    const types: Function[] = [String, Boolean, Number, Array, Object];    return !types.includes(metatype);  }}
```
```
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';import { Request, Response } from 'express';@Catch(HttpException)export class HttpExceptionFilter implements ExceptionFilter {  catch(exception: HttpException, host: ArgumentsHost) {    const ctx = host.switchToHttp();    const response = ctx.getResponse<Response>();    const request = ctx.getRequest<Request>();    const status = exception.getStatus();    response.status(status).json({      statusCode: status,      timestamp: new Date().toISOString(),      path: request.url,      message: exception.message,    });  }}
```
```
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';import { Request, Response } from 'express';@Catch(HttpException)export class HttpExceptionFilter implements ExceptionFilter {  catch(exception: HttpException, host: ArgumentsHost) {    const ctx = host.switchToHttp();    const response = ctx.getResponse<Response>();    const request = ctx.getRequest<Request>();    const status = exception.getStatus();    response.status(status).json({      statusCode: status,      timestamp: new Date().toISOString(),      path: request.url,      message: exception.message,    });  }}
```
```
import { Test, TestingModule } from '@nestjs/testing';import { UsersService } from './users.service';import { UserRepository } from './user.repository';describe('UsersService', () => {  let service: UsersService;  let repository: jest.Mocked<UserRepository>;  beforeEach(async () => {    const mockRepository = {      findAll: jest.fn(),      findOne: jest.fn(),      create: jest.fn(),      update: jest.fn(),      remove: jest.fn(),    } as any;    const module: TestingModule = await Test.createTestingModule({      providers: [        UsersService,        {          provide: UserRepository,          useValue: mockRepository,        },      ],    }).compile();    service = module.get<UsersService>(UsersService);    repository = module.get(UserRepository);  });  it('should return all users', async () => {    const expectedUsers = [{ id: 1, name: 'John', email: 'john@example.com' }];    repository.findAll.mockResolvedValue(expectedUsers);    const result = await service.findAll();    expect(result).toEqual(expectedUsers);    expect(repository.findAll).toHaveBeenCalled();  });});
```
```
import { Test, TestingModule } from '@nestjs/testing';import { UsersService } from './users.service';import { UserRepository } from './user.repository';describe('UsersService', () => {  let service: UsersService;  let repository: jest.Mocked<UserRepository>;  beforeEach(async () => {    const mockRepository = {      findAll: jest.fn(),      findOne: jest.fn(),      create: jest.fn(),      update: jest.fn(),      remove: jest.fn(),    } as any;    const module: TestingModule = await Test.createTestingModule({      providers: [        UsersService,        {          provide: UserRepository,          useValue: mockRepository,        },      ],    }).compile();    service = module.get<UsersService>(UsersService);    repository = module.get(UserRepository);  });  it('should return all users', async () => {    const expectedUsers = [{ id: 1, name: 'John', email: 'john@example.com' }];    repository.findAll.mockResolvedValue(expectedUsers);    const result = await service.findAll();    expect(result).toEqual(expectedUsers);    expect(repository.findAll).toHaveBeenCalled();  });});
```
```
import { Test, TestingModule } from '@nestjs/testing';import { INestApplication } from '@nestjs/common';import * as request from 'supertest';import { AppModule } from './../src/app.module';import { DatabaseService } from '../src/db/database.service';import { drizzle } from 'drizzle-orm/node-postgres';import { migrate } from 'drizzle-node-postgres/migrator';import { migrate as drizzleMigrate } from 'drizzle-orm/node-postgres/migrator';describe('UsersController (e2e)', () => {  let app: INestApplication;  let db: DatabaseService;  beforeAll(async () => {    const moduleFixture: TestingModule = await Test.createTestingModule({      imports: [AppModule],    }).compile();    app = moduleFixture.createNestApplication();    db = moduleFixture.get<DatabaseService>(DatabaseService);    // Run migrations    await drizzleMigrate(db.database, { migrationsFolder: './drizzle' });    await app.init();  });  afterAll(async () => {    await app.close();  });  beforeEach(async () => {    // Clean database    await db.database.delete(users).execute();  });  it('/users (POST)', () => {    const createUserDto = {      name: 'Test User',      email: 'test@example.com',    };    return request(app.getHttpServer())      .post('/users')      .send(createUserDto)      .expect(201)      .expect((res) => {        expect(res.body).toMatchObject(createUserDto);        expect(res.body).toHaveProperty('id');      });  });  it('/users (GET)', async () => {    // First create a user    await db.database.insert(users).values({      name: 'Test User',      email: 'test@example.com',    });    return request(app.getHttpServer())      .get('/users')      .expect(200)      .expect((res) => {        expect(Array.isArray(res.body)).toBe(true);        expect(res.body).toHaveLength(1);      });  });});
```
```
import { Test, TestingModule } from '@nestjs/testing';import { INestApplication } from '@nestjs/common';import * as request from 'supertest';import { AppModule } from './../src/app.module';import { DatabaseService } from '../src/db/database.service';import { drizzle } from 'drizzle-orm/node-postgres';import { migrate } from 'drizzle-node-postgres/migrator';import { migrate as drizzleMigrate } from 'drizzle-orm/node-postgres/migrator';describe('UsersController (e2e)', () => {  let app: INestApplication;  let db: DatabaseService;  beforeAll(async () => {    const moduleFixture: TestingModule = await Test.createTestingModule({      imports: [AppModule],    }).compile();    app = moduleFixture.createNestApplication();    db = moduleFixture.get<DatabaseService>(DatabaseService);    // Run migrations    await drizzleMigrate(db.database, { migrationsFolder: './drizzle' });    await app.init();  });  afterAll(async () => {    await app.close();  });  beforeEach(async () => {    // Clean database    await db.database.delete(users).execute();  });  it('/users (POST)', () => {    const createUserDto = {      name: 'Test User',      email: 'test@example.com',    };    return request(app.getHttpServer())      .post('/users')      .send(createUserDto)      .expect(201)      .expect((res) => {        expect(res.body).toMatchObject(createUserDto);        expect(res.body).toHaveProperty('id');      });  });  it('/users (GET)', async () => {    // First create a user    await db.database.insert(users).values({      name: 'Test User',      email: 'test@example.com',    });    return request(app.getHttpServer())      .get('/users')      .expect(200)      .expect((res) => {        expect(Array.isArray(res.body)).toBe(true);        expect(res.body).toHaveLength(1);      });  });});
```
```
npx drizzle-kit generate
```
```
npx drizzle-kit generate
```
```
// src/migrations/migration.service.tsimport { Injectable } from '@nestjs/common';import { migrate } from 'drizzle-orm/node-postgres/migrator';import { DatabaseService } from '../db/database.service';@Injectable()export class MigrationService {  constructor(private db: DatabaseService) {}  async runMigrations() {    try {      await migrate(this.db.database, { migrationsFolder: './drizzle' });      console.log('Migrations completed successfully');    } catch (error) {      console.error('Migration failed:', error);      throw error;    }  }}
```
```
// src/migrations/migration.service.tsimport { Injectable } from '@nestjs/common';import { migrate } from 'drizzle-orm/node-postgres/migrator';import { DatabaseService } from '../db/database.service';@Injectable()export class MigrationService {  constructor(private db: DatabaseService) {}  async runMigrations() {    try {      await migrate(this.db.database, { migrationsFolder: './drizzle' });      console.log('Migrations completed successfully');    } catch (error) {      console.error('Migration failed:', error);      throw error;    }  }}
```
```
// src/config/configuration.tsexport default () => ({  database: {    url: process.env.DATABASE_URL,  },  jwt: {    secret: process.env.JWT_SECRET || 'default-secret',    expiresIn: process.env.JWT_EXPIRES_IN || '24h',  },  app: {    port: parseInt(process.env.PORT, 10) || 3000,  },});
```
```
// src/config/configuration.tsexport default () => ({  database: {    url: process.env.DATABASE_URL,  },  jwt: {    secret: process.env.JWT_SECRET || 'default-secret',    expiresIn: process.env.JWT_EXPIRES_IN || '24h',  },  app: {    port: parseInt(process.env.PORT, 10) || 3000,  },});
```
```
import { createParamDecorator, ExecutionContext } from '@nestjs/common';export const User = createParamDecorator(  (data: string, ctx: ExecutionContext) => {    const request = ctx.switchToHttp().getRequest();    const user = request.user;    return data ? user?.[data] : user;  },);
```
```
import { createParamDecorator, ExecutionContext } from '@nestjs/common';export const User = createParamDecorator(  (data: string, ctx: ExecutionContext) => {    const request = ctx.switchToHttp().getRequest();    const user = request.user;    return data ? user?.[data] : user;  },);
```
```
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';import { Observable } from 'rxjs';import { tap } from 'rxjs/operators';@Injectable()export class LoggingInterceptor implements NestInterceptor {  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {    const request = context.switchToHttp().getRequest();    const { method, url } = request;    const now = Date.now();    console.log([${method}] ${url} - Start);    return next      .handle()      .pipe(        tap(() => console.log([${method}] ${url} - End ${Date.now() - now}ms)),      );  }}
```
```
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';import { Observable } from 'rxjs';import { tap } from 'rxjs/operators';@Injectable()export class LoggingInterceptor implements NestInterceptor {  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {    const request = context.switchToHttp().getRequest();    const { method, url } = request;    const now = Date.now();    console.log([${method}] ${url} - Start);    return next      .handle()      .pipe(        tap(() => console.log([${method}] ${url} - End ${Date.now() - now}ms)),      );  }}
```
```
[${method}] ${url} - Start
```
```
[${method}] ${url} - End ${Date.now() - now}ms
```
```
// main.tsimport { NestFactory } from '@nestjs/core';import { Transport, MicroserviceOptions } from '@nestjs/microservices';import { AppModule } from './app.module';async function bootstrap() {  const app = await NestFactory.createMicroservice<MicroserviceOptions>(    AppModule,    {      transport: Transport.TCP,      options: {        host: 'localhost',        port: 8877,      },    },  );  await app.listen();}bootstrap();
```
```
// main.tsimport { NestFactory } from '@nestjs/core';import { Transport, MicroserviceOptions } from '@nestjs/microservices';import { AppModule } from './app.module';async function bootstrap() {  const app = await NestFactory.createMicroservice<MicroserviceOptions>(    AppModule,    {      transport: Transport.TCP,      options: {        host: 'localhost',        port: 8877,      },    },  );  await app.listen();}bootstrap();
```
```
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';import { UserRepository } from './user.repository';@Resolver(() => User)export class UsersResolver {  constructor(private userRepository: UserRepository) {}  @Query(() => [User])  async users() {    return this.userRepository.findAll();  }  @Mutation(() => User)  async createUser(@Args('input') input: CreateUserInput) {    return this.userRepository.create(input);  }}
```
```
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';import { UserRepository } from './user.repository';@Resolver(() => User)export class UsersResolver {  constructor(private userRepository: UserRepository) {}  @Query(() => [User])  async users() {    return this.userRepository.findAll();  }  @Mutation(() => User)  async createUser(@Args('input') input: CreateUserInput) {    return this.userRepository.create(input);  }}
```
```
async transferFunds(fromId: number, toId: number, amount: number) {  return this.db.database.transaction(async (tx) => {    // Debit from account    await tx      .update(accounts)      .set({ balance: sql${accounts.balance} - ${amount} })      .where(eq(accounts.id, fromId));    // Credit to account    await tx      .update(accounts)      .set({ balance: sql${accounts.balance} + ${amount} })      .where(eq(accounts.id, toId));  });}
```
```
async transferFunds(fromId: number, toId: number, amount: number) {  return this.db.database.transaction(async (tx) => {    // Debit from account    await tx      .update(accounts)      .set({ balance: sql${accounts.balance} - ${amount} })      .where(eq(accounts.id, fromId));    // Credit to account    await tx      .update(accounts)      .set({ balance: sql${accounts.balance} + ${amount} })      .where(eq(accounts.id, toId));  });}
```
```
${accounts.balance} - ${amount}
```
```
${accounts.balance} + ${amount}
```
```
export const users = pgTable('users', {  id: serial('id').primaryKey(),  name: text('name').notNull(),  email: text('email').notNull().unique(),  deletedAt: timestamp('deleted_at'),});async softDelete(id: number) {  return this.db.database    .update(users)    .set({ deletedAt: new Date() })    .where(eq(users.id, id));}
```
```
export const users = pgTable('users', {  id: serial('id').primaryKey(),  name: text('name').notNull(),  email: text('email').notNull().unique(),  deletedAt: timestamp('deleted_at'),});async softDelete(id: number) {  return this.db.database    .update(users)    .set({ deletedAt: new Date() })    .where(eq(users.id, id));}
```
```
async getUsersWithPosts() {  return this.db.database    .select()    .from(users)    .leftJoin(posts, eq(posts.userId, users.id));}
```
```
async getUsersWithPosts() {  return this.db.database    .select()    .from(users)    .leftJoin(posts, eq(posts.userId, users.id));}
```
Unlock the full potential of backend development with this specialized agent skill focused on NestJS and Drizzle ORM. Designed for AI coding assistants, it provides immediate guidance on constructing scalable applications, from setting up core architecture to implementing advanced features like microservices and GraphQL. Whether you're integrating database patterns, configuring authentication, or writing comprehensive tests, this skill offers practical, code-driven insights. Elevate your development workflow, ensuring best practices and efficient solutions for modern web applications.

# When to Use This Skill
- •Building RESTful APIs or GraphQL servers with a structured, scalable framework.
- •Integrating a type-safe ORM like Drizzle for database interactions in your NestJS application.
- •Implementing robust authentication and authorization mechanisms for secure access control.
- •Designing and developing microservices architectures for distributed systems.

# Pro Tips
- 💡Always define clear Data Transfer Objects (DTOs) for incoming request bodies and query parameters to leverage NestJS's validation pipes and ensure type safety.
- 💡Utilize NestJS modules effectively to organize your application logic, enforce modularity, and promote separation of concerns, making your codebase more maintainable.
- 💡Combine Drizzle ORM's powerful type inference with NestJS services to create clean, testable data access layers that abstract database operations from your controllers.

