import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        autoLoadEntities: true, //instead of this we can use entity option
        synchronize: true,
        logging: true, // Enable query logging
        maxQueryExecutionTime: 2, // Log queries that take longer than 1000ms
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
