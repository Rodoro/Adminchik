import { Module } from "@nestjs/common";
import { StaffController } from "./staff.controller";
import { StaffService } from "./staff.service";
import { LoggingModule } from "../logging/logging.module";

@Module({
    controllers: [StaffController],
    providers: [StaffService],
    imports: [LoggingModule]
})
export class StaffModule { }