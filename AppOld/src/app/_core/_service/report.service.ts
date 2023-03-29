import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { UtilitiesService } from "herr-core";

@Injectable({
  providedIn: "root",
})
export class ReportService {
  base = environment.apiUrl;
  constructor(
    private http: HttpClient,
    private utilitiesService: UtilitiesService
  ) {}
  getReport(d1, d2, keyword, sort) {
    const query = `d1=${d1}&d2=${d2}&keyword=${keyword}&sort=${sort}`;
    return this.http.get(`${this.base}Report/getReport?${query}`, {});
  }
  getReports(
    d1,
    d2,
    keyword,
    sort,
    sort2,
    menuLink,
    farmGuid,
    makeOrderGuid1,
    makeOrderGuid2,
    roomGuid1,
    roomGuid2
  ) {
    const query = `d1=${d1}&d2=${d2}&keyword=${keyword}&sort=${sort}&sort2=${sort2}&menuLink=${menuLink}&farmGuid=${farmGuid}&makeOrderGuid1=${makeOrderGuid1}&makeOrderGuid2=${makeOrderGuid2}&roomGuid1=${roomGuid1}&roomGuid2=${roomGuid2}`;
    return this.http.get<any>(`${this.base}Report/getReports?${query}`, {});
  }
  getReportBase(d1, d2, keyword, sort, method) {
    const query = `d1=${d1}&d2=${d2}&keyword=${keyword}&sort=${sort}`;
    return this.http.get<any>(`${this.base}Report/${method}?${query}`, {});
  }
  getReportType(menuLink) {
    return this.http.get(
      `${this.base}Report/getReportType?menuLink=${menuLink}`,
      {}
    );
  }
  getReportChart(d1, d2, menuLink, lang) {
    const query = `d1=${d1}&d2=${d2}&menuLink=${menuLink}&lang=${lang}`;
    return this.http.get<any>(`${this.base}Report/GetReportChart?${query}`, {});
  }
  getReportChartSetting(menuLink, lang) {
    const query = `menuLink=${menuLink}&lang=${lang}`;
    return this.http.get<any>(
      `${this.base}Report/GetReportChartSetting?${query}`,
      {}
    );
  }
  exportExcel(request) {
    return this.http.post(`${this.base}Report/ExcelExport`, request, {
      responseType: "blob",
      observe: "response",
    });
  }
  excelExportPieChart(request) {
    return this.http.post(`${this.base}Report/ExcelExportPieChart`, request, {
      responseType: "blob",
      observe: "response",
    });
  }
  downloadODSFile(model) {
    const params = this.utilitiesService.ToFormData(model);
    return this.http.post(`${this.base}Files/ExcelExportToDOS`, params, {
      responseType: "blob",
      observe: "response",
    });
  }
  jsonExport(params) {
    return this.http.post(`${this.base}Report/jsonExport`, params, {
      responseType: "blob",
      observe: "response",
    });
  }
  downloadBlob(data, fileName, mimeType) {
    var blob, url;
    blob = new Blob([data], {
      type: mimeType
      
    });
    url = window.URL.createObjectURL(blob);
    var a;
    a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.style = "display: none";
    a.click();
    a.remove();
    setTimeout(function () {
      return window.URL.revokeObjectURL(url);
    }, 1000);
  }
}
