import {
	type ArgumentMetadata,
	BadRequestException,
	Injectable,
	type PipeTransform
} from '@nestjs/common'

@Injectable()
export class FileValidationPipe implements PipeTransform {
	async transform(file: Express.Multer.File, metadata: ArgumentMetadata) {
		if (!file) {
			throw new BadRequestException('Файл не загружен');
		}

		const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
		if (!allowedTypes.includes(file.mimetype)) {
			throw new BadRequestException('Неподдерживаемый формат файла');
		}

		if (file.size > 10 * 1024 * 1024) {
			throw new BadRequestException('Размер файла превышает 10 МБ');
		}

		return file;
	}
}
