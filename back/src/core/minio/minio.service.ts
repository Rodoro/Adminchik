import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MinioService {
    private readonly minioClient: Minio.Client;
    private readonly bucketName: string;

    constructor(private readonly configService: ConfigService) {
        this.minioClient = new Minio.Client({
            endPoint: this.configService.get('MINIO_ENDPOINT') || 'localhost',
            port: parseInt(this.configService.get('MINIO_PORT') || '9000'),
            useSSL: this.configService.get('MINIO_USE_SSL') === 'true',
            accessKey: this.configService.get('MINIO_ACCESS_KEY'),
            secretKey: this.configService.get('MINIO_SECRET_KEY'),
        });

        this.bucketName = this.configService.get('MINIO_BUCKET_NAME') || 'profile-avatars';
    }

    async onModuleInit() {
        const exists = await this.minioClient.bucketExists(this.bucketName);
        if (!exists) {
            await this.minioClient.makeBucket(this.bucketName, 'us-east-1'); // region обязателен
            console.log(`Bucket "${this.bucketName}" created`);
        }
        const policy = {
            Version: '2012-10-17',
            Statement: [
                {
                    Effect: 'Allow',
                    Principal: { AWS: ['*'] },
                    Action: ['s3:GetObject'],
                    Resource: [`arn:aws:s3:::${this.bucketName}/*`],
                },
            ],
        };

        await this.minioClient.setBucketPolicy(this.bucketName, JSON.stringify(policy));
        console.log(`Bucket "${this.bucketName}" is now public`);
    }

    async upload(buffer: Buffer, fileName: string, mimetype: string) {
        await this.minioClient.putObject(
            this.bucketName,
            fileName,
            buffer,
            buffer.length,
            { 'Content-Type': mimetype },
        );
        return fileName;
    }

    async remove(fileName: string) {
        await this.minioClient.removeObject(this.bucketName, fileName);
    }

    async getUrl(fileName: string) {
        return this.minioClient.presignedUrl('GET', this.bucketName, fileName);
    }
}