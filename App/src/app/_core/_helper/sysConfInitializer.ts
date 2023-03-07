import { SystemLanguageService } from "../_service/system-language.service";
import { SystemConfigService } from "../_service/systemconfig.service";

export function sysConfInitializer(sysConfService: SystemConfigService) {
    return () =>
    new Promise((resolve, reject) => {
      sysConfService.loadDataSystem().subscribe(data => {
        localStorage.setItem('sysConf', JSON.stringify(data));
      }).add(resolve);;
  });
}
