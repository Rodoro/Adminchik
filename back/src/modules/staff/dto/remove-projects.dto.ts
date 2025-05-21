import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class RemoveProjectsDto {
    @IsString()
    @IsNotEmpty()
    staffId: string;

    @IsArray()
    @IsString({ each: true })
    projectIds: string[];
}