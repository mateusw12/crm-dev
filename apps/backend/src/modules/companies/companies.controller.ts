import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Res,
} from "@nestjs/common";
import { Response } from "express";
import { CompaniesService } from "./companies.service";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { User } from "../../common/decorators/current-user.decorator";
import { AuthenticatedUser } from "../../common/types";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Companies")
@Controller("companies")
@UseGuards(JwtAuthGuard, RolesGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  @ApiOperation({ summary: "Get all companies" })
  findAll(
    @User() user: AuthenticatedUser,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.companiesService.findAll(user, { search, page, limit });
  }

  @Get("cep/:cep")
  @ApiOperation({ summary: "Lookup address info by CEP" })
  lookupCep(@Param("cep") cep: string) {
    return this.companiesService.lookupCep(cep);
  }

  @Get("cnpj/:cnpj")
  @ApiOperation({ summary: "Lookup company info by CNPJ" })
  lookupCnpj(@Param("cnpj") cnpj: string) {
    return this.companiesService.lookupCnpj(cnpj);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get company details by ID" })
  findOne(@Param("id") id: string) {
    return this.companiesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: "Create a new company" })
  create(@Body() dto: CreateCompanyDto, @User() user: AuthenticatedUser) {
    return this.companiesService.create(dto, user);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update company details by ID" })
  update(
    @Param("id") id: string,
    @Body() dto: UpdateCompanyDto,
    @User() user: AuthenticatedUser,
  ) {
    return this.companiesService.update(id, dto, user);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a company by ID" })
  remove(@Param("id") id: string) {
    return this.companiesService.remove(id);
  }

  @Get("export/csv")
  @ApiOperation({ summary: "Export all companies as CSV" })
  async exportCsv(@User() user: AuthenticatedUser, @Res() res: Response) {
    const buffer = await this.companiesService.exportAll(user);
    res.set({
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="companies.csv"',
    });
    res.send(buffer);
  }
}
