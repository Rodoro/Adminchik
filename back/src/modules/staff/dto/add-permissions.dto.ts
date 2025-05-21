import { Permission } from "@/src/shared/types/permission.types";
import { IsArray, IsEnum, IsNotEmpty, IsString } from "class-validator";

export class AddPermissionsDto {
    @IsString()
    @IsNotEmpty()
    staffId: string;

    @IsArray()
    @IsEnum(Permission, { each: true })
    permissions: Permission[];
}