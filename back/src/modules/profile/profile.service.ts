import { Staff } from "@/prisma/generated";
import { MinioService } from "@/src/core/minio/minio.service";
import { PrismaService } from "@/src/core/prisma/prisma.service";
import { Upload } from "@/src/shared/interfaces/upload.interface";
import { Injectable } from "@nestjs/common";
import * as sharp from 'sharp';

@Injectable()
export class ProfileService {
    constructor(
        private readonly storageService: MinioService,
        private readonly prismaService: PrismaService,
    ) { }

    public async changeAvatar(user: Staff, file: Upload) {
        const chunks: Buffer[] = [];
        for await (const chunk of file.createReadStream()) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        const fileName = `/avatars/${user.id + '/' + [...Array(3)].map(() => Math.random().toString(36)[2]).join('')}.webp`;

        if (file.filename && file.filename.endsWith('.gif')) {
            const processedBuffer = await sharp(buffer, { animated: true })
                .resize(512, 512)
                .webp()
                .toBuffer();
            await this.storageService.upload(processedBuffer, fileName, 'image/webp');
        } else {
            const processedBuffer = await sharp(buffer)
                .resize(512, 512)
                .webp()
                .toBuffer();
            await this.storageService.upload(processedBuffer, fileName, 'image/webp');
        }

        await this.prismaService.staff.update({
            where: { id: user.id },
            data: { avatar: fileName },
        });

        return true;
    }

    public async removeAvatar(user: Staff) {
        if (!user.avatar) {
            return;
        }

        await this.storageService.remove(user.avatar);

        await this.prismaService.staff.update({
            where: { id: user.id },
            data: { avatar: null },
        });

        return true;
    }

    public async getAvatarUrl(user: Staff) {
        if (!user.avatar) {
            return null;
        }
        return this.storageService.getUrl(user.avatar);
    }
}