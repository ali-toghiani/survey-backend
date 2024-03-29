import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Request } from '@nestjs/common';
import { SurveyService } from '../services/survey.service';
import { CreateSurvey } from '../dtos/survey.dto';
import { ResponseError, ResponseSuccess } from 'src/common/dto/response.dto';
import { Public } from 'src/common/decorators/public-route.decorator';
import { SurveysHttpService } from '../services/surveys-http.service';
import { map } from 'rxjs';

@Controller('survey')
export class SurveyController {

    constructor(
        private surveyService: SurveyService,
        private surveyHttpService: SurveysHttpService
        ){};

    @Public()
    @Get('/r/:reportId')
        async getReports(@Param('reportId') reportId) {
            try{
                
                const response = await this.surveyHttpService.getReportData(reportId);
                return new ResponseSuccess("SURVEY.GET.SUCCESS", response)
            }
            catch(error) {
                return new ResponseError("SURVEY.GET.ERROR", error)
            }
        }    

    @Get('/folders')
        async getFoldersNested(@Request() req: any) {
            try{

                const response = await this.surveyHttpService.getFolders(req.user)
                return new ResponseSuccess("FOLDERS.FETCH.SUCCESS", response);
            }
            catch(error) {
                return new ResponseError("FOLDERS.FETCH.ERROR", error)
            }
        }

    @Get('/:sid/details/:qid')
        async getSurveyQuestionDetails(@Param('sid') sid: string, @Param('qid') qid: string){
            try{
                var response =  await this.surveyHttpService.getQuestion(sid, qid);
                return new ResponseSuccess("SURVEY.QUESTION.GET.SUCCESS", response);
            }
            catch(error) {
                return new ResponseError("SURVEY.QUESTION.GET.ERROR", error)
            }
        }

    @Put('/:sid/details/:qid')
        async updateChartConfig(@Param('sid') sid: string, @Param('qid') qid: string, @Body() data: any){
            try{
                var response =  await this.surveyService.updateSurveyConfig(sid, qid, data);
                return new ResponseSuccess("CHART-CONFIG.UPDATE.SUCCESS", response);
                
            }
            catch(error) {
                return new ResponseError("CHART-CONFIG.UPDATE.ERROR", error)
            }
        }
    @Get('/:sid/preview')
        async getAllQuestions(@Param('sid') sid: string){
            try{
                var response =  await this.surveyHttpService.getQuestionsList(sid);
                return new ResponseSuccess("SURVEY.GET.SUCCESS", response)
            }
            catch(error) {
                return new ResponseError("SURVEY.GET.ERROR", error)
            }
        }

    @Post('/:sid/:path')
    async postQuestion(@Param('sid') sid: string, @Param('path') path: string, @Body() body: any){
        try{
            var response =  await this.surveyHttpService.postQuestion(sid, body, path);
            return new ResponseSuccess("SURVEY.POST_QUESTION.SUCCESS", response)
        }
        catch(error) {
            return new ResponseError("SURVEY.POST_QUESTION.ERROR", error)
        }
    }
    
    @Delete('/:sid/:qid')
    async deleteQuestion(@Param('sid') sid: string, @Param('qid') qid: string){
        try{
            var response =  await this.surveyHttpService.deleteQuestion(sid, qid);
            return new ResponseSuccess("SURVEY.POST_QUESTION.SUCCESS", response)
        }
        catch(error) {
            return new ResponseError("SURVEY.POST_QUESTION.ERROR", error)
        }
    }    

    @Get('/:sid')
        async getSurveyData(@Param('sid') sid: number){
            try{
                var response =  await this.surveyHttpService.getSurvey(sid);
                return new ResponseSuccess("SURVEY.GET.SUCCESS", response)
            }
            catch(error) {
                return new ResponseError("SURVEY.GET.ERROR", error)
            }
        }

    @Post('/initialize')
    async initializeSurvey(@Request() req: any, @Body() body: {folder: number, name: string}) {
        try{
        const response = await this.surveyService.initizliseSurvey(body, req.user.username);
        return new ResponseSuccess("MOD.INITIALIZE.SUCCESS", response);
        }
        catch(error) {
            return new ResponseError("MOD.INITIALIZE.ERROR", error)
        }
    }

    @Post('/get-charts/:sid')
        getCharts(@Param('sid') id){
            return this.surveyService.getCharts(id);
        }
}
