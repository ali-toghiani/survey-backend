import { HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map, Observable } from 'rxjs';
import { FolderModel } from '../models/folder.model';
import { environment } from 'src/environments/environment';
@Injectable()
export class SurveysHttpService {
    constructor(
        private http: HttpService
    ){}

    async getReportData(reportId: string){
        return new Promise(
          resolve => {
            const url = environment.baseApiUrl + 'surveys/' + reportId + '/general-reports/';
            this.http.get(url).subscribe(
              {
                next: (reportsRes) => {
                    if (reportsRes.status === HttpStatus.OK){
                        resolve(reportsRes.data);
                    }
                },
                error: (error) => resolve(error)
              }
            )
          }
        )
      }

  async getFolders(): Promise<any>{
    const url = environment.baseApiUrl + 'folders/';
    return await firstValueFrom(this.http.get(url, {params : {nested: true}}).pipe(map(item => item.data)));
  }  
}
